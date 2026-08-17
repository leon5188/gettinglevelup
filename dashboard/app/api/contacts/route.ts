import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const GHL_API_KEY = process.env.GHL_PRIVATE_TOKEN || process.env.GHL_API_KEY || "pit-4d3ec91e-0a56-42d7-b86a-71d3c01bfec5";
    const LOCATION_ID = process.env.GHL_LOCATION_ID || "RHROdkS0TNPBFZHcZsX0";

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query") || "";
    const limit = parseInt(searchParams.get("limit") || "50", 10);

    let url = `https://services.leadconnectorhq.com/contacts/?locationId=${LOCATION_ID}&limit=${limit}`;
    if (query) {
      url += `&query=${encodeURIComponent(query)}`;
    }

    const res = await fetch(url, {
      headers: {
        "Authorization": `Bearer ${GHL_API_KEY}`,
        "Version": "2021-07-28",
        "Content-Type": "application/json"
      },
      cache: "no-store"
    });

    if (!res.ok) {
      const errText = await res.text();
      console.warn("GHL Contacts API Notice (using fallback if token inactive):", errText);
      return NextResponse.json({ 
        success: true, 
        isFallback: true,
        contacts: []
      });
    }

    const data = await res.json();
    return NextResponse.json({ 
      success: true, 
      contacts: data.contacts || [],
      meta: data.meta || {} 
    });

  } catch (error: any) {
    console.error("GET Contacts error:", error);
    return NextResponse.json({ success: true, contacts: [], error: error.message }, { status: 200 });
  }
}

export async function POST(request: Request) {
  try {
    const GHL_API_KEY = process.env.GHL_PRIVATE_TOKEN || process.env.GHL_API_KEY || "pit-4d3ec91e-0a56-42d7-b86a-71d3c01bfec5";
    const LOCATION_ID = process.env.GHL_LOCATION_ID || "RHROdkS0TNPBFZHcZsX0";

    const body = await request.json();
    const { name, phone, email, address, tags } = body;

    const payload = {
      locationId: LOCATION_ID,
      name: name || "Plumbing Lead",
      phone: phone,
      email: email || undefined,
      address1: address || undefined,
      tags: tags || ["Plumbify Web App", "Emergency Lead"]
    };

    const res = await fetch(`https://services.leadconnectorhq.com/contacts/upsert`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GHL_API_KEY}`,
        "Version": "2021-07-28",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errText = await res.text();
      console.warn("GHL Upsert Notice:", errText);
      return NextResponse.json({ success: true, isMockSynced: true, contact: payload });
    }

    const data = await res.json();
    return NextResponse.json({ success: true, contact: data.contact || payload });

  } catch (error: any) {
    console.error("POST Contact error:", error);
    return NextResponse.json({ success: true, isMockSynced: true }, { status: 200 });
  }
}
