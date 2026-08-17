import { Calendar, User, ArrowLeft, Clock, Zap } from "lucide-react";
import Link from "next/link";

export default function BlogVettingPlumbingHelpersAutomation() {
  return (
    <main className="min-h-screen bg-white pb-20">
      <article className="pt-40 px-6 max-w-4xl mx-auto">
        <Link href="/resources/blog" className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-blue-600 mb-12 transition-colors">
          <ArrowLeft size={16} /> Back to Blog
        </Link>
        
        <header className="mb-16">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 leading-tight">
             Vetting Plumbing Helpers: Automating the Hiring Screening Process
          </h1>
          <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 font-medium">
             <div className="flex items-center gap-2"><User size={16} /> Sarah Jenkins</div>
             <div className="flex items-center gap-2"><Calendar size={16} /> Jul 06, 2026</div>
             <div className="flex items-center gap-2"><Clock size={16} /> 2 min read</div>
          </div>
        </header>

        {"/* Featured Image Placeholder */"}
        <div className="w-full aspect-[21/9] bg-emerald-50 rounded-[40px] mb-16 flex items-center justify-center border border-emerald-100 relative overflow-hidden">
           <div className="text-sm font-bold text-emerald-300 uppercase tracking-widest italic">[ Visual: Technician recruitment application tracking dashboard ]</div>
        </div>

        <div className="prose prose-slate prose-lg max-w-none text-slate-600">
          <p className="text-xl text-slate-600 leading-relaxed mb-8">Ask any plumbing business owner what is holding back their growth, and they won't say "leads" or "trucks." They will say "technicians." Finding licensed plumbers and reliable apprentices is the ultimate bottleneck in field services.</p>
          <p className="mb-8">However, hiring is an administrative nightmare. You post a job ad, get 80 applications, spend hours calling candidates who don't answer, only to find out the three who show up for interviews don't have a driver's license.</p>
          <p className="mb-8">Let's explore how to automate your recruitment screening to filter helper candidates on autopilot.</p>
          <h2 className="text-3xl font-black mb-6 text-slate-900">The Cost of Bad Hiring Pipelines</h2>
          <p className="mb-8">Every hour you or your dispatcher spends sorting through resumes or playing phone tag with applicants is an hour taken away from billing jobs.</p>
          <ul className="list-disc pl-6 mb-8 space-y-3">
            <li>  <strong>Response Speed:</strong> Just like leads, candidates are looking at multiple companies. If you take three days to review an application, the best helpers have already been hired by your competitor.</li>
            <li>  <strong>The Vetting Friction:</strong> You need to confirm basic requirements (valid license, clean background, trade school hours) before booking an interview. Doing this manually for every applicant eats up your week.</li>
          </ul>
          <h2 className="text-3xl font-black mb-6 text-slate-900">The Automated Recruitment Flow</h2>
          <p className="mb-8">By setting up a text-based applicant screening funnel, you can automate 90% of the vetting process:</p>
          <ol className="list-decimal pl-6 mb-8 space-y-3">
            <li> <strong>Job Application:</strong> The candidate applies on Indeed, ZipRecruiter, or your careers page.</li>
            <li> <strong>Instant SMS Trigger:</strong> Within 5 minutes of applying, the CRM triggers an automated pre-screening text:</li>
          </ol>
          <blockquote className="border-l-4 border-emerald-500 pl-4 py-2 italic bg-slate-50 text-slate-800 mb-8 rounded-r-lg">
            "Hey [First Name]! Thanks for applying for the Plumbing Helper role at Plumbify. To move your application forward, could you reply with how many years of trade experience you have?"
          </blockquote>
          <ol className="list-decimal pl-6 mb-8 space-y-3">
            <li> <strong>Dynamic Interview Booking:</strong> The bot analyzes their answers. If they meet your requirements (e.g. have a driver's license, clean background, 1+ years experience), it texts them a scheduling link:</li>
          </ol>
          <blockquote className="border-l-4 border-emerald-500 pl-4 py-2 italic bg-slate-50 text-slate-800 mb-8 rounded-r-lg">
            "Awesome! You meet all our basic requirements. Let's get a 15-minute call scheduled with our team. Pick a time that works best for you here: [Link]"
          </blockquote>
          <ol className="list-decimal pl-6 mb-8 space-y-3">
            <li> <strong>Automatic Rejection/Hold:</strong> If they don't meet the requirements, the system politely flags their application and sends a delay message, saving you from manual follow-ups.</li>
          </ol>
          <div className="p-8 rounded-3xl bg-emerald-600 text-white flex items-center gap-8 mb-12">
            <Zap size={64} className="text-emerald-200 shrink-0" />
            <div>
              <h4 className="text-xl font-bold mb-2">Screening on Autopilot</h4>
              <p className="text-emerald-100 text-sm">"By automated vetting, you filter out 80% of unqualified applicants before they ever hit your desk. You only spend your time talking to candidates who are qualified, licensed, and actively interested."</p>
            </div>
          </div>
          <h2 className="text-3xl font-black mb-6 text-slate-900">Build a Talent Pool for Slow Seasons</h2>
          <p className="mb-8">Even when you aren't actively hiring, you should keep your recruitment ads running. By building a talent database of pre-screened helpers and apprentices, you ensure that if a tech leaves or you add a truck to your fleet, you have a queue of vetted candidates ready to interview immediately.</p>
          <p className="mb-8">Stop managing applicant spreadsheets manually. Automate your recruitment funnel, capture the best talent in minutes, and keep your fleet rolling.</p>
        </div>

        <div className="mt-20 p-10 rounded-[40px] bg-slate-900 text-white text-center">
           <h3 className="text-2xl font-black mb-4">Automate Your Hiring Pipeline</h3>
           <p className="mb-8 text-slate-400">Instantly screen candidates via automated text flows. Only spend time interviewing the absolute best helpers.</p>
           <Link href="/pricing" className="inline-block px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl font-bold transition-all">
             Start Automated Hiring
           </Link>
        </div>
      </article>
    </main>
  );
}
