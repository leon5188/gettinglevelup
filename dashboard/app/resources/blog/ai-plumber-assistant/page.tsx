import { Calendar, User, ArrowLeft, Clock, Zap } from "lucide-react";
import Link from "next/link";

export default function BlogAiPlumberAssistant() {
  return (
    <main className="min-h-screen bg-white pb-20">
      <article className="pt-40 px-6 max-w-4xl mx-auto">
        <Link href="/resources/blog" className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-blue-600 mb-12 transition-colors">
          <ArrowLeft size={16} /> Back to Blog
        </Link>
        
        <header className="mb-16">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 leading-tight">
             How an AI Plumber Assistant Can Save You 20 Hours a Week
          </h1>
          <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 font-medium">
             <div className="flex items-center gap-2"><User size={16} /> Sarah Jenkins</div>
             <div className="flex items-center gap-2"><Calendar size={16} /> Oct 10, 2026</div>
             <div className="flex items-center gap-2"><Clock size={16} /> 2 min read</div>
          </div>
        </header>

        {"/* Featured Image Placeholder */"}
        <div className="w-full aspect-[21/9] bg-emerald-50 rounded-[40px] mb-16 flex items-center justify-center border border-emerald-100 relative overflow-hidden">
           <div className="text-sm font-bold text-emerald-300 uppercase tracking-widest italic">[ Visual: AI Assistant Mobile Interface ]</div>
        </div>

        <div className="prose prose-slate prose-lg max-w-none text-slate-600">
          <p className="text-xl text-slate-600 leading-relaxed mb-8">Are you still the one answering the phone at 8 PM to book a simple drain cleaning? Or spending your Sunday night manually screening resumes for a new helper? Running a plumbing shop often feels like running a call center while trying to turn wrenches at the same time.</p>
          <p className="mb-8">There's a better way. Let's look at how an AI Plumber Assistant acts as a digital office manager that never sleeps, helping you claw back 20+ hours of admin work every week.</p>
          <h2 className="text-3xl font-black mb-6 text-slate-900">The End of Manual Dispatching & Booking</h2>
          <p className="mb-8">An AI assistant integrates directly with your phone system, website, and scheduling calendar. When an emergency call comes in and you are under a sink, the AI receptionist can:</p>
          <ol className="list-decimal pl-6 mb-8 space-y-3">
            <li> <strong>Text Back Missed Calls:</strong> Send an instant SMS text-back within 30 seconds of a missed call.</li>
            <li> <strong>Qualify Leads:</strong> Ask the homeowner details about the problem (e.g., "Is it an emergency block or a routine service?", "Where is the leak located?").</li>
            <li> <strong>Book the Job:</strong> Provide the client with available dispatch windows, capture their credit card to hold the booking fee, and schedule the event directly on your dispatch calendar.</li>
          </ol>
          <p className="mb-8">This ensures you capture the customer immediately, stopping them from calling your competitors.</p>
          <h2 className="text-3xl font-black mb-6 text-slate-900">Automated Screening: The Recruitment Pipeline</h2>
          <p className="mb-8">Finding helper and journeyman plumbers is the biggest growth bottleneck in trade services. When you post an ad on Indeed, you are flooded with resumes, most of which lack the licensing or background checks you require.</p>
          <p className="mb-8">AI assistants can handle the initial phone and text screening. The AI texts applicants to ask:</p>
          <ul className="list-disc pl-6 mb-8 space-y-3">
            <li>  Do you have a valid Journeyman/Master Plumber license?</li>
            <li>  Do you have a clean driving record?</li>
            <li>  How many years of commercial/residential service experience do you have?</li>
          </ul>
          <p className="mb-8">The AI screens out unqualified applicants and schedules the top-tier candidates directly onto your calendar for an in-person interview.</p>
          <div className="p-8 rounded-3xl bg-emerald-600 text-white flex items-center gap-8 mb-12">
            <Zap size={64} className="text-emerald-200 shrink-0" />
            <div>
              <h4 className="text-xl font-bold mb-2">The 20-Hour Rule</h4>
              <p className="text-emerald-100 text-sm">By automating text-backs, lead qualification, booking, and applicant screening, our typical client saves 20+ hours of manual administrative work every single week, allowing them to focus on high-margin billing.</p>
            </div>
          </div>
          <h2 className="text-3xl font-black mb-6 text-slate-900">Why It's Not \"Just a Bot\"</h2>
          <p className="mb-8">In 2026, natural language AI understands intent. It knows that a "burst main line" requires immediate dispatch, whereas a "quoting on a bathroom remodel" is a sales lead that can be scheduled for later in the week.</p>
          <p className="mb-8">By handling the routine scheduling and customer follow-up, AI assistants free up your dispatcher to build relationships with commercial clients and manage inventory. Keep your techs turning wrenches, and let software do the heavy lifting in the office.</p>
        </div>

        <div className="mt-20 p-10 rounded-[40px] bg-slate-900 text-white text-center">
           <h3 className="text-2xl font-black mb-4">Reclaim Your Weekends</h3>
           <p className="mb-8 text-slate-400">Let Plumbify's AI Assistant handle the office while you handle the work.</p>
           <Link href="/pricing" className="inline-block px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl font-bold transition-all">
             Meet Your AI Assistant
           </Link>
        </div>
      </article>
    </main>
  );
}
