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

function generateAgentReply(inboundText: string, name: string, company: string) {
  const text = inboundText.toLowerCase();

  if (text.includes("price") || text.includes("cost") || text.includes("how much") || text.includes("pricing")) {
    return `Hi ${name}, Plumbify starts at flat pricing with zero per-tech markup (unlike ServiceTitan charging $300+/tech/mo). Most plumbing shops save over $10k/year. Would you like a quick 2-minute video walkthrough showing exact features?`;
  }

  if (text.includes("demo") || text.includes("call") || text.includes("yes") || text.includes("phone") || /\d{3}[-\s]?\d{3}[-\s]?\d{4}/.test(text)) {
    return `Hi ${name}, thanks for reaching out! I've noted your interest for ${company}. You can pick a convenient 10-minute slot on our calendar here: https://plumbify.net/booking or reply with your best time today and I'll lock it in.`;
  }

  return `Hi ${name}, thanks for replying! Plumbify helps plumbing owners capture after-hours emergency jobs on autopilot and take Tap-to-Pay on-site. Is there a specific bottleneck in dispatch or payment collection you'd like us to solve for ${company}?`;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");

  const CRON_SECRET = process.env.CRON_SECRET || "plumbify_cron_default_secret_2026";
  if (secret !== CRON_SECRET && request.headers.get("authorization") !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized access token" }, { status: 401 });
  }

  const apiKey = process.env.GHL_API_KEY || "pit-4d3ec91e-0a56-42d7-b86a-71d3c01bfec5";
  const locationId = process.env.GHL_LOCATION_ID || "RHROdkS0TNPBFZHcZsX0";

  const headers = {
    Authorization: `Bearer ${apiKey}`,
    Version: "2021-07-28",
    "Content-Type": "application/json",
  };

  let tasksProcessed = 0;
  let repliesSent = 0;

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

    // 2. Inbound Unread Reply Auto-Response
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
          const c = contactRes?.contact || { contactName: conv.contactName };
          const name = sanitizeLeadName(c.firstName, c.contactName);
          const company = sanitizeCompanyName(c.companyName);

          const replyText = generateAgentReply(lastMsg.body || "", name, company);
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

          await fetch(`${GHL_API_BASE}/contacts/${contactId}/tags`, {
            method: "POST",
            headers,
            body: JSON.stringify({ tags: ["ai_replied", "hot"] }),
          }).catch(() => {});

          repliesSent++;
        }
      }
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      tasksProcessed,
      repliesSent,
    });
  } catch (error: any) {
    console.error("[Vercel Cron Error]", error.message);
    return NextResponse.json({ error: "Failed to execute GHL Agent Cron", details: error.message }, { status: 500 });
  }
}
