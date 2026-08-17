import { Play, Zap, Smartphone, Layout, ArrowRight } from "lucide-react";
import InteractiveDemo from "@/components/InteractiveDemo";

const demos = [
  {
    title: "The 60-Second Lead Capture",
    desc: "Watch how the AI handles a missed call and books a job without human intervention.",
    duration: "Live Simulation",
    category: "AI Automation",
    color: "bg-blue-50"
  },
// ... rest of demos unchanged
];

export default function VideoDemos() {
  return (
    <main className="min-h-screen bg-white pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-20 text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 italic">Video Demo Center</h1>
          <p className="text-xl text-slate-500 max-w-2xl">
            See why Plumbify is the choice for 500+ plumbing companies. Explore our high-definition walkthroughs.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {demos.map((demo, i) => (
            <div key={i} className="rounded-[40px] border border-slate-100 overflow-hidden bg-slate-50 hover:shadow-2xl transition-all group">
               <div className={`h-[500px] ${demo.color} flex items-center justify-center relative overflow-hidden`}>
                  {demo.title === "The 60-Second Lead Capture" ? (
                    <InteractiveDemo />
                  ) : (
                    <>
                      <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform cursor-pointer">
                         <Play size={32} className="text-slate-900 ml-1" />
                      </div>
                      <div className="absolute bottom-6 right-8 px-3 py-1 bg-slate-900 text-white text-[10px] font-black rounded-full uppercase tracking-widest">
                         {demo.duration}
                      </div>
                    </>
                  )}
               </div>
               <div className="p-10">
                  <div className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-4">{demo.category}</div>
                  <h3 className="text-2xl font-black mb-4 leading-tight">{demo.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-8">{demo.desc}</p>
                  <button className="flex items-center gap-2 font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                     Watch Full Demo <ArrowRight size={18} />
                  </button>
               </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
