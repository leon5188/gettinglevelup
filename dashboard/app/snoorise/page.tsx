'use client';

import React, { useState, useEffect } from 'react';

export default function SnooRiseDashboard() {
  const [activeTab, setActiveTab] = useState<'feed' | 'karma' | 'generator' | 'auto_init' | 'rules' | 'crm'>('feed');

  // Instant Feedback Toast Notification
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 4000);
  };

  // Safe JSON fetch helper with explicit error status handling
  const safeFetchJSON = async (url: string, options?: any) => {
    try {
      const res = await fetch(url, options);
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || `请求失败 (HTTP ${res.status})` };
      }
      return data;
    } catch (netErr: any) {
      return { success: false, error: netErr.message || "网络请求失败，请检查通道连接。" };
    }
  };

  // Reddit Session State (OAuth 2.0)
  const [connectedUser, setConnectedUser] = useState<{ connected: boolean; username?: string } | null>(null);
  const [loadingSession, setLoadingSession] = useState(true);

  // Active Selected Subreddit Selector
  const [activeSubFilter, setActiveSubFilter] = useState('r/plumbing');

  // Live Reddit Hot Posts Wall State (Zero Dummy Data)
  const [karmaPosts, setKarmaPosts] = useState<any[]>([]);
  const [loadingKarmaScan, setLoadingKarmaScan] = useState(false);
  const [selectedKarmaPost, setSelectedKarmaPost] = useState<any>(null);
  const [generatedKarmaReply, setGeneratedKarmaReply] = useState('');
  const [loadingKarmaGen, setLoadingKarmaGen] = useState(false);
  const [postingCommentId, setPostingCommentId] = useState<string | null>(null);

  // Live Intent Leads Stream State (Zero Dummy Data)
  const [intentLeads, setIntentLeads] = useState<any[]>([]);
  const [scanStats, setScanStats] = useState<{ harvested: number; passedPrefilter: number; scored: number } | null>(null);
  const [loadingIntentScan, setLoadingIntentScan] = useState(false);

  // Dynamic Rules Radar State (Subrise Engine)
  const [subredditName, setSubredditName] = useState('r/plumbing');
  const [rawRules, setRawRules] = useState('');
  const [parsedRules, setParsedRules] = useState<any>(null);
  const [loadingRules, setLoadingRules] = useState(false);

  // Auto Scrape State (SnooGrow Style)
  const [websiteUrl, setWebsiteUrl] = useState('https://plumbify.net');
  const [loadingAuto, setLoadingAuto] = useState(false);
  const [autoSubreddits, setAutoSubreddits] = useState<any[]>([]);

  // Generator State (90:10 RAG)
  const [postContext, setPostContext] = useState('How do master plumbers handle missed calls after hours? We lose ~10 leads every week on job sites.');
  const [knowledgeBase, setKnowledgeBase] = useState('Plumbify is a B2B SaaS for trade contractors. Instant 60-second SMS follow-up on missed calls + AI booking.');
  const [generatedReply, setGeneratedReply] = useState('');
  const [loadingGen, setLoadingGen] = useState(false);

  // Preset Context Scenarios for 90:10 Generator
  const presetScenarios = [
    {
      title: '错失失联客户场景',
      context: 'How do 10+ tech plumbing business owners handle missed calls during peak summer emergency calls?',
      kb: 'Plumbify B2B SaaS: Automated 60-second SMS response system for missed calls with instant photo intake.'
    },
    {
      title: '管道防爆/水压诊断场景',
      context: 'What is the most effective way to explain water heater maintenance to homeowners to prevent 3 AM emergency callouts?',
      kb: 'Plumbify automated customer care: Scheduled annual maintenance reminders for plumbing contractors.'
    },
    {
      title: '承包商派单效率场景',
      context: 'What software do master trade contractors use to dispatch technicians without losing job details?',
      kb: 'Plumbify dispatch engine: Real-time route optimization + SMS customer updates.'
    }
  ];

  // Sync State
  const [syncStatus, setSyncStatus] = useState('');
  const [loadingSync, setLoadingSync] = useState(false);

  // Check Reddit Session on Mount
  const checkSession = async () => {
    setLoadingSession(true);
    const data = await safeFetchJSON('/api/snoorise', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'reddit_session' })
    });
    if (data && data.success) {
      setConnectedUser(data.connected ? { connected: true, username: data.username } : { connected: false });
    } else {
      setConnectedUser({ connected: false });
    }
    setLoadingSession(false);
  };

  const handleDisconnect = async () => {
    showToast('🚀 正在断开 Reddit 账号连接...');
    const data = await safeFetchJSON('/api/snoorise', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'reddit_disconnect' })
    });
    if (data && data.success) {
      setConnectedUser({ connected: false });
      showToast('✅ 已成功断开 Reddit 账号。');
    }
  };

  // Post comment via Reddit OAuth API
  const handlePostComment = async (thingId: string, commentText: string) => {
    if (!commentText?.trim()) {
      showToast('❌ 请先填写评论内容！');
      return;
    }
    setPostingCommentId(thingId);
    showToast('🚀 正在通过 Reddit OAuth API 发表评论...');
    const data = await safeFetchJSON('/api/snoorise', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'post_comment', thingId, commentText })
    });
    if (data && data.success) {
      showToast(`🎉 评论发表成功！以 u/${connectedUser?.username} 身份完成。`);
    } else {
      showToast(`❌ 发表失败: ${data?.error || '请确认已登录 Reddit 账号'}`);
    }
    setPostingCommentId(null);
  };

  // Fetch 100% Real Live Intent Leads Stream
  const handleScanIntentLeads = async () => {
    setLoadingIntentScan(true);
    showToast('📡 正在全网扫描 Reddit 真实意向买家与求助贴...');
    const data = await safeFetchJSON('/api/snoorise', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'scan_intent_leads' })
    });
    if (data && data.success && data.leads) {
      setIntentLeads(data.leads);
      if (data.stats) setScanStats(data.stats);
      showToast(`✅ 实时扫描成功！捕获到 ${data.leads.length} 条真实高意向买家！`);
    } else {
      showToast(`❌ 扫盘提示: ${data?.error || "请重试"}`);
    }
    setLoadingIntentScan(false);
  };

  // 100% Real Live Reddit Hot Posts Scanner
  const handleScanKarmaPosts = async (targetSubName?: string) => {
    const subToScan = targetSubName || activeSubFilter;
    setLoadingKarmaScan(true);
    showToast(`📡 正在全网扫盘《${subToScan}》当前最新存活热帖...`);
    
    const data = await safeFetchJSON('/api/snoorise', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'scan_karma_posts', subredditName: subToScan })
    });
    
    if (data && data.success && data.karmaPosts) {
      setKarmaPosts(data.karmaPosts);
      showToast(`✅ 扫盘成功！拉取到 ${data.karmaPosts.length} 条《${subToScan}》最新热帖！`);
    } else {
      showToast(`❌ ${data?.error || '扫盘失败'}`);
    }
    setLoadingKarmaScan(false);
  };

  // Auto Fetch Real Live Reddit Data on Mount
  useEffect(() => {
    checkSession();
    handleScanKarmaPosts(activeSubFilter);
    handleScanIntentLeads();
  }, []);

  const handleGenerateKarmaReply = async (post: any) => {
    setSelectedKarmaPost(post);
    setLoadingKarmaGen(true);
    showToast(`🧠 正在调用 Gemini 2.0 Flash 为热帖《${post.title.slice(0, 15)}...》撰写高赞回复...`);
    const data = await safeFetchJSON('/api/snoorise', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'generate_karma_reply', karmaPost: post })
    });
    if (data && data.success) {
      setGeneratedKarmaReply(data.karmaReply);
      showToast('✨ Gemini 2.0 Flash 真实干货回复生成完毕！');
    } else {
      showToast(`❌ ${data?.error || '回复生成遇到问题'}`);
    }
    setLoadingKarmaGen(false);
  };

  const handleInspectSubredditRules = async (subName: string) => {
    setSubredditName(subName);
    setLoadingRules(true);
    setActiveTab('rules');
    showToast(`🛡️ 正在调出《${subName}》动态版规风控雷达...`);
    const data = await safeFetchJSON('/api/snoorise', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'parse_rules', subredditName: subName })
    });
    if (data && data.success) {
      setRawRules(data.rawRules);
      setParsedRules(data.rulesSummary);
      showToast(`✅ 《${subName}》版规雷达分析完成！`);
    } else {
      showToast(`❌ ${data?.error || '规则解析失败'}`);
    }
    setLoadingRules(false);
  };

  const handleParseRules = async () => {
    setLoadingRules(true);
    showToast(`🛡️ 正在重新解析《${subredditName}》版规...`);
    const data = await safeFetchJSON('/api/snoorise', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'parse_rules', subredditName, subredditRules: rawRules })
    });
    if (data && data.success) {
      setParsedRules(data.rulesSummary);
      showToast('✅ 解析完成！');
    } else {
      showToast(`❌ ${data?.error || '解析失败'}`);
    }
    setLoadingRules(false);
  };

  const handleGenerateReply = async () => {
    setLoadingGen(true);
    setGeneratedReply('');
    showToast('🧠 正在调用 Gemini 2.0 Flash 生成 90:10 零防封地道回复...');
    const data = await safeFetchJSON('/api/snoorise', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'generate_reply', postContext, knowledgeBase })
    });

    if (data && data.success && data.generatedReply) {
      setGeneratedReply(data.generatedReply);
      showToast('✨ 90:10 零防封回复生成完毕！');
    } else {
      showToast(`❌ ${data?.error || '生成遇到异常'}`);
    }
    setLoadingGen(false);
  };

  const handleAutoScrape = async () => {
    setLoadingAuto(true);
    showToast('🚀 正在发起全网 AI 智能网页抓取与 10+ Subreddits 深度匹配...');
    const data = await safeFetchJSON('/api/snoorise', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'auto_scrape_website', websiteUrl })
    });
    if (data && data.success) {
      setKnowledgeBase(data.extractedKB);
      setAutoSubreddits(data.recommendedSubreddits);
      showToast(`✅ 成功提取 KB 知识库并深度匹配 ${data.recommendedSubreddits.length} 个核心 Subreddits！`);
    } else {
      showToast(`❌ ${data?.error || '抓取解析失败'}`);
    }
    setLoadingAuto(false);
  };

  const handleSyncCRM = async (lead: any) => {
    setLoadingSync(true);
    setSyncStatus('');
    showToast(`🔗 正在将 ${lead.author} 同步至 Plumbify GHL CRM...`);
    const data = await safeFetchJSON('/api/snoorise', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'sync_ghl', intentLead: lead })
    });
    if (data && data.success) {
      setSyncStatus(`✅ 成功将 ${lead.author} 同步至 Plumbify GHL CRM! (ID: ${data.ghlContactId})`);
      showToast(`✅ 已写入 GHL CRM 并打上 tag！`);
    } else {
      setSyncStatus(`❌ CRM 同步失败: ${data?.error}`);
      showToast(`❌ ${data?.error || 'CRM 同步失败'}`);
    }
    setLoadingSync(false);
  };

  const handleCopyText = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    showToast('📋 已成功复制 Gemini 高赞回复到剪贴板！');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 font-sans relative">
      {/* Toast Notification Bar */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 border-2 border-orange-500 text-slate-100 px-6 py-3.5 rounded-2xl shadow-2xl backdrop-blur-md font-mono text-sm flex items-center space-x-3 animate-bounce">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <header className="max-w-7xl mx-auto mb-8 flex justify-between items-center border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center space-x-3">
            <span className="text-3xl">🚀</span>
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-orange-400 via-amber-300 to-amber-500 bg-clip-text text-transparent">
              SnooRise AI Platform (Official OAuth 2.0)
            </h1>
            <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs px-2.5 py-1 rounded-full font-mono">
              100% Safe OAuth Flow
            </span>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            🎯 捕获正在寻找水管/维修服务的房主 ➔ Gemini AI 草拟专业干货回复 ➔ 官方 OAuth 授权一键评论
          </p>
        </div>

        {/* Account OAuth Badge */}
        <div className="flex items-center space-x-3">
          {loadingSession ? (
            <div className="text-xs text-slate-400 font-mono">检查登录中...</div>
          ) : connectedUser?.connected ? (
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-emerald-950/60 border border-emerald-800 px-4 py-2 rounded-xl text-xs font-mono text-emerald-300">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>已连接 Reddit: <strong>u/{connectedUser.username}</strong></span>
              </div>
              <button
                onClick={handleDisconnect}
                className="bg-slate-900 border border-slate-700 hover:border-red-500/50 text-slate-400 hover:text-red-400 text-xs px-3 py-2 rounded-xl transition"
              >
                断开
              </button>
            </div>
          ) : (
            <a
              href="/api/snoorise/auth"
              className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:opacity-90 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg transition flex items-center space-x-2"
            >
              <span>🔗 官方 OAuth 授权连接 Reddit</span>
            </a>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto">
        {/* Navigation Tabs */}
        <div className="flex space-x-2 border-b border-slate-800 mb-8 overflow-x-auto pb-1">
          {[
            { id: 'feed', label: '🎯 100% 真实意向买家监控流', icon: '🎯' },
            { id: 'karma', label: '🔥 在榜热帖草拟与一键直达发帖', icon: '🔥' },
            { id: 'generator', label: '🧠 90:10 知识库生成器', icon: '🧠' },
            { id: 'auto_init', label: '🌐 网址一键匹配 10+ Subreddits 社区', icon: '🌐' },
            { id: 'rules', label: '🛡️ 真实版规雷达分析', icon: '🛡️' },
            { id: 'crm', label: '🔗 Plumbify CRM 直连配置', icon: '🔗' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                showToast(`已切换到【${tab.label}】`);
              }}
              className={`px-5 py-3 rounded-t-xl font-medium text-sm transition-all duration-200 flex items-center space-x-2 border-b-2 ${
                activeTab === tab.id
                  ? 'bg-slate-900 border-orange-500 text-orange-400 shadow-lg'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
              }`}
            >
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab 4: Intent Leads Feed */}
        {activeTab === 'feed' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-sm">
              <div>
                <h2 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
                  <span>🎯 全网 Reddit 真实意向买家与求助帖监控流 (100% Real Live Stream)</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  100% 实时从 Reddit 抓取高意向买家提问，智能打分筛选优质 Lead！
                </p>
                {scanStats && (
                  <div className="flex space-x-3 text-xs font-mono mt-2 text-slate-300">
                    <span className="bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
                      抓取总数: <strong className="text-amber-400">{scanStats.harvested}</strong>
                    </span>
                    <span className="bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
                      规则关卡规则过滤: <strong className="text-teal-400">{scanStats.passedPrefilter}</strong>
                    </span>
                    <span className="bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
                      AI 判定高意向: <strong className="text-emerald-400">{scanStats.scored}</strong>
                    </span>
                  </div>
                )}
              </div>
              <button
                onClick={handleScanIntentLeads}
                disabled={loadingIntentScan}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-90 text-white text-xs font-bold px-5 py-3 rounded-xl transition shadow-lg whitespace-nowrap"
              >
                {loadingIntentScan ? '📡 扫盘中...' : '📡 实时扫描最新意向求助买家'}
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {loadingIntentScan && (
                <div className="p-8 text-center text-xs text-orange-400 font-mono animate-pulse">
                  📡 正在打向 Reddit API 实时抓取最新高意向买家求助帖...
                </div>
              )}

              {intentLeads.length > 0 ? (
                intentLeads.map((lead) => (
                  <div key={lead.id || lead.name} className="bg-slate-900/80 border border-slate-800 hover:border-orange-500/50 transition duration-200 rounded-2xl p-6 backdrop-blur-sm flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 space-x-0 md:space-x-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center space-x-3">
                        <span className="bg-orange-500/20 text-orange-400 border border-orange-500/30 text-xs px-2.5 py-0.5 rounded-full font-mono font-bold">
                          {lead.subreddit}
                        </span>
                        <span className="text-xs font-bold text-slate-300">{lead.author}</span>
                        <span className="text-xs text-slate-500">• {lead.createdUtc ? new Date(lead.createdUtc * 1000).toLocaleTimeString() : '最新'}</span>
                      </div>
                      <h3 className="text-base font-bold text-slate-100">{lead.title}</h3>
                      <p className="text-xs text-slate-400 bg-slate-950 p-3 rounded-lg border border-slate-800/80">
                        "{lead.snippet || lead.body}"
                      </p>
                    </div>

                    <div className="flex flex-col items-end space-y-3 w-full md:w-auto">
                      <div className="flex items-center space-x-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs px-3 py-1 rounded-full font-bold">
                        <span>意向得分:</span>
                        <span>{lead.score || lead.intentScore || 5} / 5</span>
                      </div>

                      <div className="flex space-x-2 w-full md:w-auto">
                        <a
                          href={lead.permalink}
                          target="_blank"
                          rel="noreferrer"
                          className="flex-1 md:flex-none bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-4 py-2.5 rounded-lg transition border border-slate-700 block text-center shadow-md"
                        >
                          ↗ 打开 Reddit 原贴
                        </a>
                        <button
                          onClick={() => handleSyncCRM(lead)}
                          disabled={loadingSync}
                          className="flex-1 md:flex-none bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition shadow-md whitespace-nowrap"
                        >
                          一键同步至 CRM
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                !loadingIntentScan && (
                  <div className="p-8 text-center text-xs text-slate-500 font-mono border border-dashed border-slate-800 rounded-2xl">
                    点击右上角“📡 实时扫描最新意向求助买家”按钮实时拉取最新数据。
                  </div>
                )
              )}
            </div>

            {syncStatus && (
              <div className="p-4 bg-slate-900 border border-slate-800 text-slate-200 rounded-xl text-sm font-mono text-center">
                {syncStatus}
              </div>
            )}
          </div>
        )}

        {/* Tab 1: Real Live Karma Posts & OAuth One-Click Posting */}
        {activeTab === 'karma' && (
          <div className="space-y-8">
            {/* Real Live Reddit Hot Posts Scanner */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
                      <span>🔥 Reddit 在榜热帖实时扫描与 AI 文案一键发帖</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      选择社区，实时生成高赞干货回复，支持用连接好的 Reddit OAuth 账号一键评论：
                    </p>
                  </div>
                  <button
                    onClick={() => handleScanKarmaPosts(activeSubFilter)}
                    disabled={loadingKarmaScan}
                    className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-90 text-white text-sm font-bold px-6 py-3 rounded-xl transition shadow-lg whitespace-nowrap"
                  >
                    {loadingKarmaScan ? '📡 扫盘中...' : `📡 刷新《${activeSubFilter}》热门文章`}
                  </button>
                </div>

                {/* Subreddit Quick Switcher Pills */}
                <div className="flex space-x-2 overflow-x-auto pb-2">
                  {['r/plumbing', 'r/HVAC', 'r/HomeImprovement', 'r/DIY', 'r/AskReddit', 'r/smallbusiness'].map(sub => (
                    <button
                      key={sub}
                      onClick={() => {
                        setActiveSubFilter(sub);
                        handleScanKarmaPosts(sub);
                      }}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition border ${
                        activeSubFilter === sub
                          ? 'bg-orange-500 text-white border-orange-400 font-bold shadow-md'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-orange-500/50 hover:text-slate-200'
                      }`}
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                {/* Posts Wall */}
                <div className="space-y-3">
                  {loadingKarmaScan && (
                    <div className="p-8 text-center text-xs text-orange-400 font-mono animate-pulse">
                      📡 正在打向 Reddit API 实时抓取《{activeSubFilter}》最新热帖...
                    </div>
                  )}

                  {karmaPosts.length > 0 ? (
                    karmaPosts.map((post) => (
                      <div
                        key={post.id || post.name}
                        onClick={() => handleGenerateKarmaReply(post)}
                        className={`p-4 rounded-xl border transition duration-200 cursor-pointer space-y-2.5 ${
                          selectedKarmaPost?.id === post.id ? 'bg-slate-900 border-orange-500 shadow-xl' : 'bg-slate-950 border-slate-800 hover:border-orange-500/50'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">{post.subreddit}</span>
                          <span className="text-xs text-slate-400">{post.author}</span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-100">{post.title}</h4>
                        <p className="text-xs text-slate-400 bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                          "{post.snippet}"
                        </p>
                        <div className="flex justify-between items-center text-xs text-slate-500 pt-1 font-mono">
                          <span>👍 {post.upvotes} 点赞 • 💬 {post.comments} 讨论</span>
                          <span className="text-orange-400 font-bold hover:underline">点击生成 AI 高赞回复 ➔</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    !loadingKarmaScan && (
                      <div className="p-8 text-center text-xs text-slate-500 font-mono border border-dashed border-slate-800 rounded-2xl">
                        点击上方“📡 刷新热门文章”按钮实时获取在榜热帖。
                      </div>
                    )
                  )}
                </div>

                {/* Gemini Reply Card */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-bold text-slate-300">✍️ Gemini 2.0 Flash 专属高赞回复：</h4>
                    {loadingKarmaGen && <span className="text-xs text-orange-400 font-mono animate-pulse">AI 生成中...</span>}
                  </div>

                  {selectedKarmaPost ? (
                    <div className="space-y-4">
                      <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl relative">
                        <span className="absolute top-2.5 right-2.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] px-2 py-0.5 rounded font-mono">
                          TARGET: {selectedKarmaPost.name || selectedKarmaPost.id}
                        </span>
                        <pre className="whitespace-pre-wrap font-sans text-xs text-slate-200 leading-relaxed">
                          {loadingKarmaGen ? '调用 Gemini 2.0 Flash 针对真实文章生成中...' : generatedKarmaReply}
                        </pre>
                      </div>

                      <div className="space-y-3">
                        {connectedUser?.connected ? (
                          <button
                            onClick={() => handlePostComment(selectedKarmaPost.name, generatedKarmaReply)}
                            disabled={postingCommentId === selectedKarmaPost.name || loadingKarmaGen}
                            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-90 text-white text-xs font-extrabold py-3.5 rounded-xl transition shadow-lg flex items-center justify-center space-x-2"
                          >
                            <span>{postingCommentId === selectedKarmaPost.name ? '🚀 正在发表评论...' : `⚡ 以 u/${connectedUser.username} 身份一键发评论`}</span>
                          </button>
                        ) : (
                          <a
                            href="/api/snoorise/auth"
                            className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:opacity-90 text-white text-xs font-extrabold py-3.5 rounded-xl transition shadow-lg flex items-center justify-center space-x-2 block text-center"
                          >
                            <span>🔗 先授权连接 Reddit 账号即可一键发布</span>
                          </a>
                        )}

                        <a
                          href={selectedKarmaPost.permalink}
                          target="_blank"
                          rel="noreferrer"
                          onClick={() => handleCopyText(generatedKarmaReply)}
                          className="w-full bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold py-2.5 rounded-xl transition border border-slate-800 flex items-center justify-center space-x-2 block text-center"
                        >
                          <span>📋 复制文案 + 秒开原贴 ↗</span>
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div className="h-64 flex flex-col items-center justify-center text-slate-500 text-xs border border-dashed border-slate-800 rounded-lg space-y-2">
                      <span className="text-2xl">👈</span>
                      <span>请在左侧点击任意真实文章卡片</span>
                      <span className="text-slate-600">系统将即刻调用 Gemini 2.0 Flash 生成专属高赞干货！</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: SnooGrow 90:10 Content Generator */}
        {activeTab === 'generator' && (
          <div className="space-y-6">
            {/* Quick Scenario Fill Bar */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-sm space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-slate-200 flex items-center space-x-2">
                  <span>⚡ 快速场景预设 (点击一键填入 Reddit 常见求助场景)</span>
                </h3>
                <span className="text-xs text-orange-400 font-mono">Preset Scenarios</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {presetScenarios.map((sc, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setPostContext(sc.context);
                      setKnowledgeBase(sc.kb);
                      showToast(`已填入【${sc.title}】！`);
                    }}
                    className="p-3 bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-orange-500/60 rounded-xl text-left transition duration-200 space-y-1"
                  >
                    <span className="text-xs font-bold text-orange-400 block">📌 {sc.title}</span>
                    <span className="text-[11px] text-slate-400 line-clamp-2">{sc.context}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm space-y-4">
                <h2 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
                  <span>🧠 90:10 知识库 RAG 内容生成参数设置</span>
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Reddit 帖子求助上下文 (Post Context)</label>
                    <textarea
                      rows={4}
                      value={postContext}
                      onChange={(e) => setPostContext(e.target.value)}
                      placeholder="例: How do plumbers handle missed calls when on job sites?"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-100 focus:border-orange-500 outline-none leading-relaxed"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">企业 Knowledge Base / 产品优势知识库</label>
                    <textarea
                      rows={5}
                      value={knowledgeBase}
                      onChange={(e) => setKnowledgeBase(e.target.value)}
                      placeholder="例: Plumbify is a B2B SaaS for contractors that sends instant 60-second SMS follow-ups..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-100 focus:border-orange-500 outline-none font-mono text-xs leading-relaxed"
                    />
                  </div>
                  <button
                    onClick={handleGenerateReply}
                    disabled={loadingGen}
                    className="w-full bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:opacity-90 text-white font-extrabold py-3.5 rounded-xl transition text-sm shadow-xl flex items-center justify-center space-x-2"
                  >
                    <span>{loadingGen ? '🧠 Gemini 2.0 Flash 深度推理生成中...' : '🚀 生成 90:10 零防封地道回复 (Generate Native 90:10 Reply)'}</span>
                  </button>
                </div>
              </div>

              {/* Generated Output Card */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-bold text-slate-100">✍️ 生成的原生 90:10 回复</h2>
                  {generatedReply && (
                    <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs px-2.5 py-0.5 rounded font-mono font-bold">
                      90% Value + 10% Soft Pitch
                    </span>
                  )}
                </div>

                {generatedReply ? (
                  <div className="space-y-4">
                    <div className="p-5 bg-slate-950 border border-slate-800 rounded-xl relative space-y-3">
                      <pre className="whitespace-pre-wrap font-sans text-xs text-slate-200 leading-relaxed">
                        {generatedReply}
                      </pre>
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleCopyText(generatedReply)}
                        className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-90 text-white text-xs font-bold py-3 rounded-xl transition shadow-md flex items-center justify-center space-x-2"
                      >
                        <span>📋 一键复制 90:10 原生文案到剪贴板</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="h-64 flex flex-col items-center justify-center text-slate-500 text-xs border border-dashed border-slate-800 rounded-xl space-y-2">
                    <span className="text-3xl">🧠</span>
                    <span className="text-slate-400 font-bold">尚未生成回复</span>
                    <span className="text-slate-600">选择上方预设场景或自定义上下文，点击按钮调用 Gemini 2.0 Flash！</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 0: Auto Init */}
        {activeTab === 'auto_init' && (
          <div className="space-y-8">
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm space-y-4">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🌐</span>
                <h2 className="text-lg font-bold text-slate-100">输入项目官网 URL 一键深度匹配 10+ 目标 Subreddit 社区</h2>
              </div>
              <p className="text-xs text-slate-400">
                填入您的产品网站 URL（例如 https://plumbify.net），AI 将自动抓取网站内容，生成全量公司 KB 知识库，并智能匹配 10 个高转化 Target Subreddit 社区。
              </p>

              <div className="flex space-x-3">
                <input
                  type="text"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  placeholder="https://yourproduct.com"
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-100 focus:border-orange-500 outline-none font-mono"
                />
                <button
                  onClick={handleAutoScrape}
                  disabled={loadingAuto}
                  className="bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition text-sm shadow-md whitespace-nowrap"
                >
                  {loadingAuto ? 'AI 真实抓取解析中...' : '🚀 一键深度匹配 10 个目标 Subreddits'}
                </button>
              </div>
            </div>

            {/* Display Full 10 Auto Generated Recommendations */}
            {autoSubreddits.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-md font-bold text-slate-200 flex items-center justify-between">
                  <span>🎯 AI 深度匹配为您精选的 {autoSubreddits.length} 个核心 Subreddit 社区墙</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {autoSubreddits.map((sub, idx) => (
                    <div key={idx} className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3 hover:border-orange-500/50 transition duration-200">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-100 text-base">{sub.name}</span>
                        <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs px-2 py-0.5 rounded font-mono">
                          匹配度: {sub.matchScore}%
                        </span>
                      </div>
                      <div className="flex justify-between text-xs text-slate-400">
                        <span>订阅人数: {sub.members}</span>
                        <span>风控: <strong className="text-amber-400">{sub.riskLevel}</strong></span>
                      </div>
                      <p className="text-xs text-slate-400 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                        {sub.reason}
                      </p>

                      <button
                        onClick={() => handleInspectSubredditRules(sub.name)}
                        className="w-full bg-slate-800 hover:bg-orange-600/80 text-orange-300 hover:text-white border border-slate-700 hover:border-orange-500 text-xs font-semibold py-2 rounded-lg transition duration-200 flex items-center justify-center space-x-1"
                      >
                        <span>🛡️ 查看《{sub.name} 真实版规雷达》</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Dynamic Subrise Rules Parser */}
        {activeTab === 'rules' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-100">🛡️ 真实版规雷达分析 (Subrise Engine)</h2>
                <span className="bg-orange-500/20 text-orange-400 border border-orange-500/30 text-xs px-2.5 py-0.5 rounded font-mono">
                  {subredditName}
                </span>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">当前分析的 Subreddit</label>
                  <input
                    type="text"
                    value={subredditName}
                    onChange={(e) => setSubredditName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-slate-100 focus:border-orange-500 outline-none font-bold text-orange-400"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">从 Reddit 官网 API 实时抓取到规则原文 (Rules)</label>
                  <textarea
                    rows={5}
                    value={rawRules}
                    onChange={(e) => setRawRules(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-slate-100 focus:border-orange-500 outline-none font-mono text-xs"
                  />
                </div>
                <button
                  onClick={handleParseRules}
                  disabled={loadingRules}
                  className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold py-3 rounded-lg hover:opacity-90 transition text-sm shadow-md"
                >
                  {loadingRules ? '实时解析中...' : `重新分析《${subredditName} 真实版规》`}
                </button>
              </div>
            </div>

            {/* Parsed Output */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
              <h2 className="text-lg font-bold text-slate-100 mb-4">📊 《{subredditName}》真实版规风控打分</h2>
              {parsedRules ? (
                <div className="space-y-4">
                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-slate-400">自荐许可策略</span>
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase ${
                        parsedRules.allowSelfPromotion === 'allowed' ? 'bg-emerald-500/20 text-emerald-400' :
                        parsedRules.allowSelfPromotion === 'restricted' ? 'bg-amber-500/20 text-amber-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {parsedRules.allowSelfPromotion}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-400">封号/删帖风险指数</span>
                      <span className="text-lg font-extrabold text-orange-400">{parsedRules.riskScore} / 5</span>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                    <span className="text-xs text-slate-400 block font-semibold">该社区专属约束与限制项：</span>
                    {parsedRules.constraints?.map((c: string, idx: number) => (
                      <div key={idx} className="flex items-center space-x-2 text-xs text-slate-300">
                        <span className="text-orange-400">•</span>
                        <span>{c}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="h-48 flex items-center justify-center text-slate-500 text-sm border border-dashed border-slate-800 rounded-xl">
                  选择或切换社区查看实时风控雷达
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 5: CRM Pipeline Integration */}
        {activeTab === 'crm' && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm space-y-6">
            <h2 className="text-lg font-bold text-slate-100">🔗 Plumbify / GoHighLevel CRM 直连配置</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <span className="text-xs text-slate-400 block font-semibold">CRM 目标 Location ID:</span>
                <code className="text-xs text-emerald-400 font-mono block">RHROdkS0TNPBFZHcZsX0 (Plumbify Active)</code>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <span className="text-xs text-slate-400 block font-semibold">自动同步标签 (Tags):</span>
                <div className="flex space-x-2">
                  <span className="bg-slate-800 text-slate-300 text-xs px-2 py-1 rounded">reddit_intent_lead</span>
                  <span className="bg-slate-800 text-slate-300 text-xs px-2 py-1 rounded">snoorise_ai_captured</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
