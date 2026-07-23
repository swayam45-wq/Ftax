'use client';
import { useState, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useScroll, useTransform, useInView } from 'framer-motion';
import {
  Shield, Calculator, FileText, Globe,
  Menu, X, ChevronDown, ArrowRight,
  CheckCircle2, Lock, Sparkles
} from 'lucide-react';

/* ═══════════════════════════════════════════════
   DESIGN TOKENS
   Muted Cinematic Dark — blends with video BG
   Accent: steel-blue #7BA4B8 (desaturated, calm)
   Nothing bright. Nothing harsh.
═══════════════════════════════════════════════ */
const A = '#7BA4B8';           // steel-blue accent — calm, muted
const AG = 'rgba(123,164,184,0.14)'; // accent glass bg
const AB = 'rgba(123,164,184,0.30)'; // accent border
const GOLD = '#C4955A';        // warm amber — used only on badges

const T = {
  bg:      '#080B10',          // deepest bg
  surface: '#0E1218',          // card surface
  card:    'rgba(14,18,24,0.88)',
  text:    '#C8CBD0',          // warm light-gray — NOT pure white
  heading: '#E8E8E6',          // slightly brighter for headings
  muted:   '#5A6472',          // muted slate
  dim:     'rgba(90,100,114,0.55)',
  border:  'rgba(255,255,255,0.07)',
  borderHi:'rgba(123,164,184,0.22)',
} as const;

// Gradients — very subtle, not saturated
const gradAccent = `linear-gradient(135deg, ${A} 0%, #9ABFCE 100%)`;
const gradText   = `linear-gradient(135deg, ${T.heading} 0%, ${A} 100%)`;
const glowAccent = `0 0 28px rgba(123,164,184,0.18)`;

/* ═══════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════ */
function Logo() {
  return (
    <svg width="28" height="28" viewBox="0 0 256 256" fill={A}>
      <path d="M 64 128 L 64.5 128 L 32 95 L 0 64 L 0 0 L 64 0 L 128 64 L 128 64.5 L 161 32 L 192 0 L 256 0 L 256 64 L 192 128 L 128 128 L 128 192 L 96 223 L 63.5 256 L 0 256 L 0 192 Z M 256 192 L 224 223 L 191.5 256 L 128 256 L 128 192 L 192 128 L 256 128 Z" />
    </svg>
  );
}

function Reveal({ children, delay = 0, className = '', style }: {
  children: React.ReactNode; delay?: number; className?: string; style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.21, 1, 0.43, 1] }}
      className={className} style={style}
    >{children}</motion.div>
  );
}

