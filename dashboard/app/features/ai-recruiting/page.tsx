import { Users, ShieldCheck, PhoneCall, ArrowRight, Layout, Search, Star } from "lucide-react";

export default function AIRecruiting() {
  return (
    <main className="min-h-screen bg-white">
      {/* 1. The Hook (Hero) */}
      <section className="pt-40 pb-20 px-6 bg-orange-50 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-600 text-xs font-black mb-6 uppercase">AI Recruiting</div>
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8">
          Hire Vetted Plumbers <br /><span className="text-orange-600">5x Faster with AI Screening.</span>
        </h1>
        <p className="max-w-2xl mx-auto text-xl text-slate-500 mb-10">Stop sorting through garbage resumes. Let our AI call, screen, and verify licenses for you 24/7.</p>
        <button className="px-10 py-5 bg-orange-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-orange-200">Find My Next Master Tech</button>
      </section>

      {/* 2. The Proof */}
      <section className="py-12 border-y border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-12 opacity-40 grayscale filter">
           <div className="text-2xl font-black italic">PHCC MEMBER</div>
           <div className="text-2xl font-black italic">MCAA PARTNER</div>
           <div className="text-2xl font-black italic">NATE CERTIFIED</div>
        </div>
      </section>

      {/* 3. The Problem */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12">
           <div className="p-10 rounded-[32px] bg-slate-50">
              <h4 className="text-slate-400 font-bold mb-4 uppercase tracking-widest text-xs">The Manual Grind</h4>
              <p className="text-slate-600 text-sm">Post on Indeed &gt; Get 200 resumes &gt; 190 are unqualified &gt; Spend 10 hours on phone tags &gt; Tech doesn't show for interview.</p>
           </div>
           <div className="p-10 rounded-[32px] bg-orange-50 border border-orange-100">
              <h4 className="text-orange-600 font-bold mb-4 uppercase tracking-widest text-xs">The Plumbify Way</h4>
              <p className="text-slate-600 text-sm">AI calls every applicant instantly &gt; Verifies plumbing license # &gt; Asks about years of service &gt; Books the best 5 onto your calendar.</p>
           </div>
        </div>
      </section>

      {/* 4. The Demo (Visual UI) - Hiring Portal */}
      <section className="py-20 px-6 bg-slate-900 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto text-center">
           <h2 className="text-3xl font-black mb-12">Your Mobile Hiring Pipeline</h2>
           <div className="max-w-md mx-auto bg-slate-800 rounded-[40px] border-[12px] border-slate-950 p-6 shadow-2xl text-left">
              <div className="flex justify-between items-center mb-6">
                 <div className="font-bold text-xs uppercase tracking-widest text-orange-400">Qualified Applicants</div>
                 <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-black text-white">12</div>
              </div>
              <div className="space-y-3">
                 {[
                   { name: "Robert Smith", exp: "8 Years", status: "Verified" },
                   { name: "Mark Wilson", exp: "12 Years", status: "Master" },
                   { name: "Sarah Doe", exp: "5 Years", status: "Journeyman" }
                 ].map((a, i) => (
                   <div key={i} className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between">
                      <div>
                         <div className="font-bold text-sm">{a.name}</div>
                         <div className="text-[10px] text-slate-500">{a.exp} Exp.</div>
                      </div>
                      <div className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-[10px] font-black">{a.status}</div>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </section>

      {/* 5. Core Features (Bento) */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="p-10 rounded-[32px] bg-white border border-slate-200">
              <PhoneCall className="text-orange-500 mb-6" />
              <h4 className="font-bold mb-2">Voice AI Screener</h4>
              <p className="text-slate-500 text-xs">AI calls and interviews applicants for you.</p>
           </div>
           <div className="p-10 rounded-[32px] bg-white border border-slate-200">
              <Search className="text-orange-500 mb-6" />
              <h4 className="font-bold mb-2">License Verification</h4>
              <p className="text-slate-500 text-xs">Real-time verification against state databases.</p>
           </div>
           <div className="p-10 rounded-[32px] bg-white border border-slate-200">
              <Layout className="text-orange-500 mb-6" />
              <h4 className="font-bold mb-2">Recruiting Pipeline</h4>
              <p className="text-slate-500 text-xs">Manage your hiring funnel from your phone.</p>
           </div>
        </div>
      </section>

      {/* 6. ROI (Data) */}
      <section className="py-24 px-6 text-center">
         <div className="text-6xl font-black text-orange-600 mb-4">20h</div>
         <p className="text-xl font-bold text-slate-900 mb-2">Saved per Week in Recruiting</p>
         <p className="text-slate-400 text-sm italic">*Based on automation of screening calls and scheduling.</p>
      </section>

      {/* 7. Final Push (CTA) */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto rounded-[40px] bg-orange-600 p-12 text-center text-white shadow-2xl">
          <h2 className="text-3xl md:text-4xl font-black mb-6">Build Your A-Team Today.</h2>
          <button className="px-10 py-5 bg-white text-orange-600 rounded-2xl font-black text-lg hover:scale-105 transition-all shadow-xl">Start AI Recruiting</button>
        </div>
      </section>
    </main>
  );
}
