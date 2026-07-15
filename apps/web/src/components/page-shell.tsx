'use client';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { C, grad } from '@/lib/api';

export function TopNav({ back = '/dashboard', backLabel = 'Dashboard', title }: { back?: string; backLabel?: string; title: string }) {
  return (
    <div style={{ position:'sticky', top:0, zIndex:50, height:56, background:'rgba(10,15,20,0.95)', borderBottom:`1px solid ${C.border}`, backdropFilter:'blur(12px)', display:'flex', alignItems:'center', padding:'0 24px', gap:16 }}>
      <Link href={back} style={{ display:'flex', alignItems:'center', gap:6, textDecoration:'none', color:C.muted, fontSize:14 }}>
        <ArrowLeft size={16}/> {backLabel}
      </Link>
      <span style={{ color:C.border }}>·</span>
      <span style={{ fontSize:14, color:C.text, fontWeight:600 }}>{title}</span>
      <Link href="/" style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:8, textDecoration:'none' }}>
        <div style={{ width:28, height:28, borderRadius:8, background:grad, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, fontSize:13, color:'#fff' }}>F</div>
      </Link>
    </div>
  );
}

export function PageShell({ children, back, backLabel, title }: { children: React.ReactNode; back?: string; backLabel?: string; title: string }) {
  return (
    <div style={{ minHeight:'100vh', background:C.bg, color:C.text, fontFamily:"'Inter',system-ui,sans-serif" }}>
      <TopNav back={back} backLabel={backLabel} title={title}/>
      <div style={{ maxWidth:760, margin:'0 auto', padding:'40px 24px' }}>
        {children}
      </div>
    </div>
  );
}
