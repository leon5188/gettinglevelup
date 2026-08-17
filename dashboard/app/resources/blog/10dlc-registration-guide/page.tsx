import { Calendar, User, ArrowLeft, Clock, Shield } from "lucide-react";
import Link from "next/link";

export default function Blog10dlcRegistrationGuide() {
  return (
    <main className="min-h-screen bg-white pb-20">
      <article className="pt-40 px-6 max-w-4xl mx-auto">
        <Link href="/resources/blog" className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-blue-600 mb-12 transition-colors">
          <ArrowLeft size={16} /> Back to Blog
        </Link>
        
        <header className="mb-16">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 leading-tight">
             The Ultimate 10DLC Registration Guide for Trade Services
          </h1>
          <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 font-medium">
             <div className="flex items-center gap-2"><User size={16} /> Robert Vance</div>
             <div className="flex items-center gap-2"><Calendar size={16} /> Oct 05, 2026</div>
             <div className="flex items-center gap-2"><Clock size={16} /> 3 min read</div>
          </div>
        </header>

        {"/* Featured Image Placeholder */"}
        <div className="w-full aspect-[21/9] bg-purple-50 rounded-[40px] mb-16 flex items-center justify-center border border-purple-100 relative overflow-hidden">
           <div className="text-sm font-bold text-purple-300 uppercase tracking-widest italic">[ Visual: SMS Compliance Hub Visual ]</div>
        </div>

        <div className="prose prose-slate prose-lg max-w-none text-slate-600">
          <p className="text-xl text-slate-600 leading-relaxed mb-8">If your plumbing business texts dispatch notifications, job reminders, or reviews to your customers, those messages are traveling over US mobile networks as A2P (Application-to-Person) messages. To prevent spam, mobile carriers now require all businesses sending text messages from local numbers to register their brand and campaigns.</p>
          <p className="mb-8">This registry is known as <strong>10DLC (10-Digit Long Code) compliance</strong>. If you do not register, carriers like AT&T, Verizon, and T-Mobile will block up to 90% of your texts, leaving your customers in the dark.</p>
          <p className="mb-8">Here is the complete, step-by-step guide for trade service companies to get their 10DLC registration approved on the first attempt.</p>
          <h2 className="text-3xl font-black mb-6 text-slate-900">1. Verify Your Business Identity (EIN Check)</h2>
          <p className="mb-8">The absolute number-one reason 10DLC applications are rejected is a mismatch between your business registration details and the IRS database.</p>
          <p className="mb-8">When entering your brand details:</p>
          <ul className="list-disc pl-6 mb-8 space-y-3">
            <li>  <strong>Legal Business Name:</strong> This must match your IRS SS-4 letter or EIN document exactly. If your EIN lists you as "Smith Plumbing LLC," do not enter "Smith Plumbing & Drain."</li>
            <li>  <strong>Tax ID (EIN):</strong> Enter your federal EIN exactly. Do not use your state business ID.</li>
            <li>  <strong>Business Address:</strong> Must match the address associated with your EIN.</li>
            <li>  <strong>Entity Type:</strong> Correctly select LLC, Corporation, Sole Proprietorship, or Partnership.</li>
          </ul>
          <h2 className="text-3xl font-black mb-6 text-slate-900">2. Set Up a Compliant Website (The Opt-In Check)</h2>
          <p className="mb-8">Carrier auditors will visit the website URL you submit in your registration. If they cannot find proper SMS disclosure and opt-in consent, they will reject your brand immediately.</p>
          <p className="mb-8">To pass the website audit:</p>
          <ol className="list-decimal pl-6 mb-8 space-y-3">
            <li> <strong>Add a Privacy Policy:</strong> Your website must have a dedicated Privacy Policy page.</li>
            <li> <strong>Add the Shared-Data Exclusion Clause:</strong> Your Privacy Policy <em>must</em> include the following sentence exactly:</li>
          </ol>
          <blockquote className="border-l-4 border-purple-500 pl-4 py-2 italic bg-slate-50 text-slate-800 mb-8 rounded-r-lg">
            "No mobile information will be shared with third parties/affiliates for marketing/promotional purposes. All other categories exclude text messaging originator opt-in data and consent; this information will not be shared with any third parties."
          </blockquote>
          <ol className="list-decimal pl-6 mb-8 space-y-3">
            <li> <strong>Compliant Contact Forms:</strong> Any website contact form that asks for a phone number must display a clear checkbox or disclosure text, such as:</li>
          </ol>
          <blockquote className="border-l-4 border-purple-500 pl-4 py-2 italic bg-slate-50 text-slate-800 mb-8 rounded-r-lg">
            "By checking this box, I agree to receive automated notifications and text messages from Plumbify at the phone number provided. Msg & data rates may apply. Text HELP for help, STOP to cancel."
          </blockquote>
          <h2 className="text-3xl font-black mb-6 text-slate-900">3. Write Clear Sample Messages</h2>
          <p className="mb-8">Auditors review your "Campaign Use Case" and sample messages to ensure you are not sending spam.</p>
          <p className="mb-8">When submitting sample messages:</p>
          <ul className="list-disc pl-6 mb-8 space-y-3">
            <li>  <strong>Be Specific:</strong> Write exactly what you send. For example: <em>"Hi John, this is Steve from Plumbify. Your plumber is on their way and should arrive in 15 minutes. Follow their route here: [Link]"</em></li>
            <li>  <strong>Include STOP and HELP:</strong> Your sample messages must show how customers can opt-out. Always append <em>"Reply STOP to unsubscribe"</em> to at least one sample.</li>
            <li>  <strong>Avoid Forbidden Content:</strong> Do not include words like "debt," "credit," "loans," or "sweepstakes" in your samples, as these trigger automated spam filters.</li>
          </ul>
          <h2 className="text-3xl font-black mb-6 text-slate-900">4. Troubleshooting Rejections</h2>
          <p className="mb-8">If your registration is rejected, check the carrier error code:</p>
          <ul className="list-disc pl-6 mb-8 space-y-3">
            <li>  <strong>DBA vs. Legal Name Error:</strong> You submitted your "Doing Business As" name instead of your legal registration name. Update your brand details to match your EIN letter exactly.</li>
            <li>  <strong>No Opt-in Form Link:</strong> The URL you provided didn't show a live form with SMS opt-in terms. Create a hidden contact page with a compliant form and submit that specific URL.</li>
            <li>  <strong>Mismatched Website Domain:</strong> Your business email domain must match the website domain you submit. If your site is `smithplumbing.com`, your registration email should be `office@smithplumbing.com` rather than a Gmail address.</li>
          </ul>
          <p className="mb-8">10DLC registration can be tedious, but once completed, your message deliverability rate jumps close to 99%. Plumbify handles the technical setup, ensuring your templates are compliant and registered automatically.</p>
        </div>

        <div className="mt-20 p-10 rounded-[40px] bg-slate-900 text-white text-center">
           <h3 className="text-2xl font-black mb-4">Still Stuck? Our Compliance Team Can Help</h3>
           <p className="mb-8 text-slate-400">We've helped 500+ trade businesses get verified. We'll review your application and website for free.</p>
           <Link href="/pricing" className="inline-block px-8 py-4 bg-purple-500 hover:bg-purple-400 text-white rounded-xl font-bold transition-all">
             Schedule Compliance Call
           </Link>
        </div>
      </article>
    </main>
  );
}
