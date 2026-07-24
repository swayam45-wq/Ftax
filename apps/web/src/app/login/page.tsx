'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { apiFetch } from '@/lib/api';
import { ArrowRight, Lock, Mail, Eye, EyeOff, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';

/* Design tokens matching the cinematic dark palette */
const A = '#7BA4B8';
const AG = 'rgba(123,164,184,0.14)';
const AB = 'rgba(123,164,184,0.30)';
const GOLD = '#C4955A';

const T = {
  bg:      '#080B10',
  surface: '#0E1218',
  card:    'rgba(14,18,24,0.88)',
  text:    '#C8CBD0',
  heading: '#E8E8E6',
  muted:   '#5A6472',
  dim:     'rgba(90,100,114,0.55)',
  border:  'rgba(255,255,255,0.07)',
} as const;

function Logo() {
  return (
    <svg width="32" height="32" viewBox="0 0 256 256" fill={A}>
      <path d="M 64 128 L 64.5 128 L 32 95 L 0 64 L 0 0 L 64 0 L 128 64 L 128 64.5 L 161 32 L 192 0 L 256 0 L 256 64 L 192 128 L 128 128 L 128 192 L 96 223 L 63.5 256 L 0 256 L 0 192 Z M 256 192 L 224 223 L 191.5 256 L 128 256 L 128 192 L 192 128 L 256 128 Z" />
    </svg>
  );
}

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
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: T.bg,
      color: T.text,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px 24px',
      fontFamily: "'Inter', system-ui, sans-serif",
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Film grain overlay */}
      <div className="film-grain" />

      {/* Ambient background glows */}
      <div className="aurora-1" style={{
        width: 600, height: 450, zIndex: 0,
        top: '-10%', left: '50%', transform: 'translateX(-50%)',
        background: 'radial-gradient(ellipse, rgba(123,164,184,0.18) 0%, transparent 70%)',
      }} />
      <div className="aurora-2" style={{
        width: 450, height: 400, zIndex: 0,
        bottom: '5%', right: '10%',
        background: 'radial-gradient(ellipse, rgba(196,149,90,0.12) 0%, transparent 70%)',
      }} />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: [0.21, 1, 0.43, 1] }}
        style={{ width: '100%', maxWidth: 450, position: 'relative', zIndex: 10 }}
      >
        {/* Top Header & Logo */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 10 }}>
            <Logo />
            <span style={{ fontWeight: 800, fontSize: 24, color: T.heading, letterSpacing: '-0.04em' }}>FTax</span>
          </Link>
          <div style={{ marginTop: 12 }}>
            <span style={{
              fontSize: 10, fontWeight: 700, letterSpacing: '0.12em',
              padding: '5px 14px', borderRadius: 99,
              background: 'rgba(196,149,90,0.10)', border: '1px solid rgba(196,149,90,0.24)',
              color: GOLD, display: 'inline-flex', alignItems: 'center', gap: 5
            }}>
              <Sparkles size={11} /> INTERNATIONAL STUDENT TAXES
            </span>
          </div>
        </div>

        {/* Form Card */}
        <div style={{
          background: T.card,
          border: `1px solid ${AB}`,
          borderRadius: 24,
          padding: '40px 36px',
          backdropFilter: 'blur(24px)',
          boxShadow: '0 32px 80px rgba(0,0,0,0.55), 0 0 32px rgba(123,164,184,0.12)',
        }}>
          <h1 style={{
            fontSize: 26, fontWeight: 900, letterSpacing: '-0.03em',
            marginBottom: 6, color: T.heading, fontFamily: 'var(--font-heading)'
          }}>
            Welcome Back
          </h1>
          <p style={{ color: T.muted, fontSize: 14, marginBottom: 30 }}>
            Sign in to continue filing your F-1 tax forms.
          </p>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                background: 'rgba(239,68,68,0.10)',
                border: '1px solid rgba(239,68,68,0.25)',
                borderRadius: 12,
                padding: '12px 16px',
                marginBottom: 24,
                color: '#FCA5A5',
                fontSize: 13,
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <span style={{ fontSize: 16 }}>⚠</span>
              <span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Email Field */}
            <div>
              <label style={{
                display: 'block', fontSize: 11, fontWeight: 700,
                color: T.muted, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8
              }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color={A} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', opacity: 0.8 }} />
                <input
                  id="login-email"
                  type="email"
                  placeholder="you@uic.edu"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    background: 'rgba(8,11,16,0.60)',
                    border: `1px solid ${T.border}`,
                    borderRadius: 12,
                    padding: '13px 16px 13px 44px',
                    color: T.heading,
                    fontSize: 14,
                    outline: 'none',
                    transition: 'all 0.2s',
                  }}
                  onFocus={e => { e.currentTarget.style.borderColor = AB; e.currentTarget.style.boxShadow = '0 0 16px rgba(123,164,184,0.15)'; }}
                  onBlur={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.boxShadow = 'none'; }}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <label style={{
                  display: 'block', fontSize: 11, fontWeight: 700,
                  color: T.muted, letterSpacing: '0.08em', textTransform: 'uppercase'
                }}>
                  Password
                </label>
                <Link href="/forgot-password" style={{ color: A, fontSize: 12, textDecoration: 'none', fontWeight: 500, transition: 'opacity 0.15s' }}>
                  Forgot password?
                </Link>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color={A} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', opacity: 0.8 }} />
                <input
                  id="login-password"
                  type={showPw ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    background: 'rgba(8,11,16,0.60)',
                    border: `1px solid ${T.border}`,
                    borderRadius: 12,
                    padding: '13px 44px 13px 44px',
                    color: T.heading,
                    fontSize: 14,
                    outline: 'none',
                    transition: 'all 0.2s',
                  }}
                  onFocus={e => { e.currentTarget.style.borderColor = AB; e.currentTarget.style.boxShadow = '0 0 16px rgba(123,164,184,0.15)'; }}
                  onBlur={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.boxShadow = 'none'; }}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(s => !s)}
                  style={{
                    position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: T.muted,
                    display: 'flex', padding: 0, transition: 'color 0.15s'
                  }}
                >
                  {showPw ? <EyeOff size={16} color={T.text} /> : <Eye size={16} color={T.muted} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              id="login-submit"
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              style={{
                width: '100%',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                padding: '14px',
                borderRadius: 12,
                background: loading ? 'rgba(123,164,184,0.10)' : AG,
                border: `1px solid ${AB}`,
                color: T.heading,
                fontWeight: 700,
                fontSize: 15,
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
                backdropFilter: 'blur(8px)',
                marginTop: 6,
                transition: 'all 0.2s',
              }}
            >
              {loading ? (
                <span>Signing in…</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={16} />
                </>
              )}
            </motion.button>
          </form>

          {/* Footer Navigation */}
          <div style={{ marginTop: 28, textAlign: 'center', borderTop: `1px solid ${T.border}`, paddingTop: 20 }}>
            <span style={{ color: T.muted, fontSize: 13 }}>Don&apos;t have an account? </span>
            <Link href="/register" style={{ color: A, fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
              Create one free
            </Link>
          </div>
        </div>

        {/* Security badge */}
        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 12, color: T.muted }}>
            <ShieldCheck size={14} color={A} /> AES-256 encrypted · Free for UIC students
          </span>
        </div>
      </motion.div>
    </div>
  );
}
