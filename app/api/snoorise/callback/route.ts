import { NextResponse } from 'next/server';

const REDDIT_CLIENT_ID = process.env.REDDIT_CLIENT_ID || "kX89aP_zQ2mSample";
const REDDIT_CLIENT_SECRET = process.env.REDDIT_CLIENT_SECRET || "";
const REDIRECT_URI = "http://localhost:3000/api/snoorise/callback";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error || !code) {
    return NextResponse.redirect(new URL(`/snoorise?error=${error || 'cancelled'}`, req.url));
  }

  try {
    // 1. Exchange Code for Access Token with Reddit OAuth
    const authHeader = 'Basic ' + Buffer.from(`${REDDIT_CLIENT_ID}:${REDDIT_CLIENT_SECRET}`).toString('base64');
    const params = new URLSearchParams();
    params.append('grant_type', 'authorization_code');
    params.append('code', code);
    params.append('redirect_uri', REDIRECT_URI);

    const tokenRes = await fetch('https://www.reddit.com/api/v1/access_token', {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'SnooRiseAI/1.0.0 (by /u/SnooRiseDev)'
      },
      body: params.toString()
    });

    const tokenData = await tokenRes.json();

    if (!tokenData.access_token) {
      return NextResponse.redirect(new URL(`/snoorise?error=token_failed`, req.url));
    }

    // 2. Fetch User Profile from Reddit API /v1/me
    const userRes = await fetch('https://oauth.reddit.com/api/v1/me', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'User-Agent': 'SnooRiseAI/1.0.0 (by /u/SnooRiseDev)'
      }
    });

    const userData = await userRes.json();

    // 3. Redirect back to Dashboard with verified user session
    const targetUrl = new URL('/snoorise', req.url);
    targetUrl.searchParams.set('connected', 'true');
    targetUrl.searchParams.set('username', userData.name || 'RedditUser');
    targetUrl.searchParams.set('karma', String((userData.comment_karma || 0) + (userData.link_karma || 0)));
    
    return NextResponse.redirect(targetUrl);
  } catch (e: any) {
    console.error("Reddit OAuth Callback error:", e);
    return NextResponse.redirect(new URL(`/snoorise?error=exception`, req.url));
  }
}
