import { CreditCard, Smartphone, ShieldCheck, Receipt, ArrowRight, DollarSign, Wallet } from "lucide-react";

export default function MobilePOS() {
  return (
    <main className="min-h-screen bg-white">
      {/* 1. The Hook (Hero) */}
      <section className="pt-40 pb-20 px-6 bg-slate-900 text-white text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-black mb-6 uppercase border border-white/10">Mobile POS</div>
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8">
          Get Paid on the Spot. <br /><span className="text-blue-400">No Hardware Required.</span>
        </h1>
        <p className="max-w-2xl mx-auto text-xl text-slate-400 mb-10">Turn your phone into a secure card reader. Stop chasing checks and start collecting at the doorstep.</p>
        <button className="px-10 py-5 bg-blue-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-blue-500/20">Start Collecting Payments</button>
      </section>

      {/* 2. The Proof */}
      <section className="py-12 border-y border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-12 opacity-40 grayscale filter font-black italic text-2xl">
           <div>VISA</div>
           <div>MASTERCARD</div>
           <div>APPLE PAY</div>
           <div>GOOGLE PAY</div>
        </div>
      </section>

      {/* 3. The Problem */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12">
           <div className="p-10 rounded-[32px] bg-slate-50">
              <h4 className="text-slate-400 font-bold mb-4 uppercase tracking-widest text-xs">The Reader Headache</h4>
              <p className="text-slate-600 text-sm">Bluetooth reader won't connect &gt; Battery is dead &gt; Customer doesn't have cash &gt; You leave without payment &gt; "Check is in the mail."</p>
           </div>
           <div className="p-10 rounded-[32px] bg-blue-50 border border-blue-100">
              <h4 className="text-blue-600 font-bold mb-4 uppercase tracking-widest text-xs">The Tap to Pay Way</h4>
              <p className="text-slate-600 text-sm">Open Plumbify app &gt; Enter amount &gt; Customer taps card to YOUR phone &gt; Payment cleared &gt; Digital receipt sent instantly.</p>
           </div>
        </div>
      </section>

      {/* 4. The Demo (Visual UI) - Payment UI */}
      <section className="py-20 px-6 bg-slate-100">
        <div className="max-w-7xl mx-auto text-center">
           <h2 className="text-3xl font-black mb-12">Your Phone Is Now Your Terminal</h2>
           <div className="max-w-xs mx-auto bg-slate-800 rounded-[50px] border-[12px] border-slate-950 p-8 shadow-2xl relative">
              <div className="h-6 w-32 bg-slate-950 absolute top-0 left-1/2 -translate-x-1/2 rounded-b-3xl"></div>
              <div className="pt-12 text-center text-white">
                 <div className="text-4xl font-black mb-1">$450.00</div>
                 <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-10">Total Balance</div>
                 <div className="w-24 h-24 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-10 animate-pulse border border-blue-600/30">
                    <Smartphone className="text-blue-400" size={32} />
                 </div>
                 <div className="text-sm font-bold text-blue-400">Hold Card Near Phone</div>
              </div>
           </div>
           <div className="mt-8 text-xs font-bold text-slate-400 uppercase">Eliminate Reader Fees: <span className="text-emerald-500">Save $500/Year</span></div>
        </div>
      </section>

      {/* 5. Core Features (Bento) */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="p-10 rounded-[32px] bg-white border border-slate-200">
              <Smartphone className="text-blue-600 mb-6" />
              <h4 className="font-bold mb-2">Hardware-Free</h4>
              <p className="text-slate-500 text-xs">Uses your phone's built-in NFC sensor.</p>
           </div>
           <div className="p-10 rounded-[32px] bg-white border border-slate-200">
              <Receipt className="text-blue-600 mb-6" />
              <h4 className="font-bold mb-2">Instant Invoicing</h4>
              <p className="text-slate-500 text-xs">Professional PDF receipts via SMS/Email.</p>
           </div>
           <div className="p-10 rounded-[32px] bg-white border border-slate-200">
              <ShieldCheck className="text-blue-600 mb-6" />
              <h4 className="font-bold mb-2">Bank-Grade</h4>
              <p className="text-slate-500 text-xs">PCI compliant and fully encrypted.</p>
           </div>
        </div>
      </section>

      {/* 6. ROI (Data) */}
      <section className="py-24 px-6 text-center">
         <div className="text-6xl font-black text-slate-900 mb-4">100%</div>
         <p className="text-xl font-bold text-slate-900 mb-2">Collection Rate at Doorstep</p>
         <p className="text-slate-400 text-sm italic">*Stop waiting for checks and billing after the fact.</p>
      </section>

      {/* 7. Final Push (CTA) */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto rounded-[40px] bg-blue-600 p-12 text-center text-white shadow-2xl">
          <h2 className="text-3xl md:text-4xl font-black mb-6">Ditch the Reader. Get Paid Faster.</h2>
          <button className="px-10 py-5 bg-white text-blue-600 rounded-2xl font-black text-lg hover:scale-105 transition-all shadow-xl">Activate Tap to Pay</button>
        </div>
      </section>
    </main>
  );
}
