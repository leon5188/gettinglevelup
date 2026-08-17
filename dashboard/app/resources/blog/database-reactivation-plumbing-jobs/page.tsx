import { Calendar, User, ArrowLeft, Clock, AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function BlogDatabaseReactivationPlumbingJobs() {
  return (
    <main className="min-h-screen bg-white pb-20">
      <article className="pt-40 px-6 max-w-4xl mx-auto">
        <Link href="/resources/blog" className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-blue-600 mb-12 transition-colors">
          <ArrowLeft size={16} /> Back to Blog
        </Link>
        
        <header className="mb-16">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 leading-tight">
             The Goldmine in Your CRM: How to Generate 20+ Plumbing Jobs from Old Leads
          </h1>
          <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 font-medium">
             <div className="flex items-center gap-2"><User size={16} /> Leon</div>
             <div className="flex items-center gap-2"><Calendar size={16} /> Jun 25, 2026</div>
             <div className="flex items-center gap-2"><Clock size={16} /> 2 min read</div>
          </div>
        </header>

        {"/* Featured Image Placeholder */"}
        <div className="w-full aspect-[21/9] bg-emerald-50 rounded-[40px] mb-16 flex items-center justify-center border border-emerald-100 relative overflow-hidden">
           <div className="text-sm font-bold text-emerald-300 uppercase tracking-widest italic">[ Visual: Bento chart showing client database reactivation metrics ]</div>
        </div>

        <div className="prose prose-slate prose-lg max-w-none text-slate-600">
          <p className="text-xl text-slate-600 leading-relaxed mb-8">The cost of acquiring a new plumbing client via Google Local Services Ads or pay-per-click is rising every year. Many shop owners spend $80 to $120 just to get the phone to ring. Yet, they sit on a database of 1,000+ past customers and unconverted leads, letting that valuable data gather digital dust.</p>
          <p className="mb-8">Your existing client list is a goldmine. With a <strong>Database Reactivation (DBR) campaign</strong>, you can generate dozens of high-margin service calls in 48 hours without spending a single dollar on new ads.</p>
          <p className="mb-8">Let's explore the step-by-step strategy to reactivate your cold contacts.</p>
          <h2 className="text-3xl font-black mb-6 text-slate-900">The Power of Warm Lists</h2>
          <p className="mb-8">A past customer already knows your brand, has had a plumber in their home, and has paid your invoice. They are ten times more likely to buy from you again than a stranger searching Google.</p>
          <p className="mb-8">However, homeowners don't think about their plumbing until something breaks. A database reactivation campaign gently reminds them that you exist, prompting them to book routine maintenance they've been putting off (like water heater flushes or drain cleaning inspections).</p>
          <h2 className="text-3xl font-black mb-6 text-slate-900">The 3-Step Database Reactivation Campaign</h2>
          <p className="mb-8">To run a successful reactivation campaign, you need a highly targeted, personal SMS sequence. Emails get ignored; text messages have a <strong>98% open rate</strong>.</p>
          <p className="mb-8">Here is the exact playbook to run:</p>
          <h3 className="text-2xl font-black mb-4 text-slate-900">Step 1: Segment Your List</h3>
          <p className="mb-8">Don’t blast your entire list with the same text. Segment your database into:</p>
          <ul className="list-disc pl-6 mb-8 space-y-3">
            <li>  Past customers who haven't booked in 12+ months.</li>
            <li>  Leads who requested a quote but never scheduled the work.</li>
            <li>  Homeowners with older tank water heaters (prime targets for flushes or upgrades).</li>
          </ul>
          <h3 className="text-2xl font-black mb-4 text-slate-900">Step 2: The Soft-Ask SMS Campaign</h3>
          <p className="mb-8">Send a short, personal text that doesn't feel like a corporate advertisement. It should look like it was sent manually by your office coordinator:</p>
          <blockquote className="border-l-4 border-emerald-500 pl-4 py-2 italic bg-slate-50 text-slate-800 mb-8 rounded-r-lg">
            "Hey [Name], this is Leon from Plumbify. We are running a neighborhood water heater safety checkup this week and have 3 slots open for our past clients at 50% off. Do you want to schedule a quick flush to clear out sediment before summer?"
          </blockquote>
          <h3 className="text-2xl font-black mb-4 text-slate-900">Step 3: Fast Lead Capture</h3>
          <p className="mb-8">When a customer replies "Yes" or "How much?", your CRM must instantly route the text to your AI assistant. The AI can answer pricing questions, collect their address, and send a booking link to finalize the slot.</p>
          <div className="p-8 rounded-3xl bg-emerald-600 text-white flex items-center gap-8 mb-12">
            <AlertTriangle size={64} className="text-emerald-200 shrink-0" />
            <div>
              <h4 className="text-xl font-bold mb-2">Why Soft-Selling Wins</h4>
              <p className="text-emerald-100 text-sm">High-pressure sales texts get marked as spam. A friendly, low-commitment question ("Do you want to schedule a quick flush?") starts a conversation, leading to booking rates three times higher than generic promotion alerts.</p>
            </div>
          </div>
          <p className="mb-8">By tapping into your existing list twice a year (such as pre-winter and pre-summer), you can keep your schedule full during slow seasons, secure recurring maintenance revenue, and maximize the lifetime value of every contact in your database.</p>
        </div>

        <div className="mt-20 p-10 rounded-[40px] bg-slate-900 text-white text-center">
           <h3 className="text-2xl font-black mb-4">Reactivate Your Cold Contacts</h3>
           <p className="mb-8 text-slate-400">Upload your old customer list and let Plumbify text them a custom offer. Reclaim lost revenue on autopilot.</p>
           <Link href="/pricing" className="inline-block px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl font-bold transition-all">
             Start Reactivation Campaign
           </Link>
        </div>
      </article>
    </main>
  );
}
