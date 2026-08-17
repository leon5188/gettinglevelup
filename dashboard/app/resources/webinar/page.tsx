"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Clock, Play, Sparkles, AlertCircle } from "lucide-react";

export default function WebinarLanding() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Sync lead details to GoHighLevel CRM
      const response = await fetch(
        "https://services.leadconnectorhq.com/hooks/RHROdkS0TNPBFZHcZsX0/webhook-trigger/bLjJ5zulAgeQluUDL9fM",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            first_name: formData.firstName,
            last_name: formData.lastName,
            phone: formData.phone,
            email: formData.email,
            companyName: formData.company,
            source: "webinar_registration",
            message: "Registered for Plumbify On-Demand Webinar: Stop the Revenue Leak"
          })
        }
      );

      if (response.ok) {
        // Redirect to watch page with name and email query parameters
        router.push(
          `/resources/webinar/watch?name=${encodeURIComponent(
            formData.firstName
          )}&company=${encodeURIComponent(formData.company)}`
        );
      } else {
        throw new Error("Failed to register. Please try again.");
      }
    } catch (err) {
      setError("Registration failed. Please check your network and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 font-sans pt-32 pb-24 px-6 flex items-center justify-center">
      
      {/* Background cyan/blue glows for Cyberpunk/HUD feel */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* Left Column: Webinar Pitch */}
        <div className="lg:col-span-7 space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-cyan-400 text-xs font-semibold">
            <Sparkles size={12} />
            <span>FREE ON-DEMAND TRAINING MASTERCLASS</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-white">
            Stop the Leak: The <span className="text-cyan-400">3 AI Systems</span> That Captured $150K+ in Missed Plumbing Revenue
          </h1>

          <p className="text-slate-400 text-lg leading-relaxed">
            In this exclusive 15-minute training, we deconstruct the exact automation blueprint used by top-performing plumbing businesses to convert missed calls, automate scheduling, and optimize dispatch routes in real-time.
          </p>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="text-cyan-400 shrink-0 mt-1" size={18} />
              <div>
                <strong className="text-slate-200 block text-sm">Automate the Voicemail Leak</strong>
                <span className="text-slate-400 text-xs">How to capture the 62% of leads that hang up on voicemails using automated AI text-backs.</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="text-cyan-400 shrink-0 mt-1" size={18} />
              <div>
                <strong className="text-slate-200 block text-sm">Hands-free GPS Dispatch Routing</strong>
                <span className="text-slate-400 text-xs">How to sequence jobs and minimize fuel consumption by 18.2% automatically.</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="text-cyan-400 shrink-0 mt-1" size={18} />
              <div>
                <strong className="text-slate-200 block text-sm">Outbound AI Booking Calls</strong>
                <span className="text-slate-400 text-xs">A live demo showing how Plumbify's AI voice engine pre-qualifies trade leads and books calendars.</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 pt-4 border-t border-slate-900 text-slate-500 text-xs">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-cyan-400" />
              <span>Duration: 15 Mins</span>
            </div>
            <div className="flex items-center gap-2">
              <Play size={16} className="text-cyan-400" />
              <span>Watch Instantly</span>
            </div>
          </div>
        </div>

        {/* Right Column: Registration Card */}
        <div className="lg:col-span-5">
          <div className="bg-[#041129]/60 border border-cyan-500/20 rounded-3xl p-8 backdrop-blur-md shadow-[0_0_50px_rgba(6,182,212,0.05)]">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-white">Get Instant Access</h3>
              <p className="text-slate-400 text-xs mt-1">Register below to watch the training immediately.</p>
            </div>

            {error && (
              <div className="p-3 bg-red-950/50 border border-red-500/20 text-red-400 text-xs rounded-xl flex items-center gap-2 mb-6">
                <AlertCircle size={16} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 uppercase font-semibold">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="John"
                    className="w-full bg-[#020c1b] border border-cyan-500/10 focus:border-cyan-500 text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 uppercase font-semibold">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Doe"
                    className="w-full bg-[#020c1b] border border-cyan-500/10 focus:border-cyan-500 text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase font-semibold">Business Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="john@plumbingcompany.com"
                  className="w-full bg-[#020c1b] border border-cyan-500/10 focus:border-cyan-500 text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase font-semibold">Mobile Phone (For SMS updates)</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="(555) 000-0000"
                  className="w-full bg-[#020c1b] border border-cyan-500/10 focus:border-cyan-500 text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase font-semibold">Company Name</label>
                <input
                  type="text"
                  name="company"
                  required
                  value={formData.company}
                  onChange={handleInputChange}
                  placeholder="Apex Plumbing Services"
                  className="w-full bg-[#020c1b] border border-cyan-500/10 focus:border-cyan-500 text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-cyan-600 hover:bg-cyan-500 disabled:bg-cyan-950/50 text-white font-bold text-xs rounded-xl transition-all border border-cyan-500/30 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] shadow-lg uppercase tracking-wider mt-4"
              >
                {loading ? "Registering..." : "Start Watch Instantly"}
              </button>
            </form>
          </div>
        </div>

      </div>
    </main>
  );
}
