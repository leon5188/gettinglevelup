import asyncio
import os
import sys

sys.path.append(os.getcwd())
from playwright.async_api import async_playwright

async def run_direct_nav():
    print("[*] Connecting directly to your active Chrome browser (127.0.0.1:9222)...")
    async with async_playwright() as p:
        try:
            browser = await p.chromium.connect_over_cdp("http://127.0.0.1:9222")
            context = browser.contexts[0] if browser.contexts else await browser.new_context()
            pages = context.pages

            active_page = None
            for pg in pages:
                url = pg.url
                if "plumbify" in url or "leadconnector" in url or "gohighlevel" in url or "app." in url or "location" in url:
                    active_page = pg
                    break

            if not active_page:
                active_page = pages[0] if pages else await context.new_page()

            print(f"[+] Connected to active tab! Current URL: {active_page.url}")
            await active_page.bring_to_front()

            base_url = active_page.url.rstrip('/')
            print(f"[*] Base URL: {base_url}")

            # 1. Scroll active page to show visual motion
            print("[*] Action 1: Smooth scrolling down and up on current page...")
            await active_page.evaluate("window.scrollTo({top: 600, behavior: 'smooth'})")
            await active_page.wait_for_timeout(3000)
            await active_page.evaluate("window.scrollTo({top: 0, behavior: 'smooth'})")
            await active_page.wait_for_timeout(2000)

            # 2. Try clicking links or navigating
            sub_paths = ["contacts", "workflows", "conversations", "settings"]

            for sub in sub_paths:
                print(f"[*] Action: Navigating to sub-page /{sub}...")
                try:
                    # Attempt click first
                    clicked = False
                    elements = await active_page.locator(f"a[href*='{sub}'], button:has-text('{sub}'), div:has-text('{sub}')").all()
                    for el in elements:
                        if await el.is_visible():
                            print(f"[+] Found clickable element for '{sub}'. Clicking now...")
                            await el.click(force=True)
                            clicked = True
                            break
                    
                    if not clicked:
                        print(f"[*] Force navigating browser URL to /{sub}...")
                        if "/location/" in active_page.url:
                            # Maintain location scope
                            parts = active_page.url.split('/')
                            # Replace last segment
                            new_url = "/".join(parts[:-1]) + f"/{sub}"
                            await active_page.goto(new_url)
                        else:
                            await active_page.goto(f"https://app.plumbify.net/{sub}")

                    print(f"[+] Switched to {sub}! Observing for 12 seconds...")
                    await active_page.wait_for_timeout(3000)
                    # Scroll on new page
                    await active_page.evaluate("window.scrollTo({top: 400, behavior: 'smooth'})")
                    await active_page.wait_for_timeout(9000)

                except Exception as e:
                    print(f"[-] Sub-page navigation note for {sub}: {e}")
                    await active_page.wait_for_timeout(5000)

            print("[+] Direct navigation and visual motion sequence completed!")

        except Exception as e:
            print(f"[-] CDP Connection Error: {e}", file=sys.stderr)

if __name__ == "__main__":
    asyncio.run(run_direct_nav())
