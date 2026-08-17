import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { phoneNumber, name } = await req.json();

    if (!phoneNumber) {
      return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
    }

    let customerName = name || "Customer";
    if (customerName.length > 40) {
      customerName = customerName.substring(0, 37) + "...";
    }

    const VAPI_API_KEY = process.env.VAPI_API_KEY;
    const VAPI_PHONE_NUMBER_ID = process.env.VAPI_PHONE_NUMBER_ID;
    const VAPI_ASSISTANT_ID = process.env.VAPI_ASSISTANT_ID;

    // Fallback Mock System for Testing if Vapi Keys are not set yet
    if (!VAPI_API_KEY || !VAPI_ASSISTANT_ID || !VAPI_PHONE_NUMBER_ID) {
      console.warn("Vapi environment variables are missing. Running in simulator mode.");
      
      // Simulate Vapi call initiation
      return NextResponse.json({
        success: true,
        message: "Simulation Mode: Outbound call triggered successfully.",
        simulated: true,
        callId: `sim-call-${Math.random().toString(36).substr(2, 9)}`,
        status: "queued"
      });
    }

    // Call Vapi API
    const response = await fetch("https://api.vapi.ai/call/phone", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${VAPI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        customer: {
          number: phoneNumber,
          name: customerName
        },
        phoneNumberId: VAPI_PHONE_NUMBER_ID,
        assistantId: VAPI_ASSISTANT_ID
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Vapi call trigger error:", data);
      return NextResponse.json({ error: data.message || "Failed to trigger call via Vapi" }, { status: response.status });
    }

    return NextResponse.json({
      success: true,
      callId: data.id,
      status: data.status,
      message: "Call initiated successfully."
    });

  } catch (error: any) {
    console.error("Vapi server error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
