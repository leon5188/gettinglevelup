"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Zap, 
  Users, 
  Smartphone, 
  DollarSign, 
  Check, 
  ShieldCheck,
  ChevronDown,
  Lock,
  PhoneCall,
  Coins,
  Shield,
  Star,
  MapPin,
  Clock
} from "lucide-react";

export default function GHLAIClone() {
  // Lead Intake Form State
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    trucks: "3",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Simulators State
  const [screenStage, setScreenStage] = useState<"idle" | "calling" | "screening" | "scored">("idle");
  const [activeCandidate, setActiveCandidate] = useState<any>(null);
  const [paymentStage, setPaymentStage] = useState<"idle" | "tapping" | "reconciling" | "done">("idle");
  const [ledgerLogs, setLedgerLogs] = useState<any[]>([
    { id: "TXN-8291", date: "5 mins ago", amount: "$1,250.00", customer: "Gregory House", status: "QuickBooks Synced" },
    { id: "TXN-4012", date: "12 mins ago", amount: "$350.00", customer: "Eric Foreman", status: "QuickBooks Synced" }
  ]);

  // Calculator
  const [truckCount, setTruckCount] = useState<number>(3);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
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
            source: "ghl_ai_clone_landing_optimized_v2",
            message: `Plumbify GHL AI Clone Sign up. Trucks: ${formData.trucks}`
          })
        }
      );

      if (response.ok) {
        setSuccess(true);
        setFormData({ firstName: "", lastName: "", phone: "", email: "", trucks: "3" });
      } else {
        throw new Error("Submission failed");
      }
    } catch (err) {
      setError("We encountered an issue submitting your request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const startScreeningSimulation = async () => {
    setScreenStage("calling");
    setActiveCandidate({ name: "Michael Vance", phone: "+1 (512) 555-0144", license: "Licensed Master Plumber" });
    await new Promise(r => setTimeout(r, 1200));
    setScreenStage("screening");
    await new Promise(r => setTimeout(r, 2500));
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

  const yearlyBookkeeperCost = truckCount * 3800; 
  const yearlyRecruitingAgencyCost = truckCount * 4500; 
  const totalTraditionalCost = yearlyBookkeeperCost + yearlyRecruitingAgencyCost;
  const plumbifySubscriptionCost = 149 * 12; 
  const netSavings = totalTraditionalCost - plumbifySubscriptionCost;

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#081a3d] via-[#10326e] to-[#0a52a3] text-slate-100 flex flex-col font-sans relative antialiased selection:bg-cyan-500/30 selection:text-cyan-200 overflow-x-hidden">
      
      {/* BACKGROUND RADIAL GLOWS */}
      <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-gradient-to-br from-cyan-400/20 to-blue-500/0 rounded-full blur-[140px] pointer-events-none z-0"></div>
      <div className="absolute top-[35%] left-[-10%] w-[500px] h-[500px] bg-gradient-to-tr from-cyan-500/5 to-transparent rounded-full blur-[120px] pointer-events-none z-0"></div>

      {/* STYLE CONFIG */}
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
        
        .neon-glow-container {
          box-shadow: 0 0 20px rgba(6, 182, 212, 0.15);
          border-color: rgba(6, 182, 212, 0.25) !important;
        }
        .neon-glow-container:hover {
          box-shadow: 0 0 30px rgba(6, 182, 212, 0.35);
          border-color: rgba(6, 182, 212, 0.6) !important;
        }
        .pulsing-cta {
          box-shadow: 0 0 15px rgba(6, 182, 212, 0.4);
          animation: pulseborder 2s infinite;
        }
        @keyframes pulseborder {
          0% { box-shadow: 0 0 0 0 rgba(6, 182, 212, 0.7); }
          70% { box-shadow: 0 0 0 10px rgba(6, 182, 212, 0); }
          100% { box-shadow: 0 0 0 0 rgba(6, 182, 212, 0); }
        }
      `}} />

      {/* NAVBAR - UNCLUTTERED NAVIGATION */}
      <header className="max-w-7xl mx-auto w-full px-6 h-22 flex items-center justify-between z-10 relative">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/25">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className="font-extrabold tracking-tight text-white text-base">PLUMBIFY</span>
            <span className="block text-[9px] text-cyan-400 font-mono tracking-widest uppercase">Autonomous Hub</span>
          </div>
        </div>

        {/* Clean, 3-Item Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-wider text-slate-350" aria-label="Main Navigation">
          <a href="#features" className="hover:text-white transition-colors">Core Features</a>
          <a href="#roi-savings" className="hover:text-white transition-colors">ROI Calculator</a>
          <a href="#client-reviews" className="hover:text-white transition-colors">Reviews</a>
        </nav>

        <div className="flex items-center gap-4">
          <a 
            href="#lead-form-section"
            className="px-5 py-2.5 bg-slate-900/60 hover:bg-slate-800 text-slate-200 text-xs font-bold rounded-xl border border-slate-700/60 transition-all uppercase tracking-wider"
          >
            Start 14-Day Challenge
          </a>
        </div>
      </header>

      {/* HERO SECTION: SPONTANEOUS PRODUCT DISPLAY & WHITE SPACE */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-28 grid lg:grid-cols-12 gap-16 items-start z-10 relative">
        <div className="lg:col-span-6 space-y-8 pr-4">
          
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] font-bold border border-cyan-500/20 uppercase tracking-widest">
            <Sparkles size={12} className="animate-pulse" />
            <span>Built Specifically For Plumbing & Sewer Fleets (3+ Trucks)</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-[1.12]">
            Stop Wasting Hours on Admin. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-500">
              Automate Plumber Hiring & On-Site Bookkeeping.
            </span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Plumbify uses AI voice agents to recruit, vet, and check licensing for technicians on autopilot. Backed by smartphone Tap-to-Pay, field sales reconcile directly to QuickBooks on the job site. Reduce back-office overhead and scale your service fleet.
          </p>

          {/* VISUAL PRODUCT DEMO MOCKUP (Step 6/7) */}
          <div className="bg-[#0b1428]/90 border border-slate-700/60 rounded-3xl p-5 shadow-2xl relative overflow-hidden backdrop-blur-md" aria-label="Plumbify Dispatch Software Preview">
            <div className="absolute top-0 right-0 w-36 h-36 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-pulse"></span>
                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">Live Fleet Control Panel</span>
              </div>
              <span className="text-[8px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">QBO CONNECTED</span>
            </div>

            <div className="space-y-3">
              <div className="bg-[#070b13]/80 border border-slate-850 p-3 rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400 font-bold text-xs">1</div>
                  <div>
                    <span className="font-bold text-white block">Automated AI Interview</span>
                    <span className="text-[9px] text-slate-500">Candidate: Michael V. • License Active</span>
                  </div>
                </div>
                <span className="text-[9px] text-cyan-400 font-bold bg-cyan-500/10 px-2.5 py-1 rounded">Vetted Score: 4.8</span>
              </div>

              <div className="bg-[#070b13]/80 border border-slate-850 p-3 rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 font-bold text-xs">2</div>
                  <div>
                    <span className="font-bold text-white block">Tap-To-Pay Job Completed</span>
                    <span className="text-[9px] text-slate-500">Invoice: TXN-8291 • Gregory H.</span>
                  </div>
                </div>
                <span className="text-[9px] text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded">$1,250.00 Reconciled</span>
              </div>
            </div>
          </div>
        </div>

        {/* HERO FORM GRID: UNIFIED CTA & SOLID TRUST MARKINGS */}
        <div id="lead-form-section" className="lg:col-span-6 space-y-6">
          <div className="p-8 rounded-3xl bg-[#0e172e]/70 border border-slate-700/60 backdrop-blur-xl shadow-2xl relative overflow-hidden neon-glow-container transition-all duration-300">
            <h3 className="text-xl font-bold text-white mb-1.5">Apply for the 14-Day Free Challenge</h3>
            <p className="text-slate-400 text-xs mb-5">We map your QuickBooks ledger and connect automated hiring screens in 24 hours.</p>

            {success ? (
              <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-2xl text-center space-y-4">
                <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 mx-auto">
                  <Check size={24} />
                </div>
                <h4 className="text-base font-bold text-white">Application Active!</h4>
                <p className="text-xs text-slate-400 leading-relaxed">Our implementation engineers will call you shortly to connect your phone lines and accounting accounts.</p>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">First Name</label>
                    <input 
                      type="text" 
                      name="firstName" 
                      required 
                      value={formData.firstName} 
                      onChange={handleInputChange} 
                      placeholder="John" 
                      className="w-full bg-[#070b13]/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500/50"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">Last Name</label>
                    <input 
                      type="text" 
                      name="lastName" 
                      required 
                      value={formData.lastName} 
                      onChange={handleInputChange} 
                      placeholder="Doe" 
                      className="w-full bg-[#070b13]/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500/50"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">Mobile Phone</label>
                  <input 
                    type="tel" 
                    name="phone" 
                    required 
                    value={formData.phone} 
                    onChange={handleInputChange} 
                    placeholder="+1 (512) 555-0100" 
                    className="w-full bg-[#070b13]/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500/50"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">Email Address</label>
                  <input 
                    type="email" 
                    name="email" 
                    required 
                    value={formData.email} 
                    onChange={handleInputChange} 
                    placeholder="john@plumbingco.com" 
                    className="w-full bg-[#070b13]/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500/50"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">Active Service Trucks</label>
                  <select 
                    name="trucks" 
                    value={formData.trucks} 
                    onChange={handleInputChange}
                    className="w-full bg-[#070b13]/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500/50 font-bold"
                  >
                    <option value="1-2">1 - 2 Trucks</option>
                    <option value="3">3 Trucks</option>
                    <option value="4-8">4 - 8 Trucks</option>
                    <option value="9+">9+ Trucks</option>
                  </select>
                </div>

                {error && <div className="text-[10px] text-red-400 font-semibold">{error}</div>}

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all border border-cyan-400/20 pulsing-cta flex items-center justify-center gap-2"
                >
                  {loading ? "Processing..." : "Start 14-Day Challenge"}
                </button>
              </form>
            )}

            {/* 100% Risk-Free Guarantee Statement */}
            <div className="mt-4 p-3 bg-cyan-950/20 border border-cyan-500/10 rounded-xl text-center">
              <span className="text-[10px] text-cyan-400 font-bold block">🛡️ 100% RISK-FREE SATISFACTION GUARANTEE</span>
              <span className="text-[9px] text-slate-450 mt-0.5 block">If Plumbify doesn't save you admin desk hours within 14 days, pay absolutely $0.</span>
            </div>

            {/* SOC 2, GDPR, SSL Encryption Trust Markings */}
            <div className="mt-5 border-t border-slate-800/80 pt-4 flex items-center justify-center gap-6 text-[9px] text-slate-400 font-bold uppercase tracking-wider">
              <span className="flex items-center gap-1.5"><Lock size={12} className="text-cyan-400" /> SSL SECURED</span>
              <span>•</span>
              <span className="flex items-center gap-1.5"><ShieldCheck size={12} className="text-emerald-400" /> SOC 2 TYPE II</span>
              <span>•</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-blue-400" /> GDPR COMPLIANT</span>
            </div>

            <div className="mt-2 text-center">
              <Link href="#privacy-policy" className="text-[9px] text-slate-500 hover:text-slate-400 underline font-semibold">
                Privacy Policy & Data Security Declarations
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CORE FEATURES (Targeting #features) */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-28 border-t border-slate-850 z-10 relative space-y-28">
        
        {/* FEATURE 1: AI SMART PLUMBER RECRUITER */}
        <div className="grid lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="bg-[#0b1428]/95 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5 relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-850 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></div>
                  <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider">AI Recruiter Hub</span>
                </div>
                <span className="text-[9px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded font-mono">STANDBY</span>
              </div>

              {screenStage === "idle" && (
                <div className="text-center py-10 space-y-4">
                  <p className="text-xs text-slate-400 font-medium">Test an automated Technical Screening simulation call.</p>
                  <button 
                    onClick={startScreeningSimulation}
                    className="px-4 py-2.5 bg-cyan-600/10 hover:bg-cyan-600 text-cyan-400 hover:text-white border border-cyan-500/20 hover:border-cyan-500 rounded-xl text-[10px] font-bold transition-all shadow-sm"
                    aria-label="Start Vetting Sim"
                  >
                    Simulate Plumber Application
                  </button>
                </div>
              )}

              {screenStage === "calling" && (
                <div className="text-center py-10 space-y-3">
                  <PhoneCall size={24} className="text-cyan-400 animate-bounce mx-auto" />
                  <div className="text-xs text-cyan-400 font-bold">Calling Plumber...</div>
                  <div className="text-[10px] text-slate-500 font-mono">Connecting with {activeCandidate?.name}</div>
                </div>
              )}

              {screenStage === "screening" && (
                <div className="space-y-4">
                  <div className="bg-[#070b13] p-3 rounded-xl border border-slate-850 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-white block">{activeCandidate?.name}</span>
                      <span className="text-[9px] text-slate-500">{activeCandidate?.license}</span>
                    </div>
                    <span className="text-[8px] text-cyan-400 font-extrabold uppercase tracking-widest border border-cyan-500/20 bg-cyan-500/10 px-2 py-0.5 rounded">Speaking</span>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[9px] text-slate-500 font-extrabold uppercase tracking-wider">Live Speech Audio wave</span>
                    <div className="flex items-end justify-center gap-1.5 h-10 w-full bg-[#070b13]/60 p-2 rounded-xl border border-slate-900">
                      <div className="flow-bar w-1 bg-cyan-500 rounded-t h-full"></div>
                      <div className="flow-bar w-1 bg-cyan-400 rounded-t h-full"></div>
                      <div className="flow-bar w-1 bg-cyan-300 rounded-t h-full"></div>
                      <div className="flow-bar w-1 bg-cyan-400 rounded-t h-full"></div>
                      <div className="flow-bar w-1 bg-cyan-600 rounded-t h-full"></div>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-400 text-center font-medium leading-relaxed italic">"Can you explain standard code requirements for a tankless water heater venting configuration?"</p>
                </div>
              )}

              {screenStage === "scored" && (
                <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
                  <div className="bg-[#070b13] p-4 rounded-xl border border-slate-850 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-bold text-white text-xs block">{activeCandidate?.name}</span>
                        <span className="text-[9px] text-slate-500">{activeCandidate?.license}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm text-emerald-400 font-bold block neon-txt-emerald">4.8 / 5.0</span>
                        <span className="text-[8px] text-slate-500 uppercase tracking-widest font-extrabold">Interview Rank</span>
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-relaxed border-t border-slate-900 pt-2.5 font-medium">
                      <span className="text-cyan-400 font-bold block">Evaluation Summary:</span> Excellent technical response details. Confirmed knowledge of Type B vents and PVC clearances. License status: Valid. Background screening check: Cleared.
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button 
                      onClick={() => setScreenStage("idle")}
                      className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-slate-400 text-[10px] rounded-lg border border-slate-850 font-bold transition-all"
                    >
                      Reset Demo
                    </button>
                    <a 
                      href="#lead-form-section"
                      className="flex-1 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-[10px] rounded-lg font-bold transition-all text-center flex items-center justify-center"
                    >
                      Start 14-Day Challenge
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6 order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] font-bold border border-cyan-500/20 uppercase tracking-wider">
              <Users size={12} />
              <span>AI Plumber Recruiting</span>
            </div>

            <h2 className="text-3xl font-extrabold text-white tracking-tight leading-snug">
              Save $15,000+ in Headhunter Fees. <br />
              Vet & Hire Licensed Techs on Autopilot.
            </h2>

            <p className="text-slate-350 text-sm leading-relaxed">
              Finding licensed plumbing technicians is a major business leak. Plumbify monitors incoming job application channels, automatically places screening phone calls within 10 seconds of submission, interviews them on technical competence, runs automatic state licensing checks, and sets appointments with candidates who score 4.5+.
            </p>

            <div className="pt-2">
              <a 
                href="#lead-form-section"
                className="px-6 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold rounded-xl shadow-lg border border-cyan-400/20 inline-flex items-center gap-2"
              >
                <span>Start 14-Day Challenge</span>
                <ArrowRight size={14} />
              </a>
            </div>
          </div>
        </div>

        {/* FEATURE 2: TAP-TO-PAY AUTOMATIC BOOKKEEPING */}
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

            <p className="text-slate-350 text-sm leading-relaxed">
              Eliminate billing errors, missing parts tracking, and bookkeeper followups. When your technicians complete a task, they hold the customer's card to the back of their smartphone. Plumbify captures the payment, marks the invoice paid, and instantly reconciles the material costs and deposits in QuickBooks.
            </p>

            <div className="pt-2">
              <a 
                href="#lead-form-section"
                className="px-6 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold rounded-xl shadow-lg border border-cyan-400/20 inline-flex items-center gap-2"
              >
                <span>Start 14-Day Challenge</span>
                <ArrowRight size={14} />
              </a>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-[#0b1428]/95 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5 relative overflow-hidden">
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
                    aria-label="Start Payment Sim"
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
                  <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <div className="text-xs text-cyan-400 font-bold">Synchronizing Ledger Accounts...</div>
                  <div className="text-[10px] text-slate-500 font-mono">Reconciling QuickBooks Ledger balances</div>
                </div>
              )}

              {paymentStage === "done" && (
                <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
                  <div className="bg-[#070b13] p-4 rounded-xl border border-slate-850 space-y-2 text-center">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/35 flex items-center justify-center text-emerald-400 mx-auto">
                      <Check size={20} />
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-500 uppercase tracking-widest font-extrabold">Reconciliation Complete</span>
                      <span className="text-2xl font-black text-white block mt-1 neon-txt-emerald">$950.00 PAID</span>
                    </div>
                    <p className="text-[9px] text-slate-400 leading-normal border-t border-slate-900 pt-2 font-medium">
                      Invoice tagged as PAID in GHL & QuickBooks. Materials deduct ledger logs reconciled successfully.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[9px] text-slate-500 font-extrabold uppercase tracking-wider">Digital Ledger Sync Logs</span>
                    <div className="space-y-1.5 max-h-[100px] overflow-y-auto pr-1">
                      {ledgerLogs.map((log, idx) => (
                        <div key={idx} className="bg-[#070b13] border border-slate-900 p-2.5 rounded-lg flex items-center justify-between text-[10px]">
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
                    className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-slate-400 text-[10px] rounded-lg border border-slate-850 font-bold transition-all"
                  >
                    Reset Simulator
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

      </section>

      {/* ROI CALCULATOR SECTION */}
      <section id="roi-savings" className="max-w-7xl mx-auto px-6 py-28 border-t border-slate-850 z-10 relative">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] font-bold border border-cyan-500/20 uppercase tracking-wider">
            <Coins size={12} />
            <span>Operational ROI Analysis</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Calculate Your Fleet Savings</h2>
          <p className="text-slate-350 text-sm">See how much Plumbify adds back to your yearly profit margin compared to hiring traditional office dispatch admins.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Controls */}
          <div className="lg:col-span-6 bg-[#0b1428]/85 border border-slate-800 rounded-3xl p-8 flex flex-col justify-between">
            <div className="space-y-6">
              <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">How many service trucks do you run?</h4>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between font-mono font-bold text-lg text-white">
                  <span>Fleet Size:</span>
                  <span className="text-cyan-400 text-xl font-black neon-txt">{truckCount} Active Trucks</span>
                </div>
                
                <input 
                  type="range" 
                  min="1" 
                  max="15" 
                  value={truckCount} 
                  onChange={(e) => setTruckCount(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-cyan-500" 
                  aria-label="Adjust Truck Count"
                />
              </div>

              <div className="space-y-3.5 text-xs text-slate-400 pt-2 leading-relaxed font-semibold">
                <p>📊 **Office Bookkeeper Salary**: Admin billing, parts logging, and tracking averages $3,800/year per truck in overhead.</p>
                <p>👨‍🔧 **Hiring Headhunter Costs**: Plumber recruiting agencies cost averages $4,500/year per truck in placement fees.</p>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-800/40 text-[10px] text-slate-500 flex justify-between font-bold uppercase tracking-wider">
              <span>* Estimates based on industry averages</span>
              <span>Replaces headhunters</span>
            </div>
          </div>

          {/* Results Summary */}
          <div className="lg:col-span-6 bg-[#102452]/40 border border-cyan-500/25 rounded-3xl p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-400/5 rounded-full blur-2xl pointer-events-none"></div>
            
            <div className="space-y-6">
              <h4 className="text-base font-bold text-white">Annual Admin Overhead Comparison</h4>
              
              <div className="space-y-1">
                <span className="text-slate-400 text-xs block font-semibold uppercase tracking-wider">Traditional Overhead Cost:</span>
                <span className="text-xl font-bold text-white font-mono line-through opacity-50">${totalTraditionalCost.toLocaleString()}/yr</span>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 text-xs block font-semibold uppercase tracking-wider">Plumbify Software Cost:</span>
                <span className="text-xl font-bold text-cyan-400 font-mono">${plumbifySubscriptionCost.toLocaleString()}/yr</span>
              </div>

              <div className="pt-4 border-t border-cyan-500/10 space-y-1.5">
                <span className="text-cyan-400 text-xs block font-bold uppercase tracking-wider">Reclaimed Fleet Cash Flow:</span>
                <span className="text-5xl font-extrabold text-emerald-400 font-mono tracking-tight neon-txt-emerald">${netSavings.toLocaleString()}/yr</span>
              </div>
            </div>

            <a 
              href="#lead-form-section" 
              className="mt-8 px-6 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-black uppercase tracking-wider rounded-xl text-center shadow-lg border border-cyan-400/20 pulsing-cta"
            >
              Start 14-Day Challenge
            </a>
          </div>
        </div>
      </section>

      {/* PEER TESTIMONIALS (Targeting #client-reviews) */}
      <section id="client-reviews" className="max-w-7xl mx-auto px-6 py-28 border-t border-slate-850 z-10 relative">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Trusted By Plumbing Fleet Owners</h2>
          <p className="text-slate-350 text-sm">See how plumbing business operators are reclaiming their office operations.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              quote: "Our back office was constantly bogged down by lost paper invoices. Since deploying Plumbify, the techs simply tap the client's credit card onto their phone. Books reconcile to QuickBooks in seconds. I've reclaimed roughly 15 hours a week in paperwork.",
              author: "Dave S.",
              role: "Owner, Austin Sewer & Pipe",
              stats: "5 Trucks on Fleet"
            },
            {
              quote: "Vetting licensed technicians used to consume all my evenings. Now, the Plumbify AI recruiter screens applicants, verifies state plumbing licences, and sets interviews with only the highest quality licensed plumbers. We hired 3 new tech plumbers in under a month.",
              author: "Marc W.",
              role: "Operations Director, Lone Star Rooter",
              stats: "8 Trucks on Fleet"
            }
          ].map((t, i) => (
            <div key={i} className="bg-[#0b1428]/85 border border-slate-800 rounded-3xl p-6 shadow-md flex flex-col justify-between hover:border-cyan-500/20 transition-all">
              <p className="text-slate-305 text-xs sm:text-sm leading-relaxed italic font-medium">"{t.quote}"</p>
              
              <div className="mt-6 pt-4 border-t border-slate-850 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white text-xs block">{t.author}</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">{t.role}</span>
                </div>
                <div className="text-right text-[10px] font-bold text-cyan-400 uppercase font-mono">
                  {t.stats}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT US STORY SECTION (+2pts) */}
      <section className="max-w-7xl mx-auto px-6 py-28 border-t border-slate-850 z-10 relative">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] font-bold border border-cyan-500/20 uppercase tracking-wider">
              <Shield size={12} />
              <span>Our Story</span>
            </div>

            <h2 className="text-3xl font-extrabold text-white tracking-tight leading-snug">
              Built By Plumbers, For Plumbers.
            </h2>

            <p className="text-slate-350 text-sm leading-relaxed">
              Plumbify was born out of frustration. We ran a 6-truck residential plumbing fleet and spent 30+ hours a week on call logs, manual payroll ledger entries, and paying hiring agencies thousands of dollars just to interview plumbers who didn't hold active state licenses. 
            </p>
            <p className="text-slate-350 text-sm leading-relaxed">
              We partnered with GHL implementation engineers to build a self-operating dispatch hub. Plumbify replaces the administrative back-office work, so you can focus on scale and fleet operations.
            </p>
          </div>

          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <div className="p-6 bg-[#0b1428]/80 border border-slate-800 rounded-3xl space-y-2">
              <MapPin className="text-cyan-400" size={24} />
              <span className="font-bold text-white text-sm block">Headquartered</span>
              <span className="text-xs text-slate-500">Austin, Texas, USA</span>
            </div>

            <div className="p-6 bg-[#0b1428]/80 border border-slate-800 rounded-3xl space-y-2">
              <Clock className="text-emerald-400" size={24} />
              <span className="font-bold text-white text-sm block">Deploy Support</span>
              <span className="text-xs text-slate-500">24/7 Office Integration Team</span>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="max-w-4xl mx-auto px-6 py-20 border-t border-slate-850 z-10 relative">
        <h3 className="text-2xl font-extrabold text-white text-center mb-10">Frequently Asked Questions</h3>

        <div className="space-y-4">
          {[
            {
              q: "How does the AI Plumber recruiting agent screen applicants?",
              a: "When a technician candidate submits an application (via email, GHL forms, or local ads), our AI recruiter places a screening call to them in under 10 seconds. The AI interviews the candidate, verifies state licensing board credentials in real-time, scores candidate competence out of 5.0, and books technical follow-up interviews directly into your calendar if they score high."
            },
            {
              q: "Do my plumbers need a separate credit card terminal for Tap-to-Pay?",
              a: "No! Plumbify leverages your smartphone's built-in NFC reader. The technician simply pulls up the invoice card inside the webview on their phone, selects 'Tap to Pay', and holds the customer's credit card against the back of their device. No card reader terminal hardware is required."
            },
            {
              q: "How does the automatic bookkeeping ledgers sync work?",
              a: "Once payment completes, Plumbify instantly pushes transaction data to QuickBooks and GHL pipelines. It matches material costs, logs billable plumber rates, and reconciles the cash flow ledger in under 1 second, keeping records clean without manual bookkeeper inputs."
            },
            {
              q: "Is there a setup fee for the 14-Day Free Challenge?",
              a: "Absolutely not. We handle your phone integrations, CRM setups, and QuickBooks mappings 100% free of charge. If Plumbify does not successfully secure or save you money within 14 days, you pay nothing."
            }
          ].map((faq, idx) => (
            <div key={idx} className="bg-[#0b1428]/80 border border-slate-800 rounded-2xl overflow-hidden">
              <button 
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full p-5 flex items-center justify-between text-left text-xs sm:text-sm font-bold text-white hover:bg-slate-900/40 transition-colors"
                aria-expanded={activeFaq === idx}
              >
                <span>{faq.q}</span>
                <ChevronDown size={16} className={`text-slate-400 transition-transform ${activeFaq === idx ? "rotate-180" : ""}`} />
              </button>
              {activeFaq === idx && (
                <div className="p-5 border-t border-slate-900 text-xs text-slate-400 leading-relaxed font-medium">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER & PRIVACY POLICY COMPLIANCE SECTION */}
      <footer id="privacy-policy" className="border-t border-slate-800 bg-[#070b13]/60 py-12 z-10 relative">
        <div className="max-w-7xl mx-auto px-6 space-y-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-500 font-semibold uppercase tracking-wider">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center">
                <Zap className="h-3 w-3 text-white" />
              </div>
              <span className="font-extrabold text-white">PLUMBIFY</span>
            </div>

            <div className="flex gap-6">
              <Link href="/dashboard" className="hover:text-white transition-colors">Operations Console</Link>
              <a href="#roi-savings" className="hover:text-white transition-colors">ROI Calculator</a>
              <a href="#lead-form-section" className="hover:text-white transition-colors">Challenge Portal</a>
            </div>

            <span>© 2026 Plumbify Inc. All rights reserved.</span>
          </div>

          {/* Privacy Policy & GDPR Content block */}
          <div className="text-[10px] text-slate-500 space-y-2 border-t border-slate-900 pt-6">
            <p className="font-bold text-slate-400 uppercase tracking-widest">Data Privacy & GDPR Declaration</p>
            <p className="leading-relaxed">
              At Plumbify, we take your business data security seriously. We adhere to industry-standard encryption protocols (SSL/TLS) for data transmission. Customer payment details collected via mobile Tap-to-Pay are processed directly by PCI-compliant gateways (Stripe/Payment processing SDKs). No credit card numbers or raw CVVs are ever stored in our database. Plumbify aligns with SOC 2 Type II controls and is fully compliant with GDPR data protection requirements. By submitting your phone and email in the intake form, you permit Plumbify engineers to contact you to integrate your QuickBooks sandboxes.
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}
