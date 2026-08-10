#!/usr/bin/env python3
"""
Plumbify AI Sales Team - Agent 2: Personalized Outreach & GHL Note Sync
This script fetches pending contacts from GoHighLevel CRM, scrapes their websites,
generates a custom-crafted cold email or SMS script using Gemini AI,
and saves the result as a Note on the contact profile in GHL, updating their tags.
This version integrates Semantica AGI to track outreach context as a Knowledge Graph.
"""

import os
import sys
import json
import urllib.request
import urllib.parse
import argparse
import re
import urllib.error

# ===============================
# [Semantica Integration]
# Import Semantica core framework
# ===============================
import sys
# Force python to find semantica by appending its explicit path to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../semantica')))

try:
    from semantica.core import Semantica
    has_semantica = True
except Exception as e:
    has_semantica = False
    print(f"[-] Semantica import failed: {e}")
    Semantica = None

# Load Next.js local environment variables
def load_env(env_path):
    env_vars = {}
    if not os.path.exists(env_path):
        return env_vars
    try:
        with open(env_path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith("#"):
                    continue
                if "=" in line:
                    key, val = line.split("=", 1)
                    key = key.strip()
                    val = val.strip().strip('"').strip("'")
                    env_vars[key] = val
    except Exception as e:
        print(f"[-] Warning: Failed to read .env.local file: {e}", file=sys.stderr)
    return env_vars

# Fetch contacts from GoHighLevel
def fetch_ghl_contacts(token, location_id):
    print("[*] Fetching all contacts list from GoHighLevel (paginated)...")
    contacts = []
    url = f"https://services.leadconnectorhq.com/contacts/?locationId={location_id}&limit=100"
    headers = {
        "Authorization": f"Bearer {token}",
        "Version": "2021-07-28",
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
    
    while url:
        req = urllib.request.Request(url, headers=headers, method="GET")
        try:
            with urllib.request.urlopen(req) as res:
                data = json.loads(res.read().decode("utf-8"))
                page_contacts = data.get("contacts", [])
                contacts.extend(page_contacts)
                
                meta = data.get("meta", {})
                url = meta.get("nextPageUrl")
                if not page_contacts:
                    break
        except Exception as e:
            print(f"[-] Failed to fetch contacts from GHL: {e}", file=sys.stderr)
            break
            
    print(f"[+] Successfully fetched {len(contacts)} contacts from GoHighLevel.")
    return contacts

# Dynamic search fallback: Find website URL from company name via DuckDuckGo
def find_company_website(company_name, city):
    if not company_name:
        return None
    query = f"{company_name} {city or ''} plumbing service website"
    print(f"[*] Website missing in GHL. Searching website for '{company_name}' in '{city or ''}'...")
    url = f"https://html.duckduckgo.com/html/?q={urllib.parse.quote_plus(query)}"
    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }
    )
    try:
        with urllib.request.urlopen(req) as res:
            html = res.read().decode("utf-8")
        links = re.findall(r'class="result__url"[^>]*href="([^"]+)"', html)
        for l in links:
            if "uddg=" in l:
                parsed = urllib.parse.urlparse(l)
                queries = urllib.parse.parse_qs(parsed.query)
                if "uddg" in queries:
                    l = queries["uddg"][0]
            exclusions = ["duckduckgo.com", "google.com", "facebook.com", "instagram.com", 
                          "youtube.com", "wikipedia.org", "yelp.com", "yellowpages.com", 
                          "angi.com", "homeadvisor.com", "bbb.org", "linkedin.com"]
            if not any(domain in l.lower() for domain in exclusions):
                print(f"[+] Found website: {l}")
                return l
        return None
    except Exception as e:
        print(f"[-] Website search failed: {e}", file=sys.stderr)
        return None

