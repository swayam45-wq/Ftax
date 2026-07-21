'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiFetch, C, grad, gradText } from '@/lib/api';
import {
  LayoutDashboard, FileText, Globe, LogOut,
  ArrowRight, User, Shield, AlertTriangle, Menu, X,
  ClipboardList, TrendingUp, Sparkles, ChevronRight,
} from 'lucide-react';

const NAV = [
  { href:'/dashboard',  icon:LayoutDashboard, label:'Dashboard' },
  { href:'/profile',    icon:User,            label:'My Profile' },
  { href:'/residency',  icon:ClipboardList,   label:'Residency Check' },
  { href:'/form-8843',  icon:FileText,        label:'Form 8843' },
  { href:'/treaty',     icon:Globe,           label:'Tax Treaties' },
  { href:'/tax',        icon:TrendingUp,      label:'Tax Calculator' },
];

const TASKS = [
  { id:'residency', href:'/residency', icon:ClipboardList, color:C.pine,  title:'Tax Residency Check', desc:'Run the IRS Substantial Presence Test and determine your filing status.', badge:'Step 1' },
  { id:'form8843',  href:'/form-8843', icon:FileText,      color:C.teal,  title:'Form 8843 Guide',     desc:'Step-by-step instructions and PDF filler for your exempt individual declaration.', badge:'Step 2' },
  { id:'treaty',    href:'/treaty',    icon:Globe,         color:C.pine,  title:'Tax Treaty Check',    desc:'Find country-specific exemptions under U.S. bilateral treaties.', badge:'Step 3' },
  { id:'calc',      href:'/tax',       icon:TrendingUp,    color:C.teal,  title:'Tax Calculation',     desc:'Federal 1040-NR + Illinois flat-rate estimate, fully transparent.', badge:'Step 4' },
];

