import { ShieldCheck, CheckCircle2, AlertCircle, Copy, BookOpen } from "lucide-react";

export default function TenDLCGuide() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="pt-40 pb-20 px-6 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter">The 2026 SMS Compliance Hub</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Everything you need to get your 10DLC registration approved and keep your messages out of the spam folder.
          </p>
        </div>
      </section>

      {/* Checklist Section */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
               <ShieldCheck />
            </div>
            <h2 className="text-3xl font-black">Registration Checklist</h2>
          </div>

          <div className="space-y-6">
            {[
              { title: "EIN Verification", desc: "Ensure your legal business name matches your IRS letter exactly." },
              { title: "Privacy Policy", desc: "Your website must have a privacy policy stating that mobile info will not be shared with third parties." },
              { title: "Opt-in Methods", desc: "Clearly document how customers agree to receive your texts (Web forms, SMS keywords)." },
              { title: "Sample Messages", desc: "Provide 3-5 real-world examples of texts you'll send (e.g., job reminders)." }
            ].map((item, i) => (
              <div key={i} className="p-6 rounded-2xl bg-slate-50 border border-slate-100 flex gap-6 items-start">
                <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center font-bold text-blue-600 shrink-0">
                  {i+1}
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1">{item.title}</h4>
                  <p className="text-slate-500 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Copy-Paste Templates */}
      <section className="py-24 px-6 bg-slate-900 text-white">
        <div className="max-w-5xl mx-auto">
          <div className="mb-16">
            <h2 className="text-3xl font-black mb-4">Compliant Opt-in Templates</h2>
            <p className="text-slate-400">Copy these into your website footer and contact forms to pass carrier audits.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 rounded-3xl bg-white/5 border border-white/10 relative group">
              <button className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg text-slate-400 transition-all">
                <Copy size={16} />
              </button>
              <h4 className="font-bold mb-4 text-blue-400">Contact Form Disclaimer</h4>
              <p className="text-xs text-slate-300 leading-relaxed italic">
                "By clicking 'Send', I agree to receive recurring automated marketing text messages from Plumbify at the phone number provided. Consent is not a condition of purchase. Msg & data rates may apply. Reply HELP for help, STOP to cancel."
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white/5 border border-white/10 relative">
              <button className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg text-slate-400 transition-all">
                <Copy size={16} />
              </button>
              <h4 className="font-bold mb-4 text-blue-400">Privacy Policy Clause</h4>
              <p className="text-xs text-slate-300 leading-relaxed italic">
                "No mobile information will be shared with third parties/affiliates for marketing/promotional purposes. All other categories exclude text messaging originator opt-in data and consent; this information will not be shared with any third parties."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Troubleshooting */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto text-center">
           <AlertCircle className="mx-auto text-red-500 mb-6" size={48} />
           <h2 className="text-3xl font-black mb-8">Registration Failed?</h2>
           <div className="grid md:grid-cols-3 gap-6 text-left">
              <div className="p-6 rounded-2xl border border-slate-100">
                 <h5 className="font-bold mb-2">Error: Mismatched Name</h5>
                 <p className="text-xs text-slate-500">Your DBA name must not be used for legal registration. Use your official IRS name.</p>
              </div>
              <div className="p-6 rounded-2xl border border-slate-100">
                 <h5 className="font-bold mb-2">Error: No Opt-in</h5>
                 <p className="text-xs text-slate-500">You must provide a URL to a live page showing your SMS opt-in checkbox.</p>
              </div>
              <div className="p-6 rounded-2xl border border-slate-100">
                 <h5 className="font-bold mb-2">Error: Forbidden Content</h5>
                 <p className="text-xs text-slate-500">Avoid words like "Debt", "Credit", or "Loans" in your sample messages.</p>
              </div>
           </div>
        </div>
      </section>

      {/* Help CTA */}
      <section className="py-20 px-6 bg-blue-50">
        <div className="max-w-4xl mx-auto text-center">
           <BookOpen className="mx-auto text-blue-600 mb-6" size={40} />
           <h2 className="text-2xl font-bold mb-4">Still Stuck? Our Compliance Team Can Help.</h2>
           <p className="text-slate-500 mb-8">We've helped 500+ plumbers get verified. We'll review your application for free.</p>
           <button className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all">Schedule Compliance Call</button>
        </div>
      </section>
    </main>
  );
}
