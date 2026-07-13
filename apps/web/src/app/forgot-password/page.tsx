'use client';
import { useState } from 'react';
import Link from 'next/link';
import { apiFetch, C, grad } from '@/lib/api';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';

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
      await apiFetch('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
      setSent(true);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', boxSizing: 'border-box',
    background: 'rgba(83,128,131,0.08)',
    border: `1px solid ${C.border}`,
    borderRadius: 12, padding: '12px 16px 12px 44px',
    color: C.text, fontSize: 15, outline: 'none',
    transition: 'border-color .2s', fontFamily: 'inherit',
  };

  return (
    <div style={{ minHeight:'100vh', background:C.bg, display:'flex', alignItems:'center', justifyContent:'center', padding:24, fontFamily:"'Inter',system-ui,sans-serif" }}>
      <div style={{ position:'fixed', top:'20%', left:'50%', transform:'translateX(-50%)', width:600, height:400, background:'radial-gradient(ellipse, rgba(83,128,131,0.18), transparent 70%)', pointerEvents:'none' }}/>

      <div style={{ width:'100%', maxWidth:420, position:'relative', zIndex:1 }}>
        <div style={{ textAlign:'center', marginBottom:40 }}>
          <Link href="/" style={{ textDecoration:'none', display:'inline-flex', alignItems:'center', gap:10 }}>
            <div style={{ width:38, height:38, borderRadius:11, background:grad, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, fontSize:18, color:'#fff' }}>F</div>
            <span style={{ fontWeight:800, fontSize:20, color:C.text, letterSpacing:'-0.03em' }}>FTax</span>
          </Link>
        </div>

        <div style={{ background:'rgba(83,128,131,0.05)', border:`1px solid ${C.border}`, borderRadius:24, padding:'40px 36px', boxShadow:'0 24px 64px rgba(0,0,0,0.5)' }}>
          {sent ? (
            <div style={{ textAlign:'center', padding:'8px 0' }}>
              <div style={{ width:64, height:64, borderRadius:'50%', background:'rgba(42,127,98,0.15)', border:'1px solid rgba(42,127,98,0.3)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 24px' }}>
                <CheckCircle size={30} color={C.teal}/>
              </div>
              <h1 style={{ fontSize:22, fontWeight:900, color:C.text, marginBottom:12 }}>Check your email</h1>
              <p style={{ color:C.muted, fontSize:14, lineHeight:1.7, marginBottom:28 }}>
                We sent a password reset link to <strong style={{ color:C.text }}>{email}</strong>. Check your inbox and follow the link to reset your password.
              </p>
              <Link href="/login" style={{ display:'inline-flex', alignItems:'center', gap:8, color:C.pine, fontSize:14, fontWeight:600, textDecoration:'none' }}>
                <ArrowLeft size={14}/> Back to sign in
              </Link>
            </div>
          ) : (
            <>
              <h1 style={{ fontSize:26, fontWeight:900, letterSpacing:'-0.03em', marginBottom:6, color:C.text }}>Reset password</h1>
              <p style={{ color:C.muted, fontSize:14, marginBottom:32 }}>Enter your email and we will send you a reset link.</p>

              {error && (
                <div style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.3)', borderRadius:10, padding:'12px 16px', marginBottom:20, color:'#fca5a5', fontSize:14 }}>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:16 }}>
                <div style={{ position:'relative' }}>
                  <Mail size={16} color={C.muted} style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)' }}/>
                  <input
                    id="forgot-email"
                    type="email"
                    placeholder="Your email address"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    style={inputStyle}
                    required
                    onFocus={e => (e.target.style.borderColor = C.pine)}
                    onBlur={e  => (e.target.style.borderColor = C.border)}
                  />
                </div>

                <button
                  id="forgot-submit"
                  type="submit"
                  disabled={loading}
                  style={{
                    background: loading ? 'rgba(83,128,131,0.4)' : grad,
                    color:'#fff', fontWeight:700, border:'none', borderRadius:12,
                    padding:'14px', fontSize:15, cursor: loading ? 'not-allowed' : 'pointer',
                    transition:'transform .15s, box-shadow .15s',
                  }}
                  onMouseEnter={e => { if (!loading) { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 10px 32px rgba(83,128,131,.4)'; } }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = ''; (e.currentTarget as HTMLButtonElement).style.boxShadow = ''; }}
                >
                  {loading ? 'Sending...' : 'Send reset link'}
                </button>
              </form>

              <div style={{ marginTop:24, textAlign:'center' }}>
                <Link href="/login" style={{ display:'inline-flex', alignItems:'center', gap:6, color:C.pine, fontSize:14, fontWeight:500, textDecoration:'none' }}>
                  <ArrowLeft size={14}/> Back to sign in
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