function Sidebar({ name, email, onSignOut, active }: { name:string; email:string; onSignOut:()=>void; active:string }) {
  return (
    <aside style={{
      position:'fixed', top:0, left:0, bottom:0, width:248,
      background:'rgba(10,15,20,0.95)', borderRight:`1px solid rgba(83,145,150,0.14)`,
      display:'flex', flexDirection:'column', zIndex:50,
      backdropFilter:'blur(20px)',
    }}>
      {/* Logo */}
      <div style={{ padding:'26px 22px 22px', borderBottom:`1px solid rgba(83,145,150,0.12)` }}>
        <Link href="/" style={{ display:'flex', alignItems:'center', gap:11, textDecoration:'none', marginBottom:14 }}>
          <div style={{ width:36, height:36, borderRadius:11, background:grad, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, fontSize:17, color:'#fff', boxShadow:'0 4px 16px rgba(83,128,131,0.38)', flexShrink:0 }}>F</div>
          <span style={{ fontWeight:800, fontSize:18, color:C.text, letterSpacing:'-0.04em' }}>FTax</span>
        </Link>
        <div style={{ display:'inline-flex', alignItems:'center', gap:5, fontSize:10, fontWeight:700, letterSpacing:'0.07em', padding:'4px 10px', borderRadius:999, background:'rgba(201,168,76,0.10)', border:'1px solid rgba(201,168,76,0.25)', color:'#C9A84C' }}>
          <Sparkles size={9}/> TAX YEAR 2025
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex:1, padding:'14px 10px', display:'flex', flexDirection:'column', gap:3, overflowY:'auto' }}>
        {NAV.map(({ href, icon:Icon, label }) => {
          const isActive = active === href;
          return (
            <Link key={href} href={href} style={{
              display:'flex', alignItems:'center', gap:12, padding:'10px 14px',
              borderRadius:11, textDecoration:'none', transition:'all .18s',
              background: isActive ? 'rgba(83,145,150,0.14)' : 'transparent',
              color: isActive ? C.text : C.muted,
              fontWeight: isActive ? 700 : 400, fontSize:14,
              border: isActive ? '1px solid rgba(83,145,150,0.30)' : '1px solid transparent',
              boxShadow: isActive ? '0 2px 12px rgba(83,128,131,0.14)' : 'none',
            }}>
              <Icon size={16} color={isActive ? C.pine : undefined}/>
              {label}
              {isActive && <ChevronRight size={12} color={C.pine} style={{ marginLeft:'auto' }}/>}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div style={{ padding:'16px 16px 22px', borderTop:`1px solid rgba(83,145,150,0.12)` }}>
        <div style={{ display:'flex', alignItems:'center', gap:11, marginBottom:14, padding:'10px 12px', borderRadius:12, background:'rgba(83,145,150,0.05)', border:`1px solid rgba(83,145,150,0.12)` }}>
          <div style={{ width:36, height:36, borderRadius:'50%', background:grad, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:15, color:'#fff', flexShrink:0 }}>
            {name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div style={{ minWidth:0 }}>
            <p style={{ fontSize:13, fontWeight:700, color:C.text, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{name}</p>
            <p style={{ fontSize:11, color:C.dim, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{email}</p>
          </div>
        </div>
        <button onClick={onSignOut} style={{
          width:'100%', display:'flex', alignItems:'center', gap:8,
          background:'rgba(239,68,68,0.07)', border:'1px solid rgba(239,68,68,0.18)',
          borderRadius:10, padding:'9px 14px', color:'#fca5a5', fontSize:13,
          cursor:'pointer', fontWeight:500, transition:'all .15s',
        }}
        onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,0.14)'}
        onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,0.07)'}
        >
          <LogOut size={14}/> Sign out
        </button>
      </div>
    </aside>
  );
}

function StatCard({ label, value, sub, color, mono=false }: { label:string; value:string; sub:string; color:string; mono?:boolean }) {
  return (
    <div style={{ background:'rgba(13,21,32,0.70)', border:`1px solid rgba(83,145,150,0.16)`, borderRadius:18, padding:'22px 24px', backdropFilter:'blur(12px)' }}>
      <p style={{ fontSize:11, color:C.muted, fontWeight:700, letterSpacing:'0.07em', textTransform:'uppercase', marginBottom:10 }}>{label}</p>
      <p style={{ fontSize:30, fontWeight:900, letterSpacing:'-0.05em', background:gradText, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', fontFamily: mono ? 'JetBrains Mono, monospace' : undefined }}>{value}</p>
      <p style={{ fontSize:12, color, marginTop:6 }}>{sub}</p>
    </div>
  );
}

export default function DashboardPage() {
  const router  = useRouter();
  const [user,   setUser]   = useState<any>(null);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) { router.push('/login'); return; }
    apiFetch('/auth/me').then(setUser).catch(() => { localStorage.removeItem('access_token'); router.push('/login'); });
  }, [router]);

  const signOut = () => { localStorage.removeItem('access_token'); router.push('/login'); };

  if (!user) return (
    <div style={{ minHeight:'100vh', background:C.bg, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Inter',system-ui,sans-serif" }}>
      <div style={{ textAlign:'center', color:C.muted }}>
        <div style={{ width:38, height:38, borderRadius:'50%', border:`3px solid ${C.pine}`, borderTopColor:'transparent', margin:'0 auto 14px', animation:'spin 0.8s linear infinite' }}/>
        <p style={{ fontSize:13 }}>Loading dashboard…</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  const firstName = user.firstName || user.name?.split(' ')[0] || 'there';
  const email     = user.email || '';

  return (
    <div style={{ minHeight:'100vh', background:C.bg, color:C.text, fontFamily:"'Inter',system-ui,sans-serif" }}>
      {/* Ambient glow */}
      <div style={{ position:'fixed', top:0, right:0, width:600, height:500, background:'radial-gradient(ellipse, rgba(42,127,98,0.07) 0%, transparent 65%)', pointerEvents:'none', zIndex:0 }}/>
      <div style={{ position:'fixed', bottom:0, left:248, width:500, height:400, background:'radial-gradient(ellipse, rgba(83,128,131,0.07) 0%, transparent 65%)', pointerEvents:'none', zIndex:0 }}/>

      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <Sidebar name={firstName} email={email} onSignOut={signOut} active="/dashboard"/>
      </div>

      {/* Mobile topbar */}
      <div className="lg:hidden" style={{ position:'sticky', top:0, zIndex:50, height:60, background:'rgba(10,15,20,0.94)', borderBottom:`1px solid rgba(83,145,150,0.14)`, backdropFilter:'blur(20px)', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 22px' }}>
        <Link href="/" style={{ display:'flex', alignItems:'center', gap:9, textDecoration:'none' }}>
          <div style={{ width:32, height:32, borderRadius:9, background:grad, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, fontSize:15, color:'#fff' }}>F</div>
          <span style={{ fontWeight:800, fontSize:16, color:C.text, letterSpacing:'-0.03em' }}>FTax</span>
        </Link>
        <button onClick={() => setMobile(o => !o)} style={{ background:'none', border:`1px solid rgba(83,145,150,0.25)`, borderRadius:9, padding:7, cursor:'pointer', color:C.text, display:'flex', transition:'background .15s' }}>
          {mobile ? <X size={18}/> : <Menu size={18}/>}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobile && (
        <div style={{ position:'fixed', inset:0, zIndex:40, background:'rgba(10,15,20,0.97)', paddingTop:60, backdropFilter:'blur(20px)' }}>
          <div style={{ padding:'18px 20px', display:'flex', flexDirection:'column', gap:4 }}>
            {NAV.map(({ href, icon:Icon, label }) => (
              <Link key={href} href={href} onClick={() => setMobile(false)} style={{ display:'flex', alignItems:'center', gap:13, padding:'14px 16px', borderRadius:12, textDecoration:'none', color:C.muted, fontSize:15 }}>
                <Icon size={18}/> {label}
              </Link>
            ))}
            <div style={{ marginTop:18, borderTop:`1px solid rgba(83,145,150,0.14)`, paddingTop:18 }}>
              <button onClick={signOut} style={{ display:'flex', alignItems:'center', gap:8, background:'none', border:'none', color:'#fca5a5', fontSize:14, cursor:'pointer' }}>
                <LogOut size={16}/> Sign out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main */}
      <main style={{ paddingLeft:0, position:'relative', zIndex:1 }} className="lg:pl-[248px]">
        <div style={{ maxWidth:1020, margin:'0 auto', padding:'48px 28px' }}>

          {/* Header */}
          <div style={{ marginBottom:40 }}>
            <p style={{ fontSize:12, color:C.muted, fontWeight:600, letterSpacing:'0.07em', textTransform:'uppercase', marginBottom:6 }}>Welcome back</p>
            <h1 style={{ fontSize:'clamp(28px,4vw,40px)', fontWeight:900, letterSpacing:'-0.04em', marginBottom:10 }}>
              Hello, <span style={{ background:gradText, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>{firstName}</span> 👋
            </h1>
            <p style={{ color:C.muted, fontSize:15, lineHeight:1.6 }}>Here&apos;s your tax filing progress for <strong style={{ color:C.text }}>Tax Year 2025</strong>.</p>
          </div>

          {/* Banner */}
          <div style={{ display:'flex', alignItems:'flex-start', gap:13, background:'rgba(83,128,131,0.07)', border:`1px solid rgba(83,145,150,0.22)`, borderRadius:16, padding:'16px 20px', marginBottom:36, backdropFilter:'blur(8px)' }}>
            <AlertTriangle size={16} color={C.pine} style={{ flexShrink:0, marginTop:2 }}/>
            <p style={{ fontSize:13, color:C.muted, lineHeight:1.7 }}>
              <strong style={{ color:C.text }}>Important: </strong>
              F-1 students must file taxes by <strong style={{ color:C.text }}>April 15, 2025</strong>, even with zero income. Form 8843 is required for all F-1 visa holders.
            </p>
          </div>

          {/* Stats */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:14, marginBottom:40 }}>
            <StatCard label="Tax Year" value="2025" sub="Filing deadline Apr 15" color={C.pine} mono/>
            <StatCard label="Your Visa" value="F-1" sub="Student visa status" color={C.teal}/>
            <StatCard label="Forms" value="8843" sub="Minimum required" color={C.muted} mono/>
            <StatCard label="Status" value="4 Steps" sub="Complete the checklist" color={C.gold}/>
          </div>

          {/* Task cards */}
          <div style={{ marginBottom:16 }}>
            <h2 style={{ fontSize:20, fontWeight:800, letterSpacing:'-0.03em', marginBottom:6 }}>Filing checklist</h2>
            <p style={{ color:C.muted, fontSize:14, marginBottom:24 }}>Complete each step in order to prepare your tax return.</p>
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:14, marginBottom:52 }}>
            {TASKS.map(({ id, href, icon:Icon, color, title, desc, badge }) => (
              <div key={id}
                style={{
                  display:'flex', alignItems:'center', gap:20,
                  background:'rgba(13,21,32,0.70)', border:`1px solid rgba(83,145,150,0.18)`,
                  borderRadius:18, padding:'22px 26px',
                  transition:'all .22s', cursor:'pointer',
                  backdropFilter:'blur(12px)',
                }}
                onClick={() => router.push(href)}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(83,145,150,0.42)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 36px rgba(0,0,0,0.25)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(83,145,150,0.18)'; (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; }}
              >
                <div style={{ width:48, height:48, borderRadius:14, background:`${color}18`, border:`1px solid ${color}35`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <Icon size={20} color={color}/>
                </div>

                <div style={{ flex:1 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:9, marginBottom:5 }}>
                    <span style={{ fontSize:10, fontWeight:800, letterSpacing:'0.08em', color, padding:'3px 9px', borderRadius:999, background:`${color}15`, border:`1px solid ${color}30` }}>{badge}</span>
                  </div>
                  <h3 style={{ fontWeight:700, fontSize:16, color:C.text, marginBottom:4 }}>{title}</h3>
                  <p style={{ fontSize:13, color:C.muted, lineHeight:1.6 }}>{desc}</p>
                </div>

                <Link href={href} onClick={e => e.stopPropagation()} style={{
                  display:'inline-flex', alignItems:'center', gap:7, textDecoration:'none',
                  background:grad, color:'#fff', fontWeight:700, fontSize:13,
                  padding:'10px 18px', borderRadius:11, flexShrink:0,
                  boxShadow:'0 4px 16px rgba(83,128,131,0.28)',
                  transition:'transform .15s, box-shadow .15s',
                }}>
                  Start <ArrowRight size={14}/>
                </Link>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div style={{ display:'flex', alignItems:'center', gap:11, padding:'18px 22px', borderRadius:14, background:'rgba(42,127,98,0.05)', border:'1px solid rgba(42,127,98,0.16)' }}>
            <Shield size={16} color={C.teal}/>
            <p style={{ fontSize:13, color:C.muted }}>Your data is encrypted with AES-256. We never sell or share your personal information.</p>
          </div>
        </div>
      </main>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
