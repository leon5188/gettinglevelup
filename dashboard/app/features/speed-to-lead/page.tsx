import { Zap, Clock, MessageSquare, PhoneOff, ArrowRight, ShieldCheck, TrendingUp, CheckCircle2 } from "lucide-react";

export default function SpeedToLead() {
  return (
    <main className="min-h-screen bg-white">
      {/* 1. The Hook (Hero) */}
      <section className="pt-40 pb-20 px-6 bg-gradient-to-b from-blue-50 to-white text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-xs font-black mb-6">SPEED TO LEAD AI</div>
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8">
          Turn Every Missed Call into <br /><span className="text-blue-600">A Booked Job in 60 Seconds.</span>
        </h1>
        <p className="max-w-2xl mx-auto text-xl text-slate-500 mb-10">Stop losing jobs to the competitor down the street just because you were under a sink.</p>
        <button className="px-10 py-5 bg-blue-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-blue-200">Start Capturing Leads</button>
      </section>

      {/* 2. The Proof (Trust Bar) */}
      <section className="py-12 border-y border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-12 opacity-40 grayscale filter">
           <div className="text-2xl font-black italic">ROOTER PROS</div>
           <div className="text-2xl font-black italic">ELITE PLUMBING</div>
           <div className="text-2xl font-black italic">FLOW MASTERS</div>
           <div className="text-2xl font-black italic">DRAIN KINGS</div>
        </div>
      </section>

      {/* 3. The Problem (Old vs New) */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12">
           <div className="p-10 rounded-[32px] bg-red-50 border border-red-100">
              <h4 className="text-red-600 font-bold mb-4 uppercase tracking-widest text-xs">The Old Way</h4>
              <p className="text-slate-600 text-sm">Customer calls &gt; You're busy &gt; They leave a voicemail &gt; They call your competitor &gt; Competitor answers &gt; You lose $350.</p>
           </div>
           <div className="p-10 rounded-[32px] bg-emerald-50 border border-emerald-100">
              <h4 className="text-emerald-600 font-bold mb-4 uppercase tracking-widest text-xs">The Plumbify Way</h4>
              <p className="text-slate-600 text-sm">Customer calls &gt; Plumbify AI texts back in 45s &gt; Customer books via link &gt; You get a notification &gt; Job done + $350.</p>
           </div>
        </div>
      </section>

      {/* 4. The Demo (Visual UI) */}
      <section className="py-20 px-6 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto text-center">
           <div className="mb-12">
              <h2 className="text-3xl font-black mb-4">See the AI in Action</h2>
              <p className="text-slate-400">A real-time simulation of the MCTB (Missed Call Text Back) workflow.</p>
           </div>
           <div className="max-w-md mx-auto bg-slate-800 rounded-[40px] border-[12px] border-slate-950 p-6 shadow-2xl text-left">
              <div className="space-y-4">
                 <div className="p-3 bg-white/5 rounded-xl text-xs text-slate-400 italic">Incoming Call from Sarah (555-0123)... Missed.</div>
                 <div className="p-3 bg-blue-600 rounded-xl text-xs font-bold self-start mr-12 animate-in fade-in duration-1000">AI: "Hi Sarah! This is Elite Plumbing. We missed your call. Need help with a leak or a quote?"</div>
                 <div className="p-3 bg-white/10 rounded-xl text-xs font-bold self-end ml-12 text-right">Sarah: "Got a burst pipe in the kitchen!"</div>
                 <div className="p-3 bg-blue-600 rounded-xl text-xs font-bold self-start mr-12 animate-in fade-in delay-500">AI: "Emergency handled. Our tech Mark can be there at 2 PM. Confirm booking?"</div>
              </div>
           </div>
        </div>
      </section>

      {/* 5. Core Features (Bento) */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="p-10 rounded-[32px] bg-white border border-slate-200">
              <Clock className="text-blue-600 mb-6" />
              <h4 className="font-bold mb-2">Instant Response</h4>
              <p className="text-slate-500 text-xs">Text-back triggers in under 60 seconds, guaranteed.</p>
           </div>
           <div className="p-10 rounded-[32px] bg-white border border-slate-200">
              <MessageSquare className="text-blue-600 mb-6" />
              <h4 className="font-bold mb-2">Intent Detection</h4>
              <p className="text-slate-500 text-xs">AI understands "Emergency" vs "General Inquiry".</p>
           </div>
           <div className="p-10 rounded-[32px] bg-white border border-slate-200">
              <TrendingUp className="text-blue-600 mb-6" />
              <h4 className="font-bold mb-2">ROI Tracker</h4>
              <p className="text-slate-500 text-xs">Track every dollar recovered from missed calls.</p>
           </div>
        </div>
      </section>

      {/* 6. ROI (Data) */}
      <section className="py-24 px-6 text-center">
         <div className="text-6xl font-black text-blue-600 mb-4">$72,000+</div>
         <p className="text-xl font-bold text-slate-900 mb-2">Average Annual Revenue Recovered</p>
         <p className="text-slate-400 text-sm italic">*Based on 20 missed calls/mo at $300 avg job value.</p>
      </section>

      {/* 7. Final Push (CTA) */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto rounded-[40px] bg-blue-600 p-12 text-center text-white shadow-2xl">
          <h2 className="text-3xl font-black mb-6">Stop Leaving Money on the Table.</h2>
          <button className="px-10 py-5 bg-white text-blue-600 rounded-2xl font-black text-lg hover:scale-105 transition-all shadow-xl">Get Started with MCTB</button>
        </div>
      </section>
    </main>
  );
}