const TICKER = ['Form 8843', '1040-NR', 'Treaty Benefits', 'FICA Refunds', 'Residency Test', 'F-1 Visa', 'Illinois IL-1040', 'ITIN Guide'];
function Marquee() {
  return (
    <div style={{ overflow: 'hidden', borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}`, padding: '12px 0', background: 'rgba(8,11,16,0.70)', backdropFilter: 'blur(8px)' }}>
      <motion.div style={{ display: 'flex', gap: 48, whiteSpace: 'nowrap' }} animate={{ x: ['0%', '-50%'] }} transition={{ repeat: Infinity, duration: 26, ease: 'linear' }}>
        {[...TICKER, ...TICKER].map((t, i) => (
          <span key={i} style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.10em', color: i % 2 === 0 ? A : T.muted, textTransform: 'uppercase' }}>
            {t}&nbsp;&nbsp;<span style={{ color: T.border }}>·</span>&nbsp;&nbsp;
          </span>
        ))}
      </motion.div>
    </div>
  );
}

function Stat({ number, label }: { number: string; label: string }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <p style={{ fontSize: 'clamp(1.9rem, 4vw, 2.6rem)', fontWeight: 800, letterSpacing: '-0.05em', color: T.heading, fontFamily: 'var(--font-heading)' }}>{number}</p>
      <p style={{ fontSize: 11, color: T.muted, fontWeight: 600, letterSpacing: '0.08em', marginTop: 4, textTransform: 'uppercase' }}>{label}</p>
    </div>
  );
}

const FAQS = [
  { q: 'Do I need to file taxes as an F-1 student?', a: 'Yes — even with zero income. All F-1 students physically present in the U.S. must file Form 8843. If you earned U.S.-source income, you also file Form 1040-NR.' },
  { q: 'What is Form 8843?', a: 'A statement declaring you as an "exempt individual" under IRS rules — not exempt from taxes, but from counting days toward the Substantial Presence Test. Required for every F-1 student.' },
  { q: 'How do tax treaties work?', a: 'Indian students may claim a standard deduction equivalent under Article 21(2). Chinese students can exempt up to $5,000 in wages annually under Article 20. FTax auto-detects your eligibility.' },
  { q: 'Is my data secure?', a: 'SSN/ITIN digits are encrypted on-device with AES-256-GCM before any storage. Short-lived JWT sessions. We never share data with third parties.' },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div onClick={() => setOpen(!open)} style={{
      background: open ? 'rgba(123,164,184,0.06)' : 'rgba(14,18,24,0.60)',
      border: `1px solid ${open ? AB : T.border}`,
      borderRadius: 14, cursor: 'pointer', overflow: 'hidden',
      backdropFilter: 'blur(12px)', transition: 'all .20s',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 22px' }}>
        <span style={{ fontWeight: 600, fontSize: 14, color: T.heading, maxWidth: '88%' }}>{q}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.18 }}
          style={{ width: 26, height: 26, borderRadius: '50%', background: open ? AG : 'rgba(255,255,255,0.04)', border: `1px solid ${open ? AB : T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <ChevronDown size={13} color={T.text}/>
        </motion.div>
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22, ease: 'easeInOut' }}>
            <p style={{ padding: '0 22px 20px', color: T.muted, fontSize: 13, lineHeight: 1.8 }}>{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════ */
export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll({ container: containerRef });
  const videoScale  = useTransform(scrollY, [0, 600], [1, 1.10]);
  const heroOpacity = useTransform(scrollY, [0, 350], [1, 0]);

  const navLinks = [
    { label: 'How It Works', href: '#workflow' },
    { label: 'Security',     href: '#security'  },
    { label: 'FAQ',          href: '#faq'        },
  ];

  const section: React.CSSProperties = {
    height: '100dvh', scrollSnapAlign: 'start', scrollSnapStop: 'always',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', position: 'relative', overflow: 'hidden',
  };

  // Button styles
  const btnPrimary: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', gap: 9,
    padding: '13px 28px', borderRadius: 99,
    background: AG, border: `1px solid ${AB}`,
    color: T.heading, fontWeight: 700, fontSize: 14,
    textDecoration: 'none', backdropFilter: 'blur(8px)',
    boxShadow: glowAccent, letterSpacing: '-0.01em',
    transition: 'all .18s',
  };
  const btnSecondary: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', gap: 9,
    padding: '13px 24px', borderRadius: 99,
    background: 'rgba(255,255,255,0.04)', border: `1px solid ${T.border}`,
    color: T.muted, fontWeight: 600, fontSize: 14,
    textDecoration: 'none', backdropFilter: 'blur(6px)',
    transition: 'all .18s',
  };

  return (
    <div ref={containerRef} style={{
      fontFamily: "'Inter', system-ui, sans-serif", color: T.text,
      background: T.bg, height: '100dvh',
      overflowY: 'scroll', overflowX: 'hidden',
      scrollSnapType: 'y mandatory', scrollBehavior: 'smooth',
    }}>

      {/* ── SECTION 1: VIDEO HERO ─────────────────── */}
      <section ref={heroRef} style={section}>
        <motion.video autoPlay muted loop playsInline style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%',
          objectFit: 'cover', zIndex: 0, scale: videoScale,
        }}>
          <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260606_131516_eca35265-ea66-4fbd-8d52-22aae6e1a503.mp4" type="video/mp4"/>
        </motion.video>

        {/* Film grain overlay — cinematic texture */}
        <div className="film-grain" />

        {/* Aurora ambient glows */}
        <div className="aurora-1" style={{
          width: 500, height: 400, zIndex: 2,
          top: '30%', left: '20%',
          background: 'radial-gradient(ellipse, rgba(123,164,184,0.35) 0%, transparent 70%)',
        }} />
        <div className="aurora-2" style={{
          width: 400, height: 350, zIndex: 2,
          top: '45%', right: '15%',
          background: 'radial-gradient(ellipse, rgba(196,149,90,0.20) 0%, transparent 70%)',
        }} />

        {/* Overlays */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'linear-gradient(180deg, rgba(8,11,16,0.52) 0%, rgba(8,11,16,0.18) 45%, rgba(8,11,16,0.65) 80%, #080B10 100%)' }} />

        {/* Navbar */}
        <header style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 30, padding: '18px 0' }}>
          <div style={{ maxWidth: 1180, margin: '0 auto', padding: '0 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none' }}>
              <Logo />
              <span style={{ fontWeight: 700, fontSize: 18, color: T.heading, letterSpacing: '-0.03em' }}>FTax</span>
            </Link>
            <nav className="hidden md:flex" style={{ gap: 32, alignItems: 'center' }}>
              {navLinks.map(l => (
                <a key={l.label} href={l.href} style={{ color: T.muted, fontSize: 13, fontWeight: 500, textDecoration: 'none', transition: 'color .15s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = T.text)}
                  onMouseLeave={e => (e.currentTarget.style.color = T.muted)}
                >{l.label}</a>
              ))}
            </nav>
            <div className="hidden md:flex" style={{ gap: 8, alignItems: 'center' }}>
              <Link href="/login" style={btnSecondary}>Sign In</Link>
              <Link href="/register" style={btnPrimary}>Start Free <ArrowRight size={15}/></Link>
            </div>
            <button className="md:hidden" onClick={() => setMenuOpen(true)} style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${T.border}`, borderRadius: 9, padding: 7, color: T.text, cursor: 'pointer', display: 'flex' }}>
              <Menu size={18}/>
            </button>
          </div>
        </header>

        {/* Hero text */}
        <motion.div style={{ opacity: heroOpacity, zIndex: 10, textAlign: 'center', padding: '0 24px', maxWidth: 760, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.65 }} style={{ marginBottom: 20 }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', padding: '6px 16px', borderRadius: 99, background: `rgba(196,149,90,0.12)`, border: `1px solid rgba(196,149,90,0.28)`, color: GOLD }}>
              UIC F-1 TAX ASSISTANT · 2025
            </span>
          </motion.div>

          {/* Word-by-word staggered headline */}
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.2rem, 5.5vw, 3.8rem)', fontWeight: 900, lineHeight: 1.06, letterSpacing: '-0.03em', color: T.heading, textShadow: '0 3px 24px rgba(0,0,0,0.60)', marginBottom: 20 }}>
            {'File Your F-1 Student'.split(' ').map((word, i) => (
              <span key={i} className="word-reveal" style={{ animationDelay: `${0.20 + i * 0.10}s`, marginRight: '0.28em' }}>{word}</span>
            ))}
            <br/>
            {['Taxes', 'with', 'Confidence'].map((word, i) => (
              <span key={i} className="word-reveal" style={{
                animationDelay: `${0.60 + i * 0.10}s`,
                marginRight: '0.28em',
                background: gradText,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>{word}</span>
            ))}
          </div>

          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32, duration: 0.65 }}
            style={{ fontSize: 'clamp(0.95rem, 2.2vw, 1.08rem)', lineHeight: 1.78, color: T.muted, maxWidth: 560, margin: '0 auto 32px', textShadow: '0 2px 12px rgba(0,0,0,0.50)' }}
          >
            Residency status, Form 8843 auto-fill, treaty benefits, and a full tax estimate — all in one place. Built for international students at UIC.
          </motion.p>

          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.44, duration: 0.55 }}
            style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}
          >
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link href="/register" style={btnPrimary}>Get Started Free <ArrowRight size={15}/></Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link href="/login" style={btnSecondary}>Sign In</Link>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Scroll cue */}
        <div style={{ position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)', zIndex: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
          <span style={{ fontSize: 9, color: T.muted, letterSpacing: '0.14em', fontWeight: 600 }}>SCROLL</span>
          <motion.div animate={{ y: [0, 7, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
            <ChevronDown size={16} color={T.muted}/>
          </motion.div>
        </div>
      </section>

      {/* ── SECTION 2: HOW IT WORKS ───────────────── */}
      <section id="workflow" style={{ ...section, background: T.bg }}>
        <div style={{ position: 'absolute', top: '15%', left: '50%', transform: 'translateX(-50%)', width: 600, height: 300, background: `radial-gradient(ellipse, ${AG} 0%, transparent 70%)`, pointerEvents: 'none' }} />

        <Marquee />

        <div style={{ maxWidth: 1180, width: '100%', padding: '0 28px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Reveal className="text-center" style={{ marginBottom: 40 }}>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', color: A, textTransform: 'uppercase' }}>THE WORKFLOW</span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.7rem)', fontWeight: 900, color: T.heading, letterSpacing: '-0.03em', marginTop: 10, lineHeight: 1.1, fontFamily: 'var(--font-heading)' }}>
              4 Steps to Filing-Ready
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" style={{ gap: 14 }}>
            {[
              { n: '01', title: 'Residency Check', desc: 'Run the IRS Substantial Presence Test instantly.', Icon: Shield },
              { n: '02', title: 'Form 8843',       desc: 'Auto-fill & download the official IRS declaration PDF.', Icon: FileText },
              { n: '03', title: 'Treaty Lookup',   desc: 'Country-specific exemptions under bilateral treaties.', Icon: Globe },
              { n: '04', title: 'Tax Estimate',    desc: 'Federal 1040-NR + Illinois flat-rate, fully transparent.', Icon: Calculator },
            ].map((s, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <motion.div
                  whileHover={{ y: -5, borderColor: AB }}
                  style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 18, padding: '24px 20px', backdropFilter: 'blur(18px)', boxShadow: '0 6px 24px rgba(0,0,0,0.28)', cursor: 'default', height: '100%', transition: 'border-color .2s' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                    <span style={{ fontSize: 28, fontWeight: 800, color: 'rgba(123,164,184,0.18)', fontFamily: 'JetBrains Mono, monospace', lineHeight: 1 }}>{s.n}</span>
                    <div style={{ width: 38, height: 38, borderRadius: 11, background: AG, border: `1px solid ${AB}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <s.Icon size={17} color={A}/>
                    </div>
                  </div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: T.heading, marginBottom: 8 }}>{s.title}</h3>
                  <p style={{ fontSize: 12, color: T.muted, lineHeight: 1.7 }}>{s.desc}</p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 3: SECURITY ───────────────────── */}
      <section id="security" style={{ ...section, background: T.surface }}>
        <div style={{ position: 'absolute', top: '10%', right: '10%', width: 400, height: 400, background: `radial-gradient(ellipse, rgba(123,164,184,0.07) 0%, transparent 65%)`, pointerEvents: 'none' }} />

        <div style={{ maxWidth: 1180, width: '100%', padding: '0 28px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
          <Reveal>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', color: A, textTransform: 'uppercase' }}>DOCUMENT COMPLIANCE</span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.7rem)', fontWeight: 900, color: T.heading, letterSpacing: '-0.03em', marginTop: 10, marginBottom: 18, lineHeight: 1.1, fontFamily: 'var(--font-heading)' }}>
              Official IRS Form,<br/>Auto-Filled for You
            </h2>
            <p style={{ color: T.muted, fontSize: 14, lineHeight: 1.8, marginBottom: 28, maxWidth: 420 }}>
              Client-side PDF generation populates your personal, academic, and visa entries directly into IRS Form 8843. Zero third-party handlers. Zero black-box logic.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {['Bank-grade AES-256-GCM encryption at rest', 'Local download — no data leaves your device', 'Pre-configured for UIC F-1 holders'].map((pt, i) => (
                <Reveal key={i} delay={i * 0.07}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 24, height: 24, borderRadius: '50%', background: AG, border: `1px solid ${AB}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <CheckCircle2 size={13} color={A}/>
                    </div>
                    <span style={{ fontSize: 14, color: T.text, fontWeight: 500 }}>{pt}</span>
                  </div>
                </Reveal>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <div style={{ position: 'relative', height: 320, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ position: 'absolute', top: 20, right: 0, width: '80%', height: 230, background: AG, border: `1px solid ${AB}`, borderRadius: 22, backdropFilter: 'blur(10px)', transform: 'rotate(3deg)' }} />
              <motion.div
                animate={{ y: [0, -7, 0] }} transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut' }}
                style={{ position: 'relative', width: '86%', background: T.card, border: `1px solid ${AB}`, borderRadius: 22, padding: '28px 26px', backdropFilter: 'blur(20px)', boxShadow: `0 24px 60px rgba(0,0,0,0.45), ${glowAccent}` }}
              >
                <div style={{ width: 46, height: 46, borderRadius: 14, background: AG, border: `1px solid ${AB}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                  <Lock size={20} color={A}/>
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: T.heading, marginBottom: 8 }}>Secure Tax ID Storage</h3>
                <p style={{ fontSize: 12, color: T.muted, lineHeight: 1.7 }}>SSN/ITIN digits encrypted on-device. PII compliance with zero third-party exposure.</p>
                <div style={{ marginTop: 16, display: 'flex', gap: 7 }}>
                  {['AES-256', 'JWT Sessions', 'Zero Sharing'].map(tag => (
                    <span key={tag} style={{ fontSize: 10, fontWeight: 700, padding: '4px 9px', borderRadius: 99, background: AG, border: `1px solid ${AB}`, color: A, letterSpacing: '0.04em' }}>{tag}</span>
                  ))}
                </div>
              </motion.div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── SECTION 4: STATS + FAQ ─────────────────── */}
      <section id="faq" style={{ ...section, background: T.bg }}>
        <div style={{ position: 'absolute', top: '5%', left: '50%', transform: 'translateX(-50%)', width: 700, height: 250, background: `radial-gradient(ellipse, rgba(196,149,90,0.05) 0%, transparent 65%)`, pointerEvents: 'none' }} />

        <div style={{ maxWidth: 880, width: '100%', padding: '0 28px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 40 }}>
          <Reveal>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, padding: '24px 28px', background: 'rgba(14,18,24,0.70)', border: `1px solid ${T.border}`, borderRadius: 20, backdropFilter: 'blur(16px)' }}>
              <Stat number="4"    label="Guided Steps"/>
              <Stat number="50+" label="Treaty Countries"/>
              <Stat number="Free" label="For UIC Students"/>
            </div>
          </Reveal>

          <div>
            <Reveal>
              <div style={{ textAlign: 'center', marginBottom: 20 }}>
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', color: A, textTransform: 'uppercase' }}>SUPPORT</span>
                <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.1rem)', fontWeight: 900, color: T.heading, letterSpacing: '-0.03em', marginTop: 8, fontFamily: 'var(--font-heading)' }}>Common Questions</h2>
              </div>
            </Reveal>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {FAQS.map((f, i) => <FaqItem key={i} q={f.q} a={f.a}/>)}
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 5: CTA + FOOTER ──────────────── */}
      <section style={{ ...section, background: T.surface }}>
        <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 50% 35%, rgba(123,164,184,0.07) 0%, transparent 60%)`, pointerEvents: 'none' }} />

        <div style={{ maxWidth: 800, width: '100%', padding: '0 28px', textAlign: 'center', zIndex: 2 }}>
          <Reveal>
            <motion.div style={{
              background: 'rgba(14,18,24,0.85)', border: `1px solid ${T.border}`,
              borderRadius: 28, padding: 'clamp(36px, 5vw, 60px) clamp(24px, 4vw, 56px)',
              backdropFilter: 'blur(20px)', boxShadow: `0 32px 80px rgba(0,0,0,0.50), ${glowAccent}`,
              marginBottom: 48,
            }}>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', padding: '6px 14px', borderRadius: 99, background: `rgba(196,149,90,0.10)`, border: `1px solid rgba(196,149,90,0.24)`, color: GOLD, display: 'inline-flex', alignItems: 'center', gap: 5, marginBottom: 18 }}>
                <Sparkles size={11}/> TAX YEAR 2025 — OPEN NOW
              </span>
              <h2 style={{ fontSize: 'clamp(1.9rem, 4.5vw, 3.1rem)', fontWeight: 900, letterSpacing: '-0.035em', lineHeight: 1.08, color: T.heading, marginBottom: 14, fontFamily: 'var(--font-heading)' }}>
                Your F-1 Taxes,<br/>
                <span style={{ background: gradText, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  Sorted in Minutes
                </span>
              </h2>
              <p style={{ color: T.muted, fontSize: 14, lineHeight: 1.8, maxWidth: 460, margin: '0 auto 30px' }}>
                Under 10 minutes. Free, forever. Designed exclusively for F-1 visa holders at the University of Illinois Chicago.
              </p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                  <Link href="/register" style={btnPrimary}>Get Started Free <ArrowRight size={15}/></Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                  <Link href="/login" style={btnSecondary}>Sign In</Link>
                </motion.div>
              </div>
            </motion.div>
          </Reveal>

          <Reveal delay={0.12}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Logo/>
                <span style={{ fontWeight: 700, fontSize: 16, color: T.text }}>FTax Assistant</span>
              </div>
              <p style={{ color: T.muted, fontSize: 12, lineHeight: 1.7 }}>
                Educational tax assistant for international students at UIC.<br/>
                &copy; 2026 FTax Assistant. All rights reserved.
              </p>
              <div style={{ display: 'flex', gap: 20 }}>
                {[['Privacy','#'],['Terms','#'],['Contact','#']].map(([l,h]) => (
                  <a key={l} href={h} style={{ fontSize: 11, color: T.muted, textDecoration: 'none', fontWeight: 500, transition: 'color .14s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = T.text)}
                    onMouseLeave={e => (e.currentTarget.style.color = T.muted)}
                  >{l}</a>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── MOBILE MENU ───────────────────────────── */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.22 }}
              style={{ position: 'fixed', inset: 0, zIndex: 45, background: 'rgba(8,11,16,0.75)', backdropFilter: 'blur(5px)' }}
              onClick={() => setMenuOpen(false)}
            />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'tween', ease: [0.22,1,0.36,1], duration: 0.38 }}
              style={{ position: 'fixed', right: 0, top: 0, bottom: 0, zIndex: 50, width: 'min(85vw, 320px)', background: T.surface, borderLeft: `1px solid ${T.border}`, boxShadow: '-12px 0 50px rgba(0,0,0,0.50)', display: 'flex', flexDirection: 'column' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 20px', borderBottom: `1px solid ${T.border}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Logo/><span style={{ fontWeight: 700, fontSize: 16, color: T.heading }}>FTax</span>
                </div>
                <button onClick={() => setMenuOpen(false)} style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${T.border}`, borderRadius: 8, padding: 7, cursor: 'pointer', color: T.text, display: 'flex' }}>
                  <X size={16}/>
                </button>
              </div>
              <div style={{ flex: 1, padding: '14px 12px', display: 'flex', flexDirection: 'column', gap: 2 }}>
                {navLinks.map((l, i) => (
                  <motion.a key={l.label} href={l.href} onClick={() => setMenuOpen(false)}
                    initial={{ x: 16, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.08 + i * 0.05 }}
                    style={{ display: 'block', padding: '13px 14px', borderRadius: 10, color: T.muted, fontWeight: 500, fontSize: 15, textDecoration: 'none', transition: 'all .14s' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = AG; (e.currentTarget as HTMLAnchorElement).style.color = T.text; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'transparent'; (e.currentTarget as HTMLAnchorElement).style.color = T.muted; }}
                  >{l.label}</motion.a>
                ))}
              </div>
              <div style={{ padding: '14px 16px 26px', display: 'flex', flexDirection: 'column', gap: 9 }}>
                <Link href="/register" onClick={() => setMenuOpen(false)} style={{ ...btnPrimary, justifyContent: 'center', padding: '13px' }}>Start Free</Link>
                <Link href="/login"    onClick={() => setMenuOpen(false)} style={{ ...btnSecondary, justifyContent: 'center', padding: '13px' }}>Sign In</Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
