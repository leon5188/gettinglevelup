import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { messages, language } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "Gemini API key is not configured." }, { status: 500 });
    }

    // Map message roles: user -> user, agent -> model
    const contents = messages
      .filter((m: any) => m.text && m.text.trim())
      .map((m: any) => ({
        role: m.sender === "user" ? "user" : "model",
        parts: [{ text: m.text }]
      }));

    if (contents.length === 0) {
      return NextResponse.json({ error: "No messages to process" }, { status: 400 });
    }

    const systemPrompt = `You are Plumbify's AI Sales & Operations Copilot—a highly competent, proactive AI agent and CRM specialist.
Your goal is to answer questions about Plumbify, demonstrate product features, and execute back-office operations.

## 🗣️ Persona & Communication Rules:
1. **Consultative Sales Persona**: Speak with confidence, professional clarity, and a sales-oriented tone (like a senior tech consultant combined with an experienced dispatch manager).
2. **Language Matching**: Answer immediately in the exact same language the user communicates in (e.g., Traditional Chinese 繁體中文, English, Spanish, French).
3. **Extreme Conciseness (For Voice/TTS)**: Keep replies under 2-3 sentences max. Short, punchy answers are critical for smooth voice interaction and subtitle readability.
4. **No Tool Leakage**: NEVER mention technical function or tool names (like 'startOnboardingTour', 'checkApiStatus') in your speech. Speak naturally (e.g., "I'm compiling your synced contacts to CSV now" instead of "I'm calling the exportLeadsToCsv tool").
5. **Proactive Actions**: Do not just talk about features—actively suggest and execute them!
   - If they ask about reviews -> explain review gating and call 'showReputationDashboard'.
   - If they ask about cost/plans -> explain the Starter/Growth tiers and call 'upgradeSubscription' with target tier.
   - If they want to try it out or see how it works -> call 'startOnboardingTour'.

## 📚 Plumbify Product Knowledge Base:
- **Plumbify**: The #1 AI-first CRM and scheduling platform built specifically for plumbing and home service businesses.
- **Missed-Call Auto Text-Back**: 70% of customers call the next competitor if you miss a call. Plumbify detects missed calls and texts back in 5 seconds. Captures 24/7 leads, scheduling appointments automatically, capturing an average ticket value of $850+ per job.
- **Unified Inbox & WeChat Sync**: Syncs SMS and WeChat/WeCom chats. Offers automatic dual-translation, letting English-speaking dispatchers schedule Chinese-speaking customer leads seamlessly.
- **Dispatch Calendar**: Auto-schedules, optimizes routes, and assigns the closest available tech (like Dave or Mike) in GHL.
- **Tap-to-Pay POS**: Technicians can invoice in 3 seconds. Customers pay instantly by tapping credit cards to the tech's phone.
- **AI Recruiting**: Growth tier screens applicants, qualifies trade license types, and schedules master plumber interviews.
- **Pricing & 14-Day Challenge**:
  - Starter ($197/mo): Missed-call text-back, calendar, invoices, Tap-to-Pay.
  - Growth ($397/mo): Adds AI recruiting and WeChat synchronization.
  - 14-Day Free Challenge: We set everything up. If Plumbify does not capture and secure at least 3 trade jobs you would have otherwise missed, you pay $0.

## 🛠️ Tool Execution Mapping:
You are equipped with real tools that control the user's dashboard simulation. You MUST call them when appropriate:
- Call 'startOnboardingTour' to start the interactive walkthrough tour.
- Call 'checkApiStatus' to scan Twilio, WeChat, and GHL gateway connections.
- Call 'upgradeSubscription' to upgrade subscription tiers (pass "starter", "growth", or "enterprise" as the 'tier' argument).
- Call 'exportLeadsToCsv' to compile GHL contacts database and trigger a CSV file download.
- Call 'routeToHumanLeon' to package dialogue history and trigger a human routing callback form.
- Call 'showReputationDashboard' to open the Google reviews reputation filtering dashboard.`;

    // Define function declarations for Gemini
    const tools = [
      {
        functionDeclarations: [
          {
            name: "startOnboardingTour",
            description: "Starts the interactive 3-minute self-serve onboarding tour of the Plumbify dashboards."
          },
          {
            name: "checkApiStatus",
            description: "Scans and checks the integration status of Twilio SMS gateway, WeChat/WeCom gateway, and GoHighLevel CRM."
          },
          {
            name: "upgradeSubscription",
            description: "Triggers the mobile billing terminal to upgrade the subscription tier.",
            parameters: {
              type: "OBJECT",
              properties: {
                tier: {
                  type: "STRING",
                  enum: ["starter", "growth", "enterprise"],
                  description: "The target subscription tier to upgrade to."
                }
              },
              required: ["tier"]
            }
          },
          {
            name: "exportLeadsToCsv",
            description: "Stages, compiles, and exports all synced leads and GHL CRM contacts into a downloadable CSV file."
          },
          {
            name: "routeToHumanLeon",
            description: "Packages dialogue history and routes the customer to Leon, our master plumber representative, for human handover."
          },
          {
            name: "showReputationDashboard",
            description: "Shows the Google Maps reputation reviews dashboard mockup illustrating rating filtering."
          }
        ]
      }
    ];

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(geminiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: contents,
        systemInstruction: {
          parts: [{ text: systemPrompt }]
        },
        tools: tools,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 800
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ error: errorData.error?.message || "Gemini API call failed" }, { status: response.status });
    }

    const data = await response.json();
    const candidate = data.candidates?.[0];
    const replyText = candidate?.content?.parts?.[0]?.text || "";
    const functionCall = candidate?.content?.parts?.[0]?.functionCall;

    // If Gemini decided to call a function, map it to a structured response
    if (functionCall) {
      const toolName = functionCall.name;
      const args = functionCall.args || {};
      
      let description = "Executing tool...";
      if (toolName === "startOnboardingTour") {
        description = language === "zh-TW" 
          ? "正在為您啟動 Plumbify 系統功能導覽。請注意左側手機模擬器。"
          : "Initiating the Plumbify dashboards interactive tour now. Please look at the left pane.";
      } else if (toolName === "checkApiStatus") {
        description = language === "zh-TW" 
          ? "正在連線並掃描 API 閘道... 正在檢查 Twilio、企業微信與 GHL 接口。"
          : "Scanning connected API gateways... Checking Twilio SMS, WeChat work, and GHL CRM webhook integrations.";
      } else if (toolName === "upgradeSubscription") {
        const targetTier = args.tier || "growth";
        description = language === "zh-TW" 
          ? `已為您載入行動信用卡感應感應升級終端。已選擇方案：${targetTier.toUpperCase()}。`
          : `Triggering subscription upgrade to ${targetTier.toUpperCase()}. Safety contactless payment terminal loaded on the left pane.`;
      } else if (toolName === "exportLeadsToCsv") {
        description = language === "zh-TW" 
          ? "正在從資料庫撈取已同步的水電客戶資料... 正在彙整並匯出為 CSV 檔案。"
          : "Querying contact databases... Staging synced leads compilation and exporting to CSV.";
      } else if (toolName === "routeToHumanLeon") {
        description = language === "zh-TW" 
          ? "正在打包我們此對對話記錄... 正在為您轉接人工專員 Leon。請在左側留下您的聯繫方式。"
          : "Packaging conversation logs... Routing you to our master plumber representative, Leon. Please fill out the contact form on the left.";
      } else if (toolName === "showReputationDashboard") {
        description = language === "zh-TW" 
          ? "已載入口碑與商家評價過濾看板。您可以查看左側評分統計與對應導向。"
          : "Loading Google Maps reputation review gate dashboard mockup on the left pane.";
      }

      return NextResponse.json({
        reply: description,
        toolCall: {
          name: toolName,
          args: args
        }
      });
    }

    return NextResponse.json({ reply: replyText });
  } catch (err: any) {
    console.error("Gemini route error:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
