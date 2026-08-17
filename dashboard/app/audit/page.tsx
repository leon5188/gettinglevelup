"use client";

import React, { useState } from "react";
import { Loader2, ShieldCheck, Sparkles } from "lucide-react";

export default function AuditPage() {
  const [iframeLoading, setIframeLoading] = useState(true);

  // Read GHL Survey URL from environment variables or fallback to a placeholder
  const ghlSurveyUrl = process.env.NEXT_PUBLIC_GHL_SURVEY_URL || "https://link.leadconnectorhq.com/widget/survey/YOUR_SURVEY_ID_HERE";

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 pt-28 pb-16 flex flex-col justify-between selection:bg-[#06b6d4] selection:text-[#030712]">
      <div className="max-w-4xl mx-auto px-6 w-full flex-grow flex flex-col items-center justify-center">
        
        {/* Header Titles */}
        <div className="text-center space-y-3 mb-8 w-full animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-full text-xs font-bold text-[#06b6d4] tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Operations Audit</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-extrabold text-white leading-tight">
            Analyze Your Business Revenue Leak
          </h1>
          <p className="text-slate-400 text-sm max-w-lg mx-auto">
            Answer a few quick questions to assess your office efficiency, missed-call lead capture rate, and Google review rankings.
          </p>
        </div>

        {/* GoHighLevel Quiz Iframe Wrapper */}
        <div className="w-full bg-[#0f172a] border border-slate-800 rounded-2xl shadow-2xl relative min-h-[650px] overflow-hidden transition-all duration-300">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#06b6d4] to-[#3b82f6]"></div>
          
          {/* Skeleton Spinner Loader */}
          {iframeLoading && (
            <div className="absolute inset-0 bg-[#0f172a] z-10 flex flex-col items-center justify-center space-y-4">
              <Loader2 className="w-10 h-10 text-[#06b6d4] animate-spin" />
              <div className="space-y-1 text-center">
                <p className="text-sm font-bold text-white">Loading Live Audit Portal...</p>
                <p className="text-xs text-slate-400 font-medium">Connecting securely to GoHighLevel CRM</p>
              </div>
            </div>
          )}

          {/* Iframe element */}
          <iframe
            src={ghlSurveyUrl}
            style={{ width: "100%", height: "650px", border: "none" }}
            id="ghl-survey-iframe"
            title="GoHighLevel Operations Audit"
            onLoad={() => setIframeLoading(false)}
            className={`w-full transition-opacity duration-500 ease-in-out ${
              iframeLoading ? "opacity-0" : "opacity-100"
            }`}
          />
        </div>

        {/* Encryption Badge */}
        <div className="flex items-center justify-center gap-2 mt-6 text-xs text-slate-500">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Secured by 256-bit SSL encryption. All audit data is direct & confidential.</span>
        </div>

      </div>

      {/* Footer copyright */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-8 text-center text-xs text-slate-500 mt-12">
        <div className="max-w-7xl mx-auto px-6 space-y-2">
          <p>&copy; 2026 Plumbify. All rights reserved. Built for professional plumbing and HVAC contractors.</p>
          <p className="text-slate-600 font-medium">Privacy Policy | Terms of Service | GHL Secure Partner</p>
        </div>
      </footer>
    </div>
  );
}
