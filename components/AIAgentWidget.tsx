"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { 
  Bot, 
  Volume2, 
  VolumeX, 
  Send, 
  X, 
  Languages, 
  Phone, 
  Calendar, 
  CreditCard, 
  Sliders,
  Sparkles, 
  CheckCircle, 
  ArrowRight,
  Loader2,
  Mic,
  Users,
  MessageSquare,
  Check,
  UserCheck,
  Database,
  TrendingUp,
  RefreshCcw,
  User,
  Zap,
  CheckCircle2,
  FileDown,
  ArrowLeftRight,
  Keyboard
} from "lucide-react";

// Localized script for the self-serve product walkthrough
const LOCALIZATION = {
  en: {
    greeting: "Hi, I'm Plumbify's AI Sales Copilot! Open for an instant self-serve demo.",
    subGreeting: "Online 24/7 • Speaks 4 Languages • One-Click Voice/Chat",
    inputPlaceholder: "Ask about pricing, features, type 'check API status' or 'upgrade'...",
    agentIntro: "Welcome to Plumbify! I am your AI Sales & Operations Copilot. I can answer any questions, toggle features, or execute system tasks. Try saying:\n\n1. 'Start onboarding tour'\n2. 'Check API status'\n3. 'Upgrade my subscription'\n4. 'Export leads to CSV'",
    
    smsIntro: "Missed-Call Auto Text-Back: 70% of clients call the next plumbing company if you don't answer. Plumbify detects missed calls and texts back in 5 seconds. Look at the smartphone simulation on the left. In 30 seconds, it captures the lead and books the job!",
    calendarIntro: "Smart GHL Dispatch Calendar: Once a customer books via SMS, Plumbify automatically schedules the job, maps the route, and assigns the nearest technician. Look at the dispatch board on the left.",
    invoiceIntro: "Mobile Invoice & Tap-to-Pay: When a job is completed, your technician creates an invoice in 3 seconds. The customer simply taps their card against the tech's phone to pay instantly. Look at the mobile receipt payment on the left!",
    recruitIntro: "AI Recruiting Assistant: Scans job boards, text-screens applicants, qualifies license types, and books interviews with Master Plumbers. Look at the hiring pipeline simulation on the left.",
    
    pricingInfo: "Plumbify has 3 simple plans:\n1. Starter ($197/mo): Missed-Call Text-Back, smart calendar, and mobile payments.\n2. Growth ($397/mo): Adds AI recruiting and database reactivation.\n3. Custom: For 20+ truck fleets.\n\nYou can click the plan buttons below to start your 14-day free trial instantly!",
    leadPrompt: "If you'd like a representative to call you to answer specific custom business questions, please fill out the lead form on the left pane, and I will register you as a VIP Lead in our system.",
    leadSuccess: "Excellent! Your details are registered in our GHL database. A Plumbify representative will follow up. You can close this sandbox or check out our pricing tiers below!",
    errorText: "Sorry, I ran into a scheduling error. Please try again or contact support.",
    buttonSubmit: "Register as VIP Lead",
    
    startTour: "Start 3-Min Auto Tour ➔",
    nextStep: "Next Feature ➔",
    prevStep: "⬅ Previous",
    skipTour: "Skip Tour",
    finishTour: "Complete Tour 🎉",
    tourProgress: "Demo Step {step} of 5",
    voiceSettings: "Voice Settings",
    voiceSpeed: "Speed",
    voicePitch: "Pitch",
    voiceSelect: "Voice Engine"
  },
  "zh-TW": {
    greeting: "您好！我是 Plumbify AI 銷售與營運助理。點擊即可直接看演示或語音通話！",
    subGreeting: "24小時在線 • 支援4種語言 • 一鍵語音/打字切換",
    inputPlaceholder: "詢問價格、功能，輸入『檢查整合』、『升級方案』或語音對話...",
    agentIntro: "歡迎來到 Plumbify！我是您的 AI 銷售與營運副駕駛。我可以回答您的任何問題、引導功能，或為您執行系統操作。您可以試著對我說：\n\n1. 『開始新手指引』\n2. 『檢查 API 整合狀態』\n3. 『升級我的訂閱方案』\n4. 『匯出客戶名單』",
    
    smsIntro: "漏電簡訊自動回撥（Missed-Call Auto SMS）：70% 的客戶若電話未接會立刻改撥別家。Plumbify 會在 5 秒內自動發送簡訊挽回客戶。請看左側的手機模擬。30 秒內自動溝通並完成預約！",
    calendarIntro: "智慧派單行事曆（Smart GHL Dispatch Calendar）：客戶透過簡訊預約成功後，系統會自動排程、優化派單路線，並指派給最近的師傅。請看左側的派單看板模擬。",
    invoiceIntro: "手機感應收款（Tap-to-Pay & Invoice）：完工後，師傅可在手機上 3 秒生成發票。客戶只需將信用卡在師傅的手機背面輕碰，即可完成付款！請看左側的付款動畫。",
    recruitIntro: "AI 招募助理：自動篩選招募管道、發送簡訊面試應徵者、核對證照類別，並將合適人選約入您的面試行事曆。請看左側的招募漏斗模擬。",
    
    pricingInfo: "Plumbify 提供三種方案：\n1. 基礎版 (Starter - $197/月)：包含簡訊回撥、智慧派單與手機感應收款。\n2. 專業成長版 (Growth - $397/月)：增加 AI 招募助理與客戶資料活化。\n3. 企業客製版 (Custom)：適合 20 輛工程車以上的車隊。\n\n您可以點擊下方按鈕啟動您的 14 天免費挑戰！",
    leadPrompt: "如果您想與專人直接聯繫解答特殊業務問題，請填寫左側表單，我會立刻將您註冊為 VIP 客戶並同步至 GHL 系統中。",
    leadSuccess: "太棒了！您的資訊已成功登錄至我們的 CRM 系統中。專員會盡快與您聯繫。您可以直接點擊下方按鈕啟動免費試用！",
    errorText: "抱歉，送出時發生一些問題，請稍後再試或直接聯繫我們的客服。",
    buttonSubmit: "送出並預約專人回電",
    
    startTour: "開始 3 分鐘自動演示 ➔",
    nextStep: "下一項功能 ➔",
    prevStep: "⬅ 上一步",
    skipTour: "跳過演示",
    finishTour: "完成演示 🎉",
    tourProgress: "演示第 {step} 步 (共 5 步)",
    voiceSettings: "語音設定",
    voiceSpeed: "語速",
    voicePitch: "音調",
    voiceSelect: "語音引擎"
  },
  es: {
    greeting: "¡Hola! Soy el Copiloto IA de Plumbify. Ver una demo instantánea aquí.",
    subGreeting: "Activo 24/7 • Habla 4 Idiomas • Una tecla voz/chat",
    inputPlaceholder: "Pregunta por precios, funciones o di 'actualizar plan'...",
    agentIntro: "¡Bienvenido a Plumbify! Soy su Copiloto de Ventas y Operaciones IA. Puedo responder preguntas, guiarle o ejecutar tareas. Intente decir:\n\n1. 'Iniciar recorrido de incorporación'\n2. 'Comprobar estado de API'\n3. 'Actualizar mi suscripción'\n4. 'Exportar contactos a CSV'",
    smsIntro: "Mensaje de Llamada Perdida: El 70% de los clientes llama al siguiente plomero si no respondes. Plumbify detecta llamadas perdidas y envía un SMS. ¡Mira el teléfono a la izquierda!",
    calendarIntro: "Calendario Inteligente: Una vez que un cliente reserva por SMS, Plumbify programa el trabajo automáticamente y asigna al técnico más cercano. ¡Mira la pantalla a la izquierda!",
    invoiceIntro: "Factura Móvil y Pago con Tarjeta: El cliente simplemente acerca su tarjeta al teléfono del técnico para pagar al instante. ¡Mira la animación a la izquierda!",
    recruitIntro: "Asistente de Reclutamiento IA: Escanea bolsas de trabajo, entrevista candidatos por SMS y programa entrevistas con plomeros calificados. ¡Mira el embudo a la izquierda!",
    pricingInfo: "Plumbify tiene 3 planes:\n1. Starter ($197/mes)\n2. Growth ($397/mes)\n3. Personalizado.\n¡Puede iniciar su prueba gratuita de 14 días a continuación!",
    leadPrompt: "Si desea que un representante lo llame, complete el formulario de cliente potencial a la izquierda.",
    leadSuccess: "¡Excelente! Sus datos han sido guardados. Un especialista se pondrá en contacto pronto.",
    errorText: "Lo siento, ocurrió un error.",
    buttonSubmit: "Registrarse como Lead VIP",
    startTour: "Iniciar tour de 3 min ➔",
    nextStep: "Siguiente función ➔",
    prevStep: "⬅ Anterior",
    skipTour: "Omitir tour",
    finishTour: "Completar tour 🎉",
    tourProgress: "Paso {step} de 5",
    voiceSettings: "Ajustes de voz",
    voiceSpeed: "Velocidad",
    voicePitch: "Tono",
    voiceSelect: "Motor de voz"
  },
  fr: {
    greeting: "Bonjour! Je suis le copilote IA de Plumbify. Démo immédiate.",
    subGreeting: "En ligne 24/7 • Parle 4 Langues • Un clic voix/chat",
    inputPlaceholder: "Posez des questions sur les prix, les fonctionnalités ou tapez 'mise à niveau'...",
    agentIntro: "Bienvenue chez Plumbify! Je suis votre Copilote IA. Je peux répondre à vos questions ou exécuter des tâches. Essayez de dire:\n\n1. 'Démarrer le tour d'intégration'\n2. 'Vérifier l'état de l'API'\n3. 'Mettre à niveau mon abonnement'\n4. 'Exporter les contacts en CSV'",
    smsIntro: "SMS de rappel automatique. 70% des clients appellent un autre plombier si vous ne répondez pas. Plumbify envoie un SMS automatique. Regardez le smartphone à gauche!",
    calendarIntro: "Planning intelligent GHL. Dès qu'un client réserve par SMS, Plumbify planifie le travail et l'attribue au technicien le plus proche. Regardez le tableau à gauche!",
    invoiceIntro: "Facturation mobile Tap-to-Pay. Le client tape sa carte sur le téléphone du technicien pour payer instantanément. Regardez l'animation à gauche!",
    recruitIntro: "Assistant de recrutement IA. Analyse les CV, qualifie les candidats plombiers par SMS et fixe des entretiens. Regardez le pipeline à gauche!",
    pricingInfo: "Plumbify propose 3 plans:\n1. Starter (197$/mois)\n2. Growth (397$/mois)\n3. Custom.\nLancez votre essai gratuit de 14 jours ci-dessous!",
    leadPrompt: "Si vous souhaitez être contacté par notre équipe, veuillez remplir le formulaire à gauche.",
    leadSuccess: "Vos informations ont été enregistrées avec succès.",
    errorText: "Une erreur est survenue.",
    buttonSubmit: "S'enregistrer",
    startTour: "Démarrer le tour ➔",
    nextStep: "Suivant ➔",
    prevStep: "⬅ Précédent",
    skipTour: "Passer",
    finishTour: "Terminer le tour 🎉",
    tourProgress: "Étape {step} sur 5",
    voiceSettings: "Paramètres voix",
    voiceSpeed: "Vitesse",
    voicePitch: "Ton",
    voiceSelect: "Moteur de voix"
  }
};

