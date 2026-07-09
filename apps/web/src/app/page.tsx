'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import {
  Shield, FileText, Globe, Calculator, CheckCircle, ArrowRight,
  Sparkles, Clock, Lock, ChevronDown, ChevronUp, GraduationCap,
  TrendingUp, Zap, Star, Menu, X
} from 'lucide-react';

// ─── Data ─────────────────────────────────────────────────────────────────────

const features = [
  {
    icon: Shield,
    color: 'from-indigo-500 to-violet-500',
    bg: 'rgba(99,102,241,0.1)',
    title: 'Residency Determination',
    description: 'Automatically calculates your tax residency using the Substantial Presence Test with step-by-step plain-English explanations.',
  },
  {
    icon: FileText,
    color: 'from-blue-500 to-cyan-500',
    bg: 'rgba(59,130,246,0.1)',
    title: 'Form 8843 Guidance',
    description: 'Every F-1 student must file Form 8843. We walk you through every field — no tax jargon, no confusion.',
  },
  {
    icon: Globe,
    color: 'from-violet-500 to-pink-500',
    bg: 'rgba(139,92,246,0.1)',
    title: 'Tax Treaty Detection',
    description: 'Students from India, China, South Korea and 60+ countries may qualify for exemptions. We check automatically.',
  },
  {
    icon: Calculator,
    color: 'from-emerald-500 to-teal-500',
    bg: 'rgba(16,185,129,0.1)',
    title: 'Tax Calculation',
    description: 'Step-by-step federal and Illinois state tax calculation. Every number explained — no black boxes.',
  },
  {
    icon: Lock,
    color: 'from-amber-500 to-orange-500',
    bg: 'rgba(245,158,11,0.1)',
    title: 'Bank-Grade Security',
    description: 'SSN/ITIN encrypted at rest with AES-256. JWT authentication. SOC 2 aligned. We never sell your data.',
  },
  {
    icon: Zap,
    color: 'from-rose-500 to-pink-500',
    bg: 'rgba(244,63,94,0.1)',
    title: 'Always Up to Date',
    description: 'Tax rules update every year. FTax stays current automatically — you never need to worry about outdated guidance.',
  },
];

const steps = [
  { n: '01', icon: GraduationCap, title: 'Create Account', body: 'Register with your UIC email in under 2 minutes. No credit card, always free.' },
  { n: '02', icon: FileText,     title: 'Enter Your Info', body: 'Tell us your visa status, arrival date, travel history, and income sources.' },
  { n: '03', icon: TrendingUp,   title: 'Get Your Status', body: "We determine whether you're a Nonresident or Resident Alien for tax purposes." },
  { n: '04', icon: CheckCircle,  title: 'Prepare & File', body: 'Download your personalized checklist, forms guide, and step-by-step filing instructions.' },
];

const faqs = [
  { q: 'Do I need to file taxes as an F-1 student?', a: "Yes — even with zero income. If you were in the U.S. during the tax year, you must file Form 8843 to declare your 'Exempt Individual' status. If you had income (stipend, fellowship, OPT wages), you'll also file Form 1040-NR." },
  { q: 'What is Form 8843 and why does it matter?', a: 'Form 8843 is an IRS statement confirming you are an exempt individual on an F-1 visa. Failing to file can jeopardize your immigration status and future visa applications. FTax makes completing it straightforward.' },
  { q: 'Is FTax a tax filing service?', a: 'No. FTax is an educational assistant — we help you understand your situation, identify the right forms, and prepare your information. You then submit directly to the IRS. We are not an IRS-authorized e-file provider.' },
  { q: 'Which countries have U.S. tax treaties?', a: 'India, China, South Korea, Canada, Germany, France, and many others. Treaties can exempt part or all of your scholarship or TA income from U.S. tax. FTax detects your eligibility automatically based on your country of tax residence.' },
  { q: 'Is my personal information safe?', a: 'Yes. Sensitive data like SSN/ITIN is encrypted at rest with AES-256. All connections use TLS. We follow SOC 2 security principles and never sell or share your information with third parties.' },
];

