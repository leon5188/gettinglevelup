import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    let body;
    try {
      body = await req.json();
    } catch (e) {
      console.error("[Onboarding Webhook] Failed to parse JSON body:", e);
      return NextResponse.json(
        { success: false, error: "Invalid JSON body" },
        { status: 400 }
      );
    }

    console.log("[Onboarding Webhook] Received payload:", body);

    // Extract contactId from payload, supporting multiple webhook format structures
    const contactId = body.contactId || body.contact_id || body.id || body.contact?.id;

    if (!contactId) {
      console.warn("[Onboarding Webhook] No contact ID found in payload");
      return NextResponse.json(
        { success: false, error: "Missing contactId in payload" },
        { status: 400 }
      );
    }

    const GHL_API_KEY = process.env.GHL_PRIVATE_TOKEN || process.env.GHL_API_KEY;
    const LOCATION_ID = process.env.GHL_LOCATION_ID;

    if (!GHL_API_KEY || !LOCATION_ID) {
      console.error("[Onboarding Webhook] GHL API configuration missing in environment variables");
      return NextResponse.json(
        { success: false, error: "GHL API configuration missing" },
        { status: 500 }
      );
    }

    const ghlHeaders = {
      "Authorization": `Bearer ${GHL_API_KEY}`,
      "Version": "2021-07-28",
      "Content-Type": "application/json"
    };

    const ghlConvHeaders = {
      "Authorization": `Bearer ${GHL_API_KEY}`,
      "Version": "2021-04-15",
      "Content-Type": "application/json"
    };

    // 1. Fetch Contact Details from GHL
    console.log(`[Onboarding Webhook] Fetching details for contact: ${contactId}`);
    const contactRes = await fetch(`https://services.leadconnectorhq.com/contacts/${contactId}`, {
      headers: ghlHeaders
    });

    if (!contactRes.ok) {
      const errText = await contactRes.text();
      throw new Error(`Failed to fetch contact details from GHL: ${errText}`);
    }

    const contactData = await contactRes.json();
    const contact = contactData.contact;

    const firstName = contact.firstName || "there";
    const lastName = contact.lastName || "";
    const email = contact.email;
    const phone = contact.phone;

    console.log(`[Onboarding Webhook] Processing onboarding for: ${firstName} ${lastName} (Email: ${email || "none"}, Phone: ${phone || "none"})`);

    // 2. Tag Contact with Onboarding Tags
    console.log(`[Onboarding Webhook] Tagging contact ${contactId} with onboarding tags`);
    const tagRes = await fetch(`https://services.leadconnectorhq.com/contacts/${contactId}/tags`, {
      method: "POST",
      headers: ghlHeaders,
      body: JSON.stringify({
        tags: ["onboarded", "client-portal-active"]
      })
    });

    if (!tagRes.ok) {
      const errText = await tagRes.text();
      console.warn(`[Onboarding Webhook] Warning: Failed to add tags: ${errText}`);
    } else {
      console.log(`[Onboarding Webhook] Successfully added onboarding tags`);
    }

    // 3. Send Welcome SMS Message if a phone number is registered
    if (phone) {
      console.log(`[Onboarding Webhook] Sending welcome SMS to: ${phone}`);
      const smsMessage = `Hi ${firstName}! Welcome to Plumbify. Your account onboarding is complete. We will follow up with your booking schedule shortly.`;
      
      const smsRes = await fetch("https://services.leadconnectorhq.com/conversations/messages", {
        method: "POST",
        headers: ghlConvHeaders,
        body: JSON.stringify({
          type: "SMS",
          contactId: contactId,
          message: smsMessage
        })
      });

      if (!smsRes.ok) {
        const errText = await smsRes.text();
        console.warn(`[Onboarding Webhook] Warning: Failed to send SMS: ${errText}`);
      } else {
        console.log(`[Onboarding Webhook] Welcome SMS sent successfully`);
      }
    } else {
      console.log("[Onboarding Webhook] Skipping SMS welcome: No phone number present");
    }

    // 4. Send Onboarding Welcome Email if an email is registered
    if (email) {
      console.log(`[Onboarding Webhook] Sending welcome email to: ${email}`);
      try {
        const templatePath = path.join(process.cwd(), "templates/emails/trial-welcome.html");
        let htmlTemplate = fs.readFileSync(templatePath, "utf-8");

        // Dynamic placeholders replacements
        const calendarLink = process.env.GHL_CALENDAR_LINK || "https://dashboard.plumbify.net/schedule";
        const preferencesLink = "https://dashboard.plumbify.net/preferences";
        const unsubscribeLink = "https://dashboard.plumbify.net/unsubscribe";

        htmlTemplate = htmlTemplate
          .replace(/\{\{contact\.first_name\}\}/g, firstName)
          .replace(/\{\{contact\.email\}\}/g, email)
          .replace(/\{\{location\.calendar_link\}\}/g, calendarLink)
          .replace(/\{\{preferences_link\}\}/g, preferencesLink)
          .replace(/\{\{unsubscribe_link\}\}/g, unsubscribeLink);

        const emailRes = await fetch("https://services.leadconnectorhq.com/conversations/messages", {
          method: "POST",
          headers: ghlConvHeaders,
          body: JSON.stringify({
            type: "Email",
            contactId: contactId,
            subject: "Welcome to Plumbify!",
            html: htmlTemplate
          })
        });

        if (!emailRes.ok) {
          const errText = await emailRes.text();
          console.warn(`[Onboarding Webhook] Warning: Failed to send email: ${errText}`);
        } else {
          console.log(`[Onboarding Webhook] Welcome email sent successfully`);
        }
      } catch (fileError) {
        console.error("[Onboarding Webhook] Failed to read or render email template:", fileError);
      }
    } else {
      console.log("[Onboarding Webhook] Skipping Email welcome: No email address present");
    }

    // 5. Create Opportunity in the [PLMB] Onboarding Pipeline (ckxHKSLsbidJcrf4r8Le)
    // inside the first stage "Account Created" (0b51c229-4c0b-4f32-a765-cc372fcf1995)
    console.log(`[Onboarding Webhook] Creating opportunity in Onboarding Pipeline for ${firstName} ${lastName}`);
    const opportunityName = `${firstName} ${lastName}`.trim() + " - Onboarding";
    
    const oppRes = await fetch("https://services.leadconnectorhq.com/opportunities/", {
      method: "POST",
      headers: ghlHeaders,
      body: JSON.stringify({
        name: opportunityName,
        pipelineId: "ckxHKSLsbidJcrf4r8Le",
        pipelineStageId: "0b51c229-4c0b-4f32-a765-cc372fcf1995",
        contactId: contactId,
        status: "open",
        locationId: LOCATION_ID
      })
    });

    if (!oppRes.ok) {
      const errText = await oppRes.text();
      console.warn(`[Onboarding Webhook] Warning: Failed to create opportunity: ${errText}`);
    } else {
      const oppData = await oppRes.json();
      console.log(`[Onboarding Webhook] Onboarding opportunity created successfully with ID: ${oppData.opportunity?.id}`);
    }

    return NextResponse.json({
      success: true,
      message: `Onboarding completed successfully for ${firstName}`,
      contactId
    });

  } catch (error: any) {
    console.error("[Onboarding Webhook] Server error processing onboarding:", error.message || error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
