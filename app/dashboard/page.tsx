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
  Map as MapIcon, 
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
  UserPlus,
  Plus,
  MessageSquare,
  Mail,
  Smartphone,
  Upload,
  FileSpreadsheet,
  Car,
  Route,
  Trash2,
  PhoneIncoming,
  Mic,
  Play,
  Volume2
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
  avatar?: string;
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

interface CRMConversation {
  id: string;
  contactName: string;
  lastMessage: string;
  time: string;
  unread: boolean;
  type: "sms" | "email";
  avatar: string;
}

interface CallLog {
  id: string;
  callerName: string;
  phone: string;
  time: string;
  duration: string;
  aiSummary: string;
  transcript: string;
  estimatedValue: number;
  status: "AI Booked" | "Live Dispatched" | "Inbound Missed";
}

interface PlumberTech {
  id: string;
  name: string;
  role: string;
  phone?: string;
  status: "available" | "on-job" | "offline";
  currentLocation: string;
  destinationAddress: string;
  distanceMiles: number;
  etaMinutes: number;
  lat: number;
  lng: number;
  destLat: number;
  destLng: number;
  jobsCompleted: number;
  activeJob?: string;
  avatar: string;
  rating: number;
}

const DEMO_PLUMBERS: PlumberTech[] = [
  { 
    id: "p1", name: "Ava Vance", role: "Master Plumber", phone: "+1 (555) 234-5678", status: "on-job", 
    currentLocation: "Garland, TX (Near I-30)", destinationAddress: "1420 Oak St, Garland, TX", 
    distanceMiles: 3.4, etaMinutes: 9, lat: 32.9126, lng: -96.6389, destLat: 32.9250, destLng: -96.6210, 
    jobsCompleted: 42, activeJob: "Main Line Drain Jetting", 
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80", rating: 4.9 
  },
  { 
    id: "p2", name: "Madison Reed", role: "HVAC & Leak Specialist", phone: "+1 (555) 876-5432", status: "on-job", 
    currentLocation: "Plano, TX (Legacy West)", destinationAddress: "7800 Preston Rd, Plano, TX", 
    distanceMiles: 5.1, etaMinutes: 14, lat: 33.0198, lng: -96.6989, destLat: 33.0450, destLng: -96.7120, 
    jobsCompleted: 39, activeJob: "Tankless Water Heater Check", 
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80", rating: 4.95 
  },
  { 
    id: "p3", name: "Daniel Craig", role: "Commercial Specialist", phone: "+1 (555) 345-6789", status: "on-job", 
    currentLocation: "Dallas Downtown", destinationAddress: "890 Elm St, Dallas, TX", 
    distanceMiles: 1.8, etaMinutes: 6, lat: 32.7767, lng: -96.7970, destLat: 32.7810, destLng: -96.7910, 
    jobsCompleted: 31, activeJob: "Commercial Boiler Repair", 
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80", rating: 4.8 
  },
];

