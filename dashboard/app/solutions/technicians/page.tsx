import { Smartphone, CreditCard, Star, Hammer, Shield } from "lucide-react";
import { TestimonialGrid } from "@/components/Testimonials";

export default function Technicians() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-600 text-xs font-bold mb-6">
              FOR FIELD TECHNICIANS
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 text-slate-900 leading-tight">
              Focus on the Work. <br />
              <span className="text-emerald-600">Not the Paperwork.</span>
            </h1>
            <p className="text-xl text-slate-500 mb-10 leading-relaxed">
              Ditch the clunky clipboard. Plumbify's mobile app gives you everything you need to finish jobs faster and get paid before you even leave the driveway.
            </p>
            <button className="px-10 py-5 bg-slate-900 text-white rounded-2xl font-black text-lg shadow-xl shadow-slate-200">Get the Tech App</button>
          </div>
          <div className="flex-1 w-full max-max-w-md bg-white rounded-[40px] border-8 border-slate-900 p-6 shadow-2xl relative">
             <div className="h-6 w-32 bg-slate-900 absolute top-0 left-1/2 -translate-x-1/2 rounded-b-2xl"></div>
             <div className="pt-10">
                <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                   <div className="text-[10px] font-bold text-emerald-600 uppercase mb-1">Upcoming Job</div>
                   <div className="font-bold">Hot Water Tank Replacement</div>
                   <div className="text-xs text-slate-400">123 West Side Ave • 2:00 PM</div>
                </div>
                <div className="space-y-4">
                   <div className="h-10 w-full bg-slate-50 rounded-xl"></div>
                   <div className="h-10 w-full bg-slate-50 rounded-xl"></div>
                   <div className="h-24 w-full bg-slate-50 rounded-xl"></div>
                </div>
                <button className="w-full mt-8 py-4 bg-emerald-500 text-white rounded-xl font-bold shadow-lg shadow-emerald-200">Complete Job & Pay</button>
             </div>
          </div>
        </div>
      </section>

      {/* Tech Bento Grid */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="p-10 rounded-[32px] bg-white border border-slate-200 flex flex-col justify-between shadow-sm">
              <div>
                <CreditCard className="text-emerald-500 mb-6" size={32} />
                <h3 className="text-2xl font-bold mb-4">Tap to Pay</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  No more card readers or check-cashing trips. Simply tap the customer's card to your phone and get paid instantly. 100% hardware-free.
                </p>
              </div>
            </div>

            <div className="p-10 rounded-[32px] bg-white border border-slate-200 flex flex-col justify-between shadow-sm">
              <div>
                <Star className="text-amber-400 mb-6" size={32} />
                <h3 className="text-2xl font-bold mb-4">Review Booster</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  The app automatically triggers a 5-star review request the moment you mark a job complete. Build your personal reputation on autopilot.
                </p>
              </div>
            </div>

            <div className="p-10 rounded-[32px] bg-slate-900 text-white flex flex-col justify-between">
              <div>
                <Smartphone className="text-blue-400 mb-6" size={32} />
                <h3 className="text-2xl font-bold mb-4">Digital Invoicing</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Professional PDF invoices generated in seconds. Add photos, notes, and parts used with a few taps. Send via SMS or Email instantly.
                </p>
              </div>
            </div>

            <div className="md:col-span-2 p-10 rounded-[32px] bg-emerald-50 border border-emerald-100 flex flex-col md:flex-row gap-10 items-center">
               <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-4">Mobile Knowledge Base</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                     Access manuals, parts lists, and job history for any property on the fly. Know what you're walking into before you open the truck door.
                  </p>
               </div>
               <Hammer size={120} className="text-emerald-200" />
            </div>

            <div className="p-10 rounded-[32px] bg-white border border-slate-200 flex flex-col justify-between shadow-sm">
              <div>
                <Shield className="text-slate-900 mb-6" size={32} />
                <h3 className="text-xl font-bold mb-4">Safe & Secure</h3>
                <p className="text-slate-500 text-xs">
                  All customer data and payment info is encrypted and synced in real-time to the office.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-black mb-12 text-center">Technicians Love Plumbify</h2>
          <TestimonialGrid 
            testimonials={[
              { quote: "Tap to pay is a game changer. I don't have to carry a clunky reader or wait for office to process checks.", author: "Marcus Reed", role: "Master Plumber", company: "Reed Repairs" },
              { quote: "The automated review requests have doubled my personal rating on Google. It makes me look like a pro.", author: "Mark Sullivan", role: "Field Tech", company: "Sullivan Plumbing" },
              { quote: "I can finish my paperwork in the van in 2 minutes. I'm actually home for dinner every night now.", author: "Joe Miller", role: "Plumbing Tech", company: "Miller Flow" }
            ]} 
          />
        </div>
      </section>

      {/* Footer-CTA */}
      <section className="py-20 px-6 bg-emerald-600 text-white text-center">
        <h2 className="text-4xl font-black mb-6">Want to Finish Your Day Early?</h2>
        <p className="text-emerald-100 mb-10 max-w-xl mx-auto text-lg">Stop the office from calling you for updates. Let the app handle the status sync while you do the work.</p>
        <button className="px-12 py-5 bg-white text-emerald-600 rounded-2xl font-black text-lg hover:scale-105 transition-all shadow-2xl shadow-emerald-700/40">Download the App</button>
      </section>
    </main>
  );
}
