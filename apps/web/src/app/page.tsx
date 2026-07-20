'use client';
import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRightCircle, Shield, Calculator, FileText, Globe,
  Menu, X, ChevronDown, ChevronUp, Clock, HelpCircle,
  Sparkles, CheckCircle2, ChevronRight, Lock
} from 'lucide-react';
import { C, grad, gradText } from '@/lib/api';

/* ── Custom Logo (filled with brand color) ── */
function Logo() {
  return (
    <svg width="32" height="32" viewBox="0 0 256 256" fill={C.pine}>
      <path d="M 64 128 L 64.5 128 L 32 95 L 0 64 L 0 0 L 64 0 L 128 64 L 128 64.5 L 161 32 L 192 0 L 256 0 L 256 64 L 192 128 L 128 128 L 128 192 L 96 223 L 63.5 256 L 0 256 L 0 192 Z M 256 192 L 224 223 L 191.5 256 L 128 256 L 128 192 L 192 128 L 256 128 Z" />
    </svg>
  );
}

/* ── Animation Variants ── */
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.12,
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as any,
    },
  }),
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
      style={{ background: 'rgba(83,128,131,0.04)', border: `1px solid ${open ? 'rgba(83,128,131,0.3)' : C.border}`, borderRadius: 14, cursor: 'pointer', transition: 'all .2s' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 22px' }}>
        <span style={{ fontWeight: 600, fontSize: 15, color: '#f0eeee' }}>{q}</span>
        {open ? <ChevronUp size={16} color={C.teal}/> : <ChevronDown size={16} color={C.muted}/>}
      </div>
      {open && <p style={{ padding: '0 22px 18px', color: C.muted, fontSize: 13, lineHeight: 1.7 }}>{a}</p>}
    </div>
  );
}

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Residency', href: '#residency' },
    { label: 'Form 8843', href: '#8843' },
    { label: 'Treaty Check', href: '#treaty' },
    { label: 'FAQ', href: '#faq' }
  ];

  return (
    <div className="relative w-full min-h-screen overflow-x-hidden bg-[#0a0f14]" style={{ fontFamily: 'var(--font-body)', color: '#f0eeee' }}>
      
      {/* ── HERO VIEWPORT CONTAINER (Height minimum 100vh for landing feel) ── */}
      <div className="relative w-full min-h-screen flex flex-col justify-between">
        
        {/* Background video with overlay */}
        <video autoPlay muted loop playsInline className="absolute inset-0 z-0 w-full h-full object-cover">
          <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260606_131516_eca35265-ea66-4fbd-8d52-22aae6e1a503.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-[#0a0f14]/90 z-10" />

        {/* Navbar */}
        <header className="relative z-20 w-full">
          <div className="max-w-[1280px] mx-auto px-5 sm:px-8 py-4 sm:py-5 flex justify-between items-center">
            <Link href="/" className="flex items-center">
              <Logo />
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm font-medium transition-opacity hover:opacity-70"
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
                style={{ background: grad }}
              >
                Start For Free
              </Link>
              <Link
                href="/login"
                className="text-sm font-semibold px-5 py-2.5 rounded-full transition-all duration-200 hover:shadow-md active:scale-95"
                style={{ backgroundColor: 'rgba(83,128,131,0.12)', border: `1px solid ${C.border}`, color: '#f0eeee' }}
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
        <main className="relative z-20 max-w-[1280px] mx-auto px-5 sm:px-8 flex-grow flex flex-col items-center justify-center">
          <div className="max-w-[680px] w-full flex flex-col items-center text-center">
            {/* Tagline */}
            <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible" className="mb-4">
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', padding: '5px 14px', borderRadius: 999, background: `${C.teal}1a`, border: `1px solid ${C.teal}40`, color: C.teal }}>UIC F-1 TAX ASSISTANT</span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              custom={1}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="font-bold tracking-[-0.01em] mb-6"
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(1.8rem, 5vw, 3.2rem)',
                lineHeight: '1.05',
                color: '#f0eeee',
              }}
            >
              Lock{' '}
              <Shield
                size={28}
                style={{
                  display: 'inline',
                  verticalAlign: 'middle',
                  position: 'relative',
                  top: '-2px',
                  color: C.pine,
                  margin: '0 4px',
                }}
              />{' '}
              Down Your{' '}
              <Calculator
                size={28}
                style={{
                  display: 'inline',
                  verticalAlign: 'middle',
                  position: 'relative',
                  top: '-2px',
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
              className="max-w-[560px] mb-8"
              style={{
                fontSize: 'clamp(0.9rem, 2.5vw, 1.05rem)',
                lineHeight: '1.65',
                color: C.muted,
              }}
            >
              Determine your tax residency status, auto-fill your official Form 8843 statement, and check eligible treaty benefits. Simple, secure, and built specifically for UIC international students.
            </motion.p>

            {/* CTA */}
            <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible">
              <motion.div whileHover={{ scale: 1.04, filter: 'brightness(1.1)' }} whileTap={{ scale: 0.96 }}>
                <Link
                  href="/register"
                  className="inline-flex justify-between items-center rounded-full text-white font-semibold transition-all"
                  style={{
                    background: grad,
                    fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                    padding: '17px 28px',
                    minWidth: '230px',
                    boxShadow: '0 4px 24px rgba(83,128,131,0.28)',
                    gap: '32px',
                  }}
                >
                  <span>Get Started Free</span>
                  <ArrowRightCircle size={20} />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </main>

        {/* Scroll prompt anchor */}
        <div className="relative z-20 w-full text-center pb-8 flex flex-col items-center gap-2">
          <span style={{ fontSize: 11, color: C.muted, letterSpacing: '0.05em' }}>SCROLL TO LEARN MORE</span>
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-5 h-5 flex items-center justify-center">
            <ChevronDown size={16} color={C.muted} />
          </motion.div>
        </div>
      </div>

      {/* ── SCROLLABLE SECTIONS ── */}
      
      {/* 1. The 4 Steps Grid */}
      <section id="residency" className="py-24 border-t border-[#838083]/10 bg-[#0f1920]/40">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="text-center mb-16">
            <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', fontWeight: 800, color: '#f0eeee', fontFamily: 'var(--font-heading)' }}>How It Works</h2>
            <p style={{ color: C.muted, fontSize: 14, marginTop: 8 }}>From start to filing-ready in 4 simple checkpoints.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Residency Check', desc: 'Run the Substantial Presence Test dynamically.', icon: Shield, color: C.pine },
              { step: '02', title: 'Form 8843 Filler', desc: 'Generate and pre-fill the official IRS PDF statement.', icon: FileText, color: C.teal },
              { step: '03', title: 'Treaty Lookup', desc: 'Find country-specific student exemptions.', icon: Globe, color: C.pine },
              { step: '04', title: 'Tax Estimator', desc: 'Calculate federal and Illinois state allocations.', icon: Calculator, color: C.teal },
            ].map((s, idx) => (
              <div key={idx} style={{ background: 'rgba(83,128,131,0.04)', border: `1px solid ${C.border}`, borderRadius: 18, padding: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 28, fontWeight: 900, color: `${s.color}60` }}>{s.step}</span>
                  <s.icon size={20} color={s.color} />
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#f0eeee' }}>{s.title}</h3>
                <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Feature Deep Dive */}
      <section id="8843" className="py-24 border-t border-[#838083]/10">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-16 items-center">
            <div className="flex-1">
              <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', fontWeight: 800, color: '#f0eeee', fontFamily: 'var(--font-heading)', marginBottom: 16 }}>Original U.S. Form Auto-Filling</h2>
              <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.7, marginBottom: 20 }}>
                We use secure, client-side PDF document generation to populate your personal, academic, and visa entries directly into the official, interactive IRS Form 8843. No third-party data handlers, no black-box logic.
              </p>
              <div className="flex flex-col gap-3">
                {['Bank-grade AES-256 encryption at rest', 'Direct local download of official IRS PDFs', 'Pre-configured defaults for UIC student visa holders'].map((pt, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 size={16} color={C.teal} />
                    <span style={{ fontSize: 13, color: '#f0eeee', fontWeight: 500 }}>{pt}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex-1 w-full max-w-[480px]">
              <div style={{ background: 'rgba(42,127,98,0.04)', border: '1px solid rgba(42,127,98,0.22)', borderRadius: 20, padding: 32, display: 'flex', flexDirection: 'column', gap: 16 }}>
                <Lock size={32} color={C.teal} />
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#f0eeee' }}>Secure Tax Identifier Storage</h3>
                <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.6 }}>
                  Unlike commercial filing networks, we encrypt sensitive SSN/ITIN digits on-device using a cryptographic key before storing, ensuring PII compliance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FAQ Section */}
      <section id="faq" className="py-24 border-t border-[#838083]/10 bg-[#0f1920]/40">
        <div className="max-w-[760px] mx-auto px-6">
          <div className="text-center mb-16">
            <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', fontWeight: 800, color: '#f0eeee', fontFamily: 'var(--font-heading)' }}>FAQ</h2>
            <p style={{ color: C.muted, fontSize: 14, marginTop: 8 }}>Common student tax questions answered simply.</p>
          </div>

          <div className="flex flex-col gap-4">
            {FAQS.map((faq, idx) => (
              <FaqItem key={idx} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-12 border-t border-[#838083]/10 text-center">
        <div className="max-w-[1280px] mx-auto px-6">
          <Logo />
          <p style={{ color: C.muted, fontSize: 12, marginTop: 16, lineHeight: 1.6 }}>
            FTax is an educational assistant platform for international students at UIC.<br />
            &copy; 2026 FTax Assistant. All rights reserved.
          </p>
        </div>
      </footer>

      {/* ── Mobile Menu Slide-in Sheet ── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-40 bg-[#0a0f14]/80 backdrop-blur-[4px]"
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
