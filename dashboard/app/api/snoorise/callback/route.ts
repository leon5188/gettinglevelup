import { NextResponse } from 'next/server';
import { exchangeCode, fetchUsername } from '@/lib/reddit/oauth';
import { seal, COOKIE_NAME, COOKIE_OPTS } from '@/lib/reddit/session';

export const dynamic = 'force-dynamic';

/**
 * GET /api/snoorise/callback — Reddit redirects here after the user approves.
 *
 * Note what is NOT here compared to the old version: no username or karma in
 * the redirect query string. Those were readable in browser history, server
 * logs, and any Referer header. The dashboard now reads them from the session.
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const state = searchParams.get('state');

  const expectedState = req.headers
    .get('cookie')
    ?.split(';')
    .map((c) => c.trim())
    .find((c) => c.startsWith('snoorise_oauth_state='))
    ?.split('=')[1];

  const fail = (reason: string) => {
    const res = NextResponse.redirect(new URL(`/snoorise?error=${reason}`, req.url));
    res.cookies.delete('snoorise_oauth_state');
    return res;
  };

  if (error || !code) return fail(error || 'cancelled');
  if (!state || !expectedState || state !== expectedState) return fail('bad_state');

  try {
    const tokens = await exchangeCode(code);
    const username = await fetchUsername(tokens.accessToken);

    const res = NextResponse.redirect(new URL('/snoorise?connected=1', req.url));
    res.cookies.set(COOKIE_NAME, seal({ username, ...tokens }), COOKIE_OPTS);
    res.cookies.delete('snoorise_oauth_state');
    return res;
  } catch (err: any) {
    console.error('[snoorise] OAuth callback failed:', err.message);
    return fail('exchange_failed');
  }
}
