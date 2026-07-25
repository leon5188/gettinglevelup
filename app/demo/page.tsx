"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  RotateCcw, 
  Sparkles, 
  Zap, 
  Globe, 
  CheckCircle, 
  ArrowRight, 
  Bot, 
  MapPin, 
  Route, 
  Layers, 
  PhoneCall, 
  ShieldCheck, 
  Calendar, 
  ChevronRight, 
  Clock, 
  BarChart3, 
  Users, 
  Code,
  ExternalLink
} from "lucide-react";

interface TimestampJump {
  time: number;
  label: string;
  desc: string;
  icon: any;
}

const TIMESTAMPS: TimestampJump[] = [
  { time: 0, label: "0:00 Dashboard Overview", desc: "Bento Grid Dark Neon Console", icon: Layers },
  { time: 23, label: "0:23 Work Order Pipeline", desc: "To Do • Doing • Done Stages", icon: BarChart3 },
  { time: 45, label: "0:45 GHL Voice AI Radar", desc: "24/7 Emergency Call Capture", icon: Bot },
  { time: 68, label: "1:08 Live GPS Trajectory", desc: "Plumber Route & ETA Tracker", icon: Route },
  { time: 90, label: "1:31 Transcripts & Audio", desc: "Call Logs & Synthetic Playback", icon: Volume2 },
  { time: 112, label: "1:53 GHL Webhook Setup", desc: "Post-Call Workflow Integration", icon: Code },
];

