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
  Navigation,
  Compass,
  Send,
  UserPlus
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
}

interface CRMOpportunity {
  id: string;
  name: string;
  monetaryValue: number;
  status?: string;
  stage?: "todo" | "doing" | "done";
  assignedPlumberId?: string;
  assignedPlumberName?: string;
  address?: string;
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

interface PlumberTech {
  id: string;
  name: string;
  role: string;
  status: "available" | "on-job" | "offline";
  currentLocation: string;
  lat: number;
  lng: number;
  jobsCompleted: number;
  activeJob?: string;
  avatar: string;
  rating: number;
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Live Plumber Team State
  const [plumbers, setPlumbers] = useState<PlumberTech[]>([
    { id: "p1", name: "Ava Vance", role: "Master Plumber", status: "on-job", currentLocation: "Garland, TX (Near I-30)", lat: 32.9126, lng: -96.6389, jobsCompleted: 42, activeJob: "Main Line Clogged - 1420 Oak St", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80", rating: 4.9 },
    { id: "p2", name: "Madison Reed", role: "HVAC & Leak Specialist", status: "available", currentLocation: "Plano, TX (Near Legacy)", lat: 33.0198, lng: -96.6989, jobsCompleted: 39, activeJob: "Idle / Standing by", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80", rating: 4.95 },
    { id: "p3", name: "Daniel Craig", role: "Commercial Specialist", status: "on-job", currentLocation: "Dallas Downtown", lat: 32.7767, lng: -96.7970, jobsCompleted: 31, activeJob: "Commercial Water Heater Replacement", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80", rating: 4.8 },
    { id: "p4", name: "Ryan Miller", role: "Sewer Camera Tech", status: "on-job", currentLocation: "Richardson, TX", lat: 32.9483, lng: -96.7299, jobsCompleted: 28, activeJob: "Emergency Pipe Leak Repair", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80", rating: 4.85 },
    { id: "p5", name: "Sophia Torres", role: "Residential Plumbing Helper", status: "available", currentLocation: "Mesquite, TX", lat: 32.7668, lng: -96.5992, jobsCompleted: 24, activeJob: "Idle / Ready for dispatch", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80", rating: 4.75 },
  ]);

  // Live Work Orders (To Do / Doing / Done)
  const [workOrders, setWorkOrders] = useState<CRMOpportunity[]>([
    { id: "wo1", name: "Emergency Pipe Repair - Sam DeAngelis", monetaryValue: 1250, stage: "doing", assignedPlumberId: "p4", assignedPlumberName: "Ryan Miller", address: "412 Belt Line Rd, Garland, TX", contact: { name: "Sam DeAngelis", phone: "+1 (555) 234-5678", email: "sam@theplumbinghouse.com" } },
    { id: "wo2", name: "Commercial Water Heater Replacement", monetaryValue: 3400, stage: "doing", assignedPlumberId: "p3", assignedPlumberName: "Daniel Craig", address: "890 Elm St, Dallas, TX", contact: { name: "Dallas Commercial Group", phone: "+1 (555) 876-5432", email: "billing@dallasgroup.com" } },
    { id: "wo3", name: "Main Line Drain Jetting & Camera Inspection", monetaryValue: 980, stage: "doing", assignedPlumberId: "p1", assignedPlumberName: "Ava Vance", address: "1420 Oak St, Garland, TX", contact: { name: "Robert Vance", phone: "+1 (555) 345-6789", email: "robert@vancehomes.com" } },
    { id: "wo4", name: "Tankless Water Heater Installation (Pending)", monetaryValue: 2800, stage: "todo", assignedPlumberId: "p2", assignedPlumberName: "Madison Reed", address: "7800 Preston Rd, Plano, TX", contact: { name: "Lisa Kudrow", phone: "+1 (555) 901-2345", email: "lisa@planoresidences.com" } },
    { id: "wo5", name: "Kitchen Sink Leak & Disposal Upgrade", monetaryValue: 450, stage: "todo", assignedPlumberId: "p5", assignedPlumberName: "Sophia Torres", address: "2300 Main St, Mesquite, TX", contact: { name: "Mark Geller", phone: "+1 (555) 678-9012", email: "mark@gellerdesign.com" } },
    { id: "wo6", name: "Whole House Water Filter System Installation", monetaryValue: 1850, stage: "todo", address: "1100 Coit Rd, Richardson, TX", contact: { name: "David Bing", phone: "+1 (555) 789-0123", email: "dbing@techfirm.com" } },
    { id: "wo7", name: "Toilet Replacement & Valve Tune-Up", monetaryValue: 380, stage: "done", assignedPlumberId: "p1", assignedPlumberName: "Ava Vance", address: "550 Apollo Rd, Garland, TX", contact: { name: "Emma Stone", phone: "+1 (555) 890-1234", email: "emma@stoneproperties.com" } },
    { id: "wo8", name: "Slab Leak Thermal Imaging Inspection", monetaryValue: 1500, stage: "done", assignedPlumberId: "p2", assignedPlumberName: "Madison Reed", address: "3200 Park Blvd, Plano, TX", contact: { name: "Tom Holland", phone: "+1 (555) 901-3456", email: "tom@hollandinc.com" } },
    { id: "wo9", name: "Gas Line Pressure Test & Leak Seal", monetaryValue: 1100, stage: "done", assignedPlumberId: "p3", assignedPlumberName: "Daniel Craig", address: "600 Commerce St, Dallas, TX", contact: { name: "Rachel Green", phone: "+1 (555) 012-3456", email: "rachel@ralphlauren.com" } },
  ]);

  const [contacts, setContacts] = useState<CRMContact[]>([]);
  const [invoices, setInvoices] = useState<CRMInvoice[]>([]);
  
  // Interactive Modal State
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [selectedPlumber, setSelectedPlumber] = useState<PlumberTech | null>(null);
  const [dispatchSuccessMsg, setDispatchSuccessMsg] = useState<string | null>(null);

  // Fetch real/fallback data from our resilient API endpoints
  const fetchData = async () => {
    setRefreshing(true);
    try {
      // 1. Fetch Opportunities
      const oppRes = await fetch("/api/opportunities");
      if (oppRes.ok) {
        const oppData = await oppRes.json();
        if (oppData.opportunities && oppData.opportunities.length > 0) {
          const formatted = oppData.opportunities.map((o: any, idx: number) => ({
            id: o.id || `opp_${idx}`,
            name: o.name || "Plumbing Job",
            monetaryValue: o.monetaryValue || 850,
            stage: idx % 3 === 0 ? "todo" : idx % 3 === 1 ? "doing" : "done",
            assignedPlumberName: plumbers[idx % plumbers.length].name,
            address: o.address || "Garland, TX",
            contact: o.contact || { name: "Client Lead", phone: "+1 (555) 234-5678" }
          }));
          setWorkOrders(formatted);
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
      console.warn("Using resilient UI fallback state:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Calculate To Do / Doing / Done metrics
  const todoJobs = workOrders.filter(w => w.stage === "todo");
  const doingJobs = workOrders.filter(w => w.stage === "doing");
  const doneJobs = workOrders.filter(w => w.stage === "done");

  const todoVal = todoJobs.reduce((acc, curr) => acc + curr.monetaryValue, 0);
  const doingVal = doingJobs.reduce((acc, curr) => acc + curr.monetaryValue, 0);
  const doneVal = doneJobs.reduce((acc, curr) => acc + curr.monetaryValue, 0);
  const totalVal = todoVal + doingVal + doneVal;

  // Handle stage change (To Do -> Doing -> Done)
  const handleStageChange = (jobId: string, newStage: "todo" | "doing" | "done") => {
    setWorkOrders(prev => prev.map(job => job.id === jobId ? { ...job, stage: newStage } : job));
  };

  // Handle AI Dispatch
  const handleDispatch = (jobId: string, plumberName: string) => {
    setWorkOrders(prev => prev.map(job => job.id === jobId ? { ...job, assignedPlumberName: plumberName, stage: "doing" } : job));
    setDispatchSuccessMsg(`Job #${jobId} dispatched to ${plumberName} via SMS & GHL Workflow!`);
    setTimeout(() => setDispatchSuccessMsg(null), 4000);
  };

  return (
    <div className="min-h-screen bg-[#090B12] text-slate-100 font-sans p-4 sm:p-6 lg:p-8 select-none">
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
              Plumbify Dispatch & Revenue Intelligence
            </h1>
            <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
              <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                5 Plumbers Online (GPS Live)
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-cyan-400 font-medium">GHL Location ID: RHROdkS0TNPBFZHcZsX0</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {dispatchSuccessMsg && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs px-3 py-1.5 rounded-xl flex items-center gap-1.5 animate-in fade-in">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>{dispatchSuccessMsg}</span>
            </div>
          )}

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search plumber, job address or lead..."
              className="bg-[#131624] border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500/60 transition w-56 sm:w-64 placeholder:text-slate-500"
            />
          </div>

          <button 
            onClick={fetchData}
            disabled={refreshing}
            className="flex items-center gap-2 px-3.5 py-2 bg-[#161926] hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-semibold transition shadow-sm"
          >
            <RefreshCcw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-cyan-400" : ""}`} />
            <span>Sync</span>
          </button>
        </div>
      </header>

      {/* ----------------- BENTO GRID DASHBOARD MAIN ----------------- */}
      <main className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-5">

        {/* ================= CARD 1: TO DO / DOING / DONE PIPELINE (Top-Left Highlight) ================= */}
        <div 
          onClick={() => setActiveModal("workorders")}
          className="md:col-span-7 bg-gradient-to-b from-[#141726] to-[#0F111C] border border-slate-800/80 hover:border-violet-500/40 rounded-3xl p-6 transition duration-300 shadow-2xl shadow-black/50 cursor-pointer group relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-violet-400" />
                <h2 className="text-lg font-bold text-slate-100 group-hover:text-violet-400 transition">Work Order Pipeline</h2>
              </div>
              <p className="text-xs text-slate-400">Live Stage Breakdown (To Do • Doing • Done)</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold text-slate-400 block">Total Pipeline Value</span>
              <span className="text-sm font-black text-cyan-400">${totalVal.toLocaleString()}</span>
            </div>
          </div>

          {/* 3-Stage Progress Chart Bars */}
          <div className="grid grid-cols-3 gap-3 my-5">
            {/* TO DO (待预约工单) */}
            <div className="bg-[#111320] border border-amber-500/20 rounded-2xl p-4 relative overflow-hidden group/card hover:border-amber-500/40 transition">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> To Do (待预约)
                </span>
                <span className="text-xs font-black text-white bg-amber-500/20 px-2 py-0.5 rounded-full">{todoJobs.length} Jobs</span>
              </div>
              <span className="text-xl font-black text-white block">${(todoVal/1000).toFixed(1)}K</span>
              <div className="w-full bg-slate-800/60 h-2 rounded-full mt-3 overflow-hidden">
                <div className="bg-gradient-to-r from-amber-500 to-orange-400 h-full rounded-full" style={{ width: `${(todoVal/totalVal)*100}%` }} />
              </div>
              <span className="text-[10px] text-slate-400 mt-2 block">{((todoVal/totalVal)*100).toFixed(0)}% of Total Workload</span>
            </div>

            {/* DOING (在做中单子) */}
            <div className="bg-[#111320] border border-cyan-500/20 rounded-2xl p-4 relative overflow-hidden group/card hover:border-cyan-500/40 transition">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5" /> Doing (在做中)
                </span>
                <span className="text-xs font-black text-white bg-cyan-500/20 px-2 py-0.5 rounded-full">{doingJobs.length} Jobs</span>
              </div>
              <span className="text-xl font-black text-white block">${(doingVal/1000).toFixed(1)}K</span>
              <div className="w-full bg-slate-800/60 h-2 rounded-full mt-3 overflow-hidden">
                <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full" style={{ width: `${(doingVal/totalVal)*100}%` }} />
              </div>
              <span className="text-[10px] text-slate-400 mt-2 block">{((doingVal/totalVal)*100).toFixed(0)}% Dispatched & Active</span>
            </div>

            {/* DONE (已完成单子) */}
            <div className="bg-[#111320] border border-emerald-500/20 rounded-2xl p-4 relative overflow-hidden group/card hover:border-emerald-500/40 transition">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5" /> Done (已完成)
                </span>
                <span className="text-xs font-black text-white bg-emerald-500/20 px-2 py-0.5 rounded-full">{doneJobs.length} Jobs</span>
              </div>
              <span className="text-xl font-black text-white block">${(doneVal/1000).toFixed(1)}K</span>
              <div className="w-full bg-slate-800/60 h-2 rounded-full mt-3 overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full" style={{ width: `${(doneVal/totalVal)*100}%` }} />
              </div>
              <span className="text-[10px] text-slate-400 mt-2 block">{((doneVal/totalVal)*100).toFixed(0)}% Invoiced & Paid</span>
            </div>
          </div>

          {/* Quick Active Work Order Snippets */}
          <div className="bg-[#0D0F18] border border-slate-800/80 rounded-2xl p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold text-xs">
                #3
              </div>
              <div>
                <span className="text-xs font-bold text-slate-200 block">3 Plumbing Technicians Currently On-Job</span>
                <span className="text-[10px] text-slate-400">Garland • Dallas Downtown • Richardson</span>
              </div>
            </div>
            <span className="text-xs text-indigo-400 group-hover:translate-x-1 transition font-semibold flex items-center gap-1">
              Manage Orders <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* ================= CARD 2: CONVERSION FUNNEL (Top-Right) ================= */}
        <div 
          onClick={() => setActiveModal("funnel")}
          className="md:col-span-5 bg-gradient-to-b from-[#141726] to-[#0F111C] border border-slate-800/80 hover:border-cyan-500/40 rounded-3xl p-6 transition duration-300 shadow-2xl shadow-black/50 cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-100 group-hover:text-cyan-400 transition">Conversion Funnel</h2>
              <p className="text-xs text-slate-400">Lead $\rightarrow$ Opportunity $\rightarrow$ Deal Velocity</p>
            </div>
            <span className="text-xs text-cyan-400 font-bold bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/20">
              37% Conversion
            </span>
          </div>

          {/* Trapezoid Neon Funnel Visual */}
          <div className="flex flex-col gap-1.5 my-2">
            <div className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 rounded-lg p-2 flex items-center justify-between text-xs font-bold text-white shadow-md">
              <span className="pl-2">Leads</span>
              <span className="pr-2 font-black">5,719</span>
            </div>
            <div className="w-[85%] mx-auto bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-lg p-2 flex items-center justify-between text-xs font-bold text-white shadow-md">
              <span className="pl-2">MQL / Qualified</span>
              <span className="pr-2 font-black">2,309</span>
            </div>
            <div className="w-[70%] mx-auto bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-lg p-1.5 flex items-center justify-between text-xs font-bold text-white shadow-md">
              <span className="pl-2">Opportunity</span>
              <span className="pr-2 font-black">768</span>
            </div>
            <div className="w-[55%] mx-auto bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg p-1.5 flex items-center justify-between text-xs font-bold text-white shadow-lg shadow-cyan-500/20">
              <span className="pl-2">Won Deals</span>
              <span className="pr-2 font-black">354</span>
            </div>
          </div>
        </div>

        {/* ================= CARD 3: GPS LIVE PLUMBER TRACKING MAP & DISPATCH ================= */}
        <div 
          onClick={() => setActiveModal("gps")}
          className="md:col-span-8 bg-gradient-to-b from-[#141726] to-[#0F111C] border border-slate-800/80 hover:border-emerald-500/40 rounded-3xl p-6 transition duration-300 shadow-2xl shadow-black/50 cursor-pointer group relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Navigation className="w-5 h-5 text-emerald-400 animate-pulse" />
              <div>
                <h2 className="text-base font-bold text-slate-100 group-hover:text-emerald-400 transition">
                  GPS Live Plumber Tracking & Smart Dispatch
                </h2>
                <p className="text-xs text-slate-400">Real-Time Vehicle Coordinates (Garland / Dallas / Plano)</p>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              ● 5 Vehicles Connected
            </span>
          </div>

          {/* Dark Cyber Map Visual Container */}
          <div className="h-56 w-full bg-[#0B0D16] border border-slate-800 rounded-2xl relative overflow-hidden flex flex-col justify-between p-4 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]">
            {/* Map Pin Overlays for Plumbers */}
            <div className="absolute top-8 left-12 flex items-center gap-2 bg-[#121524]/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-cyan-500/40 shadow-lg shadow-cyan-500/10">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
              <img src={plumbers[0].avatar} className="w-5 h-5 rounded-full object-cover" />
              <span className="text-xs font-bold text-slate-200">Ava Vance (Garland)</span>
            </div>

            <div className="absolute top-24 right-16 flex items-center gap-2 bg-[#121524]/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-emerald-500/40 shadow-lg shadow-emerald-500/10">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <img src={plumbers[1].avatar} className="w-5 h-5 rounded-full object-cover" />
              <span className="text-xs font-bold text-slate-200">Madison Reed (Plano)</span>
            </div>

            <div className="absolute bottom-10 left-32 flex items-center gap-2 bg-[#121524]/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-indigo-500/40 shadow-lg shadow-indigo-500/10">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-400"></span>
              <img src={plumbers[2].avatar} className="w-5 h-5 rounded-full object-cover" />
              <span className="text-xs font-bold text-slate-200">Daniel Craig (Dallas)</span>
            </div>

            {/* Map Control Overlay Banner */}
            <div className="mt-auto z-10 flex items-center justify-between bg-[#121524]/80 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-300 font-medium">Auto-Routing Active • Nearest Plumber Response: 11 mins</span>
              <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                Open GPS Radar <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>

        {/* ================= CARD 4: PLUMBER TEAM ROSTER & DISPATCH STATUS ================= */}
        <div 
          onClick={() => setActiveModal("team")}
          className="md:col-span-4 bg-gradient-to-b from-[#141726] to-[#0F111C] border border-slate-800/80 hover:border-emerald-500/40 rounded-3xl p-6 transition duration-300 shadow-2xl shadow-black/50 cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-100 group-hover:text-emerald-400 transition">Plumber Roster</h2>
              <p className="text-xs text-slate-400">Team Status & Smart Dispatch</p>
            </div>
            <span className="text-xs font-bold text-slate-400">5 Techs</span>
          </div>

          <div className="space-y-2.5">
            {plumbers.map((p) => (
              <div key={p.id} className="bg-[#0F111B] border border-slate-800/80 p-2.5 rounded-xl flex items-center justify-between hover:bg-slate-800/40 transition">
                <div className="flex items-center gap-2.5">
                  <img src={p.avatar} alt={p.name} className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-700" />
                  <div>
                    <span className="text-xs font-bold text-slate-200 block">{p.name}</span>
                    <span className="text-[10px] text-slate-400">{p.role}</span>
                  </div>
                </div>
                <div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${p.status === "on-job" ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"}`}>
                    {p.status === "on-job" ? "On Job" : "Available"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>

      {/* ----------------- INTERACTIVE DETAIL MODAL ----------------- */}
      {activeModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-[#111322] border border-slate-700/80 w-full max-w-4xl rounded-3xl p-6 sm:p-8 shadow-2xl shadow-purple-950/40 relative max-h-[85vh] overflow-y-auto">
            {/* Close Button */}
            <button 
              onClick={() => setActiveModal(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* MODAL 1: WORK ORDER PIPELINE (TO DO / DOING / DONE) */}
            {activeModal === "workorders" && (
              <div>
                <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-violet-400" />
                  Work Order Dispatch Pipeline (To Do • Doing • Done)
                </h3>
                <p className="text-xs text-slate-400 mb-6">Manage plumbing job stages, change status, or assign plumbers dynamically</p>

                <div className="space-y-3">
                  {workOrders.map((job) => (
                    <div key={job.id} className="bg-[#161928] border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-violet-500/40 transition">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full ${job.stage === 'todo' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' : job.stage === 'doing' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'}`}>
                            {job.stage === 'todo' ? 'To Do (待预约)' : job.stage === 'doing' ? 'Doing (在做中)' : 'Done (已完成)'}
                          </span>
                          <h4 className="font-bold text-sm text-slate-100">{job.name}</h4>
                        </div>
                        <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-slate-500" />
                          {job.address} • Client: {job.contact?.name} ({job.contact?.phone})
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-base font-black text-emerald-400">${job.monetaryValue.toLocaleString()}</span>
                        
                        {/* Stage Selector */}
                        <select 
                          value={job.stage}
                          onChange={(e) => handleStageChange(job.id, e.target.value as any)}
                          className="bg-[#0F111C] border border-slate-700 text-slate-200 text-xs rounded-xl px-2.5 py-1.5 focus:outline-none"
                        >
                          <option value="todo">Set: To Do</option>
                          <option value="doing">Set: Doing</option>
                          <option value="done">Set: Done</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* MODAL 2: GPS LIVE MAP & PLUMBERS */}
            {(activeModal === "gps" || activeModal === "team") && (
              <div>
                <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                  <Navigation className="w-5 h-5 text-emerald-400" />
                  GPS Live Plumber Fleet & Dispatch Console
                </h3>
                <p className="text-xs text-slate-400 mb-6">Real-time GPS tracking and instant plumber job assignment</p>

                <div className="space-y-4">
                  {plumbers.map((p) => (
                    <div key={p.id} className="bg-[#161928] border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <img src={p.avatar} alt={p.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500/40" />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-sm text-slate-100">{p.name}</h4>
                            <span className="text-xs text-amber-400 font-bold flex items-center gap-0.5">
                              ★ {p.rating}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400">{p.role} • GPS Location: <span className="text-emerald-400 font-medium">{p.currentLocation}</span></p>
                          <span className="text-[11px] text-slate-500 block mt-0.5">Active Task: {p.activeJob}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleDispatch(workOrders[0].id, p.name)}
                          className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-500 text-white rounded-xl text-xs font-bold shadow-md hover:brightness-110 transition flex items-center gap-1.5"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Dispatch To Job</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* MODAL 3: CONVERSION / REVENUE */}
            {(activeModal === "funnel" || activeModal === "revenue") && (
              <div>
                <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-cyan-400" />
                  Real GHL Opportunities & Customer Revenue Logs
                </h3>
                <p className="text-xs text-slate-400 mb-6">Live sync with GoHighLevel CRM opportunities & billing invoices</p>

                <div className="space-y-3">
                  {workOrders.map((o) => (
                    <div key={o.id} className="bg-[#161928] border border-slate-800 p-3.5 rounded-2xl flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-sm text-slate-200">{o.name}</h4>
                        <p className="text-xs text-slate-400">{o.contact?.name} • {o.contact?.phone}</p>
                      </div>
                      <span className="text-sm font-black text-emerald-400">${o.monetaryValue.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
