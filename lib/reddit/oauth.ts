/**
 * Reddit OAuth2 (authorization code flow, confidential client).
 *
 * Register the app at https://www.reddit.com/prefs/apps as type "web app".
 * The redirect URI there must match REDDIT_REDIRECT_URI byte for byte.
 */

/** identity = /api/v1/me, read = browse listings, submit = post comments. */
const SCOPES = ['identity', 'read', 'submit'];

const TOKEN_URL = 'https://www.reddit.com/api/v1/access_token';

/**
 * Reddit rejects generic User-Agents and rate-limits shared ones aggressively.
 * Format: <platform>:<app id>:<version> (by /u/<your username>)
 */
export function userAgent(): string {
  return process.env.REDDIT_USER_AGENT || 'web:snoorise:v1.0.0 (by /u/unset)';
}

function config() {
  const clientId = process.env.REDDIT_CLIENT_ID;
  const clientSecret = process.env.REDDIT_CLIENT_SECRET;
  const redirectUri = process.env.REDDIT_REDIRECT_URI;
  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error(
      'Missing REDDIT_CLIENT_ID / REDDIT_CLIENT_SECRET / REDDIT_REDIRECT_URI'
    );
  }
  return { clientId, clientSecret, redirectUri };
}

export function authorizeUrl(state: string): string {
  const { clientId, redirectUri } = config();
  const params = new URLSearchParams({
    client_id: clientId,
    response_type: 'code',
    state,
    redirect_uri: redirectUri,
    // "permanent" is what gets you a refresh_token; "temporary" expires in 1h with no way back.
    duration: 'permanent',
    scope: SCOPES.join(' '),
  });
  return `https://www.reddit.com/api/v1/authorize?${params.toString()}`;
}

interface TokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  scope: string;
}

async function tokenRequest(body: URLSearchParams): Promise<TokenResponse> {
  const { clientId, clientSecret } = config();
  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      Authorization:
        'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': userAgent(),
    },
    body: body.toString(),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.access_token) {
    throw new Error(
      `Reddit token request failed (HTTP ${res.status}): ${data.error || 'no access_token in response'}`
    );
  }
  return data as TokenResponse;
}

export async function exchangeCode(code: string) {
  const { redirectUri } = config();
  const data = await tokenRequest(
    new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
    })
  );
  if (!data.refresh_token) {
    throw new Error(
      'Reddit returned no refresh_token — check that duration=permanent was sent'
    );
  }
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  };
}

export async function refreshAccessToken(refreshToken: string) {
  const data = await tokenRequest(
    new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    })
  );
  return {
    accessToken: data.access_token,
    // Reddit usually returns the same refresh token, but honour a rotated one if present.
    refreshToken: data.refresh_token || refreshToken,
    expiresAt: Date.now() + data.expires_in * 1000,
  };
}

export async function fetchUsername(accessToken: string): Promise<string> {
  const res = await fetch('https://oauth.reddit.com/api/v1/me', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'User-Agent': userAgent(),
    },
  });
  if (!res.ok) throw new Error(`/api/v1/me failed with HTTP ${res.status}`);
  const data = await res.json();
  if (!data.name) throw new Error('/api/v1/me returned no username');
  return data.name as string;
}

export async function revokeToken(token: string, isRefresh: boolean) {
  const { clientId, clientSecret } = config();
  await fetch('https://www.reddit.com/api/v1/revoke_token', {
    method: 'POST',
    headers: {
      Authorization:
        'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': userAgent(),
    },
    body: new URLSearchParams({
      token,
      token_type_hint: isRefresh ? 'refresh_token' : 'access_token',
    }).toString(),
  }).catch(() => {});
}
