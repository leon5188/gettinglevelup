import Link from "next/link";
import { ArrowRight, Clock, User } from "lucide-react";

const posts = [
  {
    title: "The Ultimate 10DLC Registration Guide for Trade Services",
    slug: "10dlc-registration-guide",
    excerpt: "Everything you need to know about SMS compliance. Don't let carriers block your customer communications.",
    date: "Oct 05, 2026",
    author: "Robert Vance",
    category: "Compliance",
    color: "bg-purple-50"
  },
  {
    title: "AI Answering vs. Answering Services: Which is Better for a Plumbing Shop?",
    slug: "ai-answering-vs-answering-services-plumbers",
    excerpt: "Compare live answering call centers with AI-powered receptionist automation. Learn which system captures more plumbing leads at a lower cost.",
    date: "Jul 09, 2026",
    author: "Sarah Jenkins",
    category: "AI & Automation",
    color: "bg-emerald-50"
  },
  {
    title: "How an AI Plumber Assistant Can Save You 20 Hours a Week",
    slug: "ai-plumber-assistant",
    excerpt: "Stop managing calendars and answering routine questions. Learn how AI assistants handle the back-office chaos while you work.",
    date: "Oct 10, 2026",
    author: "Sarah Jenkins",
    category: "AI & Automation",
    color: "bg-emerald-50"
  },
  {
    title: "The Goldmine in Your CRM: How to Generate 20+ Plumbing Jobs from Old Leads",
    slug: "database-reactivation-plumbing-jobs",
    excerpt: "Stop spending thousands on Google Ads. Learn how to reactivate past customers and cold leads to secure high-margin plumbing jobs instantly.",
    date: "Jun 25, 2026",
    author: "Leon",
    category: "Speed to Lead",
    color: "bg-emerald-50"
  },
  {
    title: "Emergency Plumbing Dispatching: How to Cut Response Times by 50%",
    slug: "emergency-plumbing-dispatching-guide",
    excerpt: "When pipes burst, every minute counts. Learn how automated skill-based routing and GPS dispatching double your emergency response capacity.",
    date: "Jun 22, 2026",
    author: "James Miller",
    category: "Operations",
    color: "bg-purple-50"
  },
  {
    title: "Why Flat-Rate Pricing Wins: Scaling Your Plumbing Ticket Sizes",
    slug: "flat-rate-pricing-plumbing-ticket-sizes",
    excerpt: "Ditch the hourly billing. Learn how flat-rate pricing tiers and digital menu presentations increase ticket sizes by 35%.",
    date: "Jul 13, 2026",
    author: "James Miller",
    category: "Strategy",
    color: "bg-purple-50"
  },
  {
    title: "How to Get 100+ Google Reviews for Your Plumbing Business on Autopilot",
    slug: "google-reviews-plumbing-autopilot",
    excerpt: "Reviews are the lifeblood of local SEO. Learn how review velocity and automatic follow-ups double your map pack ranking and revenue.",
    date: "Jun 18, 2026",
    author: "Leon",
    category: "Strategy",
    color: "bg-blue-50"
  },
  {
    title: "The 2026 Guide to Scaling a Plumbing Business",
    slug: "grow-plumbing-business-playbook",
    excerpt: "Relying on referrals is a slow road to growth. Learn the exact digital playbook for scaling your trucks, marketing, and recruiting.",
    date: "Jun 10, 2026",
    author: "James Miller",
    category: "Strategy",
    color: "bg-blue-50"
  },
  {
    title: "The Hidden Math of Missed Calls: How Plumbing Shops Leak $10,000+ Every Month",
    slug: "missed-calls-cost-plumbing",
    excerpt: "If you don't answer the phone, your customer clicks the next plumber. Look at the math of missed calls and how automated texting recovers lost cash.",
    date: "Jun 09, 2026",
    author: "Sarah Jenkins",
    category: "Speed to Lead",
    color: "bg-emerald-50"
  },
  {
    title: "Plumbing Software 2026: Trends and Predictions",
    slug: "plumbing-software-2026",
    excerpt: "Discover how AI, automated dispatching, and mobile-first operating systems are redefining the plumbing industry in 2026.",
    date: "Oct 15, 2026",
    author: "James Miller",
    category: "Technology",
    color: "bg-blue-50"
  },
  {
    title: "Standardizing Plumbing Dispatching & Invoicing for Profitability",
    slug: "standardize-plumbing-dispatching-invoicing",
    excerpt: "Stop losing money on forgotten parts and delayed invoicing. Standardize your field service operations and collect cash instantly on site.",
    date: "Jun 08, 2026",
    author: "James Miller",
    category: "Operations",
    color: "bg-purple-50"
  },
  {
    title: "Tap-to-Pay for Plumbers: Accelerating Cash Flow from the Service Drive",
    slug: "tap-to-pay-plumbers-cash-flow",
    excerpt: "Ditch the paper invoices and card readers. Learn how mobile Tap-to-Pay captures payment instantly at the job site, reducing AR days to zero.",
    date: "Jun 29, 2026",
    author: "James Miller",
    category: "Technology",
    color: "bg-blue-50"
  },
  {
    title: "Vetting Plumbing Helpers: Automating the Hiring Screening Process",
    slug: "vetting-plumbing-helpers-automation",
    excerpt: "Hiring is the biggest growth bottleneck in trade services. Learn how automated text-screening filters helper candidates on autopilot.",
    date: "Jul 06, 2026",
    author: "Sarah Jenkins",
    category: "AI & Automation",
    color: "bg-emerald-50"
  },
  {
    title: "Capturing WeChat and Social Leads: The Untapped Pipeline for Trade Services",
    slug: "wechat-social-leads-trade-services",
    excerpt: "Your next high-value plumbing job is sitting in your social DMs. Learn how to capture and automate WeChat and Facebook messenger leads.",
    date: "Jul 02, 2026",
    author: "Leon",
    category: "Strategy",
    color: "bg-blue-50"
  }
];

export default function BlogIndex() {
  return (
    <main className="min-h-screen bg-white pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-20">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-6">Plumbify Blog</h1>
          <p className="text-xl text-slate-500 max-w-2xl">
            Strategies, technology insights, and growth guides for the 2026 plumbing business owner.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, i) => (
            <article key={i} className="flex flex-col h-full rounded-[40px] border border-slate-100 overflow-hidden hover:shadow-2xl transition-all group bg-white">
               <div className={`h-48 ${post.color} flex items-center justify-center relative overflow-hidden`}>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic group-hover:scale-110 transition-transform">[ Visual: Featured Image ]</div>
               </div>
               <div className="p-8 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                       <span className="text-[10px] font-black uppercase tracking-widest bg-slate-900 text-white px-2 py-1 rounded-full">{post.category}</span>
                       <span className="text-xs text-slate-400 flex items-center gap-1"><Clock size={12} /> {post.date}</span>
                    </div>
                    <h2 className="text-2xl font-black mb-4 group-hover:text-blue-600 transition-colors leading-tight">
                       <Link href={`/resources/blog/${post.slug}`}>{post.title}</Link>
                    </h2>
                    <p className="text-slate-500 text-sm leading-relaxed mb-8">{post.excerpt}</p>
                  </div>
                  <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                     <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-slate-200"></div>
                        <span className="text-xs font-bold text-slate-900">{post.author}</span>
                     </div>
                     <Link href={`/resources/blog/${post.slug}`} className="text-blue-600 font-bold text-sm flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Read More <ArrowRight size={16} />
                     </Link>
                  </div>
               </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
