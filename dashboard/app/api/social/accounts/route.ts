import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const SOCIAL_GHL_API_KEY = "pit-fe3b2f12-f09f-4535-af7e-895d2792db89";
const SOCIAL_GHL_LOCATION_ID = "dcJGZR1L77vJd0rvaNI5";

export async function GET() {
  try {
    const res = await fetch(`https://services.leadconnectorhq.com/social-media-posting/${SOCIAL_GHL_LOCATION_ID}/accounts`, {
      headers: {
        "Authorization": `Bearer ${SOCIAL_GHL_API_KEY}`,
        "Version": "2021-07-28",
        "Content-Type": "application/json"
      }
    });

    const fallbackAccounts = [
      {
        id: "69d6cb9a8b1765ebe159bf8e_dcJGZR1L77vJd0rvaNI5_780908762106705_page",
        name: "Plumbify Local Services",
        type: "Facebook Page",
        avatarUrl: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=100&auto=format&fit=crop&q=60"
      },
      {
        id: "69dd2facfc11a01afc71d233_dcJGZR1L77vJd0rvaNI5_17841402990063945",
        name: "plumbify_dispatch",
        type: "Instagram Profile",
        avatarUrl: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=100&auto=format&fit=crop&q=60"
      },
      {
        id: "6a0a22625582647285725f38_dcJGZR1L77vJd0rvaNI5_AUddYTDCap_profile",
        name: "Plumbify Austin HQ",
        type: "LinkedIn Profile",
        avatarUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100&auto=format&fit=crop&q=60"
      }
    ];

    if (!res.ok) {
      console.warn("CRM Social Accounts API returned error status. Using preset fallback accounts for display.");
      return NextResponse.json({ success: true, accounts: fallbackAccounts, isDemo: true });
    }

    const data = await res.json();
    const accounts = data.accounts || [];

    if (accounts.length === 0) {
      return NextResponse.json({ success: true, accounts: fallbackAccounts, isDemo: true });
    }

    // Map GHL returned accounts format to our dashboard format
    const formattedAccounts = accounts.map((acc: any) => ({
      id: acc.id,
      name: acc.name || acc.username || "Connected Account",
      type: acc.type === "page" ? "Facebook Page" : acc.type === "profile" && acc.channel === "instagram" ? "Instagram Profile" : acc.channel === "linkedin" ? "LinkedIn Profile" : acc.type,
      avatarUrl: acc.picture || acc.avatar || "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=100&auto=format&fit=crop&q=60"
    }));

    return NextResponse.json({ success: true, accounts: formattedAccounts, isDemo: false });

  } catch (error: any) {
    console.error("GET Social accounts error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