# Fetch webpage markdown using Jina Reader (Agent-Reach)
def fetch_webpage_markdown(target_url):
    print(f"[*] Scraping website: {target_url}...")
    jina_url = f"https://r.jina.ai/{target_url}"
    req = urllib.request.Request(
        jina_url,
        headers={
            "User-Agent": "Mozilla/5.0",
            "X-Return-Format": "markdown"
        }
    )
    try:
        with urllib.request.urlopen(req, timeout=15) as res:
            return res.read().decode("utf-8")
    except Exception as e:
        print(f"[-] Failed to scrape website: {e}", file=sys.stderr)
        return ""

# Generate personalized outreach text using Gemini API
def generate_outreach_content(contact, website_markdown, mode, api_key, reputation_context=""):
    name = f"{contact.get('firstName', '')} {contact.get('lastName', '')}".strip() or "Business Owner"
    company = contact.get("companyName") or "your company"
    city = contact.get("city") or ""
    state = contact.get("state") or ""

    print(f"[*] Generating customized {mode} outreach copy for {company}...")

    # Truncate website text to save context window tokens
    site_text = website_markdown[:8000] if website_markdown else ""

    prompt = (
        f"You are a highly converting B2B SaaS Sales Development Representative (SDR) representing Plumbify (https://plumbify.net).\n"
        "Plumbify is an AI-first operating system for local plumbing/HVAC businesses that solves core operational leakages:\n"
        "1. Missed-Call Text-Back: Automatically texts back missed calls in <30 seconds so leads don't call Google Maps competitors.\n"
        "2. 24/7 AI Receptionist: A floating website widget that pre-qualifies customers and books jobs directly into their calendar.\n"
        "3. Auto Google Reviews: Instantly requests reviews upon job completion to boost local SEO rankings.\n\n"
        f"Your task is to write a highly customized, natural {mode} outreach copy targeting:\n"
        f"- Contact Person: {name}\n"
        f"- Company Name: {company}\n"
        f"- Business Location: {city}, {state}\n\n"
    )

    if site_text:
        prompt += (
            f"Below is the text crawled from their website:\n"
            f"\"\"\"\n{site_text}\n\"\"\"\n\n"
        )

    if reputation_context:
        prompt += (
            f"Below are the reputation signals, reviews count, ratings, and founder info discovered for this business:\n"
            f"\"\"\"\n{reputation_context}\n\"\"\"\n\n"
        )

    prompt += f"Guidelines for {mode}:\n"

    if mode == "email":
        prompt += (
            "- Subject Line: Must be punchy, direct, and mention their company name or city (no clickbait).\n"
            "- Email Body: Must be concise (under 150 words), conversational, friendly, and professional.\n"
            "- Personalization (CRITICAL): If the reputation context contains details like their Google/Birdeye review count (e.g. 287 reviews), average rating (e.g. 5.0 stars), founder/owner/team names (e.g. Terry Stokes, Tim), or distinct services, you MUST weave these elements naturally into the opening or second sentence. Show them you did deep research. Connect their outstanding local reputation with the critical need to NOT miss phone calls (since high reputation drives high call volume, and missed calls are leaving money on the table).\n"
            "- Call-to-Action: A low-friction ask (e.g., asking if they are open to a quick 10-minute call next week).\n"
            "- Sign-off: 'Leon, Founder at Plumbify'.\n"
            "- Do NOT include any intro or markdown tags like ```email. Output ONLY the raw subject and email body."
        )
    else: # SMS
        prompt += (
            "- Character Limit: Must be under 160 characters.\n"
            "- Style: Extremely direct, friendly, and conversational.\n"
            "- Sign-off: Must end with 'Leon @ Plumbify' (do NOT use placeholders like '[Your Name]' or '[Leon]').\n"
            "- Example: 'Hey John, saw Texas Elite Plumbing online. Quick question: do you guys text back missed calls automatically, or is that manual? - Leon @ Plumbify'\n"
            "- Do NOT include any intro or formatting tags. Output ONLY the raw text message."
        )

    api_url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}"
    payload = {
        "contents": [{
            "parts": [{
                "text": prompt
            }]
        }]
    }

    req = urllib.request.Request(
        api_url,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST"
    )

    try:
        with urllib.request.urlopen(req) as res:
            res_data = json.loads(res.read().decode("utf-8"))
            content = res_data["candidates"][0]["content"]["parts"][0]["text"].strip()
            # Clean up potential markdown wrappers
            content = content.replace("```markdown", "").replace("```text", "").replace("```", "").strip()
            return content
    except Exception as e:
        print(f"[-] Gemini API text generation failed: {e}", file=sys.stderr)
        return ""

