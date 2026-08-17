"use client";

import { useState } from "react";
import ROICalculator from "@/components/ROICalculator";
import OperationalDispatchDesk from "@/components/OperationalDispatchDesk";
import Link from "next/link";
import { 
  ArrowRight, 
  CheckCircle2, 
  MessageSquare, 
  Users, 
  Sparkles, 
  Clock, 
  Coins, 
  ChevronDown, 
  Check, 
  Loader2,
  PhoneCall,
  Smartphone,
  ShieldCheck,
  Lock,
  Shield,
  MapPin
} from "lucide-react";

export default function Home() {
  // Form submission state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // FAQ Accordion State
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Simulators State (AI Recruiter + POS Demo)
  const [screenStage, setScreenStage] = useState<"idle" | "calling" | "screening" | "scored">("idle");
  const [activeCandidate, setActiveCandidate] = useState<any>(null);
  const [paymentStage, setPaymentStage] = useState<"idle" | "tapping" | "reconciling" | "done">("idle");
  const [ledgerLogs, setLedgerLogs] = useState<any[]>([
    { id: "TXN-8291", date: "5 mins ago", amount: "$1,250.00", customer: "Gregory House", status: "QuickBooks Synced" },
    { id: "TXN-4012", date: "12 mins ago", amount: "$350.00", customer: "Eric Foreman", status: "QuickBooks Synced" }
  ]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "https://services.leadconnectorhq.com/hooks/RHROdkS0TNPBFZHcZsX0/webhook-trigger/bLjJ5zulAgeQluUDL9fM",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            first_name: formData.firstName,
            last_name: formData.lastName,
            phone: formData.phone,
            email: formData.email,
            source: "webform_optimized_homepage",
            message: formData.message || "Signed up for 14-Day Free Challenge"
          })
        }
      );

      if (response.ok) {
        setSuccess(true);
        setFormData({ firstName: "", lastName: "", phone: "", email: "", message: "" });
      } else {
        throw new Error("Failed to submit. Please try again.");
      }
    } catch (err) {
      setError("We encountered an issue submitting your request. Please check your network and try again.");
    } finally {
      setLoading(false);
    }
  };

  const startScreeningSimulation = async () => {
    setScreenStage("calling");
    setActiveCandidate({ name: "Michael Vance", phone: "+1 (512) 555-0144", license: "Licensed Master Plumber" });
    await new Promise(r => setTimeout(r, 1200));
    setScreenStage("screening");
    await new Promise(r => setTimeout(r, 2200));
    setScreenStage("scored");
  };

  const startPaymentSimulation = async () => {
    setPaymentStage("tapping");
    await new Promise(r => setTimeout(r, 1500));
    setPaymentStage("reconciling");
    await new Promise(r => setTimeout(r, 1200));
    setPaymentStage("done");
    setLedgerLogs(prev => [
      { id: `TXN-${Math.floor(1000 + Math.random()*9000)}`, date: "Just now", amount: "$950.00", customer: "John Connor", status: "QuickBooks Synced" },
      ...prev
    ]);
  };

  const faqs = [
    {
      q: "I already use ServiceTitan / Housecall Pro. Do I need Plumbify?",
      a: "Yes. ServiceTitan and Housecall Pro are excellent for scheduling trucks and dispatching technicians. However, they do not proactively capture your WeChat messages, Google/Facebook ad leads, or auto-text back missed calls in 5 seconds. Plumbify sits in front of your dispatch software. It secures the customer first, then passes the won job details straight to your technician."
    },
    {
      q: "How does the 'Missed Call Text-Back' feature work?",
      a: "If a customer calls your office number and no one answers, Plumbify instantly intercepts the missed call and sends an SMS to the caller: 'Hi, we missed your call. How can we help you today?' 80% of callers will reply to the text instead of hanging up and calling another plumber."
    },
    {
      q: "Is WeChat integration supported out of the box?",
      a: "Absolutely. We connect your business WeChat or WeCom account. When prospects message you requesting water heater quotes or emergency service, the conversation drops directly into your Plumbify dashboard and tags the lead automatically."
    },
    {
      q: "What is the 14-Day Free Challenge?",
      a: "We will set up Plumbify for your shop completely free for 14 days. We connect your business line, website forms, and WeChat. If the system does not rescue and secure at least 3 plumbing jobs that you would have otherwise missed or forgotten, you pay nothing."
    }
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-white font-sans selection:bg-blue-600 selection:text-white overflow-x-hidden relative">
      
      {/* GLOW OVERLAYS */}
      <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute top-[30%] left-[-10%] w-[500px] h-[500px] bg-gradient-to-tr from-cyan-500/5 to-transparent rounded-full blur-[120px] pointer-events-none z-0" />

      {/* CUSTOM SOUNDWAVE KEYFRAMES */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes soundwave {
          0%, 100% { transform: scaleY(0.25); }
          50% { transform: scaleY(1); }
        }
        .flow-bar {
          animation: soundwave 0.8s ease-in-out infinite;
          transform-origin: bottom;
        }
        .flow-bar:nth-child(2) { animation-delay: 0.1s; }
        .flow-bar:nth-child(3) { animation-delay: 0.2s; }
        .flow-bar:nth-child(4) { animation-delay: 0.3s; }
        .flow-bar:nth-child(5) { animation-delay: 0.4s; }

        .pulsing-hero-cta {
          box-shadow: 0 0 15px rgba(37, 99, 235, 0.4);
          animation: pulsebutton 2.5s infinite;
        }
        @keyframes pulsebutton {
          0% { box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.7); }
          70% { box-shadow: 0 0 0 10px rgba(37, 99, 235, 0); }
          100% { box-shadow: 0 0 0 0 rgba(37, 99, 235, 0); }
        }
      `}} />

      {/* HERO SECTION - RESTRUCTURED SPACING & WHITE SPACE */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-16 items-start relative z-10">
          
          {/* Hero Content */}
          <div className="lg:col-span-7 text-left space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-400 text-xs font-semibold border border-blue-500/20 uppercase tracking-wider">
              <Sparkles size={12} className="animate-pulse" />
              <span>Omnichannel CRM For Plumbing Contractors</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.08]">
              The Cost of Silence: <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 text-3xl sm:text-4xl md:text-5xl block mt-2">
                Unanswered Calls & Chats.
              </span>
            </h1>
            
            <p className="text-slate-400 text-base sm:text-lg leading-relaxed max-w-xl">
              Never miss a lead or waste time on unqualified applicants again. Plumbify powers instant call-backs, WeChat dispatch, and AI vetting, directly translating to more billable hours and QuickBooks sync.
            </p>

            {/* PRODUCT UI DEMONSTRATION IN HERO (Step 6/7) */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-2xl relative overflow-hidden backdrop-blur-md max-w-xl" aria-label="Plumbify Dispatch Software Preview">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></span>
                  <span className="text-[10px] font-bold text-slate-350 uppercase tracking-wider">Operational Dispatch Desk</span>
                </div>
                <span className="text-[8px] bg-slate-850 text-slate-450 px-2 py-0.5 rounded font-mono">LIVE SYNC</span>
              </div>

              <div className="space-y-2">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-900 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-white block">WeChat Chat Log Captured</span>
                    <span className="text-[9px] text-slate-500">Peifeng Ni: Burst pipe kitchen</span>
                  </div>
                  <span className="text-[9px] text-blue-400 font-bold bg-blue-500/10 px-2.5 py-1 rounded">Dispatched</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-900 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-white block">Missed Call Text-Back Sent</span>
                    <span className="text-[9px] text-slate-500">Phone: +1 (512) 555-0199</span>
                  </div>
                  <span className="text-[9px] text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded">Replied</span>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Form - Unified Primary CTA Area */}
          <div id="challenge-form" className="lg:col-span-5 space-y-6">
            <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-2xl relative">
              <h3 className="text-2xl font-bold mb-2">Start Your 14-Day Challenge</h3>
              <p className="text-slate-400 text-sm mb-6">Enter your details. We will connect your WeChat and phone lines in 24 hours.</p>

              {success ? (
                <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                  <CheckCircle2 size={48} className="text-emerald-400 mx-auto mb-4" />
                  <h4 className="text-lg font-bold text-white mb-2">Challenge Activated!</h4>
                  <p className="text-slate-300 text-sm">
                    We received your submission. A GHL configuration expert is setting up your sandbox workspace now.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">First Name</label>
                      <input 
                        type="text" required name="firstName" value={formData.firstName} onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-blue-500 outline-none text-sm text-white"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Last Name</label>
                      <input 
                        type="text" required name="lastName" value={formData.lastName} onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-blue-500 outline-none text-sm text-white"
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Phone Number</label>
                    <input 
                      type="tel" required name="phone" value={formData.phone} onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-blue-500 outline-none text-sm text-white"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Email Address</label>
                    <input 
                      type="email" required name="email" value={formData.email} onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-blue-500 outline-none text-sm text-white"
                      placeholder="john@plumbingcompany.com"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Emergency Needs (Optional)</label>
                    <textarea 
                      name="message" value={formData.message} onChange={handleInputChange} rows={2}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-blue-500 outline-none text-sm text-white resize-none"
                      placeholder="e.g., burst pipe, leak..."
                    />
                  </div>

                  {error && <p className="text-red-400 text-xs">{error}</p>}

                  <button 
                    type="submit" disabled={loading}
                    className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2 pulsing-hero-cta"
                  >
                    {loading ? <Loader2 className="animate-spin" size={18} /> : "Commit to 14 Days, See the Change"}
                  </button>
                </form>
              )}

              {/* 100% Risk-Free Guarantee statement */}
              <div className="mt-4 p-3 bg-blue-950/20 border border-blue-500/10 rounded-xl text-center">
                <span className="text-[10px] text-blue-400 font-bold block">🛡️ 100% RISK-FREE SATISFACTION GUARANTEE</span>
                <span className="text-[9px] text-slate-450 mt-0.5 block">If Plumbify doesn't save you admin desk hours within 14 days, pay absolutely $0.</span>
              </div>

              {/* Trust Badges - SSL, SOC 2, GDPR Compliance */}
              <div className="mt-5 border-t border-slate-800/80 pt-4 flex items-center justify-center gap-5 text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                <span className="flex items-center gap-1.5"><Lock size={12} className="text-blue-400" /> SSL SECURED</span>
                <span>•</span>
                <span className="flex items-center gap-1.5"><ShieldCheck size={12} className="text-emerald-400" /> SOC 2</span>
                <span>•</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-cyan-400" /> GDPR COMPLIANT</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* OPERATIONAL DISPATCH DESK SHOWCASE */}
      <OperationalDispatchDesk />

      {/* CUSTOMER LOGOS DISPLAYED BANNER (Step 5) */}
      <section className="py-12 bg-slate-900/40 border-y border-slate-900 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest text-center md:text-left">
            TRUSTED BY SERVICE FLEETS IN AUSTIN, HOUSTON & SAN ANTONIO
          </span>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 opacity-40 grayscale contrast-200">
            <span className="font-extrabold text-sm tracking-tight text-white uppercase font-mono">Austin Pipe & Sewer</span>
            <span className="font-extrabold text-sm tracking-tight text-white uppercase font-mono">Lone Star Rooter</span>
            <span className="font-extrabold text-sm tracking-tight text-white uppercase font-mono">Houston Drain Co.</span>
            <span className="font-extrabold text-sm tracking-tight text-white uppercase font-mono">QuickBooks Certified</span>
          </div>
        </div>
      </section>

      {/* CORE FEATURES (Targeting #features - decluttered, spacious) */}
      <section id="features" className="py-28 px-6 space-y-28 max-w-7xl mx-auto z-10 relative">
        
        {/* WeChat / WeCom capture feature */}
        <div className="grid lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-bold border border-blue-500/20 uppercase tracking-wider">
              <MessageSquare size={12} />
              <span>WeChat / WeCom Gateway</span>
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight leading-snug">
              Capture Local WeChat Quotes Instantly. <br />
              Aggregate Customer Conversations.
            </h2>
            <p className="text-slate-450 text-sm leading-relaxed">
              Never miss quote requests or emergency work sent to WeChat. Plumbify aggregates all customer text dialogues, photos of leaks, and address cards directly into the dispatcher dashboard. Update customer status pipelines without scanning multiple devices.
            </p>
            <div className="pt-2">
              <a 
                href="#challenge-form"
                className="px-6 py-3.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-bold rounded-xl shadow-lg border border-blue-400/20 inline-flex items-center gap-2"
              >
                <span>Start 14-Day Challenge</span>
                <ArrowRight size={14} />
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 p-8 rounded-3xl bg-slate-900 border border-slate-850">
            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">WeChat Integration Capture</h4>
            <div className="space-y-3">
              <div className="p-3 bg-slate-950 border border-slate-900 rounded-xl text-xs space-y-1">
                <span className="text-[9px] text-slate-500 font-bold block">FROM: Client (WeChat ID)</span>
                <p className="text-slate-300 italic">"Can you send a dispatcher for water heater replacement quote this morning?"</p>
              </div>
              <div className="p-3 bg-blue-950/20 border border-blue-500/10 rounded-xl text-xs space-y-1">
                <span className="text-[9px] text-blue-400 font-bold block">TO: Plumbify Auto-Responder</span>
                <p className="text-slate-300">"Got your request. Connecting with our local technician."</p>
              </div>
            </div>
          </div>
        </div>

        {/* AI PLUMBER RECRUITER WIDGET */}
        <div className="grid lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5 relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-850 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-400 animate-ping"></div>
                  <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider">AI Recruiter Node</span>
                </div>
                <span className="text-[9px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded font-mono">STANDBY</span>
              </div>

              {screenStage === "idle" && (
                <div className="text-center py-10 space-y-4">
                  <p className="text-xs text-slate-400 font-medium">Test an automated Technical Screening simulation call.</p>
                  <button 
                    onClick={startScreeningSimulation}
                    className="px-4 py-2.5 bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/20 hover:border-blue-500 rounded-xl text-[10px] font-bold transition-all shadow-sm"
                  >
                    Simulate Plumber Application
                  </button>
                </div>
              )}

              {screenStage === "calling" && (
                <div className="text-center py-10 space-y-3">
                  <PhoneCall size={24} className="text-blue-400 animate-bounce mx-auto" />
                  <div className="text-xs text-blue-400 font-bold">Calling Plumber...</div>
                  <div className="text-[10px] text-slate-500 font-mono">Connecting with {activeCandidate?.name}</div>
                </div>
              )}

              {screenStage === "screening" && (
                <div className="space-y-4">
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-900 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-white block">{activeCandidate?.name}</span>
                      <span className="text-[9px] text-slate-500">{activeCandidate?.license}</span>
                    </div>
                    <span className="text-[8px] text-blue-400 font-extrabold uppercase tracking-widest border border-blue-500/20 bg-blue-500/10 px-2 py-0.5 rounded">Speaking</span>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[9px] text-slate-500 font-extrabold uppercase tracking-wider">Live Speech Audio wave</span>
                    <div className="flex items-end justify-center gap-1.5 h-10 w-full bg-slate-950 p-2 rounded-xl border border-slate-900">
                      <div className="flow-bar w-1 bg-blue-500 rounded-t h-full"></div>
                      <div className="flow-bar w-1 bg-blue-400 rounded-t h-full"></div>
                      <div className="flow-bar w-1 bg-blue-300 rounded-t h-full"></div>
                      <div className="flow-bar w-1 bg-blue-400 rounded-t h-full"></div>
                      <div className="flow-bar w-1 bg-blue-600 rounded-t h-full"></div>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-400 text-center font-medium leading-relaxed italic">"Can you explain standard code requirements for a tankless water heater venting configuration?"</p>
                </div>
              )}

              {screenStage === "scored" && (
                <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-bold text-white text-xs block">{activeCandidate?.name}</span>
                        <span className="text-[9px] text-slate-500">{activeCandidate?.license}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm text-emerald-400 font-bold block">4.8 / 5.0</span>
                        <span className="text-[8px] text-slate-500 uppercase tracking-widest font-extrabold">Interview Rank</span>
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-relaxed border-t border-slate-900 pt-2.5 font-medium">
                      <span className="text-blue-400 font-bold block">Evaluation Summary:</span> Excellent technical response details. Confirmed knowledge of Type B vents and PVC clearances. License status: Valid. Background screening check: Cleared.
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button 
                      onClick={() => setScreenStage("idle")}
                      className="flex-1 py-2 bg-slate-950 hover:bg-slate-800 text-slate-450 text-[10px] rounded-lg border border-slate-850 font-bold transition-all"
                    >
                      Reset Demo
                    </button>
                    <a 
                      href="#challenge-form"
                      className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 text-white text-[10px] rounded-lg font-bold transition-all text-center flex items-center justify-center"
                    >
                      Start 14-Day Challenge
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6 order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-bold border border-blue-500/20 uppercase tracking-wider">
              <Users size={12} />
              <span>AI Plumber Recruiting</span>
            </div>

            <h2 className="text-3xl font-extrabold text-white tracking-tight leading-snug">
              Save $15,000+ in Headhunter Fees. <br />
              Vet & Hire Licensed Plumbers 24/7.
            </h2>

            <p className="text-slate-355 text-sm leading-relaxed">
              Finding licensed plumbing technicians is a major business leak. Plumbify monitors incoming job application channels, automatically places screening phone calls within 10 seconds of submission, interviews them on technical competence, runs automatic state licensing checks, and sets appointments with candidates who score 4.5+.
            </p>

            <div className="pt-2">
              <a 
                href="#challenge-form"
                className="px-6 py-3.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-bold rounded-xl shadow-lg border border-blue-400/20 inline-flex items-center gap-2"
              >
                <span>Start 14-Day Challenge</span>
                <ArrowRight size={14} />
              </a>
            </div>
          </div>
        </div>

        {/* TAP-TO-PAY AUTOMATIC BOOKKEEPING */}
        <div className="grid lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20 uppercase tracking-wider">
              <Smartphone size={12} />
              <span>Smartphone Tap-to-Pay</span>
            </div>

            <h2 className="text-3xl font-extrabold text-white tracking-tight leading-snug">
              Reclaim 92% of Admin Billing Hours. <br />
              Tap Phone to Process & Reconcile QuickBooks.
            </h2>

            <p className="text-slate-355 text-sm leading-relaxed">
              Eliminate billing errors, missing parts tracking, and bookkeeper followups. When your technicians complete a task, they hold the customer's card to the back of their smartphone. Plumbify captures the payment, marks the invoice paid, and instantly reconciles the material costs and deposits in QuickBooks.
            </p>

            <div className="pt-2">
              <a 
                href="#challenge-form"
                className="px-6 py-3.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-bold rounded-xl shadow-lg border border-blue-400/20 inline-flex items-center gap-2"
              >
                <span>Start 14-Day Challenge</span>
                <ArrowRight size={14} />
              </a>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5 relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-850 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></div>
                  <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider">TAP-TO-PAY NODE</span>
                </div>
                <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-mono">STANDBY</span>
              </div>

              {paymentStage === "idle" && (
                <div className="text-center py-10 space-y-4">
                  <p className="text-xs text-slate-400 font-medium">Test field plumber card payment invoice processing flow.</p>
                  <button 
                    onClick={startPaymentSimulation}
                    className="px-4 py-2.5 bg-emerald-600/10 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/20 hover:border-emerald-500 rounded-xl text-[10px] font-bold transition-all shadow-sm"
                  >
                    Start Payment Simulation
                  </button>
                </div>
              )}

              {paymentStage === "tapping" && (
                <div className="text-center py-10 space-y-3">
                  <Smartphone size={24} className="text-emerald-400 animate-pulse mx-auto" />
                  <div className="text-xs text-emerald-400 font-bold">Waiting for Contactless Card...</div>
                  <div className="text-[10px] text-slate-500 font-mono">Amount due: $950.00</div>
                </div>
              )}

              {paymentStage === "reconciling" && (
                <div className="text-center py-10 space-y-3">
                  <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <div className="text-xs text-blue-400 font-bold">Synchronizing Ledger Accounts...</div>
                  <div className="text-[10px] text-slate-500 font-mono">Reconciling QuickBooks Ledger balances</div>
                </div>
              )}

              {paymentStage === "done" && (
                <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 space-y-2 text-center">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/35 flex items-center justify-center text-emerald-400 mx-auto">
                      <Check size={20} />
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-500 uppercase tracking-widest font-extrabold">Reconciliation Complete</span>
                      <span className="text-2xl font-black text-white block mt-1 font-mono">$950.00 PAID</span>
                    </div>
                    <p className="text-[9px] text-slate-400 leading-normal border-t border-slate-900 pt-2 font-medium">
                      Invoice tagged as PAID in GHL & QuickBooks. Materials deduct ledger logs reconciled successfully.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[9px] text-slate-500 font-extrabold uppercase tracking-wider">Digital Ledger Sync Logs</span>
                    <div className="space-y-1.5 max-h-[100px] overflow-y-auto pr-1">
                      {ledgerLogs.map((log, idx) => (
                        <div key={idx} className="bg-slate-950 border border-slate-900 p-2.5 rounded-lg flex items-center justify-between text-[10px]">
                          <div>
                            <span className="font-bold text-white block">{log.id} ({log.customer})</span>
                            <span className="text-[8px] text-slate-500">{log.date}</span>
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-emerald-400 block">{log.amount}</span>
                            <span className="text-[8px] text-slate-500 font-semibold">{log.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button 
                    onClick={() => setPaymentStage("idle")}
                    className="w-full py-2 bg-slate-950 hover:bg-slate-800 text-slate-450 text-[10px] rounded-lg border border-slate-850 font-bold transition-all"
                  >
                    Reset Simulator
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

      </section>

      {/* ROI CALCULATOR SECTION (Targeting #roi-calculator) */}
      <section id="roi-calculator" className="py-28 px-6 bg-slate-900/20 border-t border-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-black mb-4">Plug Your Revenue Leaks</h2>
            <p className="text-slate-400 max-w-xl mx-auto">Use the slider below to calculate how much income your office is dropping each year from missed calls and texts.</p>
          </div>
          <ROICalculator />
        </div>
      </section>

      {/* CLIENT REVIEWS TESTIMONIALS SECTION (Targeting #client-reviews) */}
      <section id="client-reviews" className="py-28 px-6 border-t border-slate-900 bg-slate-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-black mb-4">Trusted By Plumbing Fleet Owners</h2>
            <p className="text-slate-400 max-w-xl mx-auto">Read how local rooter and sewer business operators optimized their cash flow and technician dispatching.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                quote: "Plumbify Tap-to-Pay completely saved our booking system. The technicians process credit cards on their smartphone, and QuickBooks is instantly reconciled before they leave the customer's driveway. Reclaimed roughly 12 hours a week in paperwork.",
                author: "Dave S.",
                role: "Owner, Austin Sewer & Pipe",
                stats: "5 Trucks on Fleet"
              },
              {
                quote: "The AI Recruiter call node is incredible. It interviews candidates, verifies active plumbing licenses, and hooks qualified plumbers onto our calendars automatically. We scaled our team without hiring a recruitment agency.",
                author: "Marc W.",
                role: "Operations Director, Lone Star Rooter",
                stats: "8 Trucks on Fleet"
              }
            ].map((t, idx) => (
              <div key={idx} className="p-8 rounded-3xl bg-slate-900 border border-slate-850 flex flex-col justify-between hover:border-blue-500/20 transition-all">
                <p className="text-slate-300 italic text-sm leading-relaxed font-medium">"{t.quote}"</p>
                <div className="mt-6 pt-4 border-t border-slate-850/60 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-white block">{t.author}</span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">{t.role}</span>
                  </div>
                  <span className="font-bold text-blue-400 font-mono uppercase text-[10px] tracking-wider">{t.stats}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HUMANIZED ABOUT US / TEAM SECTION (Step 8) */}
      <section className="py-28 px-6 border-t border-slate-900 bg-slate-900/10">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-bold border border-blue-500/20 uppercase tracking-wider">
              <Shield size={12} />
              <span>Our Story</span>
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight leading-snug">
              Built By Plumbing Contractors.
            </h2>
            <p className="text-slate-350 text-sm leading-relaxed">
              We spent years running residential plumbing fleets. We know the pain of paying bookkeepers to trace missing credit card balances, and the frustration of running job listings for weeks only to get unqualified applicants. 
            </p>
            <p className="text-slate-355 text-sm leading-relaxed">
              We built Plumbify to run the back-office dispatch tasks automatically, so plumbing business operators can focus on scale and truck efficiency.
            </p>
          </div>

          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            <div className="p-6 bg-slate-900 border border-slate-850 rounded-2xl space-y-2">
              <MapPin className="text-blue-400" size={24} />
              <span className="font-bold text-white text-sm block">Headquarters</span>
              <span className="text-xs text-slate-500">Austin, Texas, USA</span>
            </div>
            <div className="p-6 bg-slate-900 border border-slate-850 rounded-2xl space-y-2">
              <Clock className="text-emerald-400" size={24} />
              <span className="font-bold text-white text-sm block">Free Integration</span>
              <span className="text-xs text-slate-500">24h Sandbox Onboarding</span>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-28 px-6 border-t border-slate-900 bg-slate-950">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black mb-4">Frequently Asked Questions</h2>
            <p className="text-slate-400">Everything you need to know about how Plumbify sits in front of your dispatch setup.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="rounded-2xl border border-slate-850 bg-slate-900/50 overflow-hidden transition-all">
                <button 
                  onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                  className="w-full px-6 py-5 flex justify-between items-center text-left hover:bg-slate-900 transition-colors"
                  aria-expanded={activeFaq === index}
                >
                  <span className="font-bold text-base sm:text-lg pr-4">{faq.q}</span>
                  <ChevronDown size={20} className={`text-slate-450 transition-transform flex-shrink-0 ${activeFaq === index ? "rotate-180" : ""}`} />
                </button>
                {activeFaq === index && (
                  <div className="p-6 text-slate-400 text-sm leading-relaxed border-t border-slate-850/50">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER & PRIVACY POLICY COMPLIANCE */}
      <footer id="privacy-policy" className="py-12 px-6 bg-slate-950 border-t border-slate-900 text-center sm:text-left">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
            <div className="text-xl font-black tracking-tight text-blue-500">PLUMBIFY CRM</div>
            <div className="flex gap-8 text-xs text-slate-500 font-medium">
              <span>© 2026 Plumbify Inc.</span>
              <Link href="#privacy-policy" className="hover:text-slate-300 transition-colors">Privacy Policy</Link>
              <Link href="#privacy-policy" className="hover:text-slate-300 transition-colors">Terms of Service</Link>
            </div>
          </div>

          <div className="text-[10px] text-slate-600 text-left border-t border-slate-900 pt-6 space-y-2">
            <p className="font-bold text-slate-500 uppercase tracking-widest">Privacy Policy & Secure Data Compliance Statement</p>
            <p className="leading-relaxed">
              Plumbify is committed to protecting your operational data. All credentials gathered via GHL webhooks and CRM integrations are transmitted via industry-standard SSL encryption. Payment processes using smartphone Tap-to-Pay are routed securely through fully certified PCI-DSS payment gateways. Plumbify aligns with SOC 2 requirements and GDPR data protection acts. By registering your phone and email, you authorize Plumbify dispatch specialists to verify your QuickBooks ledger sandbox access.
            </p>
          </div>
        </div>
      </footer>

    </main>
  );
}
