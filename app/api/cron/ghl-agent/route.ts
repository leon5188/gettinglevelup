import { NextResponse } from "next/server";

const GHL_API_BASE = "https://services.leadconnectorhq.com";

function sanitizeLeadName(rawName?: string, contactName?: string) {
  let name = (rawName || contactName || "").trim();
  name = name.split(/\s+(from|\||-|--)\s+/i)[0].trim();
  if (name.length > 0) {
    name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  }
  return name && name.length >= 2 ? name : "there";
}

function sanitizeCompanyName(companyName?: string) {
  let company = (companyName || "").trim();
  if (!company || company.toLowerCase().includes("unknown") || company.toLowerCase().includes("null")) {
    return "your plumbing shop";
  }
  return company;
}

function classifyInboundIntent(inboundText: string, name: string, company: string): { intent: "opt_out" | "pricing" | "booking" | "general"; replyText: string | null } {
  const text = (inboundText || "").toLowerCase().trim();

  // 1. DND / Opt-Out Detection (Highest Priority)
  const optOutWords = [
    "stop",
    "unsubscribe",
    "remove",
    "not interested",
    "wrong number",
    "take me off",
    "leave me alone",
    "don't email",
    "do not contact",
    "cancel",
    "spam",
    "quit"
  ];
  if (optOutWords.some((word) => text === word || text.includes(` ${word}`) || text.startsWith(`${word} `) || text.endsWith(` ${word}`))) {
    return { intent: "opt_out", replyText: null };
  }

  // 2. Pricing Intent
  if (text.includes("price") || text.includes("cost") || text.includes("how much") || text.includes("pricing") || text.includes("rates") || text.includes("fee")) {
    return {
      intent: "pricing",
      replyText: `Hi ${name}, Plumbify starts at flat pricing with zero per-tech markup (unlike legacy software charging $300+/tech/mo). Most 5-20 tech plumbing shops save over $10,000/year while catching every missed emergency job.\n\nWould you like a quick 2-minute video walkthrough or a link to our ROI leakage calculator?\n\nBest,\nAlex\nPlumbify Team\nhttps://plumbify.net/calculator`,
    };
  }

  // 3. Booking / Demo Intent
  if (text.includes("demo") || text.includes("call") || text.includes("yes") || text.includes("schedule") || text.includes("book") || text.includes("phone") || /\d{3}[-\s]?\d{3}[-\s]?\d{4}/.test(text)) {
    return {
      intent: "booking",
      replyText: `Hi ${name}, thanks for reaching out! I've prioritized your request for ${company}.\n\nYou can pick a convenient 10-minute time on our calendar here: https://plumbify.net/booking or reply with your best time today and I'll confirm it for you right away.\n\nBest,\nAlex\nPlumbify Team\nhttps://plumbify.net/booking`,
    };
  }

  // 4. General / Inquisitive Intent
  return {
    intent: "general",
    replyText: `Hi ${name}, thanks for getting back to us! Plumbify helps plumbing business owners rescue after-hours emergency calls with instant 5-second SMS dispatch and on-site Tap-to-Pay without hardware.\n\nIs there a specific bottleneck in dispatch or payment collection you'd like us to solve for ${company}?\n\nBest,\nAlex\nPlumbify Team\nhttps://plumbify.net/booking`,
  };
}

// 外呼发送默认关闭。cron secret 明文写在 vercel.json 里，任何人都能打这个端点，
// 所以停用不能只靠删 cron 条目。要重新启用，把 OUTREACH_SENDING_ENABLED 设成 "true"。
const OUTREACH_SENDING_ENABLED = process.env.OUTREACH_SENDING_ENABLED === "true";