interface Message {
  sender: "user" | "agent";
  text: string;
  timestamp: string;
}

export default function AIAgentWidget({ isEmbedPage: isEmbedPageProp }: { isEmbedPage?: boolean } = {}) {
  const pathname = usePathname();
  const isEmbedPage = isEmbedPageProp ?? (pathname === "/widget-embed");

  // Widget Open/Close
  const [isOpen, setIsOpen] = useState(isEmbedPage);
  const [showNotification, setShowNotification] = useState(!isEmbedPage);
  const [language, setLanguage] = useState<"en" | "zh-TW" | "es" | "fr">("en");
  
  // Chat dialogue state
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Split-pane demo states
  const [demoState, setDemoState] = useState<"welcome" | "missed_call" | "calendar" | "invoice" | "recruiting" | "lead_form" | "api_settings" | "reputation">("welcome");
  const [isTourActive, setIsTourActive] = useState(false);
  const [tourStep, setTourStep] = useState(0); 

  // Speech settings
  const [speechRate, setSpeechRate] = useState(0.88);
  const [speechPitch, setSpeechPitch] = useState(1.0);
  const [selectedVoiceName, setSelectedVoiceName] = useState<string>(""); 
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [showAudioSettings, setShowAudioSettings] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false); 
  const [currentSubtitle, setCurrentSubtitle] = useState(""); 

  // Mini-simulation states
  const [phoneStep, setPhoneStep] = useState(0);
  const [phoneMessages, setPhoneMessages] = useState<Array<{ sender: "ai" | "user"; text: string }>>([]);
  const [invoicePaid, setInvoicePaid] = useState(false);
  const [invoiceStep, setInvoiceStep] = useState(0); 
  
  // GHL Lead form state
  const [leadForm, setLeadForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // ==========================================
  // NEW AGENTIC CAPABILITY STATE VARIABLES
  // ==========================================
  const [communicationMode, setCommunicationMode] = useState<"chat" | "voice">("chat");
  const [subscriptionTier, setSubscriptionTier] = useState<"starter" | "growth" | "enterprise">("starter");
  const [apiStatus, setApiStatus] = useState({
    twilio: "connected",
    ghl: "connected",
    wechat: "connected"
  });
  const [exportState, setExportState] = useState<"idle" | "loading" | "done">("idle");
  const [handoverState, setHandoverState] = useState<"idle" | "routing" | "connected">("idle");
  const [voiceListening, setVoiceListening] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const t = LOCALIZATION[language];

  // Pre-load synthesis voices
  useEffect(() => {
    const loadVoices = () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        setAvailableVoices(window.speechSynthesis.getVoices());
      }
    };
    loadVoices();
    if (typeof window !== "undefined" && window.speechSynthesis) {
      if ("onvoiceschanged" in window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
    }
  }, []);

  // Scroll viewport to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Notify parent window of widget open/closed state changes
  useEffect(() => {
    if (typeof window !== "undefined" && window.parent) {
      window.parent.postMessage({
        type: "plumbify-widget-state",
        isOpen: isOpen
      }, "*");
    }
  }, [isOpen]);

  // Hide widget layout on sub-embed and dashboard routes
  if (!isEmbedPage && (pathname === "/widget-embed" || pathname?.startsWith("/dashboard"))) {
    return null;
  }

  // Handle first load greeting
  const toggleWidget = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);
    if (nextState) {
      setShowNotification(false);
      if (messages.length === 0) {
        setIsTyping(true);
        setTimeout(() => {
          const initMsg: Message = {
            sender: "agent",
            text: t.agentIntro,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          };
          setMessages([initMsg]);
          setIsTyping(false);
          speakText(t.agentIntro);
        }, 800);
      }
    } else {
      // cancel voice on close
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      setIsSpeaking(false);
      setVoiceListening(false);
    }
  };

  // Speaks text and sets caption subtitles
  const speakText = (text: string) => {
    // If in Chat mode, never play audio or show subtitle overlay
    if (communicationMode === "chat") {
      setCurrentSubtitle("");
      setIsSpeaking(false);
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      return;
    }

    // Strip emojis for voice synthesis
    const cleanText = text.replace(/[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g, "");
    setCurrentSubtitle(text);

    if (isMuted || typeof window === "undefined" || !window.speechSynthesis) {
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    const voices = window.speechSynthesis.getVoices();
    
    let langCode = "en-US";
    if (language === "zh-TW") langCode = "zh-TW";
    else if (language === "es") langCode = "es-ES";
    else if (language === "fr") langCode = "fr-FR";

    utterance.lang = langCode;

    const langVoices = voices.filter(voice => 
      voice.lang.startsWith(langCode) || 
      voice.lang.replace('_', '-').startsWith(langCode)
    );

    let selectedVoice = null;
    if (selectedVoiceName) {
      selectedVoice = voices.find(v => v.name === selectedVoiceName);
    }

    if (!selectedVoice) {
      let priorities: string[] = [];
      if (language === "zh-TW") {
        priorities = ["mei-jia", "sin-ji", "tingting", "yating", "google", "microsoft", "premium"];
      } else if (language === "en") {
        priorities = ["google", "samantha", "microsoft", "natural", "neural", "premium"];
      } else if (language === "es") {
        priorities = ["google", "monica", "microsoft", "premium", "natural"];
      } else if (language === "fr") {
        priorities = ["google", "thomas", "microsoft", "premium", "natural"];
      }

      for (const keyword of priorities) {
        selectedVoice = langVoices.find(voice => voice.name.toLowerCase().includes(keyword));
        if (selectedVoice) break;
      }
    }

    if (!selectedVoice && langVoices.length > 0) {
      selectedVoice = langVoices[0];
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    
    utterance.rate = speechRate;
    utterance.pitch = speechPitch;

    utterance.onstart = () => {
      setIsSpeaking(true);
    };
    utterance.onend = () => {
      setIsSpeaking(false);
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  // Phone simulator missed call mock stream
  const startSMSDemo = () => {
    setDemoState("missed_call");
    setPhoneStep(1);
    setPhoneMessages([]);

    setTimeout(() => {
      setPhoneStep(2);
      setPhoneMessages([
        { sender: "ai", text: "Hi, this is Plumbify! Sorry we missed your call. Need an emergency plumber?" }
      ]);
      
      setTimeout(() => {
        setPhoneMessages(prev => [
          ...prev,
          { sender: "user", text: "Yes! A pipe just burst in my basement, flooding!" }
        ]);

        setTimeout(() => {
          setPhoneMessages(prev => [
            ...prev,
            { sender: "ai", text: "Oh no! Dave can head over at 2 PM. Please confirm address?" }
          ]);

          setTimeout(() => {
            setPhoneMessages(prev => [
              ...prev,
              { sender: "user", text: "1428 Elm St, Austin" }
            ]);

            setTimeout(() => {
              setPhoneMessages(prev => [
                ...prev,
                { sender: "ai", text: "Dave is booked. Check GHL Calendar!" }
              ]);
            }, 1500);
          }, 1500);
        }, 1500);
      }, 1500);
    }, 2500);
  };

  // Invoice tap payment mock animation
  const startInvoiceDemo = () => {
    setDemoState("invoice");
    setInvoicePaid(false);
    setInvoiceStep(0);

    setTimeout(() => {
      setInvoiceStep(1); // Approaching
      setTimeout(() => {
        setInvoiceStep(2); // Paid
        setInvoicePaid(true);
      }, 2000);
    }, 1500);
  };

  // Start Tour Mode
  const startTourMode = () => {
    setIsTourActive(true);
    setTourStep(1);
    setDemoState("missed_call");
    setIsTyping(true);
    
    setTimeout(() => {
      const step1Msg: Message = {
        sender: "agent",
        text: `[${t.tourProgress.replace("{step}", "1")}]\n\n${t.smsIntro}`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      setMessages([step1Msg]);
      setIsTyping(false);
      startSMSDemo();
      speakText(t.smsIntro);
    }, 500);
  };

  // Walkthrough Tour step changer
  const handleTourStep = (direction: "next" | "prev" | "skip") => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }

    if (direction === "skip") {
      setIsTourActive(false);
      setTourStep(0);
      setDemoState("welcome");
      
      const skipMsg: Message = {
        sender: "agent",
        text: t.agentIntro,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      setMessages([skipMsg]);
      speakText(t.agentIntro);
      return;
    }

    let nextStep = tourStep;
    if (direction === "next") {
      nextStep += 1;
    } else {
      nextStep -= 1;
    }

    if (nextStep < 1) nextStep = 1;

    setTourStep(nextStep);
    setIsTyping(true);

    let introText = "";
    if (nextStep === 1) {
      introText = t.smsIntro;
      setDemoState("missed_call");
      startSMSDemo();
    } else if (nextStep === 2) {
      introText = t.calendarIntro;
      setDemoState("calendar");
    } else if (nextStep === 3) {
      introText = t.invoiceIntro;
      setDemoState("invoice");
      startInvoiceDemo();
    } else if (nextStep === 4) {
      introText = t.recruitIntro;
      setDemoState("recruiting");
    } else if (nextStep === 5) {
      introText = t.pricingInfo + "\n\n" + t.leadPrompt;
      setDemoState("lead_form");
    } else {
      setIsTourActive(false);
      setTourStep(0);
      setDemoState("welcome");
      introText = t.agentIntro;
    }

    setTimeout(() => {
      const stepLabel = nextStep <= 5 ? `[${t.tourProgress.replace("{step}", nextStep.toString())}]\n\n` : "";
      const agentMsg: Message = {
        sender: "agent",
        text: `${stepLabel}${introText}`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      setMessages(prev => [...prev, agentMsg]);
      setIsTyping(false);
      speakText(introText);
    }, 600);
  };

  // Feature selector trigger
  const handleFeatureSelect = (type: "sms" | "calendar" | "invoice" | "recruiting" | "pricing" | "book" | "reputation") => {
    setIsTyping(true);
    let introText = "";

    if (type === "sms") {
      introText = t.smsIntro;
      startSMSDemo();
    } else if (type === "calendar") {
      introText = t.calendarIntro;
      setDemoState("calendar");
    } else if (type === "invoice") {
      introText = t.invoiceIntro;
      startInvoiceDemo();
    } else if (type === "recruiting") {
      introText = t.recruitIntro;
      setDemoState("recruiting");
    } else if (type === "reputation") {
      introText = language === "zh-TW"
        ? "Plumbify 會在完工收款後自動發送簡訊邀請評論。給 4-5 星的好評客戶會被引導至 Google 商家頁面，低分（1-3星）客戶則會填寫私下反饋表，避免公開差評！"
        : "Plumbify automates review requests via SMS after billing. 4-5 star ratings go straight to Google Maps. 1-3 star feedback is routed privately to protect your reputation from negative public reviews.";
      setDemoState("reputation");
    } else if (type === "pricing") {
      introText = t.pricingInfo;
      setDemoState("invoice");
    } else if (type === "book") {
      introText = t.leadPrompt;
      setDemoState("lead_form");
    }

    setTimeout(() => {
      const agentMsg: Message = {
        sender: "agent",
        text: introText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      setMessages(prev => [...prev, agentMsg]);
      setIsTyping(false);
      speakText(introText);
    }, 800);
  };

  const containsAny = (str: string, ...keywords: string[]) => {
    return keywords.some(kw => str.includes(kw));
  };

  const runFallbackMsg = (text: string) => {
    setTimeout(() => {
      let responseText = "";
      const textLower = text.toLowerCase();

      // Reset states on new commands to prevent UI lockups
      setExportState("idle");
      if (handoverState !== "connected") setHandoverState("idle");

      // 1. SYSTEM COMMAND: START ONBOARDING TOUR
      if (containsAny(textLower, "start tour", "walkthrough", "onboarding", "新手", "導覽", "引導", "開始導覽")) {
        responseText = language === "zh-TW"
          ? "了解！我為您啟動了 Plumbify 新手導覽。請注意左側的手機模擬面板，我們將從『漏電簡訊回撥』開始。您也可以在下方引導條點選『下一步』。"
          : "Understood! Starting the Plumbify onboarding tour now. Look at the smartphone simulator on the left pane as we walk through missed-call text-backs. Click 'Next' in the walkthrough panel to advance.";
        setIsTourActive(true);
        setTourStep(1);
        setDemoState("missed_call");
        startSMSDemo();

      // 2. SYSTEM COMMAND: SCAN/CHECK API STATUS
      } else if (containsAny(textLower, "api", "check api", "scan api", "status", "整合", "檢查", "串接", "狀態")) {
        responseText = language === "zh-TW"
          ? "正在為您連線 API 閘道... 正在檢查 Twilio、企業微信與 GHL 接口。所有整合狀態正常，操作成功！請查看左側 API 整合看板。"
          : "Scanning connected API gateways... Checking Twilio SMS, WeChat work, and GHL CRM webhook integrations. All systems active and connected at 100% capacity. Check the status card on the left.";
        setDemoState("api_settings");
        setApiStatus({ twilio: "checking", ghl: "checking", wechat: "checking" });
        setTimeout(() => {
          setApiStatus({ twilio: "connected", ghl: "connected", wechat: "connected" });
        }, 1500);

      // 3. SYSTEM COMMAND: UPGRADE SUBSCRIPTION
      } else if (containsAny(textLower, "upgrade", "growth plan", "starter plan", "pricing", "升級", "價格", "方案", "訂閱", "收費", "多少錢")) {
        setDemoState("invoice");
        setInvoicePaid(false);
        setInvoiceStep(1); // card approaches

        if (containsAny(textLower, "growth", "專業", "成長")) {
          setSubscriptionTier("growth");
          responseText = language === "zh-TW"
            ? "收到指令！為您的賬戶升級至 Plumbify 專業成長版 ($397/月)。我已為您送出安全感應付款終端。請將信用卡輕碰在左側感應區，即可完成升級！"
            : "Triggering Growth Plan ($397/mo) upgrade checkout! I've loaded the mobile Tap-to-Pay billing interface in the left pane. Tap your credit card against the screen to complete the transaction.";
        } else if (containsAny(textLower, "enterprise", "custom", "企業", "客製")) {
          setSubscriptionTier("enterprise");
          responseText = language === "zh-TW"
            ? "收到指令！正在升級至企業版方案。我已通知業務代表聯絡您，或者您可以填寫左側表單，我會把您標記為 Enterprise VIP 線索。"
            : "Initiating Enterprise Tier configuration. I've routed this alert to our support desk. Please fill out the lead sheet on the left, and I will tag your contact record as an Enterprise VIP.";
          setDemoState("lead_form");
        } else {
          setSubscriptionTier("growth"); // default to growth demo
          responseText = language === "zh-TW"
            ? "這裏是 Plumbify 方案價格資訊：基礎版 $197/月，專業版 $397/月。我已為您載入感應升級終端，請在左側感應支付，或對我說『我想升級到專業版』！"
            : "Plumbify has 2 main tiers: Starter ($197/mo) and Growth ($397/mo). I have generated the mobile upgrade terminal on the left pane. Try saying 'upgrade to growth' to execute the plan swap!";
        }

        setTimeout(() => {
          setInvoiceStep(2);
          setInvoicePaid(true);
        }, 3000);

      // 4. SYSTEM COMMAND: EXPORT LEADS TO CSV
      } else if (containsAny(textLower, "export", "download", "leads", "csv", "名單", "匯出", "下載", "導出")) {
        responseText = language === "zh-TW"
          ? "正在搜尋系統中所有已同步的水電客戶名單... 已查找到 195 筆資料。正在彙整並匯出為 CSV 檔案，匯出已完成，請查收您的瀏覽器下載！"
          : "Querying database for synced CRM contacts... Found 195 entries. Staging data compilation and exporting to CSV. Complete! Your download should start automatically.";
        setExportState("loading");
        
        setTimeout(() => {
          setExportState("done");
          // Trigger mock file download
          const blob = new Blob(["Name,Phone,Source,Value\nJohn Doe,+15550192834,SMS,$850\nZhang Wei,+15550193492,WeChat,$450"], { type: "text/csv" });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.setAttribute("href", url);
          a.setAttribute("download", "plumbify_synced_leads.csv");
          a.click();
        }, 2500);

      // 5. SYSTEM COMMAND: ROUTE TO HUMAN AGENT (HANDOVER)
      } else if (containsAny(textLower, "human", "support", "agent", "leon", "representative", "真人", "客服", "專人", "電話", "聯絡")) {
        responseText = language === "zh-TW"
          ? "收到！我正將我們的對話歷史與上下文打包同步至 GHL。正在為您轉接人工客服專員 Leon... 請在左側表單留下您的聯繫資訊以完成轉接！"
          : "Understood. Compiling your dialogue history and routing you to our master plumber representative, Leon. Please fill out the contact form on the left pane to secure the callback connection.";
        setHandoverState("routing");
        setDemoState("lead_form");
        
        setTimeout(() => {
          setHandoverState("connected");
        }, 2500);

      // 6. MULTILINGUAL GENERAL KNOWLEDGE Q&A MATCHING
      } else {
        if (language === "zh-TW") {
          if (containsAny(textLower, "plumbify是什麼", "什麼是plumbify", "這是什麼", "plumbify is what", "介紹")) {
            responseText = "Plumbify 是專為水電空調與工程行設計的 AI 客戶管理系統（CRM）。它能 24/7 自動運行簡訊回撥、微信對接、自動排程派單與 5 星 Google 評論自動生成，幫您鎖定每一筆潛在訂單，防止客戶流失！";
          } else if (containsAny(textLower, "微信", "wechat", "企業微信", "wecom", "華人", "中文")) {
            responseText = "Plumbify 支援直接串接您的微信（WeChat）或企業微信（WeCom）。華人客戶透過微信諮詢時，對話會自動同步到系統，並且系統會自動進行中英雙向翻譯，讓英文調度員也能輕鬆溝通和接單！";
          } else if (containsAny(textLower, "14天", "免費試用", "免費挑戰", "挑戰", "試用")) {
            responseText = "我們的『14天免費挑戰』包含免費為您設定並串接電話與微信 14 天。如果系統在這期間內沒有幫您自動救回並成交至少 3 筆水電工單，您不需支付任何費用！";
            setDemoState("lead_form");
          } else if (containsAny(textLower, "評價", "評論", "google評論", "商家評價", "星級", "星", "口碑")) {
            responseText = "Plumbify 會在完工收款後自動發送簡訊邀請評論。給 4-5 星的好評客戶會被引導至 Google 商家頁面，低分（1-3星）客戶則會填寫私下反饋表，避免公開差評！";
            setDemoState("reputation");
          } else if (containsAny(textLower, "緊急", "修繕", "爆裂", "漏水", "沒熱水", "搶修")) {
            responseText = "是的！AI 可以自動識別緊急漏水、水管爆裂等高優先級字眼，在 conversations 中標記為緊急線索，並即時向您的排班師傅發送派單推送。";
            setDemoState("calendar");
          } else {
            responseText = "您可以詢問我關於 Plumbify 的具體問題！試著輸入：『Plumbify是什麼？』、『價格多少？』、『如何串接 ServiceTitan？』、『微信如何整合？』或『什麼是14天免費挑戰？』。您也可以隨時點選上方的功能按鍵觀看模擬操作。";
          }
        } else {
          // English Q&A Matcher
          if (containsAny(textLower, "what is plumbify", "how it works", "plumbify what", "about plumbify", "introduce", "what's plumbify")) {
            responseText = "Plumbify is the #1 AI-first CRM operating system built for plumbing and trade businesses. It automates missed-call text-backs, WeChat/WeCom leads, smart scheduling, and 5-star Google review generation to keep your trucks full 24/7.";
          } else if (containsAny(textLower, "wechat", "wecom", "chinese", "translation", "translate")) {
            responseText = "Plumbify connects your business WeChat/WeCom. Incoming messages are aggregated into your unified inbox and translated instantly in both directions, enabling your english-speaking dispatchers to book Chinese-speaking leads with ease.";
          } else if (containsAny(textLower, "trial", "free challenge", "challenge", "free trial", "14 day")) {
            responseText = "Our 14-Day Free Challenge includes full system setup. If the system does not rescue and secure at least 3 plumbing jobs that you would have otherwise missed or forgotten, you pay nothing.";
            setDemoState("lead_form");
          } else if (containsAny(textLower, "review", "reputation", "google reviews", "rating", "star", "maps")) {
            responseText = "Plumbify automates review requests via SMS after billing. 4-5 star ratings go straight to Google Maps. 1-3 star feedback is routed privately to protect your reputation from negative public reviews.";
            setDemoState("reputation");
          } else if (containsAny(textLower, "emergency", "burst pipe", "leak", "no hot water", "clog")) {
            responseText = "Yes, our AI is trained to detect high-priority keywords (like 'burst pipe' or 'leak') in incoming chats to tag them as urgent and immediately send push notifications to free technicians.";
            setDemoState("calendar");
          } else {
            responseText = "I can answer specific questions about Plumbify! Try asking: 'What is Plumbify?', 'How much does it cost?', 'Does it integrate with ServiceTitan?', 'How does WeChat integration work?', or 'What is the 14-day free challenge?'. You can also select feature tabs above to watch a demo.";
          }
        }
      }

      const agentMsg: Message = {
        sender: "agent",
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };

      setMessages(prev => [...prev, agentMsg]);
      setIsTyping(false);
      speakText(responseText);
    }, 1200);
  };

  // ==========================================
  // CONVERSATIONAL AI & AGENTIC ACTION EXECUTOR
  // ==========================================
  const processUserMsg = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      sender: "user",
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setIsTyping(true);

    // Reset states on new commands to prevent UI lockups
    setExportState("idle");
    if (handoverState !== "connected") setHandoverState("idle");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messages: newMessages,
          language: language
        })
      });

      if (!response.ok) {
        throw new Error("Gemini API server returned error status");
      }

      const data = await response.json();
      let reply = data.reply || "";

      // 1. If a toolCall was returned, execute the tool and append a log message!
      if (data.toolCall) {
        const toolName = data.toolCall.name;
        const args = data.toolCall.args || {};

        // Execute visual transitions
        if (toolName === "startOnboardingTour") {
          setIsTourActive(true);
          setTourStep(1);
          setDemoState("missed_call");
          startSMSDemo();
        } else if (toolName === "checkApiStatus") {
          setDemoState("api_settings");
          setApiStatus({ twilio: "checking", ghl: "checking", wechat: "checking" });
          setTimeout(() => {
            setApiStatus({ twilio: "connected", ghl: "connected", wechat: "connected" });
          }, 1500);
        } else if (toolName === "upgradeSubscription") {
          setDemoState("invoice");
          setInvoicePaid(false);
          setInvoiceStep(1);
          const tier = args.tier || "growth";
          setSubscriptionTier(tier as any);
          setTimeout(() => {
            setInvoiceStep(2);
            setInvoicePaid(true);
          }, 3000);
        } else if (toolName === "exportLeadsToCsv") {
          setExportState("loading");
          setTimeout(() => {
            setExportState("done");
            const blob = new Blob(["Name,Phone,Source,Value\nJohn Doe,+15550192834,SMS,$850\nZhang Wei,+15550193492,WeChat,$450"], { type: "text/csv" });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.setAttribute("href", url);
            a.setAttribute("download", "plumbify_synced_leads.csv");
            a.click();
          }, 2500);
        } else if (toolName === "routeToHumanLeon") {
          setHandoverState("routing");
          setDemoState("lead_form");
          setTimeout(() => {
            setHandoverState("connected");
          }, 2500);
        } else if (toolName === "showReputationDashboard") {
          setDemoState("reputation");
        }

        // Add a nice visual tool log message to the dialogue feed
        const toolLogMsg: Message = {
          sender: "agent",
          text: `🔧 [AI Agent Action]: Executed ${toolName}(${JSON.stringify(args)}) successfully.`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        };
        setMessages(prev => [...prev, toolLogMsg]);
      } else {
        // Parse legacy trigger tags (fallback for old model iterations or raw text responses)
        let matchedTrigger = "";
        if (reply.includes("[TRIGGER: start_tour]")) {
          matchedTrigger = "start_tour";
          reply = reply.replace("[TRIGGER: start_tour]", "");
        } else if (reply.includes("[TRIGGER: check_api]")) {
          matchedTrigger = "check_api";
          reply = reply.replace("[TRIGGER: check_api]", "");
        } else if (reply.includes("[TRIGGER: upgrade_growth]")) {
          matchedTrigger = "upgrade_growth";
          reply = reply.replace("[TRIGGER: upgrade_growth]", "");
        } else if (reply.includes("[TRIGGER: export_leads]")) {
          matchedTrigger = "export_leads";
          reply = reply.replace("[TRIGGER: export_leads]", "");
        } else if (reply.includes("[TRIGGER: route_human]")) {
          matchedTrigger = "route_human";
          reply = reply.replace("[TRIGGER: route_human]", "");
        } else if (reply.includes("[TRIGGER: reputation]")) {
          matchedTrigger = "reputation";
          reply = reply.replace("[TRIGGER: reputation]", "");
        }

        reply = reply.trim();

        if (matchedTrigger === "start_tour") {
          setIsTourActive(true);
          setTourStep(1);
          setDemoState("missed_call");
          startSMSDemo();
        } else if (matchedTrigger === "check_api") {
          setDemoState("api_settings");
          setApiStatus({ twilio: "checking", ghl: "checking", wechat: "checking" });
          setTimeout(() => {
            setApiStatus({ twilio: "connected", ghl: "connected", wechat: "connected" });
          }, 1500);
        } else if (matchedTrigger === "upgrade_growth") {
          setDemoState("invoice");
          setInvoicePaid(false);
          setInvoiceStep(1);
          setSubscriptionTier("growth");
          setTimeout(() => {
            setInvoiceStep(2);
            setInvoicePaid(true);
          }, 3000);
        } else if (matchedTrigger === "export_leads") {
          setExportState("loading");
          setTimeout(() => {
            setExportState("done");
            const blob = new Blob(["Name,Phone,Source,Value\nJohn Doe,+15550192834,SMS,$850\nZhang Wei,+15550193492,WeChat,$450"], { type: "text/csv" });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.setAttribute("href", url);
            a.setAttribute("download", "plumbify_synced_leads.csv");
            a.click();
          }, 2500);
        } else if (matchedTrigger === "route_human") {
          setHandoverState("routing");
          setDemoState("lead_form");
          setTimeout(() => {
            setHandoverState("connected");
          }, 2500);
        } else if (matchedTrigger === "reputation") {
          setDemoState("reputation");
        }
      }

      const agentMsg: Message = {
        sender: "agent",
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };

      setMessages(prev => [...prev, agentMsg]);
      setIsTyping(false);
      speakText(reply);

    } catch (err) {
      console.warn("Gemini API call failed, running local keywords matcher fallback:", err);
      runFallbackMsg(text);
    }
  };

  const handleSendText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    processUserMsg(inputText);
    setInputText("");
  };

  // Submit Lead Form
  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadForm.firstName || !leadForm.lastName || !leadForm.phone || !leadForm.email) {
      setSubmitError(language === "zh-TW" ? "請填寫所有必要欄位" : "Please fill out all required fields");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const res = await fetch("/api/ghl", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          firstName: leadForm.firstName,
          lastName: leadForm.lastName,
          email: leadForm.email,
          phone: leadForm.phone,
          company: leadForm.company,
          chatHistory: messages
        })
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "GHL Submission failed");
      }

      setSubmitSuccess(true);
      setDemoState("calendar");
      setIsTyping(true);

      setTimeout(() => {
        const successMsg: Message = {
          sender: "agent",
          text: t.leadSuccess,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        };
        setMessages(prev => [...prev, successMsg]);
        setIsTyping(false);
        speakText(t.leadSuccess);
      }, 1000);

    } catch (err: any) {
      console.error(err);
      setSubmitError(t.errorText);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={isEmbedPage ? "w-full h-full absolute inset-0 overflow-hidden font-sans" : "fixed bottom-6 right-6 z-50 font-sans"}>
      
      {/* 1. COLLAPSED FLOATING AGENT BALL */}
      {!isOpen && (
        <div className={isEmbedPage ? "w-full h-full flex items-center justify-center" : "flex flex-col items-end gap-3"}>
          
          {/* Notification tooltip */}
          {showNotification && !isEmbedPage && (
            <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-slate-800 max-w-xs animate-bounce relative flex items-start gap-3 select-none">
              <div className="absolute top-2 right-2 text-slate-500 hover:text-white cursor-pointer" onClick={() => setShowNotification(false)}>
                <X size={14} />
              </div>
              <div className="h-9 w-9 rounded-full bg-blue-500 flex items-center justify-center shrink-0 border border-blue-400">
                <Bot size={18} className="text-white" />
              </div>
              <div>
                <p className="text-xs font-bold leading-tight pr-4">{t.greeting}</p>
                <p className="text-[10px] text-slate-400 mt-1">{t.subGreeting}</p>
              </div>
            </div>
          )}

          {/* Trigger button */}
          <button 
            onClick={toggleWidget}
            className="group h-16 w-16 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-2xl flex items-center justify-center relative transition-transform duration-300 hover:scale-105 active:scale-95 border-2 border-white/20"
          >
            <span className="absolute top-0.5 right-0.5 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white"></span>
            </span>
            <Bot size={28} className="transition-transform group-hover:rotate-12 duration-300" />
          </button>
        </div>
      )}

      {/* 2. EXPANDED PANEL */}
      {isOpen && (
        <div className={
          isEmbedPage 
            ? "bg-slate-950/95 backdrop-blur-md text-white border border-slate-800 w-full h-full flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300 rounded-none lg:rounded-[2rem]"
            : "bg-slate-950/95 backdrop-blur-md text-white rounded-[2rem] border border-slate-800 shadow-2xl w-[92vw] sm:w-[500px] lg:w-[960px] h-[86vh] lg:h-[650px] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300"
        }>
          
          {/* Header */}
          <div className="h-16 border-b border-slate-800 px-6 flex items-center justify-between shrink-0 bg-slate-900/50">
            <div className="flex items-center gap-3 select-none">
              <div className="h-10 w-10 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Bot size={22} className="animate-pulse" />
              </div>
              <div>
                <h3 className="text-sm font-black tracking-tight text-white flex items-center gap-2">
                  Plumbify AI Sales Agent
                  <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                </h3>
                <p className="text-[10px] text-slate-400 font-semibold">{t.subGreeting}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              
              {/* Language Selector */}
              <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-xl px-2 py-1">
                <Languages size={14} className="text-blue-400" />
                <select 
                  value={language} 
                  onChange={(e) => setLanguage(e.target.value as any)}
                  className="bg-transparent text-[10px] font-bold text-slate-300 outline-none border-none cursor-pointer pr-1"
                >
                  <option value="en" className="bg-slate-900 text-white">EN (US)</option>
                  <option value="zh-TW" className="bg-slate-900 text-white">繁中 (TW)</option>
                  <option value="es" className="bg-slate-900 text-white">ES (ES)</option>
                  <option value="fr" className="bg-slate-900 text-white">FR (FR)</option>
                </select>
              </div>

              {/* Mute button */}
              <button 
                onClick={() => {
                  setIsMuted(!isMuted);
                  if (!isMuted && typeof window !== "undefined" && window.speechSynthesis) {
                    window.speechSynthesis.cancel();
                    setIsSpeaking(false);
                  }
                }}
                className="text-slate-400 hover:text-white transition-colors"
                title={isMuted ? "Unmute Voice" : "Mute Voice"}
              >
                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} className="text-blue-400" />}
              </button>

              {/* Sliders settings button */}
              <button 
                onClick={() => setShowAudioSettings(!showAudioSettings)}
                className={`p-1.5 rounded-xl border transition-colors flex items-center justify-center ${showAudioSettings ? 'bg-blue-600/10 border-blue-500/30 text-blue-400' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'}`}
                title={t.voiceSettings}
              >
                <Sliders size={16} />
              </button>

              <button onClick={toggleWidget} className="text-slate-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            
            {/* Audio Settings Popover */}
            {showAudioSettings && (
              <div className="absolute right-6 top-16 w-64 bg-slate-950/98 border border-slate-800 rounded-2xl shadow-2xl p-4 z-50 text-[10px] space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <span className="font-bold text-white uppercase tracking-wider">{t.voiceSettings}</span>
                  <button onClick={() => setShowAudioSettings(false)} className="text-slate-500 hover:text-white">
                    <X size={12} />
                  </button>
                </div>
                
                {/* Voice Selector */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-400">{t.voiceSelect}</label>
                  <select 
                    value={selectedVoiceName}
                    onChange={(e) => setSelectedVoiceName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-slate-200 text-[10px] focus:outline-none"
                  >
                    <option value="">{language === "zh-TW" ? "預設智慧引擎" : "Default Neural Engine"}</option>
                    {availableVoices
                      .filter(v => {
                        if (!v || !v.lang) return false;
                        let langCode = "en-US";
                        if (language === "zh-TW") langCode = "zh-TW";
                        else if (language === "es") langCode = "es-ES";
                        else if (language === "fr") langCode = "fr-FR";
                        return v.lang.startsWith(langCode) || v.lang.replace('_', '-').startsWith(langCode);
                      })
                      .map((voice, idx) => (
                        <option key={idx} value={voice.name} className="bg-slate-900 text-white">
                          {voice.name}
                        </option>
                      ))
                    }
                  </select>
                </div>

                {/* Speed Slider */}
                <div className="space-y-1">
                  <div className="flex justify-between text-slate-400">
                    <span className="font-bold">{t.voiceSpeed}</span>
                    <span className="font-semibold text-blue-400">{speechRate.toFixed(2)}x</span>
                  </div>
                  <input 
                    type="range" 
                    min="0.5" 
                    max="1.5" 
                    step="0.05"
                    value={speechRate} 
                    onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                    className="w-full accent-blue-500 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Pitch Slider */}
                <div className="space-y-1">
                  <div className="flex justify-between text-slate-400">
                    <span className="font-bold">{t.voicePitch}</span>
                    <span className="font-semibold text-blue-400">{speechPitch.toFixed(2)}</span>
                  </div>
                  <input 
                    type="range" 
                    min="0.5" 
                    max="1.5" 
                    step="0.05"
                    value={speechPitch} 
                    onChange={(e) => setSpeechPitch(parseFloat(e.target.value))}
                    className="w-full accent-blue-500 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Quick-select Menu Header */}
          <div className="h-14 border-b border-slate-800 bg-slate-900/20 px-4 flex items-center gap-2 overflow-x-auto shrink-0 scrollbar-none">
            {[
              { label: language === "zh-TW" ? "📞 簡訊回撥" : "📞 SMS Text-back", type: "sms" },
              { label: language === "zh-TW" ? "📅 派單排程" : "📅 Dispatch Board", type: "calendar" },
              { label: language === "zh-TW" ? "💳 手機收款" : "💳 Tap-to-Pay", type: "invoice" },
              { label: language === "zh-TW" ? "👥 AI 招募" : "👥 AI Recruiter", type: "recruiting" },
              { label: language === "zh-TW" ? "⭐ 商家評價" : "⭐ Reviews", type: "reputation" },
              { label: language === "zh-TW" ? "🔌 整合狀態" : "🔌 API Settings", type: "api_settings" },
              { label: language === "zh-TW" ? "💬 專人預約" : "💬 Book Call", type: "book" }
            ].map((btn) => {
              const isActive = (btn.type === "sms" && demoState === "missed_call") || (btn.type === demoState);
              return (
                <button
                  key={btn.type}
                  onClick={() => {
                    if (btn.type === "api_settings") setDemoState("api_settings");
                    else handleFeatureSelect(btn.type as any);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-[10px] font-bold tracking-tight whitespace-nowrap border transition-all ${
                    isActive 
                      ? "bg-blue-600 border-blue-500 text-white shadow-[0_0_10px_rgba(59,130,246,0.2)]" 
                      : "bg-slate-900/80 border-slate-800/80 text-slate-300 hover:border-slate-700 hover:text-white"
                  }`}
                >
                  {btn.label}
                </button>
              );
            })}
          </div>

          {/* Body Content */}
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            
            {/* LEFT PANE: LIVE PRODUCT DEMO SIMULATOR (Visual Display) */}
            <div className="md:w-[320px] shrink-0 border-b md:border-b-0 md:border-r border-slate-800 bg-[#060a13] p-6 flex flex-col justify-center items-center overflow-y-auto min-h-[220px] md:min-h-0 relative select-none">
              
              {/* API settings scanner simulation */}
              {demoState === "api_settings" && (
                <div className="w-full text-center space-y-4 animate-in fade-in duration-300 max-w-xs">
                  <div className="h-10 w-10 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mx-auto">
                    <Database size={20} />
                  </div>
                  <div>
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-blue-400">API Gateway Controller</h4>
                    <p className="text-[9px] text-slate-500">Real-time external microservices integrations</p>
                  </div>
                  
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-left space-y-2.5 text-[10px]">
                    <div className="flex justify-between items-center py-1 border-b border-slate-850">
                      <span className="text-slate-300">Twilio Gateway (SMS)</span>
                      <span className={`font-mono text-[9px] font-bold ${apiStatus.twilio === "connected" ? "text-emerald-400" : "text-blue-400 animate-pulse"}`}>
                        {apiStatus.twilio === "connected" ? "● Connected" : "○ Scanning..."}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-slate-850">
                      <span className="text-slate-300">GoHighLevel (CRM)</span>
                      <span className={`font-mono text-[9px] font-bold ${apiStatus.ghl === "connected" ? "text-emerald-400" : "text-blue-400 animate-pulse"}`}>
                        {apiStatus.ghl === "connected" ? "● Connected" : "○ Scanning..."}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-slate-300">WeChat / WeCom gateway</span>
                      <span className={`font-mono text-[9px] font-bold ${apiStatus.wechat === "connected" ? "text-emerald-400" : "text-blue-400 animate-pulse"}`}>
                        {apiStatus.wechat === "connected" ? "● Connected" : "○ Scanning..."}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Handover screen overlay */}
              {handoverState === "routing" && (
                <div className="absolute inset-0 bg-slate-950/95 z-30 flex flex-col items-center justify-center p-4 text-center animate-in fade-in duration-200">
                  <Loader2 size={36} className="text-blue-500 animate-spin mb-4" />
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Connecting Human Advisor</h4>
                  <p className="text-[10px] text-slate-400 mt-2 max-w-[200px] leading-relaxed">
                    Packaging conversation context and GHL parameters. Leon will be routed in 15 seconds...
                  </p>
                </div>
              )}

              {/* Lead export loading screen */}
              {exportState === "loading" && (
                <div className="absolute inset-0 bg-slate-950/95 z-30 flex flex-col items-center justify-center p-4 text-center animate-in fade-in duration-200">
                  <FileDown size={36} className="text-blue-400 animate-bounce mb-4" />
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">CSV Data Staging</h4>
                  <p className="text-[10px] text-slate-400 mt-2 max-w-[220px] leading-relaxed">
                    Compiling 195 synced leads from Twilio & WeChat databases...
                  </p>
                  <div className="w-40 h-1 bg-slate-900 rounded-full overflow-hidden mt-3 p-[1px] border border-slate-800">
                    <div className="h-full bg-blue-500 rounded-full animate-progress-bar"></div>
                  </div>
                  <style>{`
                    @keyframes prog { 0% { width: 0%; } 100% { width: 100%; } }
                    .animate-progress-bar { animation: prog 2.2s linear infinite; }
                  `}</style>
                </div>
              )}

              {/* Scenario 1: Welcome & Landing Visual */}
              {demoState === "welcome" && (
                <div className="text-center space-y-6 max-w-sm animate-in fade-in duration-500">
                  <div className="relative inline-flex items-center justify-center">
                    <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-xl animate-pulse"></div>
                    <div className="h-16 w-16 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white border-4 border-slate-800">
                      <Sparkles size={28} />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-black tracking-tight text-white">Interactive Product Tour</h4>
                    <p className="text-[10px] text-slate-400 leading-relaxed">
                      {language === "zh-TW" 
                        ? "請點擊上方按鈕，AI 將一步步為您演示 Plumbify 的核心後台功能，或與我語音對話。"
                        : "Click any button above to watch our AI walk you through Plumbify's core dashboards in real-time."}
                    </p>
                  </div>
                  <div className="space-y-2 text-left w-full text-[10px] text-slate-400">
                    <div className="p-2.5 rounded-xl bg-slate-900/50 border border-slate-800/80 font-medium">
                      ✅ <strong>100% Self-Serve:</strong> Watch how we automate back-offices.
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900/50 border border-slate-800/80 font-medium font-mono">
                      💳 Active Tier: <span className="text-blue-400 font-bold uppercase">{subscriptionTier}</span>
                    </div>
                  </div>

                  <button 
                    onClick={startTourMode}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 hover:scale-[1.02] shadow-[0_4px_15px_rgba(59,130,246,0.3)] animate-pulse"
                  >
                    🚀 {t.startTour}
                  </button>
                </div>
              )}

              {/* Scenario 2: Phone Missed Call Demo */}
              {demoState === "missed_call" && (
                <div className="w-52 h-[340px] bg-slate-900 rounded-[2.2rem] border-[4px] border-slate-800 shadow-2xl relative flex flex-col overflow-hidden animate-in zoom-in duration-300">
                  <div className="h-5 w-full flex justify-between px-5 pt-3 items-center">
                    <span className="text-[8px] font-bold text-white">9:41 AM</span>
                    <div className="w-12 h-2.5 bg-black rounded-full absolute left-1/2 -translate-x-1/2 top-1 flex items-center justify-center animate-pulse">
                      <div className="w-1 h-1 rounded-full bg-slate-950 ml-auto mr-1"></div>
                    </div>
                    <span className="text-[8px] font-bold text-emerald-400">5G</span>
                  </div>

                  <div className="flex-1 p-2.5 flex flex-col justify-start">
                    {phoneStep === 1 && (
                      <div className="flex flex-col items-center justify-center mt-12 animate-in slide-in-from-top duration-500">
                        <div className="h-10 w-10 rounded-full bg-red-500 flex items-center justify-center animate-pulse mb-3">
                          <Phone size={16} className="text-white fill-current" />
                        </div>
                        <p className="text-[10px] font-bold">{language === "zh-TW" ? "撥號中..." : "Inbound Call..."}</p>
                        <p className="text-[8px] text-slate-400 mt-1">John (Customer)</p>
                        <span className="text-[8px] bg-red-950 text-red-400 border border-red-900/50 px-2 py-0.5 rounded-full mt-4 font-bold uppercase tracking-wider">Missed Call</span>
                      </div>
                    )}

                    {phoneStep >= 2 && (
                      <div className="flex-1 flex flex-col gap-2 pt-2">
                        <div className="text-[7px] text-slate-500 text-center font-bold uppercase tracking-widest">Today 9:42 AM</div>
                        {phoneMessages.map((msg, i) => (
                          <div 
                            key={i} 
                            className={`max-w-[85%] p-2 rounded-2xl text-[9px] leading-snug font-medium animate-in slide-in-from-bottom-2 duration-300 ${
                              msg.sender === "ai" 
                                ? "bg-blue-600 text-white self-start rounded-bl-none" 
                                : "bg-slate-800 text-slate-200 self-end rounded-br-none"
                            }`}
                          >
                            {msg.text}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="h-1 w-12 bg-white/20 rounded-full mx-auto mb-1"></div>
                </div>
              )}

              {/* Scenario 3: Calendar Slots */}
              {demoState === "calendar" && (
                <div className="w-full text-center space-y-4 animate-in fade-in duration-500 max-w-xs">
                  <div className="h-10 w-10 rounded-full bg-cyan-600/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mx-auto">
                    <Calendar size={20} />
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">GHL Dispatch Calendar</h4>
                    <p className="text-[9px] text-slate-500">Auto Scheduling & Route Optimization</p>
                  </div>
                  
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-left space-y-2 text-[9px]">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-1.5">
                      <span className="font-bold text-slate-300">Technician Dispatch List</span>
                      <span className="text-[8px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded font-black">SYNCED</span>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center p-1.5 bg-slate-950 rounded border border-slate-800">
                        <span className="text-white font-bold">Dave (Zone 1)</span>
                        <span className="text-cyan-400 font-bold">2:00 PM Booked</span>
                      </div>
                      <div className="flex justify-between items-center p-1.5 bg-slate-950 rounded border border-slate-800">
                        <span className="text-slate-400">Mike (Zone 2)</span>
                        <span className="text-slate-500">Available</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Scenario 4: Payments Tap-to-Pay */}
              {demoState === "invoice" && (
                <div className="w-full space-y-4 animate-in fade-in duration-500 max-w-xs">
                  <div className="h-10 w-10 rounded-full bg-purple-600/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mx-auto">
                    <CreditCard size={20} />
                  </div>
                  <div className="text-center space-y-0.5">
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-purple-400">Tap-To-Pay Invoice</h4>
                    <p className="text-[9px] text-slate-500">Contactless credit card billing capture</p>
                  </div>
                  
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-left text-[10px] space-y-2 relative">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-1.5">
                      <span className="font-bold text-slate-300">Upgrade Order</span>
                      <span className={`text-[8px] border px-1.5 py-0.5 rounded font-black transition-colors ${
                        invoicePaid 
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                          : "bg-purple-500/10 text-purple-400 border-purple-500/20 animate-pulse"
                      }`}>
                        {invoicePaid ? "PAID" : "UNPAID"}
                      </span>
                    </div>
                    <div className="space-y-1 text-slate-400">
                      <div className="flex justify-between">
                        <span className="capitalize">{subscriptionTier} Plan Subscription</span>
                        <span className="font-bold text-white">{subscriptionTier === "growth" ? "$397.00" : "$197.00"}</span>
                      </div>
                      <div className="flex justify-between border-t border-dashed border-slate-850 pt-1.5 text-xs font-bold text-white">
                        <span>Total Paid</span>
                        <span className="text-blue-400">{subscriptionTier === "growth" ? "$397.00" : "$197.00"}</span>
                      </div>
                    </div>

                    {invoiceStep === 1 && (
                      <div className="absolute inset-0 bg-slate-950/80 rounded-xl flex flex-col items-center justify-center space-y-2 animate-in fade-in duration-200">
                        <div className="h-8 w-12 bg-blue-600 rounded border border-blue-400 animate-bounce flex items-center justify-center text-[7px] font-black uppercase text-white shadow-lg">Credit Card</div>
                        <span className="text-[8px] text-blue-400 animate-pulse font-bold">Tapping card to back of phone...</span>
                      </div>
                    )}
                    
                    {invoiceStep === 2 && (
                      <div className="absolute inset-0 bg-slate-950/90 rounded-xl flex flex-col items-center justify-center space-y-1.5 animate-in zoom-in duration-300">
                        <div className="h-8 w-8 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                          <Check size={18} />
                        </div>
                        <span className="text-[9px] text-emerald-400 font-bold">Plan Swapped Successfully!</span>
                        <span className="text-[7.5px] text-slate-500">Tier: {subscriptionTier.toUpperCase()} Active</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Scenario 5: AI Recruiting Pipeline */}
              {demoState === "recruiting" && (
                <div className="w-full space-y-4 animate-in fade-in duration-500 max-w-xs">
                  <div className="h-10 w-10 rounded-full bg-orange-600/10 border border-orange-500/20 flex items-center justify-center text-orange-400 mx-auto">
                    <Users size={20} />
                  </div>
                  <div className="text-center space-y-0.5">
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-orange-400">AI Recruiting Funnel</h4>
                    <p className="text-[9px] text-slate-500">Applicant screening and automated interviews</p>
                  </div>
                  
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-left space-y-2 text-[9px]">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-1.5">
                      <span className="font-bold text-slate-300">Hiring Pipeline (GHL)</span>
                    </div>
                    <div className="space-y-1 text-slate-400">
                      <div className="flex justify-between items-center p-1.5 bg-slate-950 rounded border border-slate-850">
                        <span>New Applicants</span>
                        <span className="font-bold text-white font-mono">14</span>
                      </div>
                      <div className="flex justify-between items-center p-1.5 bg-slate-950 rounded border border-slate-850">
                        <span>AI Text-Screened</span>
                        <span className="font-bold text-blue-400 font-mono">8</span>
                      </div>
                      <div className="flex justify-between items-center p-1.5 bg-slate-950 rounded border border-slate-850">
                        <span>License Vetted</span>
                        <span className="font-bold text-emerald-400 font-mono">3</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Scenario 7: Reputation Dashboard Mockup */}
              {demoState === "reputation" && (
                <div className="w-full space-y-4 animate-in fade-in duration-500 max-w-xs">
                  <div className="h-10 w-10 rounded-full bg-yellow-600/10 border border-yellow-500/20 flex items-center justify-center text-yellow-400 mx-auto">
                    <Sparkles size={20} />
                  </div>
                  <div className="text-center space-y-0.5">
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-yellow-400 font-black">Reputation Gate</h4>
                    <p className="text-[9px] text-slate-500">Smart GHL reviews filter & maps routing</p>
                  </div>
                  
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-left space-y-2 text-[9px]">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-1.5">
                      <span className="font-bold text-slate-350">Average Rating</span>
                      <span className="text-[8.5px] bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-1.5 py-0.5 rounded font-black">4.9 ★★★★★</span>
                    </div>
                    <div className="space-y-1.5 text-slate-400">
                      <div className="p-2 bg-slate-950 rounded border border-slate-850">
                        <div className="flex justify-between font-bold text-white text-[8px] mb-0.5">
                          <span>Google Public review</span>
                          <span className="text-emerald-400">★★★★★</span>
                        </div>
                        <p className="text-[7.5px] text-slate-500 leading-snug">"Dave fixed our burst pipe in minutes. Clean and professional!" - John D.</p>
                      </div>
                      <div className="p-2 bg-slate-950 rounded border border-slate-850">
                        <div className="flex justify-between font-bold text-white text-[8px] mb-0.5">
                          <span>Internal Alert (Gated Low Score)</span>
                          <span className="text-red-400">★★☆☆☆</span>
                        </div>
                        <p className="text-[7.5px] text-slate-500 leading-snug">"Technician arrived late, but did okay work." - Mike T. (Routed Privately)</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Scenario 6: Contact Book Call Form */}
              {demoState === "lead_form" && (
                <div className="w-full space-y-3 animate-in fade-in duration-500 max-w-xs">
                  <div className="text-center space-y-0.5">
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-blue-400">Book Demo Callback</h4>
                    <p className="text-[9px] text-slate-500">Secure a human routing slot instantly</p>
                  </div>
                  
                  {submitSuccess ? (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl text-center space-y-2 animate-in zoom-in duration-300">
                      <CheckCircle2 size={24} className="text-emerald-400 mx-auto" />
                      <div className="text-[10px] font-bold text-emerald-400">Callback Registered!</div>
                    </div>
                  ) : (
                    <form onSubmit={handleLeadSubmit} className="space-y-2 text-[9px]">
                      <input 
                        type="text" 
                        required
                        value={leadForm.firstName}
                        onChange={(e) => setLeadForm(prev => ({ ...prev, firstName: e.target.value }))}
                        placeholder="First Name"
                        className="w-full p-2 rounded bg-slate-900 border border-slate-850 text-white outline-none"
                      />
                      <input 
                        type="text" 
                        required
                        value={leadForm.lastName}
                        onChange={(e) => setLeadForm(prev => ({ ...prev, lastName: e.target.value }))}
                        placeholder="Last Name"
                        className="w-full p-2 rounded bg-slate-900 border border-slate-850 text-white outline-none"
                      />
                      <input 
                        type="tel" 
                        required
                        value={leadForm.phone}
                        onChange={(e) => setLeadForm(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="Phone Number"
                        className="w-full p-2 rounded bg-slate-900 border border-slate-850 text-white outline-none"
                      />
                      <input 
                        type="email" 
                        required
                        value={leadForm.email}
                        onChange={(e) => setLeadForm(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="Email Address"
                        className="w-full p-2 rounded bg-slate-900 border border-slate-850 text-white outline-none"
                      />
                      <button 
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded font-bold uppercase transition-colors"
                      >
                        {isSubmitting ? "Syncing..." : t.buttonSubmit}
                      </button>
                    </form>
                  )}
                </div>
              )}

            </div>

            {/* RIGHT PANE: CONVERSATIONAL VIEW (60% width on medium/large screens) */}
            <div className="flex-1 flex flex-col overflow-hidden bg-slate-950">
              
              {/* Communication mode controller switch */}
              <div className="h-10 px-4 bg-slate-900/30 border-b border-slate-900 flex justify-between items-center shrink-0">
                <span className="text-[9.5px] font-bold text-slate-500 uppercase font-mono tracking-wider">Communication Channel</span>
                <div className="flex bg-slate-950 p-[2px] rounded-lg border border-slate-850">
                  <button 
                    onClick={() => {
                      setCommunicationMode("chat");
                      setVoiceListening(false);
                      if (typeof window !== "undefined" && window.speechSynthesis) {
                        window.speechSynthesis.cancel();
                      }
                      setIsSpeaking(false);
                      setCurrentSubtitle("");
                    }}
                    className={`px-3 py-1 rounded-md text-[8.5px] font-black uppercase tracking-wider transition-all flex items-center gap-1 ${
                      communicationMode === "chat" 
                        ? "bg-blue-600 text-white shadow-md shadow-blue-500/10" 
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <Keyboard size={10} /> {language === "zh-TW" ? "打字" : "Chat"}
                  </button>
                  <button 
                    onClick={() => {
                      setCommunicationMode("voice");
                      // Cancel any active speechSynthesis
                      if (typeof window !== "undefined" && window.speechSynthesis) {
                        window.speechSynthesis.cancel();
                      }
                      setIsSpeaking(false);
                    }}
                    className={`px-3 py-1 rounded-md text-[8.5px] font-black uppercase tracking-wider transition-all flex items-center gap-1 ${
                      communicationMode === "voice" 
                        ? "bg-blue-600 text-white shadow-md shadow-blue-500/10" 
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <Mic size={10} /> {language === "zh-TW" ? "語音" : "Voice"}
                  </button>
                </div>
              </div>

              {/* VIEW 1: TEXT CHAT INTERFACE */}
              {communicationMode === "chat" && (
                <div className="flex-1 flex flex-col overflow-hidden">
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((msg, i) => (
                      <div 
                        key={i} 
                        className={`flex flex-col max-w-[85%] ${
                          msg.sender === "user" ? "ml-auto items-end" : "mr-auto items-start"
                        }`}
                      >
                        <div 
                          className={`p-3 rounded-2xl text-[11px] leading-relaxed font-medium ${
                            msg.sender === "user" 
                              ? "bg-gradient-to-tr from-blue-600 to-cyan-500 text-white rounded-tr-none" 
                              : "bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none"
                          }`}
                        >
                          {msg.text.split("\n").map((line, lIdx) => (
                            <p key={lIdx} className={lIdx > 0 ? "mt-1.5" : ""}>{line}</p>
                          ))}
                        </div>
                        <span className="text-[7px] text-slate-600 mt-1 px-1 font-semibold">{msg.timestamp}</span>
                      </div>
                    ))}

                    {isTyping && (
                      <div className="flex items-center gap-1.5 p-3 rounded-xl bg-slate-900 border border-slate-800 w-16 mr-auto rounded-tl-none animate-pulse">
                        <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-bounce"></div>
                        <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-bounce [animation-delay:0.2s]"></div>
                        <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-bounce [animation-delay:0.4s]"></div>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>

                  <form 
                    onSubmit={handleSendText}
                    className="p-3 border-t border-slate-800 bg-slate-900/50 flex items-center gap-2 shrink-0"
                  >
                    <input
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder={t.inputPlaceholder}
                      className="flex-1 h-10 bg-slate-950 border border-slate-800 rounded-xl px-4 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                    
                    <button
                      type="button"
                      onClick={() => {
                        if (typeof window !== "undefined" && ("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
                          const Speech = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
                          const recognition = new Speech();
                          recognition.lang = language === "zh-TW" ? "zh-TW" : language === "es" ? "es-ES" : language === "fr" ? "fr-FR" : "en-US";
                          recognition.interimResults = false;
                          recognition.maxAlternatives = 1;
                          
                          recognition.onstart = () => {
                            setInputText("Listening...");
                          };
                          recognition.onresult = (event: any) => {
                            const transcript = event.results[0][0].transcript;
                            setInputText("");
                            processUserMsg(transcript);
                          };
                          recognition.onerror = () => {
                            setInputText("");
                          };
                          recognition.start();
                        } else {
                          alert("Web Speech API voice recognition is not supported in this browser.");
                        }
                      }}
                      className="h-10 w-10 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors flex items-center justify-center text-slate-400 hover:text-white"
                      title="Voice Speech Input"
                    >
                      <Mic size={14} />
                    </button>

                    <button
                      type="submit"
                      className="h-10 w-10 rounded-xl bg-blue-600 hover:bg-blue-500 transition-colors flex items-center justify-center text-white"
                    >
                      <Send size={14} />
                    </button>
                  </form>
                </div>
              )}

              {/* VIEW 2: IMMERSIVE VOICE CALL INTERFACE */}
              {communicationMode === "voice" && (
                <div className="flex-1 flex flex-col justify-between p-6 overflow-hidden items-center text-center">
                  
                  {/* Status */}
                  <div className="space-y-1">
                    <span className="text-[8px] px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 font-black uppercase font-mono tracking-wider">
                      VOICE INTERACTION HUB
                    </span>
                    <h4 className="text-sm font-bold text-white">Plumbify Voice Assistant</h4>
                    <p className="text-[9px] text-slate-500">Talk to the agent, it will speak back and execute commands</p>
                  </div>

                  {/* Pulsing Neural Visualizer circle */}
                  <div className="relative w-40 h-40 flex items-center justify-center select-none">
                    <div className={`absolute inset-0 rounded-full blur-2xl transition-all duration-500 ${
                      voiceListening 
                        ? "bg-red-500/20 scale-110" 
                        : isSpeaking 
                          ? "bg-blue-500/20 scale-105" 
                          : "bg-blue-500/5 scale-90"
                    }`} />
                    
                    {/* Ring layers */}
                    <div className={`absolute inset-4 rounded-full border border-slate-800 flex items-center justify-center transition-all ${
                      voiceListening ? "border-red-500/40" : isSpeaking ? "border-blue-500/40" : ""
                    }`}>
                      <div className={`w-24 h-24 rounded-full flex items-center justify-center border transition-all ${
                        voiceListening 
                          ? "bg-red-600/10 border-red-500 animate-pulse" 
                          : isSpeaking 
                            ? "bg-blue-600/10 border-blue-500" 
                            : "bg-slate-900 border-slate-800"
                      }`}>
                        {voiceListening ? (
                          <Mic size={32} className="text-red-500 animate-bounce" />
                        ) : (
                          <Bot size={32} className={`text-blue-400 ${isSpeaking ? "animate-pulse" : ""}`} />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="space-y-4 w-full">
                    {/* Captions caption overlay */}
                    {currentSubtitle && isSpeaking && (
                      <div className="px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-[10px] leading-relaxed text-slate-200 text-left select-text max-h-20 overflow-y-auto animate-in fade-in duration-200">
                        <span className="text-[7.5px] font-black text-blue-400 uppercase tracking-widest block mb-1">
                          🗣️ Voice Subtitle Output
                        </span>
                        <p>{currentSubtitle}</p>
                      </div>
                    )}

                    {/* Microphone Toggle trigger */}
                    <button
                      onClick={() => {
                        if (typeof window !== "undefined" && ("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
                          const Speech = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
                          const recognition = new Speech();
                          recognition.lang = language === "zh-TW" ? "zh-TW" : language === "es" ? "es-ES" : language === "fr" ? "fr-FR" : "en-US";
                          recognition.interimResults = false;
                          recognition.maxAlternatives = 1;

                          recognition.onstart = () => {
                            setVoiceListening(true);
                            if (typeof window !== "undefined" && window.speechSynthesis) {
                              window.speechSynthesis.cancel();
                            }
                            setIsSpeaking(false);
                          };
                          recognition.onresult = (event: any) => {
                            const transcript = event.results[0][0].transcript;
                            setVoiceListening(false);
                            processUserMsg(transcript);
                          };
                          recognition.onerror = () => {
                            setVoiceListening(false);
                          };
                          recognition.onend = () => {
                            setVoiceListening(false);
                          };
                          recognition.start();
                        } else {
                          alert("Web Speech API voice recognition is not supported in this browser.");
                        }
                      }}
                      disabled={voiceListening}
                      className={`w-full py-3 rounded-xl text-xs font-bold transition-all uppercase tracking-wider flex items-center justify-center gap-2 ${
                        voiceListening 
                          ? "bg-red-600 hover:bg-red-500 text-white animate-pulse" 
                          : "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/15"
                      }`}
                    >
                      <Mic size={14} />
                      {voiceListening ? "Listening... Speak Now" : "Tap to Speak (Voice Control)"}
                    </button>
                  </div>

                </div>
              )}

              {/* Subtitles box for visual walkthrough tour mode as well */}
              {isSpeaking && currentSubtitle && communicationMode === "chat" && (
                <div className="flex flex-col shrink-0 select-none animate-in fade-in duration-200">
                  {/* Waveform Bar */}
                  <div className="px-4 py-1.5 bg-blue-950/40 border-t border-slate-900 flex items-center gap-2 text-blue-400">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </span>
                    <span className="text-[9px] font-black tracking-tight uppercase">{language === "zh-TW" ? "AI 語音導覽中" : "AI Voice Speaking"}</span>
                    
                    {/* Waveform Bars */}
                    <div className="flex items-end gap-0.5 h-3 ml-auto pr-2">
                      <div className="w-[2px] bg-blue-400 rounded-full animate-wave h-full [animation-delay:0.1s]"></div>
                      <div className="w-[2px] bg-blue-400 rounded-full animate-wave h-[60%] [animation-delay:0.3s]"></div>
                      <div className="w-[2px] bg-blue-400 rounded-full animate-wave h-[80%] [animation-delay:0.2s]"></div>
                      <div className="w-[2px] bg-blue-400 rounded-full animate-wave h-[40%] [animation-delay:0.5s]"></div>
                      <div className="w-[2px] bg-blue-400 rounded-full animate-wave h-full [animation-delay:0.4s]"></div>
                    </div>
                  </div>

                  {/* Live Caption Text Box */}
                  <div className="px-4 py-2.5 bg-slate-900 border-t border-slate-800 text-[10.5px] leading-relaxed text-slate-200 select-text max-h-24 overflow-y-auto font-medium">
                    <div className="text-[8px] font-black uppercase text-blue-400 tracking-wider mb-1 flex items-center gap-1 select-none">
                      <span>{language === "zh-TW" ? "🗣️ 語音字幕輸出" : "🗣️ Live Voice Captions"}</span>
                    </div>
                    <p>{currentSubtitle}</p>
                  </div>

                  <style>{`
                    @keyframes wave-bounce {
                      0%, 100% { height: 30%; }
                      50% { height: 100%; }
                    }
                    .animate-wave {
                      animation: wave-bounce 0.8s ease-in-out infinite;
                    }
                  `}</style>
                </div>
              )}

              {/* Walkthrough Tour Control Panel */}
              {isTourActive && (
                <div className="px-4 py-3 bg-slate-900 border-t border-slate-800 flex items-center justify-between gap-3 shrink-0 select-none">
                  <button
                    type="button"
                    onClick={() => handleTourStep("prev")}
                    disabled={tourStep === 1}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 disabled:hover:bg-slate-800 rounded-xl text-[10px] font-black tracking-tight transition-colors flex items-center gap-1"
                  >
                    {t.prevStep}
                  </button>
                  
                  {/* Step Progress indicators */}
                  <div className="flex gap-1.5 items-center">
                    {[1, 2, 3, 4, 5].map((step) => (
                      <div 
                        key={step} 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          step === tourStep 
                            ? "w-5 bg-blue-500" 
                            : step < tourStep 
                              ? "w-2 bg-blue-600/40" 
                              : "w-2 bg-slate-800"
                        }`}
                      />
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleTourStep("skip")}
                      className="px-2.5 py-2 hover:text-white text-slate-400 rounded-xl text-[10px] font-bold tracking-tight transition-colors"
                    >
                      {t.skipTour}
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => handleTourStep(tourStep === 5 ? "skip" : "next")}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-[10px] font-black tracking-tight transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)] flex items-center gap-1"
                    >
                      {tourStep === 5 ? t.finishTour : t.nextStep}
                    </button>
                  </div>
                </div>
              )}

            </div>

          </div>

        </div>
      )}

    </div>
  );
}
