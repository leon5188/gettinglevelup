import { Calendar, User, ArrowLeft, Clock, Share2 } from "lucide-react";
import Link from "next/link";

export default function BlogTapToPayPlumbersCashFlow() {
  return (
    <main className="min-h-screen bg-white pb-20">
      <article className="pt-40 px-6 max-w-4xl mx-auto">
        <Link href="/resources/blog" className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-blue-600 mb-12 transition-colors">
          <ArrowLeft size={16} /> Back to Blog
        </Link>
        
        <header className="mb-16">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 leading-tight">
             Tap-to-Pay for Plumbers: Accelerating Cash Flow from the Service Drive
          </h1>
          <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 font-medium">
             <div className="flex items-center gap-2"><User size={16} /> James Miller</div>
             <div className="flex items-center gap-2"><Calendar size={16} /> Jun 29, 2026</div>
             <div className="flex items-center gap-2"><Clock size={16} /> 2 min read</div>
          </div>
        </header>

        {"/* Featured Image Placeholder */"}
        <div className="w-full aspect-[21/9] bg-blue-50 rounded-[40px] mb-16 flex items-center justify-center border border-blue-100 relative overflow-hidden">
           <div className="text-sm font-bold text-blue-300 uppercase tracking-widest italic">[ Visual: Smartphone screen showing contactless card transaction ]</div>
        </div>

        <div className="prose prose-slate prose-lg max-w-none text-slate-600">
          <p className="text-xl text-slate-600 leading-relaxed mb-8">Cash flow is the oxygen of any trade service business. If your plumbing shop relies on technicians writing parts on paper invoices and waiting for the office to email bills at the end of the week, your cash flow is leaking. You are effectively acting as an interest-free bank for your customers.</p>
          <p className="mb-8">To scale your plumbing business, you must collect payments before the service van leaves the customer's driveway. With <strong>Tap-to-Pay technology</strong>, your technicians can collect payments instantly using their mobile phones.</p>
          <p className="mb-8">Here is how Tap-to-Pay accelerates cash flow and protects your margins.</p>
          <h2 className="text-3xl font-black mb-6 text-slate-900">The Cost of Delayed Billing</h2>
          <p className="mb-8">When you allow a customer to pay "later," your Accounts Receivable (AR) aging starts.</p>
          <ul className="list-disc pl-6 mb-8 space-y-3">
            <li>  <strong>Collection Lag:</strong> The average plumbing invoice sent via email takes 12 days to be paid. Some drag on for 30 to 60 days, requiring manual phone follow-ups from your office staff.</li>
            <li>  <strong>The Forgetfulness Factor:</strong> Customers are most willing to pay when the work is freshly finished and their water is running again. Once you leave, the urgency disappears, and they begin to haggle over prices.</li>
            <li>  <strong>Hidden Labor Costs:</strong> Every invoice your office staff has to follow up on costs your business approximately $15 in administrative overhead.</li>
          </ul>
          <h2 className="text-3xl font-black mb-6 text-slate-900">The Solution: Mobile Tap-to-Pay</h2>
          <p className="mb-8">Tap-to-Pay eliminates the need for expensive, clunky card readers that constantly lose bluetooth connection on the job site. It allows technicians to accept contactless payments—including credit cards, Apple Pay, and Google Pay—directly on their standard smartphones or tablets.</p>
          <p className="mb-8">The workflow is simple:</p>
          <ol className="list-decimal pl-6 mb-8 space-y-3">
            <li> <strong>Generate Invoice:</strong> The tech builds the digital invoice on their tablet, selecting parts from a predefined pricing catalog.</li>
            <li> <strong>Present Price:</strong> The customer signs their approval on the screen.</li>
            <li> <strong>Tap to Collect:</strong> The customer taps their credit card or smartphone against the technician's device. Payment is processed instantly.</li>
          </ol>
          <div className="p-8 rounded-3xl bg-blue-600 text-white flex items-center gap-8 mb-12">
            <Share2 size={64} className="text-blue-200 shrink-0" />
            <div>
              <h4 className="text-xl font-bold mb-2">Immediate Cash Access</h4>
              <p className="text-blue-100 text-sm">"Contactless onsite payment reduces Accounts Receivable aging days to zero. Funds hit your business account within 24 hours, giving you the cash flow you need to purchase parts, pay technicians, and scale your fleet."</p>
            </div>
          </div>
          <h2 className="text-3xl font-black mb-6 text-slate-900">Protecting Customer Data & Trust</h2>
          <p className="mb-8">Homeowners are cautious about sharing credit card numbers over the phone or writing them down on paper forms. Tap-to-Pay uses secure, tokenized encryption. The customer’s financial details are never stored on the technician's device or visible to your staff, building trust and ensuring strict PCI compliance.</p>
          <p className="mb-8">Ditch the paper pads and bluetooth card readers. Move your plumbing shop to a contactless, mobile-first operating system, and secure your profits the second the wrench is put away.</p>
        </div>

        <div className="mt-20 p-10 rounded-[40px] bg-slate-900 text-white text-center">
           <h3 className="text-2xl font-black mb-4">Collect Cash Instantly</h3>
           <p className="mb-8 text-slate-400">Enable tap-to-pay on your technicians' devices. Let Plumbify deposit payments directly to your bank account.</p>
           <Link href="/pricing" className="inline-block px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all">
             Get Tap-to-Pay
           </Link>
        </div>
      </article>
    </main>
  );
}