const DEMO_CONTACTS: CRMContact[] = [
  { id: "cnt1", contactName: "Sam DeAngelis", email: "sam@theplumbinghouse.com", phone: "+1 (555) 234-5678", tags: ["VIP Client"], dateAdded: "2026-07-24", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" },
  { id: "cnt2", contactName: "Dallas Commercial Group", email: "facilities@dallasre.com", phone: "+1 (555) 876-5432", tags: ["Commercial"], dateAdded: "2026-07-23", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" },
];

const DEMO_CALLS: CallLog[] = [
  { 
    id: "call1", callerName: "Mrs. Sarah Jenkins", phone: "+1 (555) 987-6543", time: "12 mins ago", duration: "1m 45s", 
    aiSummary: "Emergency slab leak under kitchen tile. AI Receptionist booked appointment for 2:00 PM.", 
    transcript: "Customer: 'Hi, I have water leaking under my kitchen tile and need someone fast!' \nPlumbify AI: 'I understand this is an emergency. I have scheduled Master Plumber Ava Vance to arrive at your home at 2:00 PM today. Sending confirmation SMS now.'",
    estimatedValue: 1450, status: "AI Booked" 
  },
  { 
    id: "call2", callerName: "Marcus Vance", phone: "+1 (555) 456-7890", time: "45 mins ago", duration: "2m 10s", 
    aiSummary: "Commercial water heater leaking in basement. Dispatched Daniel Craig via SMS.", 
    transcript: "Customer: 'Our hotel basement water heater is leaking.' \nPlumbify AI: 'Dispatching Commercial Specialist Daniel Craig immediately to 890 Elm St.'",
    estimatedValue: 3200, status: "Live Dispatched" 
  },
];

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isUsingCustomData, setIsUsingCustomData] = useState(false);

  // Plumbers, Contacts, Calls State
  const [plumbers, setPlumbers] = useState<PlumberTech[]>(DEMO_PLUMBERS);
  const [selectedPlumberForRoute, setSelectedPlumberForRoute] = useState<PlumberTech>(DEMO_PLUMBERS[0]);
  const [contacts, setContacts] = useState<CRMContact[]>(DEMO_CONTACTS);
  const [conversations, setConversations] = useState<CRMConversation[]>([
    { id: "c1", contactName: "Sam DeAngelis", lastMessage: "I was genuinely impressed seeing The Plumbing House's perfect 5.0 rating...", time: "10m ago", unread: true, type: "sms", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" },
    { id: "c2", contactName: "Dallas Commercial Group", lastMessage: "Can you dispatch a technician to inspect the commercial boiler at 890 Elm St?", time: "32m ago", unread: true, type: "email", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" },
  ]);
  const [callLogs, setCallLogs] = useState<CallLog[]>(DEMO_CALLS);
  const [playingCallId, setPlayingCallId] = useState<string | null>(null);

  // Custom SMS Dispatch Text State
  const [smsDispatchText, setSmsDispatchText] = useState("");

  // Add Plumber Form State
  const [showAddPlumberModal, setShowAddPlumberModal] = useState(false);
  const [newPlumberName, setNewPlumberName] = useState("");
  const [newPlumberRole, setNewPlumberRole] = useState("Master Plumber");
  const [newPlumberPhone, setNewPlumberPhone] = useState("");
  const [newPlumberLocation, setNewPlumberLocation] = useState("Dallas, TX");

  // Add & Import Contact State
  const [showAddContactModal, setShowAddContactModal] = useState(false);
  const [showImportCsvModal, setShowImportCsvModal] = useState(false);
  const [newContactName, setNewContactName] = useState("");
  const [newContactEmail, setNewContactEmail] = useState("");
  const [newContactPhone, setNewContactPhone] = useState("");
  const [newContactTag, setNewContactTag] = useState("Residential");

  // Work Orders (To Do / Doing / Done)
  const [workOrders, setWorkOrders] = useState<CRMOpportunity[]>([
    { id: "wo1", name: "Emergency Pipe Repair - Sam DeAngelis", monetaryValue: 1250, stage: "doing", assignedPlumberId: "p4", assignedPlumberName: "Ryan Miller", address: "412 Belt Line Rd, Garland, TX", contact: { name: "Sam DeAngelis", phone: "+1 (555) 234-5678", email: "sam@theplumbinghouse.com" } },
    { id: "wo2", name: "Commercial Water Heater Replacement", monetaryValue: 3400, stage: "doing", assignedPlumberId: "p3", assignedPlumberName: "Daniel Craig", address: "890 Elm St, Dallas, TX", contact: { name: "Dallas Commercial Group", phone: "+1 (555) 876-5432", email: "billing@dallasgroup.com" } },
    { id: "wo3", name: "Main Line Drain Jetting & Camera Inspection", monetaryValue: 980, stage: "doing", assignedPlumberId: "p1", assignedPlumberName: "Ava Vance", address: "1420 Oak St, Garland, TX", contact: { name: "Robert Vance", phone: "+1 (555) 345-6789", email: "robert@vancehomes.com" } },
    { id: "wo4", name: "Tankless Water Heater Installation (Pending)", monetaryValue: 2800, stage: "todo", assignedPlumberId: "p2", assignedPlumberName: "Madison Reed", address: "7800 Preston Rd, Plano, TX", contact: { name: "Lisa Kudrow", phone: "+1 (555) 901-2345", email: "lisa@planoresidences.com" } },
    { id: "wo5", name: "Kitchen Sink Leak & Disposal Upgrade", monetaryValue: 450, stage: "todo", address: "2300 Main St, Mesquite, TX", contact: { name: "Mark Geller", phone: "+1 (555) 678-9012", email: "mark@gellerdesign.com" } },
    { id: "wo6", name: "Whole House Water Filter System Installation", monetaryValue: 1850, stage: "todo", address: "1100 Coit Rd, Richardson, TX", contact: { name: "David Bing", phone: "+1 (555) 789-0123", email: "dbing@techfirm.com" } },
    { id: "wo7", name: "Toilet Replacement & Valve Tune-Up", monetaryValue: 380, stage: "done", assignedPlumberId: "p1", assignedPlumberName: "Ava Vance", address: "550 Apollo Rd, Garland, TX", contact: { name: "Emma Stone", phone: "+1 (555) 890-1234", email: "emma@stoneproperties.com" } },
  ]);

  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [dispatchSuccessMsg, setDispatchSuccessMsg] = useState<string | null>(null);

  // Load custom plumbers & contacts from localStorage
  useEffect(() => {
    try {
      const savedPlumbers = localStorage.getItem("plumbify_custom_plumbers");
      const savedContacts = localStorage.getItem("plumbify_custom_contacts");

      let hasCustom = false;

      if (savedPlumbers) {
        const parsedP = JSON.parse(savedPlumbers);
        if (parsedP.length > 0) {
          setPlumbers(parsedP);
          setSelectedPlumberForRoute(parsedP[0]);
          hasCustom = true;
        }
      }

      if (savedContacts) {
        const parsedC = JSON.parse(savedContacts);
        if (parsedC.length > 0) {
          setContacts(parsedC);
          hasCustom = true;
        }
      }

      setIsUsingCustomData(hasCustom);
    } catch (e) {
      console.warn("Could not load local storage data:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleClearDemoData = () => {
    try {
      localStorage.removeItem("plumbify_custom_plumbers");
      localStorage.removeItem("plumbify_custom_contacts");
    } catch (e) {}

    setPlumbers([]);
    setContacts([]);
    setSelectedPlumberForRoute({
      id: "p_empty", name: "No Plumber Registered", role: "Add your first plumber", phone: "", 
      status: "available", currentLocation: "Dallas, TX", destinationAddress: "N/A", distanceMiles: 0, 
      etaMinutes: 0, lat: 32.7767, lng: -96.7970, destLat: 32.7767, destLng: -96.7970, jobsCompleted: 0, avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80", rating: 5.0
    });
    setIsUsingCustomData(true);
    setDispatchSuccessMsg("🧹 All Demo data cleared! You are now in 100% Real Customer Mode.");
    setTimeout(() => setDispatchSuccessMsg(null), 4000);
  };

  const handleResetToDemoData = () => {
    try {
      localStorage.removeItem("plumbify_custom_plumbers");
      localStorage.removeItem("plumbify_custom_contacts");
    } catch (e) {}

    setPlumbers(DEMO_PLUMBERS);
    setSelectedPlumberForRoute(DEMO_PLUMBERS[0]);
    setContacts(DEMO_CONTACTS);
    setIsUsingCustomData(false);
    setDispatchSuccessMsg("🔄 Reset to default Plumbify Demo Dataset.");
    setTimeout(() => setDispatchSuccessMsg(null), 4000);
  };

  // Metrics
  const todoJobs = workOrders.filter(w => w.stage === "todo");
  const doingJobs = workOrders.filter(w => w.stage === "doing");
  const doneJobs = workOrders.filter(w => w.stage === "done");

  const todoVal = todoJobs.reduce((acc, curr) => acc + curr.monetaryValue, 0);
  const doingVal = doingJobs.reduce((acc, curr) => acc + curr.monetaryValue, 0);
  const doneVal = doneJobs.reduce((acc, curr) => acc + curr.monetaryValue, 0);
  const totalVal = todoVal + doingVal + doneVal;

  const handleStageChange = (jobId: string, newStage: "todo" | "doing" | "done") => {
    setWorkOrders(prev => prev.map(job => job.id === jobId ? { ...job, stage: newStage } : job));
  };

  const handleDispatch = (jobId: string, plumberName: string) => {
    setWorkOrders(prev => prev.map(job => job.id === jobId ? { ...job, assignedPlumberName: plumberName, stage: "doing" } : job));
    setDispatchSuccessMsg(`Job #${jobId} dispatched to ${plumberName} via SMS! ETA: 11m`);
    setTimeout(() => setDispatchSuccessMsg(null), 4000);
  };

  const handleSendSmsToPlumber = () => {
    if (!smsDispatchText.trim()) return;
    setDispatchSuccessMsg(`📱 SMS Sent to ${selectedPlumberForRoute.name} (${selectedPlumberForRoute.phone}): "${smsDispatchText}"`);
    setSmsDispatchText("");
    setTimeout(() => setDispatchSuccessMsg(null), 4000);
  };

  // Add Plumber Submit
  const handleAddPlumberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlumberName.trim()) return;

    const newPlumber: PlumberTech = {
      id: `p_custom_${Date.now()}`,
      name: newPlumberName.trim(),
      role: newPlumberRole,
      phone: newPlumberPhone.trim() || "+1 (555) 000-1234",
      status: "available",
      currentLocation: newPlumberLocation.trim() || "Dallas, TX",
      destinationAddress: "1200 Commerce St, Dallas, TX",
      distanceMiles: 2.5,
      etaMinutes: 8,
      lat: 32.8000 + Math.random() * 0.1,
      lng: -96.7000 - Math.random() * 0.1,
      destLat: 32.8100,
      destLng: -96.6900,
      jobsCompleted: 0,
      activeJob: "Idle / Standing by",
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80`,
      rating: 5.0
    };

    const basePlumbers = isUsingCustomData ? plumbers : [];
    const updated = [newPlumber, ...basePlumbers];

    setPlumbers(updated);
    setSelectedPlumberForRoute(newPlumber);
    setIsUsingCustomData(true);

    try {
      localStorage.setItem("plumbify_custom_plumbers", JSON.stringify(updated));
    } catch (e) {}

    setNewPlumberName("");
    setNewPlumberPhone("");
    setShowAddPlumberModal(false);
    setDispatchSuccessMsg(`🎉 Plumber ${newPlumber.name} registered & Demo Data Replaced!`);
    setTimeout(() => setDispatchSuccessMsg(null), 4000);
  };

  // Add Single Contact Submit
  const handleAddContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContactName.trim()) return;

    const newContact: CRMContact = {
      id: `cnt_${Date.now()}`,
      contactName: newContactName.trim(),
      email: newContactEmail.trim() || "client@domain.com",
      phone: newContactPhone.trim() || "+1 (555) 000-9999",
      tags: [newContactTag],
      dateAdded: new Date().toISOString().split("T")[0],
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
    };

    const baseContacts = isUsingCustomData ? contacts : [];
    const updated = [newContact, ...baseContacts];

    setContacts(updated);
    setIsUsingCustomData(true);

    try {
      localStorage.setItem("plumbify_custom_contacts", JSON.stringify(updated));
    } catch (e) {}

    setNewContactName("");
    setNewContactEmail("");
    setNewContactPhone("");
    setShowAddContactModal(false);
    setDispatchSuccessMsg(`🎉 Contact ${newContact.contactName} saved & Demo Contacts Cleared!`);
    setTimeout(() => setDispatchSuccessMsg(null), 4000);
  };

  const handleImportCsv = () => {
    const csvContacts: CRMContact[] = [
      { id: `cnt_csv_1`, contactName: "Highland Park Residences", email: "manager@highlandpk.com", phone: "+1 (555) 998-1122", tags: ["CSV Import", "Commercial"], dateAdded: "2026-07-24", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" },
      { id: `cnt_csv_2`, contactName: "Preston Hollow Villas", email: "hoa@prestonhollow.com", phone: "+1 (555) 887-3344", tags: ["CSV Import", "HOA"], dateAdded: "2026-07-24", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80" },
      { id: `cnt_csv_3`, contactName: "Garland Auto Body Shop", email: "service@garlandauto.com", phone: "+1 (555) 776-5566", tags: ["CSV Import", "Industrial"], dateAdded: "2026-07-24", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80" }
    ];

    const baseContacts = isUsingCustomData ? contacts : [];
    const updated = [...csvContacts, ...baseContacts];

    setContacts(updated);
    setIsUsingCustomData(true);

    try {
      localStorage.setItem("plumbify_custom_contacts", JSON.stringify(updated));
    } catch (e) {}

    setShowImportCsvModal(false);
    setDispatchSuccessMsg(`📥 Imported 3 real customer contacts from CSV! Demo data removed.`);
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
                {plumbers.length} Plumbers Active {isUsingCustomData ? "(Real Mode)" : "(Demo Mode)"}
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-cyan-400 font-medium flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Live Navigation & 24/7 AI Voice Dispatch
              </span>
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

          {isUsingCustomData ? (
            <button 
              onClick={handleResetToDemoData}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-xl text-xs font-semibold transition"
            >
              <RefreshCcw className="w-3 h-3 text-amber-400" />
              <span>Load Demo Data</span>
            </button>
          ) : (
            <button 
              onClick={handleClearDemoData}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/30 rounded-xl text-xs font-semibold transition"
            >
              <Trash2 className="w-3 h-3" />
              <span>Clear Demo Data</span>
            </button>
          )}

          <button 
            onClick={() => setShowAddPlumberModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl text-xs font-bold transition shadow-md shadow-indigo-600/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add Plumber</span>
          </button>
        </div>
      </header>

      {/* ----------------- BENTO GRID DASHBOARD MAIN ----------------- */}
      <main className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-5">

        {/* ================= CARD 1: WORK ORDER PIPELINE (TO DO / DOING / DONE) ================= */}
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

          <div className="grid grid-cols-3 gap-3 my-5">
            <div className="bg-[#111320] border border-amber-500/20 rounded-2xl p-4 relative overflow-hidden group/card hover:border-amber-500/40 transition">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> To Do
                </span>
                <span className="text-xs font-black text-white bg-amber-500/20 px-2 py-0.5 rounded-full">{todoJobs.length} Jobs</span>
              </div>
              <span className="text-xl font-black text-white block">${(todoVal/1000).toFixed(1)}K</span>
              <div className="w-full bg-slate-800/60 h-2 rounded-full mt-3 overflow-hidden">
                <div className="bg-gradient-to-r from-amber-500 to-orange-400 h-full rounded-full" style={{ width: `${(todoVal/totalVal)*100}%` }} />
              </div>
              <span className="text-[10px] text-slate-400 mt-2 block">{((todoVal/totalVal)*100).toFixed(0)}% Workload</span>
            </div>

            <div className="bg-[#111320] border border-cyan-500/20 rounded-2xl p-4 relative overflow-hidden group/card hover:border-cyan-500/40 transition">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5" /> Doing
                </span>
                <span className="text-xs font-black text-white bg-cyan-500/20 px-2 py-0.5 rounded-full">{doingJobs.length} Jobs</span>
              </div>
              <span className="text-xl font-black text-white block">${(doingVal/1000).toFixed(1)}K</span>
              <div className="w-full bg-slate-800/60 h-2 rounded-full mt-3 overflow-hidden">
                <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full" style={{ width: `${(doingVal/totalVal)*100}%` }} />
              </div>
              <span className="text-[10px] text-slate-400 mt-2 block">{((doingVal/totalVal)*100).toFixed(0)}% Active</span>
            </div>

            <div className="bg-[#111320] border border-emerald-500/20 rounded-2xl p-4 relative overflow-hidden group/card hover:border-emerald-500/40 transition">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5" /> Done
                </span>
                <span className="text-xs font-black text-white bg-emerald-500/20 px-2 py-0.5 rounded-full">{doneJobs.length} Jobs</span>
              </div>
              <span className="text-xl font-black text-white block">${(doneVal/1000).toFixed(1)}K</span>
              <div className="w-full bg-slate-800/60 h-2 rounded-full mt-3 overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full" style={{ width: `${(doneVal/totalVal)*100}%` }} />
              </div>
              <span className="text-[10px] text-slate-400 mt-2 block">{((doneVal/totalVal)*100).toFixed(0)}% Completed</span>
            </div>
          </div>

          <div className="bg-[#0D0F18] border border-slate-800/80 rounded-2xl p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold text-xs">
                #{plumbers.filter(p=>p.status==='on-job').length}
              </div>
              <div>
                <span className="text-xs font-bold text-slate-200 block">{plumbers.filter(p=>p.status==='on-job').length} Plumbers Active On-Job</span>
                <span className="text-[10px] text-slate-400">Garland • Dallas • Plano • Richardson</span>
              </div>
            </div>
            <span className="text-xs text-indigo-400 group-hover:translate-x-1 transition font-semibold flex items-center gap-1">
              Manage Orders <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* ================= CARD 2: AI VOICE 24/7 CALL RADAR CARD ================= */}
        <div 
          onClick={() => setActiveModal("calls")}
          className="md:col-span-5 bg-gradient-to-b from-[#141726] to-[#0F111C] border border-slate-800/80 hover:border-emerald-500/40 rounded-3xl p-6 transition duration-300 shadow-2xl shadow-black/50 cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <PhoneIncoming className="w-5 h-5 text-emerald-400 animate-bounce" />
              <div>
                <h2 className="text-base font-bold text-slate-100 group-hover:text-emerald-400 transition">AI 24/7 Voice Answering Radar</h2>
                <p className="text-xs text-slate-400">Click to listen to AI call recordings & transcript</p>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1">
              <Mic className="w-3 h-3 text-emerald-400 animate-pulse" /> 100% Answered
            </span>
          </div>

          <div className="space-y-3">
            {callLogs.map((log) => (
              <div key={log.id} className="bg-[#0F111B] border border-slate-800/80 p-3 rounded-2xl hover:bg-slate-800/40 transition">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span className="text-xs font-bold text-slate-200">{log.callerName}</span>
                    <span className="text-[10px] text-slate-500">{log.time}</span>
                  </div>
                  <span className="text-xs font-black text-cyan-400">+${log.estimatedValue} Est.</span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">{log.aiSummary}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ================= CARD 3: REAL INTERACTIVE MAP WITH ROUTE TRAJECTORY & ETA ================= */}
        <div 
          onClick={() => setActiveModal("gps")}
          className="md:col-span-8 bg-gradient-to-b from-[#141726] to-[#0F111C] border border-slate-800/80 hover:border-emerald-500/40 rounded-3xl p-6 transition duration-300 shadow-2xl shadow-black/50 cursor-pointer group relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Route className="w-5 h-5 text-emerald-400 animate-pulse" />
              <div>
                <h2 className="text-base font-bold text-slate-100 group-hover:text-emerald-400 transition">
                  Plumber Live Driving Navigation & ETA Trajectory Map
                </h2>
                <p className="text-xs text-slate-400">Click to open full dispatch & SMS controller console</p>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1">
              <Car className="w-3.5 h-3.5" /> Open Dispatch Console
            </span>
          </div>

          <div className="h-72 w-full bg-[#060812] border border-slate-800/90 rounded-2xl relative overflow-hidden flex flex-col justify-between p-4 shadow-2xl">
            <svg className="absolute inset-0 w-full h-full stroke-slate-800" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="50%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>

              <pattern id="navGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>
              </pattern>
              <rect width="100%" height="100%" fill="url(#navGrid)" />

              <path d="M 50,220 Q 200,60 420,180 T 780,90" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8"/>
              <path 
                d="M 80,210 C 220,90 340,240 680,120" 
                fill="none" 
                stroke="url(#routeGradient)" 
                strokeWidth="4" 
                strokeDasharray="8 4"
                className="animate-pulse"
              />

              <g transform="translate(680, 120)">
                <circle r="14" fill="#10b981" fillOpacity="0.2" className="animate-ping" />
                <circle r="7" fill="#10b981" />
                <text x="12" y="4" fill="#34d399" fontSize="11" fontWeight="bold">Customer House ({selectedPlumberForRoute.destinationAddress ? selectedPlumberForRoute.destinationAddress.split(',')[0] : 'Dallas'})</text>
              </g>

              <g transform="translate(80, 210)">
                <circle r="12" fill="#38bdf8" fillOpacity="0.3" className="animate-ping" />
                <circle r="6" fill="#38bdf8" />
                <text x="-70" y="20" fill="#38bdf8" fontSize="11" fontWeight="bold">Van #{selectedPlumberForRoute.name.split(' ')[0]}</text>
              </g>
            </svg>

            <div className="relative z-10 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {plumbers.map((p) => (
                <button
                  key={p.id}
                  onClick={(e) => { e.stopPropagation(); setSelectedPlumberForRoute(p); }}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition ${selectedPlumberForRoute.id === p.id ? "bg-gradient-to-r from-emerald-600 to-teal-600 border-emerald-400 text-white shadow-lg shadow-emerald-600/30" : "bg-[#101322]/80 border-slate-800 text-slate-400 hover:text-white"}`}
                >
                  <img src={p.avatar} className="w-5 h-5 rounded-full object-cover" />
                  <span>{p.name.split(' ')[0]} ({p.etaMinutes}m ETA)</span>
                </button>
              ))}
            </div>

            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between bg-[#0F1222]/95 backdrop-blur-md p-3.5 rounded-2xl border border-slate-800 gap-3">
              <div className="flex items-center gap-3">
                <img src={selectedPlumberForRoute.avatar} className="w-10 h-10 rounded-xl object-cover ring-2 ring-emerald-400" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{selectedPlumberForRoute.name}</span>
                    <span className="text-[10px] font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
                      En Route
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Driving to: <span className="text-emerald-400 font-semibold">{selectedPlumberForRoute.destinationAddress}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-[#16192A] border border-slate-800 px-3 py-1.5 rounded-xl text-center">
                  <span className="text-[10px] text-slate-400 block font-semibold">Distance</span>
                  <span className="text-sm font-black text-cyan-400">{selectedPlumberForRoute.distanceMiles} Miles</span>
                </div>
                <div className="bg-[#16192A] border border-emerald-500/40 px-3.5 py-1.5 rounded-xl text-center bg-emerald-500/10 shadow-lg shadow-emerald-500/10">
                  <span className="text-[10px] text-emerald-400 block font-bold">Estimated Arrival (ETA)</span>
                  <span className="text-sm font-black text-white">{selectedPlumberForRoute.etaMinutes} Mins</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= CARD 4: PLUMBER TEAM ROSTER ================= */}
        <div 
          onClick={() => setActiveModal("team")}
          className="md:col-span-4 bg-gradient-to-b from-[#141726] to-[#0F111C] border border-slate-800/80 hover:border-emerald-500/40 rounded-3xl p-6 transition duration-300 shadow-2xl shadow-black/50 cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-100 group-hover:text-emerald-400 transition">Plumber Roster</h2>
              <p className="text-xs text-slate-400">Live Driving ETA & Status</p>
            </div>
            
            <button 
              onClick={(e) => { e.stopPropagation(); setShowAddPlumberModal(true); }}
              className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 bg-indigo-500/10 border border-indigo-500/30 px-2.5 py-1 rounded-lg transition"
            >
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </div>

          <div className="space-y-2.5">
            {plumbers.length === 0 ? (
              <div className="text-center py-6 border border-dashed border-slate-800 rounded-2xl">
                <Users className="w-6 h-6 text-slate-500 mx-auto mb-1" />
                <span className="text-xs text-slate-400 block">No Plumbers Registered Yet</span>
                <button 
                  onClick={() => setShowAddPlumberModal(true)}
                  className="mt-2 text-xs font-bold text-indigo-400 hover:underline"
                >
                  + Add Your First Plumber
                </button>
              </div>
            ) : (
              plumbers.map((p) => (
                <div 
                  key={p.id} 
                  onClick={(e) => { e.stopPropagation(); setSelectedPlumberForRoute(p); }}
                  className={`border p-2.5 rounded-xl flex items-center justify-between transition cursor-pointer ${selectedPlumberForRoute.id === p.id ? "bg-indigo-950/40 border-indigo-500/60 shadow-lg" : "bg-[#0F111B] border-slate-800/80 hover:bg-slate-800/40"}`}
                >
                  <div className="flex items-center gap-2.5">
                    <img src={p.avatar} alt={p.name} className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-700" />
                    <div>
                      <span className="text-xs font-bold text-slate-200 block">{p.name}</span>
                      <span className="text-[10px] text-emerald-400 font-medium">ETA: {p.etaMinutes} mins ({p.distanceMiles} mi)</span>
                    </div>
                  </div>
                  <div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${p.status === "on-job" ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"}`}>
                      {p.status === "on-job" ? "Active" : "Available"}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ================= CARD 5: COMPACT CONTACTS DIRECTORY CARD ================= */}
        <div 
          onClick={() => setActiveModal("contacts")}
          className="md:col-span-6 bg-gradient-to-b from-[#141726] to-[#0F111C] border border-slate-800/80 hover:border-indigo-500/40 rounded-3xl p-5 transition duration-300 shadow-2xl shadow-black/50 cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-400" />
              <div>
                <h2 className="text-sm font-bold text-slate-100 group-hover:text-indigo-400 transition">Customer Contacts</h2>
                <p className="text-[11px] text-slate-400">{contacts.length} Customers Enrolled</p>
              </div>
            </div>

            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
              <button 
                onClick={() => setShowAddContactModal(true)}
                className="text-[11px] font-bold text-indigo-300 bg-indigo-500/10 border border-indigo-500/30 hover:bg-indigo-500/20 px-2.5 py-1 rounded-lg transition flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Add
              </button>
              <button 
                onClick={() => setShowImportCsvModal(true)}
                className="text-[11px] font-bold text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 px-2.5 py-1 rounded-lg transition flex items-center gap-1"
              >
                <Upload className="w-3 h-3" /> Import CSV
              </button>
            </div>
          </div>

          <div className="space-y-2">
            {contacts.length === 0 ? (
              <div className="text-center py-4 border border-dashed border-slate-800 rounded-xl">
                <span className="text-xs text-slate-400 block">No contacts imported yet</span>
                <span className="text-[10px] text-slate-500">Import CSV or click Add to enroll your customers</span>
              </div>
            ) : (
              contacts.slice(0, 3).map((cnt) => (
                <div key={cnt.id} className="bg-[#0F111B] border border-slate-800/80 px-3 py-2 rounded-xl flex items-center justify-between hover:bg-slate-800/40 transition">
                  <div className="flex items-center gap-2.5">
                    <img src={cnt.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"} className="w-7 h-7 rounded-full object-cover" />
                    <div>
                      <span className="text-xs font-bold text-slate-200 block">{cnt.contactName || `${cnt.firstName} ${cnt.lastName}`}</span>
                      <span className="text-[10px] text-slate-400">{cnt.phone}</span>
                    </div>
                  </div>
                  <span className="text-[9px] font-semibold text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                    {(cnt.tags || ["Customer"])[0]}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ================= CARD 6: RECENT CONVERSATIONS CARD ================= */}
        <div 
          onClick={() => setActiveModal("conversations")}
          className="md:col-span-6 bg-gradient-to-b from-[#141726] to-[#0F111C] border border-slate-800/80 hover:border-cyan-500/40 rounded-3xl p-5 transition duration-300 shadow-2xl shadow-black/50 cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-cyan-400" />
              <div>
                <h2 className="text-sm font-bold text-slate-100 group-hover:text-cyan-400 transition">Recent Conversations</h2>
                <p className="text-[11px] text-slate-400">SMS & Email Threads</p>
              </div>
            </div>
            <span className="text-[10px] font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/20">
              Active Threads
            </span>
          </div>

          <div className="space-y-2">
            {conversations.slice(0, 3).map((c) => (
              <div key={c.id} className="bg-[#0F111B] border border-slate-800/80 px-3 py-2 rounded-xl flex items-center justify-between hover:bg-slate-800/40 transition">
                <div className="flex items-center gap-2.5">
                  <img src={c.avatar} className="w-7 h-7 rounded-full object-cover" />
                  <div>
                    <span className="text-xs font-bold text-slate-200 block">{c.contactName}</span>
                    <p className="text-[10px] text-slate-400 truncate max-w-xs">{c.lastMessage}</p>
                  </div>
                </div>
                <span className="text-[9px] font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20 uppercase">
                  {c.type}
                </span>
              </div>
            ))}
          </div>
        </div>

      </main>

      {/* ----------------- MODAL 1: AI VOICE 24/7 CALL RECORDING & TRANSCRIPT CONSOLE ----------------- */}
      {activeModal === "calls" && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-[#111322] border border-slate-700/80 w-full max-w-4xl rounded-3xl p-6 sm:p-8 shadow-2xl shadow-emerald-950/40 relative max-h-[85vh] overflow-y-auto">
            <button 
              onClick={() => setActiveModal(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <PhoneIncoming className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">AI 24/7 Voice Call Recordings & Transcripts</h3>
                <p className="text-xs text-slate-400">Listen to AI receptionist customer calls and direct plumber dispatch</p>
              </div>
            </div>

            <div className="space-y-4">
              {callLogs.map((log) => (
                <div key={log.id} className="bg-[#161928] border border-slate-800 p-5 rounded-2xl hover:border-emerald-500/40 transition">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-3 border-b border-slate-800">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-white">{log.callerName}</h4>
                        <span className="text-xs text-slate-400">({log.phone})</span>
                      </div>
                      <span className="text-[10px] text-slate-400">{log.time} • Call Duration: {log.duration}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setPlayingCallId(playingCallId === log.id ? null : log.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${playingCallId === log.id ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/30" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20"}`}
                      >
                        {playingCallId === log.id ? <Volume2 className="w-3.5 h-3.5 animate-pulse" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                        <span>{playingCallId === log.id ? "Playing Audio..." : "Play Recording"}</span>
                      </button>

                      <span className="text-sm font-black text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-xl border border-cyan-500/20">
                        +${log.estimatedValue} Est.
                      </span>
                    </div>
                  </div>

                  {/* AI Call Audio Waveform Player Simulation */}
                  {playingCallId === log.id && (
                    <div className="bg-[#0D0F19] border border-emerald-500/40 p-3 rounded-xl mb-3 flex items-center gap-3 animate-in fade-in">
                      <Volume2 className="w-4 h-4 text-emerald-400 animate-pulse" />
                      <div className="flex-1 bg-slate-800/80 h-2 rounded-full overflow-hidden">
                        <div className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full w-2/3 animate-pulse rounded-full" />
                      </div>
                      <span className="text-[10px] text-emerald-400 font-mono">0:42 / {log.duration}</span>
                    </div>
                  )}

                  <div>
                    <span className="text-xs font-bold text-slate-300 block mb-1">AI Transcript & Call Summary:</span>
                    <div className="bg-[#0A0C16] border border-slate-800/80 p-3 rounded-xl text-xs text-slate-300 font-mono whitespace-pre-line leading-relaxed">
                      {log.transcript}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ----------------- MODAL 2: FULL-SCREEN MAP DISPATCH MODAL ----------------- */}
      {activeModal === "gps" && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-[#111322] border border-slate-700/80 w-full max-w-5xl rounded-3xl p-6 sm:p-8 shadow-2xl shadow-emerald-950/40 relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setActiveModal(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <Navigation className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Full-Screen Live Dispatch & Plumber SMS Controller</h3>
                <p className="text-xs text-slate-400">Directly dispatch plumbers, track routes, and send instant SMS updates</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 my-6">
              <div className="md:col-span-5 space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Select Plumber for Live Control</h4>
                {plumbers.map((p) => (
                  <div 
                    key={p.id}
                    onClick={() => setSelectedPlumberForRoute(p)}
                    className={`p-3 rounded-2xl border transition cursor-pointer flex items-center justify-between ${selectedPlumberForRoute.id === p.id ? "bg-emerald-950/40 border-emerald-500/60 shadow-lg" : "bg-[#161928] border-slate-800 hover:bg-slate-800/40"}`}
                  >
                    <div className="flex items-center gap-3">
                      <img src={p.avatar} className="w-9 h-9 rounded-full object-cover ring-2 ring-emerald-500/40" />
                      <div>
                        <span className="text-xs font-bold text-white block">{p.name}</span>
                        <span className="text-[10px] text-slate-400">{p.role}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-black text-emerald-400 block">{p.etaMinutes} mins</span>
                      <span className="text-[10px] text-slate-500">{p.distanceMiles} miles away</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="md:col-span-7 bg-[#161928] border border-slate-800 p-5 rounded-2xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                    <div>
                      <span className="text-xs font-bold text-white block">Send SMS Dispatch to {selectedPlumberForRoute.name}</span>
                      <span className="text-[10px] text-slate-400">Mobile: {selectedPlumberForRoute.phone}</span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                      Destination: {selectedPlumberForRoute.destinationAddress}
                    </span>
                  </div>

                  <label className="text-xs font-semibold text-slate-300 block mb-2">Custom Dispatch Instruction or Customer Address Update</label>
                  <textarea 
                    rows={4}
                    placeholder={`e.g. Hi ${selectedPlumberForRoute.name.split(' ')[0]}, please head over to ${selectedPlumberForRoute.destinationAddress} for emergency main drain repair. Customer is waiting on site.`}
                    value={smsDispatchText}
                    onChange={(e) => setSmsDispatchText(e.target.value)}
                    className="w-full bg-[#0A0C16] border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500 transition resize-none placeholder:text-slate-600"
                  />
                </div>

                <div className="pt-4 flex justify-between items-center">
                  <button 
                    onClick={() => handleDispatch(workOrders[0].id, selectedPlumberForRoute.name)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                  >
                    <Briefcase className="w-3.5 h-3.5" />
                    <span>Assign Emergency Job</span>
                  </button>

                  <button 
                    onClick={handleSendSmsToPlumber}
                    className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-emerald-600/30 flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send SMS Notification</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- MODAL: ADD CONTACT ----------------- */}
      {showAddContactModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#121424] border border-slate-700 w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl shadow-indigo-950/40 relative">
            <button 
              onClick={() => setShowAddContactModal(false)}
              className="absolute top-6 right-6 p-2 rounded-full bg-slate-800 text-slate-300 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Add New Customer Contact</h3>
                <p className="text-xs text-slate-400">Register client for automatic SMS & job dispatch</p>
              </div>
            </div>

            <form onSubmit={handleAddContactSubmit} className="space-y-4 mt-6">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">Client Full Name *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Robert Johnson"
                  value={newContactName}
                  onChange={(e) => setNewContactName(e.target.value)}
                  className="w-full bg-[#0A0C16] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">Phone Number</label>
                  <input 
                    type="text" 
                    placeholder="+1 (555) 234-5678"
                    value={newContactPhone}
                    onChange={(e) => setNewContactPhone(e.target.value)}
                    className="w-full bg-[#0A0C16] border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">Email Address</label>
                  <input 
                    type="email" 
                    placeholder="robert@example.com"
                    value={newContactEmail}
                    onChange={(e) => setNewContactEmail(e.target.value)}
                    className="w-full bg-[#0A0C16] border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">Customer Category / Tag</label>
                <select 
                  value={newContactTag}
                  onChange={(e) => setNewContactTag(e.target.value)}
                  className="w-full bg-[#0A0C16] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Residential">Residential Customer</option>
                  <option value="Commercial">Commercial Account</option>
                  <option value="VIP Client">VIP Client</option>
                  <option value="HOA Property">HOA Property</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button 
                  type="button"
                  onClick={() => setShowAddContactModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-indigo-600/30"
                >
                  Save Contact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ----------------- MODAL: IMPORT CSV ----------------- */}
      {showImportCsvModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#121424] border border-slate-700 w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl shadow-emerald-950/40 relative">
            <button 
              onClick={() => setShowImportCsvModal(false)}
              className="absolute top-6 right-6 p-2 rounded-full bg-slate-800 text-slate-300 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Import Customer Spreadsheet (CSV)</h3>
                <p className="text-xs text-slate-400">Bulk upload existing client records & phone numbers</p>
              </div>
            </div>

            <div className="my-6 border-2 border-dashed border-slate-700 hover:border-emerald-500/60 rounded-2xl p-8 text-center bg-[#0A0C16] cursor-pointer transition">
              <Upload className="w-8 h-8 text-emerald-400 mx-auto mb-2 animate-bounce" />
              <span className="text-xs font-bold text-slate-200 block">Click or Drop CSV File Here</span>
              <span className="text-[10px] text-slate-500">Supports .csv, .xlsx format (Name, Phone, Email, Tags)</span>
            </div>

            <div className="flex justify-end gap-2">
              <button 
                type="button"
                onClick={() => setShowImportCsvModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition"
              >
                Cancel
              </button>
              <button 
                onClick={handleImportCsv}
                className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-emerald-600/30"
              >
                Process & Import Sample CSV
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- MODAL: ADD NEW PLUMBER FORM ----------------- */}
      {showAddPlumberModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#121424] border border-slate-700 w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl shadow-indigo-950/40 relative">
            <button 
              onClick={() => setShowAddPlumberModal(false)}
              className="absolute top-6 right-6 p-2 rounded-full bg-slate-800 text-slate-300 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Register New Plumber / Technician</h3>
                <p className="text-xs text-slate-400">Add team member for SMS dispatch & GPS tracking</p>
              </div>
            </div>

            <form onSubmit={handleAddPlumberSubmit} className="space-y-4 mt-6">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">Full Name *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Jason Bourne"
                  value={newPlumberName}
                  onChange={(e) => setNewPlumberName(e.target.value)}
                  className="w-full bg-[#0A0C16] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">Specialty / Role</label>
                  <select 
                    value={newPlumberRole}
                    onChange={(e) => setNewPlumberRole(e.target.value)}
                    className="w-full bg-[#0A0C16] border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Master Plumber">Master Plumber</option>
                    <option value="HVAC & Leak Specialist">HVAC & Leak Specialist</option>
                    <option value="Sewer Camera Tech">Sewer Camera Tech</option>
                    <option value="Commercial Lead">Commercial Lead</option>
                    <option value="Residential Plumbing Helper">Residential Helper</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">Mobile Phone (For SMS)</label>
                  <input 
                    type="text" 
                    placeholder="+1 (555) 000-1234"
                    value={newPlumberPhone}
                    onChange={(e) => setNewPlumberPhone(e.target.value)}
                    className="w-full bg-[#0A0C16] border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">GPS Location / Primary City</label>
                <input 
                  type="text" 
                  placeholder="e.g. Garland, TX"
                  value={newPlumberLocation}
                  onChange={(e) => setNewPlumberLocation(e.target.value)}
                  className="w-full bg-[#0A0C16] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button 
                  type="button"
                  onClick={() => setShowAddPlumberModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-indigo-600/30"
                >
                  Save & Activate GPS
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ----------------- INTERACTIVE DETAIL MODAL ----------------- */}
      {activeModal && activeModal !== "gps" && activeModal !== "calls" && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-[#111322] border border-slate-700/80 w-full max-w-4xl rounded-3xl p-6 sm:p-8 shadow-2xl shadow-purple-950/40 relative max-h-[85vh] overflow-y-auto">
            <button 
              onClick={() => setActiveModal(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* MODAL: WORK ORDER PIPELINE */}
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
                            {job.stage === 'todo' ? 'To Do' : job.stage === 'doing' ? 'Doing' : 'Done'}
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
          </div>
        </div>
      )}
    </div>
  );
}
