import { Calendar, User, ArrowLeft, Clock, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function BlogGrowPlumbingBusinessPlaybook() {
  return (
    <main className="min-h-screen bg-white pb-20">
      <article className="pt-40 px-6 max-w-4xl mx-auto">
        <Link href="/resources/blog" className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-blue-600 mb-12 transition-colors">
          <ArrowLeft size={16} /> Back to Blog
        </Link>
        
        <header className="mb-16">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 leading-tight">
             The 2026 Guide to Scaling a Plumbing Business
          </h1>
          <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 font-medium">
             <div className="flex items-center gap-2"><User size={16} /> James Miller</div>
             <div className="flex items-center gap-2"><Calendar size={16} /> Jun 10, 2026</div>
             <div className="flex items-center gap-2"><Clock size={16} /> 4 min read</div>
          </div>
        </header>

        {"/* Featured Image Placeholder */"}
        <div className="w-full aspect-[21/9] bg-blue-50 rounded-[40px] mb-16 flex items-center justify-center border border-blue-100 relative overflow-hidden">
           <div className="text-sm font-bold text-blue-300 uppercase tracking-widest italic">[ Visual: Team of Plumbers with Service Vans ]</div>
        </div>

        <div className="prose prose-slate prose-lg max-w-none text-slate-600">
          <p className="text-xl text-slate-600 leading-relaxed mb-8">Let’s get one thing straight: word-of-mouth will keep your schedule steady, but it will never build an enterprise. If you are running three trucks and want to scale to ten, relying solely on referrals from old customers is a slow road. To grow a plumbing business today, you have to transition from being the "master plumber who owns a business" to a "business executive who happens to run a plumbing company."</p>
          <p className="mb-8">In this guide, we’re laying out the exact playbook for scaling your field operations, systemizing your marketing, and securing the technicians you need to keep those trucks rolling.</p>
          <h2 className="text-3xl font-black mb-6 text-slate-900">1. Shift Your Marketing from Passive to Predictable</h2>
          <p className="mb-8">If you want to add trucks to your fleet, you need a predictable tap of inbound leads. You can't wait for pipes to burst; you need to buy lead volume. The modern plumbing company marketing mix relies heavily on two primary digital channels:</p>
          <ul className="list-disc pl-6 mb-8 space-y-3">
            <li>  <strong>Google Local Services Ads (LSAs):</strong> These are the "Google Screened" ads at the very top of search results. Unlike pay-per-click (PPC), where you pay for clicks that might not turn into anything, LSAs charge you per phone call or booking. If a lead is spam or out of your service area, you can dispute the charge.</li>
            <li>  <strong>Hyper-Local Search Engine Optimization (SEO):</strong> When homeowners search for "clogged drain emergency near me" or "water heater replacement [your city]," the top spots on the organic map pack take 40% of the clicks. If your Google Business Profile doesn't have 100+ fresh reviews and clean service locations, you are leaving thousands on the table.</li>
          </ul>
          <h2 className="text-3xl font-black mb-6 text-slate-900">2. The Truck-to-Office Ratio: Systemizing Your Operations</h2>
          <p className="mb-8">A common mistake plumbing owners make is scaling their office staff too quickly. They hire dispatchers, billing coordinators, and secretaries, which eats up their margins. A healthy residential plumbing business should aim for a ratio of 5 to 6 trucks per single office employee.</p>
          <p className="mb-8">How do you achieve that? By using specialized plumbing business software to automate the busywork. Your dispatching system should automatically route jobs based on traffic and technician skill set, text customers a tracking link when the tech is en route, and draft invoices directly from the field. If your office staff is manually copy-pasting customer details from a calendar into an invoicing tool, your systems are broken.</p>
          <div className="p-8 rounded-3xl bg-blue-600 text-white flex items-center gap-8 mb-12">
            <TrendingUp size={64} className="text-blue-200 shrink-0" />
            <div>
              <h4 className="text-xl font-bold mb-2">The Golden Rule of Field Service Operations</h4>
              <p className="text-blue-100 text-sm">Every time a human in the office has to manually update a status, type an address, or call a tech to ask if they finished a job, you lose about $15 in hidden labor costs. Automating these steps directly impacts your net profit margin.</p>
            </div>
          </div>
          <h2 className="text-3xl font-black mb-6 text-slate-900">3. Solve the Real Bottleneck: Hiring Plumbing Technicians</h2>
          <p className="mb-8">You can buy trucks and buy leads, but you can’t buy licenses. The real limit on your growth rate is the size of your technician team. Good plumbers are rarely looking for work; they are already employed elsewhere.</p>
          <p className="mb-8">To attract top-tier talent, your recruiting strategy needs to look different:</p>
          <ol className="list-decimal pl-6 mb-8 space-y-3">
            <li> <strong>Focus on the Quality of Life:</strong> Offer modern vans, newer tools, iPad dispatching, and a clear path to licensing. Plumbers hate paperwork and bad tools. Highlight your modern workflows in your job postings.</li>
            <li> <strong>Fast Vetting:</strong> If a qualified plumber applies for a job and you wait three days to call them, they’ve already taken a job with your competitor. Use automated applicant screening to instantly text them pre-screening questions, collect their license details, and book them onto your calendar for an interview within 30 minutes of applying.</li>
            <li> <strong>A Clear Commission Structure:</strong> Move away from flat hourly rates. Good technicians love a performance-based bonus structure (such as a percentage of the overall ticket value or bonuses for getting customer reviews).</li>
          </ol>
          <h2 className="text-3xl font-black mb-6 text-slate-900">4. Stabilize Cash Flow with Invoicing Automation</h2>
          <p className="mb-8">Cash flow is the oxygen of a growing plumbing company. If your technicians wait until the end of the week to submit their paper invoices, you are constantly playing catch-up. Your techs must collect payment at the job site. Implementing mobile tap-to-pay and digital invoice signatures before the van leaves the customer's driveway drops your Accounts Receivable aging days to zero.</p>
          <p className="mb-8">Scaling a plumbing business isn't about working harder in the field. It’s about building a digital machine that feeds your trucks with leads, automates dispatching, screens new hires on autopilot, and collects cash instantly. Keep your techs turning wrenches, and let software do the heavy lifting in the office.</p>
        </div>

        <div className="mt-20 p-10 rounded-[40px] bg-slate-900 text-white text-center">
           <h3 className="text-2xl font-black mb-4">Ready to Automate Your Office?</h3>
           <p className="mb-8 text-slate-400">Put your plumbing operations on autopilot. Let Plumbify handle your lead tracking, scheduling, and billing.</p>
           <Link href="/pricing" className="inline-block px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all">
             Explore Growth Systems
           </Link>
        </div>
      </article>
    </main>
  );
}
