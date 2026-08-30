"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  PhoneCall,
  Truck,
  Calculator,
  CalendarDays,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  DollarSign,
  Star,
  ChevronRight,
  Clock,
  AlertTriangle,
  FileSpreadsheet,
  XCircle,
  Sparkles,
  Zap,
} from "lucide-react";

// ─── Truck Roll Tax Calculator ───────────────────────────────────

function TruckRollCalculator() {
  const [weeklyRolls, setWeeklyRolls] = useState(2);
  const [avgTicket, setAvgTicket] = useState(850);
  const [driveMinutes, setDriveMinutes] = useState(45);

  const rollsPerYear = weeklyRolls * 52;
  const wastedRollsPerYear = Math.floor(rollsPerYear * 0.25);
  const costPerRoll = 150;
  const totalTax = wastedRollsPerYear * costPerRoll;

  const formatUSD = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-200/50 p-6 sm:p-8">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-3 bg-orange-600 text-white rounded-xl shadow-md shadow-orange-600/20">
          <Calculator className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900 tracking-tight">The Truck Roll Tax</h3>
          <p className="text-xs text-slate-500 font-medium">How much you burn on free estimates that never close</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Weekly uncommitted truck rolls:
            </label>
            <span className="text-sm font-black text-orange-600 bg-orange-100/80 px-2.5 py-0.5 rounded-md">
              {weeklyRolls} calls / wk
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="15"
            value={weeklyRolls}
            onChange={(e) => setWeeklyRolls(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
          />
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Average job ticket:
            </label>
            <span className="text-sm font-black text-orange-600 bg-orange-100/80 px-2.5 py-0.5 rounded-md">
              {formatUSD(avgTicket)}
            </span>
          </div>
          <input
            type="range"
            min="200"
            max="5000"
            step="50"
            value={avgTicket}
            onChange={(e) => setAvgTicket(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
          />
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Average round-trip drive time:
            </label>
            <span className="text-sm font-black text-orange-600 bg-orange-100/80 px-2.5 py-0.5 rounded-md">
              {driveMinutes} mins
            </span>
          </div>
          <input
            type="range"
            min="10"
            max="120"
            step="5"
            value={driveMinutes}
            onChange={(e) => setDriveMinutes(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
          />
        </div>
      </div>

      <div className="mt-8 p-6 bg-gradient-to-br from-orange-50 via-amber-50/60 to-orange-50/30 rounded-xl border border-orange-200/80">
        <div className="text-xs font-bold text-orange-800 uppercase tracking-wider mb-1 flex items-center gap-1.5">
          <AlertTriangle className="w-4 h-4 text-orange-600" />
          <span>Your Estimated Annual Truck Roll Drain</span>
        </div>
        <div className="text-4xl sm:text-5xl font-black text-slate-900 my-2 tracking-tight">
          {formatUSD(totalTax)}
        </div>
        <div className="text-xs font-medium text-slate-600">
          Based on <span className="font-bold text-slate-800">{wastedRollsPerYear} wasted rolls</span>/year x{" "}
          <span className="font-bold text-slate-800">{formatUSD(costPerRoll)}</span> avg fuel, labor & vehicle cost.
        </div>
        <div className="text-xs font-semibold text-orange-700 mt-3 pt-3 border-t border-orange-200/60 flex items-center justify-between">
          <span>That is not an expense. That is an avoidable loss.</span>
          <span className="text-[11px] bg-white px-2 py-0.5 rounded text-orange-700 shadow-sm border border-orange-200">
            Plumbify eliminates this
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Pain Scene Card ─────────────────────────────────────────────

interface PainSceneProps {
  title: string;
  subtitle: string;
  body: string;
  stat: string;
  statLabel: string;
  illustration: React.ReactNode;
  theme: "rose" | "amber" | "indigo";
}

function PainSceneCard({ title, subtitle, body, stat, statLabel, illustration, theme }: PainSceneProps) {
  const themeMap = {
    rose: {
      badge: "bg-rose-50 text-rose-700 border-rose-200",
      statBg: "bg-rose-600",
      accent: "text-rose-600",
      border: "border-rose-100 hover:border-rose-300",
    },
    amber: {
      badge: "bg-amber-50 text-amber-700 border-amber-200",
      statBg: "bg-amber-600",
      accent: "text-amber-600",
      border: "border-amber-100 hover:border-amber-300",
    },
    indigo: {
      badge: "bg-orange-50 text-orange-700 border-orange-200",
      statBg: "bg-orange-600",
      accent: "text-orange-600",
      border: "border-orange-100 hover:border-orange-300",
    },
  };

  const t = themeMap[theme];

  return (
    <div
      className={`bg-white border ${t.border} rounded-2xl p-6 sm:p-7 relative flex flex-col shadow-sm hover:shadow-xl transition-all duration-300`}
    >
      {/* Scene illustration container */}
      <div className="mb-5 h-44 sm:h-48 bg-slate-50/80 rounded-xl border border-slate-100 relative overflow-hidden flex items-center justify-center">
        {illustration}
      </div>

      <div className="flex items-center justify-between mb-2">
        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${t.badge}`}>
          {statLabel}
        </span>
      </div>

      <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight mb-1">{title}</h3>
      <p className="text-xs font-semibold text-slate-500 mb-3">{subtitle}</p>
      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6 flex-1">{body}</p>

      <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
        <span className="text-xs text-slate-400 font-medium">Quantified Cost</span>
        <div className={`${t.statBg} text-white px-3.5 py-1.5 rounded-lg text-lg font-black tracking-tight shadow-sm`}>
          {stat}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────

export default function WhyPlumbifyPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: "Is Plumbify another complex CRM like ServiceTitan?",
      a: "No. ServiceTitan is designed for 20+ truck enterprise fleets with full-time dispatchers and expensive consultants. Plumbify is purpose-built for 1-10 truck plumbing contractors where the owner is actively in the field or managing dispatch. Zero steep learning curve, no 3-month onboarding, and no $500/month seat fees.",
    },
    {
      q: "How long does setup take?",
      a: "Most plumbing owners are fully live in under 15 minutes. Connect your call forwarding, set your service areas, and add your team. Everything works through your existing phones via automated SMS and smart dispatch views.",
    },
    {
      q: "Do my field technicians need to install a heavy app?",
      a: "No. Plumbify works seamlessly through standard SMS and clean mobile web links. If your technicians can read and reply to a text message, they can use Plumbify without any training.",
    },
    {
      q: "What if I already pay for Jobber, Housecall Pro, or Google LSA?",
      a: "Plumbify acts as your 24/7 revenue guard. We capture the emergency calls and weekend leads that slip past your current software, screen out unpaid tire-kickers with diagnostic deposits, and route qualified ready-to-pay homeowners straight to your schedule.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans selection:bg-orange-500 selection:text-white relative">
      {/* ─── Global Background Subtle Grid & Lighting ──────── */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-40"
        style={{
          backgroundImage: `
            radial-gradient(at 20% 10%, rgba(234, 88, 12, 0.04) 0px, transparent 50%),
            radial-gradient(at 80% 0%, rgba(59, 130, 246, 0.03) 0px, transparent 50%),
            radial-gradient(at 50% 80%, rgba(245, 158, 11, 0.03) 0px, transparent 60%),
            linear-gradient(to right, #E2E8F0 1px, transparent 1px),
            linear-gradient(to bottom, #E2E8F0 1px, transparent 1px)
          `,
          backgroundSize: "100% 100%, 100% 100%, 100% 100%, 48px 48px, 48px 48px",
        }}
        aria-hidden="true"
      />

      {/* ─── Navbar ─────────────────────────────────────────── */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-2 rounded-xl text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
              <PhoneCall className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-lg text-slate-900 tracking-tight leading-none">Plumbify</span>
              <span className="text-[10px] font-bold text-orange-600 tracking-widest uppercase mt-0.5">
                Dispatch &amp; Revenue Guard
              </span>
            </div>
          </Link>

          <div className="flex items-center space-x-4">
            <Link
              href="/calculator"
              className="hidden sm:inline-flex items-center text-xs font-bold text-slate-600 hover:text-orange-600 uppercase tracking-wider transition"
            >
              <Calculator className="w-3.5 h-3.5 mr-1 text-slate-400" />
              Loss Calculator
            </Link>
            <a
              href="https://go.plumbify.net/widget/bookings/telephone-nterview-calendar"
              target="_blank"
              rel="noopener"
              className="px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md shadow-orange-600/20 transition-all hover:shadow-lg hover:-translate-y-0.5 flex items-center space-x-1.5"
            >
              <span>2-Minute Walkthrough</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </nav>

      {/* ─── Hero Section ───────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-20 relative z-10">
        <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 overflow-hidden mb-16 shadow-2xl shadow-slate-900/20 border border-slate-800">
          {/* Subtle Technical Architectural Blueprint Background Overlay */}
          <div className="absolute inset-0 opacity-15 pointer-events-none" aria-hidden="true">
            <svg viewBox="0 0 1200 600" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
              <defs>
                <pattern id="hero-grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#60A5FA" strokeWidth="0.75" opacity="0.4" />
                  <circle cx="40" cy="40" r="1.5" fill="#F97316" opacity="0.6" />
                </pattern>
                <linearGradient id="pipe-glow" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#EA580C" stopOpacity="0.1" />
                  <stop offset="50%" stopColor="#FB923C" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#EA580C" stopOpacity="0.1" />
                </linearGradient>
              </defs>

              <rect width="100%" height="100%" fill="url(#hero-grid-pattern)" />

              {/* Blueprint Pipe Network */}
              <path
                d="M 50 120 L 350 120 L 350 280 L 850 280 L 850 420 L 1150 420"
                fill="none"
                stroke="url(#pipe-glow)"
                strokeWidth="4"
              />
              <circle cx="350" cy="120" r="8" fill="#F97316" />
              <circle cx="350" cy="280" r="8" fill="#60A5FA" />
              <circle cx="850" cy="280" r="8" fill="#F97316" />
              <circle cx="850" cy="420" r="8" fill="#60A5FA" />

              {/* Water Pressure Gauge Vector */}
              <g transform="translate(920, 100)" opacity="0.35">
                <circle cx="50" cy="50" r="42" fill="#0F172A" stroke="#38BDF8" strokeWidth="3" />
                <circle cx="50" cy="50" r="3" fill="#EA580C" />
                <line x1="50" y1="50" x2="72" y2="35" stroke="#EA580C" strokeWidth="2.5" />
                <text x="50" y="70" fill="#94A3B8" fontSize="8" fontFamily="monospace" textAnchor="middle">
                  PSI x 100
                </text>
              </g>

              {/* Pipe Wrench Blueprint Silhouette */}
              <g transform="translate(120, 360) rotate(-20)" opacity="0.25">
                <rect x="0" y="0" width="14" height="120" fill="#94A3B8" rx="2" />
                <path d="M -10 120 L 24 120 L 24 150 L -10 150 Z" fill="#94A3B8" />
                <circle cx="7" cy="135" r="8" fill="#0F172A" />
              </g>
            </svg>
          </div>

          {/* Hero Content */}
          <div className="relative z-10 text-center max-w-4xl mx-auto px-6 sm:px-8 py-16 sm:py-24">
            <div className="inline-flex items-center space-x-2 bg-orange-500/10 border border-orange-500/30 px-3.5 py-1.5 rounded-full text-orange-400 text-xs font-bold uppercase tracking-widest mb-6">
              <Sparkles className="w-3.5 h-3.5 text-orange-400" />
              <span>Built specifically for 1–10 truck plumbing contractors</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white uppercase tracking-tight leading-[1.15] mb-6">
              You became a plumber.
              <br />
              <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500 bg-clip-text text-transparent">
                Not an unpaid bookkeeper.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto tracking-wide mb-10 font-normal">
              Traditional software sells 3-month onboarding, $500/month bills, and apps your technicians refuse to open.
              <br className="hidden sm:block" />
              Plumbify stops missed-call leakages, eliminates $150 free estimate tire-kickers, and keeps your cash moving.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href="https://go.plumbify.net/widget/bookings/telephone-nterview-calendar"
                target="_blank"
                rel="noopener"
                className="px-7 py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-orange-500/25 transition-all hover:scale-[1.02] flex items-center space-x-2"
              >
                <span>See if Plumbify fits — 2 Min Walkthrough</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#calculator-section"
                className="px-7 py-4 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs uppercase tracking-wider rounded-xl transition hover:text-white"
              >
                Calculate your Truck Roll Tax
              </a>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-3 gap-4 pt-12 mt-12 border-t border-slate-800/80 max-w-2xl mx-auto">
              <div>
                <div className="text-xl sm:text-2xl font-black text-white tracking-tight">&lt; 15 Mins</div>
                <div className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">Zero-Friction Setup</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-orange-400 tracking-tight">100%</div>
                <div className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">Missed Calls Answered</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-emerald-400 tracking-tight">$0</div>
                <div className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">Tire-Kicker Losses</div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Three Pain Scenes ────────────────────────────── */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-200/60 text-slate-700 text-[11px] font-bold uppercase tracking-widest mb-3">
            <Clock className="w-3.5 h-3.5 text-orange-600" />
            <span>The Daily Operating Drain</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Where your hard-earned revenue silently bleeds
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {/* Scene 1: Crawl Space Missed Call */}
          <PainSceneCard
            title="The $1,200 Call You Almost Missed"
            subtitle="Tuesday 2:15 PM · Under a house crawl space"
            body="You are on your knees in damp mud with a flashlight in your mouth and solder in hand. Your phone vibrates on the kitchen counter above. By the time you crawl out and wash your hands, the homeowner has already booked the next plumber on Google."
            stat="$1,200"
            statLabel="Emergency Missed Job"
            theme="rose"
            illustration={
              <svg viewBox="0 0 400 180" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
                {/* Background Sky & Subfloor cutaway */}
                <rect width="400" height="180" fill="#F8FAFC" />

                {/* Subfloor Architecture */}
                <rect x="0" y="85" width="400" height="12" fill="#CBD5E1" />
                <line x1="0" y1="85" x2="400" y2="85" stroke="#94A3B8" strokeWidth="1.5" />
                <line x1="0" y1="97" x2="400" y2="97" stroke="#94A3B8" strokeWidth="1.5" />

                {/* Floor Joists */}
                <rect x="60" y="85" width="14" height="20" fill="#94A3B8" />
                <rect x="180" y="85" width="14" height="20" fill="#94A3B8" />
                <rect x="300" y="85" width="14" height="20" fill="#94A3B8" />

                {/* Main Drain & Supply Pipes */}
                <path d="M 0 135 L 140 135 L 140 85" fill="none" stroke="#3B82F6" strokeWidth="8" strokeLinecap="round" />
                <path d="M 0 120 L 220 120 L 220 85" fill="none" stroke="#EA580C" strokeWidth="6" strokeLinecap="round" />
                <circle cx="140" cy="135" r="7" fill="#1D4ED8" />
                <circle cx="220" cy="120" r="5" fill="#C2410C" />

                {/* Upper Floor Room (Kitchen/Counter) */}
                <rect x="250" y="35" width="120" height="50" fill="#E2E8F0" rx="4" />
                <rect x="260" y="25" width="40" height="10" fill="#94A3B8" rx="2" />

                {/* Ringing Smartphone on Counter */}
                <g transform="translate(300, 38)">
                  <rect x="0" y="0" width="24" height="42" rx="4" fill="#0F172A" stroke="#475569" strokeWidth="1.5" />
                  <rect x="3" y="6" width="18" height="30" rx="2" fill="#EA580C" />
                  {/* Vibrating Pulse Waves */}
                  <circle cx="12" cy="21" r="16" fill="none" stroke="#DC2626" strokeWidth="1.5" opacity="0.6">
                    <animate attributeName="r" values="12;22;12" dur="1.5s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.8;0.2;0.8" dur="1.5s" repeatCount="indefinite" />
                  </circle>
                  <text x="12" y="24" fill="#FFFFFF" fontSize="6" fontFamily="sans-serif" fontWeight="900" textAnchor="middle">
                    CALL
                  </text>
                </g>

                {/* Missed Call Alert Badge */}
                <g transform="translate(230, 10)">
                  <rect x="0" y="0" width="130" height="22" rx="6" fill="#FEE2E2" stroke="#FCA5A5" strokeWidth="1" />
                  <circle cx="11" cy="11" r="4" fill="#DC2626" />
                  <text x="22" y="14" fill="#991B1B" fontSize="8" fontFamily="sans-serif" fontWeight="bold">
                    LOST: $1,200 Burst Pipe
                  </text>
                </g>

                {/* Plumber in Crawl Space */}
                <g transform="translate(60, 105)">
                  {/* Flashlight Beam */}
                  <polygon points="50,15 150,5 150,35" fill="url(#flashlight-gradient)" opacity="0.6" />
                  <defs>
                    <linearGradient id="flashlight-gradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#FBBF24" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#FEF3C7" stopOpacity="0.05" />
                    </linearGradient>
                  </defs>
                  {/* Plumber Silhouette */}
                  <ellipse cx="25" cy="28" rx="18" ry="10" fill="#475569" />
                  <circle cx="42" cy="22" r="8" fill="#334155" />
                  <rect x="46" y="20" width="8" height="4" fill="#F59E0B" rx="1" />
                </g>
              </svg>
            }
          />

          {/* Scene 2: Truck Roll Tax */}
          <PainSceneCard
            title="The $150 Truck Roll Tax"
            subtitle="Thursday 11:00 AM · Driveway estimate"
            body="You fight 45 minutes of metro traffic, inspect a water heater, write out a thorough breakdown, and hear the phrase every tradesman despises: 'Thanks, I'll think about it.' That 2-hour round trip just cost you $150 in hard fuel, wages, and lost dispatch time."
            stat="$7,800/yr"
            statLabel="Unpaid Driveway Estimates"
            theme="amber"
            illustration={
              <svg viewBox="0 0 400 180" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
                <rect width="400" height="180" fill="#F8FAFC" />

                {/* Suburban House Front */}
                <polygon points="170,40 280,10 390,40" fill="#CBD5E1" />
                <rect x="180" y="40" width="200" height="90" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1" />
                <rect x="260" y="70" width="40" height="60" fill="#334155" rx="2" />
                <circle cx="292" cy="100" r="2" fill="#FBBF24" />
                <rect x="200" y="60" width="35" height="35" fill="#93C5FD" stroke="#64748B" strokeWidth="1" />

                {/* Driveway Ground */}
                <rect x="0" y="130" width="400" height="50" fill="#E2E8F0" />
                <line x1="0" y1="130" x2="400" y2="130" stroke="#94A3B8" strokeWidth="1.5" />

                {/* Plumbing Van */}
                <g transform="translate(20, 80)">
                  <rect x="0" y="15" width="115" height="42" rx="4" fill="#FFFFFF" stroke="#64748B" strokeWidth="1.5" />
                  <path d="M 85 15 L 125 30 L 125 57 L 85 57 Z" fill="#FFFFFF" stroke="#64748B" strokeWidth="1.5" />
                  {/* Van Livery & Window */}
                  <rect x="0" y="32" width="105" height="6" fill="#EA580C" />
                  <rect x="88" y="22" width="25" height="16" fill="#0F172A" rx="2" />
                  {/* Van Wheels */}
                  <circle cx="28" cy="57" r="11" fill="#1E293B" stroke="#64748B" strokeWidth="2" />
                  <circle cx="28" cy="57" r="4" fill="#94A3B8" />
                  <circle cx="100" cy="57" r="11" fill="#1E293B" stroke="#64748B" strokeWidth="2" />
                  <circle cx="100" cy="57" r="4" fill="#94A3B8" />
                  {/* Roof Pipe Rack */}
                  <line x1="10" y1="10" x2="110" y2="10" stroke="#64748B" strokeWidth="3" />
                  <line x1="25" y1="15" x2="25" y2="10" stroke="#64748B" strokeWidth="2" />
                  <line x1="95" y1="15" x2="95" y2="10" stroke="#64748B" strokeWidth="2" />
                </g>

                {/* Homeowner 'I'll think about it' bubble */}
                <g transform="translate(170, 20)">
                  <rect x="0" y="0" width="125" height="28" rx="8" fill="#FFFBEB" stroke="#FCD34D" strokeWidth="1.5" />
                  <polygon points="50,28 60,28 55,36" fill="#FFFBEB" stroke="#FCD34D" strokeWidth="1" />
                  <text x="62" y="18" fill="#B45309" fontSize="8.5" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">
                    &quot;Thanks, I&apos;ll think about it!&quot;
                  </text>
                </g>

                {/* Floating Cost Bubble */}
                <g transform="translate(305, 75)">
                  <rect x="0" y="0" width="85" height="32" rx="6" fill="#FEE2E2" stroke="#FCA5A5" strokeWidth="1" />
                  <text x="42" y="14" fill="#991B1B" fontSize="7.5" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">
                    -$150 TRUCK ROLL
                  </text>
                  <text x="42" y="25" fill="#DC2626" fontSize="7" fontFamily="monospace" textAnchor="middle">
                    0% COMMITTED
                  </text>
                </g>
              </svg>
            }
          />

          {/* Scene 3: Sunday Night Table Overload */}
          <PainSceneCard
            title="You Left the Office for a Reason"
            subtitle="Sunday 8:45 PM · Dining room table"
            body="The kids are asleep. You are staring at crumpled supply receipts, messy QuickBooks line items, and unpaid customer invoices. You spent 4 to 6 hours on manual administrative data entry. You became a licensed master plumber, not an unpaid bookkeeper."
            stat="4-6 hrs"
            statLabel="Every Sunday Night"
            theme="indigo"
            illustration={
              <svg viewBox="0 0 400 180" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
                <rect width="400" height="180" fill="#F8FAFC" />

                {/* Window with night sky */}
                <rect x="270" y="20" width="105" height="75" rx="4" fill="#0F172A" stroke="#CBD5E1" strokeWidth="2" />
                <line x1="322" y1="20" x2="322" y2="95" stroke="#334155" strokeWidth="1.5" />
                <line x1="270" y1="57" x2="375" y2="57" stroke="#334155" strokeWidth="1.5" />
                <circle cx="345" cy="38" r="8" fill="#FDE047" opacity="0.8" />

                {/* Wall Clock pointing to 8:45 PM */}
                <g transform="translate(45, 30)">
                  <circle cx="18" cy="18" r="16" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="2" />
                  <line x1="18" y1="18" x2="18" y2="8" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" />
                  <line x1="18" y1="18" x2="7" y2="18" stroke="#EA580C" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="18" cy="18" r="2" fill="#EA580C" />
                </g>

                {/* Table Surface */}
                <rect x="20" y="115" width="360" height="50" rx="4" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="1.5" />

                {/* Open Laptop with Accounting Charts */}
                <g transform="translate(140, 70)">
                  <rect x="0" y="0" width="85" height="52" rx="4" fill="#1E293B" stroke="#475569" strokeWidth="1.5" />
                  <rect x="5" y="6" width="75" height="40" rx="2" fill="#0F172A" />
                  {/* Chart bars on laptop */}
                  <rect x="12" y="30" width="8" height="12" fill="#F97316" />
                  <rect x="24" y="22" width="8" height="20" fill="#3B82F6" />
                  <rect x="36" y="16" width="8" height="26" fill="#EF4444" />
                  <rect x="48" y="26" width="8" height="16" fill="#10B981" />
                  <line x1="12" y1="12" x2="70" y2="12" stroke="#64748B" strokeWidth="2" />
                  {/* Keyboard base */}
                  <path d="M -8 52 L 93 52 L 100 58 L -15 58 Z" fill="#64748B" />
                </g>

                {/* Stack of Invoices & Receipts */}
                <g transform="translate(250, 100)">
                  <rect x="0" y="0" width="50" height="22" rx="2" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="1" transform="rotate(8)" />
                  <rect x="10" y="-8" width="50" height="22" rx="2" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="1" transform="rotate(-4)" />
                  <line x1="16" y1="-2" x2="48" y2="-2" stroke="#EA580C" strokeWidth="1" />
                  <line x1="16" y1="4" x2="40" y2="4" stroke="#64748B" strokeWidth="1" />
                </g>

                {/* Coffee Mug */}
                <g transform="translate(105, 95)">
                  <rect x="0" y="0" width="16" height="22" rx="2" fill="#EA580C" />
                  <path d="M 16 4 Q 22 10 16 16" fill="none" stroke="#EA580C" strokeWidth="2" />
                </g>

                {/* 5 Hours Lost Tag */}
                <g transform="translate(25, 80)">
                  <rect x="0" y="0" width="85" height="26" rx="6" fill="#EFF6FF" stroke="#BFDBFE" strokeWidth="1" />
                  <text x="42" y="17" fill="#1D4ED8" fontSize="8" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">
                    5 HRS RE-ENTERING DATA
                  </text>
                </g>
              </svg>
            }
          />
        </div>

        {/* ─── Calculator Section ───────────────────────────── */}
        <div id="calculator-section" className="max-w-3xl mx-auto mb-24 scroll-mt-24">
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-orange-100/80 text-orange-800 text-[11px] font-bold uppercase tracking-widest mb-3">
              <Calculator className="w-3.5 h-3.5 text-orange-600" />
              <span>Interactive ROI Calculator</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight mb-2">
              Calculate your uncommitted dispatch drain
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
              Slide the numbers to reflect your fleet and see what unpaid quotes cost your business each year.
            </p>
          </div>
          <TruckRollCalculator />
        </div>

        {/* ─── What Plumbify Actually Does ──────────────────── */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-100/80 text-emerald-800 text-[11px] font-bold uppercase tracking-widest mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>The Automated Fix</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight mb-3">
              Three things. That is all your business needs.
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 uppercase tracking-wider">
              No new apps to install. No manual data entry.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-7 sm:p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center mb-6">
                <PhoneCall className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight mb-2.5">
                1. 24/7 Call &amp; Missed Intake
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                When you or your crew are in a crawl space or on a roof, our instant system answers inbound calls,
                captures job details, and secures customer commitments before they reach out to your local competitors.
              </p>
            </div>

            <div className="bg-white p-7 sm:p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center mb-6">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight mb-2.5">
                2. Automated $49 Deposit Gate
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Homeowners submit photos of their leaking valve or water heater and authorize a diagnostic deposit
                before your truck leaves the driveway. 100% of non-paying price shoppers are filtered out.
              </p>
            </div>

            <div className="bg-white p-7 sm:p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-6">
                <DollarSign className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight mb-2.5">
                3. Zero-Touch Review &amp; Pay
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Instant tap-to-pay and SMS invoicing on job completion. The second payment lands, an automated 5-star
                Google review invite is dispatched to push your business to the top of local search.
              </p>
            </div>
          </div>
        </div>

        {/* ─── Comparison Table ─────────────────────────────── */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-200/70 text-slate-700 text-[11px] font-bold uppercase tracking-widest mb-3">
              <Zap className="w-3.5 h-3.5 text-orange-600" />
              <span>Direct Comparison</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Built for real field operators. Not software teams.
            </h2>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
            <div className="grid grid-cols-3 bg-slate-100/80 border-b border-slate-200 text-xs font-bold uppercase tracking-wider">
              <div className="p-4 sm:p-5 text-slate-500">Feature / Dimension</div>
              <div className="p-4 sm:p-5 text-orange-700 bg-orange-50/80 text-center font-black border-x border-orange-200/60">
                Plumbify
              </div>
              <div className="p-4 sm:p-5 text-slate-500 text-right">Legacy Systems (ServiceTitan / Jobber)</div>
            </div>

            {[
              { label: "Setup Time", us: "15 Minutes", them: "2-3 Months" },
              { label: "Monthly Pricing", us: "Simple flat rate", them: "$500+ / seat + hidden fees" },
              { label: "Technician Learning Curve", us: "Zero (uses plain SMS)", them: "Complex tablet app required" },
              { label: "Contract Commitment", us: "Month-to-month", them: "12-24 month lock-in" },
              { label: "Missed-Call Protection", us: "Instant text & qualification", them: "Leaves customer in voicemail" },
              { label: "Tire-Kicker Filtering", us: "Automated deposit authorization", them: "Unpaid truck rolls" },
              { label: "Sunday Night Reconciliation", us: "Automated real-time syncing", them: "4-6 hours manual QuickBooks entry" },
            ].map((row, idx) => (
              <div
                key={row.label}
                className={`grid grid-cols-3 text-xs sm:text-sm items-center border-b border-slate-100 ${
                  idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"
                }`}
              >
                <div className="p-4 sm:p-5 font-semibold text-slate-800">{row.label}</div>
                <div className="p-4 sm:p-5 font-black text-orange-600 bg-orange-50/40 text-center border-x border-orange-100/60 flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-orange-600 shrink-0" />
                  <span>{row.us}</span>
                </div>
                <div className="p-4 sm:p-5 text-slate-500 text-right flex items-center justify-end gap-1.5">
                  <XCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{row.them}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ─── FAQ ──────────────────────────────────────────── */}
        <div className="max-w-3xl mx-auto mb-24">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
            {faqs.map((faq, idx) => (
              <div key={idx} className="transition-colors">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-5 sm:p-6 flex items-center justify-between text-left hover:bg-slate-50 transition"
                >
                  <span className="text-sm sm:text-base font-bold text-slate-900 pr-4">{faq.q}</span>
                  <ChevronRight
                    className={`w-5 h-5 text-orange-600 shrink-0 transition-transform duration-200 ${
                      openFaq === idx ? "rotate-90" : ""
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 bg-slate-50/50">
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ─── Final High-Impact CTA ────────────────────────── */}
        <div className="relative rounded-3xl bg-gradient-to-br from-orange-600 via-orange-500 to-amber-600 p-8 sm:p-14 text-center text-white shadow-2xl shadow-orange-600/30 overflow-hidden">
          {/* Subtle geometric circles */}
          <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-white/10 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-black/10 blur-2xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight mb-4 leading-tight">
              Stop losing jobs to voicemail.
              <br />
              Stop paying the Truck Roll Tax.
            </h2>
            <p className="text-xs sm:text-sm text-orange-100 leading-relaxed mb-8 max-w-lg mx-auto">
              Reclaim your dispatch control and get your Sunday nights back.
              <br />
              Schedule a 2-minute live walkthrough with our founding team.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href="https://go.plumbify.net/widget/bookings/telephone-nterview-calendar"
                target="_blank"
                rel="noopener"
                className="px-8 py-4 bg-slate-950 hover:bg-slate-900 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-xl transition-all hover:scale-105 flex items-center space-x-2"
              >
                <CalendarDays className="w-4 h-4 text-orange-400" />
                <span>Book 2-Minute Walkthrough</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <Link
                href="/calculator"
                className="px-6 py-4 bg-white/15 hover:bg-white/25 border border-white/30 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition"
              >
                Calculate Loss First
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* ─── Footer ────────────────────────────────────────── */}
      <footer className="border-t border-slate-200 bg-white py-8 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <div className="bg-orange-600 p-1.5 rounded-lg text-white">
              <PhoneCall className="w-3.5 h-3.5" />
            </div>
            <span className="font-black text-sm text-slate-900 tracking-tight">Plumbify</span>
          </div>
          <div className="text-xs text-slate-400 font-medium">
            &copy; {new Date().getFullYear()} Plumbify. Built for independent plumbing contractors.
          </div>
        </div>
      </footer>
    </div>
  );
}
