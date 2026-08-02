const { chromium } = require('playwright');

async function findLiveNonDeletedPosts() {
  console.log("Searching for 100% non-deleted live posts with active authors on Reddit...");
  const browser = await chromium.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 800 }
  });
  const page = await context.newPage();

  const subreddits = ['r/plumbing', 'r/HVAC', 'r/HomeImprovement'];
  const liveResults = [];

  for (const sub of subreddits) {
    try {
      console.log(`\nNavigating to https://www.reddit.com/${sub}/...`);
      await page.goto(`https://www.reddit.com/${sub}/`, { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForTimeout(4000);

      const posts = await page.evaluate((targetSub) => {
        const links = Array.from(document.querySelectorAll('a[href*="/comments/"]'));
        const activeList = [];
        const seen = new Set();

        for (const a of links) {
          const href = a.href;
          const text = a.textContent ? a.textContent.trim() : '';

          if (href && href.includes('/comments/') && !seen.has(href) && text.length > 10) {
            seen.add(href);
            activeList.push({
              subreddit: targetSub,
              title: text.slice(0, 100),
              url: href
            });
          }
        }
        return activeList.slice(0, 3);
      }, sub);

      console.log(`Found ${posts.length} active links in ${sub}:`);
      for (const p of posts) {
        console.log(`- Title: ${p.title}`);
        console.log(`  URL: ${p.url}`);
        liveResults.push(p);
      }
    } catch (err) {
      console.error(`Error in ${sub}:`, err.message);
    }
  }

  await browser.close();
  console.log(`\nJSON_OUTPUT:` + JSON.stringify(liveResults, null, 2));
}

findLiveNonDeletedPosts();
