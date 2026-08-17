import { RefreshCcw, DollarSign, Target, ArrowRight, ShieldCheck, Mail } from "lucide-react";

export default function DatabaseReactivation() {
  return (
    <main className="min-h-screen bg-white">
      {/* 1. The Hook (Hero) */}
      <section className="pt-40 pb-20 px-6 bg-purple-50 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-600 text-xs font-black mb-6 uppercase">The Money Machine</div>
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8">
          The "Found Money" Machine <br /><span className="text-purple-600">for Your Slow Season.</span>
        </h1>
        <p className="max-w-2xl mx-auto text-xl text-slate-500 mb-10">Stop paying for new leads. Reactivate your list of past customers and fill your schedule in 48 hours.</p>
        <button className="px-10 py-5 bg-purple-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-purple-200">Launch Your First DBR</button>
      </section>

      {/* 2. The Proof */}
      <section className="py-12 border-y border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-12 opacity-40 grayscale filter">
           <div className="text-2xl font-black italic">ABC PLUMBING</div>
           <div className="text-2xl font-black italic">CITY DRAIN</div>
           <div className="text-2xl font-black italic">METRO ROOTER</div>
        </div>
      </section>

      {/* 3. The Problem */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12">
           <div className="p-10 rounded-[32px] bg-slate-50">
              <h4 className="text-slate-400 font-bold mb-4 uppercase tracking-widest text-xs">The Dead List</h4>
              <p className="text-slate-600 text-sm">5,000 past customers sitting in a spreadsheet. No one calls them. They forget you exist. They call someone else next time.</p>
           </div>
           <div className="p-10 rounded-[32px] bg-purple-50 border border-purple-100">
              <h4 className="text-purple-600 font-bold mb-4 uppercase tracking-widest text-xs">The DBR Way</h4>
              <p className="text-slate-600 text-sm">One-click AI campaign sends a "Hey, it's been 6 months" text with a special offer. 15% reply rate. Calendar filled.</p>
           </div>
        </div>
      </section>

      {/* 4. The Demo (Visual UI) */}
      <section className="py-20 px-6 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto text-center">
           <div className="max-w-xl mx-auto p-10 bg-white/5 border border-white/10 rounded-[40px] shadow-2xl">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-8">Campaign Performance</div>
              <div className="grid grid-cols-3 gap-8 mb-12">
                 <div>
                    <div className="text-2xl font-black text-purple-400">500</div>
                    <div className="text-[10px] text-slate-500 uppercase">Texts</div>
                 </div>
                 <div>
                    <div className="text-2xl font-black text-emerald-400">42</div>
                    <div className="text-[10px] text-slate-500 uppercase">Replies</div>
                 </div>
                 <div>
                    <div className="text-2xl font-black text-white">$14.5k</div>
                    <div className="text-[10px] text-slate-500 uppercase">Revenue</div>
                 </div>
              </div>
              <div className="p-4 bg-white/10 rounded-2xl text-xs italic text-slate-400">
                 "Hi Sarah, it's Mark from Rooter Pros. It's been a while! We're doing $50 off water heater flushes this week. Want to grab a spot?"
              </div>
           </div>
        </div>
      </section>

      {/* 5. Core Features (Bento) */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="p-10 rounded-[32px] bg-white border border-slate-200">
              <Target className="text-purple-600 mb-6" />
              <h4 className="font-bold mb-2">Smart Segmenting</h4>
              <p className="text-slate-500 text-xs">Target only customers who haven't seen you in 6+ months.</p>
           </div>
           <div className="p-10 rounded-[32px] bg-white border border-slate-200">
              <Mail className="text-purple-600 mb-6" />
              <h4 className="font-bold mb-2">Multi-Channel</h4>
              <p className="text-slate-500 text-xs">SMS and Email reactivation campaigns.</p>
           </div>
           <div className="p-10 rounded-[32px] bg-white border border-slate-200">
              <ShieldCheck className="text-purple-600 mb-6" />
              <h4 className="font-bold mb-2">Reputation Safe</h4>
              <p className="text-slate-500 text-xs">Built-in opt-out and frequency management.</p>
           </div>
        </div>
      </section>

      {/* 6. ROI (Data) */}
      <section className="py-24 px-6 text-center">
         <div className="text-6xl font-black text-purple-600 mb-4">$22,000</div>
         <p className="text-xl font-bold text-slate-900 mb-2">Avg. Revenue Found per Campaign</p>
         <p className="text-slate-400 text-sm italic">*Based on a list of 1,000 past customers.</p>
      </section>

      {/* 7. Final Push (CTA) */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto rounded-[40px] bg-purple-600 p-12 text-center text-white shadow-2xl">
          <h2 className="text-3xl md:text-4xl font-black mb-6">Start Finding Your "Hidden" Money.</h2>
          <button className="px-10 py-5 bg-white text-purple-600 rounded-2xl font-black text-lg hover:scale-105 transition-all shadow-xl">Reactivate My Database</button>
        </div>
      </section>
    </main>
  );
}
