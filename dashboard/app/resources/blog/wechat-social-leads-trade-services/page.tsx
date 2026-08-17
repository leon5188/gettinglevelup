import { Calendar, User, ArrowLeft, Clock, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function BlogWechatSocialLeadsTradeServices() {
  return (
    <main className="min-h-screen bg-white pb-20">
      <article className="pt-40 px-6 max-w-4xl mx-auto">
        <Link href="/resources/blog" className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-blue-600 mb-12 transition-colors">
          <ArrowLeft size={16} /> Back to Blog
        </Link>
        
        <header className="mb-16">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 leading-tight">
             Capturing WeChat and Social Leads: The Untapped Pipeline for Trade Services
          </h1>
          <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 font-medium">
             <div className="flex items-center gap-2"><User size={16} /> Leon</div>
             <div className="flex items-center gap-2"><Calendar size={16} /> Jul 02, 2026</div>
             <div className="flex items-center gap-2"><Clock size={16} /> 2 min read</div>
          </div>
        </header>

        {"/* Featured Image Placeholder */"}
        <div className="w-full aspect-[21/9] bg-blue-50 rounded-[40px] mb-16 flex items-center justify-center border border-blue-100 relative overflow-hidden">
           <div className="text-sm font-bold text-blue-300 uppercase tracking-widest italic">[ Visual: Chat interface mockup with WeChat and Messenger bubbles ]</div>
        </div>

        <div className="prose prose-slate prose-lg max-w-none text-slate-600">
          <p className="text-xl text-slate-600 leading-relaxed mb-8">Most plumbing shop owners focus 100% of their marketing budget on Google search. While Google is excellent for high-urgency emergency calls, it is also the most expensive channel. Meanwhile, thousands of homeowners are looking for recommendations in neighborhood forums, Facebook groups, and chat networks like WeChat.</p>
          <p className="mb-8">If a prospect messages your Facebook page or WeChat account and has to wait 3 hours for a reply, they’ve already moved on. To capture this high-margin revenue, you must automate your social lead pipelines.</p>
          <h2 className="text-3xl font-black mb-6 text-slate-900">The Shift in Customer Communication</h2>
          <p className="mb-8">Consumer communication habits have changed. Homeowners—especially younger buyers—prefer messaging over calling. They want to send a quick text, attach a picture of their leaky valve, and get a quote without sitting on hold.</p>
          <p className="mb-8">In diverse communities, platforms like <strong>WeChat</strong> are the primary search engines for local services. Homeowners post in local groups asking for recommendations, and businesses that can respond immediately in the customer's preferred language secure the contract.</p>
          <h2 className="text-3xl font-black mb-6 text-slate-900">The Multi-Channel Inbox Challenge</h2>
          <p className="mb-8">The difficulty with social marketing is monitoring all the channels. If your dispatcher has to check Facebook Business Suite, WeChat, Yelp, and email separately, leads will inevitably fall through the cracks.</p>
          <p className="mb-8">The solution is a <strong>Unified Inbox</strong> that pulls all communications into a single screen:</p>
          <ul className="list-disc pl-6 mb-8 space-y-3">
            <li>  An inquiry on WeChat is automatically converted into a chat bubble on your main dashboard.</li>
            <li>  Your staff can reply from one screen, and the system routes the message back to the customer on WeChat.</li>
            <li>  Images sent by the customer are saved directly in their CRM contact record.</li>
          </ul>
          <h2 className="text-3xl font-black mb-6 text-slate-900">Automating the Social Handshake</h2>
          <p className="mb-8">Since social leads are often non-emergencies (remodels, system upgrades, routine maintenance), they frequently come in during evenings and weekends.</p>
          <p className="mb-8">By setting up automated responder bots, you can qualify these leads on autopilot:</p>
          <ol className="list-decimal pl-6 mb-8 space-y-3">
            <li> <strong>Incoming Inquiry:</strong> A customer sends a WeChat message: <em>"How much to install a water filtration system?"</em></li>
            <li> <strong>Auto-Reply:</strong> The system instantly replies in their native language:</li>
          </ol>
          <blockquote className="border-l-4 border-blue-500 pl-4 py-2 italic bg-slate-50 text-slate-800 mb-8 rounded-r-lg">
            "Hi! Thanks for reaching out. We can absolutely help with your filtration system. Could you tell us your zip code so we can check availability?"
          </blockquote>
          <ol className="list-decimal pl-6 mb-8 space-y-3">
            <li> <strong>Lead Triaged:</strong> The bot gathers their name, address, and details, then notifies your estimator to draft the quote first thing Monday morning.</li>
          </ol>
          <div className="p-8 rounded-3xl bg-blue-600 text-white flex items-center gap-8 mb-12">
            <TrendingUp size={64} className="text-blue-200 shrink-0" />
            <div>
              <h4 className="text-xl font-bold mb-2">Unlocking the Social Pipeline</h4>
              <p className="text-blue-100 text-sm">Social lead capture helps you build a steady backlog of scheduled installations, balancing out the unpredictable nature of emergency service work and keeping your technicians billing year-round.</p>
            </div>
          </div>
          <p className="mb-8">Stop ignoring your social media messages. Connect your chat channels to a unified operating system, respond to inquiries in seconds, and secure the jobs your competitors are missing.</p>
        </div>

        <div className="mt-20 p-10 rounded-[40px] bg-slate-900 text-white text-center">
           <h3 className="text-2xl font-black mb-4">Automate Your Social Channels</h3>
           <p className="mb-8 text-slate-400">Never miss a WeChat message or Facebook DM. Let Plumbify sync all social inquiries to your main dispatch board.</p>
           <Link href="/pricing" className="inline-block px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all">
             Sync Social Channels
           </Link>
        </div>
      </article>
    </main>
  );
}