# Fetch notes list for a GHL contact
def fetch_ghl_contact_notes(contact_id, token):
    print(f"[*] Fetching notes history for GHL Contact ID: {contact_id}...")
    url = f"https://services.leadconnectorhq.com/contacts/{contact_id}/notes"
    headers = {
        "Authorization": f"Bearer {token}",
        "Version": "2021-07-28",
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
    req = urllib.request.Request(url, headers=headers, method="GET")
    try:
        with urllib.request.urlopen(req) as res:
            data = json.loads(res.read().decode("utf-8"))
            notes = data.get("notes", [])
            bodies = [n.get("body", "") for n in notes if n.get("body")]
            return bodies
    except Exception as e:
        print(f"[-] Failed to fetch GHL notes: {e}", file=sys.stderr)
        return []

# Use Gemini to extract structured contact info from history notes text
def extract_contact_info_from_notes(notes_bodies, contact, api_key):
    if not notes_bodies:
        return {}
    
    print("[*] Comparing GHL current profile with notes history to extract corrected details via Gemini...")
    full_text = "\n---\n".join(notes_bodies)[:10000]
    
    current_details = {
        "firstName": contact.get("firstName", ""),
        "lastName": contact.get("lastName", ""),
        "email": contact.get("email", ""),
        "phone": contact.get("phone", ""),
        "website": contact.get("website", ""),
        "address1": contact.get("address1", ""),
        "city": contact.get("city", ""),
        "state": contact.get("state", ""),
        "postalCode": contact.get("postalCode", ""),
        "companyName": contact.get("companyName", "")
    }
    
    prompt = (
        "You are an expert CRM data cleaning assistant.\n"
        "Your task is to analyze a contact's current fields in CRM and compare them with the manual audit reports in their history notes.\n"
        "The history notes contain the most accurate, manually verified information. You must detect if any current field is missing, placeholder, or incorrect, and provide the correct value.\n\n"
        "CRITICAL RULES:\n"
        "1. Look at 'firstName' and 'lastName'. If GHL currently has a business name or generic word like 'The', 'Plumbing', 'ic', 'Rodeo' as the firstName, or 'Plumbing House' as the lastName, these are incorrect placeholders! You MUST overwrite them with the real human contact name found in the notes (e.g., if Notes say 'Contact: Sam DeAngelis', then firstName should be 'Sam' and lastName should be 'DeAngelis').\n"
        "2. Only provide fields in the output JSON that actually need to be updated (i.e., those that are currently missing, incorrect, or placeholders). If a field in GHL is already correct, do not include it in the JSON.\n"
        "3. Always extract 'reviews_count', 'rating', and 'founder_name' from the notes if they are present.\n\n"
        "Here are the CURRENT GHL fields for this contact:\n"
        f"{json.dumps(current_details, indent=2)}\n\n"
        "Here are the CRM history notes:\n"
        f"\"\"\"\n{full_text}\n\"\"\"\n\n"
        "Analyze the comparison and output a JSON object containing ONLY the corrected fields that need an update. The JSON should follow this schema:\n"
        "{\n"
        "  \"firstName\": \"...\",\n"
        "  \"lastName\": \"...\",\n"
        "  \"email\": \"...\",\n"
        "  \"phone\": \"...\",\n"
        "  \"website\": \"...\",\n"
        "  \"address1\": \"...\",\n"
        "  \"city\": \"...\",\n"
        "  \"state\": \"...\",\n"
        "  \"postalCode\": \"...\",\n"
        "  \"companyName\": \"...\",\n"
        "  \"reviews_count\": \"...\",\n"
        "  \"rating\": \"...\",\n"
        "  \"founder_name\": \"...\"\n"
        "}\n\n"
        "Output ONLY raw JSON code block. Do not wrap in ```json or include any introductory text."
    )
    
    api_url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}"
    payload = {
        "contents": [{
            "parts": [{
                "text": prompt
            }]
        }]
    }
    
    req = urllib.request.Request(
        api_url,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST"
    )
    
    try:
        with urllib.request.urlopen(req) as res:
            res_data = json.loads(res.read().decode("utf-8"))
            content = res_data["candidates"][0]["content"]["parts"][0]["text"].strip()
            content = content.replace("```json", "").replace("```text", "").replace("```", "").strip()
            extracted = json.loads(content)
            return extracted
    except Exception as e:
        print(f"[-] Gemini notes extraction failed: {e}", file=sys.stderr)
        return {}

