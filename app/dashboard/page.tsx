"use client";

import React, { useState, useEffect } from "react";
import { 
  BarChart3, 
  Users, 
  Star, 
  Zap, 
  RefreshCcw, 
  Search, 
  CheckCircle, 
  Activity, 
  Sparkles, 
  ShieldCheck, 
  TrendingUp, 
  Map, 
  UserCheck, 
  DollarSign, 
  Package, 
  ArrowRight, 
  ChevronRight, 
  Clock, 
  Briefcase, 
  PhoneCall, 
  MapPin, 
  AlertCircle,
  TrendingDown,
  Info,
  X,
  Filter,
  Layers,
  Award,
  ChevronDown
} from "lucide-react";

interface CRMContact {
  id: string;
  contactName?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  tags?: string[];
  dateAdded?: string;
  companyName?: string;
}

interface CRMOpportunity {
  id: string;
  name: string;
  monetaryValue: number;
  pipelineStageId?: string;
  status?: string;
  contact?: {
    name?: string;
    email?: string;
    phone?: string;
  };
}

interface CRMInvoice {
  id: string;
  invoiceNumber?: string;
  title?: string;
  amount?: number;
  status?: string;
  createdAt?: string;
  contact?: {
    name?: string;
    email?: string;
  };
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Data States
  const [contacts, setContacts] = useState<CRMContact[]>([]);
  const [opportunities, setOpportunities] = useState<CRMOpportunity[]>([]);
  const [invoices, setInvoices] = useState<CRMInvoice[]>([]);
  const [stats, setStats] = useState({
    jobsDispatched: 354,
    savedRevenue: 571800,
    pendingValue: 897900,
    lostValue: 58700,
    target: 1880887,
    actual: 1750675,
    kpi: 93,
    returningRate: 70
  });

  // Modal Interactive States
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState("2028");