export async function GET(request: Request) {
  if (!OUTREACH_SENDING_ENABLED) {
    return NextResponse.json(
      { disabled: true, reason: "OUTREACH_SENDING_ENABLED is not set to \"true\"" },
      { status: 503 }
    );
  }

  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");

  const CRON_SECRET = process.env.CRON_SECRET || "plumbify_cron_default_secret_2026";
  if (secret !== CRON_SECRET && request.headers.get("authorization") !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized access token" }, { status: 401 });
  }

  const apiKey = process.env.GHL_API_KEY || process.env.GHL_PRIVATE_TOKEN || "";
  const locationId = process.env.GHL_LOCATION_ID || "";

  const headers = {
    Authorization: `Bearer ${apiKey}`,
    Version: "2023-02-21",
    "Content-Type": "application/json",
  };

  let tasksProcessed = 0;
  let repliesSent = 0;
  let optOutsProcessed = 0;
  let opportunitiesCreated = 0;

  const MARKETING_PIPELINE_ID = "LRKG3wgisuwGNekU7Bn8";
  const QUALIFIED_STAGE_ID = "48f5b5db-a577-46c8-9daa-9b73696b25b5";

  try {
    // 1. Task Auto-Completion & Outreach
    const contactsRes = await fetch(`${GHL_API_BASE}/contacts/?locationId=${locationId}&limit=30`, { headers }).then(r => r.json()).catch(() => null);
    const contacts = contactsRes?.contacts || [];

    for (const c of contacts) {
      const tasksRes = await fetch(`${GHL_API_BASE}/contacts/${c.id}/tasks`, { headers }).then(r => r.json()).catch(() => null);
      const tasks = tasksRes?.tasks || [];
      const pendingTasks = tasks.filter((t: any) => !t.completed);

      for (const t of pendingTasks) {
        const name = sanitizeLeadName(c.firstName, c.contactName);
        const company = sanitizeCompanyName(c.companyName);

        if (c.email && !c.dnd) {
          const subject = `Quick question regarding ${company}`;
          const body = `Hi ${name},\n\nQuick question — when an emergency call comes in at 9:30 PM on a Saturday, does your front desk or AI answer it instantly, or does it roll to voicemail?\n\nWe built Plumbify specifically for plumbing business owners to automatically capture after-hours emergency jobs and allow technicians to take Tap-to-Pay on-site without hardware.\n\nWorth a quick 2-minute look, or are you guys completely booked up for the month?\n\nBest,\nAlex\nPlumbify Team\nhttps://plumbify.net/booking`;

          await fetch(`${GHL_API_BASE}/conversations/messages`, {
            method: "POST",
            headers,
            body: JSON.stringify({
              type: "Email",
              contactId: c.id,
              emailFrom: "info@lc.plumbify.net",
              subject: subject,
              html: body.replace(/\n/g, "<br/>"),
            }),
          }).catch((e) => console.error("Email send error in cron:", e));
        }

        await fetch(`${GHL_API_BASE}/contacts/${c.id}/tasks/${t.id}`, {
          method: "PUT",
          headers,
          body: JSON.stringify({ completed: true }),
        }).catch((e) => console.error("Task completion error in cron:", e));

        tasksProcessed++;
      }
    }

    // 2. Inbound Unread Reply Auto-Response & Smart Intent Routing
    const convsRes = await fetch(`${GHL_API_BASE}/conversations/search?locationId=${locationId}&limit=15`, { headers }).then(r => r.json()).catch(() => null);
    const convs = convsRes?.conversations || [];

    for (const conv of convs) {
      if (conv.lastMessageDirection === "inbound" && conv.unreadCount > 0) {
        const contactId = conv.contactId;
        const msgRes = await fetch(`${GHL_API_BASE}/conversations/${conv.id}/messages`, { headers }).then(r => r.json()).catch(() => null);
        const msgs = msgRes?.messages?.messages || [];
        const lastMsg = msgs[0];

        if (lastMsg && lastMsg.direction === "inbound") {
          const contactRes = await fetch(`${GHL_API_BASE}/contacts/${contactId}`, { headers }).then(r => r.json()).catch(() => null);
          const c = contactRes?.contact || { contactName: conv.contactName, tags: [] };
          const name = sanitizeLeadName(c.firstName, c.contactName);
          const company = sanitizeCompanyName(c.companyName);

          const { intent, replyText } = classifyInboundIntent(lastMsg.body || "", name, company);

          // CASE A: OPT OUT / DND
          if (intent === "opt_out") {
            console.log(`[Opt-Out] Contact ${contactId} (${name} at ${company}) requested unsubscribe.`);
            // Add DND and suppression tags
            await fetch(`${GHL_API_BASE}/contacts/${contactId}/tags`, {
              method: "POST",
              headers,
              body: JSON.stringify({ tags: ["do_not_disturb", "opted_out", "suppressed"] }),
            }).catch(() => {});

            // Update contact DND flag
            await fetch(`${GHL_API_BASE}/contacts/${contactId}`, {
              method: "PUT",
              headers,
              body: JSON.stringify({ dnd: true }),
            }).catch(() => {});

            optOutsProcessed++;
            continue;
          }

          // CASE B: SEND INTENT-AWARE AI REPLY
          if (replyText) {
            const messageType = conv.lastMessageType === "TYPE_SMS" ? "SMS" : "Email";

            await fetch(`${GHL_API_BASE}/conversations/messages`, {
              method: "POST",
              headers,
              body: JSON.stringify({
                type: messageType,
                contactId: contactId,
                emailFrom: "info@lc.plumbify.net",
                subject: `Re: Plumbify Inquiry - ${company}`,
                html: replyText.replace(/\n/g, "<br/>"),
                message: replyText,
              }),
            }).catch((e) => console.error("Reply send error in cron:", e));

            // Tag according to intent
            const newTags = ["ai_replied"];
            if (intent === "booking" || intent === "pricing") {
              newTags.push("hot", `intent_${intent}`);
            } else {
              newTags.push("warm");
            }

            await fetch(`${GHL_API_BASE}/contacts/${contactId}/tags`, {
              method: "POST",
              headers,
              body: JSON.stringify({ tags: newTags }),
            }).catch(() => {});

            // CASE C: AUTOMATIC OPPORTUNITY CREATION FOR HOT LEADS
            if (intent === "booking" || intent === "pricing") {
              await fetch(`${GHL_API_BASE}/opportunities/`, {
                method: "POST",
                headers,
                body: JSON.stringify({
                  pipelineId: MARKETING_PIPELINE_ID,
                  locationId,
                  name: `${company} – Hot Lead (${intent})`,
                  pipelineStageId: QUALIFIED_STAGE_ID,
                  status: "open",
                  contactId,
                  monetaryValue: 249,
                }),
              }).then(() => {
                opportunitiesCreated++;
              }).catch(() => {});
            }

            repliesSent++;
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      tasksProcessed,
      repliesSent,
      optOutsProcessed,
      opportunitiesCreated,
    });
  } catch (error: any) {
    console.error("[Vercel Cron Error]", error.message);
    return NextResponse.json({ error: "Failed to execute GHL Agent Cron", details: error.message }, { status: 500 });
  }
}
