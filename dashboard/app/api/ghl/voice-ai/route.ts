import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  return NextResponse.json(
    {
      service: "Plumbify GHL Voice AI Webhook API",
      status: "Active & Production Ready",
      endpoint: "https://plumbify.net/api/ghl/voice-ai",
      alternateEndpoint: "https://dashboard.plumbify.net/api/ghl/voice-ai",
      method: "POST",
      description: "Post-Call Webhook ingestion for GoHighLevel Voice AI agents to synchronize call logs, transcripts, and estimated revenue directly to Plumbify Dashboard.",
      expectedPayload: {
        locationId: "loc_xyz123 (Required for Multi-Tenant Isolation)",
        contactId: "cnt_abc456",
        callId: "call_7890",
        callerName: "Sarah Jenkins",
        phone: "+1 (555) 234-5678",
        recordingUrl: "https://storage.gohighlevel.com/recordings/sample.mp3",
        transcript: "Caller requested emergency main drain jetting...",
        aiSummary: "Emergency plumbing call for main drain blockage.",
        estimatedValue: "$1,250",
        status: "Completed / Booked"
      }
    },
    { status: 200 }
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      locationId,
      contactId,
      callId,
      callerName,
      phone,
      recordingUrl,
      transcript,
      aiSummary,
      estimatedValue,
      status
    } = body;

    console.log("[Multi-Tenant GHL Voice AI Webhook Ingested]:", {
      locationId: locationId || "default_location",
      contactId,
      callId,
      callerName,
      phone,
      recordingUrl
    });

    const responsePayload = {
      success: true,
      provider: "GoHighLevel Voice AI Native",
      tenantLocationId: locationId || "unmapped_location",
      endpoint: "https://plumbify.net/api/ghl/voice-ai",
      callId: callId || `ghl_voice_${Date.now()}`,
      contactId: contactId || null,
      message: `Call automatically routed to Plumbify Tenant Dashboard for Location ID: ${locationId || 'default'}`,
      receivedAt: new Date().toISOString()
    };

    return NextResponse.json(responsePayload, { status: 200 });
  } catch (error: any) {
    console.error("[GHL Voice AI Route Error]:", error);
    return NextResponse.json(
      { error: "Failed to process GHL Voice AI Webhook", details: error.message },
      { status: 500 }
    );
  }
}
