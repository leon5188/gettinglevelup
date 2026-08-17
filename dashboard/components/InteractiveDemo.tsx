"use client";

import React, { useState, useEffect } from "react";
import { Phone, MessageSquare, CheckCircle, RefreshCcw } from "lucide-react";

export default function InteractiveDemo() {
  const [step, setStep] = useState(0);
  const [messages, setPosts] = useState<Array<{ sender: "ai" | "user"; text: string }>>([]);

  const runDemo = async () => {
    setStep(0);
    setPosts([]);
    
    // 1. Missed Call
    await new Promise((r) => setTimeout(r, 1000));
    setStep(1);

    // 2. AI First Message
    await new Promise((r) => setTimeout(r, 1500));
    setPosts([{ sender: "ai", text: "Hi, this is Plumbify! Sorry we missed your call. Do you have a plumbing emergency?" }]);
    setStep(2);

    // 3. Customer Reply
    await new Promise((r) => setTimeout(r, 2000));
    setPosts((prev) => [...prev, { sender: "user", text: "Yes! A pipe just burst in my basement, water everywhere!" }]);

    // 4. AI Booking
    await new Promise((r) => setTimeout(r, 2000));
    setPosts((prev) => [...prev, { sender: "ai", text: "I'm sorry to hear that. We can have a master plumber at your door by 2 PM today. Please confirm your address?" }]);
    
    // 5. Success
    await new Promise((r) => setTimeout(r, 1500));
    setStep(3);
  };

  useEffect(() => {
    runDemo();
  }, []);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-slate-900 overflow-hidden relative">
      {/* Success Toast */}
      {step === 3 && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 animate-bounce">
           <div className="bg-emerald-500 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 border-2 border-emerald-300">
              <CheckCircle size={20} />
              <span className="font-black text-sm uppercase tracking-tighter">Deal Saved: $850 Revenue Captured</span>
           </div>
        </div>
      )}

      {/* Virtual Phone */}
      <div className="w-64 h-[450px] bg-slate-800 rounded-[3rem] border-[6px] border-slate-700 shadow-2xl relative flex flex-col overflow-hidden animate-in fade-in zoom-in duration-500">
        {/* Status Bar */}
        <div className="h-6 w-full flex justify-between px-6 pt-4 items-center">
           <div className="text-[10px] text-white font-bold">9:41</div>
           <div className="flex gap-1">
              <div className="w-2 h-2 rounded-full bg-white opacity-40"></div>
              <div className="w-2 h-2 rounded-full bg-white"></div>
           </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-4 flex flex-col pt-10">
          {step === 1 && (
            <div className="flex flex-col items-center animate-in slide-in-from-top duration-500">
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mb-4 animate-pulse">
                <Phone size={32} className="text-white fill-current" />
              </div>
              <div className="text-white text-center">
                <div className="text-xs font-bold opacity-50 uppercase mb-1">Missed Call</div>
                <div className="text-sm font-black tracking-tight">John (Potential Client)</div>
              </div>
            </div>
          )}

          {step >= 2 && (
            <div className="flex-1 flex flex-col gap-3">
               <div className="text-[10px] text-center text-slate-400 font-bold mb-2 uppercase tracking-widest">Today 9:42 AM</div>
               {messages.map((msg, i) => (
                 <div 
                   key={i} 
                   className={`max-w-[85%] p-3 rounded-2xl text-[11px] leading-tight font-medium animate-in slide-in-from-bottom-2 duration-300 ${
                     msg.sender === "ai" 
                       ? "bg-blue-600 text-white self-start rounded-bl-none" 
                       : "bg-slate-700 text-white self-end rounded-br-none"
                   }`}
                 >
                   {msg.text}
                 </div>
               ))}
            </div>
          )}
        </div>

        {/* Home Indicator */}
        <div className="h-1 w-20 bg-white opacity-20 rounded-full mx-auto mb-2"></div>
      </div>

      {/* Replay Button */}
      <button 
        onClick={runDemo}
        className="mt-6 text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-xs font-black uppercase tracking-widest"
      >
        <RefreshCcw size={14} /> Replay Experience
      </button>
    </div>
  );
}
