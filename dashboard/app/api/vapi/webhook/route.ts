import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    console.log("Vapi Webhook Received:", JSON.stringify(payload, null, 2));

    const messageType = payload.message?.type;

    if (messageType === "end-of-call-report") {
      const callId = payload.message.call?.id;
      const customerNumber = payload.message.call?.customer?.number;
      const transcript = payload.message.transcript || "No transcript available.";
      const summary = payload.message.summary || "No summary available.";
      const recordingUrl = payload.message.recordingUrl || "No recording available.";
      const endedReason = payload.message.endedReason || "normal";

      console.log(`[Vapi End of Call Report] Call: ${callId} for ${customerNumber}`);

      // Extract GHL Contact ID from Vapi call metadata
      const ghlContactId = payload.message.call?.metadata?.ghlContactId;
      const GHL_API_KEY = process.env.GHL_PRIVATE_TOKEN; // GHL Location Access Token

      if (ghlContactId && GHL_API_KEY) {
        console.log(`Syncing call notes back to GHL Contact: ${ghlContactId}`);

        const noteBody = `📞 AI Outbound Call Log
----------------------------------------
Status: Completed
Reason Ended: ${endedReason}

Summary:
${summary}

Recording: ${recordingUrl}
----------------------------------------
Full Transcript:
${transcript}`;

        // Call GoHighLevel (LeadConnector) API v2 to add notes
        // Documentation: https://api.gohighlevel.com/
        const ghlResponse = await fetch(`https://services.leadconnectorhq.com/contacts/${ghlContactId}/notes`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${GHL_API_KEY}`,
            "Version": "2021-07-28",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            body: noteBody
          })
        });

        const ghlData = await ghlResponse.json();

        if (!ghlResponse.ok) {
          console.error(`GHL Notes API sync error status ${ghlResponse.status}:`, ghlData);
        } else {
          console.log(`Successfully posted AI call log to GHL Contact: ${ghlContactId}`);
        }
      } else {
        if (!ghlContactId) {
          console.log("Call was not initiated from a GHL workflow trigger (missing ghlContactId metadata). Skipping GHL notes sync.");
        }
        if (!GHL_API_KEY) {
          console.warn("GHL_PRIVATE_TOKEN environment variable is missing. Cannot sync call notes back to GHL CRM.");
        }
      }
    }

    return NextResponse.json({ success: true, received: true });

  } catch (error: any) {
    console.error("Vapi webhook receiver error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
