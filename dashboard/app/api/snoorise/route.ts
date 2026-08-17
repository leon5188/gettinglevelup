import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { postComment, redditFetch } from '@/lib/reddit/client';
import { unseal, seal, COOKIE_NAME, COOKIE_OPTS } from '@/lib/reddit/session';
import { revokeToken } from '@/lib/reddit/oauth';
import { harvest } from '@/lib/intent/harvest';
import { prefilter } from '@/lib/intent/prefilter';
import { scoreLeads } from '@/lib/intent/score';
import type { RawPost } from '@/lib/intent/prefilter';

export const dynamic = 'force-dynamic';

// No hardcoded fallbacks. A missing key must fail loudly at call time,
// not silently ship a real credential inside the bundle.
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GHL_TOKEN = process.env.GHL_PRIVATE_TOKEN;
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID;

/** Read the Reddit session, or null if not connected. */
function currentSession() {
  return unseal(cookies().get(COOKIE_NAME)?.value);
}

const notConnected = () =>
  NextResponse.json(
    { success: false, error: 'NOT_CONNECTED', message: '请先连接 Reddit 账号。' },
    { status: 401 }
  );

// Helper to call Google Gemini REST API
async function callGeminiAPI(prompt: string, systemInstruction?: string) {
  if (!GEMINI_API_KEY) throw new Error('GEMINI_API_KEY is not set');
  const model = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        ...(systemInstruction ? { systemInstruction: { parts: [{ text: systemInstruction }] } } : {})
      })
    });
    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || null;
  } catch (err) {
    console.error("Gemini API Error:", err);
    return null;
  }
}

// Helper to scrape web page
async function scrapeWebpageText(targetUrl: string) {
  try {
    const res = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36'
      }
    });
    const html = await res.text();
    return html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
               .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
               .replace(/<[^>]+>/g, ' ')
               .replace(/\s+/g, ' ')
               .trim().slice(0, 4000);
  } catch (e) {
    return null;
  }
}

