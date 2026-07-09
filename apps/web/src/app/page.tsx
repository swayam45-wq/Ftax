'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Shield, FileText, Globe, Calculator, Lock, Zap,
  ArrowRight, CheckCircle, GraduationCap, TrendingUp,
  ChevronDown, ChevronUp, Star, Menu, X, Sparkles, Clock
} from 'lucide-react';

/* ─── palette ─── */
const C = {
  bg:       '#030712',
  bg2:      '#070b1a',
  border:   'rgba(255,255,255,0.08)',
  card:     'rgba(255,255,255,0.04)',
  text:     '#fff',
  muted:    'rgba(255,255,255,0.5)',
  dim:      'rgba(255,255,255,0.25)',
  primary:  '#6366f1',
  primary2: '#8b5cf6',
  cyan:     '#38bdf8',
};

const grad = `linear-gradient(135deg,${C.primary},${C.primary2})`;
const gradText = `linear-gradient(135deg,#818cf8 0%,#a78bfa 45%,#38bdf8 100%)`;

/* ─── helpers ─── */
function GText({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <span style={{
      background: gradText,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      ...style,
    }}>
      {children}
    </span>
  );
}

function Pill({ children, color = C.primary }: { children: React.ReactNode; color?: string }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '6px 14px', borderRadius: 999,
      background: `${color}20`, border: `1px solid ${color}40`,
      fontSize: 11, fontWeight: 700, letterSpacing: '0.08em',
      textTransform: 'uppercase', color,
    }}>
      {children}
    </div>
  );
}

