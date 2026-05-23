"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Mail, Building2, Phone, MapPin } from "lucide-react";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";
import ReactCountryFlag from "react-country-flag";
// ─── Marquee items ────────────────────────────────────────────────────────────

const marqueeItems = [
  "UNIFIED MARKETING DATA",
  "JAPAN FIRST",
  "AI AGENT",
  "REAL-TIME SYNTHESIS",
  "CAMPAIGN INTELLIGENCE",
  "PERFORMANCE ALIGNMENT",
  "DATA-DRIVEN DECISIONS",
];

// ─── Translations ─────────────────────────────────────────────────────────────

type Lang = "en" | "ja";

const t = {
  en: {
    nav: {
      home: "Home",
      about: "About Us",
      services: "Services",
      portfolio: "Portfolio",
      pricing: "Pricing",
      cta: "Let's Talk",
    },
    hero: {
      h1: ["Marketing Operations", "That Actually Align"],
      sub: "Atlas helps teams unify marketing data, automate decisions, and improve campaign performance across channels.",
      demo: "Book a Demo",
      deploy: "See Deployment",
    },
    planSmarter: {
      h2a: "Plan Smarter.",
      h2b: "Execute Better.",
      sub: "From strategy planning to campaign briefs, AIMOS helps marketing teams turn ideas into actionable campaigns with AI-powered recommendations and structured workflows.",
      features: [
        {
          title: "AI-Powered Recommendations",
          desc: "Get smart strategy and brief suggestions based on your goals, audience and historical performance.",
        },
        {
          title: "Structured & Consistent",
          desc: "Use standardized frameworks to ensure every strategy and brief is clear, complete, and on-brand.",
        },
        {
          title: "Collaborative & Aligned",
          desc: "Keep your team aligned with real-time collaboration, feedback, and centralized campaign information.",
        },
      ],
    },
    japanese: {
      h2: "Built with Japanese Precision",
      sub: "Built for Japan, designed for global growth. Our platform combines strategic planning, campaign execution, collaboration, and performance analytics into one seamless ecosystem for modern marketing teams.",
      kanji: "日本向けに構築",
    },
    evidence: {
      h2: "Evidence Over Vibes",
      sub: "Results from production deployments across Japan retail & consumer brands.  No cherry picked pilots.",
      stats: [
        { value: "+34 %", label: "Marketing Efficiency Lift" },
        { value: "− 28 %", label: "Manual Analysis Time" },
        { value: "12 d", label: "Median Time-To-Value" },
      ],
      opinionsH: "Opinions we're willing to deploy",
      opinionsSub:
        "Three principles from eight years shipping AI in production. They're why customers re-sign at 96%.",
      opinions: [
        {
          num: "1",
          title: "Unify fragmented operations",
          desc: "CRM, ad platforms, ERP, finance — built independently, now speaking one language. AIMOS consolidates without forklift upgrades.",
        },
        {
          num: "2",
          title: "Evidence Over Dashboard",
          desc: "We refuse to show projections. Every number is from a live production deployment. Ask and we'll show you the audit trail.",
        },
        {
          num: "3",
          title: "Operators OverAlgorithms",
          desc: "If the recommendation can't be acted on in under 10 seconds by a non-technical marketer, we didn't ship it.",
        },
      ],
    },
    shipped: {
      h2: "Shipped. In production.",
      sub: "Deployments across retail, consumer goods, ecommerce and QSR verticals in Japan.",
      cards: [
        {
          tag: "STRATEGY & INVESTMENT",
          title: "CRM Agent",
          desc: "Identify high-potential segments and shift budget to the right channels for stronger returns.",
        },
        {
          tag: "PROMOTION",
          title: "Marketing Agent",
          desc: "Align promotions with inventory in real time to maximize sell-through and reduce waste.",
        },
        {
          tag: "CHANNEL MANAGEMENT",
          title: "Finance Agent",
          desc: "Dynamically rebalance channels based on performance to capture every growth opportunity.",
        },
        {
          tag: "PERFORMANCE & OPTIMIZATION",
          title: "Inventory Agent",
          desc: "Monitor results in real time and continuously learn to improve future campaigns.",
        },
      ],
    },
    planCampaigns: {
      h2: "Plan Campaigns Your Way",
      sub: "Plan smarter campaigns with AI-powered recommendations and structured workflows built for modern marketing teams.",
      card1: {
        title: "Strategy Planner",
        desc: "Create smarter marketing strategies with AI-powered recommendations tailored to your goals, audience, budget, and campaign objectives.",
      },
      card2: {
        title: "Create Campaign Brief",
        desc: "Create structured campaign briefs with AI-powered recommendations or manual workflows tailored to your campaign goals and requirements.",
      },
    },
    cta: {
      h2: "Let's Unify Your  Marketing Operations",
      sub: "Talk to an engineer. We'll share a case study from your vertical before the first call.",
      btn: "Request Brief",
      placeholder: "Enter your email here",
    },
    services: {
      h2a: "We Provide Exclusive Service",
      h2b: "For Your Business",
      viewAll: "View All Service",
      cards: [
        {
          title: "CRM Agent",
          desc: "Dynamic segmentation from real-time customer behavior. Churn prediction and LTV analysis. Identify high-value customers at risk.",
          icon: "crm",
        },
        {
          title: "Marketing Agent",
          desc: "Campaign performance analysis across LINE, Yahoo, Google & Meta. Channel comparison and budget optimization in real-time.",
          icon: "marketing",
        },
        {
          title: "Finance Agent",
          desc: "Campaign-to-revenue attribution. Prove marketing impact on bottom line. Cost-per-acquisition analysis by channel and segment.",
          icon: "finance",
        },
        {
          title: "Inventory Agent",
          desc: "Slow-moving product detection. Promotion opportunity identification. Align marketing campaigns with inventory position.",
          icon: "inventory",
        },
      ],
    },
    footer: {
      tagline:
        "Altimeda's AI Marketing Operating System for Japan.  Built by ex-CMOs and ops leaders. Headquartered Tokyo and Berlin.",
      platform: "Platform",
      company: "Company",
      contact: "Contact",
      newsletter: "Subscribe to our newsletter",
      newsletterSub:
        "Receive curated updates, strategy insights, and product news directly from our team.",
      subscribe: "Subscribe",
      emailPlaceholder: "Enter your email here",
      copyright: "Copyright © 2026 AIMOS | All Rights Reserved",
      platformLinks: [
        "CRM Intelligence",
        "Marketing Intelligence",
        "Finance Intelligence",
        "Inventory Intelligence",
      ],
      companyLinks: ["Deployment", "Customers", "Research", "Careers", "Press"],
    },
  },
  ja: {
    nav: {
      home: "ホーム",
      about: "会社概要",
      services: "サービス",
      portfolio: "実績",
      pricing: "料金",
      cta: "お問い合わせ",
    },
    hero: {
      h1: ["マーケティング業務を", "一元化する"],
      sub: "Atlasはチームがマーケティングデータを統合し、意思決定を自動化し、チャネル全体のキャンペーンパフォーマンスを向上させるお手伝いをします。",
      demo: "デモを予約",
      deploy: "導入事例を見る",
    },
    planSmarter: {
      h2a: "賢く計画。",
      h2b: "より良く実行。",
      sub: "戦略立案からキャンペーンブリーフまで、AIMOSはマーケティングチームがAIを活用した推奨事項と構造化されたワークフローでアイデアを実行可能なキャンペーンに変えるお手伝いをします。",
      features: [
        {
          title: "AIによる推奨",
          desc: "目標、オーディエンス、過去の実績に基づいたスマートな戦略とブリーフの提案を取得します。",
        },
        {
          title: "構造化された一貫性",
          desc: "標準化されたフレームワークを使用して、すべての戦略とブリーフが明確で完全かつブランドに沿ったものになるようにします。",
        },
        {
          title: "協調的な連携",
          desc: "リアルタイムのコラボレーション、フィードバック、一元化されたキャンペーン情報でチームの連携を維持します。",
        },
      ],
    },
    japanese: {
      h2: "日本の精度で構築",
      sub: "日本向けに構築され、グローバルな成長のために設計されています。私たちのプラットフォームは、戦略的計画、キャンペーン実行、コラボレーション、パフォーマンス分析を現代のマーケティングチームのためのシームレスなエコシステムに統合します。",
      kanji: "日本向けに構築",
    },
    evidence: {
      h2: "データが証明する成果",
      sub: "日本の小売・消費財ブランドへの本番導入からの実績。選り抜きのパイロットではありません。",
      stats: [
        { value: "+34 %", label: "マーケティング効率向上" },
        { value: "− 28 %", label: "手動分析時間削減" },
        { value: "12 日", label: "価値実現までの中央値" },
      ],
      opinionsH: "私たちが自信を持って展開する考え方",
      opinionsSub:
        "AIを本番環境で8年間提供してきた3つの原則。顧客の96%が再契約する理由です。",
      opinions: [
        {
          num: "1",
          title: "分断された業務を統合",
          desc: "CRM、広告プラットフォーム、ERP、財務 — 独立して構築され、今や一つの言語で話しています。AIMOSは大規模な移行なしに統合します。",
        },
        {
          num: "2",
          title: "ダッシュボードより証拠",
          desc: "予測は表示しません。すべての数字は本番導入からのものです。監査証跡をお見せします。",
        },
        {
          num: "3",
          title: "アルゴリズムより運用者",
          desc: "非技術系マーケターが10秒以内に実行できない推奨事項は、私たちは出荷しません。",
        },
      ],
    },
    shipped: {
      h2: "本番環境で稼働中。",
      sub: "日本の小売、消費財、eコマース、QSR業界への導入実績。",
      cards: [
        {
          tag: "戦略・投資",
          title: "CRMエージェント",
          desc: "高ポテンシャルセグメントを特定し、より強いリターンのために適切なチャネルに予算をシフトします。",
        },
        {
          tag: "プロモーション",
          title: "マーケティングエージェント",
          desc: "在庫とプロモーションをリアルタイムで連携させ、売上を最大化し廃棄を削減します。",
        },
        {
          tag: "チャネル管理",
          title: "ファイナンスエージェント",
          desc: "パフォーマンスに基づいてチャネルを動的に再調整し、すべての成長機会を捉えます。",
        },
        {
          tag: "パフォーマンス最適化",
          title: "在庫エージェント",
          desc: "リアルタイムで結果を監視し、将来のキャンペーンを改善するために継続的に学習します。",
        },
      ],
    },
    planCampaigns: {
      h2: "自分のやり方でキャンペーンを計画",
      sub: "現代のマーケティングチームのために構築されたAI搭載の推奨事項と構造化されたワークフローで、よりスマートなキャンペーンを計画します。",
      card1: {
        title: "戦略プランナー",
        desc: "目標、オーディエンス、予算、キャンペーン目標に合わせたAI搭載の推奨事項でよりスマートなマーケティング戦略を作成します。",
      },
      card2: {
        title: "キャンペーンブリーフ作成",
        desc: "キャンペーンの目標と要件に合わせたAI搭載の推奨事項または手動ワークフローで構造化されたキャンペーンブリーフを作成します。",
      },
    },
    cta: {
      h2: "マーケティング業務を統合しましょう",
      sub: "エンジニアとお話しください。最初の通話前にあなたの業界のケーススタディをお伝えします。",
      btn: "ブリーフを依頼",
      placeholder: "メールアドレスを入力",
    },
    services: {
      h2a: "独自のサービスを提供します",
      h2b: "あなたのビジネスのために",
      viewAll: "すべてのサービスを見る",
      cards: [
        {
          title: "CRMエージェント",
          desc: "リアルタイムの顧客行動からの動的セグメンテーション。チャーン予測とLTV分析。リスクのある高価値顧客を特定します。",
          icon: "crm",
        },
        {
          title: "マーケティングエージェント",
          desc: "LINE、Yahoo、Google、Metaにわたるキャンペーンパフォーマンス分析。チャネル比較とリアルタイムの予算最適化。",
          icon: "marketing",
        },
        {
          title: "ファイナンスエージェント",
          desc: "キャンペーンから収益への帰属。マーケティングの収益への影響を証明。チャネルとセグメント別のCPA分析。",
          icon: "finance",
        },
        {
          title: "在庫エージェント",
          desc: "動きの遅い製品の検出。プロモーション機会の特定。マーケティングキャンペーンを在庫ポジションに合わせます。",
          icon: "inventory",
        },
      ],
    },
    footer: {
      tagline:
        "AltimediaのAIマーケティングオペレーティングシステム（日本向け）。元CMOと運用リーダーが構築。東京とベルリンに本社。",
      platform: "プラットフォーム",
      company: "会社情報",
      contact: "お問い合わせ",
      newsletter: "ニュースレター登録",
      newsletterSub:
        "厳選されたアップデート、戦略インサイト、製品ニュースをチームから直接お届けします。",
      subscribe: "登録",
      emailPlaceholder: "メールアドレスを入力",
      copyright: "Copyright © 2026 AIMOS | All Rights Reserved",
      platformLinks: [
        "CRMインテリジェンス",
        "マーケティングインテリジェンス",
        "ファイナンスインテリジェンス",
        "在庫インテリジェンス",
      ],
      companyLinks: ["導入事例", "顧客", "研究", "採用", "プレス"],
    },
  },
} as const;
function drawSparkle(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  color: string,
) {
  ctx.save();

  ctx.translate(x, y);
  ctx.rotate(Date.now() * 0.001);

  ctx.beginPath();

  // atas
  ctx.moveTo(0, -size);

  // kanan
  ctx.lineTo(size * 0.35, -size * 0.35);
  ctx.lineTo(size, 0);

  // bawah
  ctx.lineTo(size * 0.35, size * 0.35);
  ctx.lineTo(0, size);

  // kiri
  ctx.lineTo(-size * 0.35, size * 0.35);
  ctx.lineTo(-size, 0);

  // kembali atas
  ctx.lineTo(-size * 0.35, -size * 0.35);

  ctx.closePath();

  ctx.fillStyle = color;
  ctx.fill();

  ctx.restore();
}
// ─── Service Cards (poker deal animation) ────────────────────────────────────

