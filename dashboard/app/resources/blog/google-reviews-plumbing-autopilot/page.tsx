import { Calendar, User, ArrowLeft, Clock, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function BlogGoogleReviewsPlumbingAutopilot() {
  return (
    <main className="min-h-screen bg-white pb-20">
      <article className="pt-40 px-6 max-w-4xl mx-auto">
        <Link href="/resources/blog" className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-blue-600 mb-12 transition-colors">
          <ArrowLeft size={16} /> Back to Blog
        </Link>
        
        <header className="mb-16">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 leading-tight">
             How to Get 100+ Google Reviews for Your Plumbing Business on Autopilot
          </h1>
          <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 font-medium">
             <div className="flex items-center gap-2"><User size={16} /> Leon</div>
             <div className="flex items-center gap-2"><Calendar size={16} /> Jun 18, 2026</div>
             <div className="flex items-center gap-2"><Clock size={16} /> 3 min read</div>
          </div>
        </header>

        {"/* Featured Image Placeholder */"}
        <div className="w-full aspect-[21/9] bg-blue-50 rounded-[40px] mb-16 flex items-center justify-center border border-blue-100 relative overflow-hidden">
           <div className="text-sm font-bold text-blue-300 uppercase tracking-widest italic">[ Visual: Google Business Profile showing 5-star review card ]</div>
        </div>

        <div className="prose prose-slate prose-lg max-w-none text-slate-600">
          <p className="text-xl text-slate-600 leading-relaxed mb-8">When a homeowner’s basement is flooding, they don’t scroll past the first three Google Maps results. They look at the "Map Pack" and call the shop with the highest number of 5-star ratings and the most recent reviews. If your plumbing company has 15 reviews while your competitor has 150, you are losing the click every single time.</p>
          <p className="mb-8">In local SEO, two metrics matter above all: <strong>Review Volume</strong> and <strong>Review Velocity</strong> (how frequently you get new reviews). Let's explore how to automate your feedback loops to get 100+ Google reviews on autopilot.</p>
          <h2 className="text-3xl font-black mb-6 text-slate-900">The Local Search Ranking Algorithm</h2>
          <p className="mb-8">Google Maps ranks service providers using three primary criteria: Proximity, Relevance, and Prominence.</p>
          <p className="mb-8">While you can’t change your proximity to a searching customer, you <em>can</em> build your prominence. Google measures prominence through your reviews:</p>
          <ul className="list-disc pl-6 mb-8 space-y-3">
            <li>  <strong>Keyword Richness:</strong> When clients mention specific services like "emergency sewer line repair" or "water heater replacement" in their feedback, Google associates your business with those high-intent terms.</li>
            <li>  <strong>Recency:</strong> A review from yesterday is worth ten reviews from three years ago. Google wants to see active, operating businesses.</li>
            <li>  <strong>Owner Response:</strong> Replying to reviews signals to Google's crawlers that your business is managed and reliable.</li>
          </ul>
          <h2 className="text-3xl font-black mb-6 text-slate-900">The Friction Problem: Why Customers Don't Leave Reviews</h2>
          <p className="mb-8">If you rely on your technicians to ask for reviews at the end of the job, you’re missing out. Techs get busy, they feel awkward asking for favors, or they simply forget. Even if they ask, the customer says, "Sure, I'll do it later," and immediately forgets the moment the van leaves their driveway.</p>
          <p className="mb-8">To get reviews consistently, you must remove all friction. You cannot expect customers to open Google, search for your business name, find the review section, and click write. You need to drop the exact review link directly onto their screen when their satisfaction is at its peak.</p>
          <div className="p-8 rounded-3xl bg-blue-600 text-white flex items-center gap-8 mb-12">
            <TrendingUp size={64} className="text-blue-200 shrink-0" />
            <div>
              <h4 className="text-xl font-bold mb-2">The 10-Minute Golden Window</h4>
              <p className="text-blue-100 text-sm">The best time to ask for a review is within 10 minutes of payment. The customer is relieved, their water is running, and they are grateful. Wait 24 hours, and their willingness to leave a review drops by over 70%.</p>
            </div>
          </div>
          <h2 className="text-3xl font-black mb-6 text-slate-900">Automating the Request with Plumbify</h2>
          <p className="mb-8">By connecting your field invoicing software with SMS marketing automation, you can automate review collection completely:</p>
          <ol className="list-decimal pl-6 mb-8 space-y-3">
            <li> <strong>On-Site Payment:</strong> The technician completes the job and collects payment via Tap-to-Pay or digital invoice sign-off.</li>
            <li> <strong>Instant Trigger:</strong> The payment marks the job opportunity as "Won & Paid" in your CRM.</li>
            <li> <strong>The SMS Request:</strong> Within 5 minutes, an automated SMS is fired to the customer:</li>
          </ol>
          <blockquote className="border-l-4 border-blue-500 pl-4 py-2 italic bg-slate-50 text-slate-800 mb-8 rounded-r-lg">
            "Hey John! Thanks for choosing us. We hope Steve did a great job clearing your drain. Would you mind taking 15 seconds to support our local team with a quick review? Here is the direct link: [Link]"
          </blockquote>
          <ol className="list-decimal pl-6 mb-8 space-y-3">
            <li> <strong>Auto-Follow Up:</strong> If the link isn't clicked, the system sends a gentle reminder 3 days later, then stops.</li>
          </ol>
          <p className="mb-8">By automating the ask, you take the pressure off your field crew and build an organic, constant stream of 5-star reviews that pushes your company to the top of Google Maps.</p>
        </div>

        <div className="mt-20 p-10 rounded-[40px] bg-slate-900 text-white text-center">
           <h3 className="text-2xl font-black mb-4">Boost Your Map Rankings Today</h3>
           <p className="mb-8 text-slate-400">Automate review requests the second jobs are paid. Let Plumbify grow your Google Business Profile.</p>
           <Link href="/pricing" className="inline-block px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all">
             Get More Reviews
           </Link>
        </div>
      </article>
    </main>
  );
}
