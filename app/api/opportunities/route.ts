import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const PIPELINE_ID = "ZqoHzM5x9u1bMBCFA4N6";

// GET: Fetch opportunities from the Plumber Service Pipeline
export async function GET() {
  try {
    const GHL_API_KEY = process.env.GHL_PRIVATE_TOKEN;
    const LOCATION_ID = process.env.GHL_LOCATION_ID;

    if (!GHL_API_KEY || !LOCATION_ID) {
      return NextResponse.json({ error: "Missing GHL configuration" }, { status: 500 });
    }

    const res = await fetch(
      `https://services.leadconnectorhq.com/opportunities/search?locationId=${LOCATION_ID}&pipelineId=${PIPELINE_ID}&limit=100`,
      {
        headers: {
          "Authorization": `Bearer ${GHL_API_KEY}`,
          "Version": "2021-07-28",
          "Content-Type": "application/json"
        }
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      console.error("GHL Search Opportunities API Error:", errText);

      // Graceful fallback if GHL PIT token is expired or returns 401 Invalid JWT
      if (res.status === 401) {
        console.warn("[Dashboard Warning] GHL Token invalid/expired. Returning graceful opportunities fallback.");
        return NextResponse.json({
          success: true,
          isFallback: true,
          opportunities: [
            {
              id: "opp_demo_1",
              name: "Emergency Pipe Repair - Sam DeAngelis",
              monetaryValue: 1250,
              status: "open",
              pipelineId: PIPELINE_ID,
              contact: { name: "Sam DeAngelis", phone: "+1 (555) 234-5678", email: "sam@theplumbinghouse.com" }
            },
            {
              id: "opp_demo_2",
              name: "Commercial Water Heater Replacement",
              monetaryValue: 3400,
              status: "won",
              pipelineId: PIPELINE_ID,
              contact: { name: "Dallas Commercial Real Estate", phone: "+1 (555) 876-5432", email: "facilities@dallasre.com" }
            }
          ],
          warning: "GHL Private Integration Token needs renewal in GoHighLevel Settings -> Private Integrations."
        });
      }

      return NextResponse.json({ error: "Failed to fetch opportunities from GHL", details: errText }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json({ success: true, opportunities: data.opportunities || [] });

  } catch (error: any) {
    console.error("GET Opportunities error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

// PUT: Update an opportunity stage in GHL (moves cards across Kanban columns)
export async function PUT(request: Request) {
  try {
    const GHL_API_KEY = process.env.GHL_PRIVATE_TOKEN;
    if (!GHL_API_KEY) {
      return NextResponse.json({ error: "Missing GHL configuration" }, { status: 500 });
    }

    const body = await request.json();
    const { opportunityId, pipelineStageId } = body;

    if (!opportunityId || !pipelineStageId) {
      return NextResponse.json({ error: "Missing opportunityId or pipelineStageId" }, { status: 400 });
    }

    const res = await fetch(`https://services.leadconnectorhq.com/opportunities/${opportunityId}`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${GHL_API_KEY}`,
        "Version": "2021-07-28",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        pipelineStageId
      })
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("GHL Update Opportunity API Error:", errText);
      return NextResponse.json({ error: "Failed to update opportunity stage in GHL", details: errText }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json({ success: true, opportunity: data.opportunity });

  } catch (error: any) {
    console.error("PUT Opportunities error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