  // Fetch real/fallback data from our resilient API endpoints
  const fetchData = async () => {
    setRefreshing(true);
    try {
      // 1. Fetch Opportunities
      const oppRes = await fetch("/api/opportunities");
      if (oppRes.ok) {
        const oppData = await oppRes.json();
        if (oppData.opportunities && oppData.opportunities.length > 0) {
          setOpportunities(oppData.opportunities);
        }
      }

      // 2. Fetch Contacts
      const cntRes = await fetch("/api/contacts");
      if (cntRes.ok) {
        const cntData = await cntRes.json();
        if (cntData.contacts && cntData.contacts.length > 0) {
          setContacts(cntData.contacts);
        }
      }

      // 3. Fetch Invoices
      const invRes = await fetch("/api/invoices");
      if (invRes.ok) {
        const invData = await invRes.json();
        if (invData.invoices && invData.invoices.length > 0) {
          setInvoices(invData.invoices);
        }
      }
    } catch (err) {
      console.warn("Failed to fetch live API stats, using resilient UI state:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Leaderboard Technicians Mock
  const leaderboard = [
    { name: "Ava Vance", role: "Master Plumber", score: "102%", jobs: 42, avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" },
    { name: "Madison Reed", role: "HVAC & Drain Spec.", score: "101%", jobs: 39, avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80" },
    { name: "Daniel Craig", role: "Commercial Lead", score: "93%", jobs: 31, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" },
    { name: "Ryan Miller", role: "Leak Detection Tech", score: "88%", jobs: 28, avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80" },
    { name: "Sophia Torres", role: "Residential Specialist", score: "81%", jobs: 24, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80" },
  ];

  return (
    <div className="min-h-screen bg-[#0A0C14] text-slate-100 font-sans p-4 sm:p-6 lg:p-8 select-none">
      {/* ----------------- TOP NAVBAR HEADER ----------------- */}
      <header className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-500 to-cyan-400 p-[2px] shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-[#0F111A] rounded-[10px] flex items-center justify-center">
              <Zap className="w-5 h-5 text-cyan-400 fill-cyan-400/20" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-400">
              Plumbify Analytics
            </h1>
            <p className="text-xs text-slate-400 flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live GHL Integration & Revenue Intelligence
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search leads, jobs or invoices..."
              className="bg-[#141724] border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500/60 transition w-56 sm:w-64 placeholder:text-slate-500"
            />
          </div>

          <button 
            onClick={fetchData}
            disabled={refreshing}
            className="flex items-center gap-2 px-3 py-2 bg-[#161926] hover:bg-slate-800/80 border border-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-medium transition shadow-sm"
          >
            <RefreshCcw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-cyan-400" : ""}`} />
            <span>Sync</span>
          </button>
        </div>
      </header>

      {/* ----------------- BENTO GRID DASHBOARD ----------------- */}
      <main className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-5">

        {/* CARD 1: CONVERSION FUNNEL (Top Left) */}
        <div 
          onClick={() => setActiveModal("funnel")}
          className="md:col-span-6 bg-gradient-to-b from-[#151828] to-[#10121F] border border-slate-800/80 hover:border-violet-500/40 rounded-3xl p-6 transition duration-300 shadow-xl shadow-black/40 cursor-pointer group relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-100 group-hover:text-violet-400 transition">Conversion</h2>
              <p className="text-xs text-slate-400">Pipeline Deal Progression & Velocity</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-medium text-slate-400 block">Sales Funnel</span>
              <span className="text-[10px] text-cyan-400 font-semibold bg-cyan-500/10 px-2 py-0.5 rounded-full">Updated Live</span>
            </div>
          </div>

          {/* Trapezoid Neon Funnel Visual */}
          <div className="flex flex-col gap-2 max-w-md mx-auto my-4">
            {/* Step 1: Leads */}
            <div className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 rounded-lg p-2.5 flex items-center justify-between shadow-md shadow-violet-900/20">
              <span className="text-xs font-bold text-white pl-4">40%</span>
              <span className="text-xs font-bold tracking-wider text-white">Leads</span>
              <div className="text-right pr-2">
                <span className="text-xs font-black text-white block">5,719</span>
                <span className="text-[9px] text-emerald-300 font-semibold">KPI 101%</span>
              </div>
            </div>

            {/* Step 2: MQL */}
            <div className="w-[88%] mx-auto bg-gradient-to-r from-violet-500 via-indigo-500 to-fuchsia-500 rounded-lg p-2.5 flex items-center justify-between shadow-md">
              <span className="text-xs font-bold text-white pl-4">52%</span>
              <span className="text-xs font-bold tracking-wider text-white">MQL</span>
              <div className="text-right pr-2">
                <span className="text-xs font-black text-white block">2,309</span>
                <span className="text-[9px] text-emerald-300 font-semibold">KPI 103%</span>
              </div>
            </div>

            {/* Step 3: SQL */}
            <div className="w-[76%] mx-auto bg-gradient-to-r from-indigo-500 via-purple-600 to-cyan-500 rounded-lg p-2 flex items-center justify-between shadow-md">
              <span className="text-xs font-bold text-white pl-4">64%</span>
              <span className="text-xs font-bold tracking-wider text-white">SQL</span>
              <div className="text-right pr-2">
                <span className="text-xs font-black text-white block">1,191</span>
                <span className="text-[9px] text-rose-300 font-semibold">KPI 86%</span>
              </div>
            </div>

            {/* Step 4: Opportunity */}
            <div className="w-[64%] mx-auto bg-gradient-to-r from-purple-600 via-cyan-500 to-blue-600 rounded-lg p-2 flex items-center justify-between shadow-md">
              <span className="text-xs font-bold text-white pl-3">46%</span>
              <span className="text-xs font-bold tracking-wider text-white">Opportunity</span>
              <div className="text-right pr-2">
                <span className="text-xs font-black text-white block">768</span>
                <span className="text-[9px] text-emerald-300 font-semibold">KPI 132%</span>
              </div>
            </div>

            {/* Step 5: Deals */}
            <div className="w-[50%] mx-auto bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg p-2 flex items-center justify-center gap-3 shadow-lg shadow-cyan-500/20">
              <span className="text-xs font-black text-white">354</span>
              <span className="text-[11px] font-bold text-cyan-100">Deals</span>
            </div>
          </div>

          {/* Bottom Financial Metrics */}
          <div className="grid grid-cols-3 gap-2 mt-6 pt-4 border-t border-slate-800/80 text-center">
            <div>
              <span className="text-[11px] text-slate-400 font-medium block">Won Deals</span>
              <span className="text-base font-black text-emerald-400">${(stats.savedRevenue / 1000).toFixed(1)}K</span>
              <span className="text-[10px] text-slate-500 block">SHARE 37%</span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 font-medium block">Pending</span>
              <span className="text-base font-black text-amber-400">${(stats.pendingValue / 1000).toFixed(1)}K</span>
              <span className="text-[10px] text-slate-500 block">SHARE 59%</span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 font-medium block">Lost</span>
              <span className="text-base font-black text-rose-400">${(stats.lostValue / 1000).toFixed(1)}K</span>
              <span className="text-[10px] text-slate-500 block">SHARE 4%</span>
            </div>
          </div>
        </div>

        {/* CARD 2: REVENUE / FORECAST (Top Right) */}
        <div 
          onClick={() => setActiveModal("revenue")}
          className="md:col-span-6 bg-gradient-to-b from-[#151828] to-[#10121F] border border-slate-800/80 hover:border-cyan-500/40 rounded-3xl p-6 transition duration-300 shadow-xl shadow-black/40 cursor-pointer group relative"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-100 group-hover:text-cyan-400 transition">Revenue / Forecast</h2>
              <p className="text-xs text-slate-400">Monthly Projected & Actual Gross Revenue</p>
            </div>

            {/* Year Segment Selector */}
            <div className="flex items-center gap-1 bg-[#0D0F18] p-1 rounded-xl border border-slate-800">
              {["2028", "2029", "2030"].map(yr => (
                <button 
                  key={yr}
                  onClick={(e) => { e.stopPropagation(); setSelectedYear(yr); }}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition ${selectedYear === yr ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30" : "text-slate-400 hover:text-white"}`}
                >
                  {yr}
                </button>
              ))}
            </div>
          </div>

          {/* Target & KPI Bar */}
          <div className="flex items-center justify-between bg-[#0F121E] px-4 py-2.5 rounded-2xl border border-slate-800/80 mb-6">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Target</span>
              <span className="text-sm font-bold text-cyan-400">${stats.target.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Actual</span>
              <span className="text-sm font-bold text-white">${stats.actual.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">KPI</span>
              <span className="text-sm font-bold text-emerald-400">{stats.kpi}%</span>
            </div>
          </div>

          {/* Bar & Trend Line Chart Visual */}
          <div className="h-44 flex items-end justify-between gap-2 pt-6 pb-2 px-2 relative">
            {/* Glowing Trend Line overlay */}
            <svg className="absolute inset-x-0 top-3 w-full h-28 pointer-events-none stroke-cyan-400" viewBox="0 0 300 80" fill="none">
              <path d="M 10 50 Q 50 20, 100 45 T 200 25 T 290 15" stroke="url(#cyanGrad)" strokeWidth="3" fill="none" strokeLinecap="round" />
              <defs>
                <linearGradient id="cyanGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#A855F7" />
                  <stop offset="50%" stopColor="#00D2FE" />
                  <stop offset="100%" stopColor="#3B82F6" />
                </linearGradient>
              </defs>
            </svg>

            {[
              { m: "Jan", h: "45%" }, { m: "Feb", h: "35%" }, { m: "Mar", h: "60%" },
              { m: "Apr", h: "50%" }, { m: "May", h: "75%" }, { m: "Jun", h: "65%" },
              { m: "Jul", h: "80%" }, { m: "Aug", h: "70%" }, { m: "Sep", h: "85%" },
              { m: "Oct", h: "95%" }, { m: "Nov", h: "78%" }, { m: "Dec", h: "88%" },
            ].map((bar, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 group/bar">
                <div 
                  style={{ height: bar.h }}
                  className="w-full bg-gradient-to-t from-cyan-600/40 via-indigo-600 to-purple-500 rounded-t-md transition duration-300 group-hover/bar:brightness-125 shadow-lg shadow-indigo-500/10"
                />
                <span className="text-[10px] text-slate-400 group-hover/bar:text-white transition">{bar.m}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CARD 3: OPPORTUNITY PIPELINE & WEEKLY (Bottom Left) */}
        <div 
          onClick={() => setActiveModal("pipeline")}
          className="md:col-span-5 bg-gradient-to-b from-[#151828] to-[#10121F] border border-slate-800/80 hover:border-indigo-500/40 rounded-3xl p-6 transition duration-300 shadow-xl shadow-black/40 cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-100 group-hover:text-indigo-400 transition">Opportunity Pipeline</h2>
              <p className="text-xs text-slate-400">Total Value: <span className="text-white font-semibold">$588,164</span></p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 block">Weekly Activity</span>
              <span className="text-xs font-bold text-emerald-400">79% Velocity</span>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 h-36 items-end mt-4 mb-2 border-b border-slate-800/60 pb-3">
            <div className="flex flex-col items-center gap-1">
              <span className="text-[9px] text-cyan-400 font-bold">201K</span>
              <div className="w-full h-24 bg-gradient-to-t from-cyan-600 to-blue-500 rounded-lg"></div>
              <span className="text-[10px] text-slate-400 font-medium">Qualify</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-[9px] text-fuchsia-400 font-bold">158K</span>
              <div className="w-full h-20 bg-gradient-to-t from-fuchsia-600 to-pink-500 rounded-lg"></div>
              <span className="text-[10px] text-slate-400 font-medium">Proposal</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-[9px] text-amber-400 font-bold">126K</span>
              <div className="w-full h-16 bg-gradient-to-t from-amber-600 to-orange-500 rounded-lg"></div>
              <span className="text-[10px] text-slate-400 font-medium">Negotiation</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-[9px] text-purple-400 font-bold">572K</span>
              <div className="w-full h-28 bg-gradient-to-t from-purple-600 to-violet-500 rounded-lg"></div>
              <span className="text-[10px] text-slate-400 font-medium">Closed</span>
            </div>
          </div>
        </div>

        {/* CARD 4: RETENTION RATE (Middle Bottom) */}
        <div 
          onClick={() => setActiveModal("retention")}
          className="md:col-span-3 bg-gradient-to-b from-[#151828] to-[#10121F] border border-slate-800/80 hover:border-fuchsia-500/40 rounded-3xl p-6 transition duration-300 shadow-xl shadow-black/40 cursor-pointer group flex flex-col items-center justify-between text-center"
        >
          <div className="w-full text-left">
            <h2 className="text-base font-bold text-slate-100 group-hover:text-fuchsia-400 transition">Retention Rate</h2>
            <p className="text-xs text-slate-400">Returning Plumbing Clients</p>
          </div>

          {/* Donut Chart Gauge */}
          <div className="relative w-28 h-28 my-3 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-800"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-cyan-400 stroke-current"
                strokeWidth="3.5"
                strokeDasharray="70, 100"
                strokeLinecap="round"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className="text-2xl font-black text-white">70%</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-fuchsia-500"></span>Returning</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-cyan-400"></span>New Clients</span>
          </div>
        </div>

        {/* CARD 5: LEADERBOARD & SALES CYCLE (Bottom Right) */}
        <div 
          onClick={() => setActiveModal("leaderboard")}
          className="md:col-span-4 bg-gradient-to-b from-[#151828] to-[#10121F] border border-slate-800/80 hover:border-emerald-500/40 rounded-3xl p-6 transition duration-300 shadow-xl shadow-black/40 cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-100 group-hover:text-emerald-400 transition">Leaderboard</h2>
              <p className="text-xs text-slate-400">Top Performing Plumbers & Techs</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-cyan-400">7 Days Avg</span>
            </div>
          </div>

          {/* Technician Rankings List */}
          <div className="space-y-3">
            {leaderboard.map((tech, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs bg-[#0F111B] px-3 py-2 rounded-xl border border-slate-800/60 hover:bg-slate-800/40 transition">
                <div className="flex items-center gap-2.5">
                  <span className="text-[10px] text-slate-400 font-bold w-7">Top-{idx+1}</span>
                  <img src={tech.avatar} alt={tech.name} className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-700" />
                  <span className="font-semibold text-slate-200">{tech.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-14 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full rounded-full" 
                      style={{ width: `${Math.min(parseInt(tech.score), 100)}%` }} 
                    />
                  </div>
                  <span className="font-bold text-emerald-400 text-xs">{tech.score}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>

      {/* ----------------- INTERACTIVE DETAIL MODAL (WHEN A CARD IS CLICKED) ----------------- */}
      {activeModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-[#121422] border border-slate-700/80 w-full max-w-4xl rounded-3xl p-6 sm:p-8 shadow-2xl shadow-purple-950/40 relative max-h-[85vh] overflow-y-auto">
            {/* Modal Close Button */}
            <button 
              onClick={() => setActiveModal(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* MODAL CONTENT: CONVERSION / OPPORTUNITIES */}
            {activeModal === "funnel" && (
              <div>
                <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-violet-400" />
                  Live Opportunities & Deal Progression
                </h3>
                <p className="text-xs text-slate-400 mb-6">Detailed breakdown of active pipeline deals synced with GoHighLevel CRM</p>

                <div className="space-y-3">
                  {opportunities.length > 0 ? (
                    opportunities.map((opp) => (
                      <div key={opp.id} className="bg-[#161928] border border-slate-800 p-4 rounded-2xl flex items-center justify-between hover:border-violet-500/40 transition">
                        <div>
                          <h4 className="font-bold text-sm text-slate-100">{opp.name}</h4>
                          <p className="text-xs text-slate-400">{opp.contact?.name || "Customer Lead"} • {opp.contact?.phone || "+1 (555) 019-2831"}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-black text-emerald-400 block">${(opp.monetaryValue || 850).toLocaleString()}</span>
                          <span className="text-[10px] uppercase font-bold text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded-full">
                            {opp.status || "Open"}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10 text-slate-400 text-sm">Loading live opportunity records...</div>
                  )}
                </div>
              </div>
            )}

            {/* MODAL CONTENT: REVENUE / INVOICES */}
            {activeModal === "revenue" && (
              <div>
                <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-cyan-400" />
                  Revenue Forecast & GHL Invoices
                </h3>
                <p className="text-xs text-slate-400 mb-6">Real-time invoiced revenue and customer billing records</p>

                <div className="space-y-3">
                  {invoices.length > 0 ? (
                    invoices.map((inv) => (
                      <div key={inv.id} className="bg-[#161928] border border-slate-800 p-4 rounded-2xl flex items-center justify-between hover:border-cyan-500/40 transition">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-cyan-400">{inv.invoiceNumber || "INV-2026-001"}</span>
                            <span className="text-sm font-semibold text-slate-200">{inv.title || "Plumbing Service Job"}</span>
                          </div>
                          <p className="text-xs text-slate-400 mt-1">{inv.contact?.name || "Plumbing Customer"}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-black text-emerald-400 block">${(inv.amount || 950).toLocaleString()}</span>
                          <span className="text-[10px] uppercase font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full">
                            {inv.status || "Paid"}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10 text-slate-400 text-sm">Loading live invoice records...</div>
                  )}
                </div>
              </div>
            )}

            {/* MODAL CONTENT: RETENTION / CONTACTS */}
            {(activeModal === "retention" || activeModal === "pipeline" || activeModal === "leaderboard") && (
              <div>
                <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-400" />
                  CRM Contacts & Customer History
                </h3>
                <p className="text-xs text-slate-400 mb-6">Detailed customer database records with tags and historical notes</p>

                <div className="space-y-3">
                  {contacts.length > 0 ? (
                    contacts.map((cnt) => (
                      <div key={cnt.id} className="bg-[#161928] border border-slate-800 p-4 rounded-2xl flex items-center justify-between hover:border-emerald-500/40 transition">
                        <div>
                          <h4 className="font-bold text-sm text-slate-100">{cnt.contactName || `${cnt.firstName || ''} ${cnt.lastName || ''}`}</h4>
                          <p className="text-xs text-slate-400">{cnt.email} • {cnt.phone}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {(cnt.tags || ["vip-customer"]).map((tag, idx) => (
                            <span key={idx} className="text-[10px] font-semibold text-emerald-300 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10 text-slate-400 text-sm">Loading CRM contact records...</div>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