export default function DemoPage() {
  const [lang, setLang] = useState<"en" | "zh">("en");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(169.13);
  const videoRef = useRef<HTMLVideoElement>(null);

  const videoSrc = lang === "en" 
    ? "/videos/CleanShot_Plumbify_Dashboard_Voiceover_EN.mp4"
    : "/videos/CleanShot_Plumbify_Dashboard_Voiceover_ZH.mp4";

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleSeek = (seconds: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = seconds;
    setCurrentTime(seconds);
    if (!isPlaying) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      if (videoRef.current.duration) {
        setDuration(videoRef.current.duration);
      }
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="min-h-screen bg-[#070913] text-slate-100 font-sans selection:bg-cyan-500 selection:text-black">
      {/* ------------------ NAVIGATION HEADER ------------------ */}
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
              href="/dashboard"
              className="text-xs font-semibold text-slate-300 hover:text-white px-3 py-1.5 rounded-xl border border-slate-800 hover:bg-slate-800/60 transition"
            >
              Open Live Dashboard
            </Link>
            <Link 
              href="/demo#book"
              className="text-xs font-bold text-white bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500 px-4 py-2 rounded-xl shadow-lg shadow-indigo-500/25 hover:opacity-90 transition"
            >
              Book 1-on-1 Demo
            </Link>
          </div>
        </div>
      </header>

      {/* ------------------ HERO & VIDEO SHOWCASE SECTION ------------------ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold mb-4 shadow-inner">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>Interactive 2-Minute SaaS Product Tour</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            See Plumbify In Action: <br className="hidden sm:block" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-indigo-300 to-violet-400">
              AI Answering, Dispatch & GPS Tracking
            </span>
          </h1>
          <p className="text-slate-400 text-sm sm:text-base mt-4 leading-relaxed">
            Watch how Plumbify seamlessly connects GoHighLevel Voice AI, real-time technician GPS trajectory mapping, and automated work order pipelines for plumbing businesses.
          </p>
        </div>

        {/* ------------------ MAIN BILINGUAL VIDEO PLAYER ------------------ */}
        <div className="bg-gradient-to-b from-[#121526] to-[#0A0C16] border border-slate-800/90 rounded-3xl p-4 sm:p-6 shadow-2xl shadow-black/80 relative overflow-hidden">
          
          {/* Top Video Controls Bar & Language Switcher */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs font-bold text-slate-200">
                Plumbify Walkthrough Demo (100% Studio AI Voiceover)
              </span>
            </div>

            {/* Language Selector Buttons */}
            <div className="flex items-center bg-[#070914] border border-slate-800 p-1 rounded-xl">
              <button
                onClick={() => setLang("en")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${lang === "en" ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30" : "text-slate-400 hover:text-white"}`}
              >
                <span>🇺🇸 English Voiceover</span>
              </button>
              <button
                onClick={() => setLang("zh")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${lang === "zh" ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30" : "text-slate-400 hover:text-white"}`}
              >
                <span>🇨🇳 中文专业解说</span>
              </button>
            </div>
          </div>

          {/* HTML5 Video Frame */}
          <div className="relative aspect-video w-full bg-black rounded-2xl overflow-hidden group shadow-2xl border border-slate-800">
            <video
              ref={videoRef}
              src={videoSrc}
              onTimeUpdate={handleTimeUpdate}
              onEnded={() => setIsPlaying(false)}
              className="w-full h-full object-cover"
              controls={false}
              playsInline
            />

            {/* Play overlay button on pause */}
            {!isPlaying && (
              <button
                onClick={togglePlay}
                className="absolute inset-0 m-auto w-20 h-20 rounded-full bg-indigo-600/90 hover:bg-indigo-500 text-white flex items-center justify-center shadow-2xl shadow-indigo-600/50 backdrop-blur-sm transition transform hover:scale-105"
              >
                <Play className="w-8 h-8 fill-current ml-1" />
              </button>
            )}

            {/* Custom Control Overlay */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 flex items-center justify-between gap-4">
              <button onClick={togglePlay} className="text-white hover:text-cyan-400 transition">
                {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
              </button>

              {/* Progress Slider */}
              <div className="flex-1 flex items-center gap-3">
                <span className="text-xs font-mono text-slate-300 font-bold">{formatTime(currentTime)}</span>
                <input
                  type="range"
                  min={0}
                  max={duration || 169}
                  value={currentTime}
                  onChange={(e) => handleSeek(parseFloat(e.target.value))}
                  className="flex-1 accent-cyan-400 h-1.5 bg-slate-700/80 rounded-lg cursor-pointer"
                />
                <span className="text-xs font-mono text-slate-400">{formatTime(duration)}</span>
              </div>

              <button onClick={toggleMute} className="text-white hover:text-cyan-400 transition">
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* ------------------ INTERACTIVE TIMESTAMP JUMP BUTTONS ------------------ */}
          <div className="mt-6 pt-4 border-t border-slate-800/80">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-3">
              ⚡ Jump Directly to Key Demonstration Chapters:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
              {TIMESTAMPS.map((ts, i) => {
                const IconComponent = ts.icon;
                const isActive = currentTime >= ts.time && (i === TIMESTAMPS.length - 1 || currentTime < TIMESTAMPS[i+1].time);
                return (
                  <button
                    key={ts.time}
                    onClick={() => handleSeek(ts.time)}
                    className={`p-3 rounded-2xl border text-left transition ${isActive ? "bg-gradient-to-r from-indigo-950 to-violet-950 border-cyan-400 text-white shadow-lg shadow-cyan-500/20" : "bg-[#0B0D18] border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"}`}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <IconComponent className={`w-3.5 h-3.5 ${isActive ? "text-cyan-400" : "text-slate-500"}`} />
                      <span className="text-xs font-bold text-slate-200 block truncate">{ts.label}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 block truncate">{ts.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ------------------ BENTO FEATURE HIGHLIGHTS ------------------ */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#0F1120] border border-slate-800 p-6 rounded-3xl">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4">
              <Bot className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">GHL Voice AI 24/7 Call Reception</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Native GoHighLevel AI receptionist captures emergency calls 24/7, parses transcripts, estimates repair revenue, and updates Plumbify dashboard instantly.
            </p>
          </div>

          <div className="bg-[#0F1120] border border-slate-800 p-6 rounded-3xl">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
              <Route className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Plumber Live GPS Trajectory & ETA</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Real-time technician route trajectory mapping across Garland, Dallas, and Plano with automated customer SMS dispatch notifications.
            </p>
          </div>

          <div className="bg-[#0F1120] border border-slate-800 p-6 rounded-3xl">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4">
              <Code className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">30-Second Webhook Setup</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Simply set your GHL Workflow Webhook target to <code className="text-cyan-400">https://plumbify.net/api/ghl/voice-ai</code> for zero-code multi-tenant syncing.
            </p>
          </div>
        </div>

        {/* ------------------ BOTTOM CALL TO ACTION ------------------ */}
        <div id="book" className="mt-16 bg-gradient-to-r from-indigo-900/40 via-violet-900/30 to-cyan-900/40 border border-indigo-500/30 rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden">
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Ready to Automate Your Plumbing Dispatch & Revenue?
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm max-w-xl mx-auto mt-3">
            Join hundreds of trade contractors using Plumbify to eliminate missed emergency calls and scale dispatch efficiency.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/dashboard"
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500 hover:opacity-95 text-white font-bold rounded-2xl shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition text-sm"
            >
              <span>Try Live Interactive Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a 
              href="/api/ghl/voice-ai" 
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-6 py-3.5 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold rounded-2xl flex items-center justify-center gap-2 transition text-sm"
            >
              <span>View Webhook API Docs</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
