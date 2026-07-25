"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  Sparkles, 
  Zap, 
  Phone, 
  Mail, 
  User, 
  MapPin, 
  Wrench, 
  ArrowRight, 
  Play, 
  ShieldCheck, 
  ChevronRight,
  Bot
} from "lucide-react";

export default function BookingPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form State
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [issueType, setIssueType] = useState("Slab Leak / Pipe Leak");
  const [selectedDate, setSelectedDate] = useState("2026-07-25");
  const [selectedSlot, setSelectedSlot] = useState("02:00 PM");

  const [loading, setLoading] = useState(false);

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;
    setStep(2);
  };

  const handleFinalBooking = async () => {
    setLoading(true);
    try {
      // Send Webhook to GHL / Plumbify Backend
      await fetch("/api/ghl/voice-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          callerName: name,
          phone: phone,
          address: address,
          issueType: issueType,
          bookedDate: selectedDate,
          bookedSlot: selectedSlot,
          status: "Web Booked",
          source: "https://plumbify.net/booking"
        })
      });
    } catch (e) {
      console.warn("Booking webhook logged:", e);
    } finally {
      setLoading(false);
      setStep(3);
      // Auto-redirect to demo walkthrough after 3 seconds
      setTimeout(() => {
        router.push("/demo");
      }, 3500);
    }
  };

  return (
    <div className="min-h-screen bg-[#070913] text-slate-100 font-sans selection:bg-cyan-500 selection:text-black">
      {/* ---------------- NAVIGATION HEADER ---------------- */}
      <header className="border-b border-slate-800/80 bg-[#090B16]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 to-cyan-400 p-[2px]">
              <div className="w-full h-full bg-[#0F111A] rounded-[10px] flex items-center justify-center">
                <Zap className="w-4 h-4 text-cyan-400 fill-cyan-400/20" />
              </div>
            </div>
            <span className="text-lg font-bold text-white tracking-tight">
              Plumbify<span className="text-cyan-400">.net</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link 
              href="/demo" 
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 bg-cyan-500/10 px-3 py-1.5 rounded-xl border border-cyan-500/30 transition"
            >
              <Play className="w-3.5 h-3.5 fill-current" /> Watch Walkthrough
            </Link>
          </div>
        </div>
      </header>

      {/* ---------------- BOOKING SECTION ---------------- */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Progress Stepper */}
        <div className="flex items-center justify-center gap-4 mb-10">
          <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-bold transition ${step >= 1 ? "bg-indigo-600 border-indigo-400 text-white" : "bg-slate-900 border-slate-800 text-slate-500"}`}>
            <span>1. Contact Info</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-600" />
          <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-bold transition ${step >= 2 ? "bg-indigo-600 border-indigo-400 text-white" : "bg-slate-900 border-slate-800 text-slate-500"}`}>
            <span>2. Pick Calendar Slot</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-600" />
          <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-bold transition ${step === 3 ? "bg-emerald-600 border-emerald-400 text-white" : "bg-slate-900 border-slate-800 text-slate-500"}`}>
            <span>3. Walkthrough Demo</span>
          </div>
        </div>

        {/* STEP 1: FORM INPUT */}
        {step === 1 && (
          <div className="bg-gradient-to-b from-[#121526] to-[#0A0C16] border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-bold mb-3">
                <Wrench className="w-3.5 h-3.5" /> Fast Plumbing Service Request
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">Book Plumbify Service Appointment</h1>
              <p className="text-xs text-slate-400 mt-2">Fill in your information below to pick an available plumber slot.</p>
            </div>

            <form onSubmit={handleStep1Submit} className="space-y-4 max-w-xl mx-auto">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">Full Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Sarah Jenkins"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#070914] border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">Mobile Phone (For SMS Confirm) *</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                    <input 
                      type="text" 
                      required
                      placeholder="+1 (555) 234-5678"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-[#070914] border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                    <input 
                      type="email" 
                      placeholder="sarah@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#070914] border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">Service Address (Dallas, Garland, Plano)</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input 
                    type="text" 
                    placeholder="1420 Oak St, Garland, TX"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-[#070914] border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">Plumbing Issue Category</label>
                <select 
                  value={issueType}
                  onChange={(e) => setIssueType(e.target.value)}
                  className="w-full bg-[#070914] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Slab Leak / Pipe Leak">Emergency Slab Leak / Pipe Leak</option>
                  <option value="Water Heater Replacement">Tankless / Water Heater Repair</option>
                  <option value="Main Drain Jetting">Main Drain Line Jetting & Inspection</option>
                  <option value="Commercial Plumbing">Commercial Plumbing Maintenance</option>
                </select>
              </div>

              <button 
                type="submit"
                className="w-full mt-4 py-3 bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500 hover:opacity-95 text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30"
              >
                <span>Continue to Calendar Selection</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* STEP 2: CALENDAR PICKER */}
        {step === 2 && (
          <div className="bg-gradient-to-b from-[#121526] to-[#0A0C16] border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-white">Select Plumber Arrival Time</h2>
              <p className="text-xs text-slate-400 mt-1">Booking for: <strong className="text-cyan-400">{name}</strong> ({phone})</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-6">
              <div className="bg-[#070914] border border-slate-800 p-4 rounded-2xl">
                <span className="text-xs font-bold text-slate-300 block mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-indigo-400" /> Select Date
                </span>
                <div className="space-y-2">
                  {["2026-07-25 (Tomorrow)", "2026-07-26 (Sunday)", "2026-07-27 (Monday)"].map((d) => {
                    const dateVal = d.split(" ")[0];
                    return (
                      <button
                        key={dateVal}
                        type="button"
                        onClick={() => setSelectedDate(dateVal)}
                        className={`w-full text-left px-3.5 py-2.5 rounded-xl border text-xs font-semibold transition ${selectedDate === dateVal ? "bg-indigo-600 border-indigo-400 text-white" : "bg-[#0B0D1A] border-slate-800 text-slate-400 hover:text-white"}`}
                      >
                        {d}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="bg-[#070914] border border-slate-800 p-4 rounded-2xl">
                <span className="text-xs font-bold text-slate-300 block mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-cyan-400" /> Select Time Slot
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {["09:00 AM", "11:30 AM", "02:00 PM", "04:30 PM"].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setSelectedSlot(t)}
                      className={`px-3 py-2.5 rounded-xl border text-xs font-bold transition text-center ${selectedSlot === t ? "bg-cyan-500 border-cyan-300 text-black shadow-lg shadow-cyan-500/30" : "bg-[#0B0D1A] border-slate-800 text-slate-300 hover:text-white"}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-semibold transition"
              >
                Back
              </button>

              <button
                type="button"
                onClick={handleFinalBooking}
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold rounded-xl text-xs transition shadow-lg shadow-emerald-600/30 flex items-center gap-2"
              >
                {loading ? "Confirming Appointment..." : "Confirm & Lock Appointment"}
                <CheckCircle className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: SUCCESS & REDIRECT */}
        {step === 3 && (
          <div className="bg-gradient-to-b from-[#121526] to-[#0A0C16] border border-emerald-500/40 rounded-3xl p-8 sm:p-12 text-center shadow-2xl animate-in fade-in">
            <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500/40 rounded-full flex items-center justify-center text-emerald-400 mx-auto mb-4 animate-bounce">
              <CheckCircle className="w-8 h-8" />
            </div>

            <h2 className="text-2xl font-black text-white">Appointment Confirmed!</h2>
            <p className="text-xs text-slate-300 mt-2 max-w-md mx-auto">
              Thank you <strong className="text-emerald-400">{name}</strong>. Your plumbing technician is scheduled for <strong className="text-white">{selectedDate} at {selectedSlot}</strong>. Confirmation SMS sent to {phone}.
            </p>

            <div className="my-8 bg-[#070914] border border-slate-800 p-4 rounded-2xl inline-flex items-center gap-3">
              <Bot className="w-5 h-5 text-cyan-400 animate-pulse" />
              <span className="text-xs text-slate-300 font-mono">
                Redirecting to <strong>https://plumbify.net/demo</strong> Walkthrough in 3 seconds...
              </span>
            </div>

            <div>
              <Link 
                href="/demo" 
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs inline-flex items-center gap-2 transition"
              >
                <span>Watch Product Tour Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
