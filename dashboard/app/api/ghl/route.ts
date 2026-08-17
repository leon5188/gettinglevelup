import { NextResponse } from "next/server";

// This is a secure server-side route to handle lead capture to GHL
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, firstName, lastName, phone, company, chatHistory } = body;

    // Retrieve the token from environment variables (NEVER hardcode in source)
    const GHL_API_KEY = process.env.GHL_PRIVATE_TOKEN;
    const LOCATION_ID = process.env.GHL_LOCATION_ID;

    if (!GHL_API_KEY) {
      return NextResponse.json({ error: "GHL API Key missing" }, { status: 500 });
    }

    // Call GoHighLevel API to create/update contact
    // Documentation: https://api.gohighlevel.com/
    const response = await fetch("https://services.leadconnectorhq.com/contacts/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GHL_API_KEY}`,
        "Version": "2021-07-28" // GHL Versioning
      },
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        phone,
        companyName: company,
        locationId: LOCATION_ID,
        tags: ["plumbify-site-lead", "2026-campaign"]
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("GHL Error:", data);
      return NextResponse.json({ error: "Failed to sync with GHL" }, { status: response.status });
    }

    const contactId = data.contact?.id;

    // Sync Chat History to GoHighLevel Conversations stream
    if (contactId && chatHistory && Array.isArray(chatHistory) && chatHistory.length > 0) {
      try {
        for (const msg of chatHistory) {
          const text = msg.text?.trim();
          if (!text) continue;

          // Skip visual tool logs/diagnostic messages from being synced
          if (text.startsWith("🔧") || text.includes("[AI Agent Action]")) {
            continue;
          }

          if (msg.sender === "user") {
            // Post Inbound Message (Visitor)
            const inboundRes = await fetch("https://services.leadconnectorhq.com/conversations/messages/inbound", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${GHL_API_KEY}`,
                "Version": "2021-07-28"
              },
              body: JSON.stringify({
                type: "Live_Chat",
                contactId: contactId,
                message: text
              })
            });
            if (!inboundRes.ok) {
              const errTxt = await inboundRes.text();
              console.error("GHL Inbound Msg Sync Error:", errTxt);
            }
          } else if (msg.sender === "agent" || msg.sender === "ai") {
            // Post Outbound Message (AI Copilot)
            const outboundRes = await fetch("https://services.leadconnectorhq.com/conversations/messages", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${GHL_API_KEY}`,
                "Version": "2021-07-28"
              },
              body: JSON.stringify({
                type: "Live_Chat",
                contactId: contactId,
                message: text
              })
            });
            if (!outboundRes.ok) {
              const errTxt = await outboundRes.text();
              console.error("GHL Outbound Msg Sync Error:", errTxt);
            }
          }
          // Slight delay to guarantee correct chronological ordering in GHL dashboard
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      } catch (syncError) {
        console.error("Failed to sync chat history to GHL Conversations:", syncError);
      }
    }

    return NextResponse.json({ success: true, contactId });

  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
