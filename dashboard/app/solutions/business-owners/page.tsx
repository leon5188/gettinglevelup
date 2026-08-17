import { CheckCircle2, TrendingUp, ShieldCheck, Clock, ArrowRight } from "lucide-react";
import { TestimonialGrid } from "@/components/Testimonials";

export default function BusinessOwners() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="pt-32 pb-20 px-6 bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-20 pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500 rounded-full blur-[120px]"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-8">
            You Scale the Business. <br />
            <span className="text-blue-400 font-black">AI Handles the Chaos.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-slate-400 mb-10">
            Stop being the bottleneck. Plumbify automates the repetitive work so you can focus on high-level strategy and profit margins.
          </p>
          <div className="flex justify-center gap-4">
            <button className="px-8 py-4 bg-blue-600 rounded-xl font-bold hover:bg-blue-500 transition-all">Watch the CEO Demo</button>
            <button className="px-8 py-4 bg-white/10 rounded-xl font-bold border border-white/20 hover:bg-white/20 transition-all">View Pricing</button>
          </div>
        </div>
      </section>

      {/* The CEO Bento Grid */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 p-10 rounded-[32px] bg-slate-50 border border-slate-100 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                  <TrendingUp className="text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Protect Your Marketing ROI</h3>
                <p className="text-slate-600 leading-relaxed mb-6">
                  Every $1,000 you spend on LSA or PPC is wasted if the phone isn't answered. Our Speed-to-Lead AI converts missed calls into booked jobs automatically, ensuring your ad spend always results in revenue.
                </p>
              </div>
              <div className="flex gap-4">
                <div className="px-4 py-2 bg-white rounded-lg border border-slate-200 text-sm font-bold shadow-sm">80% Capture Rate</div>
                <div className="px-4 py-2 bg-white rounded-lg border border-slate-200 text-sm font-bold shadow-sm">Zero Waste</div>
              </div>
            </div>

            <div className="p-10 rounded-[32px] bg-blue-600 text-white flex flex-col justify-between shadow-2xl shadow-blue-500/20">
              <div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-6 text-white font-bold text-xl">
                  AI
                </div>
                <h3 className="text-2xl font-bold mb-4">Hands-Off Hiring</h3>
                <p className="text-blue-100 text-sm leading-relaxed">
                  Our Voice AI screens plumber applicants for licenses, experience, and reliability before they ever hit your inbox. Hire the top 5% without the 20 hours of manual vetting.
                </p>
              </div>
              <button className="w-full py-3 bg-white text-blue-600 rounded-xl font-bold text-sm mt-8">Learn About AI Recruiting</button>
            </div>

            <div className="p-10 rounded-[32px] bg-slate-900 text-white flex flex-col justify-between">
              <div>
                <ShieldCheck className="text-emerald-400 mb-6" size={32} />
                <h3 className="text-2xl font-bold mb-4">Total Compliance</h3>
                <p className="text-slate-400 text-sm">
                  We handle the 10DLC registration and carrier audits so your messages actually get delivered. No more blocked texts.
                </p>
              </div>
            </div>

            <div className="md:col-span-2 p-10 rounded-[32px] bg-slate-50 border border-slate-100 flex flex-col md:flex-row gap-10 items-center">
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-4">The "Gold Mine" Database</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Your past customers are your biggest asset. Plumbify automatically reaches out to inactive clients with personalized offers during your slow season, generating $10k+ in "found money" in days.
                </p>
              </div>
              <div className="w-full md:w-64 h-48 bg-white rounded-2xl border border-slate-200 shadow-inner flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl font-black text-emerald-500 mb-1">$12,450</div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Revenue Found This Week</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-black mb-12 text-center">Trusted by Industry Leaders</h2>
          <TestimonialGrid 
            testimonials={[
              { quote: "Our ROI jumped 40% in the first month just by automating the missed calls. I can finally focus on expansion.", author: "Mike Ross", role: "CEO", company: "Premium Plumbing NY" },
              { quote: "The AI recruiting saved me at least 50 hours of interviews this quarter. We only talk to the best now.", author: "Sarah Jenkins", role: "Founder", company: "Jenkins & Sons" },
              { quote: "Plumbify's database reactivation is a literal money machine. We filled our entire slow season in 48 hours.", author: "David Vance", role: "Owner", company: "Vance Rooter Services" }
            ]} 
          />
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto rounded-[40px] bg-blue-600 p-12 text-center text-white relative overflow-hidden shadow-2xl">
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-black mb-6">Built by Plumbers, for Plumbers.</h2>
            <p className="text-blue-100 mb-10 text-lg">Stop juggling apps and start scaling your empire.</p>
            <button className="px-10 py-5 bg-white text-blue-600 rounded-2xl font-black text-lg hover:scale-105 transition-all shadow-xl">Start Your Business Trial</button>
          </div>
          <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none">
            <ShieldCheck size={300} />
          </div>
        </div>
      </section>
    </main>
  );
}