// Live subreddit listing via OAuth.
async function fetchSubredditPosts(session: any, subreddit: string) {
  const cleanSub = subreddit.replace(/^r\//, '').trim();
  const { data, session: refreshed } = await redditFetch<any>(
    session,
    `/r/${cleanSub}/hot?limit=25`
  );

  const posts = (data?.data?.children ?? [])
    .map((c: any) => c.data)
    .filter((d: any) => d && d.permalink && d.author !== '[deleted]' && !d.stickied)
    .map((d: any) => ({
      id: d.id,
      name: d.name,             // fullname, e.g. t3_abc123 — this is what post_comment needs
      subreddit: `r/${d.subreddit}`,
      title: d.title,
      author: `u/${d.author}`,
      upvotes: d.ups,
      comments: d.num_comments,
      snippet: d.selftext ? d.selftext.slice(0, 200) : d.title,
      permalink: `https://www.reddit.com${d.permalink}`
    }));

  return { posts, refreshed };
}

// Helper to fetch live subreddit rules (via OAuth)
async function fetchRedditRules(session: any, subreddit: string) {
  const cleanSub = subreddit.replace(/^r\//, '');
  try {
    const { data } = await redditFetch<any>(session, `/r/${cleanSub}/about/rules`);
    return (data?.rules ?? []).map((r: any) => `${r.short_name}: ${r.description}`).join('\n');
  } catch (e) {
    return null;
  }
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  try {
    const {
      action,
      websiteUrl,
      subredditName,
      subredditRules,
      knowledgeBase,
      postContext,
      intentLead,
      karmaPost,
      thingId,
      commentText,
      contactEmail,
      contactPhone
    } = body;

    // --- Session state ---------------------------------------------------
    if (action === 'reddit_session') {
      const s = currentSession();
      return NextResponse.json(
        s ? { success: true, connected: true, username: s.username }
          : { success: true, connected: false }
      );
    }

    if (action === 'reddit_disconnect') {
      const s = currentSession();
      if (s) await revokeToken(s.refreshToken, true);
      const res = NextResponse.json({ success: true });
      res.cookies.delete(COOKIE_NAME);
      return res;
    }

    // --- Intent scanning: harvest -> prefilter -> classify ----------------
    if (action === 'scan_intent_leads') {
      const s = currentSession();
      if (!s) return notConnected();

      const { posts, session, errors } = await harvest(s);
      const candidates = prefilter(posts as RawPost[]);
      const leads = await scoreLeads(candidates);

      const res = NextResponse.json({
        success: true,
        leads,
        intentLeads: leads,
        // The funnel shape is how you tell whether the filters are tuned right.
        stats: {
          harvested: posts.length,
          passedPrefilter: candidates.length,
          scored: leads.length
        },
        errors
      });
      if (session) res.cookies.set(COOKIE_NAME, seal(session), COOKIE_OPTS);
      return res;
    }

    // --- Post a comment as the connected user ----------------------------
    if (action === 'post_comment') {
      const s = currentSession();
      if (!s) return notConnected();

      if (!thingId || !commentText?.trim()) {
        return NextResponse.json(
          { success: false, error: '缺少目标帖子 thingId (t3_xxx) 或评论内容。' },
          { status: 400 }
        );
      }

      try {
        const { data, session } = await postComment(s, thingId, commentText);
        const res = NextResponse.json({
          success: true,
          permalink: data.permalink,
          message: `已以 u/${s.username} 的身份发表评论。`
        });
        if (session) res.cookies.set(COOKIE_NAME, seal(session), COOKIE_OPTS);
        return res;
      } catch (err: any) {
        const status = err.message === 'REDDIT_UNAUTHORIZED' ? 401 : 400;
        return NextResponse.json({ success: false, error: err.message }, { status });
      }
    }

    if (action === 'scan_karma_posts') {
      const s = currentSession();
      if (!s) return notConnected();

      const { posts, refreshed } = await fetchSubredditPosts(s, subredditName || 'r/plumbing');
      const res = NextResponse.json({ success: true, karmaPosts: posts });
      if (refreshed) res.cookies.set(COOKIE_NAME, seal(refreshed), COOKIE_OPTS);
      return res;
    }

    // Action 0: Real Scrape + Real Gemini LLM KB Extraction + 10+ Subreddit Recommendations
    if (action === 'auto_scrape_website') {
      if (!websiteUrl) {
        return NextResponse.json({ success: false, error: "Please enter a valid website URL" });
      }
      const scrapedText = await scrapeWebpageText(websiteUrl) || `Website URL: ${websiteUrl}`;
      const prompt = `You are an expert SaaS marketing architect. I scraped this text from ${websiteUrl}:
"""
${scrapedText}
"""
Output raw JSON only with keys:
1. "extractedKB": A structured Knowledge Base string.
2. "recommendedSubreddits": Array of 8-10 relevant subreddits with keys: name, members, matchScore, reason, riskLevel.`;

      const aiResponseText = await callGeminiAPI(prompt, "Output raw JSON only.");
      let parsedAIResult: any = null;
      if (aiResponseText) {
        try {
          const cleanJSONStr = aiResponseText.replace(/```json/g, '').replace(/```/g, '').trim();
          parsedAIResult = JSON.parse(cleanJSONStr);
        } catch (e) {}
      }

      const fullSubreddits = parsedAIResult?.recommendedSubreddits && parsedAIResult.recommendedSubreddits.length >= 5
        ? parsedAIResult.recommendedSubreddits
        : [
            { name: 'r/plumbing', members: '185K', matchScore: 98, reason: '核心专业水管工人与工程承包商聚集地，寻找接单派单工具', riskLevel: 'Moderate' },
            { name: 'r/HVAC', members: '142K', matchScore: 95, reason: '暖通与水管综合施工队，经常讨论错失客户与响应速度', riskLevel: 'Friendly' },
            { name: 'r/HomeImprovement', members: '2.8M', matchScore: 92, reason: '房主高频求助与维修咨询社区，高意向订单抓取地', riskLevel: 'Friendly' },
            { name: 'r/DIY', members: '22M', matchScore: 90, reason: '管道与房屋修缮DIY高频交流板块', riskLevel: 'Friendly' },
            { name: 'r/smallbusiness', members: '1.4M', matchScore: 88, reason: '本地服务型企业主讨论接单与自动化工具', riskLevel: 'Friendly' }
          ];

      return NextResponse.json({
        success: true,
        extractedKB: parsedAIResult?.extractedKB || `Website: ${websiteUrl}\nText:\n${scrapedText.slice(0, 500)}`,
        recommendedSubreddits: fullSubreddits
      });
    }

    // Action 1: Real Reddit Rules Fetch & Gemini Parser
    if (action === 'parse_rules') {
      const s = currentSession();
      if (!s) return notConnected();

      const targetSub = (subredditName || 'r/plumbing').trim();
      const realRulesText = await fetchRedditRules(s, targetSub);
      if (!realRulesText && !subredditRules) {
        return NextResponse.json(
          { success: false, error: `无法读取 ${targetSub} 的版规，请确认版块名正确。` },
          { status: 400 }
        );
      }
      const rawRules = realRulesText || subredditRules;

      const prompt = `Analyze Reddit rules for ${targetSub}:\n"""\n${rawRules}\n"""\nOutput JSON only with keys: allowSelfPromotion, riskScore, constraints, requiresKarma, ruleStrictness.`;
      const aiText = await callGeminiAPI(prompt, "Return raw JSON only.");
      let rulesSummary: any = null;
      if (aiText) {
        try {
          rulesSummary = JSON.parse(aiText.replace(/```json/g, '').replace(/```/g, '').trim());
        } catch (e) {}
      }

      return NextResponse.json({ success: true, targetSub, rawRules, rulesSummary });
    }

    // Action 2: 100% DYNAMIC 90:10 KNOWLEDGE BASE AI RAG GENERATOR
    if (action === 'generate_reply') {
      const ctx = postContext || "How do trade contractors stop losing missed call leads during busy work hours?";
      const kb = knowledgeBase || "Plumbify is an automated SMS speed-to-lead SaaS for plumbers and contractors.";

      const prompt = `Act as an authentic, helpful software founder on Reddit responding directly to this specific post:
Post Context: "${ctx}"
Knowledge Base / Product Context: "${kb}"

Strict Instructions:
- 90:10 Rule: 90% actionable trade/business advice specifically answering the Post Context, 10% natural soft mention of product in Knowledge Base.
- Completely customized to Post Context "${ctx}".
- No generic pitches. Max 120 words.`;

      const generatedReply = await callGeminiAPI(prompt, "Helpful SaaS founder on Reddit.");
      if (!generatedReply) {
        return NextResponse.json(
          { success: false, error: 'AI 生成失败，请重试。' },
          { status: 502 }
        );
      }

      return NextResponse.json({ success: true, generatedReply });
    }

    // Action 5: Dynamic 100% Post-Specific AI Reply Generator
    if (action === 'generate_karma_reply') {
      const postTitle = karmaPost?.title || '';
      const postSnippet = karmaPost?.snippet || '';
      const sub = karmaPost?.subreddit || 'r/plumbing';

      const prompt = `Write a top-voted, 100% authentic, expert Reddit comment directly addressing this specific post:
Subreddit: ${sub}
Post Title: "${postTitle}"
Post Snippet: "${postSnippet}"

Requirements:
- 100% Tailored to the post content (DO NOT write generic advice like "check your fittings").
- Provide high-value, highly specific trade or practical advice directly answering the user's issue.
- Sound like a seasoned Reddit veteran.
- Max 100 words.`;

      const karmaReply = await callGeminiAPI(prompt, "You are a top-voted Reddit expert.");
      if (!karmaReply) {
        return NextResponse.json(
          { success: false, error: 'AI 生成失败，请重试。' },
          { status: 502 }
        );
      }

      return NextResponse.json({ success: true, karmaReply });
    }

    // Action 3: push a lead into GoHighLevel.
    if (action === 'sync_ghl') {
      if (!GHL_TOKEN || !GHL_LOCATION_ID) {
        return NextResponse.json(
          { success: false, error: 'GHL_PRIVATE_TOKEN / GHL_LOCATION_ID 未配置。' },
          { status: 500 }
        );
      }
      if (!contactEmail && !contactPhone) {
        return NextResponse.json(
          { success: false, error: '需要真实邮箱或电话才能建联系人。' },
          { status: 400 }
        );
      }

      const authorName = (intentLead?.author || 'Reddit Lead').replace(/^u\//, '');
      const ghlPayload = {
        locationId: GHL_LOCATION_ID,
        firstName: authorName,
        source: 'Reddit / SnooRise',
        ...(contactEmail ? { email: contactEmail } : {}),
        ...(contactPhone ? { phone: contactPhone } : {}),
        companyName: intentLead?.subreddit ? `Reddit ${intentLead.subreddit}` : undefined,
        tags: ['reddit_intent_lead', 'snoorise_captured'],
        customFields: intentLead?.permalink
          ? [{ key: 'reddit_permalink', field_value: intentLead.permalink }]
          : undefined
      };

      const ghlRes = await fetch("https://services.leadconnectorhq.com/contacts/upsert", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${GHL_TOKEN}`,
          "Version": "2021-07-28",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(ghlPayload)
      });

      const ghlData = await ghlRes.json().catch(() => ({}));
      if (!ghlRes.ok) {
        return NextResponse.json(
          { success: false, error: `GHL 返回 ${ghlRes.status}: ${ghlData.message || '未知错误'}` },
          { status: 502 }
        );
      }

      return NextResponse.json({ success: true, ghlContactId: ghlData.contact?.id });
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
  } catch (err: any) {
    console.error('[snoorise] unhandled:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
