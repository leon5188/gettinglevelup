import { BookOpen, Shield, Zap, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

const resources = [
  {
    title: "Plumbing Industry Blog",
    desc: "Stay ahead of the curve with insights on Plumbing Software 2026, AI assistants, and business growth strategies.",
    link: "/resources/blog",
    icon: <BookOpen className="text-blue-500" />,
    color: "bg-blue-50"
  },
  {
    title: "10DLC Compliance Hub",
    desc: "The ultimate guide to SMS registration. Get your plumbing business verified and keep your messages flowing.",
    link: "/resources/10dlc-guide",
    icon: <Shield className="text-emerald-500" />,
    color: "bg-emerald-50"
  },
  {
    title: "Video Demo Center",
    desc: "Watch Plumbify in action. Explore feature walkthroughs, tech app tours, and dispatcher dashboard demos.",
    link: "/resources/demos",
    icon: <Zap className="text-orange-500" />,
    color: "bg-orange-50"
  },
  {
    title: "On-Demand Masterclass",
    desc: "Free Training: The 3 AI systems that plumbing businesses use to recapture $150k+ in missed phone call revenue.",
    link: "/resources/webinar",
    icon: <Sparkles className="text-cyan-500" />,
    color: "bg-cyan-50"
  }
];

export default function ResourcesIndex() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="pt-40 pb-20 px-6 bg-slate-50 overflow-hidden relative">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 leading-tight">
            Knowledge to Scale <br />
            <span className="text-blue-600">Your Plumbing Empire.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-slate-500 mb-12">
            From technical compliance to the future of AI in trade services, explore our library of resources built for the modern plumber.
          </p>
        </div>
      </section>

      {/* Resource Grid */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {resources.map((r, i) => (
              <Link key={i} href={r.link} className={`p-10 rounded-[40px] ${r.color} border border-slate-100 flex flex-col justify-between transition-all hover:scale-[1.03] hover:shadow-2xl group`}>
                <div>
                  <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                    {r.icon}
                  </div>
                  <h3 className="text-2xl font-black mb-4 text-slate-900">{r.title}</h3>
                  <p className="text-slate-600 leading-relaxed text-sm mb-8">{r.desc}</p>
                </div>
                <div className="flex items-center gap-2 font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                  Explore Hub <ArrowRight size={18} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Resource Highlight */}
      <section className="py-24 px-6 bg-slate-900 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1">
            <div className="text-blue-400 font-bold uppercase tracking-widest text-xs mb-4">Featured Guide</div>
            <h2 className="text-4xl font-black mb-6 tracking-tighter italic">Why 10DLC is the Most Important Thing Your Plumbing Business Needs in 2026.</h2>
            <p className="text-slate-400 mb-8 leading-relaxed"> Carriers are blocking 90% of unregistered business texts. If you aren't compliant, you aren't reaching your customers. Learn how to fix it in 5 minutes.</p>
            <Link href="/resources/10dlc-guide" className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-500 transition-all">
              Read the Compliance Guide
            </Link>
          </div>
          <div className="flex-1 w-full h-80 bg-white/5 rounded-[40px] border border-white/10 flex items-center justify-center relative">
             <Shield size={120} className="text-blue-500/20" />
             <div className="absolute inset-0 flex items-center justify-center">
                <div className="p-4 bg-emerald-500 text-white rounded-full font-black text-xs shadow-2xl">VERIFIED</div>
             </div>
          </div>
        </div>
      </section>
    </main>
  );
}
