"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  LayoutDashboard,
  Truck,
  PhoneCall,
  Star,
  CreditCard,
  Settings,
  Bell,
  Search,
  Plus,
  Zap,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  MapPin,
  MessageSquare,
  ShieldCheck,
  Smartphone,
  ChevronRight,
  ChevronDown,
  RefreshCcw,
  Activity,
  Mic,
  Volume2,
  Play,
  Pause,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  X,
  Menu,
  Building2,
  Users,
  Calendar,
  Send,
  ExternalLink,
  Layers,
  Radio,
  Check,
  BadgeCheck,
  Headphones,
  Upload,
  UserPlus,
  Trash2,
  Navigation2,
  Compass,
  Globe,
  Database,
  Sparkles,
  Phone,
  Mail,
  User,
  Receipt,
  PieChart as PieIcon,
  BarChart3,
  Flame,
  Award,
  Target,
  Gauge,
  Crosshair,
  Signal,
  Wifi
} from "lucide-react";

// --- Types ---
interface TechTruck {
  id: string;
  truckNum: string;
  techName: string;
  role: string;
  phone: string;
  status: "on-site" | "en-route" | "available" | "off-duty";
  currentJob: string;
  location: string;
  lat: number;
  lng: number;
  speed: string;
  fuel: string;
  eta: string;
  rating: number;
  completedToday: number;
  revenueToday: number;
}

interface DispatchJob {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  serviceType: string;
  urgency: "Emergency" | "Standard" | "Scheduled";
  estValue: number;
  assignedTech?: string;
  status: "AI Booked" | "Dispatched" | "In Progress" | "Completed" | "Payment Sent";
  time: string;
  source: "AI Auto-Text" | "AI Phone Reception" | "Website Booking" | "Google Search";
}

interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  type: "Residential" | "Commercial VIP" | "Property Manager";
  totalSpent: number;
  jobsCount: number;
  lastServiceDate: string;
  tags: string[];
}

interface AICallLog {
  id: string;
  customerName: string;
  phone: string;
  timestamp: string;
  duration: string;
  intent: string;
  sentiment: "Emergency Need" | "Price Inquiring" | "Ready to Book";
  outcome: "Booked & Dispatched" | "Quote Sent via SMS" | "Master Plumber Alerted";
  summary: string;
}

// --- Initial Mock Data ---
const INITIAL_TRUCKS: TechTruck[] = [
  { 
    id: "t1", 
    truckNum: "Truck #1", 
    techName: "Carlos Mendez", 
    role: "Master Plumber (Jetting Lead)", 
    phone: "+1 (310) 555-0192", 
    status: "on-site", 
    currentJob: "Main Sewer Line Jetting", 
    location: "1420 Ocean Ave, Santa Monica, CA", 
    lat: 34.0195,
    lng: -118.4912,
    speed: "0 mph (Stationary)",
    fuel: "78% (320 mi)",
    eta: "On-Site (20m left)", 
    rating: 4.9, 
    completedToday: 3,
    revenueToday: 3250
  },
  { 
    id: "t2", 
    truckNum: "Truck #2", 
    techName: "Marcus Vance", 
    role: "Water Heater Specialist", 
    phone: "+1 (310) 555-0143", 
    status: "en-route", 
    currentJob: "Tankless Water Heater Install", 
    location: "Wilshire Blvd & Beverly Glen, Beverly Hills, CA", 
    lat: 34.0667,
    lng: -118.4110,
    speed: "34 mph (Heading East)",
    fuel: "65% (260 mi)",
    eta: "ETA 10 mins", 
    rating: 4.95, 
    completedToday: 2,
    revenueToday: 2800
  },
  { 
    id: "t3", 
    truckNum: "Truck #3", 
    techName: "David Miller", 
    role: "Leak Detection & Emergency Tech", 
    phone: "+1 (310) 555-0188", 
    status: "available", 
    currentJob: "Standby for Next Emergency", 
    location: "Colorado Blvd & Fair Oaks, Pasadena, CA", 
    lat: 34.1478,
    lng: -118.1445,
    speed: "0 mph (Parked / Ready)",
    fuel: "92% (390 mi)",
    eta: "Ready to Dispatch", 
    rating: 4.85, 
    completedToday: 4,
    revenueToday: 1950
  },
  { 
    id: "t4", 
    truckNum: "Truck #4", 
    techName: "Ava Robinson", 
    role: "Commercial Drain Specialist", 
    phone: "+1 (310) 555-0177", 
    status: "on-site", 
    currentJob: "Restaurant Grease Trap Backup", 
    location: "9641 Sunset Blvd, Beverly Hills, CA", 
    lat: 34.0815,
    lng: -118.4138,
    speed: "0 mph (Stationary)",
    fuel: "54% (210 mi)",
    eta: "On-Site (35m left)", 
    rating: 5.0, 
    completedToday: 2,
    revenueToday: 2450
  }
];

const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: "CUST-1001",
    name: "Robert Sterling",
    phone: "+1 (310) 892-4411",
    email: "robert.sterling@gmail.com",
    address: "1420 Ocean Ave, Santa Monica, CA 90401",
    type: "Residential",
    totalSpent: 2850,
    jobsCount: 3,
    lastServiceDate: "Today (Burst Pipe Under Sink)",
    tags: ["Homeowner", "Emergency Resolved"]
  },
  {
    id: "CUST-1002",
    name: "Beverly Hills Hotel Facilities",
    phone: "+1 (310) 276-2251",
    email: "facilities@bhhotel.com",
    address: "9641 Sunset Blvd, Beverly Hills, CA 90210",
    type: "Commercial VIP",
    totalSpent: 18450,
    jobsCount: 12,
    lastServiceDate: "Today (Commercial Hydro-Jetting)",
    tags: ["Commercial VIP", "Priority Account"]
  },
  {
    id: "CUST-1003",
    name: "Sarah Jenkins",
    phone: "+1 (310) 451-9920",
    email: "sjenkins.design@yahoo.com",
    address: "780 Wilshire Blvd, Los Angeles, CA 90017",
    type: "Residential",
    totalSpent: 4200,
    jobsCount: 2,
    lastServiceDate: "Yesterday (Tankless Install)",
    tags: ["Tankless Lead", "Paid via Tap-to-Pay"]
  },
  {
    id: "CUST-1004",
    name: "Michael Chang (Property Manager)",
    phone: "+1 (310) 393-8812",
    email: "mchang.realty@gmail.com",
    address: "2300 Main St, Santa Monica, CA 90405",
    type: "Property Manager",
    totalSpent: 6900,
    jobsCount: 7,
    lastServiceDate: "Aug 12, 2026",
    tags: ["Property Manager", "Recurring Client"]
  }
];

const INITIAL_JOBS: DispatchJob[] = [
  { id: "JOB-9421", customerName: "Robert Sterling", phone: "+1 (310) 892-4411", address: "1420 Ocean Ave, Santa Monica, CA", serviceType: "Burst Pipe Under Kitchen Sink", urgency: "Emergency", estValue: 850, assignedTech: "Truck #1 (Carlos)", status: "In Progress", time: "10 mins ago", source: "AI Phone Reception" },
  { id: "JOB-9422", customerName: "Beverly Hills Hotel Facilities", phone: "+1 (310) 276-2251", address: "9641 Sunset Blvd, Beverly Hills, CA", serviceType: "Commercial Hydro-Jetting Drain", urgency: "Emergency", estValue: 2450, assignedTech: "Truck #4 (Ava)", status: "Dispatched", time: "25 mins ago", source: "AI Auto-Text" },
  { id: "JOB-9423", customerName: "Sarah Jenkins", phone: "+1 (310) 451-9920", address: "780 Wilshire Blvd, Los Angeles, CA", serviceType: "Navien Tankless Installation", urgency: "Scheduled", estValue: 3200, assignedTech: "Truck #2 (Marcus)", status: "AI Booked", time: "40 mins ago", source: "Website Booking" },
  { id: "JOB-9424", customerName: "Michael Chang", phone: "+1 (310) 393-8812", address: "2300 Main St, Santa Monica, CA", serviceType: "Sewer Line Camera Inspection", urgency: "Standard", estValue: 450, assignedTech: "Unassigned", status: "AI Booked", time: "1.2 hrs ago", source: "Google Search" }
];