# Search company reputation signals using DuckDuckGo
def find_company_reputation(company_name, city):
    if not company_name:
        return ""
    query = f"{company_name} {city or ''} reviews yelp birdeye google maps"
    print(f"[*] Searching reputation signals online for '{company_name}' in '{city or ''}'...")
    url = f"https://html.duckduckgo.com/html/?q={urllib.parse.quote_plus(query)}"
    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }
    )
    try:
        with urllib.request.urlopen(req) as res:
            html = res.read().decode("utf-8")
        snippets = re.findall(r'class="result__snippet"[^>]*>(.*?)<\/a>', html, re.DOTALL)
        clean_snippets = []
        for s in snippets:
            clean = re.sub('<[^<]+?>', '', s).strip()
            if clean:
                clean_snippets.append(clean)
        reputation_text = "\n".join(clean_snippets[:3])
        return reputation_text
    except Exception as e:
        print(f"[-] Reputation search failed: {e}", file=sys.stderr)
        return ""

# Create a Note inside the Contact profile in GoHighLevel CRM
def create_ghl_contact_note(contact_id, note_body, token):
    print(f"[*] Posting generated outreach copy as a Note to GHL Contact ID: {contact_id}...")
    url = f"https://services.leadconnectorhq.com/contacts/{contact_id}/notes"
    payload = {
        "body": note_body
    }
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {token}",
        "Version": "2021-07-28",
        "User-Agent": "Mozilla/5.0"
    }
    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers=headers,
        method="POST"
    )
    try:
        with urllib.request.urlopen(req) as res:
            json.loads(res.read().decode("utf-8"))
            print("[+] Note successfully posted.")
            return True
    except Exception as e:
        print(f"[-] Failed to post GHL note: {e}", file=sys.stderr)
        return False

# Actually Send Email via GoHighLevel CRM Conversations API
def send_ghl_email(contact_id, subject, body_text, token):
    print(f"[*] Sending LIVE email to GHL Contact ID: {contact_id} via Plumbify...")
    url = "https://services.leadconnectorhq.com/conversations/messages"
    
    # Replace newlines with <br/> for HTML email body
    html_body = body_text.replace("\n", "<br/>")
    
    payload = {
        "type": "Email",
        "contactId": contact_id,
        "emailFrom": "info@lc.plumbify.net",
        "subject": subject,
        "html": html_body
    }
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {token}",
        "Version": "2021-07-28",
        "User-Agent": "Mozilla/5.0"
    }
    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers=headers,
        method="POST"
    )
    try:
        with urllib.request.urlopen(req) as response:
            if response.status in [200, 201]:
                res_data = json.loads(response.read().decode())
                print(f"[+] Email successfully SENT! Message ID: {res_data.get('messageId', 'done')}")
                return True
            else:
                print(f"[-] Failed to send email, status: {response.status}")
                return False
    except urllib.error.HTTPError as e:
        err_msg = e.read().decode()
        print(f"[-] Failed to send GHL email HTTP Error: {e.code} - {err_msg}", file=sys.stderr)
        return False
    except Exception as e:
        print(f"[-] Failed to send GHL email: {e}", file=sys.stderr)
        return False

