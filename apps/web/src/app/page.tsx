'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ScrollReveal, StaggerReveal } from '@/components/scroll-reveal';
import {
  Shield, FileText, Globe, Calculator, Lock, Zap,
  ArrowRight, CheckCircle, GraduationCap, TrendingUp,
  ChevronDown, ChevronUp, Star, Menu, X, Sparkles, Clock,
} from 'lucide-react';

/* ─── Palette: Pine Blue + Jungle Teal + Lavender ─── */
const C = {
  bg:     '#0a0f14',          // deep charcoal-navy
  bg2:    '#0f1920',          // slightly lighter section bg
  border: 'rgba(83,128,131,0.18)',   // pine blue tinted border
  card:   'rgba(83,128,131,0.06)',   // pine blue tinted card
  text:   '#f0eeee',          // soft white (not harsh)
  muted:  '#89909F',          // lavender grey
  dim:    'rgba(137,144,159,0.45)',
  pine:   '#538083',          // Pine Blue — primary accent
  teal:   '#2A7F62',          // Jungle Teal — secondary / success
  lilac:  '#C3ACCE',          // Lilac — highlight / gradient
  lgrey:  '#89909F',          // Lavender Grey
};
const grad     = `linear-gradient(135deg,${C.pine},${C.teal})`;
const gradText = `linear-gradient(135deg,${C.lilac} 0%,${C.pine} 55%,${C.teal} 100%)`;

