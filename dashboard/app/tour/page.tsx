"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Phone, 
  MessageSquare, 
  CheckCircle, 
  RefreshCcw, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  Send, 
  Users, 
  Calendar, 
  Star, 
  MessageCircle, 
  Bell, 
  Settings, 
  MapPin, 
  ShieldAlert, 
  ArrowRight,
  Database,
  Search,
  Plus,
  BarChart3,
  GitBranch,
  TrendingUp,
  Inbox,
  User,
  ExternalLink,
  Laptop,
  CheckCircle2
} from "lucide-react";

// Message structure for chat simulator
interface SMSMessage {
  sender: "ai" | "user" | "system";
  text: string;
  timestamp: string;
}

export default function ProductTour() {
  // Navigation & UI States
  const [activeTab, setActiveTab] = useState<"dashboard" | "conversations" | "automation" | "calendar" | "reputation" | "settings">("dashboard");
  const [phoneOpen, setPhoneOpen] = useState(true);
  
  // Onboarding Walkthrough Steps
  const [tourStep, setTourStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  // Phone Simulation State
  const [phoneState, setPhoneState] = useState<"idle" | "calling" | "missed" | "chatting" | "success">("idle");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [chatMessages, setChatMessages] = useState<SMSMessage[]>([]);
  const [chatStep, setChatStep] = useState(1);
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Review Automation State
  const [customerRating, setCustomerRating] = useState(5);
  const [reviewSent, setReviewSent] = useState(false);
  const [reviewLog, setReviewLog] = useState<string[]>([]);
  const [reviewShowLink, setReviewShowLink] = useState(false);

  // Dashboard Stats
  const [stats, setStats] = useState({
    capturedLeads: 184,
    savedRevenue: 150880,
    responseTime: "4.8 seconds",
    reviewsCount: 98,
    averageRating: 4.87,
    activeTechs: 8,
    jobsDispatched: 312
  });
  const [recentLeads, setRecentLeads] = useState<any[]>([]);

  // Fetch stats from GoHighLevel endpoint
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/dashboard-stats");
        if (res.ok) {
          const data = await res.json();
          setStats({
            capturedLeads: data.capturedLeads,
            savedRevenue: data.savedRevenue,
            responseTime: data.responseTime,
            reviewsCount: data.reviewsCount,
            averageRating: data.averageRating,
            activeTechs: data.activeTechs,
            jobsDispatched: data.jobsDispatched
          });
          if (data.recentLeads) {
            setRecentLeads(data.recentLeads);
          }
        }
      } catch (e) {
        console.error("Failed to fetch GHL dashboard stats, falling back to mock ticker:", e);
        // Fallback ticker
        const interval = setInterval(() => {
          setStats(prev => {
            const incrementLeads = Math.random() > 0.85 ? 1 : 0;
            const newLeads = prev.capturedLeads + incrementLeads;
            return {
              ...prev,
              capturedLeads: newLeads,
              savedRevenue: newLeads * 820,
              reviewsCount: prev.reviewsCount + (Math.random() > 0.95 ? 1 : 0),
              jobsDispatched: prev.jobsDispatched + (Math.random() > 0.9 ? 1 : 0)
            };
          });
        }, 10000);
        return () => clearInterval(interval);
      }
    };
    fetchStats();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isTyping]);

  const resetPhoneDemo = () => {
    setPhoneState("idle");
    setChatMessages([]);
    setChatStep(1);
    setChatInput("");
    setIsTyping(false);
  };

  // Trigger missed call
  const triggerMissedCall = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneState !== "idle") return;

    setPhoneState("calling");
    
    // Simulate ring -> Missed
    await new Promise(r => setTimeout(r, 2000));
    setPhoneState("missed");

    // Capture missed call and get first text from Go API or local fallback
    await new Promise(r => setTimeout(r, 1200));
    setPhoneState("chatting");
    setIsTyping(true);

    try {
      const res = await fetch("http://localhost:8080/api/tour/simulate-call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phoneNumber || "+1 (555) 019-2834" })
      });
      
      const data = await res.json();
      setIsTyping(false);
      setChatMessages([
        { sender: "system", text: "📞 Missed call logged", timestamp: formatTime() },
        { sender: "ai", text: data.autoResponse || "Hi, this is Plumbify! Sorry we missed your call. Need an emergency plumber?", timestamp: formatTime() }
      ]);
      
      // Complete step 1 of onboarding
      completeStep(1);
      setTourStep(2); // Auto advance to Conversations tab step
    } catch (err) {
      setIsTyping(false);
      setChatMessages([
        { sender: "system", text: "📞 Missed call logged", timestamp: formatTime() },
        { sender: "ai", text: "Hi, this is Plumbify! Sorry we missed your call. Need an emergency plumber?", timestamp: formatTime() }
      ]);
      completeStep(1);
      setTourStep(2);
    }
  };

  // Quick Reply handler
  const sendSMSMessage = async (text: string) => {
    if (isTyping) return;

    // Add user message to state
    const updatedMessages = [...chatMessages, { sender: "user" as const, text, timestamp: formatTime() }];
    setChatMessages(updatedMessages);
    setIsTyping(true);

    const stepToSend = chatStep;
    setChatStep(prev => prev + 1);

    try {
      const res = await fetch("http://localhost:8080/api/tour/simulate-sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: phoneNumber || "+1 (555) 019-2834",
          message: text,
          step: stepToSend
        })
      });

      const data = await res.json();
      
      // Typings delay
      await new Promise(r => setTimeout(r, 1000));
      setIsTyping(false);

      setChatMessages(prev => [
        ...prev, 
        { sender: "ai", text: data.text, timestamp: formatTime() }
      ]);

      if (data.captured) {
        await new Promise(r => setTimeout(r, 1000));
        setPhoneState("success");
        setStats(prev => ({
          ...prev,
          capturedLeads: prev.capturedLeads + 1,
          savedRevenue: prev.savedRevenue + 850
        }));
        completeStep(2);
        setTourStep(3);
      } else {
        setChatStep(data.nextStep);
      }

    } catch (err) {
      // Local Fallback simulation logic
      await new Promise(r => setTimeout(r, 1000));
      setIsTyping(false);

      let replyText = "";
      let isFinal = false;
      let nextS = stepToSend + 1;

      if (stepToSend === 1) {
        replyText = "Oh no! We can get a master plumber dispatched immediately. Is today at 2 PM or 4 PM better for you?";
        nextS = 2;
      } else if (stepToSend === 2) {
        replyText = "Perfect, we've blocked out that slot. What address should we send our technician to?";
        nextS = 3;
      } else if (stepToSend === 3) {
        replyText = "Got it! Technician Dave is assigned to your job and will head over. He'll text you when he's 15 mins out. You're all set!";
        isFinal = true;
      }

      setChatMessages(prev => [
        ...prev,
        { sender: "ai", text: replyText, timestamp: formatTime() }
      ]);

      if (isFinal) {
        await new Promise(r => setTimeout(r, 1000));
        setPhoneState("success");
        setStats(prev => ({
          ...prev,
          capturedLeads: prev.capturedLeads + 1,
          savedRevenue: prev.savedRevenue + 850
        }));
        completeStep(2);
        setTourStep(3);
      } else {
        setChatStep(nextS);
      }
    }
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isTyping) return;
    const text = chatInput;
    setChatInput("");
    sendSMSMessage(text);
  };

  // Review simulator handler
  const triggerReviewSimulation = async () => {
    setReviewSent(true);
    setReviewLog(prev => [...prev, "🔄 Sending automated SMS feedback request..."]);

    await new Promise(r => setTimeout(r, 1000));

    try {
      const res = await fetch("http://localhost:8080/api/tour/simulate-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: "+1 (555) 019-2834",
          rating: customerRating
        })
      });
      
      const data = await res.json();
      
      if (data.status === "success") {
        setReviewLog(prev => [
          ...prev,
          "✅ Customer replied with 5 stars!",
          `🔗 Plumbify routed them to: ${data.reviewLink}`,
          "🎉 New 5-Star review published on Google!"
        ]);
        setReviewShowLink(true);
        setStats(prev => ({
          ...prev,
          reviewsCount: prev.reviewsCount + 1,
          averageRating: parseFloat(((prev.averageRating * prev.reviewsCount + 5) / (prev.reviewsCount + 1)).toFixed(2))
        }));
      } else {
        setReviewLog(prev => [
          ...prev,
          `⚠️ Customer gave private feedback: ${customerRating} stars.`,
          "🛡️ Review kept private! Plumbify blocked public post and alerted manager.",
          "✉️ Notification sent to business owner: 'Follow-up requested.'"
        ]);
        setReviewShowLink(false);
      }
      completeStep(4);
    } catch (e) {
      if (customerRating >= 4) {
        setReviewLog(prev => [
          ...prev,
          "✅ Customer replied with 5 stars!",
          "🔗 Plumbify routed them to Google Maps review link",
          "🎉 New 5-Star review published on Google!"
        ]);
        setReviewShowLink(true);
        setStats(prev => ({
          ...prev,
          reviewsCount: prev.reviewsCount + 1
        }));
      } else {
        setReviewLog(prev => [
          ...prev,
          `⚠️ Customer gave private feedback: ${customerRating} stars.`,
          "🛡️ Review kept private! Plumbify blocked public post and alerted manager.",
          "✉️ Notification sent to business owner: 'Follow-up requested.'"
        ]);
        setReviewShowLink(false);
      }
      completeStep(4);
    }
  };

  const resetReviewDemo = () => {
    setReviewSent(false);
    setReviewLog([]);
    setReviewShowLink(false);
  };

  const completeStep = (step: number) => {
    if (!completedSteps.includes(step)) {
      setCompletedSteps(prev => [...prev, step]);
    }
  };

  const formatTime = () => {
    const d = new Date();
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="w-screen h-screen flex bg-slate-950 text-slate-100 font-sans overflow-hidden select-none">
      
      {/* 1. LEFT SIDEBAR (DARK, GHL-REPLICA) */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between z-10">
        <div>
          {/* Brand Header */}
          <div className="h-16 px-6 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-black text-white text-base tracking-tighter">P</div>
              <span className="font-black text-xl tracking-tight text-white">PLUMBIFY</span>
            </div>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/25 text-blue-400 font-bold">V1.2</span>
          </div>

          {/* Location Selector Simulator */}
          <div className="p-4 border-b border-slate-800">
            <div className="text-[9px] text-slate-500 font-black uppercase tracking-wider mb-1">LOCATION WORKSPACE</div>
            <div className="p-2 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between cursor-pointer hover:border-slate-700 transition-colors">
              <div className="truncate pr-2">
                <div className="text-xs font-bold text-slate-200 truncate">Apex Plumbing (Austin)</div>
                <div className="text-[9px] text-slate-500">Sub-Account Sandbox</div>
              </div>
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            </div>
          </div>

          {/* Sidebar Navigation Items */}
          <nav className="p-3 space-y-1">
            <button 
              onClick={() => { setActiveTab("dashboard"); setTourStep(1); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-left transition-all ${activeTab === "dashboard" ? "bg-blue-600 text-white shadow-lg shadow-blue-500/10" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`}
            >
              <BarChart3 size={16} /> Dashboard
            </button>
            <button 
              onClick={() => { setActiveTab("conversations"); if (tourStep === 2) setTourStep(2); }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-left transition-all ${activeTab === "conversations" ? "bg-blue-600 text-white shadow-lg shadow-blue-500/10" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`}
            >
              <div className="flex items-center gap-3">
                <Inbox size={16} /> Conversations
              </div>
              {(phoneState === "calling" || phoneState === "missed" || phoneState === "chatting") && (
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping"></span>
              )}
            </button>
            <button 
              onClick={() => { setActiveTab("automation"); setTourStep(3); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-left transition-all ${activeTab === "automation" ? "bg-blue-600 text-white shadow-lg shadow-blue-500/10" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`}
            >
              <GitBranch size={16} /> Automation Flows
            </button>
            <button 
              onClick={() => { setActiveTab("calendar"); setTourStep(5); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-left transition-all ${activeTab === "calendar" ? "bg-blue-600 text-white shadow-lg shadow-blue-500/10" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`}
            >
              <Calendar size={16} /> Calendar & Dispatch
            </button>
            <button 
              onClick={() => { setActiveTab("reputation"); setTourStep(4); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-left transition-all ${activeTab === "reputation" ? "bg-blue-600 text-white shadow-lg shadow-blue-500/10" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`}
            >
              <Star size={16} /> Reputation (Reviews)
            </button>
            <button 
              onClick={() => setActiveTab("settings")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-left transition-all ${activeTab === "settings" ? "bg-blue-600 text-white shadow-lg shadow-blue-500/10" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`}
            >
              <Settings size={16} /> API Integration Settings
            </button>
          </nav>
        </div>

        {/* Saved Revenue Indicator widget */}
        <div className="p-4 m-4 rounded-2xl bg-slate-950 border border-slate-850">
          <div className="flex justify-between items-center text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-1">
            <span>SAVED REVENUE</span>
            <TrendingUp size={10} className="text-emerald-500" />
          </div>
          <div className="text-xl font-black text-emerald-400">{formatCurrency(stats.savedRevenue)}</div>
          <div className="text-[8px] text-slate-500 mt-1 flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-emerald-400"></span> Synced with Twilio/WeChat API
          </div>
        </div>
      </aside>

      {/* 2. MAIN APP CONTAINER (HEADER + WORKSPACE CONTENT) */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        
        {/* Top Navbar Header */}
        <header className="h-16 bg-slate-900 border-b border-slate-800 px-6 flex justify-between items-center z-10">
          <div className="flex items-center gap-3 text-xs font-bold text-slate-400">
            <div className="flex items-center gap-1.5">
              <Database size={12} className="text-blue-500" />
              <span>API Gateway Status:</span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-mono font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span> ONLINE
              </span>
            </div>
          </div>
          
          {/* Top Actions */}
          <div className="flex items-center gap-4 text-slate-400">
            <div className="hidden sm:flex gap-3 text-[10px] text-slate-400">
              <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-500">Leads Saved: </span>
                <span className="font-bold text-white font-mono">{stats.capturedLeads}</span>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-500">Avg Speed: </span>
                <span className="font-bold text-blue-400 font-mono">{stats.responseTime}</span>
              </div>
            </div>

            <button 
              onClick={() => setPhoneOpen(prev => !prev)}
              className={`px-3 py-1.5 rounded-xl border text-[10px] font-bold flex items-center gap-1.5 transition-colors ${phoneOpen ? "bg-blue-600 border-blue-500 text-white" : "bg-slate-950 border-slate-800 hover:text-white"}`}
            >
              <Phone size={12} /> {phoneOpen ? "Hide Customer Phone" : "Show Customer Phone"}
            </button>
            <Bell size={16} className="hover:text-white cursor-pointer" />
            <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-slate-200">AP</div>
          </div>
        </header>

        {/* Dynamic App Workspace */}
        <main className="flex-1 overflow-y-auto p-6 relative">
          
          {/* TAB 1: DASHBOARD VIEW */}
          {activeTab === "dashboard" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-black text-white flex items-center gap-2">
                    Dashboard Overview
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                  </h1>
                  <p className="text-xs text-slate-500">Live sub-account metrics and auto-pilot lead statistics synced with GoHighLevel</p>
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800/80 shadow-xl relative overflow-hidden group hover:border-slate-700/60 transition-all duration-300">
                  <div className="absolute top-0 left-0 w-1 h-full bg-blue-600"></div>
                  <div className="text-[9px] text-slate-500 font-black uppercase tracking-wider">Captured Leads (GHL)</div>
                  <div className="text-3xl font-black text-white mt-1.5 font-mono">{stats.capturedLeads}</div>
                  <div className="text-[9px] text-emerald-400 mt-1.5 flex items-center gap-1 font-bold">
                    ▲ 18.2% <span className="text-slate-500 font-normal">vs last month</span>
                  </div>
                </div>
                <div className="p-5 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800/80 shadow-xl relative overflow-hidden group hover:border-slate-700/60 transition-all duration-300">
                  <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
                  <div className="text-[9px] text-slate-500 font-black uppercase tracking-wider">Revenue Captured (GHL)</div>
                  <div className="text-3xl font-black text-emerald-400 mt-1.5 font-mono">{formatCurrency(stats.savedRevenue)}</div>
                  <div className="text-[9px] text-slate-500 mt-1.5">Avg plumbing ticket: $820</div>
                </div>
                <div className="p-5 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800/80 shadow-xl relative overflow-hidden group hover:border-slate-700/60 transition-all duration-300">
                  <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
                  <div className="text-[9px] text-slate-500 font-black uppercase tracking-wider">Google Review Average</div>
                  <div className="text-3xl font-black text-amber-500 mt-1.5 font-mono flex items-center gap-1.5">
                    {stats.averageRating} <Star size={18} className="fill-current text-amber-500" />
                  </div>
                  <div className="text-[9px] text-slate-500 mt-1.5">{stats.reviewsCount} Google Map reviews</div>
                </div>
                <div className="p-5 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800/80 shadow-xl relative overflow-hidden group hover:border-slate-700/60 transition-all duration-300">
                  <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                  <div className="text-[9px] text-slate-500 font-black uppercase tracking-wider">AI Lead Response Time</div>
                  <div className="text-3xl font-black text-blue-400 mt-1.5 font-mono">{stats.responseTime}</div>
                  <div className="text-[9px] text-blue-400 mt-1.5 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping"></span> Auto-pilot active
                  </div>
                </div>
              </div>

              {/* Grid 3 Cols: Lead Source chart + GHL Feed + Activity Feed */}
              <div className="grid lg:grid-cols-12 gap-6">
                
                {/* Simulated Lead Sources chart */}
                <div className="lg:col-span-4 p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800/80 shadow-xl flex flex-col justify-between min-h-[290px] relative overflow-hidden group hover:border-slate-700/60 transition-all duration-300">
                  <div>
                    <h3 className="text-sm font-black text-white mb-1">Omnichannel Lead Distribution</h3>
                    <p className="text-[10px] text-slate-500 mb-4">Real-time leads integrated from all connected APIs</p>
                  </div>
                  <div className="space-y-2.5">
                    <div>
                      <div className="flex justify-between items-center text-[10px] font-bold mb-1">
                        <span className="text-slate-300">Missed Call Text-Back (Twilio)</span>
                        <span className="font-mono text-blue-400">52%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden p-[1px] border border-slate-850">
                        <div className="h-full bg-blue-600 rounded-full" style={{ width: "52%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center text-[10px] font-bold mb-1">
                        <span className="text-slate-300">WeChat / WeCom gateway</span>
                        <span className="font-mono text-emerald-400">28%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden p-[1px] border border-slate-850">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: "28%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center text-[10px] font-bold mb-1">
                        <span className="text-slate-300">Google Local Service Ads</span>
                        <span className="font-mono text-amber-500">14%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden p-[1px] border border-slate-850">
                        <div className="h-full bg-amber-500 rounded-full" style={{ width: "14%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center text-[10px] font-bold mb-1">
                        <span className="text-slate-300">Facebook Leads & Emails</span>
                        <span className="font-mono text-slate-400">6%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden p-[1px] border border-slate-850">
                        <div className="h-full bg-slate-600 rounded-full" style={{ width: "6%" }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Live GHL Sync Feed card */}
                <div className="lg:col-span-4 p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800/80 shadow-2xl relative overflow-hidden group hover:border-slate-700/60 transition-all duration-300 flex flex-col justify-between min-h-[290px]">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-blue-500/10 transition-all duration-300"></div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="text-sm font-black text-white flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        Live GHL Contacts Feed
                      </h3>
                      <span className="text-[8px] font-black px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase font-mono tracking-wider">GHL CRM</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mb-3">Real-time sync from GoHighLevel Location</p>
                  </div>

                  <div className="space-y-2 max-h-[175px] overflow-y-auto pr-1 scrollbar-none flex-1">
                    {recentLeads && recentLeads.length > 0 ? (
                      recentLeads.map((lead) => (
                        <div key={lead.id} className="p-2 rounded-xl bg-slate-950/60 border border-slate-850 hover:border-slate-800 transition-all flex items-center justify-between gap-2.5">
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-slate-200 truncate max-w-[100px]">{lead.name}</span>
                              <span className="text-[7.5px] font-bold px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800/50 uppercase font-mono truncate max-w-[70px]">
                                {lead.source}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 mt-0.5 text-[8.5px] text-slate-500 font-mono">
                              <span className="truncate">{lead.phone}</span>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-[8.5px] font-bold text-slate-500 font-mono">{lead.date}</span>
                            <div className="flex gap-1 mt-1 justify-end">
                              {lead.tags && lead.tags.map((tag: string, idx: number) => (
                                <span key={idx} className="text-[7px] font-black px-1 bg-blue-600/10 text-blue-400 rounded-full border border-blue-500/10 lowercase">
                                  #{tag.length > 10 ? tag.slice(0, 8) + ".." : tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-12 text-center text-[10px] text-slate-500 font-bold">
                        No contacts found. Register a lead to sync in real-time.
                      </div>
                    )}
                  </div>
                </div>

                {/* Live System Log card */}
                <div className="lg:col-span-4 p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800/80 shadow-2xl relative overflow-hidden group hover:border-slate-700/60 transition-all duration-300 flex flex-col justify-between min-h-[290px]">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-blue-500/10 transition-all duration-300"></div>
                  <div>
                    <h3 className="text-sm font-black text-white mb-1">Live Automation System Log</h3>
                    <p className="text-[10px] text-slate-500 mb-3">Real-time background agent dispatches</p>
                  </div>
                  <div className="space-y-2 max-h-[175px] overflow-y-auto pr-1 scrollbar-none flex-1">
                    <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-850 flex items-center justify-between gap-3 text-[9px] font-mono text-slate-300 hover:border-slate-800 transition-all">
                      <div>
                        <span className="text-blue-400 font-bold">[Auto-Pilot]</span> Dispatch Dave: Burst pipe
                        <div className="text-slate-500 mt-0.5">Elm St (austin_zone_1)</div>
                      </div>
                      <span className="text-emerald-400 font-bold font-sans shrink-0">+$820</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-850 flex items-center justify-between gap-3 text-[9px] font-mono text-slate-300 hover:border-slate-800 transition-all">
                      <div>
                        <span className="text-amber-500 font-bold">[Review Boost]</span> 5⭐ review from Robert K.
                        <div className="text-slate-500 mt-0.5">Synced with Google API</div>
                      </div>
                      <span className="text-amber-500 font-sans font-bold shrink-0">5 Stars</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-850 flex items-center justify-between gap-3 text-[9px] font-mono text-slate-300 hover:border-slate-800 transition-all">
                      <div>
                        <span className="text-emerald-500 font-bold">[WeChat Gate]</span> Sync lead "Zhang Wei"
                        <div className="text-slate-500 mt-0.5">Translated: "Need hot water fix"</div>
                      </div>
                      <span className="text-slate-500 shrink-0">Logged</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 2: CONVERSATIONS (UNIFIED INBOX) */}
          {activeTab === "conversations" && (
            <div className="h-full flex flex-col gap-4 animate-in fade-in duration-200">
              
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-black text-white">Unified Inbox</h1>
                  <p className="text-xs text-slate-500">Manage all customer SMS, WeChat, and Email communications in one thread</p>
                </div>
              </div>

              {/* 3-Column GHL-replica workspace */}
              <div className="flex-1 min-h-[480px] grid grid-cols-12 gap-4 items-stretch overflow-hidden">
                
                {/* Column 1: Threads List (3 cols) */}
                <div className="col-span-3 bg-slate-900 border border-slate-800 rounded-2xl p-2.5 space-y-1 overflow-y-auto scrollbar-none">
                  <div className="text-[9px] text-slate-500 font-black px-2 py-1.5 uppercase tracking-wider">OPEN CONVERSATIONS</div>
                  
                  {/* John Doe Thread (Interactive) */}
                  <div className={`p-2 rounded-xl transition-all border cursor-pointer ${phoneState !== "idle" ? "bg-slate-800 border-slate-700" : "bg-slate-950/40 border-transparent hover:bg-slate-850"}`}>
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-bold text-white">John Doe</span>
                      <span className="text-[8px] font-bold px-1.5 bg-blue-500/10 text-blue-400 rounded border border-blue-500/25 uppercase font-mono">SMS</span>
                    </div>
                    <div className="text-[10px] text-slate-400 truncate mt-0.5">
                      {chatMessages.length > 0 ? chatMessages[chatMessages.length - 1].text : "Ready for call simulation..."}
                    </div>
                  </div>

                  {/* Zhang Wei Thread (Mock) */}
                  <div className="p-2 rounded-xl bg-slate-950/40 border border-transparent hover:bg-slate-850 cursor-pointer transition-all">
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-bold text-slate-300">Zhang Wei</span>
                      <span className="text-[8px] font-bold px-1.5 bg-emerald-500/10 text-emerald-400 rounded border border-emerald-500/25 uppercase font-mono">WeChat</span>
                    </div>
                    <div className="text-[10px] text-slate-500 truncate mt-0.5">需要热水器报价和上门维修...</div>
                  </div>

                  {/* Mark Thread (Mock) */}
                  <div className="p-2 rounded-xl bg-slate-950/40 border border-transparent hover:bg-slate-850 cursor-pointer transition-all">
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-bold text-slate-300">Mark R.</span>
                      <span className="text-[8px] font-bold px-1.5 bg-orange-500/10 text-orange-400 rounded border border-orange-500/25 uppercase font-mono">Google Ad</span>
                    </div>
                    <div className="text-[10px] text-slate-500 truncate mt-0.5">Requested quotes for drainage clearing...</div>
                  </div>
                </div>

                {/* Column 2: Chat View (6 cols) */}
                <div className="col-span-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col justify-between overflow-hidden relative">
                  
                  {/* Chat header */}
                  <div className="p-4 bg-slate-950/40 border-b border-slate-800 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs">JD</div>
                      <div>
                        <div className="text-xs font-black text-white">John Doe</div>
                        <div className="text-[9px] text-slate-400 font-mono">Conversation ID: con_9d28e1823</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      <span className="text-[10px] text-emerald-400 font-bold uppercase font-mono">SMS Channel Active</span>
                    </div>
                  </div>

                  {/* Chat messages thread */}
                  <div className="flex-1 p-4 overflow-y-auto space-y-3 scrollbar-none">
                    {chatMessages.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500 font-bold">
                        <Inbox size={32} className="mb-2 opacity-55 text-blue-500" />
                        No Active Messages.
                        <p className="text-[10px] font-normal text-slate-500 mt-2 max-w-xs">
                          Open the phone simulator in the bottom right corner and click "Simulate Missed Call" to start.
                        </p>
                      </div>
                    ) : (
                      chatMessages.map((msg, i) => (
                        <div key={i} className={`flex flex-col ${msg.sender === "user" ? "items-end" : msg.sender === "system" ? "items-center" : "items-start"}`}>
                          {msg.sender === "system" ? (
                            <div className="bg-slate-950 text-[8px] text-slate-500 border border-slate-850 px-2 py-0.5 rounded font-mono uppercase tracking-wider my-1">
                              {msg.text}
                            </div>
                          ) : (
                            <div className={`max-w-[80%] p-3 rounded-2xl text-xs leading-relaxed ${msg.sender === "user" ? "bg-blue-600 text-white rounded-br-none" : "bg-slate-950 text-slate-200 rounded-bl-none border border-slate-800"}`}>
                              {msg.text}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                    
                    {isTyping && (
                      <div className="bg-slate-950 p-2.5 rounded-2xl rounded-bl-none border border-slate-800 text-slate-400 self-start animate-pulse text-[10px] flex items-center gap-1.5 font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce"></span>
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce delay-100"></span>
                        <span>Plumbify AI typing reply...</span>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>

                  {/* AI Draft helper / Input box */}
                  <div className="p-4 bg-slate-950/40 border-t border-slate-800 space-y-3">
                    
                    {/* Draft Box */}
                    {phoneState === "chatting" && chatMessages.length > 0 && (
                      <div className="p-2.5 rounded-xl bg-blue-500/5 border border-blue-500/15 flex justify-between items-start text-[10px] text-blue-200">
                        <div className="pr-4 leading-relaxed">
                          <span className="font-black text-blue-400 block mb-0.5">🤖 PLUMBIFY AI DRAFT ASSISTANT</span>
                          {currentSuggestedReply(chatStep)}
                        </div>
                        <button 
                          onClick={() => {
                            const text = currentSuggestedReply(chatStep);
                            sendSMSMessage(text);
                          }}
                          className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[9px] font-bold uppercase transition-colors shrink-0"
                        >
                          Use Draft
                        </button>
                      </div>
                    )}

                    {/* Manual Send form */}
                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!chatInput.trim() || isTyping) return;
                        sendSMSMessage(chatInput);
                        setChatInput("");
                      }}
                      className="flex gap-2 items-center"
                    >
                      <input 
                        type="text" 
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        disabled={phoneState !== "chatting" || isTyping}
                        placeholder={phoneState === "chatting" ? "Type a reply to send..." : "No active text chat session. Use simulator."}
                        className="flex-1 px-4 py-3 rounded-xl bg-slate-950 border border-slate-850 focus:border-blue-500 outline-none text-xs text-white disabled:bg-slate-950/20 disabled:text-slate-600"
                      />
                      <button 
                        type="submit"
                        disabled={phoneState !== "chatting" || isTyping || !chatInput.trim()}
                        className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center hover:bg-blue-500 disabled:bg-slate-950 disabled:text-slate-600 transition-colors"
                      >
                        <Send size={16} />
                      </button>
                    </form>
                  </div>

                </div>

                {/* Column 3: Contact Info Details Panel (3 cols) */}
                <div className="col-span-3 bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4 overflow-y-auto scrollbar-none text-xs select-none">
                  <div className="text-center pb-4 border-b border-slate-800">
                    <div className="w-12 h-12 bg-slate-800 border border-slate-700 rounded-full flex items-center justify-center font-bold text-sm text-slate-300 mx-auto mb-2">JD</div>
                    <h4 className="font-bold text-white text-sm">John Doe</h4>
                    <span className="text-[10px] text-slate-500 font-mono">+1 (555) 019-2834</span>
                  </div>

                  <div className="space-y-3">
                    <div className="text-[9px] text-slate-500 font-black uppercase tracking-wider">Opportunity Details</div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-slate-400">Lead Source</span>
                      <span className="font-bold text-blue-400 px-1.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-[9px] font-mono">src:missed-call</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-slate-400">Lead Value</span>
                      <span className="font-black text-emerald-400 font-mono text-[13px]">$850.00</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-slate-400">Funnel Status</span>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${phoneState === "success" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : phoneState === "chatting" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20 animate-pulse" : "bg-slate-950 text-slate-500 border border-slate-850"}`}>
                        {phoneState === "success" ? "WON / SCHEDULED" : phoneState === "chatting" ? "IN DIALOG" : "NEW CALLED"}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-slate-800">
                    <div className="text-[9px] text-slate-500 font-black uppercase tracking-wider">Technician Assigned</div>
                    {phoneState === "success" ? (
                      <div className="p-2 bg-slate-950 rounded-xl border border-slate-800 flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center font-bold text-[9px]">D</div>
                        <div>
                          <div className="font-bold text-white text-[10px]">Dave (Master Plumber)</div>
                          <div className="text-[8px] text-slate-500">Zone 1 • Estimated response: 14 mins</div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-[10px] text-slate-500 italic py-1 text-center">Unassigned. Waiting for scheduling.</div>
                    )}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 3: AUTOMATION WORKFLOW BUILDER */}
          {activeTab === "automation" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h1 className="text-2xl font-black text-white">Workflow Automation</h1>
                <p className="text-xs text-slate-500">View and edit Plumbify's speed-to-lead automated SMS triggers</p>
              </div>

              {/* GHL-style Workflow Editor Mock */}
              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col items-center py-10 relative">
                
                {/* Workflow Trigger Card */}
                <div className="w-80 p-4 rounded-xl bg-blue-600 border border-blue-500 shadow-md text-center relative z-10">
                  <div className="text-[8px] text-blue-200 font-black uppercase tracking-widest">Workflow Trigger</div>
                  <h4 className="text-sm font-bold text-white mt-1">📞 Missed Call Intercepted</h4>
                  <p className="text-[9px] text-blue-100 mt-1">Triggers when incoming business call is unanswered</p>
                </div>

                {/* Connector Arrow */}
                <div className="h-8 w-0.5 bg-slate-800 my-1"></div>

                {/* Automation Action 1 */}
                <div className="w-80 p-4 rounded-xl bg-slate-950 border border-slate-850 text-center relative z-10">
                  <div className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">Action 1: Wait</div>
                  <h4 className="text-xs font-bold text-white mt-1">Wait 5 Seconds</h4>
                  <p className="text-[9px] text-slate-500 mt-0.5">Allows phone logging to complete</p>
                </div>

                {/* Connector Arrow */}
                <div className="h-8 w-0.5 bg-slate-800 my-1"></div>

                {/* Automation Action 2 */}
                <div className="w-80 p-4 rounded-xl bg-slate-950 border border-slate-850 text-center relative z-10">
                  <div className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">Action 2: Send SMS</div>
                  <h4 className="text-xs font-bold text-white mt-1">Send Text-Back SMS Template</h4>
                  <div className="mt-2 p-2 bg-slate-900 rounded text-[9px] text-slate-300 italic border border-slate-800 text-left">
                    "Hi, this is Plumbify! Sorry we missed your call. Need an emergency plumber?"
                  </div>
                </div>

                {/* Connector Arrow */}
                <div className="h-8 w-0.5 bg-slate-800 my-1"></div>

                {/* Automation Action 3 */}
                <div className="w-80 p-4 rounded-xl bg-slate-950 border border-slate-850 text-center relative z-10">
                  <div className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">Action 3: Trigger AI</div>
                  <h4 className="text-xs font-bold text-white mt-1">Activate Plumbify Chatbot</h4>
                  <p className="text-[9px] text-slate-500 mt-0.5">Listens to SMS replies and schedules technician zone match</p>
                </div>

                <div className="absolute top-6 right-6 p-4 rounded-xl bg-slate-950 border border-slate-850 max-w-xs text-xs">
                  <h5 className="font-bold text-white mb-1 flex items-center gap-1">
                    <Sparkles size={12} className="text-blue-400" /> Automation Logic
                  </h5>
                  <p className="text-[10px] text-slate-400 leading-relaxed">
                    This automated sequence triggers the second a missed call registers. It converts 80% of lost callers who would otherwise hang up and dial your competitors.
                  </p>
                </div>

              </div>
            </div>
          )}

          {/* TAB 4: CALENDAR & DISPATCH */}
          {activeTab === "calendar" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-black text-white">Smart Dispatch Calendar</h1>
                  <p className="text-xs text-slate-500">Track zone assignments, booked slots, and technician travel routing</p>
                </div>
              </div>

              {/* Tech assignments calendar grid */}
              <div className="grid lg:grid-cols-12 gap-6 items-stretch">
                
                {/* Tech list (4 cols) */}
                <div className="lg:col-span-4 p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                  <div className="text-[10px] text-slate-500 font-black uppercase tracking-wider">Technician Status</div>
                  
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-850 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center font-bold text-xs">D</div>
                      <div>
                        <div className="font-bold text-white text-[11px]">Dave (Zone 1)</div>
                        <div className="text-[8px] text-slate-500">Service: Emergency callouts</div>
                      </div>
                    </div>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20 font-bold uppercase">ON JOB</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-850 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-xs">S</div>
                      <div>
                        <div className="font-bold text-white text-[11px]">Sarah (Zone 3)</div>
                        <div className="text-[8px] text-slate-500">Service: Gas leak installs</div>
                      </div>
                    </div>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold uppercase">FREE</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-850 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center font-bold text-xs">M</div>
                      <div>
                        <div className="font-bold text-white text-[11px]">Mike (Zone 2)</div>
                        <div className="text-[8px] text-slate-500">Service: Drain clearing</div>
                      </div>
                    </div>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-950 border border-slate-850 text-slate-500 font-bold uppercase">OFF</span>
                  </div>
                </div>

                {/* Calendar Schedule Grid (8 cols) */}
                <div className="lg:col-span-8 p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-400 mb-4 border-b border-slate-800 pb-2">
                    <span>TIMELINE SCHEDULE</span>
                    <span>TODAY: JUN 17</span>
                  </div>

                  <div className="space-y-3 flex-1 text-xs">
                    <div className="grid grid-cols-8 items-center border-b border-slate-850 pb-2">
                      <span className="col-span-1 text-slate-500 font-mono font-bold">12:00</span>
                      <div className="col-span-7 bg-slate-950 border border-slate-850 rounded-xl p-2.5 flex justify-between items-center">
                        <span className="font-bold text-slate-300">Drain clearing - Sarah</span>
                        <span className="text-[10px] text-slate-500 font-bold">Austin South (Zone 3)</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-8 items-center border-b border-slate-850 pb-2">
                      <span className="col-span-1 text-slate-500 font-mono font-bold">14:00</span>
                      {phoneState === "success" ? (
                        <div className="col-span-7 bg-blue-600/10 border border-blue-500/35 rounded-xl p-2.5 flex justify-between items-center animate-in zoom-in-95 duration-200">
                          <span className="font-bold text-white flex items-center gap-1.5">
                            💥 Emergency Burst Pipe - Dave <Sparkles size={10} className="text-blue-400" />
                          </span>
                          <span className="text-[9px] text-blue-400 font-bold uppercase tracking-wider bg-blue-500/15 px-2 py-0.5 rounded border border-blue-500/25">
                            Booked via Live Sim
                          </span>
                        </div>
                      ) : (
                        <div className="col-span-7 border border-dashed border-slate-800 hover:border-blue-500/50 p-2.5 rounded-xl text-center text-slate-500 cursor-pointer transition-colors flex items-center justify-center gap-1.5">
                          <Plus size={12} /> Available Time Block
                        </div>
                      )}
                    </div>
                    <div className="grid grid-cols-8 items-center border-b border-slate-850 pb-2">
                      <span className="col-span-1 text-slate-500 font-mono font-bold">16:00</span>
                      <div className="col-span-7 border border-dashed border-slate-800 hover:border-blue-500/50 p-2.5 rounded-xl text-center text-slate-500 cursor-pointer transition-colors flex items-center justify-center gap-1.5">
                        <Plus size={12} /> Available Time Block
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 5: REPUTATION & REVIEWS */}
          {activeTab === "reputation" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h1 className="text-2xl font-black text-white">Review & Reputation Booster</h1>
                <p className="text-xs text-slate-500">Automate review workflows and capture private negative feedback before it hits Google</p>
              </div>

              <div className="grid lg:grid-cols-12 gap-6 items-stretch">
                
                {/* Simulator controls (5 cols) */}
                <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white mb-1">Reputation Simulator</h3>
                    <p className="text-[10px] text-slate-500">Drag star rating slider to test automated routing logic</p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-850 space-y-4 my-4">
                    <div className="flex justify-between items-center text-xs font-bold text-slate-400">
                      <span>Mock Customer Rating</span>
                      <span className="text-amber-500 flex items-center gap-1 text-[13px] font-bold">
                        {customerRating} <Star size={14} className="fill-current text-amber-500" />
                      </span>
                    </div>
                    <input 
                      type="range" 
                      min="1" 
                      max="5" 
                      value={customerRating}
                      onChange={(e) => { setCustomerRating(parseInt(e.target.value)); resetReviewDemo(); }}
                      className="w-full accent-amber-500 cursor-pointer"
                    />

                    <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400 font-bold text-center">
                      <div className={`p-1.5 rounded-lg border ${customerRating <= 3 ? "bg-red-500/10 border-red-500/30 text-red-400" : "border-slate-850"}`}>
                        1-3⭐ Private Feedback
                      </div>
                      <div className={`p-1.5 rounded-lg border ${customerRating >= 4 ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "border-slate-850"}`}>
                        4-5⭐ Google Maps
                      </div>
                    </div>

                    {!reviewSent ? (
                      <button 
                        onClick={triggerReviewSimulation}
                        className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
                      >
                        🚀 Trigger Review Automation
                      </button>
                    ) : (
                      <div className="space-y-2.5">
                        <div className="text-[9px] font-mono bg-slate-900 p-2.5 rounded-xl border border-slate-850 space-y-1 text-slate-300">
                          {reviewLog.map((log, idx) => (
                            <div key={idx} className="animate-in fade-in duration-200">{log}</div>
                          ))}
                        </div>
                        
                        {reviewShowLink && (
                          <a 
                            href="https://g.page/r/plumbify/review"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-2 bg-emerald-500 text-white rounded-xl text-xs font-bold text-center hover:bg-emerald-400 transition-all flex items-center justify-center gap-1.5"
                          >
                            <Star size={12} className="fill-current" /> Visit Simulated Review Page <ExternalLink size={10} />
                          </a>
                        )}
                        
                        <button 
                          onClick={resetReviewDemo}
                          className="w-full py-1.5 bg-slate-900 hover:bg-slate-850 text-slate-400 rounded-lg text-[10px] transition-colors"
                        >
                          Reset Review Simulator
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Google Stream view (7 cols) */}
                <div className="lg:col-span-7 p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-400 mb-4 border-b border-slate-800 pb-2">
                    <span>GOOGLE MAPS BUSINESS FEED</span>
                    <span>100% SYNCED</span>
                  </div>

                  <div className="space-y-3 max-h-56 overflow-y-auto pr-1 scrollbar-none text-xs">
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-850">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-white">Robert K.</span>
                        <div className="flex gap-0.5 text-amber-500">
                          <Star size={10} className="fill-current text-amber-500" /><Star size={10} className="fill-current text-amber-500" /><Star size={10} className="fill-current text-amber-500" /><Star size={10} className="fill-current text-amber-500" /><Star size={10} className="fill-current text-amber-500" />
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-400 italic">"Dave was super quick fixing my leak. Got a review SMS right after payment. Awesome system."</p>
                    </div>
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-850">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-white">Sarah L.</span>
                        <div className="flex gap-0.5 text-amber-500">
                          <Star size={10} className="fill-current text-amber-500" /><Star size={10} className="fill-current text-amber-500" /><Star size={10} className="fill-current text-amber-500" /><Star size={10} className="fill-current text-amber-500" /><Star size={10} className="fill-current text-amber-500" />
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-400 italic">"Loved the WeChat service booking. Review automated process was seamless."</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 6: SETTINGS */}
          {activeTab === "settings" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h1 className="text-2xl font-black text-white">System Integrations</h1>
                <p className="text-xs text-slate-500">Configure connected external API gateways and webhook endpoints</p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 text-xs max-w-2xl">
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-850 flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-white">Twilio SMS Gateway</h4>
                    <p className="text-[10px] text-slate-500">Main API channel handling SMS text-backs</p>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-bold">CONNECTED</span>
                </div>
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-850 flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-white">WeChat / WeCom Webhook</h4>
                    <p className="text-[10px] text-slate-500">Gateway translation for Chinese-speaking leads</p>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-bold">CONNECTED</span>
                </div>
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-850 flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-white">ServiceTitan API Integration</h4>
                    <p className="text-[10px] text-slate-500">Synchronize won bookings directly to technician calendars</p>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-bold">CONNECTED</span>
                </div>
              </div>
            </div>
          )}

        </main>

        {/* 3. FLOATING ONBOARDING WALKTHROUGH ASSISTANT (BOTTOM) */}
        <div className="m-6 bg-slate-900/90 border border-blue-500/20 rounded-2xl p-4 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 backdrop-blur-xl relative z-10 animate-in slide-in-from-bottom-6 duration-500">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 font-bold shrink-0 animate-pulse">
              <Sparkles size={16} />
            </div>
            <div>
              <div className="text-xs font-black text-white flex items-center gap-2">
                <span>ONBOARDING GUIDE</span>
                <span className="text-[9px] font-bold text-slate-500">•</span>
                <span className="text-[9px] font-mono bg-slate-950 px-1.5 py-0.5 rounded border border-slate-850 text-slate-400">Step {tourStep} of 5</span>
              </div>
              <p className="text-[11px] text-slate-300 mt-1 max-w-xl leading-relaxed">
                {currentTourInstruction(tourStep)}
              </p>
            </div>
          </div>
          
          <div className="flex gap-2 shrink-0">
            {tourStep > 1 && (
              <button 
                onClick={() => setTourStep(prev => prev - 1)}
                className="px-3 py-2 bg-slate-950 hover:bg-slate-800 border border-slate-850 rounded-xl text-[10px] font-bold text-slate-400 hover:text-white transition-colors"
              >
                Previous Step
              </button>
            )}
            <button 
              onClick={() => {
                if (tourStep < 5) {
                  setTourStep(prev => prev + 1);
                  // Auto-advance tabs depending on step
                  if (tourStep === 1) setActiveTab("conversations");
                  if (tourStep === 2) setActiveTab("automation");
                  if (tourStep === 3) setActiveTab("reputation");
                  if (tourStep === 4) setActiveTab("calendar");
                } else {
                  // Finish redirect
                  window.location.href = "/#challenge-form";
                }
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all shadow-md shadow-blue-500/10 flex items-center gap-1.5"
            >
              {tourStep === 5 ? "Submit Setup Request" : "Next Step"}
              <ChevronRight size={12} />
            </button>
          </div>
        </div>

      </div>

      {/* 4. FLOATING SMARTPHONE SIMULATOR (BOTTOM-RIGHT) */}
      {phoneOpen && (
        <div className="absolute bottom-24 right-6 z-40 animate-in fade-in slide-in-from-bottom-12 duration-500 select-none">
          <div className="w-[260px] h-[450px] bg-slate-950 rounded-[2.2rem] border-[5px] border-slate-800 shadow-2xl relative flex flex-col overflow-hidden">
            
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-4 w-24 bg-slate-800 rounded-b-lg z-20 flex justify-center items-center">
              <div className="w-8 h-1 bg-slate-900 rounded-full"></div>
            </div>

            {/* Status Bar */}
            <div className="h-6 w-full flex justify-between px-5 pt-3 items-center z-10 text-[8px] text-slate-500 font-bold font-mono">
               <div>9:41</div>
               <div className="flex gap-1 items-center">
                 <span>LTE</span>
                 <div className="w-3 h-1.5 border border-slate-500 rounded-sm p-[1px] flex items-center">
                   <div className="w-full h-full bg-slate-500 rounded-2xs"></div>
                 </div>
               </div>
            </div>

            {/* Screen Workspace */}
            <div className="flex-1 flex flex-col p-3 pt-4 overflow-hidden relative">
              
              {phoneState === "idle" && (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
                  <div className="w-14 h-14 bg-blue-600/10 border-2 border-dashed border-blue-500/30 rounded-2xl flex items-center justify-center mb-4 text-blue-400">
                    <Phone size={24} className="animate-pulse" />
                  </div>
                  <h5 className="font-bold text-xs text-white">SMS Lead Simulator</h5>
                  <p className="text-[9px] text-slate-500 mt-1.5 leading-relaxed max-w-[180px]">
                    Enter your phone number (optional) and simulate a missed call to launch the automated dialogue stream.
                  </p>
                  <form onSubmit={triggerMissedCall} className="w-full mt-4 space-y-2">
                    <input 
                      type="tel" 
                      value={phoneNumber} 
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="Optional: Enter phone number"
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 focus:border-blue-500 outline-none text-[10px] text-white text-center font-mono"
                    />
                    <button 
                      type="submit"
                      className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[10px] font-bold transition-all shadow-md shadow-blue-500/15"
                    >
                      📞 Simulate Missed Call
                    </button>
                  </form>
                </div>
              )}

              {phoneState === "calling" && (
                <div className="flex-1 flex flex-col items-center justify-center text-center animate-in fade-in duration-300">
                  <div className="w-16 h-16 bg-red-500/10 border-2 border-red-500 text-red-500 rounded-full flex items-center justify-center mb-6 animate-pulse">
                    <Phone size={28} className="fill-current" />
                  </div>
                  <div className="text-xs font-bold text-white">Plumbify Auto-Pilot</div>
                  <div className="text-[9px] text-slate-500 mt-1">Simulating ring...</div>
                </div>
              )}

              {phoneState === "missed" && (
                <div className="flex-1 flex flex-col items-center justify-center text-center animate-in slide-in-from-top-6 duration-300">
                  <div className="w-12 h-12 bg-slate-900 border border-slate-850 text-slate-500 rounded-full flex items-center justify-center mb-3">
                    <Phone size={18} />
                  </div>
                  <div className="text-[9px] text-red-500 font-bold uppercase tracking-wider mb-0.5">Missed Call</div>
                  <div className="text-[10px] font-bold">{phoneNumber || "+1 (555) 019-2834"}</div>
                  <div className="text-[8px] text-slate-500 mt-1">AI intercepts call logs...</div>
                </div>
              )}

              {(phoneState === "chatting" || phoneState === "success") && (
                <div className="flex-1 flex flex-col justify-between h-full overflow-hidden">
                  
                  {/* Chat header */}
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-900">
                    <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-[9px] font-black">P</div>
                    <div>
                      <div className="text-[9px] font-bold text-white">Plumbify Auto-responder</div>
                      <div className="text-[7.5px] text-emerald-400 font-bold font-mono">Connected API</div>
                    </div>
                  </div>

                  {/* Chat bubble feed */}
                  <div className="flex-1 py-3 overflow-y-auto space-y-2 flex flex-col pr-1 scrollbar-none">
                    {chatMessages.map((msg, i) => (
                      <div key={i} className={`flex flex-col ${msg.sender === "user" ? "items-end" : msg.sender === "system" ? "items-center" : "items-start"}`}>
                        {msg.sender === "system" ? (
                          <div className="bg-slate-900 text-[8px] text-slate-500 border border-slate-850 px-2 py-0.5 rounded font-mono uppercase tracking-wider my-0.5">
                            {msg.text}
                          </div>
                        ) : (
                          <div className={`max-w-[85%] p-2 rounded-xl text-[9px] leading-relaxed ${msg.sender === "user" ? "bg-blue-600 text-white rounded-br-none" : "bg-slate-900 text-slate-200 rounded-bl-none border border-slate-800"}`}>
                            {msg.text}
                          </div>
                        )}
                      </div>
                    ))}

                    {isTyping && (
                      <div className="flex items-center gap-1 bg-slate-900 px-2.5 py-1.5 rounded-xl rounded-bl-none border border-slate-800 self-start animate-pulse">
                        <span className="w-1 h-1 rounded-full bg-slate-500 animate-bounce"></span>
                        <span className="w-1 h-1 rounded-full bg-slate-500 animate-bounce delay-100"></span>
                        <span className="w-1 h-1 rounded-full bg-slate-500 animate-bounce delay-200"></span>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>

                  {/* Input / quick reply recommendations */}
                  {phoneState === "chatting" && (
                    <div className="border-t border-slate-900 pt-2 bg-slate-950">
                      
                      {/* Suggest replies */}
                      {chatStep === 1 && (
                        <div className="flex flex-col gap-1.5 mb-2">
                          <button 
                            onClick={() => sendSMSMessage("Yes, a pipe burst in my basement! Water is everywhere!")}
                            className="w-full text-left p-1.5 px-2.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-blue-500 text-[8px] font-bold text-slate-300 transition-colors"
                          >
                            💥 "Yes! Pipe burst in basement!"
                          </button>
                        </div>
                      )}

                      {chatStep === 2 && (
                        <div className="flex gap-2 mb-2">
                          <button 
                            onClick={() => sendSMSMessage("Let's do 2 PM today.")}
                            className="flex-1 text-center p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-blue-500 text-[8px] font-bold text-slate-300 transition-colors"
                          >
                            🕒 "2 PM today"
                          </button>
                          <button 
                            onClick={() => sendSMSMessage("4 PM works better.")}
                            className="flex-1 text-center p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-blue-500 text-[8px] font-bold text-slate-300 transition-colors"
                          >
                            🕒 "4 PM works better"
                          </button>
                        </div>
                      )}

                      {chatStep === 3 && (
                        <div className="flex flex-col gap-1.5 mb-2">
                          <button 
                            onClick={() => sendSMSMessage("1428 Elm Street, Austin, TX")}
                            className="w-full text-left p-1.5 px-2.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-blue-500 text-[8px] font-bold text-slate-300 transition-colors"
                          >
                            📍 "1428 Elm Street, Austin, TX"
                          </button>
                        </div>
                      )}

                      {/* Manual input inside phone */}
                      <form 
                        onSubmit={handleCustomSubmit}
                        className="flex gap-1 items-center"
                      >
                        <input 
                          type="text" 
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          disabled={isTyping}
                          placeholder="Type customer reply..."
                          className="flex-1 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-850 focus:border-blue-500 outline-none text-[9px] text-white"
                        />
                        <button 
                          type="submit"
                          disabled={isTyping || !chatInput.trim()}
                          className="w-7 h-7 bg-blue-600 text-white rounded-lg flex items-center justify-center hover:bg-blue-500 disabled:bg-slate-900 disabled:text-slate-600"
                        >
                          <Send size={10} />
                        </button>
                      </form>
                    </div>
                  )}

                  {/* Success indicator inside phone */}
                  {phoneState === "success" && (
                    <div className="absolute inset-0 bg-slate-950/95 z-20 flex flex-col items-center justify-center p-4 text-center animate-in fade-in duration-300">
                      <div className="w-10 h-10 bg-emerald-500 text-white rounded-full flex items-center justify-center mb-3 shadow-lg shadow-emerald-500/20">
                        <CheckCircle size={20} />
                      </div>
                      <div className="text-[10px] font-black uppercase text-emerald-400 tracking-wider">Appointment Confirmed!</div>
                      <div className="text-xs font-bold text-white mt-1">Technician dave Dispatched</div>
                      <p className="text-slate-500 text-[8px] mt-2 max-w-[160px]">
                        Plumbify synced with Dave's calendar automatically. Now check the Conversations tab on the dashboard to see your logs.
                      </p>
                      <button 
                        onClick={resetPhoneDemo}
                        className="mt-4 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-850 rounded-lg text-[8px] font-bold text-slate-300 transition-colors flex items-center gap-1"
                      >
                        <RefreshCcw size={8} /> Restart Simulator
                      </button>
                    </div>
                  )}

                </div>
              )}

            </div>

            {/* Home Indicator */}
            <div className="h-1.5 w-16 bg-slate-800 rounded-full mx-auto mb-2 shrink-0"></div>
          </div>
        </div>
      )}

    </div>
  );
}

// Helper: current tour guide instruction matching step
function currentTourInstruction(step: number): string {
  switch (step) {
    case 1:
      return "Welcome to Plumbify's Sandbox Tour! Let's test the Speed to Lead (Missed Call Text-Back). Locate the Customer Phone simulator in the bottom right corner, optionally input a mock phone number, and click 'Simulate Missed Call'.";
    case 2:
      return "The call was missed. Instantly, Plumbify's automated workflow intercepted it and texted back. Click on 'Conversations' in the left sidebar menu to see the live chat thread in your Unified Inbox, and reply to the message on the customer phone!";
    case 3:
      return "Great job! Dave is dispatched. Now, let's explore how this auto-text logic is constructed. Click on 'Automation Flows' in the left sidebar menu to inspect our visual workflow trigger builder.";
    case 4:
      return "Plumbify also captures customer satisfaction and boosts your rankings. Click on 'Reputation (Reviews)' in the left sidebar, and slide the star selector to trigger the smart filter and view the Google Maps review synchronization.";
    case 5:
      return "Finally, check the 'Calendar & Dispatch' tab in the left sidebar to see Dave scheduled in Zone 1. When you're ready, click 'Submit Setup Request' to start your 14-Day Free Challenge and let us build this for your plumbing business!";
    default:
      return "Select a tab in the sidebar or follow the guided tour buttons.";
  }
}

// Helper: AI Draft responses matching step
function currentSuggestedReply(step: number): string {
  switch (step) {
    case 1:
      return "Oh no! We can get a master plumber dispatched immediately. Is today at 2 PM or 4 PM better for you?";
    case 2:
      return "Perfect, we've blocked out that slot. What address should we send our technician to?";
    case 3:
      return "Got it! Technician Dave is assigned to your job and will head over. He'll text you when he's 15 mins out. You're all set!";
    default:
      return "Hi! How can we help you with your plumbing needs today?";
  }
}
