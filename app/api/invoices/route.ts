import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// GET: Fetch invoices from GHL
export async function GET() {
  try {
    const GHL_API_KEY = process.env.GHL_PRIVATE_TOKEN;
    const LOCATION_ID = process.env.GHL_LOCATION_ID;

    if (!GHL_API_KEY || !LOCATION_ID) {
      return NextResponse.json({ error: "Missing GHL configuration" }, { status: 500 });
    }

    const res = await fetch(`https://services.leadconnectorhq.com/invoices/?locationId=${LOCATION_ID}&limit=50`, {
      headers: {
        "Authorization": `Bearer ${GHL_API_KEY}`,
        "Version": "2021-07-28",
        "Content-Type": "application/json"
      }
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("GHL Invoices API Error:", errText);
      return NextResponse.json({ error: "Failed to fetch invoices from GHL", details: errText }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json({ 
      success: true, 
      invoices: data.invoices || [],
      total: data.total || 0
    });

  } catch (error: any) {
    console.error("GET Invoices error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
