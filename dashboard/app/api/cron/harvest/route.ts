import { NextResponse } from "next/server";
import { exec } from "child_process";
import path from "path";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");
  const query = searchParams.get("query") || "plumbers in Houston, TX";
  const limit = searchParams.get("limit") || "3";

  // Simple token authentication check
  const CRON_SECRET = process.env.CRON_SECRET || "plumbify_cron_default_secret_2026";
  if (secret !== CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized access token" }, { status: 401 });
  }

  const scriptPath = path.join(process.cwd(), "scripts", "harvest_leads.py");

  return new Promise<NextResponse>((resolve) => {
    // Sanitize query to prevent shell command injection
    const sanitizedQuery = query.replace(/[^a-zA-Z0-9\s,.-]/g, "");
    const sanitizedLimit = parseInt(limit, 10) || 3;

    console.log(`[API CRON] Spawning harvest subprocess: query="${sanitizedQuery}", limit=${sanitizedLimit}`);
    
    exec(
      `python3 "${scriptPath}" --query "${sanitizedQuery}" --limit ${sanitizedLimit}`,
      (error, stdout, stderr) => {
        if (error) {
          console.error(`[API CRON ERROR] ${error.message}`);
          resolve(
            NextResponse.json(
              { error: "Subprocess execution failed", details: error.message, stderr },
              { status: 500 }
            )
          );
          return;
        }
        console.log("[API CRON] Harvest completed successfully.");
        resolve(NextResponse.json({ success: true, output: stdout.trim() }));
      }
    );
  });
}