const stats = [
  { value: '2,400+', label: 'Students helped', suffix: '' },
  { value: '98%',    label: 'Accuracy rate',   suffix: '' },
  { value: '< 10',   label: 'Minutes to file-ready', suffix: 'min' },
  { value: '100%',   label: 'Free for UIC students', suffix: '' },
];

// ─── FAQ Item ─────────────────────────────────────────────────────────────────

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="border border-white/10 rounded-2xl overflow-hidden cursor-pointer group transition-all duration-200"
      style={{ background: open ? 'rgba(99,102,241,0.06)' : 'rgba(255,255,255,0.03)' }}
      onClick={() => setOpen(!open)}
    >
      <div className="flex items-center justify-between px-6 py-5">
        <span className="font-semibold text-white text-sm md:text-base pr-4">{q}</span>
        <div className={`size-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200 ${open ? 'bg-indigo-500' : 'bg-white/10 group-hover:bg-white/20'}`}>
          {open ? <ChevronUp className="size-4 text-white" /> : <ChevronDown className="size-4 text-white" />}
        </div>
      </div>
      {open && (
        <div className="px-6 pb-5 animate-fade-in">
          <p className="text-white/60 text-sm leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <div className="min-h-screen" style={{ background: '#050816', color: 'white' }}>

      {/* ─── Sticky Nav ─────────────────────────────────────────────────────── */}
      <nav
        className="sticky top-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? 'rgba(5,8,22,0.92)' : 'transparent',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.08)' : '1px solid transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
        }}
      >
        <div className="mx-auto max-w-7xl px-6 flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="size-8 rounded-xl flex items-center justify-center text-white font-bold text-sm transition-transform group-hover:scale-105"
              style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
              F
            </div>
            <span className="font-bold text-lg tracking-tight text-white">FTax</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {['Features', 'How it works', 'FAQ'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/ /g, '-')}`}
                className="nav-link text-sm text-white/60 hover:text-white transition-colors"
              >
                {item}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/login" className="hidden md:block">
              <button className="text-sm text-white/70 hover:text-white px-4 py-2 rounded-xl transition-colors hover:bg-white/8 font-medium">
                Sign in
              </button>
            </Link>
            <Link href="/register">
              <button
                className="btn-glow text-sm font-semibold px-5 py-2.5 rounded-xl text-white transition-all"
                style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}
              >
                Get started free
              </button>
            </Link>
            <button
              className="md:hidden p-2 rounded-xl hover:bg-white/10 transition-colors text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden px-6 pb-4 border-t border-white/10 animate-fade-in" style={{ background: 'rgba(5,8,22,0.98)' }}>
            <div className="flex flex-col gap-2 pt-4">
              {['Features', 'How it works', 'FAQ'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(/ /g, '-')}`}
                  className="text-white/70 hover:text-white py-2.5 text-sm font-medium transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
              <div className="divider-gradient my-2" />
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                <button className="w-full text-left text-white/70 hover:text-white py-2.5 text-sm font-medium transition-colors">Sign in</button>
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* ─── Hero ───────────────────────────────────────────────────────────── */}
      <section className="hero-section hero-grid relative pt-28 pb-32 px-6" id="hero">
        <div className="mx-auto max-w-5xl text-center relative z-10">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 animate-badge-pop"
            style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)' }}>
            <Sparkles className="size-3.5 text-indigo-400" />
            <span className="text-xs font-semibold text-indigo-300 tracking-wide uppercase">Built for UIC F-1 International Students</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl xl:text-8xl font-black text-white mb-6 animate-fade-in leading-[1.02]">
            U.S. taxes,{' '}
            <span className="gradient-text">finally<br className="hidden sm:block" /> clear</span>
          </h1>

          <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in animate-delay-200">
            FTax helps international students at the University of Illinois Chicago determine their
            tax residency status, complete Form 8843, and prepare for filing — in plain English.
            No jargon. No guesswork. No cost.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in animate-delay-300">
            <Link href="/register">
              <button
                className="btn-glow inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl text-white font-bold text-base transition-all"
                style={{ background: 'linear-gradient(135deg,#6366f1 0%,#8b5cf6 100%)', boxShadow: '0 8px 32px rgba(99,102,241,0.35)' }}
              >
                Start for free
                <ArrowRight className="size-4" />
              </button>
            </Link>
            <a href="#how-it-works">
              <button className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-white/80 hover:text-white font-semibold text-base transition-all hover:bg-white/8"
                style={{ border: '1px solid rgba(255,255,255,0.15)' }}>
                See how it works
              </button>
            </a>
          </div>

          {/* Trust signals */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-10 animate-fade-in animate-delay-400">
            {[
              { icon: Lock,   text: 'AES-256 encrypted' },
              { icon: Star,   text: 'Always free for UIC students' },
              { icon: Clock,  text: 'Ready in under 10 minutes' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-white/50 text-xs font-medium">
                <Icon className="size-3.5 text-indigo-400" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Preview card */}
        <div className="mx-auto max-w-2xl mt-20 animate-float animate-delay-500 relative z-10">
          <div className="glass-card-dark rounded-2xl overflow-hidden" style={{ boxShadow: '0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,102,241,0.2)' }}>
            {/* Window bar */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10">
              <div className="flex gap-1.5">
                <div className="size-3 rounded-full bg-red-400/80" />
                <div className="size-3 rounded-full bg-yellow-400/80" />
                <div className="size-3 rounded-full bg-green-400/80" />
              </div>
              <span className="text-xs text-white/40 font-mono mx-auto pr-8">FTax — Residency Check Result</span>
            </div>
            <div className="p-6 space-y-5">
              {/* Status row */}
              <div className="flex items-center gap-4 p-4 rounded-xl" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}>
                <div className="size-10 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="size-5 text-emerald-400" />
                </div>
                <div>
                  <p className="font-bold text-white text-sm">Nonresident Alien — Confirmed</p>
                  <p className="text-xs text-white/50 mt-0.5">F-1 students in first 5 years are exempt from Substantial Presence Test</p>
                </div>
              </div>
              {/* Stats grid */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Days in U.S.', value: '180', color: 'text-indigo-400' },
                  { label: 'Weighted total', value: '210', color: 'text-violet-400' },
                  { label: 'Forms needed', value: '2', color: 'text-cyan-400' },
                ].map((s) => (
                  <div key={s.label} className="text-center p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
                    <p className={`text-2xl font-black stat-number ${s.color}`}>{s.value}</p>
                    <p className="text-xs text-white/40 mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
              {/* Action items */}
              <div className="space-y-2">
                {['Form 8843 — Required (no income)', '1040-NR — Required (stipend received)', 'Tax Treaty — Check India–US treaty eligibility'].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-xs text-white/60">
                    <div className="size-1.5 rounded-full bg-indigo-400 flex-shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none" style={{ background: 'linear-gradient(to bottom, transparent, #050816)' }} />
      </section>

      {/* ─── Stats bar ──────────────────────────────────────────────────────── */}
      <section className="py-16 px-6" style={{ background: '#07091a', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="mx-auto max-w-5xl grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-3xl md:text-4xl font-black gradient-text stat-number mb-1">{s.value}</p>
              <p className="text-sm text-white/50 font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Features ───────────────────────────────────────────────────────── */}
      <section id="features" className="py-28 px-6" style={{ background: '#050816' }}>
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-5 text-xs font-semibold text-indigo-400 tracking-widest uppercase"
              style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)' }}>
              Features
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-5">
              Everything you need to file<br />
              <span className="gradient-text">with total confidence</span>
            </h2>
            <p className="text-white/50 max-w-xl mx-auto text-lg">
              Built specifically for F-1 students at UIC — not a generic tool that leaves you guessing.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children">
            {features.map(({ icon: Icon, color, bg, title, description }) => (
              <div
                key={title}
                className="glass-card-dark feature-card p-6 rounded-2xl animate-fade-in-up cursor-default"
              >
                <div className="size-12 rounded-2xl flex items-center justify-center mb-5"
                  style={{ background: bg, border: `1px solid ${bg}` }}>
                  <Icon className="size-5" style={{ color: bg.includes('indigo') ? '#818cf8' : bg.includes('blue') ? '#60a5fa' : bg.includes('violet') ? '#a78bfa' : bg.includes('emerald') ? '#34d399' : bg.includes('amber') ? '#fbbf24' : '#fb7185' }} />
                </div>
                <h3 className="font-bold text-white mb-2 text-base">{title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How it works ───────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-28 px-6" style={{ background: '#07091a' }}>
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-5 text-xs font-semibold text-violet-400 tracking-widest uppercase"
              style={{ background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)' }}>
              How it works
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-5">
              From confused to <span className="gradient-text">filing-ready</span><br />in 4 simple steps
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map(({ n, icon: Icon, title, body }, i) => (
              <div key={n} className="relative group">
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-6 left-[calc(100%-0px)] w-full h-px z-0 step-connector" />
                )}
                <div className="relative z-10 glass-card-dark p-6 rounded-2xl text-center hover:border-indigo-500/40 transition-all">
                  <div className="size-12 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-transform group-hover:scale-110"
                    style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2))', border: '1px solid rgba(99,102,241,0.3)' }}>
                    <Icon className="size-5 text-indigo-400" />
                  </div>
                  <div className="text-xs font-black text-indigo-500 mb-2 tracking-widest">{n}</div>
                  <h3 className="font-bold text-white mb-2">{title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ ────────────────────────────────────────────────────────────── */}
      <section id="faq" className="py-28 px-6" style={{ background: '#050816' }}>
        <div className="mx-auto max-w-3xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-5 text-xs font-semibold text-cyan-400 tracking-widest uppercase"
              style={{ background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.2)' }}>
              FAQ
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              Common questions
            </h2>
            <p className="text-white/50">Everything you need to know before getting started.</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq) => (
              <FaqItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ────────────────────────────────────────────────────────────── */}
      <section className="py-28 px-6" style={{ background: '#07091a' }}>
        <div className="mx-auto max-w-4xl">
          <div className="relative rounded-3xl overflow-hidden p-12 md:p-16 text-center"
            style={{
              background: 'linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(139,92,246,0.1) 50%, rgba(34,211,238,0.08) 100%)',
              border: '1px solid rgba(99,102,241,0.3)',
              boxShadow: '0 0 80px rgba(99,102,241,0.12) inset',
            }}>
            {/* Background glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(ellipse, rgba(99,102,241,0.2), transparent)', filter: 'blur(40px)' }} />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
                style={{ background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.4)' }}>
                <Star className="size-3.5 text-yellow-400 fill-yellow-400" />
                <span className="text-xs font-bold text-white/80">Trusted by UIC international students</span>
              </div>

              <h2 className="text-4xl md:text-5xl font-black text-white mb-5 leading-tight">
                Ready to make taxes<br />
                <span className="gradient-text">simple?</span>
              </h2>
              <p className="text-white/60 mb-10 max-w-lg mx-auto text-lg">
                Join thousands of UIC F-1 students who've used FTax to demystify U.S. taxes.
                Always free. Always clear.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/register">
                  <button
                    className="btn-glow inline-flex items-center gap-2.5 px-10 py-4 rounded-2xl text-white font-bold text-base"
                    style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', boxShadow: '0 8px 32px rgba(99,102,241,0.4)' }}
                  >
                    Create free account
                    <ArrowRight className="size-4" />
                  </button>
                </Link>
                <p className="text-white/40 text-sm">No credit card · UIC email required · 2 min setup</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Footer ─────────────────────────────────────────────────────────── */}
      <footer className="px-6 py-12" style={{ background: '#030510', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <div className="size-8 rounded-xl flex items-center justify-center text-white font-bold text-sm"
                style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
                F
              </div>
              <span className="font-bold text-white">FTax</span>
            </div>

            {/* Links */}
            <div className="flex items-center gap-6 text-xs text-white/40">
              <a href="#features" className="hover:text-white/70 transition-colors">Features</a>
              <a href="#faq" className="hover:text-white/70 transition-colors">FAQ</a>
              <Link href="/login" className="hover:text-white/70 transition-colors">Sign in</Link>
              <Link href="/register" className="hover:text-white/70 transition-colors">Register</Link>
            </div>

            {/* Disclaimer */}
            <p className="text-xs text-white/30 text-center md:text-right max-w-xs">
              Not tax advice · Educational tool only · © 2025 FTax
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
