import { PhoneIncoming, ListTodo, CalendarCheck, Zap, ArrowRight } from "lucide-react";
import { TestimonialGrid } from "@/components/Testimonials";

export default function Dispatchers() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="pt-32 pb-20 px-6 bg-slate-50 relative">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-xs font-bold mb-6">
            FOR DISPATCHERS & OFFICE MANAGERS
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 text-slate-900">
            End the Phone Tag. <br />
            <span className="text-blue-600">Own the Schedule.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-slate-500 mb-10">
            Automate the boring stuff. Plumbify handles the bookings and follow-ups, so you can manage your techs without the 500 daily interruptions.
          </p>
        </div>
      </section>

      {/* Dispatcher Bento Grid */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            <div className="md:col-span-2 p-10 rounded-[32px] bg-white border border-slate-200 flex flex-col justify-between">
              <div>
                <PhoneIncoming className="text-blue-600 mb-6" size={32} />
                <h3 className="text-2xl font-bold mb-4">No More "Where Are You?" Calls</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Automatically send "On My Way" texts with live technician tracking maps. Customers stay informed without ever calling the office.
                </p>
              </div>
              <div className="mt-8 p-4 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                <div className="text-[10px] text-slate-400 font-bold uppercase mb-2">Auto-Message Sent</div>
                <div className="text-xs italic">"Hi Sarah, your plumber Mark is 10 mins away. View location: [Link]"</div>
              </div>
            </div>

            <div className="md:col-span-2 p-10 rounded-[32px] bg-slate-900 text-white flex flex-col justify-between">
              <div>
                <CalendarCheck className="text-blue-400 mb-6" size={32} />
                <h3 className="text-2xl font-bold mb-4">AI Smart Scheduling</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Our system understands emergency vs. maintenance. It automatically slots jobs into the right technician's calendar based on location and skill set, reducing drive time by 30%.
                </p>
              </div>
              <div className="mt-8 flex items-center justify-between">
                <div className="flex -space-x-2">
                  {[1,2,3,4].map(i => <div key={i} className="w-8 h-8 rounded-full bg-slate-700 border border-slate-800"></div>)}
                </div>
                <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Techs Optimized</span>
              </div>
            </div>

            <div className="p-10 rounded-[32px] bg-blue-50 border border-blue-100 flex flex-col justify-between">
              <div>
                <Zap className="text-blue-600 mb-6" size={32} />
                <h3 className="text-xl font-bold mb-4">Instant Forms</h3>
                <p className="text-slate-500 text-xs">
                  Automated intake forms capture everything before the tech arrives. No more missing info.
                </p>
              </div>
            </div>

            <div className="md:col-span-3 p-10 rounded-[32px] bg-white border border-slate-200 flex flex-col md:flex-row gap-10">
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-4">Centralized Communications</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  SMS, Email, and Facebook messages in one unified inbox. Never lose another conversation in the shuffle of sticky notes.
                </p>
              </div>
              <div className="hidden md:block w-64 h-full bg-slate-100 rounded-xl border border-slate-200"></div>
            </div>

          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-black mb-12 text-center">Office Managers Love Plumbify</h2>
          <TestimonialGrid 
            testimonials={[
              { quote: "The 'On My Way' texts stopped 90% of the 'where is my tech' calls. My phone is finally quiet.", author: "Brenda King", role: "Office Manager", company: "King's Plumbing" },
              { quote: "The unified inbox means I never lose a lead between Facebook, SMS, and Email. It's a lifesaver.", author: "Jessica Wu", role: "Head Dispatcher", company: "Flow State Drain" },
              { quote: "Auto-scheduling based on location reduced our drive time by 30%. We fit in two extra calls a day.", author: "Gary Thompson", role: "Dispatcher", company: "Thompson Plumbers" }
            ]} 
          />
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 text-center">
        <h2 className="text-3xl font-black mb-8">Ready for a Quiet Office?</h2>
        <button className="px-12 py-5 bg-slate-900 text-white rounded-2xl font-black text-lg hover:shadow-2xl transition-all">Start Your Dispatcher Trial</button>
      </section>
    </main>
  );
}
