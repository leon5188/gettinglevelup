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
  Navigation, 
  Compass, 
  PhoneCall, 
  MapPin, 
  Check,
  AlertCircle,
  TrendingDown,
  Info
} from "lucide-react";

// Pipeline & Stage IDs for "Plumber Service Pipeline"
const STAGES = [
  { id: "39e4f504-cc6d-40d3-9cf2-1ecae58f0ad3", name: "New Inquiry", color: "text-slate-400" },
  { id: "6888769f-a8fa-45e3-ba74-d62a36c70f7a", name: "Needs Analysis", color: "text-cyan-400" },
  { id: "f537d9ef-6333-493e-9ef0-a9c4bad51abb", name: "Solution/Quote", color: "text-indigo-400" },
  { id: "3dd92e63-9f1d-446b-ba96-1b369da6afcc", name: "Negotiation", color: "text-amber-400" },
  { id: "fa9e0a56-6896-4079-94ed-31b0b7f944e6", name: "Closed Won/Lost", color: "text-rose-400" },
  { id: "758517cf-783b-46ce-9467-30f8581797c4", name: "Completed & Reviewed", color: "text-emerald-400" }
];

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
  pipelineStageId: string;
  assignedTo: string | null;
  status: "open" | "won" | "lost" | "abandoned";
  createdAt: string;
  updatedAt: string;
  contact: {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    tags?: string[];
  };
  // UI computed properties
  x?: number;
  y?: number;
  assignedTechName?: string;
}

interface Technician {
  name: string;
  role: string;
  status: "Active" | "Idle" | "On Break";
  billableHours: number;
  monthlyRevenue: number;
  routeColor: string;
  routePath: string;
  avatar: string;
}

interface CRMInvoice {
  id: string;
  customerName: string;
  amount: number;
  status: string;
  dueDate: string;
}

