import { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import ROICalculator from '@/components/ROICalculator';
import { Check, Shield, Zap, TrendingUp, PhoneCall, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Plumbing Business Revenue Leakage Calculator | Plumbify',
  description: 'Calculate how much revenue your plumbing company is losing due to missed calls and delayed response times. Free ROI calculation & instant GHL automation workflow.',
  keywords: 'plumbing revenue calculator, plumbing missed call cost, plumbing crm ROI, plumbing dispatch automation'
};

export default function CalculatorPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      <Navbar />

      <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest">
            <Zap size={14} /> Free Interactive B2B Audit Tool
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white leading-tight">
            How Much Revenue Is Your Plumbing Shop <span className="text-red-400 underline underline-offset-8 decoration-red-500/40">Losing Every Month?</span>
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed">
            Every unhandled call, late quote follow-up, and manual dispatch delay drains profits. Adjust the sliders below to discover your shop's exact leakage.
          </p>
        </div>

        {/* Calculator Component */}
        <div className="mb-24">
          <ROICalculator />
        </div>

        {/* Pain Points & Solution Breakdown */}
        <div className="grid md:grid-cols-3 gap-8 mb-24">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-4">
            <div className="w-12 h-12 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl flex items-center justify-center">
              <PhoneCall size={24} />
            </div>
            <h3 className="text-xl font-bold text-white">The 5-Minute Speed Rule</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              78% of plumbing customers hire the contractor who responds first. If your front desk takes 15+ minutes to call back, that job is already gone to a competitor.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-4">
            <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center">
              <TrendingUp size={24} />
            </div>
            <h3 className="text-xl font-bold text-white">Un-followed Quotes</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Plumbers send estimates and hope for the best. Automated 3-day and 7-day estimate follow-ups increase quote close rates by an average of 22%.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-4">
            <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center">
              <Zap size={24} />
            </div>
            <h3 className="text-xl font-bold text-white">Zero Extra Staff Required</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Plumbify GHL Workflows handle instant SMS missed-call text backs, booking links, and review collection 24/7 automatically without hiring additional dispatchers.
            </p>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="bg-gradient-to-r from-blue-900/60 to-indigo-900/60 border border-blue-500/30 rounded-3xl p-10 text-center relative overflow-hidden space-y-6">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white">
            Ready to Plug Your Plumbing Business Revenue Leaks?
          </h2>
          <p className="text-slate-300 max-w-2xl mx-auto text-base">
            Import our ready-to-use GoHighLevel Plumbing Automation Snapshot into your account in less than 15 minutes.
          </p>
          <div className="pt-2">
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 px-8 py-4 bg-blue-500 hover:bg-blue-400 text-white font-bold rounded-xl text-lg transition-colors shadow-lg shadow-blue-500/30"
            >
              Get Started with Plumbify <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </div>

      <footer className="py-8 border-t border-slate-900 text-center text-xs text-slate-600">
        © {new Date().getFullYear()} Plumbify SaaS. Designed for Plumbing Contractors & Master Plumbers.
      </footer>
    </main>
  );
}
