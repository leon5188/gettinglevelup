import type { Candidate } from './prefilter';

/**
 * Stage 2: ask the model for categorical judgements, then compute the number
 * ourselves.
 *
 * Deliberately NOT "rate this lead 1-5". Models are poorly calibrated on bare
 * numeric scales and drift between runs; they are reliable at "is this person
 * a homeowner or a renter". Keeping the arithmetic in code also means you can
 * retune weights without touching the prompt or re-scoring history.
 */

export interface Classification {
  id: string;
  problemType: 'emergency' | 'repair' | 'install' | 'advice' | 'unrelated';
  decisionAuthority: 'owner' | 'renter' | 'unknown';
  timeframe: 'now' | 'days' | 'weeks' | 'none';
  diySkew: 'wants_pro' | 'neutral' | 'strictly_diy';
  location: string | null;
  contractorAppropriate: boolean;
  angle: string;
}

export interface ScoredLead extends Candidate {
  classification: Classification;
  score: number; // 0-100
  tier: 'A' | 'B' | 'C';
}

const PROBLEM_WEIGHT: Record<Classification['problemType'], number> = {
  emergency: 30,
  repair: 22,
  install: 20,
  advice: 8,
  unrelated: -100,
};

const TIMEFRAME_WEIGHT: Record<Classification['timeframe'], number> = {
  now: 25,
  days: 18,
  weeks: 8,
  none: 0,
};

const AUTHORITY_WEIGHT: Record<Classification['decisionAuthority'], number> = {
  owner: 20,
  unknown: 6,
  renter: -25,
};

const DIY_WEIGHT: Record<Classification['diySkew'], number> = {
  wants_pro: 15,
  neutral: 5,
  strictly_diy: -20,
};

export function composite(c: Classification, heuristicScore: number): number {
  if (!c.contractorAppropriate) return 0;
  const raw =
    PROBLEM_WEIGHT[c.problemType] +
    TIMEFRAME_WEIGHT[c.timeframe] +
    AUTHORITY_WEIGHT[c.decisionAuthority] +
    DIY_WEIGHT[c.diySkew] +
    heuristicScore; // max 10, keeps the cheap signals in the mix
  return Math.max(0, Math.min(100, raw));
}

function tierOf(score: number): 'A' | 'B' | 'C' {
  if (score >= 70) return 'A';
  if (score >= 45) return 'B';
  return 'C';
}

const SYSTEM = `You classify Reddit posts for a trades contractor (plumbing/HVAC) looking for people who might hire them. You are a classifier, not a salesperson. Be strict: most posts are not leads. Output raw JSON only, no markdown fences.`;

function buildPrompt(batch: Candidate[]): string {
  const items = batch.map((p) => ({
    id: p.id,
    subreddit: p.subreddit,
    title: p.title,
    body: (p.selftext || '').slice(0, 900),
  }));

  return `Classify each post. Return a JSON array, one object per post, same order.

Fields per object:
- id: echo the input id
- problemType: "emergency" (active damage or safety risk) | "repair" (something broken, not urgent) | "install" (wants new equipment/work) | "advice" (general question, nothing to fix) | "unrelated" (not a homeowner problem at all — trade shop talk, tool reviews, memes, career questions)
- decisionAuthority: "owner" (owns the property, can hire) | "renter" (landlord decides — not a lead) | "unknown"
- timeframe: "now" | "days" | "weeks" | "none"
- diySkew: "wants_pro" (open to hiring) | "neutral" | "strictly_diy" (explicitly wants to do it themselves, refuses to pay)
- location: city/state/country if stated, else null
- contractorAppropriate: true only if a contractor could plausibly win paid work here. false for hypotheticals, other countries' code questions, and anything already fixed.
- angle: one sentence, max 20 words, on what genuinely useful thing a tradesperson could tell this person. Not a pitch.

Posts:
${JSON.stringify(items, null, 1)}`;
}

async function callGemini(prompt: string, system: string): Promise<string | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY is not set');

  const model = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        systemInstruction: { parts: [{ text: system }] },
        generationConfig: {
          temperature: 0.1,
          responseMimeType: 'application/json',
        },
      }),
    }
  );

  if (!res.ok) {
    console.error('[intent] Gemini HTTP', res.status, await res.text().catch(() => ''));
    return null;
  }
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? null;
}

/**
 * Score candidates. Batches of 15 keep the prompt well inside context while
 * cutting request count ~15x versus one call per post.
 *
 * Returns only leads the model considers actionable. If the model call fails,
 * that batch is skipped — no fabricated fallback data.
 */
export async function scoreLeads(
  candidates: Candidate[],
  opts: { maxToScore?: number; batchSize?: number } = {}
): Promise<ScoredLead[]> {
  const { maxToScore = 45, batchSize = 15 } = opts;
  const pool = candidates.slice(0, maxToScore);
  const results: ScoredLead[] = [];

  for (let i = 0; i < pool.length; i += batchSize) {
    const batch = pool.slice(i, i + batchSize);
    const text = await callGemini(buildPrompt(batch), SYSTEM);
    if (!text) continue;

    let parsed: Classification[];
    try {
      parsed = JSON.parse(text.replace(/```json|```/g, '').trim());
      if (!Array.isArray(parsed)) throw new Error('not an array');
    } catch (e) {
      console.error('[intent] could not parse classification batch:', e);
      continue;
    }

    const byId = new Map(parsed.map((c) => [c.id, c]));
    for (const cand of batch) {
      const c = byId.get(cand.id);
      if (!c || !c.contractorAppropriate) continue;
      const score = composite(c, cand.heuristicScore);
      if (score < 30) continue;
      results.push({ ...cand, classification: c, score, tier: tierOf(score) });
    }
  }

  return results.sort((a, b) => b.score - a.score);
}
