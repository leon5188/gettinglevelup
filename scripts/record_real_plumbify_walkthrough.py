import asyncio
import os
import sys

sys.path.append(os.getcwd())
from playwright.async_api import async_playwright

async def run_walkthrough_recording():
    output_dir = "/Users/peifengni/plumbify-site/scratch/real_recordings"
    os.makedirs(output_dir, exist_ok=True)

    print("[*] Launching Chromium browser with 1080P recording for Google Sign-In...")
    async with async_playwright() as p:
        # Launch visible browser for observation
        browser = await p.chromium.launch(
            headless=False,
            slow_mo=1200
        )

        context = await browser.new_context(
            viewport={'width': 1920, 'height': 1080},
            record_video_dir=output_dir,
            record_video_size={'width': 1920, 'height': 1080}
        )

        page = await context.new_page()

        print("[*] Step 1: Navigating to https://app.plumbify.net...")
        await page.goto("https://app.plumbify.net", wait_until="networkidle")
        await page.wait_for_timeout(3000)

        # Step 2: Click 'Sign in with Google'
        print("[*] Step 2: Clicking 'Sign in with Google' button...")
        try:
            google_btn = page.locator("button:has-text('Google'), a:has-text('Google'), div:has-text('Google'), [aria-label*='Google'], [id*='google']").first
            if await google_btn.is_visible():
                await google_btn.click()
                print("[+] Clicked Google Login button. Waiting for Google OAuth popup/page...")
                await page.wait_for_timeout(4000)
            else:
                print("[-] Custom Google button selector search...")
                await page.click("text=Google", timeout=5000)
        except Exception as e:
            print(f"[-] Google login click attempt: {e}")

        # Handle Google OAuth Login Form if prompted
        try:
            # Handle popup page if opened in a new tab
            pages = context.pages
            target_page = pages[-1] if len(pages) > 1 else page
            
            # Fill Google email
            email_field = target_page.locator("input[type='email']")
            if await email_field.is_visible(timeout=5000):
                print("[*] Entering Google Email: peifengni88@gmail.com...")
                await email_field.fill("peifengni88@gmail.com")
                await target_page.click("text=Next, #identifierNext")
                await target_page.wait_for_timeout(3000)

                # Fill Google password
                pwd_field = target_page.locator("input[type='password']")
                if await pwd_field.is_visible(timeout=5000):
                    print("[*] Entering Google Password...")
                    await pwd_field.fill(user_password)
                    await target_page.click("text=Next, #passwordNext")
                    await target_page.wait_for_timeout(5000)
        except Exception as e:
            print(f"[-] OAuth fill info: {e}")

        # Wait for GHL / Plumbify dashboard load
        print("[*] Step 3: Waiting for Plumbify internal dashboard load...")
        await page.wait_for_timeout(8000)

        # Step 4: Full Onboarding Walkthrough across all tabs (spent 2-3 mins)
        print("[*] Step 4: Demonstrating Contacts list & profile details...")
        try:
            contacts_btn = page.locator("text=Contacts, a[href*='contacts']").first
            if await contacts_btn.is_visible():
                await contacts_btn.click()
                await page.wait_for_timeout(8000)

                # Open contact details
                row = page.locator("tr, div[class*='contact-row'], td").first
                if await row.is_visible():
                    await row.click()
                    await page.wait_for_timeout(10000)
        except Exception as e:
            print(f"[-] Contacts step: {e}")

        print("[*] Step 5: Demonstrating Automation & Workflows...")
        try:
            automation_btn = page.locator("text=Automation, a[href*='workflows'], a[href*='automation']").first
            if await automation_btn.is_visible():
                await automation_btn.click()
                await page.wait_for_timeout(10000)
        except Exception as e:
            print(f"[-] Automation step: {e}")

        print("[*] Step 6: Demonstrating Conversations & AI Outreach...")
        try:
            conv_btn = page.locator("text=Conversations, a[href*='conversations']").first
            if await conv_btn.is_visible():
                await conv_btn.click()
                await page.wait_for_timeout(10000)
        except Exception as e:
            print(f"[-] Conversations step: {e}")

        print("[*] Step 7: Demonstrating Settings & Phone Line Configuration...")
        try:
            settings_btn = page.locator("text=Settings, a[href*='settings']").first
            if await settings_btn.is_visible():
                await settings_btn.click()
                await page.wait_for_timeout(10000)
        except Exception as e:
            print(f"[-] Settings step: {e}")

        print("[*] Walkthrough recording completed gracefully!")
        await page.wait_for_timeout(5000)

        await context.close()
        await browser.close()

    print(f"[+] Recording session finished! Saved in: {output_dir}")

if __name__ == "__main__":
    asyncio.run(run_walkthrough_recording())
