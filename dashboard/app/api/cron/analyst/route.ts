import { NextResponse } from "next/server";
import { exec } from "child_process";
import path from "path";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");

  // Simple token authentication check
  const CRON_SECRET = process.env.CRON_SECRET || "plumbify_cron_default_secret_2026";
  if (secret !== CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized access token" }, { status: 401 });
  }

  const scriptPath = path.join(process.cwd(), "scripts", "analyst_agent.py");

  return new Promise<NextResponse>((resolve) => {
    console.log("[API CRON] Spawning performance analyst subprocess...");
    
    exec(
      `python3 "${scriptPath}"`,
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
        console.log("[API CRON] Analyst reporting completed successfully.");
        resolve(NextResponse.json({ success: true, output: stdout.trim() }));
      }
    );
  });
}
