'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiFetch, C, grad, gradText } from '@/lib/api';
import { ArrowRight, Lock, Mail, Eye, EyeOff, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPw,   setShowPw]   = useState(false);
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      localStorage.setItem('access_token', data.accessToken);
      document.cookie = `access_token=${data.accessToken}; path=/; max-age=900; SameSite=Strict`;
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', background: C.bg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24, fontFamily: "'Inter',system-ui,sans-serif", position: 'relative', overflow: 'hidden',
    }}>
      {/* Ambient glows */}
      <div style={{ position:'fixed', top:'-10%', left:'50%', transform:'translateX(-50%)', width:700, height:500, background:'radial-gradient(ellipse, rgba(83,128,131,0.14) 0%, transparent 65%)', pointerEvents:'none' }}/>
      <div style={{ position:'fixed', bottom:'5%', right:'10%', width:400, height:400, background:'radial-gradient(ellipse, rgba(42,127,98,0.09) 0%, transparent 65%)', pointerEvents:'none' }}/>

      <div style={{ width:'100%', maxWidth:440, position:'relative', zIndex:1 }}>
        {/* Logo */}
        <div style={{ textAlign:'center', marginBottom:44 }}>
          <Link href="/" style={{ textDecoration:'none', display:'inline-flex', alignItems:'center', gap:12 }}>
            <div style={{ width:42, height:42, borderRadius:13, background:grad, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, fontSize:20, color:'#fff', boxShadow:'0 4px 20px rgba(83,128,131,0.4)' }}>F</div>
            <span style={{ fontWeight:800, fontSize:22, color:C.text, letterSpacing:'-0.04em' }}>FTax</span>
          </Link>
          <p style={{ color:C.muted, fontSize:13, marginTop:10, letterSpacing:'0.01em' }}>Tax guidance for international students</p>
        </div>

        {/* Card */}
        <div style={{
          background: 'rgba(13,21,32,0.80)',
          border: `1px solid rgba(83,145,150,0.22)`,
          borderRadius: 24, padding: '44px 40px',
          backdropFilter: 'blur(24px)',
          boxShadow: '0 32px 80px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.04)',
        }}>
          <h1 style={{ fontSize:28, fontWeight:900, letterSpacing:'-0.04em', marginBottom:6, color:C.text }}>
            Welcome back
          </h1>
          <p style={{ color:C.muted, fontSize:14, marginBottom:36 }}>Sign in to your FTax account</p>

          {error && (
            <div style={{ background:'rgba(239,68,68,0.09)', border:'1px solid rgba(239,68,68,0.28)', borderRadius:12, padding:'13px 16px', marginBottom:20, color:'#fca5a5', fontSize:14, display:'flex', gap:8, alignItems:'center' }}>
              <span style={{ fontSize:16 }}>⚠</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:18 }}>
            {/* Email */}
            <div>
              <label style={{ display:'block', fontSize:12, fontWeight:600, color:C.muted, letterSpacing:'0.06em', textTransform:'uppercase', marginBottom:8 }}>Email address</label>
              <div style={{ position:'relative' }}>
                <Mail size={15} color={C.muted} style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }}/>
                <input
                  id="login-email" type="email" placeholder="you@uic.edu"
                  value={email} onChange={e => setEmail(e.target.value)} required
                  className="inp" style={{ paddingLeft:42 }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={{ display:'block', fontSize:12, fontWeight:600, color:C.muted, letterSpacing:'0.06em', textTransform:'uppercase', marginBottom:8 }}>Password</label>
              <div style={{ position:'relative' }}>
                <Lock size={15} color={C.muted} style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }}/>
                <input
                  id="login-password" type={showPw ? 'text' : 'password'} placeholder="••••••••"
                  value={password} onChange={e => setPassword(e.target.value)} required
                  className="inp" style={{ paddingLeft:42, paddingRight:44 }}
                />
                <button type="button" onClick={() => setShowPw(s => !s)} style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:C.muted, display:'flex', padding:0, transition:'color .15s' }}>
                  {showPw ? <EyeOff size={16}/> : <Eye size={16}/>}
                </button>
              </div>
            </div>

            <div style={{ textAlign:'right', marginTop:-6 }}>
              <Link href="/forgot-password" style={{ color:C.pine, fontSize:13, textDecoration:'none', fontWeight:500, transition:'opacity .15s' }}>
                Forgot password?
              </Link>
            </div>

            <button
              id="login-submit" type="submit" disabled={loading}
              className="btn-primary"
              style={{
                background: loading ? 'rgba(83,128,131,0.35)' : grad,
                color:'#fff', padding:'15px', fontSize:15,
                justifyContent:'center', borderRadius:12, marginTop:4,
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: loading ? 'none' : '0 8px 28px rgba(83,128,131,0.32)',
              }}
            >
              {loading ? 'Signing in…' : <><span>Sign in</span><ArrowRight size={16}/></>}
            </button>
          </form>

          <div style={{ marginTop:28, textAlign:'center' }}>
            <span style={{ color:C.muted, fontSize:14 }}>Don&apos;t have an account? </span>
            <Link href="/register" style={{ color:C.pine, fontSize:14, fontWeight:700, textDecoration:'none' }}>
              Create one free
            </Link>
          </div>
        </div>

        {/* Trust badge */}
        <div style={{ textAlign:'center', marginTop:22 }}>
          <span style={{ display:'inline-flex', alignItems:'center', gap:7, fontSize:12, color:C.dim }}>
            <ShieldCheck size={13} color={C.pine}/> AES-256 encrypted · Never sold · Free for UIC students
          </span>
        </div>
      </div>
    </div>
  );
}
