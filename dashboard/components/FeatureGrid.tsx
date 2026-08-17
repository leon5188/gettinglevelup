import { 
  Zap, 
  Calendar, 
  RefreshCcw, 
  Users, 
  CreditCard 
} from "lucide-react";

const features = [
  {
    title: "Speed to Lead AI",
    desc: "AI-powered text-back within 60 seconds of a missed call. Don't let them call the next plumber.",
    icon: <Zap className="text-blue-500" />,
    className: "md:col-span-2 bg-blue-50",
    visual: "0:59 response time"
  },
  {
    title: "24/7 Booking",
    desc: "Seamless calendar integration that lets clients book while you sleep.",
    icon: <Calendar className="text-emerald-500" />,
    className: "bg-emerald-50",
    visual: "Live sync"
  },
  {
    title: "Money Machine",
    desc: "Database reactivation campaigns that fill your slow season in one click.",
    icon: <RefreshCcw className="text-purple-500" />,
    className: "bg-purple-50",
    visual: "Found revenue"
  },
  {
    title: "AI Recruiting",
    desc: "Automated screening for licensed techs. Hire 5x faster.",
    icon: <Users className="text-orange-500" />,
    className: "bg-orange-50",
    visual: "Verified only"
  },
  {
    title: "Tap to Pay",
    desc: "Ditch the expensive card readers. Your phone is now your POS.",
    icon: <CreditCard className="text-slate-500" />,
    className: "md:col-span-2 bg-slate-100",
    visual: "0% hardware cost"
  }
];

export default function FeatureGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {features.map((f, i) => (
        <div key={i} className={`bento-item ${f.className}`}>
          <div>
            <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6">
              {f.icon}
            </div>
            <h4 className="text-xl font-bold mb-2">{f.title}</h4>
            <p className="text-slate-600 text-sm leading-relaxed">{f.desc}</p>
          </div>
          <div className="mt-8 flex items-center justify-between">
             <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{f.visual}</span>
             <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all">
                →
             </div>
          </div>
        </div>
      ))}
    </div>
  );
}
