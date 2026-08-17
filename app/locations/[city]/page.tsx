import { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import ROICalculator from '@/components/ROICalculator';
import { notFound } from 'next/navigation';
import { Check, Shield, MapPin, Zap, PhoneCall, ArrowRight, Building2, Users } from 'lucide-react';
import Link from 'next/link';

// 预定义全美核心水暖市场 pSEO 城市字典
const CITY_DATA: Record<string, {
  name: string;
  state: string;
  slug: string;
  metroArea: string;
  estPlumbingShops: number;
  avgTechSalary: string;
  localKeywords: string[];
}> = {
  'long-beach-ca': {
    name: 'Long Beach',
    state: 'CA',
    slug: 'long-beach-ca',
    metroArea: 'Greater Los Angeles',
    estPlumbingShops: 180,
    avgTechSalary: '$78,500',
    localKeywords: ['Long Beach plumbing software', 'Long Beach master plumber crm', 'plumbing dispatch Long Beach']
  },
  'dallas-tx': {
    name: 'Dallas',
    state: 'TX',
    slug: 'dallas-tx',
    metroArea: 'Dallas-Fort Worth Metroplex',
    estPlumbingShops: 420,
    avgTechSalary: '$68,000',
    localKeywords: ['Dallas plumbing dispatching', 'DFW plumber automation', 'Dallas plumbing contractor software']
  },
  'phoenix-az': {
    name: 'Phoenix',
    state: 'AZ',
    slug: 'phoenix-az',
    metroArea: 'Phoenix Metropolitan Area',
    estPlumbingShops: 310,
    avgTechSalary: '$65,500',
    localKeywords: ['Phoenix plumbing crm', 'Phoenix emergency dispatch software', 'AZ trade contractor automation']
  },
  'philadelphia-pa': {
    name: 'Philadelphia',
    state: 'PA',
    slug: 'philadelphia-pa',
    metroArea: 'Delaware Valley',
    estPlumbingShops: 290,
    avgTechSalary: '$72,000',
    localKeywords: ['Philly plumbing contractor crm', 'Philadelphia dispatch automation', 'PA master plumber software']
  },
  'los-angeles-ca': {
    name: 'Los Angeles',
    state: 'CA',
    slug: 'los-angeles-ca',
    metroArea: 'Los Angeles County',
    estPlumbingShops: 850,
    avgTechSalary: '$82,000',
    localKeywords: ['LA plumbing software', 'Los Angeles plumbing dispatching', 'Southern California trade crm']
  },
  'houston-tx': {
    name: 'Houston',
    state: 'TX',
    slug: 'houston-tx',
    metroArea: 'Greater Houston',
    estPlumbingShops: 520,
    avgTechSalary: '$66,000',
    localKeywords: ['Houston plumbing dispatch', 'Houston crm for plumbers', 'TX plumbing business automation']
  }
};

// 预渲染静态路径 (pSEO Static Generation)
export async function generateStaticParams() {
  return Object.keys(CITY_DATA).map((city) => ({
    city: city
  }));
}

// 动态 Metadata 生成
export async function generateMetadata({ params }: { params: { city: string } }): Promise<Metadata> {
  const cityInfo = CITY_DATA[params.city];
  if (!cityInfo) return {};

  return {
    title: `#1 Plumbing Dispatch & CRM Automation in ${cityInfo.name}, ${cityInfo.state} | Plumbify`,
    description: `Automate plumbing dispatch, missed-call text backs, and GHL workflows for contractors in ${cityInfo.name}, ${cityInfo.state}. Stop losing jobs to slow callbacks.`,
    keywords: cityInfo.localKeywords.join(', ')
  };
}

export default function CityPseoPage({ params }: { params: { city: string } }) {
  const cityInfo = CITY_DATA[params.city];

  if (!cityInfo) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      <Navbar />

      <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-16 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest">
            <MapPin size={14} /> B2B Automation for {cityInfo.name}, {cityInfo.state} Plumbing Contractors
          </div>

          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white leading-tight">
            The #1 Dispatch & CRM Automation Software for Plumbers in <span className="text-blue-400">{cityInfo.name}, {cityInfo.state}</span>
          </h1>

          <p className="text-slate-400 text-lg max-w-3xl mx-auto leading-relaxed">
            Running 5 to 20 trucks in the {cityInfo.metroArea}? Stop letting competitors steal after-hours emergency jobs. Plumbify automates missed-call text backs, estimate follow-ups, and review collection in 15 minutes.
          </p>
        </div>

        {/* Localized Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-20">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-center">
            <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Local Market Size</div>
            <div className="text-3xl font-black text-white">{cityInfo.estPlumbingShops}+</div>
            <p className="text-slate-500 text-xs mt-1">Active Plumbing Contractors in {cityInfo.name}</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-center">
            <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Average Tech Salary</div>
            <div className="text-3xl font-black text-emerald-400">{cityInfo.avgTechSalary}</div>
            <p className="text-slate-500 text-xs mt-1">Per Master Plumber / Year in {cityInfo.state}</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-center">
            <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Speed-to-Lead Goal</div>
            <div className="text-3xl font-black text-blue-400">&lt; 60 Seconds</div>
            <p className="text-slate-500 text-xs mt-1">Automated SMS Response Time</p>
          </div>
        </div>

        {/* Revenue Leakage Calculator Embedded */}
        <div className="mb-24">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white">Calculate Revenue Leakage for Your {cityInfo.name} Shop</h2>
            <p className="text-slate-400 text-sm mt-2">See how much revenue your technicians are missing out on every month.</p>
          </div>
          <ROICalculator />
        </div>

        {/* Localized Feature Value Props */}
        <div className="space-y-12 mb-24">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-white">Why {cityInfo.name} Plumbers Switch to Plumbify</h2>
            <p className="text-slate-400 text-sm mt-2">Flat pricing with zero per-tech markup. Built on battle-tested GoHighLevel workflows.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-slate-900/80 border border-slate-800 p-8 rounded-3xl space-y-4">
              <div className="w-10 h-10 bg-blue-500/10 text-blue-400 rounded-xl flex items-center justify-center">
                <Zap size={20} />
              </div>
              <h3 className="text-xl font-bold text-white">Instant Missed-Call Text Back</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                When your {cityInfo.name} office staff is busy or on job sites, Plumbify instantly sends an SMS with an online booking link. Customers book before calling your competitors.
              </p>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 p-8 rounded-3xl space-y-4">
              <div className="w-10 h-10 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center">
                <Users size={20} />
              </div>
              <h3 className="text-xl font-bold text-white">Automated Estimate Nudging</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Sent a $2,500 water heater replacement estimate? Plumbify automatically sends friendly SMS/Email follow-ups on Day 1, Day 3, and Day 7 until they sign or reply.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-900/60 to-indigo-900/60 border border-blue-500/30 rounded-3xl p-10 text-center relative overflow-hidden space-y-6">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white">
            Scale Your {cityInfo.name} Plumbing Business Today
          </h2>
          <p className="text-slate-300 max-w-2xl mx-auto text-base">
            Join plumbing contractors across {cityInfo.state} using Plumbify to recapture lost revenue and automate dispatching.
          </p>
          <div className="pt-2">
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 px-8 py-4 bg-blue-500 hover:bg-blue-400 text-white font-bold rounded-xl text-lg transition-colors shadow-lg shadow-blue-500/30"
            >
              Start Free 14-Day Trial <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </div>

      <footer className="py-8 border-t border-slate-900 text-center text-xs text-slate-600">
        © {new Date().getFullYear()} Plumbify. Localized B2B Automation for {cityInfo.name}, {cityInfo.state}.
      </footer>
    </main>
  );
}