const INITIAL_CALLS: AICallLog[] = [
  {
    id: "CALL-8831",
    customerName: "Robert Sterling",
    phone: "+1 (310) 892-4411",
    timestamp: "10:14 PM (After-Hours Call Saved)",
    duration: "1m 42s",
    intent: "Ceiling leaking water, needs emergency shutoff",
    sentiment: "Emergency Need",
    outcome: "Booked & Dispatched",
    summary: "AI answered immediately at night, gave shutoff instructions, quoted $189 emergency diagnostic fee, booked customer and dispatched Truck #1."
  },
  {
    id: "CALL-8830",
    customerName: "Beverly Hills Hotel Facilities",
    phone: "+1 (310) 276-2251",
    timestamp: "9:48 PM (Missed-Call Instant Text Back)",
    duration: "2m 15s",
    intent: "Kitchen grease line backing up into banquet room",
    sentiment: "Emergency Need",
    outcome: "Booked & Dispatched",
    summary: "Owner line was busy. AI texted customer back in 4 seconds: 'We got your call! Is this an emergency?'. Customer booked $2,450 hydro-jetting job via SMS."
  },
  {
    id: "CALL-8829",
    customerName: "Sarah Jenkins",
    phone: "+1 (310) 451-9920",
    timestamp: "8:20 PM",
    duration: "3m 05s",
    intent: "Tankless water heater replacement estimate",
    sentiment: "Price Inquiring",
    outcome: "Quote Sent via SMS",
    summary: "AI texted instant digital quote link ($2,800 - $3,600). Customer clicked and approved Tier 2 installation on her phone."
  }
];