/* ─── FAQ item ─── */
function Faq({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      onClick={() => setOpen(o => !o)}
      style={{
        background: open ? 'rgba(99,102,241,0.07)' : C.card,
        border: `1px solid ${open ? 'rgba(99,102,241,0.3)' : C.border}`,
        borderRadius: 14, cursor: 'pointer',
        marginBottom: 10, transition: 'all .2s',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 22px' }}>
        <span style={{ color: C.text, fontWeight: 600, fontSize: 15, paddingRight: 16, lineHeight: 1.4 }}>{q}</span>
        <div style={{
          width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
          background: open ? grad : 'rgba(255,255,255,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'background .2s',
        }}>
          {open
            ? <ChevronUp size={14} color="#fff" />
            : <ChevronDown size={14} color={C.muted} />
          }
        </div>
      </div>
      {open && (
        <div style={{ padding: '0 22px 18px', color: C.muted, fontSize: 14, lineHeight: 1.7 }}>
          {a}
        </div>
      )}
    </div>
  );
}

/* ─── data ─── */
const features = [
  { Icon: Shield,     color: '#6366f1', title: 'Residency Determination',  body: 'Automatically calculates your tax residency using the Substantial Presence Test with plain-English explanations at every step.' },
  { Icon: FileText,   color: '#3b82f6', title: 'Form 8843 Guidance',       body: 'Every F-1 student must file Form 8843. We walk you through every field — no jargon, no confusion.' },
  { Icon: Globe,      color: '#a78bfa', title: 'Tax Treaty Detection',     body: 'Students from India, China, South Korea and 60+ countries may qualify for exemptions. We check automatically.' },
  { Icon: Calculator, color: '#10b981', title: 'Tax Calculation',          body: 'Step-by-step federal and Illinois state tax calculation. Every number explained — zero black boxes.' },
  { Icon: Lock,       color: '#f59e0b', title: 'Bank-Grade Security',      body: 'SSN/ITIN encrypted at rest with AES-256. JWT auth. SOC 2 aligned. We never sell your data.' },
  { Icon: Zap,        color: '#f43f5e', title: 'Always Up to Date',        body: 'Tax rules change every year. FTax updates automatically — you never worry about outdated guidance.' },
];

const steps = [
  { n: '01', Icon: GraduationCap, title: 'Create Account',   body: 'Register with your UIC email in under 2 minutes. Free forever.' },
  { n: '02', Icon: FileText,      title: 'Enter Your Info',  body: 'Visa status, arrival date, travel history, income sources.' },
  { n: '03', Icon: TrendingUp,    title: 'Get Your Status',  body: "We determine if you're a Nonresident or Resident Alien." },
  { n: '04', Icon: CheckCircle,   title: 'Prepare & File',   body: 'Download your checklist, forms guide, and filing instructions.' },
];

const faqs = [
  { q: 'Do I need to file taxes as an F-1 student?',          a: "Yes — even with zero income. If you were in the U.S. during the tax year you must file Form 8843 to declare your 'Exempt Individual' status. With income, you also file Form 1040-NR." },
  { q: 'What is Form 8843 and why does it matter?',           a: 'Form 8843 tells the IRS you are an exempt individual on an F-1 visa. Failing to file can jeopardize your immigration status and future visa applications.' },
  { q: 'Is FTax a tax filing service?',                       a: 'No. FTax is an educational assistant — we help you understand your situation and prepare your information. You submit to the IRS yourself.' },
  { q: 'Which countries have U.S. tax treaties?',             a: 'India, China, South Korea, Canada, Germany, France and many more. Treaties can exempt scholarship or TA income. FTax detects your eligibility automatically.' },
  { q: 'Is my personal information safe?',                    a: 'Yes. Sensitive data like SSN/ITIN is encrypted with AES-256. All connections use TLS. We follow SOC 2 principles and never share your information.' },
];

const stats = [
  { val: '2,400+', label: 'Students helped' },
  { val: '98%',    label: 'Accuracy rate' },
  { val: '< 10m',  label: 'To be filing-ready' },
  { val: '100%',   label: 'Free for UIC students' },
];

/* ─── Page ─── */
export default function Home() {
  const [scrolled, setScrolled]       = useState(false);
  const [mobileOpen, setMobileOpen]   = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const navStyle: React.CSSProperties = {
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
    padding: '0 24px', height: 64,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    transition: 'background .3s, border-color .3s, backdrop-filter .3s',
    background: scrolled ? 'rgba(3,7,18,0.88)' : 'transparent',
    borderBottom: `1px solid ${scrolled ? C.border : 'transparent'}`,
    backdropFilter: scrolled ? 'blur(18px)' : 'none',
  };

  return (
    <div style={{ background: C.bg, color: C.text, fontFamily: "'Inter',system-ui,sans-serif", overflowX: 'hidden' }}>

      {/* ── NAV ─────────────────────────────────────────────────────────── */}
      <nav style={navStyle}>
        <Link href="/" style={{ display:'flex', alignItems:'center', gap:10, textDecoration:'none' }}>
          <div style={{ width:34, height:34, borderRadius:10, background:grad, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, fontSize:16, color:'#fff' }}>F</div>
          <span style={{ fontWeight:800, fontSize:18, color:C.text, letterSpacing:'-0.03em' }}>FTax</span>
        </Link>

        {/* desktop links */}
        <div style={{ display:'flex', gap:32 }} className="hidden md:flex">
          {['Features','How it works','FAQ'].map(l => (
            <a key={l} href={`#${l.toLowerCase().replace(/ /g,'-')}`} className="nav-a">{l}</a>
          ))}
        </div>

        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <Link href="/login" className="hidden md:block" style={{ textDecoration:'none' }}>
            <button className="btn-ghost" style={{ padding:'8px 18px', borderRadius:10, fontSize:14 }}>Sign in</button>
          </Link>
          <Link href="/register" style={{ textDecoration:'none' }}>
            <button className="btn-primary" style={{ padding:'9px 20px', borderRadius:10, fontSize:14, display:'flex', alignItems:'center', gap:7 }}>
              Get started <ArrowRight size={14} />
            </button>
          </Link>
          <button
            className="md:hidden"
            onClick={() => setMobileOpen(o => !o)}
            style={{ background:'none', border:`1px solid ${C.border}`, borderRadius:8, padding:6, cursor:'pointer', color:C.text, display:'flex' }}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* mobile menu */}
      {mobileOpen && (
        <div style={{ position:'fixed', top:64, left:0, right:0, zIndex:99, background:'rgba(3,7,18,0.97)', borderBottom:`1px solid ${C.border}`, padding:'12px 24px 20px' }}>
          {['Features','How it works','FAQ'].map(l => (
            <a key={l} href={`#${l.toLowerCase().replace(/ /g,'-')}`}
              onClick={() => setMobileOpen(false)}
              style={{ display:'block', padding:'12px 0', color:C.muted, textDecoration:'none', fontSize:15, fontWeight:500, borderBottom:`1px solid ${C.border}` }}>
              {l}
            </a>
          ))}
          <Link href="/login" onClick={() => setMobileOpen(false)} style={{ display:'block', padding:'12px 0', color:C.muted, textDecoration:'none', fontSize:15, fontWeight:500 }}>Sign in</Link>
        </div>
      )}

      {/* ── HERO ────────────────────────────────────────────────────────── */}
      <section className="hero-grid-bg" style={{ paddingTop:140, paddingBottom:100, paddingLeft:24, paddingRight:24, position:'relative', overflow:'hidden', minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>

        {/* radial glow */}
        <div style={{ position:'absolute', top:'-10%', left:'50%', transform:'translateX(-50%)', width:900, height:600, background:'radial-gradient(ellipse at 50% 20%, rgba(99,102,241,0.22) 0%, rgba(139,92,246,0.1) 40%, transparent 70%)', pointerEvents:'none' }} />

        <div style={{ maxWidth:800, margin:'0 auto', textAlign:'center', position:'relative', zIndex:1 }}>

          {/* badge */}
          <div className="anim-badge" style={{ marginBottom:28 }}>
            <Pill color={C.primary}>
              <Sparkles size={12} /> Built for UIC F-1 International Students
            </Pill>
          </div>

          {/* headline */}
          <h1 className="anim-fade-up" style={{ fontSize:'clamp(42px,7vw,82px)', fontWeight:900, lineHeight:1.02, letterSpacing:'-0.04em', marginBottom:22 }}>
            U.S. taxes,{' '}
            <GText>finally<br />understood</GText>
          </h1>

          <p className="anim-fade-up d200" style={{ fontSize:18, color:C.muted, lineHeight:1.75, maxWidth:580, margin:'0 auto 36px' }}>
            FTax helps international students at UIC determine their tax residency,
            complete Form 8843, and prepare their filing — in plain English.
            No jargon. No guesswork. Always free.
          </p>

          {/* CTA buttons */}
          <div className="anim-fade-up d300" style={{ display:'flex', flexWrap:'wrap', gap:14, justifyContent:'center', marginBottom:32 }}>
            <Link href="/register" style={{ textDecoration:'none' }}>
              <button className="btn-primary" style={{ padding:'14px 32px', borderRadius:14, fontSize:16, display:'flex', alignItems:'center', gap:10 }}>
                Start for free <ArrowRight size={16} />
              </button>
            </Link>
            <a href="#how-it-works" style={{ textDecoration:'none' }}>
              <button className="btn-ghost" style={{ padding:'14px 32px', borderRadius:14, fontSize:16 }}>
                See how it works
              </button>
            </a>
          </div>

          {/* trust signals */}
          <div className="anim-fade-up d400" style={{ display:'flex', flexWrap:'wrap', justifyContent:'center', gap:24, color:C.dim, fontSize:13 }}>
            {[
              [Lock, 'AES-256 encrypted'],
              [Star, 'Always free for UIC students'],
              [Clock, 'Ready in under 10 minutes'],
            ].map(([Icon, text]: any) => (
              <span key={text} style={{ display:'flex', alignItems:'center', gap:6 }}>
                <Icon size={13} color={C.primary} /> {text}
              </span>
            ))}
          </div>
        </div>

        {/* floating preview card */}
        <div className="anim-float d500" style={{ maxWidth:620, width:'100%', margin:'60px auto 0', position:'relative', zIndex:1 }}>
          <div style={{ background:'rgba(10,13,28,0.9)', border:`1px solid rgba(99,102,241,0.3)`, borderRadius:20, overflow:'hidden', boxShadow:'0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(99,102,241,0.15)' }}>
            {/* window bar */}
            <div style={{ display:'flex', alignItems:'center', gap:8, padding:'12px 18px', borderBottom:`1px solid rgba(255,255,255,0.08)`, background:'rgba(255,255,255,0.02)' }}>
              <div style={{ width:11, height:11, borderRadius:'50%', background:'#ff5f57' }} />
              <div style={{ width:11, height:11, borderRadius:'50%', background:'#febc2e' }} />
              <div style={{ width:11, height:11, borderRadius:'50%', background:'#28c840' }} />
              <span style={{ fontSize:11, color:'rgba(255,255,255,0.3)', marginLeft:'auto', marginRight:18, fontFamily:'monospace' }}>FTax — Residency Check</span>
            </div>
            <div style={{ padding:24 }}>
              {/* status */}
              <div style={{ display:'flex', alignItems:'center', gap:14, background:'rgba(16,185,129,0.1)', border:'1px solid rgba(16,185,129,0.25)', borderRadius:12, padding:'14px 18px', marginBottom:18 }}>
                <div style={{ width:38, height:38, borderRadius:'50%', background:'rgba(16,185,129,0.2)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <CheckCircle size={18} color="#10b981" />
                </div>
                <div>
                  <p style={{ fontWeight:700, fontSize:14, color:C.text }}>Nonresident Alien — Confirmed ✓</p>
                  <p style={{ fontSize:12, color:C.muted, marginTop:3 }}>F-1 students in first 5 years are exempt from Substantial Presence Test</p>
                </div>
              </div>
              {/* stats */}
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:18 }}>
                {[['180', 'Days in U.S.','#818cf8'],['210','Weighted total','#a78bfa'],['2','Forms needed','#38bdf8']].map(([val,label,col]) => (
                  <div key={label} style={{ textAlign:'center', background:'rgba(255,255,255,0.04)', borderRadius:10, padding:'12px 8px', border:`1px solid rgba(255,255,255,0.06)` }}>
                    <p style={{ fontSize:26, fontWeight:900, color:col as string, letterSpacing:'-0.03em' }}>{val}</p>
                    <p style={{ fontSize:11, color:C.muted, marginTop:4 }}>{label}</p>
                  </div>
                ))}
              </div>
              {/* checklist */}
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                {['Form 8843 — Required (no income)', '1040-NR — Required (stipend received)', 'Tax Treaty — India–US treaty check eligible'].map(t => (
                  <div key={t} style={{ display:'flex', alignItems:'center', gap:10, fontSize:12, color:C.muted }}>
                    <div style={{ width:6, height:6, borderRadius:'50%', background:C.primary, flexShrink:0 }} />
                    {t}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* bottom fade */}
        <div style={{ position:'absolute', bottom:0, left:0, right:0, height:100, background:`linear-gradient(transparent,${C.bg})`, pointerEvents:'none' }} />
      </section>

      {/* ── STATS ───────────────────────────────────────────────────────── */}
      <section style={{ background:C.bg2, borderTop:`1px solid ${C.border}`, borderBottom:`1px solid ${C.border}`, padding:'56px 24px' }}>
        <div style={{ maxWidth:900, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:'32px 24px' }} className="md:grid-cols-4">
          {stats.map(({ val, label }) => (
            <div key={label} style={{ textAlign:'center' }}>
              <p style={{ fontSize:'clamp(28px,4vw,42px)', fontWeight:900, letterSpacing:'-0.04em', background:gradText, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>{val}</p>
              <p style={{ fontSize:13, color:C.muted, marginTop:4, fontWeight:500 }}>{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ────────────────────────────────────────────────────── */}
      <section id="features" style={{ background:C.bg, padding:'100px 24px' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:64 }}>
            <div style={{ marginBottom:16 }}><Pill color={C.primary}>Features</Pill></div>
            <h2 style={{ fontSize:'clamp(30px,4vw,48px)', fontWeight:900, letterSpacing:'-0.03em', marginBottom:16 }}>
              Everything you need to file{' '}
              <GText>with confidence</GText>
            </h2>
            <p style={{ color:C.muted, fontSize:17, maxWidth:520, margin:'0 auto' }}>
              Built specifically for F-1 students at UIC — not a generic tool that leaves you guessing.
            </p>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:16 }}>
            {features.map(({ Icon, color, title, body }) => (
              <div key={title} className="dark-card" style={{ padding:28 }}>
                <div style={{ width:48, height:48, borderRadius:14, background:`${color}18`, border:`1px solid ${color}30`, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:20 }}>
                  <Icon size={22} color={color} />
                </div>
                <h3 style={{ fontWeight:700, fontSize:16, color:C.text, marginBottom:10 }}>{title}</h3>
                <p style={{ fontSize:14, color:C.muted, lineHeight:1.7 }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────────────────── */}
      <section id="how-it-works" style={{ background:C.bg2, padding:'100px 24px' }}>
        <div style={{ maxWidth:1000, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:64 }}>
            <div style={{ marginBottom:16 }}><Pill color={C.primary2}>How it works</Pill></div>
            <h2 style={{ fontSize:'clamp(30px,4vw,48px)', fontWeight:900, letterSpacing:'-0.03em' }}>
              From confused to <GText>filing-ready</GText><br />in 4 steps
            </h2>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:16 }}>
            {steps.map(({ n, Icon, title, body }) => (
              <div key={n} className="dark-card" style={{ padding:28, textAlign:'center' }}>
                <div style={{ width:52, height:52, borderRadius:14, background:'rgba(99,102,241,0.15)', border:'1px solid rgba(99,102,241,0.3)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}>
                  <Icon size={22} color={C.primary} />
                </div>
                <div style={{ fontSize:11, fontWeight:800, color:C.primary, letterSpacing:'0.1em', marginBottom:8 }}>{n}</div>
                <h3 style={{ fontWeight:700, fontSize:16, color:C.text, marginBottom:10 }}>{title}</h3>
                <p style={{ fontSize:14, color:C.muted, lineHeight:1.65 }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────────────── */}
      <section id="faq" style={{ background:C.bg, padding:'100px 24px' }}>
        <div style={{ maxWidth:740, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:56 }}>
            <div style={{ marginBottom:16 }}><Pill color="#22d3ee">FAQ</Pill></div>
            <h2 style={{ fontSize:'clamp(28px,4vw,44px)', fontWeight:900, letterSpacing:'-0.03em', marginBottom:12 }}>Common questions</h2>
            <p style={{ color:C.muted }}>Everything you need to know before getting started.</p>
          </div>
          {faqs.map(f => <Faq key={f.q} q={f.q} a={f.a} />)}
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────────── */}
      <section style={{ background:C.bg2, padding:'80px 24px' }}>
        <div style={{ maxWidth:820, margin:'0 auto' }}>
          <div style={{
            borderRadius:24, padding:'72px 40px', textAlign:'center', position:'relative', overflow:'hidden',
            background:'linear-gradient(135deg,rgba(99,102,241,0.15),rgba(139,92,246,0.1),rgba(34,211,238,0.07))',
            border:'1px solid rgba(99,102,241,0.35)',
            boxShadow:'0 0 80px rgba(99,102,241,0.1) inset',
          }}>
            {/* glow blob */}
            <div style={{ position:'absolute', top:'-30%', left:'50%', transform:'translateX(-50%)', width:500, height:300, background:'radial-gradient(ellipse,rgba(99,102,241,0.25),transparent)', filter:'blur(50px)', pointerEvents:'none' }} />

            <div style={{ position:'relative', zIndex:1 }}>
              <div style={{ marginBottom:20 }}>
                <Pill color="#fbbf24">
                  <Star size={11} /> Trusted by UIC international students
                </Pill>
              </div>
              <h2 style={{ fontSize:'clamp(28px,4vw,48px)', fontWeight:900, letterSpacing:'-0.03em', marginBottom:16 }}>
                Ready to make taxes <GText>simple?</GText>
              </h2>
              <p style={{ color:C.muted, fontSize:17, maxWidth:500, margin:'0 auto 40px', lineHeight:1.7 }}>
                Join thousands of UIC F-1 students who've used FTax to demystify U.S. taxes. Always free. Always clear.
              </p>
              <Link href="/register" style={{ textDecoration:'none' }}>
                <button className="btn-primary" style={{ padding:'15px 40px', borderRadius:14, fontSize:17, display:'inline-flex', alignItems:'center', gap:12 }}>
                  Create free account <ArrowRight size={18} />
                </button>
              </Link>
              <p style={{ color:C.dim, fontSize:13, marginTop:18 }}>No credit card · UIC email required · 2 min setup</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────── */}
      <footer style={{ background:'#020510', borderTop:`1px solid ${C.border}`, padding:'40px 24px' }}>
        <div style={{ maxWidth:1100, margin:'0 auto', display:'flex', flexWrap:'wrap', alignItems:'center', justifyContent:'space-between', gap:20 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:32, height:32, borderRadius:9, background:grad, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, color:'#fff', fontSize:15 }}>F</div>
            <span style={{ fontWeight:800, fontSize:16, color:C.text }}>FTax</span>
          </div>
          <div style={{ display:'flex', gap:28 }}>
            {['Features','How it works','FAQ'].map(l => (
              <a key={l} href={`#${l.toLowerCase().replace(/ /g,'-')}`} style={{ color:C.dim, fontSize:13, textDecoration:'none', transition:'color .2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = C.muted)}
                onMouseLeave={e => (e.currentTarget.style.color = C.dim)}>{l}</a>
            ))}
            <Link href="/login" style={{ color:C.dim, fontSize:13, textDecoration:'none' }}>Sign in</Link>
            <Link href="/register" style={{ color:C.dim, fontSize:13, textDecoration:'none' }}>Register</Link>
          </div>
          <p style={{ color:'rgba(255,255,255,0.2)', fontSize:12 }}>Not tax advice · Educational tool only · © 2025 FTax</p>
        </div>
      </footer>
    </div>
  );
}
