import os
import requests
from dotenv import load_dotenv

GHL_ENV_PATH = "/Users/peifengni/GoHighLevel-MCP/.env"

ghl_config = {}
if os.path.exists(GHL_ENV_PATH):
    with open(GHL_ENV_PATH, "r") as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#"):
                parts = line.split("=", 1)
                if len(parts) == 2:
                    key = parts[0].strip()
                    val = parts[1].split("#", 1)[0].strip()
                    ghl_config[key] = val

GHL_ACCESS_TOKEN = ghl_config.get("GHL_API_KEY", "")
GHL_LOCATION_ID = ghl_config.get("GHL_LOCATION_ID", "")

GHL_BLOG_ID = "02mRtDrR7f2h9hAJ9TOj"

if not GHL_ACCESS_TOKEN or not GHL_LOCATION_ID:
    print("❌ Error: Missing GHL credentials in .env.local")
    exit(1)

GHL_BASE_URL = "https://services.leadconnectorhq.com"
headers = {
    "Authorization": f"Bearer {GHL_ACCESS_TOKEN}",
    "Version": "2021-07-28",
    "Content-Type": "application/json"
}

# 1. 14 Verified Clean GHL Post IDs Whitelist
clean_ids = [
    "6a5a9c93f5f21efc8eaf6ed6",  # 10dlc-registration-guide
    "6a5a9c945b080f259d6c614d",  # ai-answering-vs-answering-services-plumbers
    "6a5a9c95cf3769f8c64b27a6",  # ai-plumber-assistant
    "6a5a9c96220e967c8d40a4ce",  # database-reactivation-plumbing-jobs
    "6a5a9c97e9f2dd3294c7b185",  # emergency-plumbing-dispatching-guide
    "6a5a9c989ba2b59e11c44044",  # flat-rate-pricing-plumbing-ticket-sizes
    "6a5a9c99fd09fe05706ce459",  # google-reviews-plumbing-autopilot
    "6a5a9cc5544dd4c20cc0ae8e",  # grow-plumbing-business-playbook
    "6a5a9cc5544dd46f97c0aea2",  # missed-calls-cost-plumbing
    "6a5a9c9bc4669daafe07fa39",  # plumbing-software-2026
    "6a5a9cc79ba2b54347c440fc",  # standardize-plumbing-dispatching-invoicing
    "6a5a9c9dcf376910734b27d9",  # tap-to-pay-plumbers-cash-flow
    "6a5a9c9e220e9606af40a4fe",  # vetting-plumbing-helpers-automation
    "6a5a9c9f6c0469256b4b1a72"   # wechat-social-leads-trade-services
]

print(f"📋 Whitelist of clean IDs (14 expected): {len(clean_ids)} initialized.\n")

# 2. Fetch all posts from GHL using pagination
all_posts = []
offset = 0
limit = 50

print("↓ Fetching all posts from GHL...")
while True:
    url = f"{GHL_BASE_URL}/blogs/posts/all"
    params = {
        "locationId": GHL_LOCATION_ID,
        "blogId": GHL_BLOG_ID,
        "limit": limit,
        "offset": offset,
        "status": "PUBLISHED"
    }
    r = requests.get(url, headers=headers, params=params)
    if r.status_code != 200:
        print(f"❌ Failed to fetch posts: {r.status_code} - {r.text}")
        exit(1)
    
    data = r.json()
    posts = data.get("blogs") or data.get("posts") or data.get("blogPosts") or []
    if not posts:
        break
        
    all_posts.extend(posts)
    offset += limit
    if len(posts) < limit:
        break

print(f"✓ Successfully retrieved {len(all_posts)} posts from GHL.\n")

# 3. Scan and delete duplicate/obsolete posts
deleted_count = 0
failed_count = 0

print("⚠️ Beginning cleanup of duplicate posts (IDs not in whitelist)...")
for post in all_posts:
    post_id = post.get("_id")
    slug = post.get("urlSlug")
    title = post.get("title")
    
    # If the online ID is not in our 14 clean IDs, it's a duplicate and must be taken offline
    if post_id not in clean_ids:
        print(f"💤 Taking duplicate/obsolete post offline to DRAFT: '{title}' (Slug: {slug}, ID: {post_id})...")
        update_url = f"{GHL_BASE_URL}/blogs/posts/{post_id}"
        payload = {
            "status": "DRAFT",
            "locationId": GHL_LOCATION_ID,
            "blogId": GHL_BLOG_ID,
            "title": title
        }
        
        try:
            put_r = requests.put(update_url, headers=headers, json=payload)
            if put_r.status_code == 200:
                print(f"  ✅ Successfully set to DRAFT (Offline).")
                deleted_count += 1
            else:
                print(f"  ❌ Failed to update status (HTTP {put_r.status_code}): {put_r.text}")
                failed_count += 1
        except Exception as e:
            print(f"  ❌ Network error during update: {e}")
            failed_count += 1

print("\n════════════════════════════════════════")
print("🎉 Cleanup completed!")
print(f"   Successfully deleted: {deleted_count} duplicate posts.")
if failed_count > 0:
    print(f"   Failed to delete: {failed_count} posts.")
print("════════════════════════════════════════")
