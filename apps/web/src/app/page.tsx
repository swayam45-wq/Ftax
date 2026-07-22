'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useScroll, useTransform, useInView } from 'framer-motion';
import {
  Shield, Calculator, FileText, Globe,
  Menu, X, ChevronDown, ArrowRight,
  CheckCircle2, Lock, Sparkles, Zap, Star
} from 'lucide-react';
import { grad } from '@/lib/api';

/* ═══════════════════════════════════════════════
   DESIGN TOKENS — Electric Indigo × Amber theme
═══════════════════════════════════════════════ */
const T = {
  bg:      '#060B14',
  surface: '#0A1020',
  card:    'rgba(15,23,42,0.85)',
  indigo:  '#6366F1',
  violet:  '#8B5CF6',
  amber:   '#F59E0B',
  cyan:    '#06B6D4',
  text:    '#F8FAFC',
  muted:   '#94A3B8',
  dim:     'rgba(148,163,184,0.45)',
  border:  'rgba(99,102,241,0.20)',
  borderB: 'rgba(255,255,255,0.06)',
} as const;

const gradIndigo  = 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)';
const gradAmber   = 'linear-gradient(135deg, #F59E0B 0%, #F97316 100%)';
const gradFull    = 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #06B6D4 100%)';
const glowIndigo  = '0 0 40px rgba(99,102,241,0.35), 0 0 80px rgba(99,102,241,0.15)';
const glowAmber   = '0 0 30px rgba(245,158,11,0.40)';

/* ═══════════════════════════════════════════════
   TINY HELPERS
═══════════════════════════════════════════════ */
function Logo() {
  return (
    <svg width="30" height="30" viewBox="0 0 256 256" fill="url(#logoGrad)">
      <defs>
        <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366F1"/>
          <stop offset="100%" stopColor="#8B5CF6"/>
        </linearGradient>
      </defs>
      <path d="M 64 128 L 64.5 128 L 32 95 L 0 64 L 0 0 L 64 0 L 128 64 L 128 64.5 L 161 32 L 192 0 L 256 0 L 256 64 L 192 128 L 128 128 L 128 192 L 96 223 L 63.5 256 L 0 256 L 0 192 Z M 256 192 L 224 223 L 191.5 256 L 128 256 L 128 192 L 192 128 L 256 128 Z" />
    </svg>
  );
}