type ServiceCard = { title: string; desc: string; icon: string };

function ServiceCards({ cards }: { cards: readonly ServiceCard[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [dealt, setDealt] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setDealt(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const iconMap: Record<string, React.ReactNode> = {
    crm: (
      <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    marketing: (
      <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
      </svg>
    ),
    finance: (
      <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
        <path d="M7 8h.01M12 8h.01M17 8h.01M7 12h10" />
      </svg>
    ),
    inventory: (
      <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    ),
  };

  return (
    <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {cards.map((card, i) => (
        <div
          key={i}
          className="group relative rounded-2xl p-6 flex flex-col gap-5 h-full cursor-default hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-900/20"
          style={{
            backgroundColor: "#3B5BDB",
            // start: stacked at left, rotated, hidden
            transform: dealt
              ? "translateX(0px) rotate(0deg)"
              : `translateX(-120px) rotate(0deg)`,
            opacity: dealt ? 1 : 0,
            transition: dealt
              ? `transform 0.55s cubic-bezier(0.22,1,0.36,1) ${i * 120}ms, opacity 0.4s ease ${i * 120}ms, box-shadow 0.3s ease, translate 0.3s ease`
              : "none",
          }}
        >
          {/* Icon */}
          <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
            {iconMap[card.icon]}
          </div>

          {/* Content */}
          <div className="flex flex-col gap-2 flex-1">
            <h3 className="text-lg font-bold text-white">{card.title}</h3>
            <p className="text-sm text-blue-100 leading-relaxed flex-1">{card.desc}</p>
          </div>

          {/* Learn more */}
          <button className="flex items-center gap-1.5 text-sm font-semibold text-white/80 hover:text-white transition-colors mt-2 self-start">
            Learn more
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}

// ─── Orbit animation ──────────────────────────────────────────────────────────

function OrbitRings() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let lastTime = 0;
    let elapsed = 0;

    const rings = [
      { r: 60 },
      { r: 100 },
      { r: 150 },
      { r: 210 },
      { r: 280 },
      { r: 350 },
    ];

    const orbitDots = [
      { ringIndex: 4, speed: 0.85, dotR: 7, color: "#d4d4d8" },
      { ringIndex: 5, speed: -0.85, dotR: 9, color: "#e5e7eb" },
    ];

    function resize() {
      canvas!.width = canvas!.offsetWidth;
      canvas!.height = canvas!.offsetHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    function draw(timestamp: number) {
      const delta = timestamp - lastTime;
      lastTime = timestamp;
      elapsed += delta * 0.001;

      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      const cx = canvas!.width * 0.55;
      const cy = canvas!.height * 0.48;

      rings.forEach((ring) => {
        ctx!.beginPath();
        ctx!.arc(cx, cy, ring.r, 0, Math.PI * 2);
        ctx!.strokeStyle = "rgba(148,163,184,0.18)";
        ctx!.lineWidth = 1;
        ctx!.stroke();
      });

      orbitDots.forEach((dot) => {
        const ring = rings[dot.ringIndex];
        const angle = elapsed * dot.speed;

        const dx = cx + Math.cos(angle) * ring.r;
        const dy = cy + Math.sin(angle) * ring.r;

        // glow
        const grad = ctx!.createRadialGradient(dx, dy, 0, dx, dy, 20);
        grad.addColorStop(0, dot.color + "44");
        grad.addColorStop(1, dot.color + "00");

        ctx!.beginPath();
        ctx!.arc(dx, dy, 20, 0, Math.PI * 2);
        ctx!.fillStyle = grad;
        ctx!.fill();

        // sparkle
        drawSparkle(ctx!, dx, dy, dot.dotR, dot.color);
      });

      animRef.current = requestAnimationFrame(draw);
    }

    animRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
}

// ─── Fade-in on scroll ───────────────────────────────────────────────────────

function FadeInSection({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Toggle on both enter and leave — animates in both scroll directions
        setVisible(entry.isIntersecting);
      },
      { threshold: 0.12 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`}
    >
      {children}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [lang, setLang] = useState<Lang>("en");
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const tx = t[lang];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="min-h-screen bg-[#eef2f9] flex flex-col">
      {/* ── Sticky Navbar ──────────────────────────────────────────────── */}
      <header
        className={`sticky top-0 z-50 flex justify-center px-4 transition-all duration-200 ${scrolled ? "py-2 bg-[#eef2f9]/90 backdrop-blur-md shadow-sm" : "py-4 bg-transparent"}`}
      >
        <nav className="bg-white/95 backdrop-blur-md rounded-full px-6 py-2.5 flex items-center justify-between gap-8 shadow-sm border border-gray-200/60 w-full max-w-5xl">
          {/* Logo */}
          <span className="shrink-0">
            <img src="/logo.svg" className="h-7 w-auto" />
          </span>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-7 text-sm text-gray-500">
            <a href="#" className="font-bold text-gray-900">
              {tx.nav.home}
            </a>
            <a href="#" className="hover:text-gray-900 transition-colors">
              {tx.nav.about}
            </a>
            <a href="#" className="hover:text-gray-900 transition-colors">
              {tx.nav.services}
            </a>
            <a href="#" className="hover:text-gray-900 transition-colors">
              {tx.nav.portfolio}
            </a>
            <a href="#" className="hover:text-gray-900 transition-colors">
              {tx.nav.pricing}
            </a>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Login button — filled blue */}
            <Link
              href="/auth/login"
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-1.5 rounded-full transition-colors"
            >
              Login
            </Link>

            {/* Let's Talk — outline blue */}
            <Link
              href="/auth/login"
              className="border border-blue-600 text-blue-600 hover:bg-blue-50 text-sm font-semibold px-5 py-1.5 rounded-full transition-colors"
            >
              {tx.nav.cta}
            </Link>

            {/* Language toggle — flag dropdown */}
            <div className="relative" ref={langRef}>
              <button
                onClick={() => setLangOpen((v) => !v)}
                className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors px-2 py-1.5 rounded-full hover:bg-gray-100"
              >
                <ReactCountryFlag
                  countryCode={lang === "en" ? "GB" : "JP"}
                  svg
                  style={{ width: "1.3em", height: "1.3em" }}
                />
                <svg className="w-3 h-3 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>

              {/* Dropdown */}
              {langOpen && (
                <div className="absolute right-0 top-full mt-2 w-44 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                  {[
                    { code: "en" as Lang, country: "GB", label: "English" },
                    { code: "ja" as Lang, country: "JP", label: "Japan" },
                  ].map((item) => (
                    <button
                      key={item.code}
                      onClick={() => { setLang(item.code); setLangOpen(false); }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50 transition-colors ${lang === item.code ? "text-gray-900 font-semibold" : "text-gray-700"}`}
                    >
                      <ReactCountryFlag
                        countryCode={item.country}
                        svg
                        style={{ width: "1.5em", height: "1.5em" }}
                      />
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </nav>
      </header>

      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <main className="flex-1 relative flex flex-col items-center justify-center text-center px-4 pt-8 pb-24 min-h-[80vh]">
        {/* Background SVG image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/img-hero-background.svg"
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
        />
        <OrbitRings />
        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          <h1 className="text-7xl md:text-7xl font-black text-gray-900 leading-tight tracking-tight">
            {tx.hero.h1[0]}
            <br />
            {tx.hero.h1[1]}
          </h1>
          <p className="text-base md:text-lg text-gray-500 max-w-xl mx-auto leading-relaxed">
            {tx.hero.sub}
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <Link
              href="/auth/login"
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors"
            >
              {tx.hero.demo}
            </Link>
            <Link
              href="/auth/login"
              className="border border-gray-300 hover:border-gray-400 text-gray-700 text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors bg-white/60 backdrop-blur-sm"
            >
              {tx.hero.deploy}
            </Link>
          </div>
        </div>
      </main>

      {/* ── Marquee ────────────────────────────────────────────────────── */}
      <div className="overflow-hidden border-t border-gray-200/60 bg-white/40 backdrop-blur-sm py-5">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <div key={i} className="flex items-center gap-8 px-8 shrink-0">
              <span className="text-sm font-medium tracking-[0.22em] text-gray-600 uppercase italic">
                {item}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400/80 shrink-0" />
            </div>
          ))}
        </div>
      </div>

      {/* ── Plan Smarter Section ───────────────────────────────────────── */}
      <section className="relative bg-white py-20 px-4 overflow-hidden">
        <img
          src="/img-plan-smarter-execute-better-background.svg"
          alt=""
          aria-hidden
          className="
      absolute inset-0
      w-full h-full
      object-cover
      opacity-40
      pointer-events-none
      select-none
    "
          style={{
            maskImage:
              "linear-gradient(to bottom, black 0%, black 50%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, black 0%, black 50%, transparent 100%)",
          }}
        />

        <div className="max-w-5xl mx-auto">
          {/* Heading */}
          <FadeInSection className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-normal text-gray-900 leading-tight mb-4">
              {tx.planSmarter.h2a}{" "}
              <span className="text-blue-600">{tx.planSmarter.h2b}</span>
            </h2>
            <p className="text-base text-gray-500 max-w-2xl mx-auto leading-relaxed">
              {tx.planSmarter.sub}
            </p>
          </FadeInSection>

          {/* Feature cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
            {tx.planSmarter.features.map((feat, i) => (
              <FadeInSection key={i} className={`delay-[${i * 100}ms]`}>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shrink-0">
                    {
                      [
                        <svg
                          key="0"
                          className="w-5 h-5 text-white"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                        </svg>,
                        <svg
                          key="1"
                          className="w-5 h-5 text-white"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <rect x="3" y="3" width="7" height="7" rx="1" />
                          <rect x="14" y="3" width="7" height="7" rx="1" />
                          <rect x="3" y="14" width="7" height="7" rx="1" />
                          <rect x="14" y="14" width="7" height="7" rx="1" />
                        </svg>,
                        <svg
                          key="2"
                          className="w-5 h-5 text-white"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>,
                      ][i]
                    }
                  </div>
                  <div>
                    <p className="text-sm font-bold text-blue-600 mb-1">
                      {feat.title}
                    </p>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>
                </div>
              </FadeInSection>
            ))}
          </div>

          {/* App screenshot mockup */}
          <FadeInSection>
            <div className="relative">
              <img
                src="/img-plan-smarter-execute-better.svg"
                alt="Plan Smarter Executer"
                className="w-full h-full object-cover"
                style={{
                  maskImage:
                    "linear-gradient(to bottom, black 0%, black 55%, transparent 100%)",
                  WebkitMaskImage:
                    "linear-gradient(to bottom, black 0%, black 55%, transparent 100%)",
                }}
              />

              {/* Decorative icon — left bottom, grouped with screenshot */}
              <img
                src="/img-plan-smarter-execute-better-icon-left.svg"
                alt=""
                aria-hidden
                className="absolute bottom-[30%] -left-10 w-[8%] min-w-[60px] pointer-events-none select-none -rotate-12"
              />

              {/* Decorative icon — right top, grouped with screenshot */}
              <img
                src="/img-plan-smarter-execute-better-icon-right.svg"
                alt=""
                aria-hidden
                className="absolute top-[14%] -right-8 w-[8%] min-w-[60px] pointer-events-none select-none rotate-12"
              />
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* ── Built with Japanese Precision Section ──────────────────────── */}
      <section className="relative bg-white py-24 px-4 overflow-hidden">
        {/* Background */}
        <img
          src="/img-built-with-japanese-background.svg"
          alt=""
          aria-hidden
          className="
    absolute
    top-1/2 left-1/2
    -translate-x-1/2 -translate-y-1/2
    w-[900px]
    opacity-40
    pointer-events-none
    select-none
  "
        />

        <div className="relative max-w-7xl mx-auto">
          <FadeInSection>
            {/* TITLE OVERLAY */}
            <div className="relative z-20 mb-[-80px] md:mb-[-120px]">
              <h2 className="max-w-4xl text-5xl md:text-7xl font-normal leading-[0.95] tracking-tight text-gray-900">
                {tx.japanese.h2}
              </h2>
            </div>

            {/* CONTENT AREA */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              {/* LEFT COLUMN */}
              <div className="flex flex-col gap-8 pt-28 md:pt-40">
                {/* DESCRIPTION */}
                {/* <div className="max-w-md"> */}
                <p className="font-normal text-gray-500 leading-relaxed">
                  {tx.japanese.sub}
                </p>
                {/* </div> */}

                {/* LEFT IMAGE */}
                <div className="relative rounded-[32px] overflow-hidden h-[420px] md:h-[520px]">
                  {/* Decoration */}
                  <div className="absolute -top-20 right-0 w-72 h-72 bg-pink-200/40 rounded-full blur-3xl z-10" />

                  <img
                    src="/img-built-with-japanese-right.svg"
                    alt="Japanese marketing team collaborating"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* RIGHT COLUMN */}
              <div className="relative pt-10">
                <div className="relative rounded-[32px] overflow-hidden h-[560px] md:h-[760px]">
                  <img
                    src="/img-built-with-japanese-right-1.svg"
                    alt="Mount Fuji with pagoda"
                    className="w-full h-full object-cover"
                  />

                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
              </div>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* ── Exclusive Services Section ─────────────────────────────────── */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <FadeInSection>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
              <h2 className="text-4xl md:text-5xl font-normal text-gray-900 leading-tight">
                {tx.services.h2a}
                <br />
                <span className="text-blue-600">{tx.services.h2b}</span>
              </h2>
              <button className="self-start md:self-auto flex items-center gap-2 border border-blue-600 text-blue-600 hover:bg-blue-50 text-sm font-semibold px-5 py-2.5 rounded-full transition-colors shrink-0">
                {tx.services.viewAll}
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </FadeInSection>

          <ServiceCards cards={tx.services.cards} />
        </div>
      </section>

      {/* ── Evidence Over Vibes Section ────────────────────────────────── */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-5xl mx-auto space-y-12">
          {/* Stats block */}
          <FadeInSection>
            <h2 className="text-3xl md:text-4xl font-normal text-gray-900 mb-2">
              {tx.evidence.h2}
            </h2>
            <p className="text-base text-gray-500 mb-8">{tx.evidence.sub}</p>
            <div className="flex flex-wrap gap-10">
              {tx.evidence.stats.map((stat) => (
                <div key={stat.label} className="flex items-baseline gap-3">
                  <span className="text-3xl md:text-4xl font-black text-gray-900 italic">
                    {stat.value}
                  </span>
                  <span className="text-sm text-gray-500">{stat.label}</span>
                </div>
              ))}
            </div>
          </FadeInSection>

          {/* Opinions card */}
          <FadeInSection>
            <div className="bg-[#f0f4ff] rounded-2xl p-8 md:p-10">
              <h3 className="text-2xl md:text-3xl font-normal text-gray-900 mb-2">
                {tx.evidence.opinionsH}
              </h3>
              <p className="text-sm text-gray-500 mb-8 leading-relaxed">
                {tx.evidence.opinionsSub}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {tx.evidence.opinions.map((item) => (
                  <div key={item.num} className="flex flex-col gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-700 flex items-center justify-center shrink-0">
                      <span className="text-sm font-bold text-white">
                        {item.num}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-blue-700 mb-1">
                        {item.title}
                      </p>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* ── Shipped In Production Section ──────────────────────────────── */}
      <section className="relative bg-white py-20 px-4 overflow-hidden">
        {/* Background SVG */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/img-shipped-in-production-background.svg"
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none opacity-60"
        />
        <div className="relative z-10 max-w-5xl mx-auto">
          <FadeInSection className="mb-10">
            <h2 className="text-3xl md:text-4xl font-normal text-gray-900 mb-3">
              {tx.shipped.h2}.
            </h2>
            <p className="text-base text-gray-500">{tx.shipped.sub}</p>
          </FadeInSection>

          {/* Grid background lines */}
          <div className="relative">
            {/* Subtle grid */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(59,130,246,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.06) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />

            <div className="relative grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  tag: tx.shipped.cards[0].tag,
                  title: tx.shipped.cards[0].title,
                  desc: tx.shipped.cards[0].desc,
                  icon: (
                    <svg
                      className="w-5 h-5 text-white"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <circle cx="12" cy="12" r="3" />
                      <circle cx="12" cy="12" r="7" />
                      <circle cx="12" cy="12" r="11" />
                      <line x1="12" y1="1" x2="12" y2="4" />
                      <line x1="12" y1="20" x2="12" y2="23" />
                      <line x1="1" y1="12" x2="4" y2="12" />
                      <line x1="20" y1="12" x2="23" y2="12" />
                    </svg>
                  ),
                },
                {
                  tag: tx.shipped.cards[1].tag,
                  title: tx.shipped.cards[1].title,
                  desc: tx.shipped.cards[1].desc,
                  icon: (
                    <svg
                      className="w-5 h-5 text-white"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                      <line x1="12" y1="22.08" x2="12" y2="12" />
                    </svg>
                  ),
                },
                {
                  tag: tx.shipped.cards[2].tag,
                  title: tx.shipped.cards[2].title,
                  desc: tx.shipped.cards[2].desc,
                  icon: (
                    <svg
                      className="w-5 h-5 text-white"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <polygon points="12 2 2 7 12 12 22 7 12 2" />
                      <polyline points="2 17 12 22 22 17" />
                      <polyline points="2 12 12 17 22 12" />
                    </svg>
                  ),
                },
                {
                  tag: tx.shipped.cards[3].tag,
                  title: tx.shipped.cards[3].title,
                  desc: tx.shipped.cards[3].desc,
                  icon: (
                    <svg
                      className="w-5 h-5 text-white"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                    </svg>
                  ),
                },
              ].map((card, i) => (
                <FadeInSection key={i}>
                  <div
                    className="group relative rounded-2xl p-7 flex flex-col gap-5 h-full cursor-default overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-900/30"
                    style={{ backgroundColor: "#3B5BDB" }}
                  >
                    {/* Dot pattern — hidden by default, appears on hover */}
                    <div
                      className="absolute inset-0 pointer-events-none transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                      style={{
                        backgroundImage:
                          "radial-gradient(circle, rgba(255,255,255,0.35) 1.5px, transparent 1.5px)",
                        backgroundSize: "18px 18px",
                        backgroundPosition: "right top",
                        maskImage:
                          "linear-gradient(to left, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 75%)",
                        WebkitMaskImage:
                          "linear-gradient(to left, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 75%)",
                      }}
                    />

                    {/* Tag row */}
                    <div className="relative z-10 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
                        {card.icon}
                      </div>
                      <span className="text-xs font-bold tracking-widest text-blue-200 uppercase">
                        {card.tag}
                      </span>
                    </div>
                    {/* Content */}
                    <div className="relative z-10">
                      <h3 className="text-xl font-bold text-white mb-2">
                        {card.title}
                      </h3>
                      <p className="text-sm text-blue-100 leading-relaxed">
                        {card.desc}
                      </p>
                    </div>
                  </div>
                </FadeInSection>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Plan Campaigns Section ─────────────────────────────────────── */}
      <section className="bg-[#f8faff] py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <FadeInSection className="mb-12">
            <h2 className="text-3xl md:text-4xl font-normal text-gray-900 mb-3">
              {tx.planCampaigns.h2}
            </h2>
            <p className="text-3xl text-base text-gray-500  leading-relaxed">
              {tx.planCampaigns.sub}
            </p>
          </FadeInSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1 — Strategy Planner */}
            <FadeInSection>
              <div className="relative bg-white rounded-2xl border border-gray-200 p-6 flex flex-col gap-4 h-full overflow-hidden">
                {/* Grid background */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(59,130,246,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.07) 1px, transparent 1px)",
                    backgroundSize: "32px 32px",
                  }}
                />
                {/* Fade-out gradient at bottom so grid doesn't clash with content */}
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none" />

                <div className="relative z-10">
                  <h3 className="text-2xl md:text-2xl font-normal text-gray-900 mb-2">
                    {tx.planCampaigns.card1.title}
                  </h3>
                  <p className="text-base text-gray-500 leading-relaxed">
                    {tx.planCampaigns.card1.desc}
                  </p>
                </div>
                {/* Video/GIF placeholder */}
                <div className="relative z-10 flex-1 rounded-xl overflow-hidden border border-gray-100 bg-gray-50 min-h-[280px] flex items-center justify-center">
                  <video
                    src="/video/strategy-planner.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover rounded-xl"
                    onError={(e) => {
                      (e.currentTarget as HTMLVideoElement).style.display =
                        "none";
                    }}
                  />
                </div>
              </div>
            </FadeInSection>

            {/* Card 2 — Create Campaign Brief */}
            <FadeInSection>
              <div className="relative bg-white rounded-2xl border border-gray-200 p-6 flex flex-col gap-4 h-full overflow-hidden">
                {/* Grid background */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(59,130,246,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.07) 1px, transparent 1px)",
                    backgroundSize: "32px 32px",
                  }}
                />
                {/* Fade-out gradient at bottom */}
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none" />

                <div className="relative z-10">
                  <h3 className="text-2xl md:text-2xl font-normal text-gray-900 mb-2">
                    {tx.planCampaigns.card2.title}
                  </h3>
                  <p className="text-base text-gray-500 leading-relaxed">
                    {tx.planCampaigns.card2.desc}
                  </p>
                </div>
                {/* Video/GIF placeholder */}
                <div className="relative z-10 flex-1 rounded-xl overflow-hidden border border-gray-100 bg-gray-50 min-h-[280px] flex items-center justify-center">
                  <video
                    src="/video/campaign-brief.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover rounded-xl"
                    onError={(e) => {
                      (e.currentTarget as HTMLVideoElement).style.display =
                        "none";
                    }}
                  />
                </div>
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* ── CTA Section ────────────────────────────────────────────────── */}
      <section className="bg-white py-10 px-4">
        <FadeInSection className="max-w-6xl mx-auto">
          <div
            className="
        relative
        rounded-[32px]
        overflow-hidden
        px-8 md:px-12
        py-12 md:py-16
        bg-[#2155F5]
      "
          >
            {/* BACKGROUND IMAGE */}
            <img
              src="/img-lets-unify-your-marketing-operations-background.svg"
              alt=""
              aria-hidden
              className="
          absolute inset-0
          w-full h-full
          object-cover
          opacity-70
          pointer-events-none
          select-none
        "
            />

            {/* Optional dark overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/40 to-blue-500/10" />

            {/* CONTENT */}
            <div className="relative z-10 max-w-3xl">
              <h2 className="text-4xl md:text-4xl font-light tracking-tight text-white leading-tight mb-5">
                {tx.cta.h2}
              </h2>

              <p className="text-lg text-blue-100 leading-relaxed mb-8 max-w-2xl">
                {tx.cta.sub}
              </p>

              {/* FORM */}
              <div className="flex flex-col sm:flex-row gap-4 max-w-2xl">
                <input
                  type="email"
                  placeholder={tx.cta.placeholder}
                  className="
              h-14 flex-1
              px-5
              rounded-xl
              bg-white
              text-gray-900
              placeholder:text-gray-400
              focus:outline-none
              focus:ring-2
              focus:ring-white/40
            "
                />

                <button
                  className="
              h-14
              px-8
              rounded-xl
              bg-white
              text-blue-600
              font-semibold
              hover:bg-blue-50
              transition-colors
              shrink-0
            "
                >
                  {tx.cta.btn}
                </button>
              </div>
            </div>
          </div>
        </FadeInSection>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────── */}
      <footer className="bg-white border-t border-gray-100">
        {/* Top section */}
        <div className="max-w-6xl mx-auto px-6 py-14">
          {/* Brand */}
          <div className="mb-8 pb-8 border-b border-gray-100">
            <div className="text-4xl font-black text-blue-600 mb-3 tracking-tight">
              <img src="/logo.svg" />
            </div>
            <p className="text-sm text-gray-500 max-w-2xl leading-relaxed">
              {tx.footer.tagline}
            </p>
          </div>

          {/* Links grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Platform */}
            <div>
              <h4 className="text-sm font-bold text-gray-900 mb-4">
                {tx.footer.platform}
              </h4>
              <ul className="space-y-3 text-sm text-gray-500">
                {tx.footer.platformLinks.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="hover:text-gray-900 transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-sm font-bold text-gray-900 mb-4">
                {tx.footer.company}
              </h4>
              <ul className="space-y-3 text-sm text-gray-500">
                {tx.footer.companyLinks.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="hover:text-gray-900 transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-sm font-bold text-gray-900 mb-4">
                {tx.footer.contact}
              </h4>
              <ul className="space-y-3 text-sm text-gray-500">
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4 shrink-0" />
                  <a
                    href="mailto:hello@altimeda.ai"
                    className="hover:text-gray-900 transition-colors"
                  >
                    hello@altimeda.ai
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 shrink-0" />
                  <span>Altimeda Cipta Visitama</span>
                </li>
                <li className="flex items-center gap-2">
                  <FaXTwitter className="w-4 h-4 shrink-0" />
                  <a href="#" className="hover:text-gray-900 transition-colors">
                    @Altimeda Cipta Visitama
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4 shrink-0" />
                  <span>08134587231</span>
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 shrink-0" />
                  <span>Tokyo, Japan</span>
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="text-sm font-bold text-gray-900 mb-2">
                {tx.footer.newsletter}
              </h4>
              <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                {tx.footer.newsletterSub}
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email here"
                  className="flex-1 h-9 px-3 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button className="h-9 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors shrink-0">
                  {tx.footer.subscribe}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-100">
          <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-gray-500">
              Copyright © 2026 AIMOS | All Rights Reserved
            </p>
            <div className="flex items-center gap-4">
              {[
                { icon: FaFacebook, href: "#" },
                { icon: FaXTwitter, href: "#" },
                { icon: FaInstagram, href: "#" },
                { icon: FaLinkedin, href: "#" },
                { icon: FaYoutube, href: "#" },
              ].map(({ icon: Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  className="text-gray-400 hover:text-gray-700 transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee { animation: marquee 30s linear infinite; }
      `}</style>
    </div>
  );
}
