'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiFetch, C, grad } from '@/lib/api';
import { ArrowRight, Lock, Mail, User, Eye, EyeOff, Sparkles, CheckCircle } from 'lucide-react';

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: '8+ characters', ok: password.length >= 8 },
    { label: 'Uppercase letter', ok: /[A-Z]/.test(password) },
    { label: 'Number', ok: /\d/.test(password) },
  ];
  if (!password) return null;
  return (
    <div style={{ display:'flex', gap:12, marginTop:6 }}>
      {checks.map(({ label, ok }) => (
        <span key={label} style={{ display:'flex', alignItems:'center', gap:4, fontSize:11, color: ok ? C.teal : C.dim }}>
          <CheckCircle size={11} color={ok ? C.teal : C.dim}/> {label}
        </span>
      ))}
    </div>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const [name,     setName]     = useState('');
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
      await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
      });
      router.push('/login?registered=1');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const input: React.CSSProperties = {
    width: '100%', boxSizing: 'border-box',
    background: 'rgba(83,128,131,0.08)',
    border: `1px solid ${C.border}`,
    borderRadius: 12, padding: '12px 16px 12px 44px',
    color: C.text, fontSize: 15, outline: 'none',
    transition: 'border-color .2s',
    fontFamily: 'inherit',
  };

  return (
    <div style={{ minHeight:'100vh', background:C.bg, display:'flex', alignItems:'center', justifyContent:'center', padding:24, fontFamily:"'Inter',system-ui,sans-serif" }}>
      <div style={{ position:'fixed', top:'20%', left:'50%', transform:'translateX(-50%)', width:600, height:400, background:'radial-gradient(ellipse, rgba(83,128,131,0.18), transparent 70%)', pointerEvents:'none' }}/>

      <div style={{ width:'100%', maxWidth:440, position:'relative', zIndex:1 }}>
        {/* Logo */}
        <div style={{ textAlign:'center', marginBottom:40 }}>
          <Link href="/" style={{ textDecoration:'none', display:'inline-flex', alignItems:'center', gap:10 }}>
            <div style={{ width:38, height:38, borderRadius:11, background:grad, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, fontSize:18, color:'#fff' }}>F</div>
            <span style={{ fontWeight:800, fontSize:20, color:C.text, letterSpacing:'-0.03em' }}>FTax</span>
          </Link>
          <p style={{ color:C.muted, fontSize:13, marginTop:8 }}>Tax guidance for international students</p>
        </div>

        {/* Card */}
        <div style={{ background:'rgba(83,128,131,0.05)', border:`1px solid ${C.border}`, borderRadius:24, padding:'40px 36px', boxShadow:'0 24px 64px rgba(0,0,0,0.5)' }}>
          <h1 style={{ fontSize:26, fontWeight:900, letterSpacing:'-0.03em', marginBottom:6, color:C.text }}>
            Create your account
          </h1>
          <p style={{ color:C.muted, fontSize:14, marginBottom:32 }}>Free forever for UIC F-1 students</p>

          {error && (
            <div style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.3)', borderRadius:10, padding:'12px 16px', marginBottom:20, color:'#fca5a5', fontSize:14 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:16 }}>
            {/* Name */}
            <div style={{ position:'relative' }}>
              <User size={16} color={C.muted} style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)' }}/>
              <input
                id="register-name"
                type="text"
                placeholder="Full name"
                value={name}
                onChange={e => setName(e.target.value)}
                style={input}
                required
                onFocus={e => (e.target.style.borderColor = C.pine)}
                onBlur={e  => (e.target.style.borderColor = C.border)}
              />
            </div>

            {/* Email */}
            <div style={{ position:'relative' }}>
              <Mail size={16} color={C.muted} style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)' }}/>
              <input
                id="register-email"
                type="email"
                placeholder="Email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={input}
                required
                onFocus={e => (e.target.style.borderColor = C.pine)}
                onBlur={e  => (e.target.style.borderColor = C.border)}
              />
            </div>

            {/* Password */}
            <div>
              <div style={{ position:'relative' }}>
                <Lock size={16} color={C.muted} style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)' }}/>
                <input
                  id="register-password"
                  type={showPw ? 'text' : 'password'}
                  placeholder="Create a password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  style={{ ...input, paddingRight:44 }}
                  required
                  minLength={8}
                  onFocus={e => (e.target.style.borderColor = C.pine)}
                  onBlur={e  => (e.target.style.borderColor = C.border)}
                />
                <button type="button" onClick={() => setShowPw(s => !s)}
                  style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:C.muted, display:'flex', padding:0 }}>
                  {showPw ? <EyeOff size={16}/> : <Eye size={16}/>}
                </button>
              </div>
              <PasswordStrength password={password}/>
            </div>

            <button
              id="register-submit"
              type="submit"
              disabled={loading}
              style={{
                background: loading ? 'rgba(83,128,131,0.4)' : grad,
                color:'#fff', fontWeight:700, border:'none', borderRadius:12,
                padding:'14px', fontSize:15, cursor: loading ? 'not-allowed' : 'pointer',
                display:'flex', alignItems:'center', justifyContent:'center', gap:8,
                marginTop:4,
                transition:'transform .15s, box-shadow .15s',
              }}
              onMouseEnter={e => { if (!loading) { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 10px 32px rgba(83,128,131,.4)'; } }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = ''; (e.currentTarget as HTMLButtonElement).style.boxShadow = ''; }}
            >
              {loading ? 'Creating account...' : (<>Create free account <ArrowRight size={16}/></>)}
            </button>
          </form>

          <div style={{ marginTop:24, textAlign:'center' }}>
            <span style={{ color:C.muted, fontSize:14 }}>Already have an account? </span>
            <Link href="/login" style={{ color:C.pine, fontSize:14, fontWeight:600, textDecoration:'none' }}>Sign in</Link>
          </div>
        </div>

        <div style={{ textAlign:'center', marginTop:20 }}>
          <span style={{ display:'inline-flex', alignItems:'center', gap:6, fontSize:12, color:C.dim }}>
            <Sparkles size={12} color={C.pine}/> No credit card required · Free for UIC students
          </span>
        </div>
      </div>
    </div>
  );
}
