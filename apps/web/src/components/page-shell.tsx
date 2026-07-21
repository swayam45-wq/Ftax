'use client';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { C, grad } from '@/lib/api';

export function TopNav({
  back = '/dashboard', backLabel = 'Dashboard', title, rightSlot,
}: {
  back?: string; backLabel?: string; title: string; rightSlot?: React.ReactNode;
}) {
  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 50, height: 60,
      background: 'rgba(10,15,20,0.92)',
      borderBottom: `1px solid rgba(83,145,150,0.14)`,
      backdropFilter: 'blur(20px)',
      display: 'flex', alignItems: 'center', padding: '0 28px', gap: 16,
    }}>
      <Link href={back} style={{ display:'flex', alignItems:'center', gap:6, textDecoration:'none', color:C.muted, fontSize:14, transition:'color .15s' }}
        onMouseEnter={e => (e.currentTarget.style.color = C.text)}
        onMouseLeave={e => (e.currentTarget.style.color = C.muted)}
      >
        <ArrowLeft size={15}/> {backLabel}
      </Link>
      <span style={{ color:'rgba(83,145,150,0.35)' }}>·</span>
      <span style={{ fontSize:14, color:C.text, fontWeight:700 }}>{title}</span>
      {rightSlot && <div style={{ marginLeft:'auto' }}>{rightSlot}</div>}
      {!rightSlot && (
        <Link href="/" style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:8, textDecoration:'none' }}>
          <div style={{ width:30, height:30, borderRadius:9, background:grad, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, fontSize:14, color:'#fff', boxShadow:'0 2px 10px rgba(83,128,131,0.3)' }}>F</div>
        </Link>
      )}
    </div>
  );
}

export function PageShell({
  children, back, backLabel, title, maxWidth = 780, rightSlot,
}: {
  children: React.ReactNode; back?: string; backLabel?: string;
  title: string; maxWidth?: number; rightSlot?: React.ReactNode;
}) {
  return (
    <div style={{ minHeight:'100vh', background:C.bg, color:C.text, fontFamily:"'Inter',system-ui,sans-serif", position:'relative' }}>
      {/* Ambient glow */}
      <div style={{ position:'fixed', top:0, left:'50%', transform:'translateX(-50%)', width:800, height:400, background:'radial-gradient(ellipse, rgba(83,128,131,0.10) 0%, transparent 65%)', pointerEvents:'none', zIndex:0 }}/>
      <TopNav back={back} backLabel={backLabel} title={title} rightSlot={rightSlot}/>
      <div style={{ maxWidth, margin:'0 auto', padding:'44px 28px', position:'relative', zIndex:1 }}>
        {children}
      </div>
    </div>
  );
}
