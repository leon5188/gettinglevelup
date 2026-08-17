import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    console.log("GHL Workflow Webhook Triggered with payload:", JSON.stringify(payload, null, 2));

    // GHL passes contact details inside the webhook payload
    const contactId = payload.contact_id || payload.id;
    const phone = payload.phone;
    const firstName = payload.first_name || "";
    const lastName = payload.last_name || "";
    let fullName = `${firstName} ${lastName}`.trim() || "Customer";
    if (fullName.length > 40) {
      fullName = fullName.substring(0, 37) + "...";
    }

    if (!phone) {
      console.error("GHL Trigger failed: No phone number provided.");
      return NextResponse.json({ error: "Phone number is required in webhook payload" }, { status: 400 });
    }

    const VAPI_API_KEY = process.env.VAPI_API_KEY;
    const VAPI_PHONE_NUMBER_ID = process.env.VAPI_PHONE_NUMBER_ID;
    const VAPI_ASSISTANT_ID = process.env.VAPI_ASSISTANT_ID;

    // Fallback simulation mode if Vapi keys are missing
    if (!VAPI_API_KEY || !VAPI_ASSISTANT_ID || !VAPI_PHONE_NUMBER_ID) {
      console.warn("Vapi environment variables missing. Simulating GHL Trigger call.");
      return NextResponse.json({
        success: true,
        message: "Simulation: Call triggered successfully for GHL contact.",
        simulated: true,
        contactId,
        phone,
        fullName
      });
    }

    // Call Vapi phone trigger API
    const response = await fetch("https://api.vapi.ai/call/phone", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${VAPI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        customer: {
          number: phone,
          name: fullName
        },
        phoneNumberId: VAPI_PHONE_NUMBER_ID,
        assistantId: VAPI_ASSISTANT_ID,
        // Crucial: Pass GHL Contact ID in Vapi metadata so it comes back in end-of-call webhook
        metadata: {
          ghlContactId: contactId
        }
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Failed to trigger call via Vapi:", data);
      return NextResponse.json({ error: data.message || "Failed to trigger call via Vapi" }, { status: response.status });
    }

    console.log(`Vapi Call initiated for GHL Contact: ${contactId}, Call ID: ${data.id}`);
    return NextResponse.json({
      success: true,
      callId: data.id,
      status: data.status,
      message: "Vapi call triggered successfully for GHL contact"
    });

  } catch (error: any) {
    console.error("GHL Trigger API server error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
