import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

export interface RedditAutomationResult {
  success: boolean;
  message?: string;
  error?: string;
  screenshotUrl?: string;
}

/**
 * 100% STRICT REAL PLAYWRIGHT BROWSER AUTOMATION FOR REDDIT
 * Anti-Bot evasion enabled + Screenshot diagnostic exporter.
 */
export async function autoPublishRedditCommentViaPlaywright(
  emailOrUsername: string,
  password: string,
  postUrl: string,
  commentText: string
): Promise<RedditAutomationResult> {
  console.log(`[Playwright Engine] Anti-bot session launching for: ${emailOrUsername}`);
  let browser = null;
  try {
    // Launch Chromium with Anti-Automation Evasion Flags
    browser = await chromium.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-blink-features=AutomationControlled',
        '--disable-features=IsolateOrigins,site-per-process',
        '--window-size=1280,800'
      ]
    });

    const context = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
      locale: 'en-US',
      timezoneId: 'America/New_York'
    });

    // Mask navigator.webdriver
    await context.addInitScript(() => {
      Object.defineProperty(navigator, 'webdriver', {
        get: () => undefined,
      });
    });

    const page = await context.newPage();

    // 1. Open Reddit Login Page
    console.log('[Playwright Engine] Opening https://www.reddit.com/login...');
    await page.goto('https://www.reddit.com/login', { waitUntil: 'domcontentloaded', timeout: 35000 });
    await page.waitForTimeout(2500);

    // 2. Fill Credentials
    const usernameInput = await page.$('input[name="username"], input[id="login-username"], input[type="text"]');
    const passwordInput = await page.$('input[name="password"], input[id="login-password"], input[type="password"]');

    if (!usernameInput || !passwordInput) {
      await page.screenshot({ path: './public/debug-login-failed.png' });
      await browser.close();
      return {
        success: false,
        error: '❌ Reddit 登录页面未加载到输入框。可能触发了 Cloudflare / CAPTCHA 人机验证拦截！访问 http://localhost:3000/debug-login-failed.png 可查看浏览器现场截屏。',
        screenshotUrl: '/debug-login-failed.png'
      };
    }

    await usernameInput.fill(emailOrUsername);
    await passwordInput.fill(password);

    // 3. Click Login
    const loginButton = await page.$('button[type="submit"], button:has-text("Log In"), button:has-text("Sign In")');
    if (loginButton) {
      await loginButton.click();
    }

    await page.waitForTimeout(5000);

    // Take diagnostic screenshot after login attempt
    await page.screenshot({ path: './public/debug-login-failed.png' });

    // Check if login failed or stayed on login/captcha page
    const currentUrl = page.url();
    if (currentUrl.includes('/login')) {
      await browser.close();
      return {
        success: false,
        error: '❌ Reddit 登录遭到风控拦截：未名环境下 Reddit 对该账号弹出了 CAPTCHA 人机拼图验证！您可以访问 http://localhost:3000/debug-login-failed.png 查看到人机验证弹窗。推荐使用一键直达发表！',
        screenshotUrl: '/debug-login-failed.png'
      };
    }

    // 4. Open Target Post URL
    console.log(`[Playwright Engine] Navigating to target post: ${postUrl}`);
    await page.goto(postUrl, { waitUntil: 'domcontentloaded', timeout: 35000 });
    await page.waitForTimeout(3000);

    // 5. Fill Comment Box
    const possibleCommentSelectors = [
      'shreddit-composer div[role="textbox"]',
      'textarea[name="body"]',
      'textarea[placeholder*="comment"]',
      'div[contenteditable="true"]',
      'faceplate-textarea-input textarea'
    ];

    let filled = false;
    for (const sel of possibleCommentSelectors) {
      try {
        const box = await page.$(sel);
        if (box) {
          await box.click();
          await box.fill(commentText);
          filled = true;
          break;
        }
      } catch (e) {}
    }

    if (!filled) {
      await page.screenshot({ path: './public/debug-post-failed.png' });
      await browser.close();
      return {
        success: false,
        error: '❌ 未能在原帖找到可编辑的评论框。截屏已保存至 http://localhost:3000/debug-post-failed.png',
        screenshotUrl: '/debug-post-failed.png'
      };
    }

    // 6. Click Comment Button
    const submitBtn = await page.$('button[type="submit"]:has-text("Comment"), shreddit-composer button[type="submit"], button:has-text("Comment")');
    if (!submitBtn) {
      await page.screenshot({ path: './public/debug-post-failed.png' });
      await browser.close();
      return {
        success: false,
        error: '❌ 找到了评论框，但没有抓取到【Comment】提交按钮。',
        screenshotUrl: '/debug-post-failed.png'
      };
    }

    await submitBtn.click();
    await page.waitForTimeout(4000);

    // 7. Verify DOM
    const isCommentInDOM = await page.evaluate((text) => {
      return document.body.innerText.includes(text);
    }, commentText);

    await page.screenshot({ path: './public/debug-result.png' });
    await browser.close();

    if (!isCommentInDOM) {
      return {
        success: false,
        error: '❌ 提交了点击，但页面 DOM 未捕抓到评论节点，可能被 Reddit 版主/风控隐藏。',
        screenshotUrl: '/debug-result.png'
      };
    }

    return {
      success: true,
      message: `🎉 [严格校验通过] 无头 Chrome 已成功代表 ${emailOrUsername} 在 Reddit 原帖上真正发表评论！`,
      screenshotUrl: '/debug-result.png'
    };
  } catch (err: any) {
    if (browser) {
      await browser.close().catch(() => {});
    }
    return {
      success: false,
      error: `Playwright 运行异常: ${err.message}`
    };
  }
}
