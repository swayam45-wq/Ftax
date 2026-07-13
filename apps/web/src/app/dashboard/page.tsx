'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiFetch, C, grad, gradText } from '@/lib/api';
import {
  LayoutDashboard, FileText, Calculator, Globe, LogOut,
  CheckCircle, Clock, ArrowRight, User, ChevronRight,
  Shield, AlertTriangle, Menu, X,
} from 'lucide-react';

/* ── Sidebar nav items ── */
const NAV = [
  { href:'/dashboard',  icon:LayoutDashboard, label:'Dashboard' },
  { href:'/profile',    icon:User,            label:'My Profile' },
  { href:'/residency',  icon:Calculator,      label:'Residency Check' },
  { href:'/dashboard#form8843', icon:FileText, label:'Form 8843' },
  { href:'/dashboard#treaty',   icon:Globe,   label:'Tax Treaties' },
];

/* ── Task cards ── */
const TASKS = [
  {
    id:'residency', href:'/residency',
    icon:Calculator, color:C.pine,
    title:'Tax Residency Check',
    desc:'Run the IRS Substantial Presence Test and determine your filing status.',
    status:'Start',
    badge:'Step 1',
  },
  {
    id:'form8843', href:'/dashboard#form8843',
    icon:FileText, color:C.teal,
    title:'Form 8843 Guide',
    desc:'Step-by-step instructions for exempt individual declaration.',
    status:'Soon',
    badge:'Step 2',
  },
  {
    id:'treaty', href:'/dashboard#treaty',
    icon:Globe, color:C.lilac,
    title:'Tax Treaty Check',
    desc:'Verify your country\'s treaty with the U.S. and claim eligible exemptions.',
    status:'Soon',
    badge:'Step 3',
  },
  {
    id:'calc', href:'/dashboard#calc',
    icon:Calculator, color:C.muted,
    title:'Tax Calculation',
    desc:'Federal + Illinois state tax, fully explained with zero black boxes.',
    status:'Soon',
    badge:'Step 4',
  },
];

