"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Mail,
  Building2,
  Twitter,
  Phone,
  MapPin,
  Facebook,
  Youtube,
  Linkedin,
  Instagram,
} from "lucide-react";

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
    nav: { home: "Home", about: "About Us", services: "Services", portfolio: "Portfolio", pricing: "Pricing", cta: "Let's Talk" },
    hero: {
      h1: ["Marketing Operations", "That Actually Align"],
      sub: "Atlas helps teams unify marketing data, automate decisions, and improve campaign performance across channels.",
      demo: "Book a Demo", deploy: "See Deployment",
    },
    planSmarter: {
      h2a: "Plan Smarter.", h2b: "Execute Better.",
      sub: "From strategy planning to campaign briefs, AIMOS helps marketing teams turn ideas into actionable campaigns with AI-powered recommendations and structured workflows.",
      features: [
        { title: "AI-Powered Recommendations", desc: "Get smart strategy and brief suggestions based on your goals, audience and historical performance." },
        { title: "Structured & Consistent",     desc: "Use standardized frameworks to ensure every strategy and brief is clear, complete, and on-brand." },
        { title: "Collaborative & Aligned",     desc: "Keep your team aligned with real-time collaboration, feedback, and centralized campaign information." },
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
        { value: "12 d",   label: "Median Time-To-Value" },
      ],
      opinionsH: "Opinions we're willing to deploy",
      opinionsSub: "Three principles from eight years shipping AI in production. They're why customers re-sign at 96%.",
      opinions: [
        { num: "1", title: "Unify fragmented operations",  desc: "CRM, ad platforms, ERP, finance — built independently, now speaking one language. AIMOS consolidates without forklift upgrades." },
        { num: "2", title: "Evidence Over Dashboard",      desc: "We refuse to show projections. Every number is from a live production deployment. Ask and we'll show you the audit trail." },
        { num: "3", title: "Operators OverAlgorithms",     desc: "If the recommendation can't be acted on in under 10 seconds by a non-technical marketer, we didn't ship it." },
      ],
    },
    shipped: {
      h2: "Shipped. In production.",
      sub: "Deployments across retail, consumer goods, ecommerce and QSR verticals in Japan.",
      cards: [
        { tag: "STRATEGY & INVESTMENT",    title: "CRM Agent",        desc: "Identify high-potential segments and shift budget to the right channels for stronger returns." },
        { tag: "PROMOTION",                title: "Marketing Agent",  desc: "Align promotions with inventory in real time to maximize sell-through and reduce waste." },
        { tag: "CHANNEL MANAGEMENT",       title: "Finance Agent",    desc: "Dynamically rebalance channels based on performance to capture every growth opportunity." },
        { tag: "PERFORMANCE & OPTIMIZATION", title: "Inventory Agent", desc: "Monitor results in real time and continuously learn to improve future campaigns." },
      ],
    },
    planCampaigns: {
      h2: "Plan Campaigns Your Way",
      sub: "Plan smarter campaigns with AI-powered recommendations and structured workflows built for modern marketing teams.",
      card1: { title: "Strategy Planner",      desc: "Create smarter marketing strategies with AI-powered recommendations tailored to your goals, audience, budget, and campaign objectives." },
      card2: { title: "Create Campaign Brief", desc: "Create structured campaign briefs with AI-powered recommendations or manual workflows tailored to your campaign goals and requirements." },
    },
    cta: {
      h2: "Let's Unify Your  Marketing Operations",
      sub: "Talk to an engineer. We'll share a case study from your vertical before the first call.",
      btn: "Request Brief", placeholder: "Enter your email here",
    },
    footer: {
      tagline: "Altimeda's AI Marketing Operating System for Japan.  Built by ex-CMOs and ops leaders. Headquartered Tokyo and Berlin.",
      platform: "Platform", company: "Company", contact: "Contact", newsletter: "Subscribe to our newsletter",
      newsletterSub: "Receive curated updates, strategy insights, and product news directly from our team.",
      subscribe: "Subscribe", emailPlaceholder: "Enter your email here",
      copyright: "Copyright © 2026 AIMOS | All Rights Reserved",
      platformLinks: ["CRM Intelligence", "Marketing Intelligence", "Finance Intelligence", "Inventory Intelligence"],
      companyLinks: ["Deployment", "Customers", "Research", "Careers", "Press"],
    },
  },
  ja: {
    nav: { home: "ホーム", about: "会社概要", services: "サービス", portfolio: "実績", pricing: "料金", cta: "お問い合わせ" },
    hero: {
      h1: ["マーケティング業務を", "一元化する"],
      sub: "Atlasはチームがマーケティングデータを統合し、意思決定を自動化し、チャネル全体のキャンペーンパフォーマンスを向上させるお手伝いをします。",
      demo: "デモを予約", deploy: "導入事例を見る",
    },
    planSmarter: {
      h2a: "賢く計画。", h2b: "より良く実行。",
      sub: "戦略立案からキャンペーンブリーフまで、AIMOSはマーケティングチームがAIを活用した推奨事項と構造化されたワークフローでアイデアを実行可能なキャンペーンに変えるお手伝いをします。",
      features: [
        { title: "AIによる推奨",       desc: "目標、オーディエンス、過去の実績に基づいたスマートな戦略とブリーフの提案を取得します。" },
        { title: "構造化された一貫性", desc: "標準化されたフレームワークを使用して、すべての戦略とブリーフが明確で完全かつブランドに沿ったものになるようにします。" },
        { title: "協調的な連携",       desc: "リアルタイムのコラボレーション、フィードバック、一元化されたキャンペーン情報でチームの連携を維持します。" },
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
        { value: "12 日",   label: "価値実現までの中央値" },
      ],
      opinionsH: "私たちが自信を持って展開する考え方",
      opinionsSub: "AIを本番環境で8年間提供してきた3つの原則。顧客の96%が再契約する理由です。",
      opinions: [
        { num: "1", title: "分断された業務を統合",     desc: "CRM、広告プラットフォーム、ERP、財務 — 独立して構築され、今や一つの言語で話しています。AIMOSは大規模な移行なしに統合します。" },
        { num: "2", title: "ダッシュボードより証拠",   desc: "予測は表示しません。すべての数字は本番導入からのものです。監査証跡をお見せします。" },
        { num: "3", title: "アルゴリズムより運用者",   desc: "非技術系マーケターが10秒以内に実行できない推奨事項は、私たちは出荷しません。" },
      ],
    },
    shipped: {
      h2: "本番環境で稼働中。",
      sub: "日本の小売、消費財、eコマース、QSR業界への導入実績。",
      cards: [
        { tag: "戦略・投資",         title: "CRMエージェント",       desc: "高ポテンシャルセグメントを特定し、より強いリターンのために適切なチャネルに予算をシフトします。" },
        { tag: "プロモーション",     title: "マーケティングエージェント", desc: "在庫とプロモーションをリアルタイムで連携させ、売上を最大化し廃棄を削減します。" },
        { tag: "チャネル管理",       title: "ファイナンスエージェント",  desc: "パフォーマンスに基づいてチャネルを動的に再調整し、すべての成長機会を捉えます。" },
        { tag: "パフォーマンス最適化", title: "在庫エージェント",       desc: "リアルタイムで結果を監視し、将来のキャンペーンを改善するために継続的に学習します。" },
      ],
    },
    planCampaigns: {
      h2: "自分のやり方でキャンペーンを計画",
      sub: "現代のマーケティングチームのために構築されたAI搭載の推奨事項と構造化されたワークフローで、よりスマートなキャンペーンを計画します。",
      card1: { title: "戦略プランナー",         desc: "目標、オーディエンス、予算、キャンペーン目標に合わせたAI搭載の推奨事項でよりスマートなマーケティング戦略を作成します。" },
      card2: { title: "キャンペーンブリーフ作成", desc: "キャンペーンの目標と要件に合わせたAI搭載の推奨事項または手動ワークフローで構造化されたキャンペーンブリーフを作成します。" },
    },
    cta: {
      h2: "マーケティング業務を統合しましょう",
      sub: "エンジニアとお話しください。最初の通話前にあなたの業界のケーススタディをお伝えします。",
      btn: "ブリーフを依頼", placeholder: "メールアドレスを入力",
    },
    footer: {
      tagline: "AltimediaのAIマーケティングオペレーティングシステム（日本向け）。元CMOと運用リーダーが構築。東京とベルリンに本社。",
      platform: "プラットフォーム", company: "会社情報", contact: "お問い合わせ", newsletter: "ニュースレター登録",
      newsletterSub: "厳選されたアップデート、戦略インサイト、製品ニュースをチームから直接お届けします。",
      subscribe: "登録", emailPlaceholder: "メールアドレスを入力",
      copyright: "Copyright © 2026 AIMOS | All Rights Reserved",
      platformLinks: ["CRMインテリジェンス", "マーケティングインテリジェンス", "ファイナンスインテリジェンス", "在庫インテリジェンス"],
      companyLinks: ["導入事例", "顧客", "研究", "採用", "プレス"],
    },
  },
} as const;

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
      { ringIndex: 4, speed: 0.45, dotR: 5, color: "#3b82f6" },
      { ringIndex: 5, speed: -0.45, dotR: 6, color: "#8b5cf6" },
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

        const grad = ctx!.createRadialGradient(dx, dy, 0, dx, dy, dot.dotR * 4);
        grad.addColorStop(0, dot.color + "cc");
        grad.addColorStop(1, dot.color + "00");
        ctx!.beginPath();
        ctx!.arc(dx, dy, dot.dotR * 4, 0, Math.PI * 2);
        ctx!.fillStyle = grad;
        ctx!.fill();

        ctx!.beginPath();
        ctx!.arc(dx, dy, dot.dotR, 0, Math.PI * 2);
        ctx!.fillStyle = dot.color;
        ctx!.fill();
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
  const tx = t[lang];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#eef2f9] flex flex-col">
      {/* ── Sticky Navbar ──────────────────────────────────────────────── */}
      <header
        className={`sticky top-0 z-50 flex justify-center px-4 transition-all duration-200 ${scrolled ? "py-2 bg-[#eef2f9]/90 backdrop-blur-md shadow-sm" : "py-5 bg-transparent"}`}
      >
        <nav className="bg-white/90 backdrop-blur-md rounded-full px-6 py-2.5 flex items-center justify-between gap-6 shadow-sm border border-gray-200/60 w-full max-w-3xl">
          <span className="text-lg font-black tracking-tight text-gray-900">
            A<span className="text-blue-600">i</span>mos
          </span>
          <div className="hidden md:flex items-center gap-6 text-sm text-gray-600">
            <a href="#" className="font-semibold text-gray-900">{tx.nav.home}</a>
            <a href="#" className="hover:text-gray-900 transition-colors">{tx.nav.about}</a>
            <a href="#" className="hover:text-gray-900 transition-colors">{tx.nav.services}</a>
            <a href="#" className="hover:text-gray-900 transition-colors">{tx.nav.portfolio}</a>
            <a href="#" className="hover:text-gray-900 transition-colors">{tx.nav.pricing}</a>
          </div>
          <div className="flex items-center gap-2">
            {/* Language toggle */}
            <div className="flex items-center bg-gray-100 rounded-full p-0.5 text-xs font-semibold">
              <button
                onClick={() => setLang("en")}
                className={`px-3 py-1 rounded-full transition-all ${lang === "en" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
              >
                EN
              </button>
              <button
                onClick={() => setLang("ja")}
                className={`px-3 py-1 rounded-full transition-all ${lang === "ja" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
              >
                日本語
              </button>
            </div>
            <Link
              href="/auth/login"
              className="border border-blue-600 text-blue-600 hover:bg-blue-50 text-sm font-semibold px-5 py-1.5 rounded-full transition-colors"
            >
              {tx.nav.cta}
            </Link>
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
          <h1 className="text-5xl md:text-7xl font-black text-gray-900 leading-tight tracking-tight">
            {tx.hero.h1[0]}<br />{tx.hero.h1[1]}
          </h1>
          <p className="text-base md:text-lg text-gray-500 max-w-xl mx-auto leading-relaxed">
            {tx.hero.sub}
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <Link href="/auth/login" className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors">
              {tx.hero.demo}
            </Link>
            <Link href="/auth/login" className="border border-gray-300 hover:border-gray-400 text-gray-700 text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors bg-white/60 backdrop-blur-sm">
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
      <section className="bg-white py-20 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Heading */}
          <FadeInSection className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-4">
              {tx.planSmarter.h2a}{" "}<span className="text-blue-600">{tx.planSmarter.h2b}</span>
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
                    {[
                      <svg key="0" className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>,
                      <svg key="1" className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>,
                      <svg key="2" className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
                    ][i]}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-blue-600 mb-1">{feat.title}</p>
                    <p className="text-xs text-gray-500 leading-relaxed">{feat.desc}</p>
                  </div>
                </div>
              </FadeInSection>
            ))}
          </div>

          {/* App screenshot mockup */}
          <FadeInSection>
            <div className="rounded-2xl overflow-hidden border-4 border-blue-600 shadow-2xl bg-[#f8faff]">
              {/* Mock browser bar */}
              <div className="bg-blue-600 px-4 py-3 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-white/30" />
                  <span className="w-3 h-3 rounded-full bg-white/30" />
                  <span className="w-3 h-3 rounded-full bg-white/30" />
                </div>
                <span className="text-white text-xs font-medium ml-2">
                  Strategy Planner — AIMOS
                </span>
              </div>
              {/* Mock app content */}
              <div className="flex h-72">
                {/* Sidebar mock */}
                <div className="w-44 bg-white border-r border-gray-100 p-3 shrink-0">
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
                    <div className="w-6 h-6 bg-blue-600 rounded-md" />
                    <div>
                      <div className="text-xs font-bold text-gray-900">
                        ATLAS
                      </div>
                      <div className="text-[10px] text-gray-400">
                        Enterprise
                      </div>
                    </div>
                  </div>
                  <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-2">
                    Overview
                  </div>
                  <div className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-gray-50 mb-1">
                    <div className="w-3 h-3 bg-gray-300 rounded" />
                    <span className="text-xs text-gray-600">Dashboard</span>
                  </div>
                  <div className="text-[10px] text-gray-400 uppercase tracking-wider mt-3 mb-2">
                    CRM
                  </div>
                  {["Contacts", "Deals", "CRM"].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-2 px-2 py-1.5 mb-0.5"
                    >
                      <div className="w-3 h-3 bg-gray-200 rounded" />
                      <span className="text-xs text-gray-500">{item}</span>
                    </div>
                  ))}
                </div>
                {/* Main content mock */}
                <div className="flex-1 p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-6 bg-blue-100 rounded-md flex items-center justify-center">
                      <div className="w-3 h-3 bg-blue-600 rounded-sm" />
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      Strategy Planner
                    </span>
                  </div>
                  <div className="flex gap-2 mb-5">
                    <span className="text-xs border border-gray-200 rounded-full px-3 py-1 text-gray-600 flex items-center gap-1">
                      <div className="w-2 h-2 bg-blue-400 rounded-sm" />{" "}
                      Scenario Comparison
                    </span>
                    <span className="text-xs border border-gray-200 rounded-full px-3 py-1 text-gray-600 flex items-center gap-1">
                      <div className="w-2 h-2 bg-blue-400 rounded-sm" />{" "}
                      Campaign Strategies
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {["Conservative", "Base Case", "Aggressive"].map(
                      (label) => (
                        <div
                          key={label}
                          className="border border-gray-200 rounded-xl p-3 bg-white"
                        >
                          <p className="text-xs text-gray-400 mb-1">{label}</p>
                          <p className="text-xl font-bold text-gray-900">2</p>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              </div>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* ── Built with Japanese Precision Section ──────────────────────── */}
      <section className="bg-white py-20 px-4 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <FadeInSection>
            {/* Heading + description */}
            <div className="mb-10">
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-4">
                {tx.japanese.h2}
              </h2>
              <p className="text-base text-gray-500 max-w-md leading-relaxed">
                {tx.japanese.sub}
              </p>
            </div>

            {/* Two photos side by side */}
            <div className="grid grid-cols-2 gap-4 h-[420px] md:h-[500px]">
              {/* Left photo — team */}
              <div className="relative rounded-2xl overflow-hidden bg-gray-100">
                {/* Pink blob decoration */}
                <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-pink-200/50 rounded-full blur-2xl pointer-events-none" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/japan-team.jpg"
                  alt="Japanese marketing team collaborating"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = "none";
                  }}
                />
                {/* Fallback */}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-gray-300 bg-gray-50">
                  <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                  <span className="text-xs">Place image at /images/japan-team.jpg</span>
                </div>
              </div>

              {/* Right photo — Mt. Fuji / Japan */}
              <div className="relative rounded-2xl overflow-hidden bg-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/japan-fuji.jpg"
                  alt="Mount Fuji with pagoda"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = "none";
                  }}
                />
                {/* Fallback */}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-gray-300 bg-gray-50">
                  <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                  <span className="text-xs">Place image at /images/japan-fuji.jpg</span>
                </div>
                {/* Japanese text overlay */}
                <div className="absolute bottom-4 right-4 text-white text-right leading-tight">
                  <p className="text-2xl font-bold [writing-mode:vertical-rl] tracking-widest drop-shadow-lg">
                    {tx.japanese.kanji}
                  </p>
                </div>
              </div>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* ── Evidence Over Vibes Section ────────────────────────────────── */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-5xl mx-auto space-y-12">

          {/* Stats block */}
          <FadeInSection>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">
              {tx.evidence.h2}
            </h2>
            <p className="text-base text-gray-500 mb-8">
              {tx.evidence.sub}
            </p>
            <div className="flex flex-wrap gap-10">
              {tx.evidence.stats.map((stat) => (
                <div key={stat.label} className="flex items-baseline gap-3">
                  <span className="text-3xl md:text-4xl font-black text-gray-900 italic">{stat.value}</span>
                  <span className="text-sm text-gray-500">{stat.label}</span>
                </div>
              ))}
            </div>
          </FadeInSection>

          {/* Opinions card */}
          <FadeInSection>
            <div className="bg-[#f0f4ff] rounded-2xl p-8 md:p-10">
              <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-2">
                {tx.evidence.opinionsH}
              </h3>
              <p className="text-sm text-gray-500 mb-8 leading-relaxed">
                {tx.evidence.opinionsSub}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {tx.evidence.opinions.map((item) => (
                  <div key={item.num} className="flex flex-col gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-700 flex items-center justify-center shrink-0">
                      <span className="text-sm font-bold text-white">{item.num}</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-blue-700 mb-1">{item.title}</p>
                      <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
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
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">
              {tx.shipped.h2}.
            </h2>
            <p className="text-base text-gray-500">
                {tx.shipped.sub}
            </p>
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
                  <div className="bg-blue-600 hover:bg-blue-700 transition-colors rounded-2xl p-7 flex flex-col gap-5 h-full cursor-default">
                    {/* Tag row */}
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
                        {card.icon}
                      </div>
                      <span className="text-xs font-bold tracking-widest text-blue-200 uppercase">
                        {card.tag}
                      </span>
                    </div>
                    {/* Content */}
                    <div>
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
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">
              {tx.planCampaigns.h2}
            </h2>
            <p className="text-base text-gray-500 max-w-2xl leading-relaxed">
              {tx.planCampaigns.sub}
            </p>
          </FadeInSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1 — Strategy Planner */}
            <FadeInSection>
              <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col gap-4 h-full">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {tx.planCampaigns.card1.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {tx.planCampaigns.card1.desc}
                  </p>
                </div>
                {/* Video/GIF placeholder */}
                <div className="flex-1 rounded-xl overflow-hidden border border-gray-100 bg-gray-50 min-h-[280px] flex items-center justify-center relative">
                  {/* Replace src with actual gif/video path e.g. /videos/strategy-planner.gif */}
                  <video
                    src="/videos/strategy-planner.mp4"
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
                  {/* Fallback placeholder shown when video not found */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-gray-300">
                    <svg
                      className="w-10 h-10"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <rect x="2" y="3" width="20" height="14" rx="2" />
                      <path d="M8 21h8M12 17v4" />
                      <path d="M10 10l4-2-4-2v4z" fill="currentColor" />
                    </svg>
                    <span className="text-xs font-medium">
                      Strategy Planner Demo
                    </span>
                    <span className="text-[10px]">
                      Place video at /videos/strategy-planner.mp4
                    </span>
                  </div>
                </div>
              </div>
            </FadeInSection>

            {/* Card 2 — Create Campaign Brief */}
            <FadeInSection>
              <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col gap-4 h-full">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {tx.planCampaigns.card2.title}
                    
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {tx.planCampaigns.card2.desc}

                  </p>
                </div>
                {/* Video/GIF placeholder */}
                <div className="flex-1 rounded-xl overflow-hidden border border-gray-100 bg-gray-50 min-h-[280px] flex items-center justify-center relative">
                  {/* Replace src with actual gif/video path e.g. /videos/campaign-brief.gif */}
                  <video
                    src="/videos/campaign-brief.mp4"
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
                  {/* Fallback placeholder */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-gray-300">
                    <svg
                      className="w-10 h-10"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <rect x="2" y="3" width="20" height="14" rx="2" />
                      <path d="M8 21h8M12 17v4" />
                      <path d="M10 10l4-2-4-2v4z" fill="currentColor" />
                    </svg>
                    <span className="text-xs font-medium">
                      Campaign Brief Demo
                    </span>
                    <span className="text-[10px]">
                      Place video at /videos/campaign-brief.mp4
                    </span>
                  </div>
                </div>
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* ── CTA Section ────────────────────────────────────────────────── */}
      <section className="bg-white py-10 px-4">
        <FadeInSection className="max-w-5xl mx-auto">
          <div className="relative bg-blue-600 rounded-2xl px-10 py-12 overflow-hidden">
            {/* Wireframe mesh SVG background */}
            <div className="absolute right-0 top-0 h-full w-1/2 pointer-events-none opacity-30">
              <svg
                viewBox="0 0 400 300"
                className="w-full h-full"
                preserveAspectRatio="xMidYMid slice"
              >
                {/* Perspective grid lines — horizontal */}
                {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <line
                    key={`h${i}`}
                    x1={100 + i * 30}
                    y1={0}
                    x2={0 + i * 20}
                    y2={300}
                    stroke="white"
                    strokeWidth="0.6"
                  />
                ))}
                {/* Perspective grid lines — vertical */}
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                  <line
                    key={`v${i}`}
                    x1={0}
                    y1={i * 30}
                    x2={400}
                    y2={i * 28 + 10}
                    stroke="white"
                    strokeWidth="0.6"
                  />
                ))}
                {/* Extra diagonal lines for depth */}
                {[0, 1, 2, 3, 4].map((i) => (
                  <line
                    key={`d${i}`}
                    x1={200 + i * 50}
                    y1={0}
                    x2={400}
                    y2={100 + i * 40}
                    stroke="white"
                    strokeWidth="0.4"
                  />
                ))}
              </svg>
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-xl">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 leading-snug">
                {tx.cta.h2}
              </h2>
              <p className="text-sm text-blue-100 mb-6 leading-relaxed">
                {tx.cta.sub}
              </p>
              <div className="flex gap-3">
                <input
                  type="email"
                  placeholder={tx.cta.placeholder}
                  className="h-10 px-4 text-sm rounded-lg bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 w-64"
                />
                <button className="h-10 px-5 bg-blue-500 hover:bg-blue-400 border border-white/30 text-white text-sm font-semibold rounded-lg transition-colors shrink-0">
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
              A
              <span className="relative">
                i
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-blue-600 rounded" />
              </span>
              mos
            </div>
            <p className="text-sm text-gray-500 max-w-2xl leading-relaxed">
              {tx.footer.tagline}
            </p>
          </div>

          {/* Links grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Platform */}
            <div>
              <h4 className="text-sm font-bold text-gray-900 mb-4">{tx.footer.platform}</h4>
              <ul className="space-y-3 text-sm text-gray-500">
                {tx.footer.platformLinks.map((item) => (
                  <li key={item}><a href="#" className="hover:text-gray-900 transition-colors">{item}</a></li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-sm font-bold text-gray-900 mb-4">{tx.footer.company}</h4>
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
              <h4 className="text-sm font-bold text-gray-900 mb-4">{tx.footer.contact}</h4>
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
                  <Twitter className="w-4 h-4 shrink-0" />
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
                { icon: Facebook, href: "#" },
                { icon: Twitter, href: "#" },
                { icon: Instagram, href: "#" },
                { icon: Linkedin, href: "#" },
                { icon: Youtube, href: "#" },
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
