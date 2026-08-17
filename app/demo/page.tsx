"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Zap, 
  CheckCircle2, 
  ArrowRight, 
  Bot, 
  MapPin, 
  PhoneCall, 
  ShieldCheck, 
  Clock, 
  Users, 
  Truck,
  DollarSign,
  Star,
  Sparkles,
  ChevronRight,
  ExternalLink,
  MessageSquare,
  CreditCard,
  Send,
  Volume2,
  VolumeX,
  Layers,
  Activity,
  Calculator,
  Mic,
  Globe
} from "lucide-react";

interface TourStep {
  stepNum: number;
  timeLabel: string;
  title: string;
  subtitle: string;
  badge: string;
  desc: string;
  audioEN: string;
  audioZH: string;
  voiceoverEN: string;
  voiceoverZH: string;
  actionText: string;
  demoType: "recovery" | "dispatch" | "payment" | "review";
}

const TOUR_STEPS: TourStep[] = [
  {
    stepNum: 1,
    timeLabel: "0:00 - 0:45",
    title: "24/7 AI After-Hours Missed-Call Recovery",
    subtitle: "Instant SMS Text-Back in 4.8 Seconds",
    badge: "Never Miss Revenue",
    desc: "When an emergency call comes in at 8:30 PM on a Friday and rolls to voicemail, Plumbify fires an instant SMS to capture the job details and lock in the booking before they call your competitor.",
    audioEN: "/audio/step1_en.mp3",
    audioZH: "/audio/step1_zh.mp3",
    voiceoverEN: "Welcome to Plumbify! Every plumbing business owner knows the frustration... a $1,200 emergency main line job comes in at 8:30 PM on a Friday. Your front desk is closed, the call rolls to voicemail, and the customer hires your competitor 30 seconds later! With Plumbify, when an emergency call is missed, our 24/7 AI Recovery Engine instantly fires a personalized SMS text-back in 4.8 seconds... capturing the job details and locking in the booking on your schedule, before they can even call anyone else.",
    voiceoverZH: "欢迎体验 Plumbify！每个水暖工程公司老板都知道这个痛点：周五晚上 8 点半，一个 1,200 美金的紧急通渠单进来了。客服已经下班，电话响一声进了语音信箱，30 秒后，客户就找了你的竞争对手！使用 Plumbify，当夜间漏接来电时，系统会在 4.8 秒内自动给客户发送一条个性化短信，确认故障与地址并完成预订，彻底锁定订单！",
    actionText: "Simulate Incoming Call & Text-Back",
    demoType: "recovery"
  },
  {
    stepNum: 2,
    timeLabel: "0:45 - 1:30",
    title: "1-Click Live Truck & Tech Dispatch Desk",
    subtitle: "Real-Time Fleet & Dispatch Queue",
    badge: "Smart Dispatch",
    desc: "Master Plumbers and dispatchers see every truck's status and GPS zone. Click '1-Click Dispatch' to route job details and address straight to your technician's cell phone via SMS.",
    audioEN: "/audio/step2_en.mp3",
    audioZH: "/audio/step2_zh.mp3",
    voiceoverEN: "Next, let's look at the Live Dispatch Desk. You can see all your trucks and field technicians in real time—whether they're on-site in Santa Monica or standby in Pasadena. When an emergency job comes in, simply click '1-Click Dispatch', select an available tech, and Plumbify instantly routes the job details and address straight to your technician's cell phone via SMS.",
    voiceoverZH: "其次是 1-Click 智能调度台。您可以实时掌握每台工程车与技师的状态。有紧急派单需求时，只需点击‘一键派单’并选择空闲技师，系统就会瞬间将项目详情与 GPS 地址直接推送到技师手机上！",
    actionText: "Simulate 1-Click Truck Dispatch",
    demoType: "dispatch"
  },
  {
    stepNum: 3,
    timeLabel: "1:30 - 2:15",
    title: "On-Site Tap-to-Pay Mobile POS",
    subtitle: "Zero Card Hardware Required",
    badge: "Instant Cash Flow",
    desc: "Technicians collect credit card or Apple Pay payments directly on their smartphone at job completion. Zero hardware fees, instant funds settlement.",
    audioEN: "/audio/step3_en.mp3",
    audioZH: "/audio/step3_zh.mp3",
    voiceoverEN: "When the job is complete, there's no need for expensive card hardware. Technicians can take Tap-to-Pay credit card or Apple Pay payments right on their smartphone. As soon as the payment clears, funds settle instantly with automatic QuickBooks sync!",
    voiceoverZH: "项目完工后，技师无需携带昂贵的卡机，用手机就能直接进行 Tap-to-Pay 刷卡或 Apple Pay 收款。结账完成瞬间，资金秒级结算，并自动同步到 QuickBooks 账单！",
    actionText: "Simulate Mobile Tap-to-Pay Invoice",
    demoType: "payment"
  },
  {
    stepNum: 4,
    timeLabel: "2:15 - 3:00",
    title: "Google 5-Star Review Autopilot",
    subtitle: "Automatic Post-Job Review Booster",
    badge: "300% Review Boost",
    desc: "As soon as payment clears, Plumbify sends a personalized review link SMS to the customer, driving steady 5-star Google reviews on autopilot.",
    audioEN: "/audio/step4_en.mp3",
    audioZH: "/audio/step4_zh.mp3",
    voiceoverEN: "Finally, as soon as the payment clears, Plumbify automatically triggers a review request SMS with a direct 1-click link, driving steady 5-star Google reviews for your company on autopilot. Start your 14-day free trial today at Plumbify.net!",
    voiceoverZH: "最后，结账完成瞬间，Plumbify 会自动发送催评短信，为您的水暖公司在 Google 上源源不断带来 5 星好评。立即访问 Plumbify.net 开启 14 天免费试用吧！",
    actionText: "Simulate Auto Review Request",
    demoType: "review"
  }
];

