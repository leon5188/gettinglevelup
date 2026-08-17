import { Heart, ShieldCheck, Mail, Phone, MapPin, ArrowRight } from "lucide-react";

export default function CompanyPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* About Us - Story Mode */}
      <section className="pt-40 pb-20 px-6 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-12">The Plumbify <br /><span className="text-blue-600">Origin Story.</span></h1>
        
        <div className="prose prose-slate prose-lg max-w-none text-slate-600 leading-relaxed">
          <p className="text-xl font-medium text-slate-900 mb-8">
            It started in the back of a 2012 Ford Transit van.
          </p>
          <p className="mb-6">
            Our founder, a second-generation plumber, was tired of losing jobs while he was literally elbow-deep in a grease trap. He knew that every missed call was a $300 opportunity handed to the guy down the street. 
          </p>
          <p className="mb-6">
            The problem wasn't a lack of skill—it was a lack of <strong>time</strong>. The back-office chaos of scheduling, chasing checks, and screening helpers was suffocating the actual work.
          </p>
          
          <div className="my-12 p-8 rounded-[40px] bg-blue-600 text-white italic text-2xl font-black shadow-2xl relative overflow-hidden">
             "We didn't build Plumbify in a Silicon Valley office. We built it on job sites, in driveways, and during 2 AM emergency calls."
             <Heart className="absolute -bottom-10 -right-10 text-white/10 w-40 h-40" />
          </div>

          <p className="mb-6">
            In 2024, we launched the first version of our AI Text-Back. In 2025, we added automated recruiting. Today, Plumbify is the <strong>operating system for the modern plumber</strong>. 
          </p>
          <p className="mb-6">
            We aren't just a software company. We are a partner to the trades. Our mission is simple: <strong>Kill the paperwork, so you can own your market.</strong>
          </p>
        </div>
      </section>

      {/* Contact & Support Section */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
           <div className="grid md:grid-cols-2 gap-16">
              <div>
                 <h2 className="text-4xl font-black mb-8">Get in Touch.</h2>
                 <p className="text-slate-500 mb-12">Have a question about your account or need help getting verified for 10DLC? Our team is standing by.</p>
                 
                 <div className="space-y-8">
                    <div className="flex gap-4 items-center">
                       <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-blue-600">
                          <Mail size={20} />
                       </div>
                       <div>
                          <div className="text-xs text-slate-400 font-bold uppercase">Email Support</div>
                          <div className="font-bold">support@plumbify.ai</div>
                       </div>
                    </div>
                    <div className="flex gap-4 items-center">
                       <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-blue-600">
                          <Phone size={20} />
                       </div>
                       <div>
                          <div className="text-xs text-slate-400 font-bold uppercase">Call or Text</div>
                          <div className="font-bold">+1 (888) PLUMB-AI</div>
                       </div>
                    </div>
                    <div className="flex gap-4 items-center">
                       <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-blue-600">
                          <MapPin size={20} />
                       </div>
                       <div>
                          <div className="text-xs text-slate-400 font-bold uppercase">HQ</div>
                          <div className="font-bold">Houston, Texas, USA</div>
                       </div>
                    </div>
                 </div>
              </div>
              
              <div className="bg-white p-10 rounded-[40px] border border-slate-200 shadow-xl">
                 <h3 className="text-2xl font-bold mb-6">Send a Message</h3>
                 <form className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                       <input type="text" placeholder="First Name" className="p-4 bg-slate-50 border border-slate-100 rounded-xl w-full text-sm outline-none focus:ring-2 focus:ring-blue-500" />
                       <input type="text" placeholder="Last Name" className="p-4 bg-slate-50 border border-slate-100 rounded-xl w-full text-sm outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <input type="email" placeholder="Work Email" className="p-4 bg-slate-50 border border-slate-100 rounded-xl w-full text-sm outline-none focus:ring-2 focus:ring-blue-500" />
                    <textarea placeholder="How can we help?" className="p-4 bg-slate-50 border border-slate-100 rounded-xl w-full text-sm h-32 outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                    <button className="w-full py-4 bg-blue-600 text-white rounded-xl font-black hover:bg-blue-700 transition-all">Send Message</button>
                 </form>
              </div>
           </div>
        </div>
      </section>
    </main>
  );
}
