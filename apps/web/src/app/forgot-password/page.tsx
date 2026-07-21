'use client';
import { useState } from 'react';
import Link from 'next/link';
import { C, grad } from '@/lib/api';
import { Mail, ArrowRight, ShieldCheck, CheckCircle } from 'lucide-react';
import { apiFetch } from '@/lib/api';

export default function ForgotPasswordPage() {
  const [email,   setEmail]   = useState('');
  const [sent,    setSent]    = useState(false);
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await apiFetch('/auth/forgot-password', { method:'POST', body: JSON.stringify({ email }) });
      setSent(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight:'100vh', background:C.bg,
      display:'flex', alignItems:'center', justifyContent:'center',
      padding:24, fontFamily:"'Inter',system-ui,sans-serif", position:'relative', overflow:'hidden',
    }}>
      {/* Ambient glows */}
      <div style={{ position:'fixed', top:'-10%', left:'50%', transform:'translateX(-50%)', width:700, height:500, background:'radial-gradient(ellipse, rgba(83,128,131,0.14) 0%, transparent 65%)', pointerEvents:'none' }}/>

      <div style={{ width:'100%', maxWidth:440, position:'relative', zIndex:1 }}>
        {/* Logo */}
        <div style={{ textAlign:'center', marginBottom:44 }}>
          <Link href="/" style={{ textDecoration:'none', display:'inline-flex', alignItems:'center', gap:12 }}>
            <div style={{ width:42, height:42, borderRadius:13, background:grad, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, fontSize:20, color:'#fff', boxShadow:'0 4px 20px rgba(83,128,131,0.4)' }}>F</div>
            <span style={{ fontWeight:800, fontSize:22, color:C.text, letterSpacing:'-0.04em' }}>FTax</span>
          </Link>
        </div>

        <div style={{
          background:'rgba(13,21,32,0.80)', border:`1px solid rgba(83,145,150,0.22)`,
          borderRadius:24, padding:'44px 40px',
          backdropFilter:'blur(24px)',
          boxShadow:'0 32px 80px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.04)',
        }}>
          {sent ? (
            <div style={{ textAlign:'center', padding:'24px 0' }}>
              <div style={{ width:56, height:56, borderRadius:'50%', background:'rgba(42,127,98,0.15)', border:'1px solid rgba(42,127,98,0.30)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px' }}>
                <CheckCircle size={26} color={C.teal}/>
              </div>
              <h1 style={{ fontSize:24, fontWeight:800, letterSpacing:'-0.03em', marginBottom:10, color:C.text }}>Check your inbox</h1>
              <p style={{ color:C.muted, fontSize:14, lineHeight:1.7 }}>
                We&apos;ve sent a password reset link to <strong style={{ color:C.text }}>{email}</strong>. Check your spam folder if you don&apos;t see it.
              </p>
              <Link href="/login" style={{ display:'inline-flex', alignItems:'center', gap:7, marginTop:28, background:grad, color:'#fff', fontWeight:700, fontSize:14, padding:'12px 22px', borderRadius:11, textDecoration:'none', boxShadow:'0 6px 22px rgba(83,128,131,0.30)' }}>
                Back to sign in <ArrowRight size={14}/>
              </Link>
            </div>
          ) : (
            <>
              <h1 style={{ fontSize:28, fontWeight:900, letterSpacing:'-0.04em', marginBottom:6, color:C.text }}>Reset password</h1>
              <p style={{ color:C.muted, fontSize:14, marginBottom:36 }}>Enter your email and we&apos;ll send you a reset link.</p>

              {error && (
                <div style={{ background:'rgba(239,68,68,0.09)', border:'1px solid rgba(239,68,68,0.28)', borderRadius:12, padding:'13px 16px', marginBottom:20, color:'#fca5a5', fontSize:14 }}>⚠ {error}</div>
              )}

              <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:20 }}>
                <div>
                  <label style={{ display:'block', fontSize:12, fontWeight:600, color:C.muted, letterSpacing:'0.06em', textTransform:'uppercase', marginBottom:8 }}>Email address</label>
                  <div style={{ position:'relative' }}>
                    <Mail size={15} color={C.muted} style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }}/>
                    <input id="fp-email" type="email" placeholder="you@uic.edu" value={email} onChange={e => setEmail(e.target.value)} required className="inp" style={{ paddingLeft:42 }}/>
                  </div>
                </div>

                <button id="fp-submit" type="submit" disabled={loading} className="btn-primary" style={{ background:loading?'rgba(83,128,131,0.35)':grad, color:'#fff', padding:'15px', fontSize:15, justifyContent:'center', borderRadius:12, cursor:loading?'not-allowed':'pointer', boxShadow:loading?'none':'0 8px 28px rgba(83,128,131,0.32)' }}>
                  {loading ? 'Sending…' : <><span>Send reset link</span><ArrowRight size={16}/></>}
                </button>
              </form>

              <div style={{ marginTop:28, textAlign:'center' }}>
                <Link href="/login" style={{ color:C.pine, fontSize:14, fontWeight:600, textDecoration:'none' }}>← Back to sign in</Link>
              </div>
            </>
          )}
        </div>

        <div style={{ textAlign:'center', marginTop:22 }}>
          <span style={{ display:'inline-flex', alignItems:'center', gap:7, fontSize:12, color:C.dim }}>
            <ShieldCheck size={13} color={C.pine}/> Secure password reset via email
          </span>
        </div>
      </div>
    </div>
  );
}