export default function InteractiveDemoPage() {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [lang, setLang] = useState<"en" | "zh">("en");
  const [interactiveLog, setInteractiveLog] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const step = TOUR_STEPS[currentStepIdx];
  const activeAudioSrc = lang === "en" ? step.audioEN : step.audioZH;

  // Toggle Play / Pause Audio
  const togglePlayAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch((err) => console.error("Audio play error:", err));
    }
  };

  // Change Audio Source when step or language changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = activeAudioSrc;
      if (isPlaying) {
        audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      }
    }
  }, [currentStepIdx, lang]);

  const handleNextStep = () => {
    setCurrentStepIdx((prev) => (prev + 1) % TOUR_STEPS.length);
  };

  const handlePrevStep = () => {
    setCurrentStepIdx((prev) => (prev - 1 + TOUR_STEPS.length) % TOUR_STEPS.length);
  };

  const handleSimulateAction = () => {
    if (step.demoType === "recovery") {
      setInteractiveLog("📞 [Incoming Call +1 (310) 892-4411] -> 💬 [Auto SMS Sent]: 'Hi, Plumbify Dispatch here. Sorry we missed your call! Reply 1 for Emergency Pipe Repair.'");
    } else if (step.demoType === "dispatch") {
      setInteractiveLog("🚚 [Dispatch Triggered] -> Truck #1 (Carlos Mendez) received SMS: 'Job #102 assigned: 1420 Ocean Ave, Santa Monica. Emergency Burst Pipe.'");
    } else if (step.demoType === "payment") {
      setInteractiveLog("💳 [Tap-to-Pay Triggered] -> $850.00 charged via iPhone Contactless Pay. QuickBooks Receipt & SMS Sent!");
    } else if (step.demoType === "review") {
      setInteractiveLog("⭐ [Review Request Sent] -> SMS to Robert Sterling: 'Thanks for choosing Apex Plumbing! Rate Carlos's service: g.page/apex-plumbing/review'");
    }
    setTimeout(() => setInteractiveLog(null), 5000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-500 selection:text-white pb-20">
      {/* Hidden Audio Player */}
      <audio
        ref={audioRef}
        src={activeAudioSrc}
        onEnded={() => setIsPlaying(false)}
        preload="auto"
      />

      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 p-2.5 rounded-xl shadow-lg shadow-blue-500/20">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-xl text-white tracking-tight">Plumbify</span>
              <span className="ml-2 text-xs font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                Neural Voiceover Tour
              </span>
            </div>
          </Link>

          <div className="flex items-center space-x-3">
            {/* Language Selector */}
            <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700 text-xs font-bold">
              <button
                onClick={() => setLang("en")}
                className={`px-3 py-1 rounded-lg transition ${lang === "en" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"}`}
              >
                English Neural Voice
              </button>
              <button
                onClick={() => setLang("zh")}
                className={`px-3 py-1 rounded-lg transition ${lang === "zh" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"}`}
              >
                中文神经语音
              </button>
            </div>

            <a
              href="/dashboard"
              target="_blank"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-blue-600/20 transition flex items-center space-x-1.5"
            >
              <span>Open Dashboard</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </header>

      {/* Main Showcase Hero */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">

        {/* Hero Title */}
        <div className="text-center max-w-3xl mx-auto mb-8 space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-4 h-4" />
            <span>High-Fidelity Neural Voiceover Product Tour</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            How Plumbify Automates Your <span className="text-blue-400">Plumbing Business</span>
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Click <strong className="text-emerald-400">Play Audio Explanation</strong> below to hear ultra-realistic neural voiceover with natural human pauses and emotion.
          </p>
        </div>

        {/* Primary Audio Player Control Bar */}
        <div className="max-w-xl mx-auto mb-10 bg-slate-900 border border-blue-500/30 rounded-2xl p-4 shadow-xl flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-xl border ${isPlaying ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40 animate-pulse" : "bg-slate-800 text-slate-400 border-slate-700"}`}>
              <Volume2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center space-x-2">
                <span>{isPlaying ? "🔊 Playing Neural Voiceover..." : "Neural Voiceover Ready"}</span>
                {isPlaying && <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono">NEURAL AUDIO</span>}
              </div>
              <div className="text-[11px] text-slate-400">Voice: {lang === "en" ? "Christopher Neural (US Male)" : "Yunxi Neural (CN Male)"}</div>
            </div>
          </div>

          <button
            onClick={togglePlayAudio}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs transition shadow-lg flex items-center space-x-2 ${
              isPlaying
                ? "bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/20"
                : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/25"
            }`}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isPlaying ? "Pause Audio" : "Play Neural Voiceover"}</span>
          </button>
        </div>

        {/* Interactive Step Navigator */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {TOUR_STEPS.map((s, idx) => (
            <button
              key={s.stepNum}
              onClick={() => {
                setCurrentStepIdx(idx);
              }}
              className={`p-4 rounded-2xl border text-left transition relative overflow-hidden ${
                currentStepIdx === idx
                  ? "bg-blue-600/20 border-blue-500 text-white shadow-xl shadow-blue-600/10"
                  : "bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
              }`}
            >
              {currentStepIdx === idx && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-blue-500 animate-pulse" />
              )}
              <div className="text-[10px] font-mono text-blue-400 mb-1">{s.timeLabel}</div>
              <div className="text-xs font-bold text-white truncate">{s.title}</div>
              <div className="text-[11px] text-slate-400 mt-1 truncate">{s.badge}</div>
            </button>
          ))}
        </div>

        {/* Active Stage Showcase Card */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden mb-12">
          
          {/* Top Banner Info */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-6 mb-6">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 uppercase tracking-widest">
                  Step {step.stepNum} of 4 • {step.badge}
                </span>
                <span className="text-xs text-slate-500 font-mono">{step.timeLabel}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{step.title}</h2>
              <p className="text-slate-400 text-sm mt-1">{step.desc}</p>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleSimulateAction}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition shadow-lg shadow-blue-600/25 flex items-center space-x-1.5"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>{step.actionText}</span>
              </button>
            </div>
          </div>

          {/* Voiceover Script Transcript Box */}
          <div className="mb-6 p-4 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-[11px] font-bold text-blue-400 uppercase tracking-wider mb-1 flex items-center space-x-1.5">
              <Mic className="w-3.5 h-3.5 text-blue-400" />
              <span>Voiceover Script ({lang.toUpperCase()})</span>
            </div>
            <p className="text-xs text-slate-300 font-sans leading-relaxed italic">
              "{lang === "en" ? step.voiceoverEN : step.voiceoverZH}"
            </p>
          </div>

          {/* Toast Log Feedback */}
          {interactiveLog && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-950/90 border border-emerald-500/40 text-emerald-200 text-xs font-mono font-semibold animate-in fade-in flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{interactiveLog}</span>
            </div>
          )}

          {/* Interactive Simulation Viewport */}
          <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 sm:p-8 relative min-h-[300px] flex flex-col justify-between">
            
            {/* Step 1: Recovery Simulation */}
            {step.demoType === "recovery" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-2xl text-red-400">
                      <PhoneCall className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">After-Hours Emergency Missed Call</div>
                      <div className="text-xs text-slate-400">Incoming Caller: +1 (310) 892-4411 • Friday 8:32 PM</div>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-red-400 bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20">
                    Call Unanswered (Voicemail Prevented)
                  </span>
                </div>

                <div className="bg-slate-900 border border-blue-500/30 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between text-xs text-blue-400 font-bold">
                    <span className="flex items-center gap-1.5">
                      <Bot className="w-4 h-4" /> Plumbify AI Text-Back Triggered
                    </span>
                    <span className="text-slate-500">4.8s Latency</span>
                  </div>
                  <p className="text-xs font-mono text-slate-200 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800">
                    "Hi, this is Plumbify Dispatch for Apex Plumbing. Sorry we missed your call! Reply 1 for Emergency Main Line Repair, 2 for Water Heater, or reply with your address for instant dispatch."
                  </p>
                </div>
              </div>
            )}

            {/* Step 2: Dispatch Simulation */}
            {step.demoType === "dispatch" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-blue-500/20 border border-blue-500/30 rounded-2xl text-blue-400">
                      <Truck className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">Live Fleet Dispatch Board</div>
                      <div className="text-xs text-slate-400">4 Active Trucks in Los Angeles Metro Area</div>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                    1-Click SMS Routing
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
                    <div className="text-xs font-bold text-white">Truck #1 — Carlos Mendez (Master Plumber)</div>
                    <div className="text-xs text-amber-400 font-medium">On-Site: Main Line Jetting (35 mins left)</div>
                    <div className="text-[11px] text-slate-400">Zone: Santa Monica, CA</div>
                  </div>

                  <div className="bg-slate-900 border border-emerald-500/30 p-4 rounded-xl space-y-2">
                    <div className="text-xs font-bold text-white">Truck #3 — David Miller (Leak Specialist)</div>
                    <div className="text-xs text-emerald-400 font-medium">Available (Standby in Pasadena)</div>
                    <div className="text-[11px] text-slate-400">Ready to dispatch in 1 click</div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Mobile Payment Simulation */}
            {step.demoType === "payment" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-emerald-500/20 border border-emerald-500/30 rounded-2xl text-emerald-400">
                      <CreditCard className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">On-Site Mobile Tap-to-Pay POS</div>
                      <div className="text-xs text-slate-400">Zero Card Hardware Required • Smartphone Contactless Pay</div>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                    Instant QuickBooks Settlement
                  </span>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3 max-w-md mx-auto text-center">
                  <div className="text-xs text-slate-400">Apex Plumbing Invoice #1042</div>
                  <div className="text-3xl font-black text-white">$850.00</div>
                  <div className="text-xs text-emerald-400 font-semibold flex items-center justify-center space-x-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Paid via Apple Pay on iPhone</span>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Google Review Autopilot */}
            {step.demoType === "review" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-amber-500/20 border border-amber-500/30 rounded-2xl text-amber-400">
                      <Star className="w-6 h-6 fill-amber-400" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">5-Star Google Review Autopilot</div>
                      <div className="text-xs text-slate-400">Triggers automatically as soon as payment clears</div>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                    +300% Review Growth
                  </span>
                </div>

                <div className="bg-slate-900 border border-amber-500/30 p-5 rounded-2xl space-y-3">
                  <div className="text-xs font-bold text-amber-400 flex items-center space-x-1">
                    <span>★★★★★</span>
                    <span className="text-white ml-2">Robert Sterling (Verified Customer)</span>
                  </div>
                  <p className="text-xs text-slate-300 italic">
                    "Carlos came out at 10 PM for a burst pipe. Plumbify sent me a text in 5 seconds when I missed their call. Fastest response in LA!"
                  </p>
                </div>
              </div>
            )}

            {/* Bottom Controls */}
            <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={handlePrevStep}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold rounded-xl transition border border-slate-800"
              >
                Previous Step
              </button>

              <div className="text-xs text-slate-500 font-mono">
                Step {currentStepIdx + 1} of 4
              </div>

              <button
                onClick={handleNextStep}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition shadow-lg shadow-blue-600/20 flex items-center space-x-1"
              >
                <span>Next Step</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>

        {/* CTA Banner */}
        <div className="bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-slate-900 border border-blue-500/30 rounded-3xl p-8 text-center space-y-4">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
            Ready to Automate Your Plumbing Dispatch & Recover Missed Jobs?
          </h3>
          <p className="text-slate-300 text-xs sm:text-sm max-w-xl mx-auto">
            Flat pricing with zero per-tech markup. Save over $10,000/year compared to ServiceTitan.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <a
              href="/calculator"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-xl shadow-blue-600/25 transition flex items-center space-x-2"
            >
              <Calculator className="w-4 h-4" />
              <span>Calculate Your Missed Revenue Loss</span>
            </a>
            <a
              href="/dashboard"
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition flex items-center space-x-2"
            >
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>Launch Plumbify Dispatch Desk</span>
            </a>
          </div>
        </div>

      </main>
    </div>
  );
}
