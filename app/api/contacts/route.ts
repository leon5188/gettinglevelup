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