/* ── Sidebar component ── */
function Sidebar({ name, email, onSignOut, active }: { name:string; email:string; onSignOut:()=>void; active:string }) {
  return (
    <aside style={{
      position:'fixed', top:0, left:0, bottom:0, width:240,
      background:C.bg2, borderRight:`1px solid ${C.border}`,
      display:'flex', flexDirection:'column', zIndex:50,
    }}>
      {/* Logo */}
      <div style={{ padding:'24px 20px 20px', borderBottom:`1px solid ${C.border}` }}>
        <Link href="/" style={{ display:'flex', alignItems:'center', gap:10, textDecoration:'none' }}>
          <div style={{ width:34, height:34, borderRadius:10, background:grad, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, fontSize:16, color:'#fff' }}>F</div>
          <span style={{ fontWeight:800, fontSize:17, color:C.text, letterSpacing:'-0.03em' }}>FTax</span>
        </Link>
        <div style={{ marginTop:8, display:'inline-flex', alignItems:'center', gap:6, fontSize:11, fontWeight:700, letterSpacing:'0.06em', padding:'3px 10px', borderRadius:999, background:`${C.pine}1a`, border:`1px solid ${C.pine}40`, color:C.pine }}>
          TAX YEAR 2025
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex:1, padding:'12px 10px', display:'flex', flexDirection:'column', gap:2 }}>
        {NAV.map(({ href, icon:Icon, label }) => {
          const isActive = active === href;
          return (
            <Link key={href} href={href} style={{
              display:'flex', alignItems:'center', gap:12, padding:'10px 12px',
              borderRadius:10, textDecoration:'none', transition:'all .15s',
              background: isActive ? `rgba(83,128,131,0.15)` : 'transparent',
              color: isActive ? C.pine : C.muted,
              fontWeight: isActive ? 600 : 400, fontSize:14,
              border: isActive ? `1px solid rgba(83,128,131,0.3)` : '1px solid transparent',
            }}>
              <Icon size={16}/>
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User + Sign out */}
      <div style={{ padding:'16px 16px 20px', borderTop:`1px solid ${C.border}` }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
          <div style={{ width:34, height:34, borderRadius:'50%', background:grad, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:14, color:'#fff', flexShrink:0 }}>
            {name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div style={{ minWidth:0 }}>
            <p style={{ fontSize:13, fontWeight:600, color:C.text, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{name}</p>
            <p style={{ fontSize:11, color:C.dim, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{email}</p>
          </div>
        </div>
        <button onClick={onSignOut} style={{
          width:'100%', display:'flex', alignItems:'center', gap:8,
          background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)',
          borderRadius:8, padding:'8px 12px', color:'#fca5a5', fontSize:13,
          cursor:'pointer', fontWeight:500, transition:'all .15s',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,0.15)'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,0.08)'; }}
        >
          <LogOut size={14}/> Sign out
        </button>
      </div>
    </aside>
  );
}

/* ── Stat card ── */
function StatCard({ label, value, sub, color }: { label:string; value:string; sub:string; color:string }) {
  return (
    <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:'22px 24px' }}>
      <p style={{ fontSize:12, color:C.muted, fontWeight:600, letterSpacing:'0.06em', textTransform:'uppercase', marginBottom:8 }}>{label}</p>
      <p style={{ fontSize:28, fontWeight:900, letterSpacing:'-0.04em', background:gradText, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>{value}</p>
      <p style={{ fontSize:12, color, marginTop:4 }}>{sub}</p>
    </div>
  );
}

/* ── Page ── */
export default function DashboardPage() {
  const router  = useRouter();
  const [user,    setUser]    = useState<any>(null);
  const [mobile,  setMobile]  = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) { router.push('/login'); return; }

    apiFetch('/auth/me')
      .then(setUser)
      .catch(() => {
        localStorage.removeItem('access_token');
        router.push('/login');
      });
  }, [router]);

  const signOut = () => {
    localStorage.removeItem('access_token');
    router.push('/login');
  };

  if (!user) {
    return (
      <div style={{ minHeight:'100vh', background:C.bg, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Inter',system-ui,sans-serif" }}>
        <div style={{ textAlign:'center', color:C.muted }}>
          <div style={{ width:40, height:40, borderRadius:'50%', border:`3px solid ${C.pine}`, borderTopColor:'transparent', margin:'0 auto 16px', animation:'spin 0.8s linear infinite' }}/>
          Loading your dashboard...
        </div>
      </div>
    );
  }

  const firstName = user.firstName || user.name?.split(' ')[0] || 'there';
  const email     = user.email || '';

  return (
    <div style={{ minHeight:'100vh', background:C.bg, color:C.text, fontFamily:"'Inter',system-ui,sans-serif" }}>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar name={firstName} email={email} onSignOut={signOut} active="/dashboard"/>
      </div>

      {/* Mobile topbar */}
      <div className="lg:hidden" style={{ position:'sticky', top:0, zIndex:50, height:56, background:`rgba(10,15,20,0.95)`, borderBottom:`1px solid ${C.border}`, backdropFilter:'blur(12px)', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 20px' }}>
        <Link href="/" style={{ display:'flex', alignItems:'center', gap:8, textDecoration:'none' }}>
          <div style={{ width:30, height:30, borderRadius:8, background:grad, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, fontSize:14, color:'#fff' }}>F</div>
          <span style={{ fontWeight:800, fontSize:16, color:C.text }}>FTax</span>
        </Link>
        <button onClick={() => setMobile(o => !o)} style={{ background:'none', border:`1px solid ${C.border}`, borderRadius:8, padding:6, cursor:'pointer', color:C.text, display:'flex' }}>
          {mobile ? <X size={18}/> : <Menu size={18}/>}
        </button>
      </div>

      {/* Mobile nav drawer */}
      {mobile && (
        <div style={{ position:'fixed', inset:0, zIndex:40, background:`rgba(10,15,20,0.98)`, paddingTop:56 }}>
          <div style={{ padding:'16px 20px', display:'flex', flexDirection:'column', gap:4 }}>
            {NAV.map(({ href, icon:Icon, label }) => (
              <Link key={href} href={href} onClick={() => setMobile(false)} style={{ display:'flex', alignItems:'center', gap:12, padding:'14px 16px', borderRadius:10, textDecoration:'none', color:C.muted, fontSize:15 }}>
                <Icon size={18}/> {label}
              </Link>
            ))}
            <div style={{ marginTop:16, borderTop:`1px solid ${C.border}`, paddingTop:16 }}>
              <button onClick={signOut} style={{ display:'flex', alignItems:'center', gap:8, background:'none', border:'none', color:'#fca5a5', fontSize:14, cursor:'pointer' }}>
                <LogOut size={16}/> Sign out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <main style={{ paddingLeft:0, transition:'padding .3s' }} className="lg:pl-60">
        <div style={{ maxWidth:1000, margin:'0 auto', padding:'40px 24px' }}>

          {/* Header */}
          <div style={{ marginBottom:36 }}>
            <p style={{ fontSize:13, color:C.muted, fontWeight:500, marginBottom:4 }}>Welcome back</p>
            <h1 style={{ fontSize:'clamp(26px,4vw,36px)', fontWeight:900, letterSpacing:'-0.03em', marginBottom:8 }}>
              Hello, <span style={{ background:gradText, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>{firstName}</span> 👋
            </h1>
            <p style={{ color:C.muted, fontSize:15 }}>Here&apos;s your tax filing progress for <strong style={{ color:C.text }}>Tax Year 2025</strong>.</p>
          </div>

          {/* Info banner */}
          <div style={{ display:'flex', alignItems:'flex-start', gap:12, background:'rgba(83,128,131,0.08)', border:`1px solid rgba(83,128,131,0.25)`, borderRadius:12, padding:'14px 18px', marginBottom:32 }}>
            <AlertTriangle size={16} color={C.pine} style={{ flexShrink:0, marginTop:2 }}/>
            <p style={{ fontSize:13, color:C.muted, lineHeight:1.65 }}>
              <strong style={{ color:C.text }}>Important: </strong>
              F-1 students must file taxes by <strong style={{ color:C.text }}>April 15, 2025</strong>, even with zero income. Form 8843 is required for all F-1 visa holders.
            </p>
          </div>

          {/* Stats row */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:14, marginBottom:36 }}>
            <StatCard label="Tax Year" value="2025" sub="Filing deadline Apr 15" color={C.pine}/>
            <StatCard label="Your Visa" value="F-1" sub="Student visa status" color={C.teal}/>
            <StatCard label="Forms" value="8843" sub="Minimum required" color={C.muted}/>
            <StatCard label="Status" value="Pending" sub="Complete steps below" color={C.muted}/>
          </div>

          {/* Filing steps */}
          <div style={{ marginBottom:12 }}>
            <h2 style={{ fontSize:18, fontWeight:800, letterSpacing:'-0.02em', marginBottom:4 }}>Your filing checklist</h2>
            <p style={{ color:C.muted, fontSize:14, marginBottom:20 }}>Complete each step in order to prepare your tax filing.</p>
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:12, marginBottom:48 }}>
            {TASKS.map(({ id, href, icon:Icon, color, title, desc, status, badge }, idx) => {
              const available = status === 'Start';
              return (
                <div key={id} style={{
                  display:'flex', alignItems:'center', gap:18,
                  background: available ? 'rgba(83,128,131,0.07)' : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${available ? 'rgba(83,128,131,0.25)' : C.border}`,
                  borderRadius:16, padding:'20px 24px',
                  transition:'all .2s', cursor: available ? 'pointer' : 'default',
                  opacity: available ? 1 : 0.6,
                }}
                onClick={() => available && router.push(href)}
                onMouseEnter={e => { if (available) (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(83,128,131,0.5)'; }}
                onMouseLeave={e => { if (available) (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(83,128,131,0.25)'; }}
                >
                  {/* Step number */}
                  <div style={{ width:40, height:40, borderRadius:12, background:`${color}1a`, border:`1px solid ${color}40`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <Icon size={18} color={color}/>
                  </div>

                  <div style={{ flex:1 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                      <span style={{ fontSize:10, fontWeight:800, letterSpacing:'0.08em', color, padding:'2px 8px', borderRadius:999, background:`${color}1a`, border:`1px solid ${color}30` }}>{badge}</span>
                    </div>
                    <h3 style={{ fontWeight:700, fontSize:15, color:C.text, marginBottom:4 }}>{title}</h3>
                    <p style={{ fontSize:13, color:C.muted, lineHeight:1.6 }}>{desc}</p>
                  </div>

                  <div style={{ flexShrink:0 }}>
                    {available ? (
                      <Link href={href} style={{
                        display:'inline-flex', alignItems:'center', gap:6, textDecoration:'none',
                        background:grad, color:'#fff', fontWeight:700, fontSize:13,
                        padding:'8px 16px', borderRadius:10,
                      }}>
                        Start <ArrowRight size={14}/>
                      </Link>
                    ) : (
                      <span style={{ fontSize:12, color:C.dim, fontWeight:500, padding:'6px 12px', borderRadius:8, border:`1px solid ${C.border}` }}>
                        <Clock size={12} style={{ display:'inline', marginRight:4 }}/>Coming soon
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Security footer */}
          <div style={{ display:'flex', alignItems:'center', gap:10, padding:'16px 20px', borderRadius:12, background:'rgba(42,127,98,0.06)', border:'1px solid rgba(42,127,98,0.18)' }}>
            <Shield size={16} color={C.teal}/>
            <p style={{ fontSize:13, color:C.muted }}>
              Your data is encrypted with AES-256. We never sell or share your personal information.
            </p>
          </div>
        </div>
      </main>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
