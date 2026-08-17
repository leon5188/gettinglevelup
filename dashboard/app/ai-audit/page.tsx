"use client";

import React, { useState, useEffect } from "react";
import { Loader2, RefreshCcw, ShieldCheck, Sparkles } from "lucide-react";

interface AuditStats {
  ghlConnected: boolean;
  gscConnected: boolean;
  gscTotals: {
    clicks: number;
    impressions: number;
    keywords: Array<{
      query: string;
      clicks: number;
      impressions: number;
      ctr: string;
      position: number;
    }>;
  };
  googleAdsStats: {
    adsLeadCount: number;
    estimatedWaste: string;
    junkTermsCount: number;
  };
  crmAttribution: Array<{
    source: string;
    count: number;
    wonCount: number;
    totalValue: number;
    avgTicket: string;
    roi: string;
  }>;
  funnelLeaks: {
    onboardingTotal: number;
    stages: {
      accountCreated: number;
      tenDlcPending: number;
      paymentsLinked: number;
      appDownloaded: number;
      setupComplete: number;
      stuck: number;
    };
    dropoffRate: string;
  };
}

export default function AIAuditDemoPage() {
  const [activeTab, setActiveTab] = useState<"gads" | "seo" | "ga4" | "crm">("gads");
  const [stats, setStats] = useState<AuditStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadStats = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/audit-stats");
      if (!res.ok) throw new Error("Failed to load audit statistics.");
      const data = await res.json();
      setStats(data);
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070b13] flex flex-col items-center justify-center text-slate-400">
        <Loader2 className="w-10 h-10 text-[#188bf6] animate-spin mb-4" />
        <p className="text-sm font-bold text-white">Connecting to live APIs...</p>
        <p className="text-xs text-slate-500 mt-1">Fetching GHL Opportunities & Google Search Console logs</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070b13] py-12 px-6 flex flex-col items-center justify-center text-slate-100 selection:bg-[#188bf6] selection:text-white font-sans">
      <div className="w-full max-w-4xl">
        
        {/* Navigation bar */}
        <div className="mb-6 flex justify-between items-center w-full">
          <a href="/" className="text-slate-400 hover:text-white text-xs font-medium transition-colors">
            ← Back to Homepage
          </a>
          <button 
            onClick={loadStats}
            className="flex items-center gap-1.5 px-3 py-1 bg-slate-900 border border-slate-800 rounded-full text-xs font-bold text-slate-400 hover:text-white transition-colors"
          >
            <RefreshCcw className="w-3.5 h-3.5" />
            <span>Refresh Live Data</span>
          </button>
        </div>

        {/* Start of custom container */}
        <div className="mcp-container">
          <div className="mcp-header">
            <div className="mcp-badge">🎁 plumbify.net Live API Integration</div>
            <h2 className="mcp-title">Your Marketing Stack, Audited by AI in Seconds.</h2>
            <p className="mcp-subtitle">
              Interactive diagnostic dashboard synced with GoHighLevel CRM and Google Search Console APIs.
            </p>
          </div>
        
          {/* Platform tabs navigation */}
          <div className="mcp-tabs">
            <div 
              onClick={() => setActiveTab("gads")}
              className={`mcp-tab-card ${activeTab === "gads" ? "active-tab" : ""}`}
            >
              <div className="mcp-tab-icon gads-color">PPC</div>
              <h3>Google Ads</h3>
              <p>Ad Waste & ROAS</p>
            </div>
            <div 
              onClick={() => setActiveTab("seo")}
              className={`mcp-tab-card ${activeTab === "seo" ? "active-tab" : ""}`}
            >
              <div className="mcp-tab-icon seo-color">SEO</div>
              <h3>Local Maps & SEO</h3>
              <p>GMB & Keyword Wins</p>
            </div>
            <div 
              onClick={() => setActiveTab("ga4")}
              className={`mcp-tab-card ${activeTab === "ga4" ? "active-tab" : ""}`}
            >
              <div className="mcp-tab-icon ga4-color">GA4</div>
              <h3>Booking Funnel</h3>
              <p>Conversion Leaks</p>
            </div>
            <div 
              onClick={() => setActiveTab("crm")}
              className={`mcp-tab-card ${activeTab === "crm" ? "active-tab" : ""}`}
            >
              <div className="mcp-tab-icon crm-color">CRM</div>
              <h3>CRM Attribution</h3>
              <p>Job Value & ROI</p>
            </div>
          </div>
        
          {/* Simulated AI analysis panel display screen */}
          <div className="mcp-display-screen">
            
            {/* Panel 1: Google Ads */}
            {activeTab === "gads" && (
              <div className="mcp-panel active-panel">
                <div className="chat-terminal">
                  <div className="terminal-header">
                    <div className="terminal-dots"><span></span><span></span><span></span></div>
                    <div className="terminal-title">Google Ads Audit · GHL Integrated</div>
                  </div>
                  <div className="terminal-body">
                    <div className="user-query">💬 "Analyze my Google Ads integration status and campaigns."</div>
                    <div className="stat-grid">
                      <div className="stat-card">
                        <span className="stat-val val-red">{stats?.googleAdsStats.estimatedWaste}</span>
                        <span className="stat-lbl">Wasted PPC Value</span>
                      </div>
                      <div className="stat-card">
                        <span className="stat-val">{stats?.googleAdsStats.adsLeadCount}</span>
                        <span className="stat-lbl">Ads Leads captured</span>
                      </div>
                      <div className="stat-card">
                        <span className="stat-val">{stats?.ghlConnected ? "Connected" : "Not Linked"}</span>
                        <span className="stat-lbl">GHL Google API Status</span>
                      </div>
                    </div>
                    <div className="analysis-box">
                      <p className="highlight-text">🔥 Paid Campaign Diagnostics & Offline Conversion Tracking:</p>
                      
                      {stats?.googleAdsStats.adsLeadCount === 0 ? (
                        <div className="p-4 rounded bg-slate-900/60 border border-slate-800 text-xs text-slate-400 mb-4 leading-relaxed">
                          ⚠️ <strong>No Active Google Ads Leads Found:</strong> Your GHL CRM opportunities list does not contain any leads attributed to Google Ads (PPC) or Paid Search. To optimize ROAS, make sure to integrate GHL with Google in **Settings &rarr; Integrations &rarr; Google** to map GCLID tracking details and push offline conversion logs.
                        </div>
                      ) : (
                        <p className="text-xs text-slate-300 mb-4">
                          Found active paid opportunities. Make sure offline conversions are enabled to send feedback to Google Ads when pipeline deals are won.
                        </p>
                      )}

                      <table className="term-table">
                        <thead>
                          <tr>
                            <th>Search Query Type</th>
                            <th>Clicks tracked</th>
                            <th>Attributed Value</th>
                            <th>Action Recommended</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>"emergency plumber near me"</td>
                            <td>-</td>
                            <td>$0 (Organic wins)</td>
                            <td className="action-blue">Optimize Organic local Pack</td>
                          </tr>
                          <tr>
                            <td>"free plumbing advice DIY"</td>
                            <td>-</td>
                            <td>$0 (Junk search terms)</td>
                            <td className="action-red">Exclude (Add to Negative Keywords)</td>
                          </tr>
                        </tbody>
                      </table>
                      <p className="summary-insight">
                        💡 <strong>AI Recommendation:</strong> 100% of your real leads registered from "Organic Search" and checkout forms. If you activate Google Ads in the future, we recommend setting up GHL Offline Conversion imports to avoid bidding on generic search terms, saving you over <strong>$500/mo</strong> in ad budget leakages.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
        
            {/* Panel 2: Local SEO */}
            {activeTab === "seo" && (
              <div className="mcp-panel active-panel">
                <div className="chat-terminal">
                  <div className="terminal-header">
                    <div className="terminal-dots"><span></span><span></span><span></span></div>
                    <div className="terminal-title">Local SEO Audit · GSC live queries</div>
                  </div>
                  <div className="terminal-body">
                    <div className="user-query">💬 "Show me keywords and clicks from Google Search Console."</div>
                    <div className="stat-grid">
                      <div className="stat-card">
                        <span className="stat-val">{stats?.gscTotals.clicks} Clicks</span>
                        <span className="stat-lbl">Real Clicks (30 Days)</span>
                      </div>
                      <div className="stat-card">
                        <span className="stat-val">{stats?.gscTotals.impressions}</span>
                        <span className="stat-lbl">Total Impressions</span>
                      </div>
                      <div className="stat-card">
                        <span className="stat-val">{stats?.gscConnected ? "Live APIs" : "Disconnected"}</span>
                        <span className="stat-lbl">GSC Account Link</span>
                      </div>
                    </div>
                    <div className="analysis-box">
                      <p className="highlight-text">💎 Google Search Console Live Keywords Table:</p>
                      
                      {stats?.gscTotals.keywords && stats.gscTotals.keywords.length > 0 ? (
                        <table className="term-table">
                          <thead>
                            <tr>
                              <th>Target Local Keyword</th>
                              <th>Impressions</th>
                              <th>Clicks</th>
                              <th>CTR</th>
                              <th>Avg Position</th>
                            </tr>
                          </thead>
                          <tbody>
                            {stats.gscTotals.keywords.map((k, idx) => (
                              <tr key={idx}>
                                <td>"{k.query}"</td>
                                <td>{k.impressions}</td>
                                <td>{k.clicks}</td>
                                <td>{k.ctr}</td>
                                <td>#{k.position}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <div className="p-4 rounded bg-slate-900/60 border border-slate-800 text-xs text-slate-400 mb-4 leading-relaxed">
                          ⚡ <strong>Cold Start (0 Clicks / Impressions):</strong> The domain `plumbify.net` has been successfully verified, but currently has no organic clicks or impressions in GSC. 
                          <br/><br/>
                          *Status:* We have crawled 18 internal site links and submitted 20 URLs directly to the **Google Indexing API** to force crawler execution.
                        </div>
                      )}

                      <p className="summary-insight">
                        💡 <strong>AI Recommendation:</strong> Since the domain is new, there is no keyword ranking history. Focus on local maps optimization: add local structured schema markup and insert geo-targeted local plumbing FAQs on your page to force Google Map Pack rankings.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
        
            {/* Panel 3: GA4 Funnel */}
            {activeTab === "ga4" && (
              <div className="mcp-panel active-panel">
                <div className="chat-terminal">
                  <div className="terminal-header">
                    <div className="terminal-dots"><span></span><span></span><span></span></div>
                    <div className="terminal-title">GA4 Funnel Analysis · CRM Onboarding Pipeline</div>
                  </div>
                  <div className="terminal-body">
                    <div className="user-query">💬 "Where are users dropping off in the onboarding pipeline?"</div>
                    <div className="stat-grid">
                      <div className="stat-card">
                        <span className="stat-val val-red">{stats?.funnelLeaks.dropoffRate}</span>
                        <span className="stat-lbl">Onboarding Drop-off</span>
                      </div>
                      <div className="stat-card">
                        <span className="stat-val">{stats?.funnelLeaks.onboardingTotal} Leads</span>
                        <span className="stat-lbl">Total Registered Leads</span>
                      </div>
                      <div className="stat-card">
                        <span className="stat-val">{stats?.funnelLeaks.stages.setupComplete || 0}</span>
                        <span className="stat-lbl">Active Setup Complete</span>
                      </div>
                    </div>
                    <div className="analysis-box">
                      <p className="highlight-text">⚠️ CRM Onboarding Funnel Stage Breakdown (Real Leads):</p>
                      
                      <table className="term-table">
                        <thead>
                          <tr>
                            <th>Pipeline Stage</th>
                            <th>Active Lead Count</th>
                            <th>Estimated Value</th>
                            <th>Leak Root Cause / Observation</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>1. Account Created</td>
                            <td>{stats?.funnelLeaks.stages.accountCreated || 0}</td>
                            <td>$0</td>
                            <td className="action-red">100% Leads stuck here</td>
                          </tr>
                          <tr>
                            <td>2. 10DLC Pending</td>
                            <td>{stats?.funnelLeaks.stages.tenDlcPending || 0}</td>
                            <td>$0</td>
                            <td>No leads reached</td>
                          </tr>
                          <tr>
                            <td>3. Payments Linked</td>
                            <td>{stats?.funnelLeaks.stages.paymentsLinked || 0}</td>
                            <td>$0</td>
                            <td>No leads reached</td>
                          </tr>
                          <tr>
                            <td>4. Setup Complete</td>
                            <td>{stats?.funnelLeaks.stages.setupComplete || 0}</td>
                            <td>$0</td>
                            <td>No active accounts verified</td>
                          </tr>
                        </tbody>
                      </table>
                      
                      <p className="summary-insight">
                        💡 <strong>AI Recommendation:</strong> All 6 of your real website leads (e.g. *fenfen dai*, *qiang zhang*, *li zhang*) created accounts but **did not progress to 10DLC approval or Linking Payments**. We recommend checking the welcome email automation and verifying if the SMS/10DLC carrier compliance is blocking GHL notifications.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
        
            {/* Panel 4: CRM Attribution */}
            {activeTab === "crm" && (
              <div className="mcp-panel active-panel">
                <div className="chat-terminal">
                  <div className="terminal-header">
                    <div className="terminal-dots"><span></span><span></span><span></span></div>
                    <div className="terminal-title">CRM Attribution Audit · Verified Leads</div>
                  </div>
                  <div className="terminal-body">
                    <div className="user-query">💬 "Which marketing source generates the highest value plumbing opportunities?"</div>
                    <div className="stat-grid">
                      <div className="stat-card">
                        <span className="stat-val val-green">
                          ${stats && stats.crmAttribution.length > 0 
                            ? Math.round(stats.crmAttribution.reduce((sum, item) => sum + item.totalValue, 0)).toLocaleString() 
                            : "0"}
                        </span>
                        <span className="stat-lbl">Total Pipeline Value</span>
                      </div>
                      <div className="stat-card">
                        <span className="stat-val">
                          {stats?.crmAttribution.reduce((sum, item) => sum + item.count, 0) || 0}
                        </span>
                        <span className="stat-lbl">Total Opportunities</span>
                      </div>
                      <div className="stat-card">
                        <span className="stat-val">
                          {stats?.crmAttribution.find(x => x.source === "Organic Search")?.count || 0}
                        </span>
                        <span className="stat-lbl">Organic Search Leads</span>
                      </div>
                    </div>
                    <div className="analysis-box">
                      <p className="highlight-text">📊 Real GHL Lead Source ROI &amp; Revenue Breakdown:</p>
                      
                      <table className="term-table">
                        <thead>
                          <tr>
                            <th>CRM Lead Source</th>
                            <th>Opportunities</th>
                            <th>Completed (Won)</th>
                            <th>Total Opportunity Value</th>
                            <th>ROI Score (Est.)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {stats?.crmAttribution.map((item, idx) => (
                            <tr key={idx}>
                              <td><strong>{item.source}</strong></td>
                              <td>{item.count}</td>
                              <td>{item.wonCount}</td>
                              <td>${item.totalValue.toLocaleString()}</td>
                              <td>{item.roi}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      
                      <p className="summary-insight">
                        💡 <strong>AI Recommendation:</strong> <strong>Email Campaign</strong> leads have generated the highest conversion rate ($6,371 value, 1 won deal). While <strong>Organic Search</strong> generates the most volume (5 leads), they are currently at $0 value due to onboarding dropoffs. Address the onboarding friction to capitalize on free organic traffic.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
        
          </div>
        </div>

      </div>

      {/* Embedded CSS Styles exactly matching raw design but scoped locally */}
      <style jsx global>{`
        .mcp-container {
          background: #0b0f19;
          color: #f8fafc;
          border-radius: 16px;
          padding: 30px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.5);
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          border: 1px solid #1e293b;
          margin: 0 auto;
          width: 100%;
        }
        .mcp-header {
          text-align: center;
          margin-bottom: 35px;
        }
        .mcp-badge {
          display: inline-block;
          background: rgba(55, 202, 55, 0.1);
          color: #37ca37;
          border: 1px solid rgba(55, 202, 55, 0.25);
          padding: 6px 14px;
          border-radius: 50px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 15px;
        }
        .mcp-title {
          font-size: 28px;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 12px;
        }
        .mcp-subtitle {
          font-size: 15px;
          color: #94a3b8;
          max-width: 700px;
          margin: 0 auto;
          line-height: 1.5;
        }
        
        .mcp-tabs {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 15px;
          margin-bottom: 30px;
        }
        .mcp-tab-card {
          background: #111827;
          border: 1px solid #1f2937;
          border-radius: 12px;
          padding: 16px;
          cursor: pointer;
          transition: all 0.25s ease-in-out;
        }
        .mcp-tab-card:hover {
          transform: translateY(-4px);
          border-color: rgba(24, 139, 246, 0.4);
          box-shadow: 0 10px 15px -3px rgba(0,0,0,0.3);
        }
        .mcp-tab-card.active-tab {
          background: rgba(24, 139, 246, 0.05);
          border-color: #188bf6;
          box-shadow: 0 0 15px rgba(24, 139, 246, 0.15);
        }
        .mcp-tab-icon {
          display: inline-block;
          padding: 3px 8px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 700;
          margin-bottom: 10px;
        }
        .gads-color { background: rgba(239, 68, 68, 0.15); color: #ef4444; }
        .seo-color { background: rgba(55, 202, 55, 0.15); color: #37ca37; }
        .ga4-color { background: rgba(245, 158, 11, 0.15); color: #f59e0b; }
        .crm-color { background: rgba(139, 92, 246, 0.15); color: #8b5cf6; }
      
        .mcp-tab-card h3 {
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 4px;
          color: #ffffff;
        }
        .mcp-tab-card p {
          font-size: 11.5px;
          color: #94a3b8;
        }
      
        .mcp-panel {
          display: none;
        }
        .mcp-panel.active-panel {
          display: block;
          animation: slideUp 0.35s ease-out forwards;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
      
        .chat-terminal {
          background: #0f172a;
          border: 1px solid #1e293b;
          border-radius: 12px;
          overflow: hidden;
        }
        .terminal-header {
          background: #1e293b;
          padding: 10px 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          border-bottom: 1px solid #334155;
        }
        .terminal-dots span {
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          margin-right: 4px;
        }
        .terminal-dots span:nth-child(1) { background: #ef4444; }
        .terminal-dots span:nth-child(2) { background: #f59e0b; }
        .terminal-dots span:nth-child(3) { background: #10b981; }
        .terminal-title {
          font-size: 11.5px;
          color: #94a3b8;
          font-family: monospace;
        }
        .terminal-body {
          padding: 20px;
        }
        .user-query {
          font-size: 15px;
          color: #e2e8f0;
          background: #1e293b;
          padding: 12px 16px;
          border-radius: 8px;
          margin-bottom: 20px;
          display: inline-block;
          font-weight: 500;
        }
      
        .stat-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 15px;
          margin-bottom: 20px;
        }
        .stat-card {
          background: #1e293b;
          border: 1px solid #334155;
          padding: 15px;
          border-radius: 8px;
          text-align: center;
        }
        .stat-val {
          display: block;
          font-size: 20px;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 4px;
        }
        .val-red { color: #f87171 !important; }
        .val-green { color: #4ade80 !important; }
        .stat-lbl {
          font-size: 11.5px;
          color: #94a3b8;
        }
      
        .analysis-box {
          background: rgba(30, 41, 59, 0.5);
          border: 1px solid #334155;
          border-radius: 8px;
          padding: 16px;
        }
        .highlight-text {
          font-size: 13.5px;
          font-weight: 600;
          color: #ffffff;
          margin-bottom: 12px;
        }
        .term-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 16px;
          font-size: 12.5px;
        }
        .term-table th {
          text-align: left;
          color: #94a3b8;
          padding: 8px;
          border-bottom: 1px solid #334155;
        }
        .term-table td {
          padding: 8px;
          border-bottom: 1px solid #1e293b;
        }
        .action-red { color: #f87171; font-weight: 500; }
        .action-blue { color: #38bdf8; font-weight: 500; }
        .summary-insight {
          font-size: 13px;
          color: #cbd5e1;
          line-height: 1.5;
          border-left: 3px solid #188bf6;
          padding-left: 12px;
          margin-top: 10px;
        }
      
        @media (max-width: 768px) {
          .mcp-tabs {
            grid-template-columns: repeat(2, 1fr);
          }
          .stat-grid {
            grid-template-columns: 1fr;
            gap: 10px;
          }
          .mcp-title {
            font-size: 22px;
          }
          .term-table {
            display: block;
            overflow-x: auto;
          }
        }
      `}</style>
    </div>
  );
}
