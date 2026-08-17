import { Calendar, Clock, Bell, CheckCircle2, ArrowRight, ShieldCheck } from "lucide-react";

export default function AppointmentBooking() {
  return (
    <main className="min-h-screen bg-white">
      {/* 1. The Hook (Hero) */}
      <section className="pt-40 pb-20 px-6 bg-emerald-50 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-600 text-xs font-black mb-6 uppercase">Smart Booking</div>
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8">
          Fill Your Tech's Calendar <br /><span className="text-emerald-600">Without Picking Up the Phone.</span>
        </h1>
        <p className="max-w-2xl mx-auto text-xl text-slate-500 mb-10">24/7 self-service booking that integrates directly with your existing field software.</p>
        <button className="px-10 py-5 bg-emerald-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-emerald-200">Book More Jobs Now</button>
      </section>

      {/* 2. The Proof */}
      <section className="py-12 border-y border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-12 opacity-40 grayscale filter">
           <div className="text-2xl font-black italic">HOUSTON DRAINS</div>
           <div className="text-2xl font-black italic">FAST FLOW</div>
           <div className="text-2xl font-black italic">VIP PLUMBING</div>
        </div>
      </section>

      {/* 3. The Problem */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12">
           <div className="p-10 rounded-[32px] bg-slate-50">
              <h4 className="text-slate-400 font-bold mb-4 uppercase tracking-widest text-xs">The Manual Way</h4>
              <p className="text-slate-600 text-sm">Customer calls &gt; On hold for 3 mins &gt; Dispatcher checks 5 calendars &gt; Manual entry &gt; Confirmation text manually sent.</p>
           </div>
           <div className="p-10 rounded-[32px] bg-emerald-50 border border-emerald-100">
              <h4 className="text-emerald-600 font-bold mb-4 uppercase tracking-widest text-xs">The Plumbify Way</h4>
              <p className="text-slate-600 text-sm">Customer books on your site &gt; System checks live tech availability &gt; Job auto-synced to ServiceTitan/Housecall &gt; Auto-reminders sent.</p>
           </div>
        </div>
      </section>

      {/* 4. The Demo (Visual UI) */}
      <section className="py-20 px-6 bg-slate-900 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
           <div className="bg-white rounded-[40px] p-8 shadow-2xl scale-110 rotate-3">
              <div className="flex justify-between items-center mb-8">
                 <div className="font-black text-slate-900">Select Time</div>
                 <div className="text-[10px] bg-emerald-100 text-emerald-600 px-2 py-1 rounded font-black">LIVE SYNC</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 {["8:00 AM", "10:00 AM", "1:00 PM", "3:00 PM"].map(t => (
                   <div key={t} className="p-4 border border-slate-100 rounded-2xl text-center font-bold text-slate-400 hover:bg-emerald-500 hover:text-white transition-all cursor-pointer">{t}</div>
                 ))}
              </div>
           </div>
           <div>
              <h2 className="text-4xl font-black mb-6">Your Website Is Now Your Best Dispatcher.</h2>
              <p className="text-slate-400 text-lg mb-8">Give customers the Amazon-like experience of booking a service in 3 clicks.</p>
           </div>
        </div>
      </section>

      {/* 5. Core Features (Bento) */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="p-10 rounded-[32px] bg-white border border-slate-200">
              <Calendar className="text-emerald-500 mb-6" />
              <h4 className="font-bold mb-2">24/7 Booking</h4>
              <p className="text-slate-500 text-xs">Fill your schedule while you sleep.</p>
           </div>
           <div className="p-10 rounded-[32px] bg-white border border-slate-200">
              <Bell className="text-emerald-500 mb-6" />
              <h4 className="font-bold mb-2">Auto-Reminders</h4>
              <p className="text-slate-500 text-xs">SMS and Email reminders sent automatically.</p>
           </div>
           <div className="p-10 rounded-[32px] bg-white border border-slate-200">
              <ShieldCheck className="text-emerald-500 mb-6" />
              <h4 className="font-bold mb-2">No-Show Protection</h4>
              <p className="text-slate-500 text-xs">Optionally collect deposits at booking.</p>
           </div>
        </div>
      </section>

      {/* 6. ROI (Data) */}
      <section className="py-24 px-6 text-center">
         <div className="text-6xl font-black text-emerald-500 mb-4">35%</div>
         <p className="text-xl font-bold text-slate-900 mb-2">Reduction in No-Show Rates</p>
         <p className="text-slate-400 text-sm italic">*Based on automated 24h and 1h reminders.</p>
      </section>

      {/* 7. Final Push (CTA) */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto rounded-[40px] bg-emerald-600 p-12 text-center text-white shadow-2xl">
          <h2 className="text-3xl md:text-4xl font-black mb-6">Let Your Customers Book 24/7.</h2>
          <button className="px-10 py-5 bg-white text-emerald-600 rounded-2xl font-black text-lg hover:scale-105 transition-all shadow-xl">Activate Smart Booking</button>
        </div>
      </section>
    </main>
  );
}