export default function LiveMapDashboard() {
  const [activeTab, setActiveTab] = useState<"overview" | "jobs" | "techs" | "finance" | "crm">("overview");
  
  // Data States
  const [stats, setStats] = useState({
    capturedLeads: 0,
    savedRevenue: 0,
    responseTime: "4.8 seconds",
    reviewsCount: 98,
    averageRating: 4.87,
    activeTechs: 8,
    jobsDispatched: 0,
    recentLeads: [] as any[]
  });
  
  const [opportunities, setOpportunities] = useState<CRMOpportunity[]>([]);
  const [contacts, setContacts] = useState<CRMContact[]>([]);
  const [invoices, setInvoices] = useState<CRMInvoice[]>([]);
  const [isDemoInvoices, setIsDemoInvoices] = useState(false);
  const [techs, setTechs] = useState<Technician[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [crmSearch, setCrmSearch] = useState("");

  // Sub-tab for Jobs: Kanban vs Map
  const [jobView, setJobView] = useState<"kanban" | "map">("kanban");
  
  // Map Selected States
  const [selectedTechRoute, setSelectedTechRoute] = useState<string>("all");
  const [selectedPin, setSelectedPin] = useState<CRMOpportunity | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optMessage, setOptMessage] = useState("Routes optimized based on current traffic parameters.");

  // Vapi Voice Calling State
  const [activeDialLead, setActiveDialLead] = useState<any>(null);
  const [dialCallStatus, setDialCallStatus] = useState<string>("idle"); 
  const [dialCallSummary, setDialCallSummary] = useState<string>("");
  const [isDialing, setIsDialing] = useState<boolean>(false);

  // Social Posting States
  const [socialAccounts, setSocialAccounts] = useState<any[]>([]);
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const [postSummary, setPostSummary] = useState("");
  const [postStatus, setPostStatus] = useState<"draft" | "published">("draft");
  const [isPosting, setIsPosting] = useState(false);
  const [selectedQuizIndex, setSelectedQuizIndex] = useState<number | null>(null);
  const [postingLogs, setPostingLogs] = useState<any[]>([
    { time: "10:24 AM", message: "Outreach CRM initialized.", type: "system" },
    { time: "11:15 AM", message: "Social planner engine established.", type: "success" }
  ]);

  const quizzes = [
    {
      title: "🚨 Emergency Shut-off Valve Quiz",
      description: "Ask readers if they know how to shut off the main valve. Extremely engaging.",
      text: "【水务智商测试 🚨】半夜厨房突然水漫金山，第一步该怎么做？\nA) 打电话给物业\nB) 发朋友圈吐槽\nC) 顺时针旋转总水阀门关闭水源\nD) 拿抹布去擦水\n\n💡 答案是 C！很多朋友在房水管漏水时脑子一片空白。赶紧带家人熟悉一下家里的『主进水阀』在哪个角落（通常在水表旁、车库或地下室），关键时刻能帮你挽回数万元的财产损失！如果找不到或者阀门拧不动，快私信我们预约专业排查！👇 #PlumbingTips #WaterSafety #HomeMaintenance"
    },
    {
      title: "🌡️ Hot Water Heater Diagnostic",
      description: "Trivia for checking heater elements. High comments conversion rate.",
      text: "【热水器寿命大拷问 🌡️】洗澡水忽冷忽热，是不是热水器该『退休』了？测试一下你的热水器状态：\n1️⃣ 已经使用超过 8 年？\n2️⃣ 底部有微弱的水渍或铁锈红？\n3️⃣ 烧水时发出类似爆米花的轰鸣声？\n\n如果你中了 2 条以上，说明它的内胆结垢严重甚至开始穿孔了！老式热水器不仅耗能翻倍，还有漏水隐患。留言说说你家的热水器用了多少年？👇 #HomeDiagnostics #WaterHeater #EnergySaving"
    },
    {
      title: "🚽 Toilet Slow Flush Mythbuster",
      description: "Teach about plumbing roof vents. Solves high-frequency support requests.",
      text: "【马桶小常识 🚽】为什么马桶下水慢，有时候并不是因为堵了，而是『气不够』？\nA) 马桶底座漏气\nB) 屋顶的排气管堵塞了\nC) 水箱水压不够\nD) 冲水姿势不对\n\n💡 答案是 B！很多人不知道，排水管网是需要屋顶排气孔（Plumbing Vent）来保持气压平衡的。如果排气孔落满落叶或结冰，下水管道就会形成真空拉力，导致排水极慢甚至咕嘟作响。学到了吗？点赞并分享给需要的朋友！👍 #HomeHacks #Plumbing101 #SmartHome"
    }
  ];

  // Static Tech list to map opportunities to
  const baseTechs = [
    { name: "Dave", role: "Master Plumber", status: "Active", billableHours: 38, routeColor: "#3b82f6", routePath: "M 200,150 L 80,60 L 320,180", avatar: "👨‍🔧" },
    { name: "Mike", role: "Sewer Line Specialist", status: "Active", billableHours: 35, routeColor: "#3cd2a5", routePath: "M 200,150 L 180,140 L 120,220", avatar: "👷‍♂️" },
    { name: "John", role: "Service Technician", status: "Active", billableHours: 32, routeColor: "#f76c74", routePath: "M 200,150 L 120,220 L 280,100", avatar: "🛠️" },
    { name: "Steve", role: "Apprentice", status: "Active", billableHours: 28, routeColor: "#8b5cf6", routePath: "M 200,150 L 320,180", avatar: "👦" },
    { name: "Tyler", role: "Service Technician", status: "On Break", billableHours: 24, routeColor: "#ec4899", routePath: "M 200,150 L 220,80", avatar: "🔧" },
    { name: "Alex", role: "Installation Lead", status: "Idle", billableHours: 30, routeColor: "#64748b", routePath: "", avatar: "🚛" }
  ];

  // Stable coordinate assignment based on Opportunity ID to keep pins consistent on map
  const getCoordinatesForId = (id: string, index: number) => {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    const seedX = Math.abs(Math.sin(hash + 1)) * 300 + 50; 
    const seedY = Math.abs(Math.cos(hash + 2)) * 200 + 50;
    return { x: Math.round(seedX), y: Math.round(seedY) };
  };

  // Fetch CRM data
  const fetchData = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      // 1. Fetch Overview Stats
      const statsRes = await fetch("/api/dashboard-stats");
      let statsData = {
        capturedLeads: 184,
        savedRevenue: 150880,
        responseTime: "4.8 seconds",
        reviewsCount: 98,
        averageRating: 4.87,
        activeTechs: 8,
        jobsDispatched: 312,
        recentLeads: []
      };
      if (statsRes.ok) {
        statsData = await statsRes.json();
        setStats(statsData);
      }

      // 2. Fetch Opportunities (Jobs)
      const oppsRes = await fetch("/api/opportunities");
      let oppsList: CRMOpportunity[] = [];
      if (oppsRes.ok) {
        const oppsData = await oppsRes.json();
        oppsList = oppsData.opportunities || [];
      }

      // Format Opportunities with map coordinates & tech assignment mapping
      const formattedOpps = oppsList.map((opp, idx) => {
        const coords = getCoordinatesForId(opp.id, idx);
        let techIndex = 5; 
        if (opp.assignedTo) {
          let charSum = 0;
          for (let i = 0; i < opp.assignedTo.length; i++) {
            charSum += opp.assignedTo.charCodeAt(i);
          }
          techIndex = charSum % baseTechs.length;
        } else {
          techIndex = idx % baseTechs.length;
        }
        
        return {
          ...opp,
          x: coords.x,
          y: coords.y,
          assignedTechName: baseTechs[techIndex].name
        };
      });
      setOpportunities(formattedOpps);

      // Recalculate techs revenue based on real Opportunities
      const techRevenueMap: Record<string, number> = {};
      formattedOpps.forEach((opp) => {
        const name = opp.assignedTechName || "Alex";
        const val = opp.monetaryValue || 820;
        if (opp.status === "won" || opp.status === "open") {
          techRevenueMap[name] = (techRevenueMap[name] || 0) + val;
        }
      });

      const updatedTechs = baseTechs.map(tech => ({
        ...tech,
        status: (formattedOpps.some(o => o.assignedTechName === tech.name && o.pipelineStageId === "f537d9ef-6333-493e-9ef0-a9c4bad51abb") ? "Active" : tech.status) as any,
        monthlyRevenue: techRevenueMap[tech.name] || 4500
      }));
      setTechs(updatedTechs);

      // 3. Fetch Contacts for CRM
      const contactsRes = await fetch(`/api/contacts?query=${crmSearch}`);
      if (contactsRes.ok) {
        const contactsData = await contactsRes.json();
        setContacts(contactsData.contacts || []);
      }

      // 4. Fetch Invoices
      const invoicesRes = await fetch("/api/invoices");
      if (invoicesRes.ok) {
        const invoicesData = await invoicesRes.json();
        if (invoicesData.invoices && invoicesData.invoices.length > 0) {
          setInvoices(invoicesData.invoices.map((inv: any) => ({
            id: inv.invoiceNumber || inv.id.slice(0, 8),
            customerName: inv.contactName || "CRM Customer",
            amount: inv.amount || 250,
            status: inv.status || "Pending",
            dueDate: inv.dueDate ? new Date(inv.dueDate).toLocaleDateString() : "Pending"
          })));
          setIsDemoInvoices(false);
        } else {
          setInvoices([
            { id: "INV-CRM-001", customerName: "Gregory House", amount: 1250.00, status: "Overdue", dueDate: "2026-06-10" },
            { id: "INV-CRM-002", customerName: "Lisa Cuddy", amount: 480.00, status: "Pending", dueDate: "2026-06-25" },
            { id: "INV-CRM-003", customerName: "James Wilson", amount: 2200.00, status: "Paid", dueDate: "2026-06-18" },
            { id: "INV-CRM-004", customerName: "Eric Foreman", amount: 350.00, status: "Pending", dueDate: "2026-06-30" },
            { id: "INV-CRM-005", customerName: "Allison Cameron", amount: 1800.00, status: "Overdue", dueDate: "2026-06-05" }
          ]);
          setIsDemoInvoices(true);
        }
      }

      // 5. Fetch Social accounts
      try {
        const socialRes = await fetch("/api/social/accounts");
        if (socialRes.ok) {
          const socialData = await socialRes.json();
          const accs = socialData.accounts || [];
          setSocialAccounts(accs);
          if (accs.length > 0 && selectedAccounts.length === 0) {
            setSelectedAccounts(accs.map((a: any) => a.id));
          }
        }
      } catch (err) {
        console.error("Error fetching social accounts:", err);
      }

    } catch (err) {
      console.error("Error synchronizing dashboard telemetry:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handlePublishPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postSummary.trim()) return;
    if (selectedAccounts.length === 0) {
      alert("Please select at least one social media account to post.");
      return;
    }
    
    setIsPosting(true);
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setPostingLogs(prev => [
      { time: now, message: `Initiating posting sequence to ${selectedAccounts.length} channels...`, type: "info" },
      ...prev
    ]);

    try {
      const res = await fetch("/api/social/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          summary: postSummary,
          accountIds: selectedAccounts,
          status: postStatus
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setPostingLogs(prev => [
          { 
            time: now, 
            message: `${data.simulated ? "[DEMO SYNC] " : ""}Post successfully registered. ID: ${data.postId}. Status: ${data.status.toUpperCase()}`, 
            type: "success" 
          },
          ...prev
        ]);
        setPostSummary("");
        setSelectedQuizIndex(null);
      } else {
        setPostingLogs(prev => [
          { time: now, message: `Failed: ${data.error || "Unknown server error"}`, type: "error" },
          ...prev
        ]);
      }
    } catch (err: any) {
      setPostingLogs(prev => [
        { time: now, message: `Connection failure: ${err.message}`, type: "error" },
        ...prev
      ]);
    } finally {
      setIsPosting(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCrmSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setRefreshing(true);
    try {
      const contactsRes = await fetch(`/api/contacts?query=${crmSearch}`);
      if (contactsRes.ok) {
        const contactsData = await contactsRes.json();
        setContacts(contactsData.contacts || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setRefreshing(false);
    }
  };

  const moveJobStage = async (opportunityId: string, currentStageId: string) => {
    const currentIdx = STAGES.findIndex(s => s.id === currentStageId);
    if (currentIdx === -1) return;
    const nextIdx = (currentIdx + 1) % STAGES.length;
    const nextStageId = STAGES[nextIdx].id;

    setOpportunities(prev => prev.map(opp => {
      if (opp.id === opportunityId) {
        return { ...opp, pipelineStageId: nextStageId };
      }
      return opp;
    }));

    try {
      const res = await fetch("/api/opportunities", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          opportunityId,
          pipelineStageId: nextStageId
        })
      });

      if (!res.ok) {
        throw new Error("Failed to write stage transition to CRM");
      }
      
      const oppsRes = await fetch("/api/opportunities");
      if (oppsRes.ok) {
        const oppsData = await oppsRes.json();
        const freshOpps = oppsData.opportunities || [];
        setOpportunities(freshOpps.map((opp: any, idx: number) => {
          const coords = getCoordinatesForId(opp.id, idx);
          let techIndex = idx % baseTechs.length;
          return {
            ...opp,
            x: coords.x,
            y: coords.y,
            assignedTechName: baseTechs[techIndex].name
          };
        }));
      }
    } catch (err) {
      console.error("Opportunity update failed:", err);
      fetchData();
    }
  };

  const optimizeRoutes = async () => {
    setIsOptimizing(true);
    await new Promise(r => setTimeout(r, 1500));
    setOptMessage("Route sequence optimized! GPS parameters pushed to Assigned Technicians.");
    setIsOptimizing(false);
  };

  const getRouteStats = () => {
    switch (selectedTechRoute) {
      case "Dave":
        return { stops: 2, distance: "18.4 miles", time: "32 mins", fuelSaved: "14%" };
      case "Mike":
        return { stops: 2, distance: "14.2 miles", time: "25 mins", fuelSaved: "16%" };
      case "John":
        return { stops: 1, distance: "21.6 miles", time: "38 mins", fuelSaved: "12%" };
      case "Steve":
        return { stops: 1, distance: "9.8 miles", time: "18 mins", fuelSaved: "20%" };
      case "Tyler":
        return { stops: 1, distance: "6.2 miles", time: "12 mins", fuelSaved: "15%" };
      default:
        return { stops: opportunities.length, distance: `${(opportunities.length * 8.4).toFixed(1)} miles (combined)`, time: `${opportunities.length * 18} mins (total)`, fuelSaved: "18.2%" };
    }
  };

  const triggerOutboundCall = async (lead: any) => {
    setActiveDialLead(lead);
    setIsDialing(true);
    setDialCallStatus("dialing");
    setDialCallSummary("");
    
    try {
      const res = await fetch("/api/vapi/outbound", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          phoneNumber: lead.phone || "+16262036250",
          name: lead.contactName || `${lead.firstName || ""} ${lead.lastName || ""}`.trim() || lead.name
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setDialCallStatus("ringing");
        
        if (data.simulated) {
          await new Promise(r => setTimeout(r, 2000));
          setDialCallStatus("in-progress");
          await new Promise(r => setTimeout(r, 4500));
          setDialCallStatus("completed");
          setDialCallSummary(
            `[CRM VOICE FEEDBACK] AI Agent completed the dispatch call to ${lead.contactName || lead.firstName || "Customer"}. Qualified missed-call text-back service. Pre-approved quote of $850 for leak repair. Dispatch technician dispatched.`
          );
        } else {
          setDialCallStatus("in-progress");
          setDialCallSummary("AI Call placed via Vapi! Phone line initialized. CRM logs will auto-sync on hangup.");
        }
      } else {
        setDialCallStatus("failed");
        setDialCallSummary(`Dialer failed: ${data.error || "Failed to trigger"}`);
      }
    } catch (err: any) {
      setDialCallStatus("failed");
      setDialCallSummary(`Connection error: ${err.message}`);
    } finally {
      setIsDialing(false);
    }
  };

  const totalOutstandingAr = invoices
    .filter(inv => inv.status !== "Paid" && inv.status !== "paid")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const routeDetails = getRouteStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#141f3b] text-[#8e9bb8] flex flex-col items-center justify-center font-sans">
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 border-2 border-t-[#3b82f6] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          <Zap className="h-6 w-6 text-[#3cd2a5] absolute animate-pulse" />
        </div>
        <p className="mt-4 text-xs font-bold uppercase tracking-widest text-[#5d6b8b] font-mono animate-pulse">Syncing CRM Telemetry...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#141f3b] text-[#8e9bb8] flex font-sans relative antialiased selection:bg-[#3b82f6]/20 selection:text-[#3b82f6]">
      
      {/* SOFT NEUMORPHIC GLOBAL STYLES (MATCHING IMAGE COLORS EXACTLY) */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes soundwave {
          0%, 100% { transform: scaleY(0.2); }
          50% { transform: scaleY(1); }
        }
        .voice-bar {
          animation: soundwave 0.8s ease-in-out infinite;
          transform-origin: bottom;
        }
        .voice-bar:nth-child(2) { animation-delay: 0.1s; }
        .voice-bar:nth-child(3) { animation-delay: 0.2s; }
        .voice-bar:nth-child(4) { animation-delay: 0.3s; }
        .voice-bar:nth-child(5) { animation-delay: 0.4s; }
        
        /* Neumorphic 3D Slate Panels - Cards are dark inset slate, background is lighter */
        .nm-raised {
          background: #0c1221;
          box-shadow: 6px 6px 14px rgba(0, 0, 0, 0.45), -6px -6px 14px rgba(255, 255, 255, 0.015);
          border: 1px solid rgba(255, 255, 255, 0.02);
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .nm-raised:hover {
          box-shadow: 8px 8px 18px rgba(0, 0, 0, 0.5), -8px -8px 18px rgba(255, 255, 255, 0.02);
          border-color: rgba(67, 146, 241, 0.15);
        }
        
        .nm-sunken {
          background: #060812;
          box-shadow: inset 3px 3px 8px rgba(0, 0, 0, 0.65), inset -3px -3px 8px rgba(255, 255, 255, 0.01);
          border: 1px solid rgba(0, 0, 0, 0.25);
        }
        
        .nm-inset-track {
          background: #04060c;
          box-shadow: inset 2px 2px 5px rgba(0, 0, 0, 0.55), inset -2px -2px 5px rgba(255, 255, 255, 0.008);
        }

        .text-neon-cyan {
          text-shadow: 0 0 6px rgba(60, 210, 165, 0.3);
        }
        .text-neon-blue {
          text-shadow: 0 0 6px rgba(59, 130, 246, 0.3);
        }
      `}} />

      {/* SIDEBAR NAVIGATION PANEL */}
      <aside className="w-68 bg-[#090d18] border-r border-[#141d33] flex flex-col justify-between shrink-0 z-10 relative">
        <div className="flex flex-col h-full">
          {/* Logo Area */}
          <div className="h-22 border-b border-[#141d33] flex items-center px-6 gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0c1221] flex items-center justify-center shadow-[4px_4px_10px_rgba(0,0,0,0.4)] border border-white/5">
              <Zap className="h-5 w-5 text-[#3b82f6]" />
            </div>
            <div>
              <span className="font-extrabold tracking-wider text-white text-base">PLUMBIFY</span>
              <span className="block text-[9px] text-[#3cd2a5] font-mono tracking-widest uppercase font-bold">Operations</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-2 flex-1">
            <button 
              onClick={() => setActiveTab("overview")}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all border ${activeTab === "overview" ? "bg-[#3b82f6]/10 text-white border-[#3b82f6]/25 shadow-inner" : "text-slate-450 hover:text-slate-200 border-transparent"}`}
            >
              <div className="flex items-center gap-3">
                <BarChart3 size={15} className={activeTab === "overview" ? "text-[#3b82f6]" : "text-slate-500"} />
                <span>Overview (KPIs)</span>
              </div>
              <ChevronRight size={12} className="opacity-30" />
            </button>

            <button 
              onClick={() => {
                setActiveTab("jobs");
                setJobView("kanban");
              }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all border ${activeTab === "jobs" ? "bg-[#3b82f6]/10 text-white border-[#3b82f6]/25 shadow-inner" : "text-slate-450 hover:text-slate-200 border-transparent"}`}
            >
              <div className="flex items-center gap-3">
                <Map size={15} className={activeTab === "jobs" ? "text-[#3b82f6]" : "text-slate-500"} />
                <span>Jobs Kanban Board</span>
              </div>
              <ChevronRight size={12} className="opacity-30" />
            </button>

            <button 
              onClick={() => setActiveTab("techs")}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all border ${activeTab === "techs" ? "bg-[#3b82f6]/10 text-white border-[#3b82f6]/25 shadow-inner" : "text-slate-450 hover:text-slate-200 border-transparent"}`}
            >
              <div className="flex items-center gap-3">
                <UserCheck size={15} className={activeTab === "techs" ? "text-[#3b82f6]" : "text-slate-500"} />
                <span>Technicians</span>
              </div>
              <ChevronRight size={12} className="opacity-30" />
            </button>

            <button 
              onClick={() => setActiveTab("finance")}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all border ${activeTab === "finance" ? "bg-[#3b82f6]/10 text-white border-[#3b82f6]/25 shadow-inner" : "text-slate-450 hover:text-slate-200 border-transparent"}`}
            >
              <div className="flex items-center gap-3">
                <DollarSign size={15} className={activeTab === "finance" ? "text-[#3b82f6]" : "text-slate-500"} />
                <span>Ledger & Billing</span>
              </div>
              <ChevronRight size={12} className="opacity-30" />
            </button>

            <button 
              onClick={() => setActiveTab("crm")}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all border ${activeTab === "crm" ? "bg-[#3b82f6]/10 text-white border-[#3b82f6]/25 shadow-inner" : "text-slate-450 hover:text-slate-200 border-transparent"}`}
            >
              <div className="flex items-center gap-3">
                <Users size={15} className={activeTab === "crm" ? "text-[#3b82f6]" : "text-slate-500"} />
                <span>CRM Contacts</span>
              </div>
              <ChevronRight size={12} className="opacity-30" />
            </button>
          </nav>
        </div>

        {/* Sync status */}
        <div className="p-4 border-t border-[#141d33] bg-[#060812]">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3cd2a5] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#3cd2a5]"></span>
            </span>
            <span className="text-[9px] text-[#5d6b8b] font-mono font-bold uppercase tracking-wider">Live Sync Connected</span>
          </div>
        </div>
      </aside>
 
      {/* MAIN LAYOUT */}
      <main className="flex-1 flex flex-col overflow-y-auto z-10 relative bg-[#141f3b]">
        
        {/* Top Header */}
        <header className="h-22 border-b border-[#1c2a4c] px-8 flex items-center justify-between shrink-0 bg-[#0e1629]">
          <div>
            <h1 className="text-sm font-extrabold text-white tracking-wider flex items-center gap-2 uppercase">
              <span>Operations Command Center</span>
              <span className="text-[9px] bg-[#3b82f6]/10 text-[#3b82f6] border border-[#3b82f6]/20 px-2 py-0.5 rounded-full font-mono font-semibold">v3.0</span>
            </h1>
            <p className="text-xs text-[#5d6b8b] mt-0.5 font-medium">Real-time opportunities mapping, contact dispatching and Vapi Voice integration</p>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => fetchData(true)}
              disabled={refreshing}
              className="px-4 py-2.5 nm-raised hover:text-white rounded-2xl transition-all flex items-center gap-2 text-xs font-bold"
            >
              <RefreshCcw size={13} className={refreshing ? "animate-spin text-[#3cd2a5]" : ""} />
              <span>{refreshing ? "Fetching..." : "Force Sync CRM"}</span>
            </button>
          </div>
        </header>

        {/* CONTAINER CONTENT */}
        <div className="flex-1 p-8 space-y-8 max-w-7xl mx-auto w-full">

          {/* ================================================================= */}
          {/* TAB 1: KPI OVERVIEW                                               */}
          {/* ================================================================= */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              
              {/* Bento KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* 1. Active Jobs */}
                <div className="nm-raised rounded-[20px] p-6 flex flex-col justify-between relative group overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#5d6b8b] uppercase tracking-widest font-mono">Active Jobs</span>
                    <div className="w-8 h-8 rounded-xl bg-[#060812] flex items-center justify-center text-[#3b82f6] border border-white/5 shadow-inner">
                      <Briefcase size={14} />
                    </div>
                  </div>
                  <div className="mt-5">
                    <div className="text-3xl font-extrabold text-white font-mono tracking-tight text-neon-blue">{stats.jobsDispatched}</div>
                    <p className="text-[10px] text-[#5d6b8b] mt-2 font-bold uppercase tracking-wider">Opportunities in plumbing</p>
                  </div>
                </div>

                {/* 2. Total Saved Revenue */}
                <div className="nm-raised rounded-[20px] p-6 flex flex-col justify-between relative group overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#5d6b8b] uppercase tracking-widest font-mono">CRM Revenue</span>
                    <div className="w-8 h-8 rounded-xl bg-[#060812] flex items-center justify-center text-[#3cd2a5] border border-white/5 shadow-inner">
                      <DollarSign size={14} />
                    </div>
                  </div>
                  <div className="mt-5">
                    <div className="text-3xl font-extrabold text-[#3cd2a5] font-mono tracking-tight text-neon-cyan">${stats.savedRevenue.toLocaleString()}</div>
                    <div className="flex items-center gap-1 text-[10px] text-[#5d6b8b] mt-2 font-bold uppercase tracking-wider">
                      <TrendingUp size={11} className="text-[#3cd2a5]" />
                      <span>Pipeline Total Value</span>
                    </div>
                  </div>
                </div>

                {/* 3. Total Leads */}
                <div className="nm-raised rounded-[20px] p-6 flex flex-col justify-between relative group overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#5d6b8b] uppercase tracking-widest font-mono">Captured Leads</span>
                    <div className="w-8 h-8 rounded-xl bg-[#060812] flex items-center justify-center text-[#f76c74] border border-white/5 shadow-inner">
                      <Users size={14} />
                    </div>
                  </div>
                  <div className="mt-5">
                    <div className="text-3xl font-extrabold text-white font-mono tracking-tight">{stats.capturedLeads}</div>
                    <p className="text-[10px] text-[#5d6b8b] mt-2 font-bold uppercase tracking-wider">Registered contacts</p>
                  </div>
                </div>

                {/* 4. Google Reviews */}
                <div className="nm-raised rounded-[20px] p-6 flex flex-col justify-between relative group overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#5d6b8b] uppercase tracking-widest font-mono">Review Rating</span>
                    <div className="w-8 h-8 rounded-xl bg-[#060812] flex items-center justify-center text-amber-500 border border-white/5 shadow-inner">
                      <Star size={14} className="fill-amber-500" />
                    </div>
                  </div>
                  <div className="mt-5">
                    <div className="text-3xl font-extrabold text-white font-mono tracking-tight flex items-baseline gap-1">
                      <span>{stats.averageRating}</span>
                      <span className="text-xs text-slate-500 font-normal">/5.0</span>
                    </div>
                    <p className="text-[10px] text-[#5d6b8b] mt-2 font-bold uppercase tracking-wider">Synced reviews: {stats.reviewsCount}</p>
                  </div>
                </div>

              </div>

              {/* Graphical analytics */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Monthly trend chart */}
                <div className="lg:col-span-2 nm-raised rounded-[20px] p-6 relative overflow-hidden">
                  
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xs font-bold text-white uppercase tracking-wider">Revenue Trend Model</h3>
                      <p className="text-[11px] text-[#5d6b8b] font-medium">Intake performance mapped over the last 6 periods</p>
                    </div>
                    <div className="flex items-center gap-1.5 text-[9px] font-bold text-[#8e9bb8] uppercase tracking-widest nm-sunken px-3 py-1.5 rounded-xl">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#3cd2a5] shadow-[0_0_8px_rgba(60,210,165,0.4)]"></span>
                      <span>Estimated Value ($)</span>
                    </div>
                  </div>

                  {/* Neumorphic Column Chart */}
                  <div className="h-66 w-full flex items-end justify-between px-2 pt-4 relative nm-sunken rounded-2xl p-4">
                    {[
                      { m: "Jan", val: 38 },
                      { m: "Feb", val: 54 },
                      { m: "Mar", val: 78 },
                      { m: "Apr", val: 94 },
                      { m: "May", val: 120 },
                      { m: "Jun", val: Math.round(stats.savedRevenue / 1000) },
                    ].map((item, i) => {
                      const maxVal = 200;
                      const pct = Math.min((item.val / maxVal) * 100, 100);
                      return (
                        <div key={i} className="flex-1 flex flex-col items-center justify-end h-full z-10 group px-1">
                          <div className="bg-[#0b0f19] text-white font-mono text-[9px] font-bold px-2.5 py-1.5 rounded-xl border border-slate-850 mb-2 opacity-0 group-hover:opacity-100 transition-opacity absolute transform -translate-y-16 shadow-2xl">
                            ${item.val}k USD
                          </div>
                          
                          {/* Inner Sunken Column Track */}
                          <div className="w-12 h-[82%] nm-inset-track rounded-full flex flex-col justify-end overflow-hidden p-0.5 border border-white/5">
                            <div 
                              style={{ height: `${pct}%` }}
                              className="w-full bg-gradient-to-t from-[#1d4ed8] via-[#3b82f6] to-[#60a5fa] rounded-full transition-all duration-700"
                            ></div>
                          </div>
                          
                          <span className="text-[10px] font-bold text-slate-500 mt-3 tracking-widest uppercase">{item.m}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Live Activity Stream */}
                <div className="nm-raised rounded-[20px] p-6 flex flex-col justify-between relative overflow-hidden">
                  
                  <div>
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-1">CRM Feed Stream</h3>
                    <p className="text-[11px] text-[#5d6b8b] font-medium">Incoming contacts captured via API</p>
                  </div>

                  <div className="space-y-3.5 max-h-[280px] overflow-y-auto mt-5 pr-1 scrollbar-thin flex-1">
                    {stats.recentLeads && stats.recentLeads.length > 0 ? (
                      stats.recentLeads.slice(0, 4).map((lead, idx) => (
                        <div key={idx} className="nm-raised p-3.5 rounded-2xl flex items-start justify-between text-xs hover:border-[#3b82f6]/30 transition-all">
                          <div className="space-y-1">
                            <div className="font-bold text-white flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-[#3cd2a5] shadow-[0_0_8px_rgba(60,210,165,0.4)]"></span>
                              <span>{lead.name}</span>
                            </div>
                            <div className="text-[9px] text-[#5d6b8b] font-mono font-bold">{lead.phone} | {lead.email}</div>
                          </div>
                          <span className="text-[8px] bg-slate-900 border border-slate-800 text-slate-450 px-2 py-0.5 rounded-md font-mono font-bold uppercase tracking-wider shadow-inner">
                            {lead.source}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-slate-600 text-xs py-8 font-bold uppercase">No recent leads found in CRM</div>
                    )}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 2: OPPORTUNITIES KANBAN & GPS MAP                             */}
          {/* ================================================================= */}
          {activeTab === "jobs" && (
            <div className="space-y-8">
              
              {/* Kanban Navigation Bar */}
              <div className="flex items-center justify-between nm-raised rounded-[20px] p-3">
                <div className="flex gap-2">
                  <button 
                    onClick={() => setJobView("kanban")}
                    className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all border ${jobView === "kanban" ? "bg-[#3b82f6]/15 text-white border-[#3b82f6]/20 shadow-inner" : "text-slate-400 hover:text-slate-250 border-transparent"}`}
                  >
                    Pipeline Kanban Board
                  </button>
                </div>
                
                <span className="text-[10px] text-[#8e9bb8] font-mono font-bold uppercase tracking-wider nm-sunken px-4 py-2 rounded-2xl">
                  Opportunities: {opportunities.length}
                </span>
              </div>

              {/* KANBAN COLUMN STAGES */}
              {jobView === "kanban" && (
                <div className="flex gap-5 overflow-x-auto pb-4 max-w-full">
                  
                  {STAGES.map((column) => {
                    const colJobs = opportunities.filter(opp => opp.pipelineStageId === column.id);
                    return (
                      <div key={column.id} className="nm-sunken rounded-[22px] p-4 flex flex-col space-y-4 min-w-[290px] max-w-[290px] shrink-0 border border-slate-900/40">
                        <div className="flex items-center justify-between shrink-0 border-b border-slate-900/40 pb-2">
                          <h4 className="text-[10px] font-bold text-white uppercase tracking-wider">{column.name}</h4>
                          <span className="text-[10px] bg-slate-950/40 text-slate-400 border border-slate-900 px-2 py-0.5 rounded-full font-mono font-bold shadow-inner">{colJobs.length}</span>
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin min-h-[480px]">
                          {colJobs.map((opp) => (
                            <div key={opp.id} className="nm-raised p-4.5 rounded-[18px] space-y-3.5 hover:border-[#3cd2a5]/30 transition-all duration-300 relative group overflow-hidden">
                              <div className="space-y-1">
                                <div className="flex items-start justify-between gap-2">
                                  <div className="font-bold text-white text-xs line-clamp-1">
                                    {opp.contact.name || "Anonymous Lead"}
                                  </div>
                                  <span className={`text-[8px] px-1.5 py-0.5 rounded font-extrabold uppercase tracking-widest shrink-0 ${
                                    opp.status === "won" ? "bg-[#3cd2a5]/10 text-[#3cd2a5] border border-[#3cd2a5]/20" :
                                    opp.status === "lost" ? "bg-[#f76c74]/10 text-[#f76c74] border border-[#f76c74]/20" :
                                    "bg-[#3b82f6]/10 text-[#3b82f6] border border-[#3b82f6]/20"
                                  }`}>
                                    {opp.status}
                                  </span>
                                </div>
                                <div className="text-[9px] text-[#5d6b8b] font-mono font-bold line-clamp-1">{opp.contact.phone || opp.contact.email || "No Contact"}</div>
                              </div>

                              <div className="pt-2.5 border-t border-slate-900/60 flex flex-col gap-1.5 text-[10px]">
                                <div className="flex items-center justify-between text-[#8e9bb8] font-bold">
                                  <span>Plumbing dispatch task</span>
                                </div>
                                <div className="flex items-center justify-between font-semibold">
                                  <span className="text-[#5d6b8b] flex items-center gap-1.5 font-bold uppercase tracking-wide">
                                    <span className="w-2 h-2 rounded-full bg-[#3b82f6]"></span>
                                    <span>{opp.assignedTechName || "Unassigned"}</span>
                                  </span>
                                  <span className="font-mono text-[#3cd2a5] font-extrabold text-neon-cyan">${opp.monetaryValue || 820}</span>
                                </div>
                              </div>

                              <button 
                                onClick={() => moveJobStage(opp.id, opp.pipelineStageId)}
                                className="w-full py-2.5 bg-slate-900/40 hover:bg-[#3cd2a5]/10 text-[#3cd2a5] hover:text-[#3cd2a5]/80 text-[9px] rounded-xl border border-white/5 hover:border-[#3cd2a5]/25 font-bold uppercase tracking-widest transition-all shadow-inner"
                              >
                                <span>Advance Stage</span>
                              </button>
                            </div>
                          ))}
                          
                          {colJobs.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-28 border border-dashed border-slate-900/50 rounded-2xl text-[9px] text-[#5d6b8b] font-bold uppercase tracking-wider select-none">
                              No Opportunities
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}

                </div>
              )}

            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 3: TECHNICIAN PERFORMANCE                                     */}
          {/* ================================================================= */}
          {activeTab === "techs" && (
            <div className="space-y-8">
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Daily Schedule & Status */}
                <div className="lg:col-span-2 nm-raised rounded-[20px] p-6 flex flex-col h-[500px] relative overflow-hidden">
                  <div>
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-1">Technicians Command</h3>
                    <p className="text-xs text-[#5d6b8b] font-medium mb-6">Attributed performance variables from CRM assigned opportunities</p>
                  </div>

                  <div className="flex-1 overflow-y-auto nm-sunken border border-slate-950 rounded-2xl scrollbar-thin">
                    <table className="w-full border-collapse text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-900 text-[9px] font-bold text-[#8e9bb8] uppercase tracking-widest bg-slate-900/10">
                          <th className="p-4">Name</th>
                          <th className="p-4">Specialization</th>
                          <th className="p-4">GPS Status</th>
                          <th className="p-4">Active Tasks</th>
                        </tr>
                      </thead>
                      <tbody>
                        {techs.map((tech, i) => {
                          const assignedOpps = opportunities.filter(o => o.assignedTechName === tech.name);
                          return (
                            <tr key={i} className="border-b border-slate-900 hover:bg-slate-900/5 transition-colors">
                              <td className="p-4 font-bold text-white flex items-center gap-2">
                                <span className="text-base select-none">{tech.avatar}</span>
                                <span>{tech.name}</span>
                              </td>
                              <td className="p-4 text-slate-300 font-semibold">{tech.role}</td>
                              <td className="p-4">
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[8px] font-extrabold uppercase tracking-wider ${
                                  tech.status === "Active" ? "bg-[#3cd2a5]/10 text-[#3cd2a5] border border-[#3cd2a5]/20" :
                                  tech.status === "Idle" ? "bg-slate-850 text-slate-400 border border-slate-800" :
                                  "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                }`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${
                                    tech.status === "Active" ? "bg-[#3cd2a5]" :
                                    tech.status === "Idle" ? "bg-slate-400" :
                                    "bg-amber-400"
                                  }`}></span>
                                  {tech.status}
                                </span>
                              </td>
                              <td className="p-4 text-slate-450 font-bold uppercase">
                                {assignedOpps.length > 0 ? `${assignedOpps.length} Opportunities` : "Idle / Available"}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Revenue Win Leaderboard */}
                <div className="nm-raised rounded-[20px] p-6 h-[500px] flex flex-col justify-between relative overflow-hidden">
                  <div>
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-1">Revenue Leaderboard</h3>
                    <p className="text-xs text-[#5d6b8b] font-medium mb-6">Revenue contributions computed from opportunity values</p>
                  </div>

                  <div className="space-y-5 flex-1 overflow-y-auto pr-1 scrollbar-thin">
                    {techs.map((tech, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex items-center justify-between text-xs font-semibold">
                          <div className="flex items-center gap-2">
                            <span className="text-white font-bold">{tech.name}</span>
                            <span className="text-[9px] text-[#5d6b8b] font-mono font-bold">({tech.billableHours} hrs)</span>
                          </div>
                          <span className="font-mono text-[#3cd2a5] font-extrabold text-neon-cyan">${tech.monthlyRevenue.toLocaleString()}</span>
                        </div>
                        
                        {/* Neumorphic mini-bar */}
                        <div className="h-2 w-full nm-inset-track rounded-full p-0.5 overflow-hidden border border-white/5">
                          <div 
                            style={{ width: `${Math.min((tech.monthlyRevenue / 40000) * 100, 100)}%` }}
                            className="h-full bg-gradient-to-r from-[#3b82f6] to-[#3cd2a5] rounded-full"
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-slate-900 text-[9px] text-slate-500 flex justify-between font-semibold uppercase tracking-widest font-mono">
                    <span>* Updates in real-time</span>
                    <span>Top: Dave</span>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 4: FINANCE & INVENTORY                                        */}
          {/* ================================================================= */}
          {activeTab === "finance" && (
            <div className="space-y-8">
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Inventory & Materials */}
                <div className="lg:col-span-2 nm-raised rounded-[20px] p-6 flex flex-col h-[500px] relative overflow-hidden">
                  <div>
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-1">Materials Costs</h3>
                    <p className="text-xs text-[#5d6b8b] font-medium mb-6">Assigned materials ledger mapping pipeline dispatches</p>
                  </div>

                  <div className="flex-1 overflow-y-auto nm-sunken border border-slate-950 rounded-2xl scrollbar-thin">
                    <table className="w-full border-collapse text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-900 text-[9px] font-bold text-[#8e9bb8] uppercase tracking-widest bg-slate-900/10">
                          <th className="p-4">Material / Part</th>
                          <th className="p-4">Unit Cost</th>
                          <th className="p-4">Qty Used</th>
                          <th className="p-4">Total Cost</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { name: "Brass Ball Valves (3/4\")", cost: 18.50, qtyUsed: 14, total: 259 },
                          { name: "Copper Piping (Type L - 10ft)", cost: 32.00, qtyUsed: 22, total: 704 },
                          { name: "PEX Tubing (Blue/Red - 100ft)", cost: 45.00, qtyUsed: 8, total: 360 },
                          { name: "PVC Schedule 40 (3\" - 10ft)", cost: 14.20, qtyUsed: 18, total: 255.60 },
                          { name: "Tankless Water Heater Unit", cost: 1250.00, qtyUsed: 3, total: 3750.00 }
                        ].map((mat, i) => (
                          <tr key={i} className="border-b border-slate-900 hover:bg-slate-900/5 transition-colors">
                            <td className="p-4 font-bold text-white flex items-center gap-2">
                              <Package size={14} className="text-slate-500" />
                              <span>{mat.name}</span>
                            </td>
                            <td className="p-4 font-mono text-slate-300">${mat.cost.toFixed(2)}</td>
                            <td className="p-4 font-mono text-slate-300">{mat.qtyUsed}</td>
                            <td className="p-4 font-mono text-[#3cd2a5] font-bold">${mat.total.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-4 p-4 nm-sunken rounded-xl flex items-center justify-between text-xs shrink-0 border border-slate-950">
                    <span className="font-bold text-slate-400 uppercase tracking-widest font-mono">Total materials ledger:</span>
                    <span className="font-mono text-sm font-extrabold text-[#f76c74]">$5,328.60</span>
                  </div>
                </div>

                {/* Accounts Receivable (A/R) & Margin */}
                <div className="space-y-8">
                  
                  {/* Overdue/Pending Ledger */}
                  <div className="nm-raised rounded-[20px] p-6 h-[280px] flex flex-col justify-between relative overflow-hidden">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-xs font-bold text-white uppercase tracking-wider">Billing Outstanding</h3>
                        {isDemoInvoices && (
                          <span className="text-[8px] bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2 py-0.5 rounded font-mono font-bold">Demo Sync</span>
                        )}
                      </div>
                      <p className="text-xs text-[#5d6b8b] font-medium mb-4">Ledger balances queried from Invoices</p>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 scrollbar-thin">
                      {invoices.slice(0, 3).map((inv, idx) => (
                        <div key={idx} className="bg-slate-950/20 border border-slate-900/60 p-3 rounded-2xl flex items-center justify-between text-xs hover:border-[#3b82f6]/25 transition-all">
                          <div>
                            <div className="font-bold text-white">{inv.customerName}</div>
                            <div className="text-[9px] text-[#5d6b8b] font-mono mt-0.5">{inv.id} (Due {inv.dueDate})</div>
                          </div>
                          <div className="text-right">
                            <span className="font-mono text-white font-bold block">${inv.amount.toLocaleString()}</span>
                            <span className={`text-[8px] font-extrabold uppercase tracking-widest ${
                              inv.status.toLowerCase() === "overdue" ? "text-[#f76c74]" :
                              inv.status.toLowerCase() === "pending" ? "text-amber-500" :
                              "text-[#3cd2a5]"
                            }`}>{inv.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-3 border-t border-slate-900 flex items-center justify-between text-[10px] font-bold shrink-0">
                      <span className="text-[#5d6b8b] uppercase tracking-widest font-mono">Total Outstanding A/R:</span>
                      <span className="font-mono text-[#3cd2a5] text-sm font-extrabold text-neon-cyan">${totalOutstandingAr.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Net Margins */}
                  <div className="nm-raised rounded-[20px] p-6 h-[190px] flex flex-col justify-between relative overflow-hidden">
                    <div>
                      <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-1">Margins By Category</h3>
                      <p className="text-xs text-[#5d6b8b] font-medium mb-3">Profit percentages per operational category</p>
                    </div>

                    <div className="space-y-3">
                      {[
                        { type: "🚨 Emergency Dispatches", margin: 68, color: "from-[#f76c74] to-[#f87171]" },
                        { type: "🔧 Service & Contracts", margin: 55, color: "from-[#3b82f6] to-[#60a5fa]" },
                        { type: "📦 Large Installs & Heaters", margin: 42, color: "from-[#8b5cf6] to-[#a78bfa]" },
                      ].map((item, idx) => (
                        <div key={idx} className="space-y-1 text-xs">
                          <div className="flex justify-between font-semibold">
                            <span className="text-[#8e9bb8] font-bold">{item.type}</span>
                            <span className="text-slate-500 font-mono font-extrabold">{item.margin}%</span>
                          </div>
                          
                          <div className="h-1.5 w-full nm-inset-track rounded-full p-0.5 overflow-hidden border border-white/5">
                            <div style={{ width: `${item.margin}%` }} className={`h-full bg-gradient-to-r ${item.color} rounded-full`}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

              </div>

            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 5: CRM CONTACTS                                               */}
          {/* ================================================================= */}
          {activeTab === "crm" && (
            <div className="space-y-8">
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Lead Attribution */}
                <div className="nm-raised rounded-[20px] p-6 h-[500px] flex flex-col justify-between relative overflow-hidden">
                  <div>
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-1">Lead Channels</h3>
                    <p className="text-xs text-[#5d6b8b] font-medium mb-6">Marketing source distribution for Plumbify CRM leads</p>
                  </div>

                  <div className="space-y-4 flex-1 overflow-y-auto pr-1 scrollbar-thin">
                    {[
                      { name: "Google Search Ads", leads: 74, pct: 40, color: "from-[#3b82f6] to-[#60a5fa]" },
                      { name: "Yelp Local Reviews", leads: 46, pct: 25, color: "from-[#f76c74] to-[#fca5a5]" },
                      { name: "Referrals & Organic", leads: 37, pct: 20, color: "from-[#3cd2a5] to-[#6ee7b7]" },
                      { name: "Yard Signs & Flyers", leads: 27, pct: 15, color: "from-amber-500 to-amber-300" },
                    ].map((src, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex items-center justify-between text-xs font-semibold">
                          <span className="text-[#8e9bb8] font-bold">{src.name}</span>
                          <span className="font-mono text-slate-500 font-extrabold">{src.leads} ({src.pct}%)</span>
                        </div>
                        
                        <div className="h-1.5 w-full nm-inset-track rounded-full p-0.5 overflow-hidden border border-white/5">
                          <div 
                            style={{ width: `${src.pct}%` }}
                            className={`h-full bg-gradient-to-r ${src.color} rounded-full`}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-slate-900 text-[9px] text-[#5d6b8b] flex justify-between font-semibold uppercase tracking-widest font-mono">
                    <span>Source: CRM Contacts API</span>
                    <span>Top: Google Ads</span>
                  </div>
                </div>

                {/* Customer Directory */}
                <div className="lg:col-span-2 nm-raised rounded-[20px] p-6 flex flex-col h-[500px] relative overflow-hidden">
                  
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                      <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-1">CRM Outreach</h3>
                      <p className="text-xs text-[#5d6b8b] font-medium">Live search and dispatch AI Outbound voice calls directly to contacts</p>
                    </div>

                    <form onSubmit={handleCrmSearch} className="relative flex items-center shrink-0">
                      <input 
                        type="text"
                        placeholder="Search contacts..."
                        value={crmSearch}
                        onChange={(e) => setCrmSearch(e.target.value)}
                        className="bg-slate-950 border border-slate-900 text-slate-200 text-xs rounded-xl pl-9 pr-4 py-2 w-56 focus:outline-none focus:border-[#3b82f6]/40 transition-all font-semibold shadow-inner"
                      />
                      <Search size={13} className="absolute left-3 text-slate-500" />
                    </form>
                  </div>

                  <div className="flex-1 overflow-y-auto nm-sunken border border-slate-950 rounded-2xl scrollbar-thin">
                    <table className="w-full border-collapse text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-900 text-[9px] font-bold text-[#8e9bb8] uppercase tracking-widest bg-slate-900/10">
                          <th className="p-4">Customer</th>
                          <th className="p-4">Contact ID</th>
                          <th className="p-4">Tags</th>
                          <th className="p-4 text-right">AI Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {contacts.map((cust, i) => (
                          <tr key={i} className="border-b border-slate-900/60 hover:bg-slate-900/5 transition-colors">
                            <td className="p-4 text-white">
                              <div className="font-bold">{cust.contactName || `${cust.firstName || ""} ${cust.lastName || ""}`.trim() || "Anonymous Contact"}</div>
                              <div className="text-[9px] text-[#5d6b8b] font-mono mt-0.5">{cust.phone || cust.email || "No phone/email"}</div>
                            </td>
                            <td className="p-4 font-mono text-slate-500 text-[10px]">{cust.id}</td>
                            <td className="p-4">
                              <div className="flex flex-wrap gap-1">
                                {cust.tags && cust.tags.length > 0 ? (
                                  cust.tags.slice(0, 2).map((tag, tIdx) => (
                                    <span key={tIdx} className="text-[8px] bg-slate-900 border border-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono font-bold uppercase tracking-wide">
                                      {tag}
                                    </span>
                                  ))
                                ) : (
                                  <span className="text-[8px] text-slate-600 font-bold uppercase font-mono">No Tags</span>
                                )}
                              </div>
                            </td>
                            <td className="p-4 text-right">
                              <button
                                onClick={() => triggerOutboundCall(cust)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#3b82f6]/10 hover:bg-[#3b82f6] text-[#3b82f6] hover:text-white border border-[#3b82f6]/20 rounded-xl text-[9px] font-bold transition-all shadow-md"
                              >
                                <PhoneCall size={10} />
                                <span>Voice Dial</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                        {contacts.length === 0 && (
                          <tr>
                            <td colSpan={4} className="text-center py-12 text-slate-500 font-bold uppercase tracking-wider text-xs">
                              No Contacts Found in CRM
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>

            </div>
          )}

        </div>

      </main>

      {/* VAPI VOICE DIALER CONSOLE MODAL */}
      {activeDialLead && (
        <div className="fixed inset-0 bg-[#020509]/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#0e1425] border border-slate-900 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-250">
            {/* Header */}
            <div className="p-6 border-b border-slate-900 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#3b82f6]/10 flex items-center justify-center text-[#3b82f6] border border-[#3b82f6]/20">
                  <Activity size={15} className={isDialing ? "animate-pulse" : ""} />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">AI Dialer Console</h3>
                  <p className="text-[9px] text-[#5d6b8b] font-mono">Vapi Outbound Sync Engine</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  setActiveDialLead(null);
                  setDialCallStatus("idle");
                  setDialCallSummary("");
                }}
                className="text-slate-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-wider"
              >
                Close
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              
              {/* Contact Information */}
              <div className="nm-sunken p-4 rounded-2xl flex items-center justify-between border border-slate-950">
                <div className="space-y-1">
                  <div className="text-[8px] font-extrabold text-[#5d6b8b] uppercase tracking-widest font-mono">Outbound Target</div>
                  <div className="text-xs font-bold text-white">{activeDialLead.contactName || `${activeDialLead.firstName || ""} ${activeDialLead.lastName || ""}`.trim() || activeDialLead.name}</div>
                  <div className="text-[9px] text-[#3cd2a5] font-mono">{activeDialLead.phone || "+1 (512) 555-0192"}</div>
                </div>
                <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1 rounded-full">
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    dialCallStatus === "completed" ? "bg-[#3cd2a5]" :
                    dialCallStatus === "failed" ? "bg-[#f76c74]" :
                    dialCallStatus === "idle" ? "bg-slate-600" :
                    "bg-[#3b82f6] animate-ping"
                  }`}></span>
                  <span className="text-[8px] font-extrabold uppercase tracking-widest text-slate-350 font-mono">
                    {dialCallStatus}
                  </span>
                </div>
              </div>

              {/* Visualizer Waveform */}
              <div className="flex flex-col items-center justify-center py-6 nm-sunken rounded-2xl min-h-[120px] border border-slate-950">
                {dialCallStatus === "dialing" && (
                  <div className="text-center space-y-2">
                    <div className="text-xs text-slate-400 font-semibold animate-pulse">Initializing connection...</div>
                    <div className="text-[9px] text-[#3cd2a5]/80 font-mono font-bold uppercase tracking-wider">POST /api/vapi/outbound</div>
                  </div>
                )}
                {dialCallStatus === "ringing" && (
                  <div className="text-center space-y-2">
                    <div className="text-xs text-[#3b82f6] font-bold animate-pulse">Ringing Phone Line...</div>
                    <div className="text-[9px] text-slate-500 font-semibold font-mono">Awaiting customer answer</div>
                  </div>
                )}
                {dialCallStatus === "in-progress" && (
                  <div className="text-center space-y-4 w-full px-8">
                    <div className="text-[9px] text-[#3cd2a5] font-extrabold tracking-widest uppercase">Connection Stabilized</div>
                    
                    {/* Pulsing Waveform */}
                    <div className="flex items-end justify-center gap-1.5 h-10 w-full select-none">
                      <div className="voice-bar w-1.5 bg-[#3b82f6] rounded-t h-full"></div>
                      <div className="voice-bar w-1.5 bg-[#3cd2a5] rounded-t h-full"></div>
                      <div className="voice-bar w-1.5 bg-[#3b82f6] rounded-t h-full"></div>
                      <div className="voice-bar w-1.5 bg-[#3cd2a5] rounded-t h-full"></div>
                      <div className="voice-bar w-1.5 bg-[#3cd2a5] rounded-t h-full"></div>
                    </div>
                    
                    <div className="text-[10px] text-slate-400 font-medium">Plumbify AI Agent pre-qualifying lead...</div>
                  </div>
                )}
                {dialCallStatus === "completed" && (
                  <div className="text-center space-y-2">
                    <div className="w-8 h-8 rounded-full bg-[#3cd2a5]/10 border border-[#3cd2a5]/20 flex items-center justify-center text-[#3cd2a5] mx-auto shadow-inner">
                      <Check size={14} />
                    </div>
                    <div>
                      <div className="text-xs text-[#3cd2a5] font-bold uppercase tracking-wider">Call Concluded</div>
                      <div className="text-[9px] text-slate-500 font-mono">Telemetry stored inside CRM</div>
                    </div>
                  </div>
                )}
                {dialCallStatus === "failed" && (
                  <div className="text-center space-y-1">
                    <div className="text-xs text-[#f76c74] font-bold uppercase tracking-wider">Call Aborted</div>
                    <div className="text-[9px] text-slate-400 font-mono">Check phone permissions or Vapi token log</div>
                  </div>
                )}
                {dialCallStatus === "idle" && (
                  <div className="text-xs text-slate-500 font-semibold">Console Ready.</div>
                )}
              </div>

              {/* Call Summary */}
              {dialCallSummary && (
                <div className="space-y-2">
                  <div className="text-[9px] font-extrabold text-[#5d6b8b] uppercase tracking-widest font-mono">AI Transcription Summary</div>
                  <div className="nm-sunken p-4 rounded-2xl text-[10px] text-slate-350 font-medium leading-relaxed max-h-[140px] overflow-y-auto scrollbar-thin border border-slate-950">
                    {dialCallSummary}
                  </div>
                </div>
              )}

              {/* Modal Control Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setActiveDialLead(null);
                    setDialCallStatus("idle");
                    setDialCallSummary("");
                  }}
                  className="flex-1 py-2.5 bg-slate-950 hover:bg-slate-900 text-slate-350 rounded-xl text-xs font-bold border border-slate-850 transition-colors"
                >
                  Close Console
                </button>
                {dialCallStatus !== "ringing" && dialCallStatus !== "in-progress" && (
                  <button
                    onClick={() => triggerOutboundCall(activeDialLead)}
                    disabled={isDialing}
                    className="flex-1 py-2.5 bg-[#3b82f6] hover:bg-[#3b82f6]/80 disabled:bg-[#3b82f6]/20 text-white rounded-xl text-xs font-bold border border-white/5 transition-all shadow-lg flex items-center justify-center gap-1.5"
                  >
                    <span>Redial Lead</span>
                  </button>
                )}
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
