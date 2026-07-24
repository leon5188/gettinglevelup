import asyncio
import os
import sys

sys.path.append(os.getcwd())
from playwright.async_api import async_playwright

async def record_active_session():
    output_dir = "/Users/peifengni/plumbify-site/scratch/real_recordings"
    os.makedirs(output_dir, exist_ok=True)

    print("[*] Connecting Playwright to your ALREADY LOGGED-IN Chrome session (127.0.0.1:9222)...")
    async with async_playwright() as p:
        try:
            browser = await p.chromium.connect_over_cdp("http://127.0.0.1:9222")
            context = browser.contexts[0] if browser.contexts else await browser.new_context()
            pages = context.pages

            active_page = None
            for pg in pages:
                url = pg.url
                print(f"[*] Found open tab URL: {url}")
                if "plumbify" in url or "leadconnector" in url or "gohighlevel" in url or "app." in url or "location" in url:
                    active_page = pg
                    break

            if not active_page:
                active_page = pages[0] if pages else await context.new_page()

            print(f"[+] Attached to your active logged-in tab: {active_page.url}")
            await active_page.bring_to_front()

            # 1. Contacts & 3-Column Profile Details
            print("[*] Step 1: Navigating to Contacts & 3-column details...")
            try:
                contacts_btn = active_page.locator("text=Contacts, a[href*='contacts']").first
                if await contacts_btn.is_visible():
                    await contacts_btn.click()
                    await active_page.wait_for_timeout(6000)

                    # Click first contact row
                    contact_row = active_page.locator("tr, div[class*='contact-row'], td, .contact-name").first
                    if await contact_row.is_visible():
                        await contact_row.click()
                        print("[+] Opened contact profile details!")
                        await active_page.wait_for_timeout(15000)
                else:
                    await active_page.wait_for_timeout(8000)
            except Exception as e:
                print(f"[-] Contacts step info: {e}")
                await active_page.wait_for_timeout(8000)

            # 2. Automation & Workflows
            print("[*] Step 2: Navigating to Automation & Workflows...")
            try:
                auto_btn = active_page.locator("text=Automation, a[href*='workflows'], a[href*='automation']").first
                if await auto_btn.is_visible():
                    await auto_btn.click()
                    await active_page.wait_for_timeout(12000)
                else:
                    await active_page.wait_for_timeout(8000)
            except Exception as e:
                print(f"[-] Automation step info: {e}")
                await active_page.wait_for_timeout(8000)

            # 3. Conversations & AI Outreach
            print("[*] Step 3: Navigating to Conversations...")
            try:
                conv_btn = active_page.locator("text=Conversations, a[href*='conversations']").first
                if await conv_btn.is_visible():
                    await conv_btn.click()
                    await active_page.wait_for_timeout(15000)
                else:
                    await active_page.wait_for_timeout(8000)
            except Exception as e:
                print(f"[-] Conversations step info: {e}")
                await active_page.wait_for_timeout(8000)

            # 4. Settings & Configuration
            print("[*] Step 4: Navigating to Settings & Location configuration...")
            try:
                set_btn = active_page.locator("text=Settings, a[href*='settings']").first
                if await set_btn.is_visible():
                    await set_btn.click()
                    await active_page.wait_for_timeout(15000)
                else:
                    await active_page.wait_for_timeout(8000)
            except Exception as e:
                print(f"[-] Settings step info: {e}")
                await active_page.wait_for_timeout(8000)

            print("[+] Live dashboard walkthrough completed successfully!")

        except Exception as e:
            print(f"[-] CDP Error: {e}", file=sys.stderr)

if __name__ == "__main__":
    asyncio.run(record_active_session())
