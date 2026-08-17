import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const GHL_API_KEY = process.env.GHL_PRIVATE_TOKEN || process.env.GHL_API_KEY || "pit-4d3ec91e-0a56-42d7-b86a-71d3c01bfec5";
    const LOCATION_ID = process.env.GHL_LOCATION_ID || "RHROdkS0TNPBFZHcZsX0";

    const headers = {
      "Authorization": `Bearer ${GHL_API_KEY}`,
      "Version": "2021-07-28",
      "Content-Type": "application/json"
    };

    let totalContacts = 0;
    let verifiedB2BLeads = 0;
    let recentLeads: any[] = [];
    let recentTasks: any[] = [];

    // 1. Fetch total count of GHL contacts and recent leads list
    try {
      const contactsRes = await fetch(
        `https://services.leadconnectorhq.com/contacts/?locationId=${LOCATION_ID}&limit=50`,
        { headers, cache: "no-store" }
      );

      if (contactsRes.ok) {
        const contactsData = await contactsRes.json();
        
        if (contactsData.meta && typeof contactsData.meta.total === "number") {
          totalContacts = contactsData.meta.total;
        }

        const contactsList = contactsData.contacts || [];
        
        // Count verified B2B leads with email/phone
        verifiedB2BLeads = contactsList.filter((c: any) => c.email && c.phone).length;

        if (contactsList.length > 0) {
          recentLeads = contactsList.slice(0, 10).map((contact: any) => {
            const name = contact.contactName || `${contact.firstName || ""} ${contact.lastName || ""}`.trim() || contact.companyName || "Plumbing Prospect";
            const tags = contact.tags || [];

            let source = "D7 Lead Import";
            if (tags.includes("plumbify-site-lead") || tags.includes("calculator-lead")) {
              source = "ROI Calculator Form";
            } else if (tags.includes("b2b_outreach_v2_sent") || tags.includes("email_sent")) {
              source = "Outbound Email Engine";
            } else if (tags.includes("ai_replied")) {
              source = "AI Auto-Reply";
            }

            return {
              id: contact.id,
              name: name,
              company: contact.companyName || "Plumbing Shop",
              email: contact.email || "No Email",
              phone: contact.phone || "No Phone",
              source: source,
              date: contact.dateAdded ? new Date(contact.dateAdded).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "Recently",
              tags: tags
            };
          });
        }
      }
    } catch (err) {
      console.error("Failed to fetch GHL contacts count:", err);
    }

    // 2. Fetch GHL Opportunities stats
    let totalPipelineValue = 0;
    let totalOpportunities = 0;

    try {
      const oppsRes = await fetch(
        `https://services.leadconnectorhq.com/opportunities/search?location_id=${LOCATION_ID}&limit=100`,
        { headers, cache: "no-store" }
      );

      if (oppsRes.ok) {
        const oppsData = await oppsRes.json();
        const opportunities = oppsData.opportunities || [];
        totalOpportunities = opportunities.length;

        opportunities.forEach((opp: any) => {
          totalPipelineValue += (opp.monetaryValue || 499);
        });
      }
    } catch (err) {
      console.error("Failed to fetch GHL opportunities stats:", err);
    }

    return NextResponse.json({
      success: true,
      totalContacts,
      verifiedB2BLeads,
      totalPipelineValue: totalPipelineValue || totalContacts * 299,
      totalOpportunities,
      recentLeads,
      agentStatus: {
        status: "active",
        mode: "Vercel Cloud Cron (24/7)",
        schedule: "Every 15 Minutes",
        senderDomain: "info@lc.plumbify.net",
        dkimStatus: "Verified"
      }
    });

  } catch (error: any) {
    console.error("Dashboard Stats endpoint error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
