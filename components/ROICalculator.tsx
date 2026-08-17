"use client";

import { useState, useEffect } from "react";
import { TrendingUp, AlertTriangle, CheckCircle2, ArrowRight, ShieldCheck, X } from "lucide-react";

export default function ROICalculator() {
  const [techs, setTechs] = useState<number>(5);
  const [missedCalls, setMissedCalls] = useState<number>(12);
  const [avgTicket, setAvgTicket] = useState<number>(450);

  const [monthlyLoss, setMonthlyLoss] = useState<number>(0);
  const [yearlyLoss, setYearlyLoss] = useState<number>(0);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  // 表单状态
  const [formData, setFormData] = useState({
    name: "",
    companyName: "",
    email: "",
    phone: ""
  });

  useEffect(() => {
    // 水暖行业标准损耗模型：
    // 未接/未能即时响应的电话转化成功概率约为 35%
    const conversionRate = 0.35;
    const weeklyLostJobs = missedCalls * conversionRate;
    const monthlyLostRev = Math.round(weeklyLostJobs * avgTicket * 4.33);
    const yearlyLostRev = Math.round(monthlyLostRev * 12);

    setMonthlyLoss(monthlyLostRev);
    setYearlyLoss(yearlyLostRev);
  }, [techs, missedCalls, avgTicket]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/lead-magnet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          techsCount: techs,
          estimatedLoss: monthlyLoss
        })
      });

      if (res.ok) {
        setIsSubmitted(true);
      } else {
        alert("Failed to submit. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-6 md:p-10 rounded-3xl bg-slate-900 text-white shadow-2xl relative border border-slate-800">
      <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
        <TrendingUp size={280} />
      </div>

      <div className="relative z-10 grid lg:grid-cols-12 gap-10 items-center">
        {/* 左侧控制滑动条 */}
        <div className="lg:col-span-7 space-y-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold uppercase tracking-wider mb-4">
              <AlertTriangle size={14} /> Revenue Leak Audit Tool
            </div>
            <h3 className="text-3xl font-extrabold tracking-tight">Plumbing Revenue Leakage Calculator</h3>
            <p className="text-slate-400 mt-2 text-sm leading-relaxed">
              Calculate how much revenue your plumbing shop loses every month due to delayed callbacks, unhandled missed calls, and slow dispatch.
            </p>
          </div>

          <div className="space-y-6 bg-slate-850 p-6 rounded-2xl border border-slate-800">
            {/* 1. 技师人数 */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-slate-300">Field Technicians / Trucks</label>
                <span className="font-bold text-blue-400 bg-blue-500/10 px-3 py-1 rounded-md border border-blue-500/20">
                  {techs} Techs
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="50"
                value={techs}
                onChange={(e) => setTechs(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>

            {/* 2. 每周错过/延迟电话数 */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-slate-300">Missed / Delayed Calls Per Week</label>
                <span className="font-bold text-red-400 bg-red-500/10 px-3 py-1 rounded-md border border-red-500/20">
                  {missedCalls} Calls/wk
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="60"
                value={missedCalls}
                onChange={(e) => setMissedCalls(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-red-500"
              />
            </div>

            {/* 3. 平均工单金额 */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-slate-300">Average Job Ticket Size ($)</label>
                <span className="font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-md border border-emerald-500/20">
                  ${avgTicket}
                </span>
              </div>
              <input
                type="range"
                min="150"
                max="3000"
                step="50"
                value={avgTicket}
                onChange={(e) => setAvgTicket(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* 右侧逻辑计算面板 */}
        <div className="lg:col-span-5 bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700/60 rounded-3xl p-8 text-center shadow-xl relative overflow-hidden flex flex-col justify-between">
          <div className="space-y-6">
            <div>
              <p className="text-slate-400 text-xs uppercase tracking-widest font-semibold">Estimated Monthly Revenue Slip</p>
              <div className="text-4xl md:text-5xl font-black text-red-400 mt-2 tracking-tight">
                -${monthlyLoss.toLocaleString()} <span className="text-xs font-normal text-slate-400">/ mo</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800">
              <p className="text-slate-400 text-xs uppercase tracking-widest font-semibold">Estimated Annual Loss</p>
              <div className="text-2xl font-bold text-slate-200 mt-1">
                -${yearlyLoss.toLocaleString()} <span className="text-xs font-normal text-slate-400">/ yr</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 italic leading-relaxed">
              *Based on a conservative 35% missed-call conversion drop. Plumbify automated text-backs recover over 85% of these opportunities automatically.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-8 w-full py-4 bg-blue-600 hover:bg-blue-500 transition-all duration-200 rounded-xl font-bold text-base shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 group"
          >
            Plug This Leak Now <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Lead Opt-in Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-3xl p-8 relative shadow-2xl text-left">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-white"
            >
              <X size={20} />
            </button>

            {!isSubmitted ? (
              <>
                <h4 className="text-2xl font-bold text-white mb-2">Claim Your Custom Plumbing Automation Snapshot</h4>
                <p className="text-slate-400 text-sm mb-6">
                  Get instant access to our pre-built GHL Plumbing Workflows that automatically stop your estimated <strong className="text-red-400">${monthlyLoss.toLocaleString()}/mo</strong> leakage.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Smith"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Company Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Smith Plumbing LLC"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Work Email</label>
                    <input
                      type="email"
                      required
                      placeholder="john@smithplumbing.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Phone Number (Optional)</label>
                    <input
                      type="tel"
                      placeholder="(555) 000-0000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 transition-colors rounded-xl font-bold text-white text-base shadow-lg shadow-emerald-600/30 mt-4 flex items-center justify-center gap-2"
                  >
                    {loading ? "Processing..." : "Get Free Snapshot & Fix Leak"}
                  </button>

                  <div className="flex items-center justify-center gap-2 text-xs text-slate-500 mt-3">
                    <ShieldCheck size={14} /> 100% Free. Instant GHL import link sent to email.
                  </div>
                </form>
              </>
            ) : (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 size={36} />
                </div>
                <h4 className="text-2xl font-bold text-white">Snapshot Request Received!</h4>
                <p className="text-slate-300 text-sm">
                  We've sent the Plumbing Automation Snapshot link and walkthrough to <strong>{formData.email}</strong>.
                </p>
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setIsModalOpen(false);
                  }}
                  className="mt-6 px-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl font-semibold text-sm text-white"
                >
                  Close Window
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
