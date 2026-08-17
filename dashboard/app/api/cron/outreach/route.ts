import { NextResponse } from "next/server";
import { exec } from "child_process";
import path from "path";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");
  const limit = searchParams.get("limit") || "5";

  // Simple token authentication check
  const CRON_SECRET = process.env.CRON_SECRET || "plumbify_cron_default_secret_2026";
  if (secret !== CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized access token" }, { status: 401 });
  }

  const scriptPath = path.join(process.cwd(), "scripts", "outreach_agent_semantica_v1.py");

  return new Promise<NextResponse>((resolve) => {
    const sanitizedLimit = parseInt(limit, 10) || 5;

    console.log(`[API CRON] Spawning outreach subprocess: limit=${sanitizedLimit}`);
    
    // We source the semantica venv before running the python script so it has access to the graph engine
    exec(
      `source ~/semantica/venv/bin/activate && python3 "${scriptPath}" --limit ${sanitizedLimit}`,
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
        console.log("[API CRON] Outreach scripting completed successfully.");
        resolve(NextResponse.json({ success: true, output: stdout.trim() }));
      }
    );
  });
}
