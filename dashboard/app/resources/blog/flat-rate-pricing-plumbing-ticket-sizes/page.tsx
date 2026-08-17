import { Calendar, User, ArrowLeft, Clock, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function BlogFlatRatePricingPlumbingTicketSizes() {
  return (
    <main className="min-h-screen bg-white pb-20">
      <article className="pt-40 px-6 max-w-4xl mx-auto">
        <Link href="/resources/blog" className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-blue-600 mb-12 transition-colors">
          <ArrowLeft size={16} /> Back to Blog
        </Link>
        
        <header className="mb-16">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 leading-tight">
             Why Flat-Rate Pricing Wins: Scaling Your Plumbing Ticket Sizes
          </h1>
          <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 font-medium">
             <div className="flex items-center gap-2"><User size={16} /> James Miller</div>
             <div className="flex items-center gap-2"><Calendar size={16} /> Jul 13, 2026</div>
             <div className="flex items-center gap-2"><Clock size={16} /> 2 min read</div>
          </div>
        </header>

        {"/* Featured Image Placeholder */"}
        <div className="w-full aspect-[21/9] bg-purple-50 rounded-[40px] mb-16 flex items-center justify-center border border-purple-100 relative overflow-hidden">
           <div className="text-sm font-bold text-purple-300 uppercase tracking-widest italic">[ Visual: Tiered pricing option card mockup ]</div>
        </div>

        <div className="prose prose-slate prose-lg max-w-none text-slate-600">
          <p className="text-xl text-slate-600 leading-relaxed mb-8">Many residential plumbing shops still bill their clients using the traditional Time & Materials (T&M) model: <em>"We charge $120 an hour plus the cost of parts."</em> While this pricing model seems simple, it actively limits your growth, caps your profit margins, and causes friction with customers.</p>
          <p className="mb-8">To scale your plumbing business and increase your average ticket size, you must transition to a <strong>Flat-Rate Pricing model</strong> presented through clean digital menus.</p>
          <p className="mb-8">Let's explore why flat-rate pricing wins and how it increases average ticket sizes by 35%.</p>
          <h2 className="text-3xl font-black mb-6 text-slate-900">The Problems with Time & Materials Billing</h2>
          <p className="mb-8">Hourly billing creates a conflict of interest between you and the customer.</p>
          <ul className="list-disc pl-6 mb-8 space-y-3">
            <li>  <strong>The Speed Penalty:</strong> Under an hourly model, your fastest, most skilled technicians make the <em>least</em> money because they finish jobs quickly. Your slowest, least efficient techs make the <em>most</em> money.</li>
            <li>  <strong>Billing Anxiety:</strong> The customer stands over the plumber's shoulder, watching the clock and worrying about the final price. This leads to awkward billing disputes at the kitchen table.</li>
            <li>  <strong>Undercharged Parts:</strong> Technicians are notoriously bad at tracking and billing for small parts like couplings, flux, or Teflon tape. These unbilled materials quietly eat up your gross profit margins.</li>
          </ul>
          <h2 className="text-3xl font-black mb-6 text-slate-900">The Power of Flat-Rate Pricing</h2>
          <p className="mb-8">Flat-rate pricing lists a fixed, up-front price for every job: <em>"Clearing a main drain costs $245, regardless of how long it takes."</em></p>
          <p className="mb-8">This model changes the psychology of the sale:</p>
          <ol className="list-decimal pl-6 mb-8 space-y-3">
            <li> <strong>Price Transparency:</strong> The customer knows the exact cost before work begins. This removes billing anxiety and builds trust.</li>
            <li> <strong>Reward Efficiency:</strong> Your fast technicians can complete more jobs per day, increasing their productivity and your company's daily revenue.</li>
            <li> <strong>Baked-In Margins:</strong> The flat-rate price already accounts for average drive times, material costs, clean-up, and company overhead, protecting your net profit margins.</li>
          </ol>
          <h2 className="text-3xl font-black mb-6 text-slate-900">The Tiered Menu Strategy: Standardizing Sales</h2>
          <p className="mb-8">To maximize your ticket size, your field service app should present options in a Good-Better-Best format on a tablet:</p>
          <ul className="list-disc pl-6 mb-8 space-y-3">
            <li>  <strong>Option 1 (Good - Fix the Problem):</strong> Clear the sewer line block. ($245)</li>
            <li>  <strong>Option 2 (Better - Solve the Root Cause):</strong> Clear the block and run a camera inspection to check for root intrusion. ($395)</li>
            <li>  <strong>Option 3 (Best - Prevent Future Issues):</strong> Clear the block, run a camera inspection, and apply a chemical root preventative treatment with a 1-year warranty. ($595)</li>
          </ul>
          <div className="p-8 rounded-3xl bg-purple-600 text-white flex items-center gap-8 mb-12">
            <ShieldCheck size={64} className="text-purple-200 shrink-0" />
            <div>
              <h4 className="text-xl font-bold mb-2">The Power of Choice</h4>
              <p className="text-purple-100 text-sm">Data shows that <strong>40% of residential service clients will choose the middle or top option</strong> if they are presented side-by-side on a digital menu. By simply offering options, your technicians increase their average ticket size without high-pressure sales pitches.</p>
            </div>
          </div>
          <p className="mb-8">Standardize your pricing, empower your technicians with digital menus, and watch your margins climb.</p>
        </div>

        <div className="mt-20 p-10 rounded-[40px] bg-slate-900 text-white text-center">
           <h3 className="text-2xl font-black mb-4">Maximize Your Ticket Sizes</h3>
           <p className="mb-8 text-slate-400">Implement flat-rate menu pricing on your technicians' tablets. Let Plumbify standardise your sales proposals.</p>
           <Link href="/pricing" className="inline-block px-8 py-4 bg-purple-500 hover:bg-purple-400 text-white rounded-xl font-bold transition-all">
             Explore Pricing Features
           </Link>
        </div>
      </article>
    </main>
  );
}
