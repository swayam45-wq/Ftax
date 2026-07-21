'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiFetch, C, grad } from '@/lib/api';
import { ArrowRight, Lock, Mail, User, Eye, EyeOff, ShieldCheck, CheckCircle } from 'lucide-react';

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: '8+ chars',   ok: password.length >= 8 },
    { label: 'Uppercase',  ok: /[A-Z]/.test(password) },
    { label: 'Number',     ok: /\d/.test(password) },
  ];
  if (!password) return null;
  const strong = checks.every(c => c.ok);
  return (
    <div style={{ display:'flex', gap:10, marginTop:7 }}>
      {checks.map(({ label, ok }) => (
        <span key={label} style={{ display:'flex', alignItems:'center', gap:4, fontSize:11, color: ok ? C.teal : C.dim, transition:'color .2s' }}>
          <CheckCircle size={11} color={ok ? C.teal : 'rgba(138,151,168,0.35)'}/> {label}
        </span>
      ))}
    </div>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName,  setLastName]  = useState('');
  const [email,     setEmail]     = useState('');
  const [password,  setPassword]  = useState('');
  const [showPw,    setShowPw]    = useState(false);
  const [error,     setError]     = useState('');
  const [loading,   setLoading]   = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ firstName, lastName, email, password }),
      });
      router.push('/login?registered=1');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: 12, fontWeight: 600,
    color: C.muted, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8,
  };

  return (
    <div style={{
      minHeight: '100vh', background: C.bg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24, fontFamily: "'Inter',system-ui,sans-serif", position: 'relative', overflow: 'hidden',
    }}>
      {/* Ambient glows */}
      <div style={{ position:'fixed', top:'-15%', right:'-5%', width:600, height:600, background:'radial-gradient(ellipse, rgba(83,128,131,0.13) 0%, transparent 65%)', pointerEvents:'none' }}/>
      <div style={{ position:'fixed', bottom:'0%', left:'-5%', width:500, height:500, background:'radial-gradient(ellipse, rgba(42,127,98,0.09) 0%, transparent 65%)', pointerEvents:'none' }}/>

      <div style={{ width:'100%', maxWidth:480, position:'relative', zIndex:1 }}>
        {/* Logo */}
        <div style={{ textAlign:'center', marginBottom:44 }}>
          <Link href="/" style={{ textDecoration:'none', display:'inline-flex', alignItems:'center', gap:12 }}>
            <div style={{ width:42, height:42, borderRadius:13, background:grad, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, fontSize:20, color:'#fff', boxShadow:'0 4px 20px rgba(83,128,131,0.4)' }}>F</div>
            <span style={{ fontWeight:800, fontSize:22, color:C.text, letterSpacing:'-0.04em' }}>FTax</span>
          </Link>
          <p style={{ color:C.muted, fontSize:13, marginTop:10 }}>Create your free account</p>
        </div>

        {/* Card */}
        <div style={{
          background: 'rgba(13,21,32,0.80)',
          border: `1px solid rgba(83,145,150,0.22)`,
          borderRadius: 24, padding: '44px 40px',
          backdropFilter: 'blur(24px)',
          boxShadow: '0 32px 80px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.04)',
        }}>
          <h1 style={{ fontSize:28, fontWeight:900, letterSpacing:'-0.04em', marginBottom:6, color:C.text }}>Get started free</h1>
          <p style={{ color:C.muted, fontSize:14, marginBottom:36 }}>Join hundreds of UIC international students</p>

          {error && (
            <div style={{ background:'rgba(239,68,68,0.09)', border:'1px solid rgba(239,68,68,0.28)', borderRadius:12, padding:'13px 16px', marginBottom:20, color:'#fca5a5', fontSize:14 }}>
              ⚠ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:18 }}>
            {/* Name row */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
              <div>
                <label style={labelStyle}>First name</label>
                <div style={{ position:'relative' }}>
                  <User size={15} color={C.muted} style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }}/>
                  <input id="reg-first" type="text" placeholder="Ada" value={firstName} onChange={e => setFirstName(e.target.value)} required className="inp" style={{ paddingLeft:42 }}/>
                </div>
              </div>
              <div>
                <label style={labelStyle}>Last name</label>
                <input id="reg-last" type="text" placeholder="Lovelace" value={lastName} onChange={e => setLastName(e.target.value)} required className="inp"/>
              </div>
            </div>

            {/* Email */}
            <div>
              <label style={labelStyle}>Email address</label>
              <div style={{ position:'relative' }}>
                <Mail size={15} color={C.muted} style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }}/>
                <input id="reg-email" type="email" placeholder="you@uic.edu" value={email} onChange={e => setEmail(e.target.value)} required className="inp" style={{ paddingLeft:42 }}/>
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={labelStyle}>Password</label>
              <div style={{ position:'relative' }}>
                <Lock size={15} color={C.muted} style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }}/>
                <input id="reg-password" type={showPw ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required className="inp" style={{ paddingLeft:42, paddingRight:44 }}/>
                <button type="button" onClick={() => setShowPw(s => !s)} style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:C.muted, display:'flex', padding:0 }}>
                  {showPw ? <EyeOff size={16}/> : <Eye size={16}/>}
                </button>
              </div>
              <PasswordStrength password={password}/>
            </div>

            <button
              id="reg-submit" type="submit" disabled={loading}
              className="btn-primary"
              style={{
                background: loading ? 'rgba(83,128,131,0.35)' : grad,
                color:'#fff', padding:'15px', fontSize:15,
                justifyContent:'center', borderRadius:12, marginTop:4,
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: loading ? 'none' : '0 8px 28px rgba(83,128,131,0.32)',
              }}
            >
              {loading ? 'Creating account…' : <><span>Create account</span><ArrowRight size={16}/></>}
            </button>
          </form>

          <div style={{ marginTop:28, textAlign:'center' }}>
            <span style={{ color:C.muted, fontSize:14 }}>Already have an account? </span>
            <Link href="/login" style={{ color:C.pine, fontSize:14, fontWeight:700, textDecoration:'none' }}>Sign in</Link>
          </div>
        </div>

        <div style={{ textAlign:'center', marginTop:22 }}>
          <span style={{ display:'inline-flex', alignItems:'center', gap:7, fontSize:12, color:C.dim }}>
            <ShieldCheck size={13} color={C.pine}/> AES-256 encrypted · Free forever for UIC students
          </span>
        </div>
      </div>
    </div>
  );
}