/* ─── Helpers ─── */
const GText = ({ children }: { children: React.ReactNode }) => (
  <span style={{ background:gradText, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
    {children}
  </span>
);

const Pill = ({ children, color = C.pine }: { children: React.ReactNode; color?: string }) => (
  <span style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'5px 14px', borderRadius:999, background:`${color}1a`, border:`1px solid ${color}40`, fontSize:11, fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase' as const, color }}>
    {children}
  </span>
);



/* ─── FAQ ─── */
function Faq({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div onClick={() => setOpen(o=>!o)} style={{
      background: open ? `rgba(83,128,131,0.10)` : C.card,
      border:`1px solid ${open ? 'rgba(83,128,131,0.4)' : C.border}`,
      borderRadius:14, cursor:'pointer', marginBottom:10, transition:'all .2s',
    }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'18px 22px' }}>
        <span style={{ color:C.text, fontWeight:600, fontSize:15, paddingRight:16, lineHeight:1.4 }}>{q}</span>
        <div style={{ width:28, height:28, borderRadius:'50%', flexShrink:0, background:open?grad:'rgba(255,255,255,0.1)', display:'flex', alignItems:'center', justifyContent:'center', transition:'background .2s' }}>
          {open ? <ChevronUp size={14} color="#fff"/> : <ChevronDown size={14} color={C.muted}/>}
        </div>
      </div>
      {open && <div style={{ padding:'0 22px 18px', color:C.muted, fontSize:14, lineHeight:1.75 }}>{a}</div>}
    </div>
  );
}

/* ─── Data ─── */
const features = [
  { Icon:Shield,     color:'#538083', title:'Residency Determination',  body:'Automatically calculates your tax residency using the Substantial Presence Test with plain-English explanations at every step.' },
  { Icon:FileText,   color:'#2A7F62', title:'Form 8843 Guidance',       body:'Every F-1 student must file Form 8843. We walk you through every field — no jargon, no confusion.' },
  { Icon:Globe,      color:'#C3ACCE', title:'Tax Treaty Detection',     body:'Students from India, China, South Korea and 60+ countries may qualify for exemptions. We check automatically.' },
  { Icon:Calculator, color:'#2A7F62', title:'Tax Calculation',          body:'Federal and Illinois state tax, step-by-step. Every number explained with zero black boxes.' },
  { Icon:Lock,       color:'#89909F', title:'Bank-Grade Security',      body:'SSN/ITIN encrypted at rest with AES-256. JWT auth. SOC 2 aligned. We never sell your data.' },
  { Icon:Zap,        color:'#538083', title:'Always Up to Date',        body:'Tax rules change every year. FTax updates automatically so you never worry about outdated guidance.' },
];

const steps = [
  { n:'01', Icon:GraduationCap, title:'Create Account',  body:'Register with your UIC email in under 2 minutes. Free forever.' },
  { n:'02', Icon:FileText,      title:'Enter Your Info', body:'Visa status, arrival date, travel history, income sources.' },
  { n:'03', Icon:TrendingUp,    title:'Get Your Status', body:"We determine if you're a Nonresident or Resident Alien." },
  { n:'04', Icon:CheckCircle,   title:'Prepare & File',  body:'Download your checklist, forms guide, and filing instructions.' },
];



const faqs = [
  { q:'Do I need to file taxes as an F-1 student?', a:"Yes — even with zero income. If you were in the U.S. during the tax year you must file Form 8843 to declare your 'Exempt Individual' status. With income, you also file Form 1040-NR." },
  { q:'What is Form 8843 and why does it matter?', a:"Form 8843 tells the IRS you are an exempt individual on an F-1 visa. Failing to file can jeopardize your immigration status and future visa applications." },
  { q:'Is FTax a tax filing service?', a:'No. FTax is an educational assistant — we help you understand your situation and prepare your information. You submit to the IRS yourself.' },
  { q:'Which countries have U.S. tax treaties?', a:'India, China, South Korea, Canada, Germany, France and many more. Treaties can exempt scholarship or TA income. FTax detects your eligibility automatically.' },
  { q:'Is my personal information safe?', a:'Yes. Sensitive data like SSN/ITIN is encrypted with AES-256. All connections use TLS. We follow SOC 2 principles and never share your information.' },
];

const stats = [
  { val:'2,400+', label:'Students helped' },
  { val:'98%',    label:'Accuracy rate' },
  { val:'< 10m',  label:'To filing-ready' },
  { val:'100%',   label:'Free for UIC' },
];

/* ─── Page ─── */
export default function Home() {
  const [scrolled, setScrolled]   = useState(false);
  const [mobile, setMobile]       = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <div style={{ background:C.bg, color:C.text, fontFamily:"'Inter',system-ui,sans-serif", overflowX:'hidden' }}>

      {/* ── NAV ── */}
      <nav style={{
        position:'fixed', top:0, left:0, right:0, zIndex:100,
        height:64, padding:'0 32px',
        display:'flex', alignItems:'center', justifyContent:'space-between',
        transition:'all .3s',
        background: scrolled ? `rgba(10,15,20,0.92)` : 'transparent',
        borderBottom: `1px solid ${scrolled ? C.border : 'transparent'}`,
        backdropFilter: scrolled ? 'blur(18px)' : 'none',
      }}>
        <Link href="/" style={{ display:'flex', alignItems:'center', gap:10, textDecoration:'none' }}>
          <div style={{ width:34, height:34, borderRadius:10, background:grad, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, fontSize:16, color:'#fff' }}>F</div>
          <span style={{ fontWeight:800, fontSize:18, color:C.text, letterSpacing:'-0.03em' }}>FTax</span>
        </Link>

        <div style={{ display:'flex', gap:32, alignItems:'center' }} className="hidden md:flex">
          {['Features','How it works','FAQ'].map(l=>(
            <a key={l} href={`#${l.toLowerCase().replace(/ /g,'-')}`} className="nav-a">{l}</a>
          ))}
        </div>

        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <Link href="/login" className="hidden md:block" style={{ textDecoration:'none' }}>
            <button className="btn-ghost" style={{ padding:'8px 18px', borderRadius:10, fontSize:14 }}>Sign in</button>
          </Link>
          <Link href="/register" style={{ textDecoration:'none' }}>
            <button className="btn-primary" style={{ padding:'9px 20px', borderRadius:10, fontSize:14 }}>
              Get started <ArrowRight size={14}/>
            </button>
          </Link>
          <button className="md:hidden" onClick={()=>setMobile(o=>!o)}
            style={{ background:'none', border:`1px solid ${C.border}`, borderRadius:8, padding:6, cursor:'pointer', color:C.text, display:'flex' }}>
            {mobile ? <X size={18}/> : <Menu size={18}/>}
          </button>
        </div>
      </nav>

      {/* mobile menu */}
      {mobile && (
        <div style={{ position:'fixed', top:64, left:0, right:0, zIndex:99, background:'rgba(10,15,20,0.97)', borderBottom:`1px solid ${C.border}`, padding:'12px 24px 20px' }}>
          {['Features','How it works','FAQ'].map(l=>(
            <a key={l} href={`#${l.toLowerCase().replace(/ /g,'-')}`} onClick={()=>setMobile(false)}
              style={{ display:'block', padding:'12px 0', color:C.muted, textDecoration:'none', fontSize:15, fontWeight:500, borderBottom:`1px solid ${C.border}` }}>{l}</a>
          ))}
          <Link href="/login" onClick={()=>setMobile(false)} style={{ display:'block', padding:'12px 0', color:C.muted, textDecoration:'none', fontSize:15 }}>Sign in</Link>
        </div>
      )}

      {/* ── HERO ── */}
      <section className="hero-grid-bg" style={{ paddingTop:140, paddingBottom:80, paddingLeft:24, paddingRight:24, position:'relative', overflow:'hidden', minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
        {/* radial glow */}
        <div style={{ position:'absolute', top:'-15%', left:'50%', transform:'translateX(-50%)', width:1000, height:700, background:'radial-gradient(ellipse at 50% 30%, rgba(83,128,131,0.20) 0%, rgba(42,127,98,0.08) 45%, transparent 70%)', pointerEvents:'none', zIndex:0 }}/>

        <div style={{ maxWidth:820, margin:'0 auto', textAlign:'center', position:'relative', zIndex:1 }}>

          {/* Badge — immediate, no delay */}
          <div style={{ marginBottom:28 }}>
            <Pill color={C.pine}><Sparkles size={12}/> Built for UIC F-1 International Students</Pill>
          </div>

          {/* Headline */}
          <h1 style={{ fontSize:'clamp(40px,7vw,80px)', fontWeight:900, lineHeight:1.02, letterSpacing:'-0.04em', marginBottom:22 }}>
            U.S. taxes,{' '}<GText>finally<br/>understood</GText>
          </h1>

          <p style={{ fontSize:18, color:C.muted, lineHeight:1.75, maxWidth:580, margin:'0 auto 36px' }}>
            FTax helps international students at UIC determine their tax residency,
            complete Form 8843, and prepare their filing — in plain English.
            No jargon. No guesswork. Always free.
          </p>

          <div style={{ display:'flex', flexWrap:'wrap', gap:14, justifyContent:'center', marginBottom:32 }}>
            <Link href="/register" style={{ textDecoration:'none' }}>
              <button className="btn-primary" style={{ padding:'14px 32px', borderRadius:14, fontSize:16 }}>
                Start for free <ArrowRight size={16}/>
              </button>
            </Link>
            <a href="#how-it-works" style={{ textDecoration:'none' }}>
              <button className="btn-ghost" style={{ padding:'14px 32px', borderRadius:14, fontSize:16 }}>See how it works</button>
            </a>
          </div>

          <div style={{ display:'flex', flexWrap:'wrap', justifyContent:'center', gap:24, color:C.dim, fontSize:13 }}>
            {[[Lock,'AES-256 encrypted'],[Star,'Always free for UIC'],[Clock,'Ready in &lt; 10 min']].map(([Icon,t]:any)=>(
              <span key={t} style={{ display:'flex', alignItems:'center', gap:6 }}><Icon size={13} color={C.pine}/> {t}</span>
            ))}
          </div>
        </div>

        {/* Floating preview card */}
        <div className="anim-float" style={{ maxWidth:620, width:'100%', margin:'56px auto 0', position:'relative', zIndex:1 }}>
          <div style={{ background:'rgba(8,14,20,0.94)', border:`1px solid rgba(83,128,131,0.35)`, borderRadius:20, overflow:'hidden', boxShadow:'0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(83,128,131,0.15)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, padding:'12px 18px', borderBottom:`1px solid ${C.border}`, background:'rgba(255,255,255,0.02)' }}>
              <div style={{ width:11, height:11, borderRadius:'50%', background:'#ff5f57' }}/>
              <div style={{ width:11, height:11, borderRadius:'50%', background:'#febc2e' }}/>
              <div style={{ width:11, height:11, borderRadius:'50%', background:'#28c840' }}/>
              <span style={{ fontSize:11, color:'rgba(255,255,255,0.3)', marginLeft:'auto', marginRight:18, fontFamily:'monospace' }}>FTax — Residency Check</span>
            </div>
            <div style={{ padding:24 }}>
              <div style={{ display:'flex', alignItems:'center', gap:14, background:'rgba(16,185,129,0.1)', border:'1px solid rgba(16,185,129,0.25)', borderRadius:12, padding:'14px 18px', marginBottom:18 }}>
                <div style={{ width:38, height:38, borderRadius:'50%', background:'rgba(16,185,129,0.2)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <CheckCircle size={18} color="#10b981"/>
                </div>
                <div>
                  <p style={{ fontWeight:700, fontSize:14 }}>Nonresident Alien — Confirmed ✓</p>
                  <p style={{ fontSize:12, color:C.muted, marginTop:3 }}>F-1 students in first 5 years are exempt from Substantial Presence Test</p>
                </div>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:18 }}>
                {[['180','Days in U.S.',C.pine],['210','Weighted total',C.teal],['2','Forms needed',C.lilac]].map(([v,l,c])=>(
                  <div key={l} style={{ textAlign:'center', background:'rgba(255,255,255,0.04)', borderRadius:10, padding:'12px 8px', border:`1px solid ${C.border}` }}>
                    <p style={{ fontSize:26, fontWeight:900, color:c as string, letterSpacing:'-0.03em' }}>{v}</p>
                    <p style={{ fontSize:11, color:C.muted, marginTop:4 }}>{l}</p>
                  </div>
                ))}
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                {['Form 8843 — Required','1040-NR — Required (stipend)','India–US Treaty — Check eligibility'].map(t=>(
                  <div key={t} style={{ display:'flex', alignItems:'center', gap:10, fontSize:12, color:C.muted }}>
                    <div style={{ width:6, height:6, borderRadius:'50%', background:C.pine, flexShrink:0 }}/> {t}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div style={{ position:'absolute', bottom:0, left:0, right:0, height:100, background:`linear-gradient(transparent,${C.bg})`, pointerEvents:'none' }}/>
      </section>

      {/* ── STATS ── scroll reveal */}
      <section style={{ background:C.bg2, borderTop:`1px solid ${C.border}`, borderBottom:`1px solid ${C.border}`, padding:'56px 24px' }}>
        <StaggerReveal style={{ maxWidth:900, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:'32px 24px' }} className="md:grid-cols-4">
          {stats.map(({val,label})=>(
            <ScrollReveal key={label} direction="up" style={{ textAlign:'center' }}>
              <p style={{ fontSize:'clamp(28px,4vw,42px)', fontWeight:900, letterSpacing:'-0.04em', background:gradText, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>{val}</p>
              <p style={{ fontSize:13, color:C.muted, marginTop:4, fontWeight:500 }}>{label}</p>
            </ScrollReveal>
          ))}
        </StaggerReveal>
      </section>

      {/* ── FEATURES ── scroll reveal with stagger */}
      <section id="features" style={{ background:C.bg, padding:'100px 24px' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <ScrollReveal style={{ textAlign:'center', marginBottom:64 }}>
            <div style={{ marginBottom:16 }}><Pill color={C.pine}>Features</Pill></div>
            <h2 style={{ fontSize:'clamp(28px,4vw,46px)', fontWeight:900, letterSpacing:'-0.03em', marginBottom:16 }}>
              Everything you need to file{' '}<GText>with confidence</GText>
            </h2>
            <p style={{ color:C.muted, fontSize:17, maxWidth:520, margin:'0 auto' }}>
              Built specifically for F-1 students at UIC — not a generic tool that leaves you guessing.
            </p>
          </ScrollReveal>

          <StaggerReveal style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:16 }}>
            {features.map(({Icon,color,title,body})=>(
              <ScrollReveal key={title} direction="up" className="dark-card" style={{ padding:28 }}>
                <div style={{ width:48, height:48, borderRadius:14, background:`${color}1a`, border:`1px solid ${color}30`, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:20 }}>
                  <Icon size={22} color={color}/>
                </div>
                <h3 style={{ fontWeight:700, fontSize:16, color:C.text, marginBottom:10 }}>{title}</h3>
                <p style={{ fontSize:14, color:C.muted, lineHeight:1.7 }}>{body}</p>
              </ScrollReveal>
            ))}
          </StaggerReveal>
        </div>
      </section>

      {/* ── HOW IT WORKS ── slide in from sides */}
      <section id="how-it-works" style={{ background:C.bg2, padding:'100px 24px' }}>
        <div style={{ maxWidth:1000, margin:'0 auto' }}>
          <ScrollReveal style={{ textAlign:'center', marginBottom:64 }}>
            <div style={{ marginBottom:16 }}><Pill color={C.teal}>How it works</Pill></div>
            <h2 style={{ fontSize:'clamp(28px,4vw,46px)', fontWeight:900, letterSpacing:'-0.03em' }}>
              From confused to <GText>filing-ready</GText><br/>in 4 simple steps
            </h2>
          </ScrollReveal>

          <StaggerReveal style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:16 }}>
            {steps.map(({n,Icon,title,body})=>(
              <ScrollReveal key={n} direction="up" className="dark-card" style={{ padding:28, textAlign:'center' }}>
                <div style={{ width:52, height:52, borderRadius:14, background:'rgba(83,128,131,0.15)', border:'1px solid rgba(83,128,131,0.3)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}>
                  <Icon size={22} color={C.pine}/>
                </div>
                <div style={{ fontSize:11, fontWeight:800, color:C.pine, letterSpacing:'0.1em', marginBottom:8 }}>{n}</div>
                <h3 style={{ fontWeight:700, fontSize:16, marginBottom:10 }}>{title}</h3>
                <p style={{ fontSize:14, color:C.muted, lineHeight:1.65 }}>{body}</p>
              </ScrollReveal>
            ))}
          </StaggerReveal>
        </div>
      </section>


      {/* ── COUNTRIES & TREATIES ── */}
      <section style={{ background:C.bg, padding:'100px 24px' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <ScrollReveal style={{ textAlign:'center', marginBottom:64 }}>
            <div style={{ marginBottom:16 }}><Pill color={C.teal}>Global coverage</Pill></div>
            <h2 style={{ fontSize:'clamp(28px,4vw,46px)', fontWeight:900, letterSpacing:'-0.03em', marginBottom:16 }}>
              We cover students from <GText>60+ countries</GText>
            </h2>
            <p style={{ color:C.muted, fontSize:17, maxWidth:540, margin:'0 auto' }}>
              FTax automatically detects your country of tax residence and checks U.S. tax treaty eligibility — no manual research needed.
            </p>
          </ScrollReveal>

          {/* Country grid */}
          <StaggerReveal style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:12, marginBottom:48 }}>
            {[
              { flag:'🇮🇳', name:'India',         treaty:true  },
              { flag:'🇨🇳', name:'China',         treaty:true  },
              { flag:'🇰🇷', name:'South Korea',   treaty:true  },
              { flag:'🇩🇪', name:'Germany',       treaty:true  },
              { flag:'🇫🇷', name:'France',        treaty:true  },
              { flag:'🇨🇦', name:'Canada',        treaty:true  },
              { flag:'🇯🇵', name:'Japan',         treaty:true  },
              { flag:'🇬🇧', name:'United Kingdom',treaty:true  },
              { flag:'🇲🇽', name:'Mexico',        treaty:true  },
              { flag:'🇧🇷', name:'Brazil',        treaty:false },
              { flag:'🇳🇬', name:'Nigeria',       treaty:false },
              { flag:'🇵🇰', name:'Pakistan',      treaty:false },
            ].map(({ flag, name, treaty }) => (
              <ScrollReveal key={name} direction="up" className="dark-card" style={{ padding:'18px 20px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <span style={{ fontSize:26 }}>{flag}</span>
                  <span style={{ fontWeight:600, fontSize:14 }}>{name}</span>
                </div>
                <span style={{
                  fontSize:11, fontWeight:700, padding:'3px 10px', borderRadius:999,
                  background: treaty ? 'rgba(42,127,98,0.18)' : 'rgba(137,144,159,0.08)',
                  border: `1px solid ${treaty ? 'rgba(42,127,98,0.4)' : 'rgba(137,144,159,0.2)'}`,
                  color: treaty ? C.teal : C.muted,
                }}>
                  {treaty ? 'Treaty ✓' : 'No treaty'}
                </span>
              </ScrollReveal>
            ))}
          </StaggerReveal>

          {/* Bottom note */}
          <ScrollReveal style={{ textAlign:'center' }}>
            <div style={{ display:'inline-flex', alignItems:'center', gap:10, padding:'14px 28px', borderRadius:14, background:C.card, border:`1px solid ${C.border}`, color:C.muted, fontSize:14 }}>
              <Globe size={16} color={C.pine}/>
              <span>Don't see your country? <strong style={{ color:C.text }}>FTax still works for all F-1 students</strong> — treaty status simply won't apply.</span>
            </div>
          </ScrollReveal>
        </div>
      </section>


      {/* ── SECURITY ── slide in from sides, Expatfile-style split */}
      <section style={{ background:C.bg2, padding:'100px 24px' }}>
        <div style={{ maxWidth:1000, margin:'0 auto' }}>
          <ScrollReveal style={{ textAlign:'center', marginBottom:64 }}>
            <h2 style={{ fontSize:'clamp(28px,4vw,44px)', fontWeight:900, letterSpacing:'-0.03em' }}>
              Your data, <GText>protected</GText>
            </h2>
          </ScrollReveal>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }} className="grid-cols-1 md:grid-cols-2">
            {/* Left light card */}
            <ScrollReveal direction="left" className="dark-card" style={{ padding:40, display:'flex', flexDirection:'column', gap:16 }}>
              <div style={{ width:52, height:52, borderRadius:14, background:'rgba(83,128,131,0.15)', border:'1px solid rgba(83,128,131,0.3)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <Lock size={24} color={C.pine}/>
              </div>
              <h3 style={{ fontWeight:800, fontSize:24, lineHeight:1.2 }}>Unmatched security</h3>
              <p style={{ color:C.muted, lineHeight:1.75, fontSize:15 }}>
                Your tax data is encrypted at rest with AES-256 and in transit with TLS 1.3.
                We follow SOC 2 security principles. Your SSN and ITIN are never stored in plain text.
              </p>
              <div style={{ display:'flex', flexDirection:'column', gap:10, marginTop:8 }}>
                {['AES-256 encryption at rest','TLS 1.3 in transit','JWT authentication','Zero data selling, ever'].map(f=>(
                  <div key={f} style={{ display:'flex', alignItems:'center', gap:10, fontSize:14, color:C.muted }}>
                    <CheckCircle size={15} color="#10b981"/> {f}
                  </div>
                ))}
              </div>
            </ScrollReveal>

            {/* Right dark card */}
            <ScrollReveal direction="right" style={{ background:'linear-gradient(135deg,rgba(83,128,131,0.18),rgba(42,127,98,0.14))', border:`1px solid rgba(83,128,131,0.35)`, borderRadius:18, padding:40, display:'flex', flexDirection:'column', gap:16 }}>
              <div style={{ width:52, height:52, borderRadius:14, background:'rgba(255,255,255,0.1)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <Shield size={24} color="#fff"/>
              </div>
              <h3 style={{ fontWeight:800, fontSize:24, lineHeight:1.2 }}>Your privacy, our commitment</h3>
              <p style={{ color:'rgba(255,255,255,0.65)', lineHeight:1.75, fontSize:15 }}>
                We collect only what's needed to help you file. You can request complete deletion of
                your data at any time. We will never share, sell, or rent your information to any third party.
              </p>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginTop:8 }}>
                {[['🔒','Encrypted storage'],['🛡️','SOC 2 aligned'],['🗑️','Right to delete'],['🚫','No data selling']].map(([e,l])=>(
                  <div key={l} style={{ background:'rgba(255,255,255,0.07)', borderRadius:10, padding:'12px 14px', fontSize:13, color:'rgba(255,255,255,0.75)', display:'flex', alignItems:'center', gap:8 }}>
                    <span>{e}</span> {l}
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" style={{ background:C.bg, padding:'100px 24px' }}>
        <div style={{ maxWidth:740, margin:'0 auto' }}>
          <ScrollReveal style={{ textAlign:'center', marginBottom:56 }}>
            <div style={{ marginBottom:16 }}><Pill color={C.pine}>FAQ</Pill></div>
            <h2 style={{ fontSize:'clamp(28px,4vw,44px)', fontWeight:900, letterSpacing:'-0.03em', marginBottom:12 }}>Common questions</h2>
            <p style={{ color:C.muted }}>Everything you need to know before getting started.</p>
          </ScrollReveal>
          <ScrollReveal>
            {faqs.map(f=><Faq key={f.q} q={f.q} a={f.a}/>)}
          </ScrollReveal>
        </div>
      </section>

      {/* ── CTA ── scale reveal */}
      <section style={{ background:C.bg2, padding:'80px 24px' }}>
        <div style={{ maxWidth:820, margin:'0 auto' }}>
          <ScrollReveal direction="scale">
            <div style={{ borderRadius:24, padding:'72px 40px', textAlign:'center', position:'relative', overflow:'hidden', background:'linear-gradient(135deg,rgba(83,128,131,0.16),rgba(42,127,98,0.12),rgba(195,172,206,0.07))', border:`1px solid rgba(83,128,131,0.38)`, boxShadow:'0 0 80px rgba(83,128,131,0.1) inset' }}>
              <div style={{ position:'absolute', top:'-30%', left:'50%', transform:'translateX(-50%)', width:500, height:300, background:'radial-gradient(ellipse,rgba(83,128,131,0.28),transparent)', filter:'blur(50px)', pointerEvents:'none' }}/>
              <div style={{ position:'relative', zIndex:1 }}>
                <div style={{ marginBottom:20 }}><Pill color="#fbbf24"><Star size={11}/> Trusted by UIC F-1 students</Pill></div>
                <h2 style={{ fontSize:'clamp(28px,4vw,48px)', fontWeight:900, letterSpacing:'-0.03em', marginBottom:16 }}>
                  Ready to make taxes <GText>simple?</GText>
                </h2>
                <p style={{ color:C.muted, fontSize:17, maxWidth:480, margin:'0 auto 40px', lineHeight:1.7 }}>
                  Join UIC F-1 students who've used FTax to demystify U.S. taxes. Always free. Always clear.
                </p>
                <Link href="/register" style={{ textDecoration:'none' }}>
                  <button className="btn-primary" style={{ padding:'15px 40px', borderRadius:14, fontSize:17 }}>
                    Create free account <ArrowRight size={18}/>
                  </button>
                </Link>
                <p style={{ color:C.dim, fontSize:13, marginTop:18 }}>No credit card · UIC email required · 2 min setup</p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background:'#020510', borderTop:`1px solid ${C.border}`, padding:'40px 24px' }}>
        <div style={{ maxWidth:1100, margin:'0 auto', display:'flex', flexWrap:'wrap', alignItems:'center', justifyContent:'space-between', gap:20 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:32, height:32, borderRadius:9, background:grad, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, color:'#fff', fontSize:15 }}>F</div>
            <span style={{ fontWeight:800, fontSize:16 }}>FTax</span>
          </div>
          <div style={{ display:'flex', gap:28, flexWrap:'wrap' }}>
            {['Features','How it works','FAQ'].map(l=>(
              <a key={l} href={`#${l.toLowerCase().replace(/ /g,'-')}`} style={{ color:C.dim, fontSize:13, textDecoration:'none' }}
                onMouseEnter={e=>(e.currentTarget.style.color=C.muted)} onMouseLeave={e=>(e.currentTarget.style.color=C.dim)}>{l}</a>
            ))}
            <Link href="/login"    style={{ color:C.dim, fontSize:13, textDecoration:'none' }}>Sign in</Link>
            <Link href="/register" style={{ color:C.dim, fontSize:13, textDecoration:'none' }}>Register</Link>
          </div>
          <p style={{ color:'rgba(255,255,255,0.18)', fontSize:12 }}>Not tax advice · Educational tool only · © 2025 FTax</p>
        </div>
      </footer>
    </div>
  );
}
