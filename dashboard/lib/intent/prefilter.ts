/**
 * Stage 1 of intent scanning: free, deterministic filtering.
 *
 * The point is to throw away ~80% of a listing before spending a model call.
 * Everything here runs on the JSON Reddit already gave us.
 */

export interface RawPost {
  id: string;
  name: string; // fullname, e.g. t3_abc123
  subreddit: string;
  title: string;
  selftext: string;
  author: string;
  created_utc: number;
  num_comments: number;
  ups: number;
  permalink: string;
  stickied?: boolean;
  locked?: boolean;
  over_18?: boolean;
  distinguished?: string | null;
  link_flair_text?: string | null;
}

export interface Candidate extends RawPost {
  ageHours: number;
  /** Heuristic 0-10. Used only to rank what gets sent to the model. */
  heuristicScore: number;
  signals: string[];
}

const HARD_DROP_FLAIRS = /^(meta|announcement|rule|mod|megathread|solved|update)/i;

/** Phrases that mean someone is about to pay a contractor. */
const URGENCY = /\b(emergency|flooding|flooded|burst|burst pipe|gushing|no hot water|no water|sewage|sewer smell|backing up|overflowing|leaking everywhere|asap|right now|today|tonight)\b/i;

const HIRING_INTENT = /\b(should i call|do i need a (plumber|pro|professional)|worth calling|how much (would|does|to)|ballpark|quote|estimate|what would.{0,20}cost|recommend a (plumber|contractor)|looking for a (plumber|contractor)|hire)\b/i;

const OWNERSHIP = /\b(my house|our house|my home|our home|my property|just bought|homeowner|my basement|my crawlspace|my water heater)\b/i;

/** Anti-signals — these people will not become customers. */
const RENTER = /\b(landlord|my apartment|renting|rental unit|my lease|property manager|hoa (won|wont|will not))\b/i;

const ALREADY_RESOLVED = /\b(update:|solved|fixed it|i fixed|resolved|for anyone wondering|just sharing|thought i.d share|psa\b)\b/i;

const TRADE_TALK = /\b(anyone else|apprentice|journeyman|my boss|the shop|coworker|union|tool review|which brand|what do you guys use|paycheck|hourly rate)\b/i;

interface FilterOptions {
  /** Older than this and the thread is cold — someone already answered. */
  maxAgeHours?: number;
  /** Too many comments means the question is answered and a new reply is invisible. */
  maxComments?: number;
  minBodyChars?: number;
}

export function prefilter(
  posts: RawPost[],
  opts: FilterOptions = {}
): Candidate[] {
  const { maxAgeHours = 24, maxComments = 25, minBodyChars = 60 } = opts;
  const now = Date.now() / 1000;
  const out: Candidate[] = [];

  for (const p of posts) {
    if (p.stickied || p.locked || p.over_18 || p.distinguished) continue;
    if (p.author === '[deleted]' || p.author === 'AutoModerator') continue;
    if (p.link_flair_text && HARD_DROP_FLAIRS.test(p.link_flair_text)) continue;

    const ageHours = (now - p.created_utc) / 3600;
    if (ageHours > maxAgeHours) continue;
    if (p.num_comments > maxComments) continue;

    const body = `${p.title}\n${p.selftext || ''}`;
    if (body.length < minBodyChars) continue;

    // A question mark is a weak signal on its own but a strong filter:
    // posts with no question are usually show-and-tell.
    if (!body.includes('?') && !URGENCY.test(body)) continue;

    if (ALREADY_RESOLVED.test(body)) continue;
    if (TRADE_TALK.test(body) && !URGENCY.test(body)) continue;

    let score = 0;
    const signals: string[] = [];

    if (URGENCY.test(body)) { score += 4; signals.push('urgency'); }
    if (HIRING_INTENT.test(body)) { score += 4; signals.push('hiring_intent'); }
    if (OWNERSHIP.test(body)) { score += 2; signals.push('homeowner'); }
    if (RENTER.test(body)) { score -= 4; signals.push('renter'); }
    if (ageHours < 3) { score += 1; signals.push('fresh'); }
    if (p.num_comments === 0) { score += 1; signals.push('unanswered'); }

    if (score <= 0) continue;

    out.push({ ...p, ageHours, heuristicScore: Math.min(score, 10), signals });
  }

  return out.sort((a, b) => b.heuristicScore - a.heuristicScore);
}
