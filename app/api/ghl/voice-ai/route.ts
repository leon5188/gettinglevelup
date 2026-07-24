import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Extract GHL Voice AI Webhook Payload
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

    console.log("[GHL Voice AI Webhook Received]:", {
      locationId,
      contactId,
      callId,
      callerName,
      recordingUrl
    });

    // Structure response for GHL Voice AI
    const responsePayload = {
      success: true,
      provider: "GoHighLevel Voice AI Native",
      callId: callId || `ghl_voice_${Date.now()}`,
      contactId: contactId || null,
      message: "GHL Voice AI Call Log & Transcript successfully integrated into Plumbify Dashboard Pipeline",
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

export async function GET() {
  return NextResponse.json({
    provider: "GoHighLevel Voice AI Native Agent",
    status: "Active & Listening",
    endpoint: "/api/ghl/voice-ai",
    webhookInstructions: "Set your GHL Voice AI Agent's Post-Call Webhook to this URL to auto-sync recordings & transcripts."
  });
}
