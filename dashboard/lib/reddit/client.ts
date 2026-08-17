import { refreshAccessToken, userAgent } from './oauth';
import type { RedditSession } from './session';

const API_BASE = 'https://oauth.reddit.com';

/** Refresh this many ms before actual expiry, so a call never dies mid-flight. */
const REFRESH_MARGIN = 120_000;

export interface RedditCall<T> {
  data: T;
  /** Non-null when the token was refreshed — caller must re-seal the cookie. */
  session: RedditSession | null;
}

/**
 * Call the Reddit API with a session, refreshing the access token if needed.
 *
 * Returns the refreshed session (if any) rather than writing a cookie itself,
 * because only a route handler holds the response object.
 */
export async function redditFetch<T = any>(
  session: RedditSession,
  path: string,
  init: RequestInit = {}
): Promise<RedditCall<T>> {
  let current = session;
  let refreshed: RedditSession | null = null;

  if (Date.now() > current.expiresAt - REFRESH_MARGIN) {
    const tokens = await refreshAccessToken(current.refreshToken);
    current = { ...current, ...tokens };
    refreshed = current;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      ...(init.headers || {}),
      Authorization: `Bearer ${current.accessToken}`,
      'User-Agent': userAgent(),
    },
  });

  // Reddit's OAuth budget is ~100 requests/min averaged over a 10-minute window.
  // Surfacing this early is what stops a scan loop from silently getting throttled.
  const remaining = Number(res.headers.get('x-ratelimit-remaining') ?? NaN);
  if (!Number.isNaN(remaining) && remaining < 10) {
    console.warn(
      `[reddit] rate limit low: ${remaining} left, resets in ${res.headers.get('x-ratelimit-reset')}s`
    );
  }

  if (res.status === 401) {
    throw new Error('REDDIT_UNAUTHORIZED');
  }
  if (res.status === 429) {
    throw new Error('REDDIT_RATE_LIMITED');
  }
  if (!res.ok) {
    throw new Error(`Reddit API ${path} failed with HTTP ${res.status}`);
  }

  return { data: (await res.json()) as T, session: refreshed };
}

export interface PostCommentResult {
  permalink: string | null;
  commentId: string | null;
}

/**
 * Post a comment as the authenticated user.
 *
 * @param thingId Fullname of the parent — "t3_abc123" for a post,
 *                "t1_abc123" to reply to another comment.
 */
export async function postComment(
  session: RedditSession,
  thingId: string,
  text: string
): Promise<RedditCall<PostCommentResult>> {
  if (!/^t[13]_[a-z0-9]+$/i.test(thingId)) {
    throw new Error(`thingId must look like t3_xxxxx or t1_xxxxx, got: ${thingId}`);
  }

  const { data, session: refreshed } = await redditFetch<any>(
    session,
    '/api/comment',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        api_type: 'json',
        thing_id: thingId,
        text,
      }).toString(),
    }
  );

  // /api/comment returns HTTP 200 even when it refuses — the failure is in the body.
  // This is the single most common way a Reddit integration reports false success.
  const errors: any[] = data?.json?.errors ?? [];
  if (errors.length > 0) {
    const [code, message] = errors[0];
    throw new Error(`Reddit rejected the comment [${code}]: ${message}`);
  }

  const thing = data?.json?.data?.things?.[0]?.data;
  return {
    data: {
      permalink: thing?.permalink ? `https://www.reddit.com${thing.permalink}` : null,
      commentId: thing?.id ?? null,
    },
    session: refreshed,
  };
}
