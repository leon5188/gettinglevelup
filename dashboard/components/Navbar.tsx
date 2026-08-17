"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Zap } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  if (pathname === "/widget-embed" || pathname === "/tour" || pathname?.startsWith("/dashboard")) return null;

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#081a3d]/80 backdrop-blur-md border-b border-slate-800/60">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/25">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <div>
            <span className="font-extrabold tracking-tight text-white text-sm">PLUMBIFY</span>
            <span className="block text-[8px] text-cyan-400 font-mono tracking-widest uppercase">CRM</span>
          </div>
        </Link>
        
        {/* Simplified Header - under 7 items */}
        <div className="hidden md:flex gap-8 text-xs font-bold uppercase tracking-wider text-slate-300">
          <a href="#features" className="hover:text-white transition-colors">Core Features</a>
          <a href="#roi-calculator" className="hover:text-white transition-colors">ROI Calculator</a>
          <a href="#client-reviews" className="hover:text-white transition-colors">Reviews</a>
          <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
        </div>

        <div className="flex items-center gap-4">
          <a 
            href="#challenge-form" 
            className="px-5 py-2.5 bg-slate-900/60 hover:bg-slate-800 text-slate-200 border border-slate-700/60 text-xs font-bold rounded-full transition-all uppercase tracking-wider"
          >
            Start Challenge
          </a>
        </div>
      </div>
    </nav>
  );
}
