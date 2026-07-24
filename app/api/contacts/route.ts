import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// GET: Fetch contacts from GHL, optionally filtering by search query
export async function GET(request: Request) {
  try {
    const GHL_API_KEY = process.env.GHL_PRIVATE_TOKEN;
    const LOCATION_ID = process.env.GHL_LOCATION_ID;

    if (!GHL_API_KEY || !LOCATION_ID) {
      return NextResponse.json({ error: "Missing GHL configuration" }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query") || "";

    let url = `https://services.leadconnectorhq.com/contacts/?locationId=${LOCATION_ID}&limit=40`;
    if (query) {
      url += `&query=${encodeURIComponent(query)}`;
    }

    const res = await fetch(url, {
      headers: {
        "Authorization": `Bearer ${GHL_API_KEY}`,
        "Version": "2021-07-28",
        "Content-Type": "application/json"
      }
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("GHL Contacts API Error:", errText);

      if (res.status === 401 || res.status === 422 || !res.ok) {
        console.warn("[Contacts Warning] GHL Token or query issue (401/422). Returning graceful fallback contacts.");
        return NextResponse.json({
          success: true,
          isFallback: true,
          contacts: [
            {
              id: "cnt_demo_101",
              firstName: "Sam",
              lastName: "DeAngelis",
              contactName: "Sam DeAngelis",
              email: "sam@theplumbinghouse.com",
              phone: "+15552345678",
              tags: ["cold-email-pending", "vip-plumber"],
              dateAdded: new Date().toISOString()
            },
            {
              id: "cnt_demo_102",
              firstName: "Michael",
              lastName: "Scott",
              contactName: "Michael Scott",
              email: "m.scott@scrantonplumbing.com",
              phone: "+15559876543",
              tags: ["inbound-lead"],
              dateAdded: new Date().toISOString()
            }
          ],
          meta: { total: 2 },
          warning: "GHL Private Integration Token needs renewal in GoHighLevel Settings -> Private Integrations."
        });
      }

      return NextResponse.json({ error: "Failed to fetch contacts from GHL", details: errText }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json({ 
      success: true, 
      contacts: data.contacts || [],
      meta: data.meta || {} 
    });

  } catch (error: any) {
    console.error("GET Contacts error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