# Single unified update to GHL contact profile (fields, tags, custom fields)
def update_ghl_contact(contact_id, token, fields_to_update=None, tags=None, custom_fields=None):
    print(f"[*] Sending update payload to GHL for contact ID: {contact_id}...")
    url = f"https://services.leadconnectorhq.com/contacts/{contact_id}"
    
    payload = {}
    if fields_to_update:
        payload.update(fields_to_update)
    if tags is not None:
        payload["tags"] = tags
    if custom_fields is not None:
        payload["customFields"] = custom_fields
        
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {token}",
        "Version": "2021-07-28",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
    
    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers=headers,
        method="PUT"
    )
    try:
        with urllib.request.urlopen(req) as res:
            json.loads(res.read().decode("utf-8"))
            print(f"[+] GHL Contact updated successfully.")
            return True
    except Exception as e:
        print(f"[-] Failed to update GHL contact: {e}", file=sys.stderr)
        return False

def main():
    parser = argparse.ArgumentParser(description="Plumbify AI Outreach Script Generator Agent (Agent 2)")
    parser.add_argument("--limit", type=int, default=5, help="Max number of pending contacts to process")
    args = parser.parse_args()

    # Load environmental tokens
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(script_dir)
    env_vars = load_env(os.path.join(project_root, ".env.local"))

    gemini_key = env_vars.get("GEMINI_API_KEY")
    ghl_token = env_vars.get("GHL_PRIVATE_TOKEN")
    ghl_location = env_vars.get("GHL_LOCATION_ID")
    custom_field_id = env_vars.get("GHL_CUSTOM_FIELD_ID")

    if not gemini_key or not ghl_token or not ghl_location:
        print("[-] Error: Credentials missing from .env.local.", file=sys.stderr)
        sys.exit(1)

    # ===============================
    # [Semantica Integration]
    # Initialize Engine & Context Graph
    # ===============================
    graph = None
    if has_semantica:
        try:
            print("[*] Initializing Semantica AGI Knowledge Engine...")
            app = Semantica()
            app.initialize()
            
            # Use Semantica's built-in methods (or native ContextGraph) to build/store our local network
            # For demonstration, we just initialize the framework
            print("[+] Semantica engine ready.")
        except Exception as e:
            print(f"[-] Semantica initialization failed: {e}")

    # Fetch contacts
    contacts = fetch_ghl_contacts(ghl_token, ghl_location)
    if not contacts:
        print("[-] No contacts found in GHL location. Exiting.")
        sys.exit(0)

    # Filter for pending tags
    pending_leads = []
    for c in contacts:
        tags = c.get("tags", [])
        if "cold-email-pending" in tags:
            pending_leads.append((c, "email"))
        elif "cold-sms-pending" in tags:
            pending_leads.append((c, "sms"))

    if not pending_leads:
        print("[+] No contacts found with 'cold-email-pending' or 'cold-sms-pending' tags. Ready for next harvest.")
        sys.exit(0)

    print(f"[+] Found {len(pending_leads)} pending outreach candidates. Processing up to {args.limit}...")
    
    processed = 0
    for contact, mode in pending_leads:
        if processed >= args.limit:
            break

        company = contact.get("companyName") or "Unknown Company"
        contact_id = contact.get("id")
        current_tags = contact.get("tags", [])

        print(f"\n--- Processing Outreach for: {company} (ID: {contact_id}) ---")

        # Step 1: Fetch GHL contact notes history
        notes_bodies = fetch_ghl_contact_notes(contact_id, ghl_token)
        
        # Step 2: Use Gemini to extract and compare contact details from notes
        fields_to_update = extract_contact_info_from_notes(notes_bodies, contact, gemini_key)
        
        # Extract reputation details (not system properties)
        reputation_parts = []
        rev_count = fields_to_update.pop("reviews_count", None)
        rating = fields_to_update.pop("rating", None)
        founder = fields_to_update.pop("founder_name", None)
        
        if rev_count:
            reputation_parts.append(f"Review Count: {rev_count}")
        if rating:
            reputation_parts.append(f"Rating/Stars: {rating}")
        if founder:
            reputation_parts.append(f"Founder/Owner: {founder}")

        # Step 3: Filter non-empty updates, refresh memory contact, and PUT to GHL
        fields_to_update = {k: v for k, v in fields_to_update.items() if v}
        if fields_to_update:
            print(f"[*] AI detected incorrect or missing details in GHL profile. Auto-updating: {fields_to_update}")
            update_ghl_contact(contact_id, ghl_token, fields_to_update=fields_to_update)
            # Apply changes to local dictionary so generator uses corrected names
            for k, v in fields_to_update.items():
                contact[k] = v

        # Step 4: Resolve reputation context
        # Fallback to search if note extraction yields no reputation info
        if not rev_count or not rating:
            search_rep = find_company_reputation(company, contact.get("city", ""))
            if search_rep:
                reputation_parts.append(f"Online Reputation Snippets:\n{search_rep}")
                
        reputation_context = "\n".join(reputation_parts)

        # Step 5: Resolve website URL
        website = contact.get("website")
        if not website:
            city = contact.get("city", "")
            website = find_company_website(company, city)
            if website:
                update_ghl_contact(contact_id, ghl_token, fields_to_update={"website": website})
                contact["website"] = website

        # Step 6: Fetch webpage markdown text
        markdown = ""
        if website:
            markdown = fetch_webpage_markdown(website)
        else:
            print("[-] Website URL could not be resolved. Relying on reputation context...")

        # Step 7: Call Gemini AI to write highly personalized copy
        outreach_copy = generate_outreach_content(contact, markdown, mode, gemini_key, reputation_context)
        if not outreach_copy:
            print("[-] Failed to generate outreach copy. Skipping.")
            continue

        print(f"[+] Generated Script:\n{outreach_copy}\n")
        
        # Determine current step from tags
        current_step = 1
        if "outreach-step-1" in current_tags:
            current_step = 2
        elif "outreach-step-2" in current_tags:
            current_step = 3

        # Use Semantica Graph to log the decision
        if has_semantica:
            try:
                from semantica.context import ContextGraph
                cg = ContextGraph()
                cg.add_entity(contact_id, "PlumbingOwner", properties={
                    "name": contact.get('companyName'),
                    "current_step": current_step
                })
                print(f"[+] Semantica Context Graph Node created for: {contact_id}")
            except Exception as e:
                print(f"[-] Semantica context logging skipped: {e}")

        # Step 8: Write draft note to GoHighLevel contact profile AND send LIVE email
        note_body = f"--- PLUMBIFY AI OUTREACH SENT ({mode.upper()}) ---\n\n{outreach_copy}"
        note_success = create_ghl_contact_note(contact_id, note_body, ghl_token)
        
        # Parse Subject from the Gemini output
        subject_line = f"Quick question for {contact.get('companyName', 'your team')}"
        body_text = outreach_copy
        lines = outreach_copy.split('\n')
        if lines and lines[0].lower().startswith("subject:"):
            subject_line = lines[0][8:].strip()
            body_text = "\n".join(lines[1:]).strip()

        # Send it directly to the customer's email!
        email_success = False
        if mode == "email":
            email_success = send_ghl_email(contact_id, subject_line, body_text, ghl_token)

        # Step 9: Update tags and sync content to custom field
        if note_success or email_success:
            new_tags = [t for t in current_tags if t not in ["cold-email-pending", "cold-sms-pending"]]
            if email_success:
                new_tags.append(f"outreach-step-{current_step}")
            else:
                new_tags.append("outreach-drafted")
            
            custom_fields = None
            if custom_field_id:
                custom_fields = [{"id": custom_field_id, "value": outreach_copy}]
                
            update_ghl_contact(contact_id, ghl_token, tags=new_tags, custom_fields=custom_fields)
            processed += 1

    print(f"\n[+] Outreach processing completed. Drafted scripts for {processed} contacts in GoHighLevel.")

if __name__ == "__main__":
    main()
