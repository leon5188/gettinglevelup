"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { 
  Play, 
  Volume2, 
  Settings, 
  Maximize, 
  Send, 
  Users, 
  Sparkles, 
  Calendar, 
  ArrowRight,
  ShieldAlert
} from "lucide-react";

interface ChatMessage {
  id: string;
  sender: string;
  avatar: string;
  text: string;
  time: string;
  isHost?: boolean;
}

function WebinarWatchContent() {
  const searchParams = useSearchParams();
  const name = searchParams.get("name") || "Friend";
  const company = searchParams.get("company") || "Plumbing Company";

  // Video Playing States
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(15); // Start at 15% to look active
  const [durationStr, setDurationStr] = useState("15:00");
  const [currentTimeStr, setCurrentTimeStr] = useState("02:15");

  // Simulated Chat States
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: "1", sender: "System", avatar: "🤖", text: "Welcome to the Plumbify Masterclass. Q&A is currently active.", time: "10:00 AM" },
    { id: "2", sender: "Host Sarah (Plumbify)", avatar: "👩‍💼", text: "Welcome everyone! Feel free to ask questions here during the training.", time: "10:01 AM", isHost: true },
    { id: "3", sender: "Gregory (Houston)", avatar: "👨‍🔧", text: "Excited to see how you guys handle the missed-call text-back.", time: "10:01 AM" }
  ]);
  const [chatInput, setChatInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // Simulate video progress timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) return 0;
          const next = prev + 0.1;
          // Calculate formatted time
          const totalSec = 900; // 15 mins
          const currentSec = Math.round((next / 100) * totalSec);
          const mins = Math.floor(currentSec / 60);
          const secs = currentSec % 60;
          setCurrentTimeStr(`${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`);
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Simulated live chat script
  useEffect(() => {
    const chatScript = [
      { delay: 4000, sender: "Robert (Dallas)", avatar: "👨", text: "Does this require a new phone number or can I use my existing landline?" },
      { delay: 8000, sender: "Host Sarah (Plumbify)", avatar: "👩‍💼", text: "Great question Robert! You keep your existing business phone number. We just forward missed calls to a designated tracking number for the AI to handle.", isHost: true },
      { delay: 14000, sender: "Marcus (Austin)", avatar: "🛠️", text: "Is this compatible with ServiceTitan?" },
      { delay: 19000, sender: "Host Sarah (Plumbify)", avatar: "👩‍💼", text: "Yes Marcus! Plumbify integrates directly with ServiceTitan, Housecall Pro, and Jobber to auto-schedule jobs directly into your dispatch board.", isHost: true },
      { delay: 26000, sender: "Lisa (Phoenix)", avatar: "👩", text: "Our dispatcher is overwhelmed. Can the AI book jobs during weekends?" },
      { delay: 32000, sender: "Gregory (Houston)", avatar: "👨‍🔧", text: "Lisa, we had the same issue. The night/weekend text-back has been a lifesaver for our crew." },
      { delay: 38000, sender: "Host Sarah (Plumbify)", avatar: "👩‍💼", text: "Spot on Gregory! Plumbify works 24/7/365, so you capture emergency calls even when your staff is asleep.", isHost: true }
    ];

    const timers = chatScript.map((msg) => {
      return setTimeout(() => {
        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setChatMessages((prev) => [
          ...prev,
          {
            id: String(Date.now() + Math.random()),
            sender: msg.sender,
            avatar: msg.avatar,
            text: msg.text,
            time: timeStr,
            isHost: msg.isHost
          }
        ]);
      }, msg.delay);
    });

    return () => {
      timers.forEach((t) => clearTimeout(t));
    };
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      id: String(Date.now()),
      sender: `${name} (${company})`,
      avatar: "👤",
      text: chatInput,
      time: timeStr
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput("");

    // Simulate Sarah responding to the user
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          id: String(Date.now() + 1),
          sender: "Host Sarah (Plumbify)",
          avatar: "👩‍💼",
          text: `Thanks for chiming in, ${name}! We're answering live support questions now. I highly suggest booking the onboard session using the sidebar link to discuss your specific team size.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isHost: true
        }
      ]);
    }, 3000);
  };

  return (
    <main className="min-h-screen bg-[#020813] text-slate-100 font-sans pt-28 pb-16 flex flex-col justify-between">
      <div className="max-w-7xl mx-auto w-full px-6 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch my-6">
        
        {/* Left 8 Cols: Video Theater */}
        <div className="lg:col-span-8 flex flex-col justify-between">
          <div className="space-y-4">
            <h1 className="text-xl md:text-2xl font-black text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
              <span>Stop the Leak: Capturing Missed Revenue with AI</span>
            </h1>
            <p className="text-xs text-slate-400">
              Training for <span className="text-white font-bold">{company}</span> • Presented by Plumbify Product Team
            </p>
          </div>

          {/* Video Player Mock */}
          <div className="bg-[#040e21] border border-cyan-500/20 rounded-3xl overflow-hidden relative aspect-video flex flex-col justify-between shadow-[0_0_50px_rgba(0,242,254,0.1)] my-6">
            
            {/* Simulated Video Slide Frame */}
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center relative z-10 select-none">
              
              {/* Animated HUD Graphic inside player */}
              <div className="w-48 h-48 rounded-full border-4 border-dashed border-cyan-500/20 flex items-center justify-center animate-[spin_40s_linear_infinite] absolute"></div>
              
              <div className="space-y-4 max-w-md relative z-20">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-cyan-400 text-[10px] font-mono">
                  <span>CASE STUDY: CAPTURING $150K REVENUE</span>
                </div>
                
                <h3 className="text-xl md:text-2xl font-black text-white leading-normal">
                  "The 3-Truck Crew Automation Template"
                </h3>
                
                <div className="bg-[#020c1b]/80 border border-cyan-500/10 p-4 rounded-xl text-left space-y-1.5 font-mono text-[10px]">
                  <div className="flex justify-between text-cyan-400"><span className="text-slate-500">Auto-Response:</span> Active</div>
                  <div className="flex justify-between text-emerald-400"><span className="text-slate-500">SMS Booking rate:</span> 92%</div>
                  <div className="flex justify-between text-slate-300"><span className="text-slate-500">Tech Assigned:</span> Dave (Austin, TX)</div>
                </div>
              </div>
            </div>

            {/* Video Controls Overlay */}
            <div className="bg-slate-950/80 border-t border-cyan-500/10 p-4 flex flex-col gap-3 shrink-0 relative z-20">
              
              {/* Progress bar */}
              <div className="h-1.5 w-full bg-slate-800 rounded-full cursor-pointer relative overflow-hidden">
                <div 
                  style={{ width: `${progress}%` }} 
                  className="h-full bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(0,242,254,0.8)]"
                ></div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-300">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="hover:text-white transition-colors"
                  >
                    <Play size={16} className={isPlaying ? "fill-cyan-400 text-cyan-400" : ""} />
                  </button>
                  <div className="flex items-center gap-1 font-mono text-[10px]">
                    <span>{currentTimeStr}</span>
                    <span>/</span>
                    <span>{durationStr}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <Volume2 size={16} className="cursor-pointer hover:text-white" />
                  <Settings size={16} className="cursor-pointer hover:text-white" />
                  <Maximize size={16} className="cursor-pointer hover:text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Warning notice */}
          <div className="bg-[#020c1b] border border-cyan-500/10 rounded-2xl p-4 flex items-start gap-3 text-xs leading-relaxed text-slate-400 shrink-0">
            <ShieldAlert size={18} className="text-amber-500 shrink-0 mt-0.5" />
            <span>
              <strong>Note:</strong> Do not close this page. The on-demand session will unlock your Plumbify account provisioning token once completed.
            </span>
          </div>
        </div>

        {/* Right 4 Cols: Live Q&A Chat & CTA */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* A. Live simulated Q&A Chat */}
          <div className="bg-[#041129]/40 border border-cyan-500/10 rounded-3xl p-6 flex flex-col h-[350px] shadow-[0_0_15px_rgba(6,182,212,0.02)]">
            <div className="flex items-center justify-between border-b border-cyan-500/10 pb-3 mb-3 shrink-0">
              <div className="flex items-center gap-2">
                <Users size={14} className="text-cyan-400 animate-pulse" />
                <span className="text-xs font-bold text-white">Live Webinar Q&A</span>
              </div>
              <span className="text-[9px] bg-cyan-950/40 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded-full font-mono">148 Active</span>
            </div>

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-[11px] leading-relaxed">
              {chatMessages.map((msg) => (
                <div key={msg.id} className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span>{msg.avatar}</span>
                    <span className={`font-bold ${msg.isHost ? "text-cyan-400" : "text-slate-300"}`}>
                      {msg.sender}
                    </span>
                    <span className="text-[9px] text-slate-600 font-mono">{msg.time}</span>
                  </div>
                  <p className="text-slate-400 bg-slate-950/30 p-2 rounded-lg border border-cyan-500/5">
                    {msg.text}
                  </p>
                </div>
              ))}
              <div ref={chatEndRef}></div>
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendMessage} className="mt-3 pt-3 border-t border-cyan-500/10 flex gap-2 shrink-0">
              <input
                type="text"
                required
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask a question..."
                className="flex-1 bg-[#020c1b] border border-cyan-500/10 focus:border-cyan-500 text-white rounded-xl px-3 py-2 text-xs focus:outline-none transition-colors"
              />
              <button 
                type="submit"
                className="p-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl border border-cyan-500/30 flex items-center justify-center"
              >
                <Send size={12} />
              </button>
            </form>
          </div>

          {/* B. Webinar Offer CTA */}
          <div className="bg-[#041129]/40 border border-cyan-500/10 rounded-3xl p-6 flex flex-col justify-between flex-1 shadow-[0_0_15px_rgba(6,182,212,0.02)] min-h-[220px]">
            <div>
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-emerald-400 text-[10px] font-semibold mb-3">
                <Sparkles size={10} />
                <span>EXEMPTION DEAL ACTIVE</span>
              </div>
              <h3 className="text-base font-bold text-white mb-2">Claim Your Onboarding Tour</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Book a 10-minute 1-on-1 strategy call with our plumbing automation architects. We'll set up your Missed-Call Text-Back automation live during the call.
              </p>
            </div>

            <div className="space-y-3 mt-4">
              <a 
                href="https://plumbify.ai/pricing"
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all border border-emerald-500/30"
              >
                <Calendar size={14} />
                <span>Book Strategy Call</span>
              </a>
              <a 
                href="https://dashboard.plumbify.net"
                className="w-full py-2.5 bg-cyan-600/10 hover:bg-cyan-600/20 text-cyan-400 hover:text-cyan-300 font-bold text-xs rounded-xl flex items-center justify-center gap-1 transition-all border border-cyan-500/20"
              >
                <span>Access Live Operations Command</span>
                <ArrowRight size={12} />
              </a>
            </div>
          </div>

        </div>

      </div>
    </main>
  );
}

export default function WebinarWatch() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#020813] text-slate-100 flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
          <span className="text-xs text-slate-400">Loading Webinar Theater...</span>
        </div>
      </div>
    }>
      <WebinarWatchContent />
    </Suspense>
  );
}
