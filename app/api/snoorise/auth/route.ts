import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { authorizeUrl } from '@/lib/reddit/oauth';

export const dynamic = 'force-dynamic';

/**
 * GET /api/snoorise/auth — kick off the Reddit OAuth flow.
 *
 * The state parameter is stored in a short-lived cookie and checked in the
 * callback. Without it, anyone can feed your callback a code from a Reddit
 * account you didn't intend to connect.
 */
export async function GET(req: Request) {
  const state = crypto.randomBytes(16).toString('hex');

  let url: string;
  try {
    url = authorizeUrl(state);
  } catch (err: any) {
    return NextResponse.redirect(
      new URL(`/snoorise?error=config&detail=${encodeURIComponent(err.message)}`, req.url)
    );
  }

  const res = NextResponse.redirect(url);
  res.cookies.set('snoorise_oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 600,
  });
  return res;
}
