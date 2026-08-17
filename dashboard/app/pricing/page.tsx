"use client";
import { useState } from "react";
import { CheckCircle2, AlertCircle, HelpCircle, ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
  { q: "Is there a setup fee?", a: "No. We believe in earning your business. You can set up your account for free during the 14-day trial." },
  { q: "What are the A2P/SMS costs?", a: "Text messages are billed at $0.0079 per segment. AI Voice calls are $0.05/min. These are pass-through costs from the carriers with zero markup from us." },
  { q: "What is the 10DLC registration fee?", a: "There is a one-time $15-$20 brand registration fee and a $1.50 - $10/mo campaign fee, required by mobile carriers to ensure your texts aren't blocked." },
  { q: "Can I cancel anytime?", a: "Yes. There are no long-term contracts. If you aren't happy, you can cancel with one click from your dashboard." }
];

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const starterUrl = process.env.NEXT_PUBLIC_STARTER_CHECKOUT_URL || "#";
  const growthUrl = process.env.NEXT_PUBLIC_GROWTH_CHECKOUT_URL || "#";
  const strategyUrl = process.env.NEXT_PUBLIC_STRATEGY_BOOKING_URL || "#";

  const prices = {
    starter: billingPeriod === "monthly" ? 197 : 157,
    growth: billingPeriod === "monthly" ? 397 : 317
  };

  return (
    <main className="min-h-screen bg-white pb-20">
      {/* Hero */}
      <section className="pt-32 pb-20 px-6 bg-slate-50 text-center">
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">Simple, Transparent <br /><span className="text-blue-600">Growth Plans.</span></h1>
        <p className="text-xl text-slate-500 mb-12">Choose the plan that fits your truck count and growth goals.</p>
        
        {/* Toggle */}
        <div className="flex items-center justify-center gap-4 mb-16">
          <span className={`text-sm font-bold ${billingPeriod === "monthly" ? "text-slate-900" : "text-slate-400"}`}>Monthly</span>
          <button 
            onClick={() => setBillingPeriod(billingPeriod === "monthly" ? "yearly" : "monthly")}
            className="w-14 h-8 bg-slate-200 rounded-full relative p-1 transition-all"
          >
            <div className={`w-6 h-6 bg-blue-600 rounded-full transition-all ${billingPeriod === "yearly" ? "translate-x-6" : "translate-x-0"}`}></div>
          </button>
          <span className={`text-sm font-bold ${billingPeriod === "yearly" ? "text-slate-900" : "text-slate-400"}`}>
            Yearly <span className="text-emerald-500 text-[10px] uppercase ml-1">Save 20%</span>
          </span>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="px-6 -mt-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Starter */}
          <div className="p-10 rounded-[40px] bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">Starter</h3>
              <p className="text-slate-400 text-sm mb-8">For solo plumbers or teams up to 3.</p>
              <div className="text-5xl font-black mb-8">${prices.starter}<span className="text-sm text-slate-400 font-medium">/mo</span></div>
              <ul className="space-y-4 mb-10">
                <li className="flex items-center gap-3 text-sm text-slate-600"><CheckCircle2 size={18} className="text-blue-600" /> Speed to Lead AI</li>
                <li className="flex items-center gap-3 text-sm text-slate-600"><CheckCircle2 size={18} className="text-blue-600" /> Smart Calendar Booking</li>
                <li className="flex items-center gap-3 text-sm text-slate-600"><CheckCircle2 size={18} className="text-blue-600" /> Mobile Tap to Pay</li>
              </ul>
            </div>
            <a 
              href={starterUrl} 
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-slate-800 transition-all text-center block"
            >
              Start 14-Day Free Trial
            </a>
          </div>

          {/* Growth */}
          <div className="p-10 rounded-[40px] bg-slate-900 text-white shadow-2xl flex flex-col justify-between relative scale-105 border-4 border-blue-600">
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-6 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Most Popular</div>
            <div>
              <h3 className="text-xl font-bold mb-2">Growth</h3>
              <p className="text-slate-400 text-sm mb-8">For scaling companies with 5-15 trucks.</p>
              <div className="text-5xl font-black mb-8">${prices.growth}<span className="text-sm text-slate-400 font-medium">/mo</span></div>
              <ul className="space-y-4 mb-10">
                <li className="flex items-center gap-3 text-sm text-blue-100"><CheckCircle2 size={18} className="text-blue-400" /> Everything in Starter</li>
                <li className="flex items-center gap-3 text-sm text-blue-100"><CheckCircle2 size={18} className="text-blue-400" /> AI Recruiting Assistant</li>
                <li className="flex items-center gap-3 text-sm text-blue-100"><CheckCircle2 size={18} className="text-blue-400" /> Database Reactivation</li>
                <li className="flex items-center gap-3 text-sm text-blue-100"><CheckCircle2 size={18} className="text-blue-400" /> Advanced GHL Automations</li>
              </ul>
            </div>
            <a 
              href={growthUrl} 
              className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-500 transition-all text-center block"
            >
              Start Your Growth Engine
            </a>
          </div>

          {/* Enterprise */}
          <div className="p-10 rounded-[40px] bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">Enterprise</h3>
              <p className="text-slate-400 text-sm mb-8">For multi-location empires with 20+ trucks.</p>
              <div className="text-5xl font-black mb-8">Custom</div>
              <ul className="space-y-4 mb-10">
                <li className="flex items-center gap-3 text-sm text-slate-600"><CheckCircle2 size={18} className="text-blue-600" /> Dedicated Account Manager</li>
                <li className="flex items-center gap-3 text-sm text-slate-600"><CheckCircle2 size={18} className="text-blue-600" /> Custom AI Training</li>
                <li className="flex items-center gap-3 text-sm text-slate-600"><CheckCircle2 size={18} className="text-blue-600" /> White-Glove Onboarding</li>
              </ul>
            </div>
            <a 
              href={strategyUrl} 
              className="w-full py-4 border-2 border-slate-900 text-slate-900 rounded-2xl font-black hover:bg-slate-900 hover:text-white transition-all text-center block"
            >
              Talk to Strategy Team
            </a>
          </div>
        </div>
      </section>

      {/* Usage-Based Disclosure */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto p-8 rounded-3xl bg-blue-50 border border-blue-100 flex gap-6 items-start">
           <AlertCircle className="text-blue-600 shrink-0" size={24} />
           <div>
              <h4 className="font-bold mb-2">Usage-Based Costs & Transparency</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                To keep our monthly subscriptions low, we pass through telecom costs without markup. Texting, calling, and 10DLC registration fees are billed directly based on your usage. Most plumbing companies spend between $20 - $100/mo on these fees depending on call volume. <strong>No hidden margins. Total transparency.</strong>
              </p>
           </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-black mb-12 text-center flex items-center justify-center gap-4">
             <HelpCircle className="text-blue-600" /> Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                <button 
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-8 py-6 text-left flex justify-between items-center hover:bg-slate-50 transition-colors"
                >
                  <span className="font-bold text-slate-900">{faq.q}</span>
                  {openFaq === i ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                {openFaq === i && (
                  <div className="px-8 pb-6 text-slate-500 text-sm animate-in slide-in-from-top-2 duration-300">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