/* Framer Motion fade-up when in view */
function Reveal({ children, delay = 0, className = '', style }: { children: React.ReactNode; delay?: number; className?: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.72, delay, ease: [0.21, 1.02, 0.43, 1.01] }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

/* Marquee ticker */
const TICKER = ['Form 8843', 'Form 1040-NR', 'Treaty Benefits', 'FICA Refunds', 'Residency Test', 'F-1 Visa Taxes', 'Illinois IL-1040', 'SSN / ITIN Guide'];
function Marquee() {
  return (
    <div style={{ overflow: 'hidden', borderTop: `1px solid ${T.borderB}`, borderBottom: `1px solid ${T.borderB}`, padding: '14px 0', background: 'rgba(6,11,20,0.60)', backdropFilter: 'blur(10px)' }}>
      <motion.div
        style={{ display: 'flex', gap: 52, whiteSpace: 'nowrap' }}
        animate={{ x: ['0%', '-50%'] }}
        transition={{ repeat: Infinity, duration: 22, ease: 'linear' }}
      >
        {[...TICKER, ...TICKER].map((t, i) => (
          <span key={i} style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.10em', color: i % 2 === 0 ? T.indigo : T.muted, textTransform: 'uppercase' }}>
            {t} <span style={{ color: T.borderB, margin: '0 8px' }}>·</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* Counter badge */
function Stat({ number, label }: { number: string; label: string }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <p style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 900, letterSpacing: '-0.05em', background: gradFull, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{number}</p>
      <p style={{ fontSize: 12, color: T.muted, fontWeight: 600, letterSpacing: '0.04em', marginTop: 4 }}>{label}</p>
    </div>
  );
}

/* FAQ Item */
const FAQS = [
  { q: 'Do I need to file taxes as an F-1 student?', a: 'Yes — even with zero income. All F-1 students physically present in the U.S. during the tax year must file Form 8843. If you earned U.S.-source income, you must also file Form 1040-NR.' },
  { q: 'What is Form 8843?', a: 'A statement declaring you as an "exempt individual" under IRS rules — not exempt from taxes, but exempt from counting days toward the Substantial Presence Test. Required for every F-1 student regardless of income.' },
  { q: 'How do tax treaties work for Indian/Chinese students?', a: 'Indian students may claim a standard deduction equivalent under Article 21(2). Chinese students can exempt up to $5,000 in wages annually under Article 20. FTax auto-detects your treaty eligibility.' },
  { q: 'Is my data secure on FTax?', a: 'Yes. SSN/ITIN digits are encrypted on-device with AES-256-GCM before any storage. We use short-lived JWT sessions and never share your data with third parties.' }
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      onClick={() => setOpen(!open)}
      layout
      style={{
        background: open ? 'rgba(99,102,241,0.10)' : 'rgba(15,23,42,0.70)',
        border: `1px solid ${open ? 'rgba(99,102,241,0.40)' : T.border}`,
        borderRadius: 18,
        cursor: 'pointer',
        overflow: 'hidden',
        backdropFilter: 'blur(16px)',
        transition: 'all .22s',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '22px 26px' }}>
        <span style={{ fontWeight: 700, fontSize: 15, color: T.text, maxWidth: '88%' }}>{q}</span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          style={{ width: 30, height: 30, borderRadius: '50%', background: open ? gradIndigo : 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
        >
          <ChevronDown size={14} color="#fff"/>
        </motion.div>
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            <p style={{ padding: '0 26px 24px', color: T.muted, fontSize: 14, lineHeight: 1.8 }}>{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════ */
export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll({ container: containerRef });
  // Parallax video scale: 1.0 → 1.12 as you scroll down
  const videoScale   = useTransform(scrollY, [0, 600], [1, 1.12]);
  const heroOpacity  = useTransform(scrollY, [0, 400], [1, 0]);

  const navLinks = [
    { label: 'How It Works', href: '#workflow' },
    { label: 'Security',     href: '#security' },
    { label: 'FAQ',          href: '#faq' }
  ];

  /* Scroll-snap helper */
  const sectionStyle: React.CSSProperties = {
    height: '100dvh',
    scrollSnapAlign: 'start',
    scrollSnapStop: 'always',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  };

  return (
    <div
      ref={containerRef}
      style={{
        fontFamily: "'Inter', system-ui, sans-serif",
        color: T.text,
        background: T.bg,
        height: '100dvh',
        overflowY: 'scroll',
        overflowX: 'hidden',
        scrollSnapType: 'y mandatory',
        scrollBehavior: 'smooth',
      }}
    >
      {/* ══════════════════════════════════════
          SECTION 1 — VIDEO HERO
      ══════════════════════════════════════ */}
      <section ref={heroRef} style={{ ...sectionStyle, scrollSnapStop: 'always' }}>
        {/* Video with parallax */}
        <motion.video
          autoPlay muted loop playsInline
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'cover', zIndex: 0,
            scale: videoScale,
          }}
        >
          <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260606_131516_eca35265-ea66-4fbd-8d52-22aae6e1a503.mp4" type="video/mp4" />
        </motion.video>

        {/* Multi-layer overlay: dark top + brand-tinted bottom dissolve */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'linear-gradient(180deg, rgba(6,11,20,0.55) 0%, rgba(6,11,20,0.25) 45%, rgba(6,11,20,0.70) 80%, #060B14 100%)' }} />
        {/* Subtle indigo tint for brand color bleed */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'radial-gradient(ellipse at 60% 70%, rgba(99,102,241,0.12) 0%, transparent 65%)' }} />

        {/* Navbar */}
        <header style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 30, padding: '20px 0' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
              <Logo />
              <span style={{ fontWeight: 800, fontSize: 20, color: T.text, letterSpacing: '-0.04em' }}>FTax</span>
            </Link>

            <nav className="hidden md:flex" style={{ gap: 36, alignItems: 'center' }}>
              {navLinks.map(link => (
                <a key={link.label} href={link.href} style={{ color: 'rgba(248,250,252,0.65)', fontSize: 14, fontWeight: 500, textDecoration: 'none', transition: 'color .18s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = T.text)}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(248,250,252,0.65)')}
                >{link.label}</a>
              ))}
            </nav>

            <div className="hidden md:flex" style={{ gap: 10, alignItems: 'center' }}>
              <Link href="/login" style={{ fontSize: 13, fontWeight: 600, padding: '9px 20px', borderRadius: 99, color: T.text, border: '1px solid rgba(255,255,255,0.14)', textDecoration: 'none', background: 'rgba(255,255,255,0.04)', transition: 'all .18s' }}>
                Sign In
              </Link>
              <Link href="/register" style={{ fontSize: 13, fontWeight: 700, padding: '9px 20px', borderRadius: 99, color: '#fff', textDecoration: 'none', background: gradIndigo, boxShadow: glowIndigo, transition: 'all .18s' }}>
                Start Free
              </Link>
            </div>

            <button className="md:hidden" onClick={() => setMobileMenuOpen(true)} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, padding: 8, color: T.text, cursor: 'pointer' }}>
              <Menu size={20}/>
            </button>
          </div>
        </header>

        {/* Hero Content */}
        <motion.div
          style={{ opacity: heroOpacity, zIndex: 10, textAlign: 'center', padding: '0 24px', maxWidth: 800, margin: '0 auto' }}
        >
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.7 }} style={{ marginBottom: 22 }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', padding: '7px 18px', borderRadius: 99, background: 'rgba(99,102,241,0.20)', border: '1px solid rgba(99,102,241,0.45)', color: '#818CF8', boxShadow: '0 0 24px rgba(99,102,241,0.25)' }}>
              UIC F-1 TAX ASSISTANT · 2025
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: [0.21,1.02,0.43,1.01] }}
            style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.4rem, 6vw, 4.2rem)', fontWeight: 900, lineHeight: 1.04, letterSpacing: '-0.035em', color: '#fff', textShadow: '0 4px 32px rgba(0,0,0,0.65)', marginBottom: 24 }}
          >
            File Your F-1 Student<br/>
            <span style={{ background: gradFull, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Taxes with Confidence
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.7 }}
            style={{ fontSize: 'clamp(1rem, 2.5vw, 1.15rem)', lineHeight: 1.75, color: 'rgba(248,250,252,0.85)', textShadow: '0 2px 12px rgba(0,0,0,0.55)', maxWidth: 620, margin: '0 auto 36px' }}
          >
            Residency status, Form 8843 auto-fill, treaty benefits, and a full tax estimate — all in one place. Built exclusively for international students at UIC.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.48, duration: 0.6 }}
            style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}
          >
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link href="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '16px 32px', borderRadius: 99, background: gradIndigo, color: '#fff', fontWeight: 700, fontSize: 16, textDecoration: 'none', boxShadow: glowIndigo, letterSpacing: '-0.01em' }}>
                Get Started Free <ArrowRight size={18}/>
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link href="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '16px 28px', borderRadius: 99, background: 'rgba(255,255,255,0.06)', color: '#fff', fontWeight: 600, fontSize: 15, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)' }}>
                Sign In
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Scroll cue */}
        <div style={{ position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)', zIndex: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 10, color: 'rgba(248,250,252,0.45)', letterSpacing: '0.12em', fontWeight: 700 }}>SCROLL</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.8 }}>
            <ChevronDown size={18} color="rgba(248,250,252,0.45)"/>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          MARQUEE TICKER (between sections 1→2)
          — Part of Section 2 so it's visible on scroll snap
      ══════════════════════════════════════ */}

      {/* ══════════════════════════════════════
          SECTION 2 — HOW IT WORKS (4 steps)
      ══════════════════════════════════════ */}
      <section id="workflow" style={{ ...sectionStyle }}>
        {/* Ambient glow */}
        <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', width: 700, height: 400, background: 'radial-gradient(ellipse, rgba(99,102,241,0.12) 0%, transparent 65%)', pointerEvents: 'none' }} />

        <Marquee />

        <div style={{ maxWidth: 1200, width: '100%', padding: '0 28px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Reveal className="text-center" style={{ marginBottom: 48 }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', color: T.indigo, textTransform: 'uppercase' }}>WORKFLOW</span>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, color: T.text, letterSpacing: '-0.035em', marginTop: 10, lineHeight: 1.1, fontFamily: 'var(--font-heading)' }}>
              4 Steps to<br/>
              <span style={{ background: gradFull, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Filing-Ready</span>
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" style={{ gap: 16 }}>
            {[
              { step: '01', title: 'Residency Check', desc: 'Run the IRS Substantial Presence Test. Know your filing status instantly.', icon: Shield, color: T.indigo, glow: 'rgba(99,102,241,0.35)' },
              { step: '02', title: 'Form 8843', desc: 'Auto-fill & download the official IRS declaration PDF in minutes.', icon: FileText, color: T.violet, glow: 'rgba(139,92,246,0.35)' },
              { step: '03', title: 'Treaty Lookup', desc: 'Discover country-specific exemptions under bilateral tax treaties.', icon: Globe, color: T.cyan, glow: 'rgba(6,182,212,0.35)' },
              { step: '04', title: 'Tax Estimate', desc: 'Federal 1040-NR + Illinois flat-rate calculation, fully transparent.', icon: Calculator, color: T.amber, glow: 'rgba(245,158,11,0.35)' },
            ].map((s, i) => (
              <Reveal key={i} delay={i * 0.10}>
                <motion.div
                  whileHover={{ y: -6, boxShadow: `0 20px 50px rgba(0,0,0,0.4), 0 0 40px ${s.glow}` }}
                  style={{
                    background: T.card,
                    border: `1px solid rgba(255,255,255,0.07)`,
                    borderRadius: 22,
                    padding: '28px 24px',
                    backdropFilter: 'blur(20px)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                    transition: 'border-color .22s',
                    cursor: 'default',
                    height: '100%',
                  }}
                  onHoverStart={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = `${s.color}50`;
                  }}
                  onHoverEnd={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)';
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                    <span style={{ fontSize: 32, fontWeight: 900, color: `${s.color}30`, fontFamily: 'JetBrains Mono, monospace', lineHeight: 1 }}>{s.step}</span>
                    <div style={{ width: 44, height: 44, borderRadius: 14, background: `${s.color}18`, border: `1px solid ${s.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 20px ${s.glow}` }}>
                      <s.icon size={20} color={s.color}/>
                    </div>
                  </div>
                  <h3 style={{ fontSize: 17, fontWeight: 800, color: T.text, marginBottom: 10 }}>{s.title}</h3>
                  <p style={{ fontSize: 13, color: T.muted, lineHeight: 1.7 }}>{s.desc}</p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION 3 — SECURITY / FORM FEATURE
      ══════════════════════════════════════ */}
      <section id="security" style={{ ...sectionStyle }}>
        {/* Ambient glow */}
        <div style={{ position: 'absolute', top: '10%', right: '15%', width: 500, height: 500, background: 'radial-gradient(ellipse, rgba(139,92,246,0.12) 0%, transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '10%', left: '10%', width: 400, height: 400, background: 'radial-gradient(ellipse, rgba(6,182,212,0.08) 0%, transparent 65%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 1200, width: '100%', padding: '0 28px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 72, alignItems: 'center' }} className="grid-cols-1 lg:grid-cols-2">
          {/* Left */}
          <Reveal>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', color: T.cyan, textTransform: 'uppercase' }}>DOCUMENT COMPLIANCE</span>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, color: T.text, letterSpacing: '-0.035em', marginTop: 10, marginBottom: 20, lineHeight: 1.1, fontFamily: 'var(--font-heading)' }}>
              Official IRS Form<br/>
              <span style={{ background: 'linear-gradient(135deg, #06B6D4, #6366F1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Auto-Filled for You
              </span>
            </h2>
            <p style={{ color: T.muted, fontSize: 15, lineHeight: 1.8, marginBottom: 32, maxWidth: 460 }}>
              Client-side PDF generation populates your personal, academic, and visa entries directly into the official IRS Form 8843. Zero third-party data handlers. Zero black-box logic.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { text: 'Bank-grade AES-256-GCM encryption at rest', color: T.indigo },
                { text: 'Direct local download — no data leaves your device', color: T.violet },
                { text: 'Pre-configured defaults for UIC F-1 holders', color: T.cyan },
              ].map((pt, i) => (
                <Reveal key={i} delay={i * 0.08}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ width: 26, height: 26, borderRadius: '50%', background: `${pt.color}18`, border: `1px solid ${pt.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: `0 0 14px ${pt.color}30` }}>
                      <CheckCircle2 size={14} color={pt.color}/>
                    </div>
                    <span style={{ fontSize: 15, color: T.text, fontWeight: 600 }}>{pt.text}</span>
                  </div>
                </Reveal>
              ))}
            </div>
          </Reveal>

          {/* Right: Floating glass card stack */}
          <Reveal delay={0.15}>
            <div style={{ position: 'relative', height: 340, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {/* Back card */}
              <div style={{ position: 'absolute', top: 24, right: 0, width: '82%', height: 240, background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.18)', borderRadius: 24, backdropFilter: 'blur(12px)', transform: 'rotate(3deg)' }} />
              {/* Front card */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut' }}
                style={{ position: 'relative', width: '88%', background: T.card, border: '1px solid rgba(99,102,241,0.28)', borderRadius: 24, padding: '30px 28px', backdropFilter: 'blur(24px)', boxShadow: `0 28px 70px rgba(0,0,0,0.5), ${glowIndigo}` }}
              >
                <div style={{ width: 50, height: 50, borderRadius: 16, background: 'rgba(6,182,212,0.18)', border: '1px solid rgba(6,182,212,0.38)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18, boxShadow: '0 0 24px rgba(6,182,212,0.30)' }}>
                  <Lock size={22} color={T.cyan}/>
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: T.text, marginBottom: 10 }}>Secure Tax ID Storage</h3>
                <p style={{ fontSize: 13, color: T.muted, lineHeight: 1.7 }}>SSN/ITIN digits encrypted on-device before storage. Complete PII compliance with zero third-party exposure.</p>
                <div style={{ marginTop: 18, display: 'flex', gap: 8 }}>
                  {['AES-256', 'JWT Sessions', 'Zero Sharing'].map(tag => (
                    <span key={tag} style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 99, background: 'rgba(99,102,241,0.14)', border: '1px solid rgba(99,102,241,0.28)', color: '#A5B4FC' }}>{tag}</span>
                  ))}
                </div>
              </motion.div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION 4 — STATS + FAQ
      ══════════════════════════════════════ */}
      <section id="faq" style={{ ...sectionStyle }}>
        <div style={{ position: 'absolute', top: '5%', left: '50%', transform: 'translateX(-50%)', width: 900, height: 300, background: 'radial-gradient(ellipse, rgba(245,158,11,0.07) 0%, transparent 65%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 1000, width: '100%', padding: '0 28px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 48 }}>
          {/* Stats row */}
          <Reveal>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28, padding: '28px 32px', background: 'rgba(15,23,42,0.75)', border: `1px solid rgba(255,255,255,0.07)`, borderRadius: 24, backdropFilter: 'blur(20px)' }}>
              <Stat number="4" label="GUIDED STEPS"/>
              <Stat number="50+" label="TREATY COUNTRIES"/>
              <Stat number="100%" label="FREE FOR UIC"/>
            </div>
          </Reveal>

          {/* FAQ */}
          <div>
            <Reveal>
              <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', color: T.amber, textTransform: 'uppercase' }}>SUPPORT</span>
                <h2 style={{ fontSize: 'clamp(1.7rem, 3.5vw, 2.4rem)', fontWeight: 900, color: T.text, letterSpacing: '-0.03em', marginTop: 8, fontFamily: 'var(--font-heading)' }}>
                  Common Questions
                </h2>
              </div>
            </Reveal>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {FAQS.map((faq, idx) => (
                <FaqItem key={idx} q={faq.q} a={faq.a}/>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION 5 — CTA + FOOTER
      ══════════════════════════════════════ */}
      <section style={{ ...sectionStyle }}>
        <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 50% 40%, rgba(99,102,241,0.18) 0%, transparent 60%)`, pointerEvents: 'none' }} />

        <div style={{ maxWidth: 900, width: '100%', padding: '0 28px', textAlign: 'center', zIndex: 2 }}>
          {/* Big CTA card */}
          <Reveal>
            <motion.div
              style={{
                background: 'rgba(15,23,42,0.80)',
                border: '1px solid rgba(99,102,241,0.30)',
                borderRadius: 32,
                padding: 'clamp(40px, 6vw, 70px) clamp(28px, 5vw, 64px)',
                backdropFilter: 'blur(24px)',
                boxShadow: `0 40px 100px rgba(0,0,0,0.55), ${glowIndigo}`,
                marginBottom: 56,
              }}
            >
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', padding: '7px 16px', borderRadius: 99, background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.35)', color: T.amber, display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 20 }}>
                <Sparkles size={12}/> TAX YEAR 2025 — OPEN NOW
              </span>
              <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.6rem)', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1.06, color: '#fff', marginBottom: 16, fontFamily: 'var(--font-heading)' }}>
                Your F-1 Taxes,<br/>
                <span style={{ background: gradFull, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  Sorted in Minutes
                </span>
              </h2>
              <p style={{ color: T.muted, fontSize: 16, lineHeight: 1.7, maxWidth: 520, margin: '0 auto 36px' }}>
                Takes less than 10 minutes. Designed exclusively for F-1 visa holders at the University of Illinois Chicago. Free, forever.
              </p>
              <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                  <Link href="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '16px 34px', borderRadius: 99, background: gradIndigo, color: '#fff', fontWeight: 700, fontSize: 16, textDecoration: 'none', boxShadow: `0 12px 40px rgba(99,102,241,0.45)` }}>
                    Get Started Free <ArrowRight size={18}/>
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                  <Link href="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '16px 28px', borderRadius: 99, background: 'rgba(255,255,255,0.06)', color: '#fff', fontWeight: 600, fontSize: 15, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.16)' }}>
                    Sign In
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </Reveal>

          {/* Footer */}
          <Reveal delay={0.15}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Logo/>
                <span style={{ fontWeight: 800, fontSize: 18, color: T.text }}>FTax Assistant</span>
              </div>
              <p style={{ color: T.dim, fontSize: 13, lineHeight: 1.7, maxWidth: 480 }}>
                Educational tax assistant for international students at UIC.<br/>
                &copy; 2026 FTax Assistant. All rights reserved.
              </p>
              <div style={{ display: 'flex', gap: 24, marginTop: 4 }}>
                {[['Privacy', '#'], ['Terms', '#'], ['Contact', '#']].map(([label, href]) => (
                  <a key={label} href={href} style={{ fontSize: 12, color: T.dim, textDecoration: 'none', fontWeight: 500, transition: 'color .15s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = T.muted)}
                    onMouseLeave={e => (e.currentTarget.style.color = T.dim)}
                  >{label}</a>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════════════════════════════════════
          MOBILE MENU
      ══════════════════════════════════════ */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              style={{ position: 'fixed', inset: 0, zIndex: 45, background: 'rgba(6,11,20,0.80)', backdropFilter: 'blur(6px)' }}
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'tween', ease: [0.22, 1, 0.36, 1], duration: 0.4 }}
              style={{ position: 'fixed', right: 0, top: 0, bottom: 0, zIndex: 50, width: 'min(88vw, 340px)', background: '#0A1020', borderLeft: '1px solid rgba(99,102,241,0.20)', boxShadow: '-16px 0 60px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 22px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Logo/>
                  <span style={{ fontWeight: 800, fontSize: 18, color: T.text }}>FTax</span>
                </div>
                <button onClick={() => setMobileMenuOpen(false)} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 10, padding: 8, cursor: 'pointer', color: T.text, display: 'flex' }}>
                  <X size={18}/>
                </button>
              </div>
              <div style={{ flex: 1, padding: '16px 14px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                {navLinks.map((link, i) => (
                  <motion.a key={link.label} href={link.href} onClick={() => setMobileMenuOpen(false)}
                    initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 + i * 0.06 }}
                    style={{ display: 'block', padding: '14px 16px', borderRadius: 12, color: T.muted, fontWeight: 500, fontSize: 16, textDecoration: 'none', transition: 'all .15s' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(99,102,241,0.10)'; (e.currentTarget as HTMLAnchorElement).style.color = T.text; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'transparent'; (e.currentTarget as HTMLAnchorElement).style.color = T.muted; }}
                  >
                    {link.label}
                  </motion.a>
                ))}
              </div>
              <div style={{ padding: '16px 18px 28px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                <Link href="/register" onClick={() => setMobileMenuOpen(false)} style={{ width: '100%', textAlign: 'center', padding: '14px', borderRadius: 14, background: gradIndigo, color: '#fff', fontWeight: 700, fontSize: 15, textDecoration: 'none', boxShadow: '0 6px 24px rgba(99,102,241,0.40)' }}>
                  Start Free
                </Link>
                <Link href="/login" onClick={() => setMobileMenuOpen(false)} style={{ width: '100%', textAlign: 'center', padding: '14px', borderRadius: 14, background: 'rgba(255,255,255,0.05)', color: T.text, fontWeight: 600, fontSize: 14, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.12)' }}>
                  Sign In
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
