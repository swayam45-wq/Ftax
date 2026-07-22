'use client';
import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRightCircle, Shield, Calculator, FileText, Globe,
  Menu, X, ChevronDown, ChevronUp, CheckCircle2, Lock, Sparkles, ArrowRight
} from 'lucide-react';
import { C, grad, gradText } from '@/lib/api';

/* ── Custom Logo (filled with brand color) ── */
function Logo() {
  return (
    <svg width="32" height="32" viewBox="0 0 256 256" fill={C.pine} className="transition-transform hover:scale-105 duration-200">
      <path d="M 64 128 L 64.5 128 L 32 95 L 0 64 L 0 0 L 64 0 L 128 64 L 128 64.5 L 161 32 L 192 0 L 256 0 L 256 64 L 192 128 L 128 128 L 128 192 L 96 223 L 63.5 256 L 0 256 L 0 192 Z M 256 192 L 224 223 L 191.5 256 L 128 256 L 128 192 L 192 128 L 256 128 Z" />
    </svg>
  );
}

/* ── Animation Variants ── */
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.12,
      duration: 0.7,
      ease: [0.21, 1.02, 0.43, 1.01] as any,
    },
  }),
};

const scrollReveal = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.21, 1.02, 0.43, 1.01] as any },
  },
};

/* ── FAQs ── */
const FAQS = [
  { q: 'Do I need to file taxes as an F-1 student?', a: 'Yes, even with zero income. If you were physically present in the U.S. during the tax year, you must file Form 8843. If you had U.S. source income, you must also file Form 1040-NR.' },
  { q: 'What is Form 8843?', a: 'Form 8843 is an statement for the IRS declaring you as an exempt individual on an F-1 student visa. It does not mean you are exempt from taxes, but that your days in the U.S. do not count towards the Substantial Presence Test.' },
  { q: 'How does the tax treaty work for Indian/Chinese students?', a: 'Indian students can claim the standard deduction equivalent on Form 1040-NR under Article 21(2). Chinese students can exempt up to $5,000 of wage income annually under Article 20.' },
  { q: 'Is my personal data secure on FTax?', a: 'Absolutely. We use bank-grade AES-256-GCM encryption at rest to store sensitive tax identifiers (SSN/ITIN), short-lived JWT sessions, and enforce strict UIC institutional email verification in production.' }
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      onClick={() => setOpen(!open)}
      style={{
        background: open ? 'rgba(83,145,150,0.08)' : 'rgba(13,21,32,0.65)',
        border: `1px solid ${open ? 'rgba(83,145,150,0.38)' : 'rgba(83,145,150,0.16)'}`,
        borderRadius: 20,
        cursor: 'pointer',
        transition: 'all .25s ease',
        overflow: 'hidden',
        backdropFilter: 'blur(16px)',
        boxShadow: open ? '0 12px 36px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.2)',
      }}
      className="hover:border-white/20"
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '22px 28px' }}>
        <span style={{ fontWeight: 600, fontSize: 16, color: '#f0eeee' }}>{q}</span>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: '50%', background: open ? grad : 'rgba(255,255,255,0.06)', transition: 'all .2s' }}>
          {open ? <ChevronUp size={15} color="#fff"/> : <ChevronDown size={15} color={C.muted}/>}
        </div>
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            <p style={{ padding: '0 28px 24px', color: C.muted, fontSize: 14, lineHeight: 1.8 }}>{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Workflow', href: '#workflow' },
    { label: 'Form 8843', href: '#8843' },
    { label: 'FAQ', href: '#faq' }
  ];

  return (
    <div
      className="relative w-full overflow-x-hidden bg-[#0a0f14]"
      style={{
        fontFamily: 'var(--font-body)',
        color: '#f0eeee',
        scrollBehavior: 'smooth',
      }}
    >
      {/* ── HERO VIEWPORT CONTAINER WITH VIDEO ── */}
      <div className="relative w-full flex flex-col min-h-screen">
        {/* Background video */}
        <video autoPlay muted loop playsInline className="absolute inset-0 z-0 w-full h-full object-cover">
          <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260606_131516_eca35265-ea66-4fbd-8d52-22aae6e1a503.mp4" type="video/mp4" />
        </video>

        {/* Ambient Dark Overlay */}
        <div className="absolute inset-0 z-10" style={{ background: 'linear-gradient(to bottom, rgba(10,15,20,0.50) 0%, rgba(10,15,20,0.30) 40%, rgba(10,15,20,0.75) 85%, #0a0f14 100%)' }} />

        {/* Navbar */}
        <header className="relative z-30 w-full">
          <div className="max-w-[1200px] mx-auto px-6 sm:px-8 py-5 flex justify-between items-center">
            <Link href="/" className="flex items-center gap-3">
              <Logo />
              <span className="font-extrabold text-xl tracking-tight text-white">FTax</span>
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm font-medium transition-opacity hover:opacity-100"
                  style={{ color: C.muted }}
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="hidden md:flex items-center gap-3">
              <Link
                href="/register"
                className="text-sm font-semibold px-5 py-2.5 rounded-full transition-all duration-200 hover:shadow-lg active:scale-95 text-white"
                style={{ background: grad, boxShadow: '0 4px 20px rgba(83,128,131,0.35)' }}
              >
                Start For Free
              </Link>
              <Link
                href="/login"
                className="text-sm font-semibold px-5 py-2.5 rounded-full transition-all duration-200 hover:bg-white/10 active:scale-95"
                style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: `1px solid ${C.border}`, color: '#f0eeee' }}
              >
                Sign In
              </Link>
            </div>

            <button
              className="md:hidden p-2 rounded-full transition-colors hover:bg-white/5"
              onClick={() => setMobileMenuOpen(true)}
              style={{ color: '#f0eeee' }}
            >
              <Menu size={24} />
            </button>
          </div>
        </header>

        {/* Hero content */}
        <main className="relative z-20 flex-1 flex flex-col items-center justify-center px-6 sm:px-8 py-20">
          <div className="max-w-[760px] w-full flex flex-col items-center text-center">
            {/* Tagline */}
            <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible" className="mb-6">
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', padding: '6px 18px', borderRadius: 999, background: 'rgba(42,127,98,0.25)', border: '1px solid rgba(42,127,98,0.45)', color: '#38D499', boxShadow: '0 0 20px rgba(42,127,98,0.25)' }}>
                UIC F-1 TAX ASSISTANT
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              custom={1}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="font-bold tracking-[-0.03em] mb-6"
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(2.2rem, 5.5vw, 3.8rem)',
                lineHeight: '1.05',
                color: '#ffffff',
                textShadow: '0 4px 30px rgba(0,0,0,0.7)',
              }}
            >
              Lock{' '}
              <Shield
                size={32}
                style={{
                  display: 'inline',
                  verticalAlign: 'middle',
                  position: 'relative',
                  top: '-4px',
                  color: C.pine,
                  margin: '0 4px',
                }}
              />{' '}
              Down Your{' '}
              <Calculator
                size={32}
                style={{
                  display: 'inline',
                  verticalAlign: 'middle',
                  position: 'relative',
                  top: '-4px',
                  color: C.teal,
                  margin: '0 4px',
                }}
              />{' '}
              Student Taxes
              <br />
              with Ironclad Ease
            </motion.h1>

            {/* Subtext */}
            <motion.p
              custom={2}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="max-w-[620px] mb-10"
              style={{
                fontSize: 'clamp(1rem, 2.5vw, 1.15rem)',
                lineHeight: '1.75',
                color: 'rgba(240,238,238,0.88)',
                textShadow: '0 2px 12px rgba(0,0,0,0.6)',
              }}
            >
              Determine your tax residency status, auto-fill your official Form 8843 statement, and check eligible treaty benefits. Simple, secure, and built specifically for UIC international students.
            </motion.p>

            {/* CTA */}
            <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible">
              <motion.div whileHover={{ scale: 1.04, filter: 'brightness(1.08)' }} whileTap={{ scale: 0.97 }}>
                <Link
                  href="/register"
                  className="inline-flex justify-between items-center rounded-full text-white font-bold transition-all"
                  style={{
                    background: grad,
                    fontSize: 'clamp(1rem, 2vw, 1.1rem)',
                    padding: '18px 34px',
                    minWidth: '260px',
                    boxShadow: '0 12px 40px rgba(83,128,131,0.45)',
                    gap: '28px',
                  }}
                >
                  <span>Get Started Free</span>
                  <ArrowRightCircle size={22} />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </main>

        {/* Scroll cue */}
        <div className="relative z-20 w-full text-center pb-8 flex flex-col items-center gap-2">
          <span style={{ fontSize: 11, color: 'rgba(240,238,238,0.5)', letterSpacing: '0.1em', fontWeight: 700, textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>SCROLL TO EXPLORE</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.8 }} className="w-6 h-6 flex items-center justify-center">
            <ChevronDown size={18} color="rgba(240,238,238,0.5)" />
          </motion.div>
        </div>

        {/* Smooth Seamless Dissolve Gradient into rest of page */}
        <div className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none z-20" style={{ background: 'linear-gradient(to bottom, transparent 0%, #0a0f14 100%)' }} />
      </div>

      {/* ── SEAMLESS LOWER SECTIONS WITH AMBIENT GLOW ── */}
      <div className="relative z-20 bg-[#0a0f14] overflow-hidden">

        {/* Continuous Background Glow Blobs */}
        <div className="absolute top-[5%] left-[50%] -translate-x-[50%] w-[900px] h-[500px] bg-emerald-900/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-[35%] right-[10%] w-[600px] h-[600px] bg-teal-900/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-[65%] left-[5%] w-[700px] h-[500px] bg-slate-800/20 rounded-full blur-[130px] pointer-events-none" />

        {/* 1. How It Works Section */}
        <section id="workflow" className="relative py-28 px-6 sm:px-8">
          <div className="max-w-[1200px] w-full mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              variants={scrollReveal}
              className="text-center mb-16"
            >
              <span className="step-badge" style={{ color: C.pine, borderColor: 'rgba(83,128,131,0.30)', background: 'rgba(83,128,131,0.12)' }}>
                WORKFLOW
              </span>
              <h2 style={{ fontSize: 'clamp(2rem, 4.5vw, 3rem)', fontWeight: 900, color: '#ffffff', fontFamily: 'var(--font-heading)', marginTop: 12, letterSpacing: '-0.03em' }}>
                How It Works
              </h2>
              <p style={{ color: C.muted, fontSize: 16, marginTop: 10, maxWidth: 540, marginInline: 'auto' }}>
                From start to filing-ready in 4 clear, guided checkpoints.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { step: '01', title: 'Residency Check', desc: 'Run the Substantial Presence Test dynamically.', icon: Shield, color: C.pine },
                { step: '02', title: 'Form 8843 Filler', desc: 'Generate and pre-fill the official IRS PDF statement.', icon: FileText, color: C.teal },
                { step: '03', title: 'Treaty Lookup', desc: 'Find country-specific student exemptions.', icon: Globe, color: C.pine },
                { step: '04', title: 'Tax Estimator', desc: 'Calculate federal and Illinois state allocations.', icon: Calculator, color: C.teal },
              ].map((s, idx) => (
                <motion.div
                  key={idx}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-50px' }}
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: { opacity: 1, y: 0, transition: { delay: idx * 0.1, duration: 0.6 } }
                  }}
                  style={{
                    background: 'rgba(13,21,32,0.72)',
                    border: '1px solid rgba(83,145,150,0.18)',
                    borderRadius: 24,
                    padding: 32,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 20,
                    backdropFilter: 'blur(20px)',
                    boxShadow: '0 16px 40px rgba(0,0,0,0.3)',
                    transition: 'all .25s ease'
                  }}
                  className="hover:border-teal-500/40 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-teal-950/40"
                >
                  <div className="flex justify-between items-center">
                    <span style={{ fontSize: 36, fontWeight: 900, color: `${s.color}35`, fontFamily: 'JetBrains Mono, monospace' }}>{s.step}</span>
                    <div style={{ borderRadius: 14, background: `${s.color}22`, border: `1px solid ${s.color}40`, width: 44, height: 44 }} className="flex items-center justify-center">
                      <s.icon size={20} color={s.color} />
                    </div>
                  </div>
                  <div>
                    <h3 style={{ fontSize: 17, fontWeight: 800, color: '#ffffff', marginBottom: 8 }}>{s.title}</h3>
                    <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.65 }}>{s.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Divider Glow Line */}
        <div className="max-w-[1200px] mx-auto h-[1px] bg-gradient-to-r from-transparent via-teal-500/20 to-transparent my-4" />

        {/* 2. Feature Deep Dive Section */}
        <section id="8843" className="relative py-28 px-6 sm:px-8">
          <div className="max-w-[1200px] w-full mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              
              {/* Left Column */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={scrollReveal}
                className="flex flex-col justify-center"
              >
                <span className="step-badge mb-4" style={{ color: C.teal, borderColor: 'rgba(42,127,98,0.35)', background: 'rgba(42,127,98,0.12)' }}>
                  DOCUMENT COMPLIANCE
                </span>
                <h2 style={{ fontSize: 'clamp(2rem, 4.5vw, 3rem)', fontWeight: 900, color: '#ffffff', fontFamily: 'var(--font-heading)', marginTop: 8, marginBottom: 20, letterSpacing: '-0.03em' }}>
                  Original U.S. Form Auto-Filling
                </h2>
                <p style={{ color: C.muted, fontSize: 16, lineHeight: 1.8, marginBottom: 32 }}>
                  We use secure, client-side PDF document generation to populate your personal, academic, and visa entries directly into the official, interactive IRS Form 8843. No third-party data handlers, no black-box logic.
                </p>
                
                <div className="flex flex-col gap-4">
                  {[
                    'Bank-grade AES-256 encryption at rest',
                    'Direct local download of official IRS PDFs',
                    'Pre-configured defaults for UIC student visa holders'
                  ].map((pt, i) => (
                    <div key={i} className="flex items-center gap-3.5">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-teal-500/15 border border-teal-500/30 flex items-center justify-center">
                        <CheckCircle2 size={15} color={C.teal} />
                      </div>
                      <span style={{ fontSize: 15, color: '#f0eeee', fontWeight: 600 }}>{pt}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
              
              {/* Right Card Column */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={scrollReveal}
                className="flex items-center justify-center lg:justify-end"
              >
                <div
                  style={{
                    background: 'rgba(13,21,32,0.80)',
                    border: '1px solid rgba(83,145,150,0.22)',
                    borderRadius: 28,
                    padding: 40,
                    maxWidth: '500px',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 24,
                    backdropFilter: 'blur(24px)',
                    boxShadow: '0 24px 60px rgba(0,0,0,0.4)',
                  }}
                  className="hover:border-teal-500/30 transition-all duration-300"
                >
                  <div style={{ width: 54, height: 54, borderRadius: 16, background: `${C.teal}25`, border: `1px solid ${C.teal}40` }} className="flex items-center justify-center">
                    <Lock size={24} color={C.teal} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: 20, fontWeight: 800, color: '#ffffff', marginBottom: 10 }}>Secure Tax Identifier Storage</h3>
                    <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.7 }}>
                      Unlike commercial filing networks, we encrypt sensitive SSN/ITIN digits on-device using a cryptographic key before storing, ensuring complete PII compliance.
                    </p>
                  </div>
                </div>
              </motion.div>

            </div>
          </div>
        </section>

        {/* Divider Glow Line */}
        <div className="max-w-[1200px] mx-auto h-[1px] bg-gradient-to-r from-transparent via-teal-500/20 to-transparent my-4" />

        {/* 3. FAQ Section */}
        <section id="faq" className="relative py-28 px-6 sm:px-8">
          <div className="max-w-[840px] w-full mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={scrollReveal}
              className="text-center mb-16"
            >
              <span className="step-badge" style={{ color: C.pine, borderColor: 'rgba(83,128,131,0.30)', background: 'rgba(83,128,131,0.12)' }}>
                SUPPORT
              </span>
              <h2 style={{ fontSize: 'clamp(2rem, 4.5vw, 3rem)', fontWeight: 900, color: '#ffffff', fontFamily: 'var(--font-heading)', marginTop: 12, letterSpacing: '-0.03em' }}>
                Frequently Asked Questions
              </h2>
              <p style={{ color: C.muted, fontSize: 16, marginTop: 10 }}>
                Common international student tax questions answered clearly.
              </p>
            </motion.div>

            <div className="flex flex-col gap-4">
              {FAQS.map((faq, idx) => (
                <FaqItem key={idx} q={faq.q} a={faq.a} />
              ))}
            </div>
          </div>
        </section>

        {/* 4. Pre-Footer High Impact CTA */}
        <section className="relative py-24 px-6 sm:px-8">
          <div className="max-w-[1000px] mx-auto">
            <div
              style={{
                background: 'linear-gradient(135deg, rgba(83,145,150,0.15) 0%, rgba(42,127,98,0.10) 100%)',
                border: '1px solid rgba(83,145,150,0.28)',
                borderRadius: 32,
                padding: '56px 36px',
                backdropFilter: 'blur(20px)',
                textAlign: 'center',
                boxShadow: '0 32px 80px rgba(0,0,0,0.5)',
              }}
              className="flex flex-col items-center"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold tracking-wider mb-6">
                <Sparkles size={13}/> READY FOR TAX YEAR 2025
              </div>
              <h2 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: 900, color: '#ffffff', fontFamily: 'var(--font-heading)', letterSpacing: '-0.03em', marginBottom: 16 }}>
                Prepare Your Taxes with Zero Stress
              </h2>
              <p style={{ color: C.muted, fontSize: 16, maxWidth: 560, lineHeight: 1.7, marginBottom: 32 }}>
                Takes less than 10 minutes. Designed exclusively for F-1 visa holders at the University of Illinois Chicago.
              </p>
              <Link
                href="/register"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-bold text-white transition-all hover:scale-105"
                style={{ background: grad, boxShadow: '0 10px 36px rgba(83,128,131,0.45)', fontSize: 16 }}
              >
                Get Started Free <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="relative border-t border-white/10 bg-[#0a0f14] text-center">
          <div className="max-w-[1200px] mx-auto px-6 py-16 flex flex-col items-center">
            <div className="flex items-center gap-3 mb-4">
              <Logo />
              <span className="font-extrabold text-lg text-white">FTax Assistant</span>
            </div>
            <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.7, maxWidth: '520px' }}>
              FTax is an educational tax assistant platform built specifically for international students at UIC.<br />
              &copy; 2026 FTax Assistant. All rights reserved.
            </p>
          </div>
        </footer>

      </div>

      {/* ── Mobile Menu Slide-in Sheet ── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-45 bg-[#0a0f14]/80 backdrop-blur-[4px]"
              onClick={() => setMobileMenuOpen(false)}
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{
                type: 'tween',
                ease: mobileMenuOpen ? [0.22, 1, 0.36, 1] : [0.55, 0, 1, 0.45],
                duration: mobileMenuOpen ? 0.45 : 0.35,
              }}
              className="fixed right-0 top-0 bottom-0 z-50 h-[100dvh] flex flex-col"
              style={{
                width: 'min(88vw, 360px)',
                backgroundColor: '#0f1920',
                boxShadow: '-12px 0 48px rgba(0,0,0,0.4)',
                borderLeft: `1px solid ${C.border}`
              }}
            >
              <div className="flex justify-between items-center px-6 py-5">
                <Logo />
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5"
                  style={{ color: '#f0eeee' }}
                >
                  <X size={20} />
                </motion.button>
              </div>

              <div className="h-[1px] bg-white/10 mx-6 my-2" />

              <div className="flex flex-col gap-2 px-4 py-4 flex-grow">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.label}
                    initial={{ x: 24, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{
                      delay: 0.18 + i * 0.07,
                      duration: 0.4,
                      ease: [0.22, 1, 0.36, 1] as any,
                    }}
                  >
                    <a
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-[1.1rem] font-medium px-4 py-3 rounded-xl hover:bg-white/5 transition-colors"
                      style={{ color: C.muted }}
                    >
                      {link.label}
                    </a>
                  </motion.div>
                ))}
              </div>

              <div className="p-6 flex flex-col gap-3">
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-3.5 rounded-full font-semibold transition-all hover:brightness-110 text-white text-[0.95rem]"
                  style={{ background: grad }}
                >
                  Start For Free
                </Link>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-3.5 rounded-full font-semibold transition-all hover:bg-white/5 text-[0.95rem]"
                  style={{ backgroundColor: 'rgba(83,128,131,0.12)', border: `1px solid ${C.border}`, color: '#f0eeee' }}
                >
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
