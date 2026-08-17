"use client";

import React, { useState } from "react";
import { 
  PhoneCall, 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  Zap, 
  Send, 
  RefreshCw, 
  ShieldCheck, 
  DollarSign, 
  FileText 
} from "lucide-react";

export default function OperationalDispatchDesk() {
  const [activeTab, setActiveTab] = useState<"wechat" | "missed_call">("wechat");

  return (
    <section className="w-full max-w-6xl mx-auto py-12 px-4 sm:px-6">
      {/* Title & Header Section */}
      <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest">
          <Zap size={14} /> Next-Gen B2B Dispatch Engine
        </div>
        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
          Omnichannel CRM for <span className="text-blue-400">Plumbing Contractors</span>
        </h2>
        <p className="text-red-400 font-bold text-lg">
          The Cost of Silence: <span className="text-slate-300 font-normal">Unanswered Calls & Chats.</span>
        </p>
        <p className="text-slate-400 text-base leading-relaxed">
          Never miss a lead or waste time on unqualified inquiries again. Plumbify powers instant call-backs, WeChat dispatch, and AI vetting—directly translating to more billable hours and instant QuickBooks sync.
        </p>
      </div>

      {/* Operational Dispatch Desk Showcase Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden grid lg:grid-cols-12">
        {/* Left Side: Real-Time Feed Monitor */}
        <div className="lg:col-span-7 p-6 sm:p-8 border-b lg:border-b-0 lg:border-r border-slate-800 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">
                  OPERATIONAL DISPATCH DESK • LIVE SYNC
                </span>
              </div>

              {/* Tab Selector */}
              <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700">
                <button
                  onClick={() => setActiveTab("wechat")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeTab === "wechat"
                      ? "bg-emerald-600 text-white shadow"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  WeChat Dispatch
                </button>
                <button
                  onClick={() => setActiveTab("missed_call")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeTab === "missed_call"
                      ? "bg-blue-600 text-white shadow"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Missed Call Text-Back
                </button>
              </div>
            </div>

            {/* Dynamic Event Log Display */}
            <div className="space-y-4">
              {activeTab === "wechat" && (
                <div className="bg-slate-850 border border-emerald-500/30 rounded-2xl p-5 space-y-4 animate-in fade-in duration-300">
                  <div className="flex justify-between items-center text-xs text-slate-400 border-b border-slate-800 pb-3">
                    <span className="flex items-center gap-2 font-semibold text-emerald-400">
                      <MessageSquare size={16} /> WeChat Chat Log Captured
                    </span>
                    <span className="text-slate-500">Just Now</span>
                  </div>
                  <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                    <p className="text-sm font-bold text-white">Peifeng Ni:</p>
                    <p className="text-sm text-slate-300 font-mono mt-1">"Burst pipe in kitchen, emergency dispatch needed."</p>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-2 text-xs text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
                      <CheckCircle2 size={14} /> Status: Dispatched to Tech Truck #4
                    </div>
                    <span className="text-xs text-slate-400">QuickBooks Auto-Drafted</span>
                  </div>
                </div>
              )}

              {activeTab === "missed_call" && (
                <div className="bg-slate-850 border border-blue-500/30 rounded-2xl p-5 space-y-4 animate-in fade-in duration-300">
                  <div className="flex justify-between items-center text-xs text-slate-400 border-b border-slate-800 pb-3">
                    <span className="flex items-center gap-2 font-semibold text-blue-400">
                      <PhoneCall size={16} /> Missed Call Text-Back Triggered
                    </span>
                    <span className="text-slate-500">12s ago</span>
                  </div>
                  <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                    <p className="text-xs text-slate-400 mb-1">Incoming Caller:</p>
                    <p className="text-sm font-bold text-white font-mono">+1 (512) 555-0199</p>
                    <p className="text-xs text-blue-400 mt-2 italic">
                      "Auto SMS sent: 'Hi, this is Plumbify Dispatch. Sorry we missed your call. Book emergency slot or reply HERE.'"
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-2 text-xs text-blue-400 font-bold bg-blue-500/10 px-3 py-1.5 rounded-lg border border-blue-500/20">
                      <CheckCircle2 size={14} /> Status: Customer Replied & Booked
                    </div>
                    <span className="text-xs text-slate-400">Est. Revenue: $450</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-4 border-t border-slate-800">
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-emerald-400" /> AI Vetting Enabled
            </span>
            <span className="flex items-center gap-1.5">
              <FileText size={14} className="text-blue-400" /> QuickBooks 2-Way Sync
            </span>
          </div>
        </div>

        {/* Right Side: ROI & Operational Impact Cards */}
        <div className="lg:col-span-5 bg-slate-950 p-6 sm:p-8 flex flex-col justify-between space-y-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Why Multi-Channel Dispatch Wins</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3 text-slate-300">
                <div className="w-5 h-5 bg-blue-500/10 text-blue-400 rounded-md flex items-center justify-center mt-0.5 shrink-0">
                  ✓
                </div>
                <span><strong>Instant WeChat & SMS Logging</strong>: Capture non-English inquiries & multicultural technician chats automatically.</span>
              </li>
              <li className="flex items-start gap-3 text-slate-300">
                <div className="w-5 h-5 bg-emerald-500/10 text-emerald-400 rounded-md flex items-center justify-center mt-0.5 shrink-0">
                  ✓
                </div>
                <span><strong>More Billable Hours</strong>: Stop losing 2+ hours daily on manual phone tag and unvetted tire-kickers.</span>
              </li>
              <li className="flex items-start gap-3 text-slate-300">
                <div className="w-5 h-5 bg-indigo-500/10 text-indigo-400 rounded-md flex items-center justify-center mt-0.5 shrink-0">
                  ✓
                </div>
                <span><strong>QuickBooks Live Sync</strong>: Invoices, customer contacts, and job status sync automatically without double entry.</span>
              </li>
            </ul>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl text-center">
            <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold mb-1">Average Time Saved Per Dispatch</p>
            <p className="text-3xl font-black text-emerald-400">18 Mins <span className="text-xs font-normal text-slate-400">/ job</span></p>
          </div>
        </div>
      </div>
    </section>
  );
}
