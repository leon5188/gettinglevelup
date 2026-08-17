import { redditFetch } from '@/lib/reddit/client';
import type { RedditSession } from '@/lib/reddit/session';
import type { RawPost } from './prefilter';

/**
 * Stage 0: collect raw posts.
 *
 * Two sources, because /new alone misses a lot: a post asking "burst pipe help"
 * in r/HomeImprovement may be hours deep in a firehose sub. Search catches it.
 *
 * All reads go through oauth.reddit.com. The old www.reddit.com/*.json calls
 * with a spoofed User-Agent are what caused the intermittent 403s.
 */

const SUBREDDITS = ['plumbing', 'HVAC', 'HomeImprovement', 'DIY', 'homeowners'];

/** Search phrases chosen to match how people describe a problem they'd pay to fix. */
const SEARCH_QUERIES = [
  'burst pipe',
  'water heater leaking',
  'no hot water',
  'sewage smell',
  'should I call a plumber',
  'how much to replace',
];

function normalize(children: any[]): RawPost[] {
  return children
    .map((c) => c.data)
    .filter((d) => d && d.id && d.permalink)
    .map((d) => ({
      id: d.id,
      name: d.name,
      subreddit: d.subreddit,
      title: d.title || '',
      selftext: d.selftext || '',
      author: d.author,
      created_utc: d.created_utc,
      num_comments: d.num_comments ?? 0,
      ups: d.ups ?? 0,
      permalink: `https://www.reddit.com${d.permalink}`,
      stickied: d.stickied,
      locked: d.locked,
      over_18: d.over_18,
      distinguished: d.distinguished,
      link_flair_text: d.link_flair_text,
    }));
}

export interface HarvestResult {
  posts: RawPost[];
  session: RedditSession | null;
  errors: string[];
}

export async function harvest(
  session: RedditSession,
  opts: { subreddits?: string[]; queries?: string[]; perSource?: number } = {}
): Promise<HarvestResult> {
  const subs = opts.subreddits ?? SUBREDDITS;
  const queries = opts.queries ?? SEARCH_QUERIES;
  const limit = opts.perSource ?? 50;

  const seen = new Set<string>();
  const posts: RawPost[] = [];
  const errors: string[] = [];
  let current = session;
  let refreshed: RedditSession | null = null;

  const collect = async (path: string) => {
    try {
      const { data, session: next } = await redditFetch<any>(current, path);
      if (next) {
        current = next;
        refreshed = next;
      }
      for (const post of normalize(data?.data?.children ?? [])) {
        if (seen.has(post.id)) continue;
        seen.add(post.id);
        posts.push(post);
      }
    } catch (err: any) {
      // One dead subreddit shouldn't kill the whole scan, but it must be visible.
      errors.push(`${path}: ${err.message}`);
    }
  };

  for (const sub of subs) {
    await collect(`/r/${sub}/new?limit=${limit}`);
  }

  for (const sub of subs) {
    for (const q of queries) {
      await collect(
        `/r/${sub}/search?q=${encodeURIComponent(q)}&restrict_sr=1&sort=new&t=day&limit=25`
      );
    }
  }

  return { posts, session: refreshed, errors };
}
