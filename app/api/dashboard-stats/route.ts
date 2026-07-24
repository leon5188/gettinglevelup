import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const PIPELINE_ID = "ZqoHzM5x9u1bMBCFA4N6";

export async function GET() {
  try {
    const GHL_API_KEY = process.env.GHL_PRIVATE_TOKEN;
    const LOCATION_ID = process.env.GHL_LOCATION_ID;

    // Define standard baseline mock values to serve as safe fallbacks
    const defaultStats = {
      capturedLeads: 184,
      savedRevenue: 150880,
      responseTime: "4.8 seconds",
      reviewsCount: 98,
      averageRating: 4.87,
      activeTechs: 8,
      jobsDispatched: 312,
      recentLeads: [
        {
          id: "mock-1",
          name: "James Anderson",
          email: "j.anderson@example.com",
          phone: "+1 (512) 555-0192",
          source: "SMS Text-Back",
          date: new Date().toLocaleDateString(),
          tags: ["emergency", "burst-pipe"]
        },
        {
          id: "mock-2",
          name: "Sarah Miller",
          email: "smiller99@example.com",
          phone: "+1 (512) 555-0143",
          source: "WeChat Sync",
          date: new Date(Date.now() - 3600000).toLocaleDateString(),
          tags: ["water-heater", "quote"]
        },
        {
          id: "mock-3",
          name: "Michael Chen",
          email: "mchen_dev@example.com",
          phone: "+1 (512) 555-0188",
          source: "Google Ad",
          date: new Date(Date.now() - 7200000).toLocaleDateString(),
          tags: ["drain-clog"]
        }
      ]
    };

    if (!GHL_API_KEY || !LOCATION_ID) {
      console.warn("Missing GHL environment variables. Serving dashboard stats with baseline mocks.");
      return NextResponse.json(defaultStats);
    }

    let capturedLeads = defaultStats.capturedLeads;
    let recentLeads = defaultStats.recentLeads;
    let jobsDispatched = defaultStats.jobsDispatched;
    let savedRevenue = defaultStats.savedRevenue;

    // 1. Fetch total count of GHL contacts and recent leads list
    try {
      const contactsRes = await fetch(
        `https://services.leadconnectorhq.com/contacts/?locationId=${LOCATION_ID}&limit=5`,
        {
          headers: {
            "Authorization": `Bearer ${GHL_API_KEY}`,
            "Version": "2021-07-28",
            "Content-Type": "application/json"
          }
        }
      );

      if (contactsRes.ok) {
        const contactsData = await contactsRes.json();
        
        if (contactsData.meta && typeof contactsData.meta.total === "number") {
          capturedLeads = contactsData.meta.total;
        }

        const contactsList = contactsData.contacts || [];
        if (contactsList.length > 0) {
          recentLeads = contactsList.map((contact: any) => {
            let phone = contact.phone || "No Phone";
            if (phone !== "No Phone" && phone.length > 6) {
              phone = phone.slice(0, 4) + "***" + phone.slice(-4);
            }
            
            let email = contact.email || "No Email";
            if (email !== "No Email" && email.includes("@")) {
              const [name, domain] = email.split("@");
              email = name.slice(0, 3) + "***@" + domain;
            }

            let source = "Web Lead";
            const tags = contact.tags || [];
            if (tags.includes("plumbify-site-lead")) {
              source = "AI Chat Form";
            } else if (tags.includes("wechat")) {
              source = "WeChat Sync";
            } else if (tags.includes("sms")) {
              source = "SMS Text-Back";
            }

            return {
              id: contact.id,
              name: contact.contactName || `${contact.firstName || ""} ${contact.lastName || ""}`.trim() || "Anonymous Lead",
              email: email,
              phone: phone,
              source: source,
              date: contact.dateAdded ? new Date(contact.dateAdded).toLocaleDateString() : "Just Now",
              tags: tags.slice(0, 3)
            };
          });
        }
      }
    } catch (err) {
      console.error("Failed to fetch GHL contacts count:", err);
    }

    // 2. Fetch GHL Opportunities stats for the plumbing pipeline
    try {
      const oppsRes = await fetch(
        `https://services.leadconnectorhq.com/opportunities/search?location_id=${LOCATION_ID}&pipeline_id=${PIPELINE_ID}&limit=100`,
        {
          headers: {
            "Authorization": `Bearer ${GHL_API_KEY}`,
            "Version": "2021-07-28",
            "Content-Type": "application/json"
          }
        }
      );

      if (oppsRes.ok) {
        const oppsData = await oppsRes.json();
        const opportunities = oppsData.opportunities || [];
        
        // jobsDispatched is the total number of plumbing opportunities
        if (opportunities.length > 0) {
          jobsDispatched = opportunities.length;
        }

        // Calculate saved revenue dynamically based on all open & won opportunities
        // Fallback to defaultStats if there are no opportunities or they have 0 monetary value
        let calculatedRevenue = 0;
        opportunities.forEach((opp: any) => {
          if (opp.status === "won" || opp.status === "open") {
            calculatedRevenue += (opp.monetaryValue || 820); // Default to $820 per job if not set
          }
        });
        
        if (calculatedRevenue > 0) {
          savedRevenue = calculatedRevenue;
        }
      }
    } catch (err) {
      console.error("Failed to fetch GHL opportunities stats:", err);
    }

    return NextResponse.json({
      capturedLeads,
      savedRevenue,
      responseTime: "4.8 seconds", 
      reviewsCount: defaultStats.reviewsCount,
      averageRating: defaultStats.averageRating,
      activeTechs: defaultStats.activeTechs,
      jobsDispatched,
      recentLeads
    });

  } catch (error: any) {
    console.error("Dashboard Stats endpoint error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