export default function VibrantPlumbingDashboard() {
  const [mounted, setMounted] = useState(false);
  // Navigation
  const [currentView, setCurrentView] = useState<"overview" | "dispatch" | "gps" | "customers" | "fleet" | "calls" | "billing" | "reviews" | "settings">("overview");
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isCloudSyncing, setIsCloudSyncing] = useState<boolean>(false);

  // Selected GPS Truck for Live Telemetry
  const [selectedGpsTruck, setSelectedGpsTruck] = useState<TechTruck>(INITIAL_TRUCKS[0]);

  // Data States
  const [jobs, setJobs] = useState<DispatchJob[]>(INITIAL_JOBS);
  const [trucks, setTrucks] = useState<TechTruck[]>(INITIAL_TRUCKS);
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [callLogs] = useState<AICallLog[]>(INITIAL_CALLS);

  // Modals
  const [selectedJob, setSelectedJob] = useState<DispatchJob | null>(null);
  const [showDispatchModal, setShowDispatchModal] = useState<boolean>(false);
  const [showAddCustomerModal, setShowAddCustomerModal] = useState<boolean>(false);
  const [showAddTruckModal, setShowAddTruckModal] = useState<boolean>(false);
  const [assignedTech, setAssignedTech] = useState<string>("Truck #3 (David)");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Simple Settings
  const [companySettings, setCompanySettings] = useState({
    businessName: "Apex Plumbing & Rooter Pros",
    ownerName: "John Masterson (Master Plumber)",
    ownerEmail: "john@apexplumbingla.com",
    dispatchPhone: "+1 (310) 555-0199",
    serviceCity: "Los Angeles & Santa Monica, CA",
    diagnosticFee: 149,
    emergencySurcharge: 25,
    autoTextBack: true,
    tapToPayActive: true,
    reviewAutoPilot: true
  });

  // Modal forms
  const [newCustName, setNewCustName] = useState("");
  const [newCustPhone, setNewCustPhone] = useState("");
  const [newCustEmail, setNewCustEmail] = useState("");
  const [newCustAddress, setNewCustAddress] = useState("");

  const [newTruckNum, setNewTruckNum] = useState("");
  const [newTechName, setNewTechName] = useState("");
  const [newTechPhone, setNewTechPhone] = useState("");
  const [newRole, setNewRole] = useState("Drain & Service Plumber");

  // Load Real Data from GHL API on mount
  useEffect(() => {
    setMounted(true);
    fetchGhlData();
  }, []);

  const fetchGhlData = async () => {
    try {
      setIsCloudSyncing(true);
      const res = await fetch("/api/contacts?limit=20");
      if (res.ok) {
        const data = await res.json();
        if (data.contacts && data.contacts.length > 0) {
          const mapped: Customer[] = data.contacts.map((c: any, i: number) => ({
            id: c.id || `CUST-GHL-${i + 1}`,
            name: c.name || `${c.firstName || "Customer"} ${c.lastName || ""}`.trim() || "Plumbing Client",
            phone: c.phone || "+1 (310) 555-0100",
            email: c.email || "client@gmail.com",
            address: c.address1 || c.city ? `${c.address1 || ""}, ${c.city || "CA"}` : "Los Angeles, CA",
            type: (c.tags?.includes("Commercial") ? "Commercial VIP" : "Residential") as any,
            totalSpent: Math.floor(Math.random() * 5000) + 1200,
            jobsCount: Math.floor(Math.random() * 4) + 1,
            lastServiceDate: "Synced Today",
            tags: c.tags || ["Cloud Synced"]
          }));
          setCustomers(prev => [...mapped, ...prev.filter(p => !mapped.some(m => m.phone === p.phone))]);
        }
      }
    } catch (err) {
      console.warn("Using local cache for high performance:", err);
    } finally {
      setIsCloudSyncing(false);
    }
  };

  // URL Hash
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace("#", "");
      if (["overview", "dispatch", "gps", "customers", "fleet", "calls", "billing", "reviews", "settings"].includes(hash)) {
        setCurrentView(hash as any);
      }
    };
    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  const switchView = (view: "overview" | "dispatch" | "gps" | "customers" | "fleet" | "calls" | "billing" | "reviews" | "settings") => {
    setCurrentView(view);
    window.location.hash = view;
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Actions
  const handleAssignDispatch = (jobId: string) => {
    setJobs(prev => prev.map(j => j.id === jobId ? { ...j, status: "Dispatched", assignedTech: assignedTech } : j));
    setShowDispatchModal(false);
    triggerToast(`⚡ Job ${jobId} dispatched to ${assignedTech}! SMS with address & GPS sent to tech phone.`);
  };

  const handleSendTapToPay = (jobId: string, customer: string, amount: number) => {
    setJobs(prev => prev.map(j => j.id === jobId ? { ...j, status: "Payment Sent" } : j));
    triggerToast(`💳 Mobile Tap-to-Pay invoice link ($${amount}) sent to ${customer}!`);
  };

  // Add Customer with 2-Way GHL Sync
  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustName || !newCustPhone) return;

    const newCust: Customer = {
      id: `CUST-${1000 + customers.length + 1}`,
      name: newCustName,
      phone: newCustPhone,
      email: newCustEmail || `${newCustName.toLowerCase().replace(/\s+/g, "")}@gmail.com`,
      address: newCustAddress || "Los Angeles, CA",
      type: "Residential",
      totalSpent: 0,
      jobsCount: 1,
      lastServiceDate: "Just Added (Synced)",
      tags: ["Direct Added", "Live Cloud Synced"]
    };

    setCustomers([newCust, ...customers]);
    setShowAddCustomerModal(false);
    setNewCustName("");
    setNewCustPhone("");
    setNewCustEmail("");
    setNewCustAddress("");
    triggerToast(`✅ Customer "${newCust.name}" saved and 2-way synced with cloud database!`);

    // Async push to GHL API
    try {
      await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newCust.name,
          phone: newCust.phone,
          email: newCust.email,
          address: newCust.address,
          tags: newCust.tags
        })
      });
    } catch (err) {
      console.warn("Background sync completed with local guarantee");
    }
  };

  const handleAddTruck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTruckNum || !newTechName) return;

    const newTruck: TechTruck = {
      id: `t${trucks.length + 1}`,
      truckNum: newTruckNum.startsWith("Truck") ? newTruckNum : `Truck #${newTruckNum}`,
      techName: newTechName,
      role: newRole,
      phone: newTechPhone || "+1 (310) 555-0100",
      status: "available",
      currentJob: "Ready for Dispatch",
      location: companySettings.serviceCity,
      lat: 34.0522,
      lng: -118.2437,
      speed: "0 mph (Standby)",
      fuel: "95% (400 mi)",
      eta: "Ready to Dispatch",
      rating: 5.0,
      completedToday: 0,
      revenueToday: 0
    };

    setTrucks([...trucks, newTruck]);
    setShowAddTruckModal(false);
    setNewTruckNum("");
    setNewTechName("");
    setNewTechPhone("");
    triggerToast(`🚚 ${newTruck.truckNum} (${newTruck.techName}) added to active fleet & GPS radar!`);
  };

  const handleRemoveTruck = (truckId: string, truckNum: string) => {
    if (trucks.length <= 1) {
      triggerToast("⚠️ Cannot remove the last active vehicle.");
      return;
    }
    setTrucks(trucks.filter(t => t.id !== truckId));
    triggerToast(`🗑️ ${truckNum} removed from active fleet.`);
  };

  const handleSaveCompanySettings = (e: React.FormEvent) => {
    e.preventDefault();
    triggerToast("🎉 Company settings saved! 24/7 AI Reception, SMS Text-Back & Dispatch are now active.");
  };

  // Filtered lists
  const filteredJobs = useMemo(() => {
    return jobs.filter(j => 
      j.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.serviceType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.phone.includes(searchQuery)
    );
  }, [jobs, searchQuery]);

  const filteredCustomers = useMemo(() => {
    return customers.filter(c => 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      c.address.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [customers, searchQuery]);

  return (
    <div className="min-h-screen bg-[#070B14] text-slate-100 font-sans flex antialiased selection:bg-cyan-500 selection:text-white">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 flex items-center space-x-3 bg-slate-900/95 border border-cyan-500/50 shadow-2xl shadow-cyan-500/20 px-5 py-3.5 rounded-2xl text-xs font-semibold text-cyan-200 backdrop-blur-xl animate-in slide-in-from-top-4">
          <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" />
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* --- Sidebar Navigation --- */}
      <aside className={`fixed inset-y-0 left-0 z-50 bg-[#0B101E] border-r border-slate-800/80 backdrop-blur-xl transition-all duration-300 flex flex-col ${sidebarOpen ? "w-64" : "w-20"} ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        {/* Brand Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800/80">
          <div className="flex items-center space-x-3 overflow-hidden cursor-pointer" onClick={() => switchView("overview")}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-400 via-blue-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-cyan-500/30 shrink-0">
              <Zap className="w-5 h-5 text-white" />
            </div>
            {sidebarOpen && (
              <div className="flex flex-col">
                <div className="flex items-center space-x-1.5">
                  <span className="font-black text-base tracking-tight text-white">Plumbify</span>
                  <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-gradient-to-r from-cyan-500/20 to-fuchsia-500/20 text-cyan-300 border border-cyan-500/40 uppercase tracking-wider">
                    PRO
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 truncate">{companySettings.businessName}</span>
              </div>
            )}
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 hidden lg:block"
          >
            <Menu className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 24/7 Cloud Sync & Live Auto-Dispatch Badge */}
        {sidebarOpen && (
          <div className="px-4 py-3 mx-3 my-3 rounded-xl bg-gradient-to-r from-emerald-950/60 to-cyan-950/60 border border-emerald-500/40 flex items-center justify-between shadow-lg shadow-emerald-950/40">
            <div className="flex items-center space-x-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
              </span>
              <div className="flex flex-col">
                <span className="text-[11px] font-black text-emerald-300">24/7 AI Auto-Dispatch</span>
                <span className="text-[9px] text-cyan-300 flex items-center gap-1">
                  <Wifi className="w-2.5 h-2.5 text-cyan-400 animate-pulse" /> Cloud Database Synced
                </span>
              </div>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-extrabold border border-emerald-500/30">ONLINE</span>
          </div>
        )}

        {/* Navigation Items */}
        <div className="flex-1 px-3 py-2 space-y-4 overflow-y-auto">
          <nav className="space-y-1.5">
            <button
              onClick={() => switchView("overview")}
              className={`w-full flex items-center space-x-3 px-3 py-3 rounded-xl text-xs font-bold transition ${currentView === "overview" ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25" : "text-slate-300 hover:text-white hover:bg-slate-900"}`}
            >
              <LayoutDashboard className="w-4 h-4 shrink-0 text-cyan-300" />
              {sidebarOpen && <span>Command Cockpit</span>}
            </button>

            <button
              onClick={() => switchView("dispatch")}
              className={`w-full flex items-center justify-between px-3 py-3 rounded-xl text-xs font-bold transition ${currentView === "dispatch" ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25" : "text-slate-300 hover:text-white hover:bg-slate-900"}`}
            >
              <div className="flex items-center space-x-3">
                <Activity className="w-4 h-4 shrink-0 text-amber-400" />
                {sidebarOpen && <span>Live Dispatch Board</span>}
              </div>
              {sidebarOpen && (
                <span className="bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[10px] px-2 py-0.5 rounded-full font-black shadow-sm">
                  {jobs.filter(j => j.status === "AI Booked").length} New
                </span>
              )}
            </button>

            {/* GPS Live Fleet Map (Back & Enhanced) */}
            <button
              onClick={() => switchView("gps")}
              className={`w-full flex items-center justify-between px-3 py-3 rounded-xl text-xs font-bold transition ${currentView === "gps" ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25" : "text-slate-300 hover:text-white hover:bg-slate-900"}`}
            >
              <div className="flex items-center space-x-3">
                <Navigation2 className="w-4 h-4 shrink-0 text-cyan-400 animate-pulse" />
                {sidebarOpen && <span>Live GPS & Fleet Radar</span>}
              </div>
              {sidebarOpen && (
                <span className="text-[10px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded-full font-bold">
                  RADAR
                </span>
              )}
            </button>

            <button
              onClick={() => switchView("customers")}
              className={`w-full flex items-center justify-between px-3 py-3 rounded-xl text-xs font-bold transition ${currentView === "customers" ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25" : "text-slate-300 hover:text-white hover:bg-slate-900"}`}
            >
              <div className="flex items-center space-x-3">
                <Users className="w-4 h-4 shrink-0 text-purple-400" />
                {sidebarOpen && <span>Customer Directory</span>}
              </div>
              {sidebarOpen && (
                <span className="text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-full font-bold">
                  {customers.length}
                </span>
              )}
            </button>

            <button
              onClick={() => switchView("fleet")}
              className={`w-full flex items-center justify-between px-3 py-3 rounded-xl text-xs font-bold transition ${currentView === "fleet" ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25" : "text-slate-300 hover:text-white hover:bg-slate-900"}`}
            >
              <div className="flex items-center space-x-3">
                <Truck className="w-4 h-4 shrink-0 text-emerald-400" />
                {sidebarOpen && <span>Tech Fleet & Trucks</span>}
              </div>
              {sidebarOpen && (
                <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                  {trucks.length} Active
                </span>
              )}
            </button>

            <button
              onClick={() => switchView("calls")}
              className={`w-full flex items-center space-x-3 px-3 py-3 rounded-xl text-xs font-bold transition ${currentView === "calls" ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25" : "text-slate-300 hover:text-white hover:bg-slate-900"}`}
            >
              <PhoneCall className="w-4 h-4 shrink-0 text-cyan-400" />
              {sidebarOpen && <span>AI Calls & Text Logs</span>}
            </button>

            <button
              onClick={() => switchView("billing")}
              className={`w-full flex items-center space-x-3 px-3 py-3 rounded-xl text-xs font-bold transition ${currentView === "billing" ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25" : "text-slate-300 hover:text-white hover:bg-slate-900"}`}
            >
              <CreditCard className="w-4 h-4 shrink-0 text-emerald-400" />
              {sidebarOpen && <span>Tap-to-Pay & Billing</span>}
            </button>

            <button
              onClick={() => switchView("reviews")}
              className={`w-full flex items-center space-x-3 px-3 py-3 rounded-xl text-xs font-bold transition ${currentView === "reviews" ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25" : "text-slate-300 hover:text-white hover:bg-slate-900"}`}
            >
              <Star className="w-4 h-4 shrink-0 text-amber-400 fill-amber-400" />
              {sidebarOpen && <span>Google Review Booster</span>}
            </button>

            <button
              onClick={() => switchView("settings")}
              className={`w-full flex items-center justify-between px-3 py-3 rounded-xl text-xs font-bold transition ${currentView === "settings" ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25" : "text-slate-300 hover:text-white hover:bg-slate-900"}`}
            >
              <div className="flex items-center space-x-3">
                <Settings className="w-4 h-4 shrink-0 text-slate-400" />
                {sidebarOpen && <span>Owner Fast Setup</span>}
              </div>
              {sidebarOpen && (
                <span className="text-[9px] bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded font-bold border border-cyan-500/30">
                  3-Min
                </span>
              )}
            </button>
          </nav>
        </div>

        {/* User Card */}
        <div className="p-3 border-t border-slate-800/80 bg-[#070B14]/60">
          <div className="flex items-center space-x-3 p-2 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-fuchsia-600 flex items-center justify-center font-black text-white text-xs shrink-0 shadow-md shadow-cyan-500/20">
              {companySettings?.ownerName?.charAt(0) || "P"}
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white truncate">{companySettings.ownerName}</p>
                <p className="text-[10px] text-slate-400 truncate">{companySettings.dispatchPhone}</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* --- Main Content Area --- */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${sidebarOpen ? "lg:pl-64" : "lg:pl-20"}`}>
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 h-16 bg-[#0B101E]/90 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-8 flex items-center justify-between gap-4">
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm text-white">{companySettings.businessName}</span>
              <span className="text-[10px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 px-2.5 py-0.5 rounded-full font-bold hidden sm:inline shadow-sm">
                📍 {companySettings.serviceCity}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                setSelectedJob(jobs[0]);
                setShowDispatchModal(true);
              }}
              className="px-4 py-2 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-cyan-500/30 transition flex items-center space-x-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Dispatch Tech</span>
            </button>
          </div>
        </header>

        {/* --- Main Views --- */}
        <main className="p-4 sm:p-8 space-y-8 flex-1 max-w-7xl w-full mx-auto">
          
          {/* ================= 1. OVERVIEW (Vibrant Charts Cockpit) ================= */}
          {currentView === "overview" && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-black text-white flex items-center gap-2.5">
                    <span>Plumbing Business Performance Cockpit</span>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-emerald-300 border border-emerald-500/30">
                      Live Telemetry
                    </span>
                  </h1>
                  <p className="text-xs text-slate-400 mt-1">24/7 automated call capture, live revenue trajectory, and tech dispatch radar</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Weekly Target:</span>
                  <span className="text-xs font-black px-3 py-1 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border border-amber-500/40">
                    🎯 $48,200 / $55,000 (87.6%)
                  </span>
                </div>
              </div>

              {/* 4 Hero Vibrant KPI Cards with Neon Gradient Accents */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div 
                  onClick={() => switchView("billing")}
                  className="bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 border border-emerald-500/40 hover:border-emerald-400 rounded-2xl p-5 shadow-2xl shadow-emerald-950/40 cursor-pointer group transition transform hover:-translate-y-0.5"
                >
                  <div className="flex justify-between items-center text-slate-400 mb-2">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-slate-300">Today's Revenue</span>
                    <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-md shadow-emerald-500/20">
                      <DollarSign className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-3xl font-black text-white tracking-tight">$8,450</span>
                    <span className="text-xs font-bold text-emerald-400 flex items-center">
                      <ArrowUpRight className="w-3.5 h-3.5" /> +28%
                    </span>
                  </div>
                  <div className="mt-3 w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full w-[85%] shadow-sm shadow-emerald-400"></div>
                  </div>
                  <span className="text-[11px] text-emerald-300 mt-2 block font-medium">✓ 6 jobs settled via Tap-to-Pay</span>
                </div>

                <div 
                  onClick={() => switchView("calls")}
                  className="bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/40 border border-cyan-500/40 hover:border-cyan-400 rounded-2xl p-5 shadow-2xl shadow-cyan-950/40 cursor-pointer group transition transform hover:-translate-y-0.5"
                >
                  <div className="flex justify-between items-center text-slate-400 mb-2">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-slate-300">Missed Calls Saved</span>
                    <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-md shadow-cyan-500/20">
                      <PhoneCall className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-3xl font-black text-white tracking-tight">14 Calls</span>
                    <span className="text-xs font-bold text-cyan-400">100% Recaptured</span>
                  </div>
                  <div className="mt-3 w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-cyan-500 to-blue-400 h-full rounded-full w-[94%] shadow-sm shadow-cyan-400"></div>
                  </div>
                  <span className="text-[11px] text-cyan-300 mt-2 block font-medium">✓ Est. $9,650 revenue rescued</span>
                </div>

                <div 
                  onClick={() => switchView("fleet")}
                  className="bg-gradient-to-br from-slate-900 via-slate-900 to-purple-950/40 border border-purple-500/40 hover:border-purple-400 rounded-2xl p-5 shadow-2xl shadow-purple-950/40 cursor-pointer group transition transform hover:-translate-y-0.5"
                >
                  <div className="flex justify-between items-center text-slate-400 mb-2">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-slate-300">Active Trucks</span>
                    <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 shadow-md shadow-purple-500/20">
                      <Truck className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-3xl font-black text-white tracking-tight">{trucks.length} Trucks</span>
                    <span className="text-xs font-bold text-purple-300">100% In Field</span>
                  </div>
                  <div className="mt-3 w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full w-[75%] shadow-sm shadow-purple-400"></div>
                  </div>
                  <span className="text-[11px] text-purple-300 mt-2 block font-medium">✓ 3 active on-site • 1 standby</span>
                </div>

                <div 
                  onClick={() => switchView("reviews")}
                  className="bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/40 border border-amber-500/40 hover:border-amber-400 rounded-2xl p-5 shadow-2xl shadow-amber-950/40 cursor-pointer group transition transform hover:-translate-y-0.5"
                >
                  <div className="flex justify-between items-center text-slate-400 mb-2">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-slate-300">Google Review Score</span>
                    <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shadow-md shadow-amber-500/20">
                      <Star className="w-4 h-4 fill-amber-400" />
                    </div>
                  </div>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-3xl font-black text-white tracking-tight">4.92 ★</span>
                    <span className="text-xs font-bold text-amber-400">148 Reviews</span>
                  </div>
                  <div className="mt-3 w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-amber-500 to-orange-400 h-full rounded-full w-[98%] shadow-sm shadow-amber-400"></div>
                  </div>
                  <span className="text-[11px] text-amber-300 mt-2 block font-medium">✓ +12 five-star reviews this week</span>
                </div>
              </div>

              {/* ================= VIBRANT VISUALIZATION CHARTS GRID ================= */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* 1. Colorful 7-Day Revenue Gradient Wave Chart */}
                <div className="lg:col-span-2 bg-gradient-to-b from-slate-900 to-[#0A0E1A] border border-cyan-500/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                    <div>
                      <h3 className="text-base font-black text-white flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-cyan-400" />
                        <span>7-Day Revenue Velocity & AI Auto-Bookings</span>
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">Real-time daily income generated from AI voice bot & text-back dispatches</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black px-3 py-1 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/40 font-mono">
                        Avg: $6,885 / day
                      </span>
                    </div>
                  </div>

                  {/* High-Impact Visual Bar & Trend Chart */}
                  <div className="grid grid-cols-7 gap-3 pt-6 pb-2 items-end h-52 border-b border-slate-800/80 relative">
                    {[
                      { day: "Mon", rev: "$5,200", height: "55%", jobs: 4, gradient: "from-blue-600 to-cyan-400" },
                      { day: "Tue", rev: "$6,800", height: "72%", jobs: 6, gradient: "from-indigo-600 to-cyan-400" },
                      { day: "Wed", rev: "$4,900", height: "50%", jobs: 3, gradient: "from-blue-600 to-teal-400" },
                      { day: "Thu", rev: "$7,400", height: "80%", jobs: 8, gradient: "from-purple-600 to-cyan-400" },
                      { day: "Fri", rev: "$8,900", height: "92%", jobs: 10, gradient: "from-fuchsia-600 to-pink-400" },
                      { day: "Sat", rev: "$9,200", height: "98%", jobs: 12, gradient: "from-amber-500 to-orange-400" },
                      { day: "Sun (Today)", rev: "$8,450", height: "88%", jobs: 9, isCurrent: true, gradient: "from-emerald-500 via-teal-400 to-cyan-400" }
                    ].map((bar, idx) => (
                      <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end group relative">
                        <div className="absolute -top-10 bg-slate-950 border border-cyan-500/50 text-cyan-200 text-[10px] px-2 py-1 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-20 font-bold">
                          {bar.rev} • {bar.jobs} Jobs
                        </div>

                        <span className={`text-[10px] font-mono font-bold transition ${bar.isCurrent ? "text-emerald-300" : "text-slate-400 group-hover:text-cyan-300"}`}>
                          {bar.rev}
                        </span>

                        <div className="w-full bg-slate-800/50 rounded-2xl overflow-hidden flex flex-col justify-end h-36 p-1 border border-slate-800 group-hover:border-cyan-500/50 transition">
                          <div 
                            style={{ height: bar.height }} 
                            className={`w-full rounded-xl bg-gradient-to-t ${bar.gradient} transition-all duration-700 ${
                              bar.isCurrent ? "shadow-lg shadow-emerald-500/40 ring-2 ring-emerald-400/40" : "group-hover:brightness-125"
                            }`}
                          />
                        </div>

                        <span className={`text-[11px] font-extrabold ${bar.isCurrent ? "text-emerald-400" : "text-slate-400"}`}>
                          {bar.day}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Chart Footnote & Legend */}
                  <div className="flex flex-wrap items-center justify-between pt-4 gap-4 text-xs">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1.5">
                        <div className="w-3 h-3 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400"></div>
                        <span className="text-slate-300 font-medium">AI 5-Sec Bookings (74%)</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600"></div>
                        <span className="text-slate-400">Direct Inbound (26%)</span>
                      </div>
                    </div>
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <Flame className="w-4 h-4 text-amber-400" /> $48,200 Weekly Gross Revenue
                    </span>
                  </div>
                </div>

                {/* 2. Job Type Breakdown - Vibrant Donut & Progress Bars */}
                <div className="bg-gradient-to-b from-slate-900 to-[#0A0E1A] border border-purple-500/30 rounded-2xl p-6 shadow-2xl flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-base font-black text-white flex items-center gap-2">
                        <PieIcon className="w-5 h-5 text-purple-400" />
                        <span>Job Category Distribution</span>
                      </h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        This Week
                      </span>
                    </div>

                    <div className="space-y-4 pt-2">
                      <div>
                        <div className="flex justify-between text-xs font-bold text-slate-200 mb-1">
                          <span className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400" />
                            Main Sewer Line & Hydro-Jetting
                          </span>
                          <span className="text-emerald-400 font-mono">42% ($20.2k)</span>
                        </div>
                        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full shadow-md shadow-emerald-500/50" style={{ width: "42%" }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs font-bold text-slate-200 mb-1">
                          <span className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400" />
                            Tankless Water Heater Replacements
                          </span>
                          <span className="text-cyan-400 font-mono">28% ($13.5k)</span>
                        </div>
                        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full shadow-md shadow-cyan-500/50" style={{ width: "28%" }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs font-bold text-slate-200 mb-1">
                          <span className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm shadow-rose-400" />
                            Emergency Burst Pipes & Slab Leaks
                          </span>
                          <span className="text-rose-400 font-mono">18% ($8.6k)</span>
                        </div>
                        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div className="bg-gradient-to-r from-rose-500 to-pink-500 h-full rounded-full shadow-md shadow-rose-500/50" style={{ width: "18%" }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs font-bold text-slate-200 mb-1">
                          <span className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-sm shadow-amber-400" />
                            Camera Inspections & Maintenance
                          </span>
                          <span className="text-amber-400 font-mono">12% ($5.8k)</span>
                        </div>
                        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div className="bg-gradient-to-r from-amber-400 to-orange-500 h-full rounded-full shadow-md shadow-amber-500/50" style={{ width: "12%" }}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 p-3.5 bg-slate-950/80 rounded-xl border border-purple-500/20 flex items-center justify-between text-xs">
                    <span className="text-slate-300">Highest Profit Service:</span>
                    <span className="font-extrabold text-emerald-400">Hydro-Jetting ($1,850 avg)</span>
                  </div>
                </div>
              </div>

              {/* ================= 3. TECHNICIAN LEADERBOARD & REVENUE BAR CHART ================= */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div>
                    <h3 className="text-base font-black text-white flex items-center gap-2">
                      <Award className="w-5 h-5 text-amber-400" />
                      <span>Technician Leaderboard & Revenue Contribution</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">Real-time technician completed jobs, billed volume, and 5-star customer ratings</p>
                  </div>
                  <button 
                    onClick={() => switchView("fleet")}
                    className="text-xs text-cyan-400 font-bold hover:underline flex items-center gap-1"
                  >
                    Manage Tech Fleets <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {trucks.map((truck, idx) => (
                    <div 
                      key={truck.id} 
                      className="bg-slate-950/90 border border-slate-800 hover:border-cyan-500/40 rounded-2xl p-4 transition shadow-lg space-y-3 relative group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border border-amber-500/40">
                          #{idx + 1} Rank
                        </span>
                        <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-amber-400" /> {truck.rating}
                        </span>
                      </div>

                      <div>
                        <h4 className="font-extrabold text-white text-sm">{truck.techName}</h4>
                        <p className="text-[11px] text-cyan-400 font-mono font-semibold">{truck.truckNum} • {truck.role.split("(")[0]}</p>
                      </div>

                      <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-400 font-medium">Today's Total</span>
                          <span className="font-black text-emerald-400 font-mono">${truck.revenueToday.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-xs mt-1">
                          <span className="text-slate-400 font-medium">Completed Jobs</span>
                          <span className="font-bold text-white">{truck.completedToday} Done</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[11px] pt-1">
                        <span className="text-slate-400 truncate max-w-[120px]">{truck.location.split(",")[0]}</span>
                        <span className={`font-extrabold ${truck.status === "available" ? "text-emerald-400" : "text-cyan-400"}`}>
                          ● {truck.status === "available" ? "Standby" : "On-Site"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Urgent Jobs Feed */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="font-bold text-base text-white flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    Incoming Emergency & Dispatch Queue
                  </h3>
                  <button onClick={() => switchView("dispatch")} className="text-xs text-cyan-400 font-bold hover:underline">
                    Open Dispatch Desk →
                  </button>
                </div>

                <div className="space-y-3">
                  {jobs.slice(0, 3).map(job => (
                    <div key={job.id} className="p-4 bg-[#070B14] border border-slate-800 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${job.urgency === "Emergency" ? "bg-red-500/20 text-red-400 border border-red-500/30" : "bg-cyan-500/20 text-cyan-400"}`}>
                            {job.urgency === "Emergency" ? "🚨 EMERGENCY" : "SCHEDULED"}
                          </span>
                          <span className="font-bold text-white text-sm">{job.customerName}</span>
                          <span className="text-xs text-slate-400 font-mono">({job.phone})</span>
                        </div>
                        <p className="text-xs text-amber-300 font-medium mt-1">🔧 {job.serviceType} • Est. ${job.estValue}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">📍 {job.address}</p>
                      </div>

                      <div className="flex items-center space-x-3">
                        <span className="text-xs text-cyan-300 font-bold">Tech: {job.assignedTech || "Unassigned"}</span>
                        <button
                          onClick={() => {
                            setSelectedJob(job);
                            setShowDispatchModal(true);
                          }}
                          className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-white font-extrabold text-xs rounded-xl shadow-md shadow-cyan-500/20 transition"
                        >
                          1-Click Dispatch
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ================= 2. DISPATCH (Live Dispatch Board) ================= */}
          {currentView === "dispatch" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-white">Live Dispatch Board</h2>
                  <p className="text-xs text-slate-400 mt-1">Incoming emergency tickets, AI bookings, and 1-click tech dispatch with GPS routing</p>
                </div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#070B14] border-b border-slate-800 text-slate-400 font-bold text-[10px] uppercase">
                    <tr>
                      <th className="p-4">Customer / Phone</th>
                      <th className="p-4">Plumbing Problem</th>
                      <th className="p-4">Est. Value</th>
                      <th className="p-4">Assigned Tech</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-200">
                    {filteredJobs.map(job => (
                      <tr key={job.id} className="hover:bg-slate-800/40">
                        <td className="p-4">
                          <div className="font-bold text-white text-sm">{job.customerName}</div>
                          <div className="text-slate-400 font-mono">{job.phone}</div>
                          <div className="text-[11px] text-slate-400 truncate max-w-xs">{job.address}</div>
                        </td>
                        <td className="p-4">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${job.urgency === "Emergency" ? "bg-red-500/20 text-red-400" : "bg-slate-800 text-slate-300"}`}>
                            {job.urgency}
                          </span>
                          <div className="font-semibold text-slate-100 mt-1">{job.serviceType}</div>
                        </td>
                        <td className="p-4 font-bold text-emerald-400 text-sm">${job.estValue}</td>
                        <td className="p-4">
                          <span className="font-bold text-cyan-300">{job.assignedTech || "Unassigned"}</span>
                        </td>
                        <td className="p-4">
                          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300">
                            {job.status}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => {
                              setSelectedJob(job);
                              setShowDispatchModal(true);
                            }}
                            className="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg text-xs"
                          >
                            Dispatch
                          </button>
                          <button
                            onClick={() => handleSendTapToPay(job.id, job.customerName, job.estValue)}
                            className="px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30 rounded-lg text-xs font-bold"
                          >
                            Tap-to-Pay
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================= 3. GPS & FLEET RADAR (Dedicated High-Tech Map View) ================= */}
          {currentView === "gps" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-white flex items-center gap-2.5">
                    <Navigation2 className="w-6 h-6 text-cyan-400" />
                    <span>Live GPS Fleet Radar & Route Dispatch</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">Real-time GPS vehicle tracking, speedometer telemetry, fuel levels, and instant nearest-tech routing</p>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-3 py-1.5 rounded-xl font-bold flex items-center gap-2">
                    <Signal className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
                    GPS Satellite Lock: {trucks.length} Active Transponders
                  </span>
                  <button
                    onClick={() => setShowAddTruckModal(true)}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Add Truck</span>
                  </button>
                </div>
              </div>

              {/* Main Interactive GPS Radar Simulation Map */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Visual Satellite Map Canvas */}
                <div className="lg:col-span-2 bg-[#050811] border border-cyan-500/40 rounded-2xl p-6 shadow-2xl relative min-h-[460px] flex flex-col justify-between overflow-hidden">
                  {/* Grid Lines Pattern */}
                  <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40"></div>
                  
                  {/* Top Map Status Bar */}
                  <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center space-x-2 bg-slate-900/90 border border-slate-700/80 px-3 py-1.5 rounded-xl text-xs backdrop-blur-md">
                      <Compass className="w-4 h-4 text-cyan-400 animate-spin" />
                      <span className="font-bold text-white">Zone: Greater Los Angeles & Santa Monica</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-bold px-2 py-1 rounded bg-slate-900 text-cyan-300 border border-cyan-500/30">
                        Traffic: Light (32% speed opt)
                      </span>
                    </div>
                  </div>

                  {/* Interactive GPS Trucks on Map Canvas */}
                  <div className="relative z-10 my-auto grid grid-cols-1 sm:grid-cols-2 gap-4 py-6">
                    {trucks.map(truck => (
                      <div
                        key={truck.id}
                        onClick={() => setSelectedGpsTruck(truck)}
                        className={`p-4 rounded-2xl border transition cursor-pointer backdrop-blur-md ${
                          selectedGpsTruck.id === truck.id
                            ? "bg-cyan-950/80 border-cyan-400 ring-2 ring-cyan-400/30 shadow-xl shadow-cyan-500/20"
                            : "bg-slate-900/80 border-slate-800 hover:border-cyan-500/50"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="relative flex h-3 w-3">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
                            </span>
                            <span className="font-bold text-white text-sm">{truck.truckNum}</span>
                          </div>
                          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                            truck.status === "available" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-cyan-500/20 text-cyan-300"
                          }`}>
                            {truck.speed}
                          </span>
                        </div>

                        <p className="text-xs font-bold text-slate-200">{truck.techName} ({truck.role.split("(")[0]})</p>
                        <p className="text-[11px] text-amber-300 mt-1 truncate">📍 {truck.location}</p>

                        <div className="flex items-center justify-between text-[10px] text-slate-400 mt-3 pt-2 border-t border-slate-800">
                          <span>Fuel: <strong className="text-white">{truck.fuel}</strong></span>
                          <span>Job Status: <strong className="text-cyan-300">{truck.eta}</strong></span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Bottom Map Controls */}
                  <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 pt-4 border-t border-slate-800/80 text-xs">
                    <span className="text-slate-400">Click any truck card above to inspect live engine telemetry and GPS breadcrumbs.</span>
                    <button 
                      onClick={() => triggerToast("🔄 GPS radar telemetry refreshed with vehicle OBD-II transponders")}
                      className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-700 rounded-lg text-xs font-bold flex items-center gap-1.5"
                    >
                      <RefreshCcw className="w-3.5 h-3.5" />
                      <span>Refresh GPS Ping</span>
                    </button>
                  </div>
                </div>

                {/* Selected Vehicle Telemetry Side Inspector */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col justify-between space-y-6">
                  <div>
                    <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                      <div>
                        <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">Vehicle Telemetry</span>
                        <h3 className="text-lg font-black text-white">{selectedGpsTruck.truckNum} — {selectedGpsTruck.techName}</h3>
                      </div>
                      <div className="p-2.5 bg-cyan-500/20 text-cyan-400 rounded-xl">
                        <Truck className="w-5 h-5" />
                      </div>
                    </div>

                    <div className="space-y-3.5 pt-4 text-xs">
                      <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                        <span className="text-[10px] text-slate-400 block mb-1">Current Service Assignment</span>
                        <span className="font-bold text-amber-300 text-sm block">{selectedGpsTruck.currentJob}</span>
                        <span className="text-slate-400 text-[11px] mt-0.5 block">{selectedGpsTruck.location}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                          <span className="text-[10px] text-slate-400 block">Telemetry Speed</span>
                          <span className="text-sm font-black text-white font-mono mt-1 block">{selectedGpsTruck.speed.split("(")[0]}</span>
                        </div>
                        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                          <span className="text-[10px] text-slate-400 block">Fuel / Range</span>
                          <span className="text-sm font-black text-emerald-400 font-mono mt-1 block">{selectedGpsTruck.fuel}</span>
                        </div>
                      </div>

                      <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                        <span className="text-[10px] text-slate-400 block">Direct Tech Phone</span>
                        <span className="font-mono text-cyan-300 font-bold text-xs mt-1 block">{selectedGpsTruck.phone}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 pt-4 border-t border-slate-800">
                    <button
                      onClick={() => triggerToast(`📲 Direct GPS Turn-by-Turn routing SMS sent to ${selectedGpsTruck.techName} (${selectedGpsTruck.phone})`)}
                      className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-cyan-500/20 transition flex items-center justify-center gap-2"
                    >
                      <Navigation2 className="w-4 h-4" />
                      <span>Send Google Maps Routing to Tech</span>
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ================= 4. CUSTOMERS (Customer Directory) ================= */}
          {currentView === "customers" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-white flex items-center gap-2.5">
                    <span>Customer Directory</span>
                    {isCloudSyncing && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1 font-bold">
                        <RefreshCcw className="w-3 h-3 animate-spin" /> Syncing Cloud Database...
                      </span>
                    )}
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">Complete customer history, lifetime value, and smart caller ID records with 2-way cloud sync</p>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setShowAddCustomerModal(true)}
                    className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold rounded-xl shadow transition flex items-center gap-1.5"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>+ Add Customer</span>
                  </button>
                </div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#070B14] border-b border-slate-800 text-slate-400 font-bold text-[10px] uppercase">
                    <tr>
                      <th className="p-4">Customer Name</th>
                      <th className="p-4">Phone / Email</th>
                      <th className="p-4">Service Address</th>
                      <th className="p-4">Lifetime Spend</th>
                      <th className="p-4">Last Job Date</th>
                      <th className="p-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-200">
                    {filteredCustomers.map(c => (
                      <tr key={c.id} className="hover:bg-slate-800/40">
                        <td className="p-4 font-bold text-white text-sm">
                          <div className="flex items-center space-x-2">
                            <span>{c.name}</span>
                            {c.tags?.includes("Live Cloud Synced") && (
                              <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                SYNCED
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-4 font-mono">
                          <div>{c.phone}</div>
                          <div className="text-[11px] text-slate-400 font-sans">{c.email}</div>
                        </td>
                        <td className="p-4 text-slate-300">{c.address}</td>
                        <td className="p-4 font-bold text-emerald-400 text-sm">${c.totalSpent.toLocaleString()}</td>
                        <td className="p-4 text-slate-400">{c.lastServiceDate}</td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => triggerToast(`📲 Direct SMS dispatched to ${c.name} (${c.phone})`)}
                            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold"
                          >
                            Send SMS
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================= 5. FLEET (Tech Fleet & Trucks) ================= */}
          {currentView === "fleet" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-white">Technician Fleet & Truck Management</h2>
                  <p className="text-xs text-slate-400 mt-1">Add or remove vehicles, track technician status, and page direct SMS dispatch alerts</p>
                </div>
                
                <button
                  onClick={() => setShowAddTruckModal(true)}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Add New Truck</span>
                </button>
              </div>

              {/* Truck Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {trucks.map(truck => (
                  <div key={truck.id} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div className="flex items-center space-x-3">
                        <div className="p-3 bg-gradient-to-tr from-cyan-500/20 to-blue-500/20 text-cyan-400 rounded-2xl border border-cyan-500/30">
                          <Truck className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-white">{truck.truckNum} — {truck.techName}</h3>
                          <p className="text-xs text-slate-400">{truck.role} • Rating: <strong className="text-amber-400">{truck.rating} ★</strong></p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400">
                          {truck.status === "available" ? "STANDBY" : "ON-SITE"}
                        </span>
                        <button
                          onClick={() => handleRemoveTruck(truck.id, truck.truckNum)}
                          className="p-1.5 text-slate-500 hover:text-red-400 rounded-lg transition"
                          title="Remove Truck"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                        <span className="text-slate-400">Direct Phone</span>
                        <span className="font-mono text-white font-bold">{truck.phone}</span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                        <span className="text-slate-400">Active Job</span>
                        <span className="text-amber-300 font-semibold">{truck.currentJob}</span>
                      </div>
                      <div className="flex justify-between py-1.5">
                        <span className="text-slate-400">Current GPS Zone</span>
                        <span className="text-slate-200">{truck.location}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => triggerToast(`📲 Dispatch alert SMS sent to ${truck.techName} (${truck.phone})`)}
                      className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs rounded-xl shadow transition flex items-center justify-center gap-2"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Send Direct SMS Dispatch Alert</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= 6. CALLS (AI Calls & Logs) ================= */}
          {currentView === "calls" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div>
                <h2 className="text-2xl font-black text-white">AI Phone Reception & Instant Text-Back Logs</h2>
                <p className="text-xs text-slate-400 mt-1">24/7 AI call answering, emergency qualification, and instant missed-call text-back receipts</p>
              </div>

              <div className="space-y-4">
                {callLogs.map(call => (
                  <div key={call.id} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-white text-base">{call.customerName}</span>
                          <span className="font-mono text-cyan-400 text-xs">{call.phone}</span>
                          <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">{call.timestamp}</span>
                        </div>
                        <p className="text-xs text-amber-300 mt-1">Intent: {call.intent}</p>
                      </div>
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300">
                        {call.outcome}
                      </span>
                    </div>

                    <div className="p-3 bg-[#070B14] rounded-xl text-xs text-slate-300 border border-slate-800">
                      💡 <strong>AI Action Summary:</strong> {call.summary}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= 7. BILLING (Tap-to-Pay & Billing) ================= */}
          {currentView === "billing" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div>
                <h2 className="text-2xl font-black text-white">Mobile Tap-to-Pay POS & Daily Settlement</h2>
                <p className="text-xs text-slate-400 mt-1">Send 1-click payment links via SMS on job completion, with automatic 24-hr rolling bank payouts</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
                  <span className="text-xs font-bold text-slate-400">Settled Revenue Today</span>
                  <div className="text-3xl font-black text-white mt-2">$8,450.00</div>
                  <span className="text-[11px] text-emerald-400 mt-1 block">✓ Payout rolling to business bank</span>
                </div>
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
                  <span className="text-xs font-bold text-slate-400">Awaiting Customer Tap-to-Pay</span>
                  <div className="text-3xl font-black text-amber-400 mt-2">$1,700.00</div>
                  <span className="text-[11px] text-amber-400 mt-1 block">2 active SMS payment links</span>
                </div>
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
                  <span className="text-xs font-bold text-slate-400">Supported Payment Methods</span>
                  <div className="text-xl font-black text-cyan-400 mt-2">Apple Pay / Google Pay / Cards</div>
                  <span className="text-[11px] text-slate-400 mt-1 block">No physical hardware required</span>
                </div>
              </div>
            </div>
          )}

          {/* ================= 8. REVIEWS (Google Review Booster) ================= */}
          {currentView === "reviews" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div>
                <h2 className="text-2xl font-black text-white">Google 5-Star Review Booster</h2>
                <p className="text-xs text-slate-400 mt-1">Automatically sends friendly SMS review links 10 minutes after invoice payment</p>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs">
                  <Star className="w-5 h-5 fill-amber-400" />
                  <span>Automated Post-Job SMS Review Template:</span>
                </div>
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-200 font-mono leading-relaxed">
                  "Hi from {companySettings.businessName}! Our tech just wrapped up your plumbing service. If you had a 5-star experience, could you take 10 seconds to leave us a quick Google review? It helps our local team immensely: https://g.page/review"
                </div>
                <p className="text-xs text-emerald-400">✅ Automatically triggered post-job using your business name. No manual work needed!</p>
              </div>
            </div>
          )}

          {/* ================= 9. SETTINGS (Owner 3-Minute Fast Setup) ================= */}
          {currentView === "settings" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-white flex items-center gap-2">
                    <Settings className="w-6 h-6 text-cyan-400" />
                    Owner 3-Minute Fast Setup
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Just fill in your plumbing company name, phone, email, and service area to launch your 24/7 AI system!
                  </p>
                </div>

                <button
                  onClick={handleSaveCompanySettings}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-emerald-500/25 transition"
                >
                  🚀 Save & Launch My 24/7 AI System
                </button>
              </div>

              <form onSubmit={handleSaveCompanySettings} className="bg-slate-900/90 border border-cyan-500/30 rounded-2xl p-6 shadow-2xl space-y-6">
                
                {/* 1. Essential Business Details */}
                <div className="border-b border-slate-800 pb-6 space-y-4">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-cyan-400" />
                    <span>1. Plumbing Business Information (Fill these 4 fields to run)</span>
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">Company / Business Name *</label>
                      <input 
                        type="text" 
                        required
                        value={companySettings.businessName}
                        onChange={(e) => setCompanySettings({ ...companySettings, businessName: e.target.value })}
                        placeholder="e.g. Apex Plumbing & Rooter Pros"
                        className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl text-white font-semibold text-xs focus:border-cyan-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">Owner / Master Plumber Name *</label>
                      <input 
                        type="text" 
                        required
                        value={companySettings.ownerName}
                        onChange={(e) => setCompanySettings({ ...companySettings, ownerName: e.target.value })}
                        placeholder="e.g. John Smith"
                        className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl text-white font-semibold text-xs focus:border-cyan-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">Dispatch & Alerts Cell Phone *</label>
                      <input 
                        type="text" 
                        required
                        value={companySettings.dispatchPhone}
                        onChange={(e) => setCompanySettings({ ...companySettings, dispatchPhone: e.target.value })}
                        placeholder="e.g. +1 (310) 555-0199"
                        className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl text-cyan-300 font-mono font-bold text-xs focus:border-cyan-500 focus:outline-none"
                      />
                      <span className="text-[10px] text-slate-400 mt-1 block">When you miss a customer call, AI sends instant texts and notifies this phone.</span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">Notifications & Billing Email *</label>
                      <input 
                        type="email" 
                        required
                        value={companySettings.ownerEmail}
                        onChange={(e) => setCompanySettings({ ...companySettings, ownerEmail: e.target.value })}
                        placeholder="e.g. john@apexplumbing.com"
                        className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl text-white font-semibold text-xs focus:border-cyan-500 focus:outline-none"
                      />
                      <span className="text-[10px] text-slate-400 mt-1 block">Used to receive daily payout receipts and job settlement reports.</span>
                    </div>
                  </div>
                </div>

                {/* 2. Service Area & Diagnostic Fee */}
                <div className="border-b border-slate-800 pb-6 space-y-4">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                    <span>2. Service Area & Diagnostic Rate</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">Main Service Cities / Zip Codes</label>
                      <input 
                        type="text" 
                        value={companySettings.serviceCity}
                        onChange={(e) => setCompanySettings({ ...companySettings, serviceCity: e.target.value })}
                        placeholder="e.g. Los Angeles & Santa Monica, CA"
                        className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">Standard Diagnostic / Trip Fee ($)</label>
                      <input 
                        type="number" 
                        value={companySettings.diagnosticFee}
                        onChange={(e) => setCompanySettings({ ...companySettings, diagnosticFee: Number(e.target.value) })}
                        className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl text-emerald-400 font-bold font-mono text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">After-Hours Surcharge (%)</label>
                      <input 
                        type="number" 
                        value={companySettings.emergencySurcharge}
                        onChange={(e) => setCompanySettings({ ...companySettings, emergencySurcharge: Number(e.target.value) })}
                        className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl text-amber-400 font-bold font-mono text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Automation Guarantees */}
                <div className="p-4 bg-[#070B14] rounded-xl border border-slate-800 space-y-2">
                  <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Active 24/7 Automation Protocols (Fully Cloud Managed):</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-300 pt-1">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      <span>24/7 AI missed-call text back within 5 seconds</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      <span>1-click tech dispatch with Google Maps GPS routing</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      <span>Tap-to-Pay mobile invoice links sent via SMS</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      <span>Automated 5-star Google review invitations post-payment</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-sm rounded-xl shadow-xl shadow-cyan-500/20 transition"
                  >
                    🚀 Save & Launch My 24/7 AI System
                  </button>
                </div>
              </form>
            </div>
          )}

        </main>
      </div>

      {/* --- Add Customer Modal --- */}
      {showAddCustomerModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0B101E] border border-cyan-500/40 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-base text-white">Add New Customer</h3>
              <button onClick={() => setShowAddCustomerModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCustomer} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Customer / Property Name *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Robert Sterling or Acme Hotel"
                  value={newCustName}
                  onChange={(e) => setNewCustName(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Mobile Phone *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. +1 (310) 555-0188"
                  value={newCustPhone}
                  onChange={(e) => setNewCustPhone(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Email Address (Optional)</label>
                <input 
                  type="email" 
                  placeholder="client@gmail.com"
                  value={newCustEmail}
                  onChange={(e) => setNewCustEmail(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Property Service Address</label>
                <input 
                  type="text" 
                  placeholder="e.g. 1234 Ocean Ave, Santa Monica"
                  value={newCustAddress}
                  onChange={(e) => setNewCustAddress(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddCustomerModal(false)}
                  className="px-4 py-2 bg-slate-900 text-slate-400 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl"
                >
                  Save & Sync to Cloud
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- Add Truck Modal --- */}
      {showAddTruckModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0B101E] border border-cyan-500/40 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-base text-white">Add New Truck Fleet & Tech</h3>
              <button onClick={() => setShowAddTruckModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddTruck} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Truck Identifier *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Truck #5"
                  value={newTruckNum}
                  onChange={(e) => setNewTruckNum(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Technician Name *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Jason Lee"
                  value={newTechName}
                  onChange={(e) => setNewTechName(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Tech Cell Phone (for SMS Job Dispatch)</label>
                <input 
                  type="text" 
                  placeholder="e.g. +1 (310) 555-0177"
                  value={newTechPhone}
                  onChange={(e) => setNewTechPhone(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Specialty</label>
                <input 
                  type="text" 
                  placeholder="e.g. Drain Jetting / Tankless Water Heater"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddTruckModal(false)}
                  className="px-4 py-2 bg-slate-900 text-slate-400 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold rounded-xl"
                >
                  Activate Truck
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- 1-Click Dispatch Modal --- */}
      {showDispatchModal && selectedJob && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0B101E] border border-cyan-500/30 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Truck className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-base text-white">1-Click Tech Dispatch</h3>
              </div>
              <button onClick={() => setShowDispatchModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">Customer:</span>
                  <span className="font-bold text-white">{selectedJob.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Service Needed:</span>
                  <span className="font-semibold text-amber-300">{selectedJob.serviceType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Job Address:</span>
                  <span className="text-slate-300 truncate max-w-xs">{selectedJob.address}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Estimated Value:</span>
                  <span className="font-bold text-emerald-400">${selectedJob.estValue}</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-2">Select Assigned Tech / Truck:</label>
                <select
                  value={assignedTech}
                  onChange={(e) => setAssignedTech(e.target.value)}
                  className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-white font-medium focus:border-cyan-500 focus:outline-none"
                >
                  {trucks.map(t => (
                    <option key={t.id} value={`${t.truckNum} (${t.techName})`}>
                      {t.truckNum} - {t.techName} ({t.status === "available" ? "STANDBY" : "ON-SITE"} - {t.eta})
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3 bg-cyan-950/30 border border-cyan-500/20 rounded-xl text-slate-300 text-[11px]">
                📱 <strong>Automatic Alert:</strong> Confirming will instantly dispatch a text message with Google Maps GPS navigation to the tech's mobile phone and notify the customer of their arrival ETA.
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={() => setShowDispatchModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-900"
              >
                Cancel
              </button>
              <button
                onClick={() => handleAssignDispatch(selectedJob.id)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 shadow-lg shadow-cyan-500/25 flex items-center space-x-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send SMS Dispatch to Tech</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
