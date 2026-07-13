'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiFetch, C, grad, gradText } from '@/lib/api';
import {
  ArrowLeft, User, Plane, Save, Plus, Trash2,
  CheckCircle, Shield, ChevronRight, AlertTriangle,
  GraduationCap, Globe, Calendar, Lock,
} from 'lucide-react';

/* ══════════════════════════════════════════════
   TYPES
══════════════════════════════════════════════ */
interface Profile {
  firstName?: string; lastName?: string; dateOfBirth?: string;
  passportCountry?: string; nationality?: string;
  visaType?: string; visaStartDate?: string; visaExpiryDate?: string;
  sevisId?: string; uicStudentId?: string;
  department?: string; degree?: string;
  programStartDate?: string; expectedGraduation?: string;
  hasSsn?: boolean; hasItin?: boolean;
  completionPercentage?: number;
}
interface Travel {
  id: string; departureDate: string; returnDate?: string;
  destination: string; reason?: string; daysOutside: number; isCurrentTrip: boolean;
}

/* ══════════════════════════════════════════════
   PALETTE HELPERS
══════════════════════════════════════════════ */
const card: React.CSSProperties = {
  background: 'rgba(83,128,131,0.05)',
  border: `1px solid ${C.border}`,
  borderRadius: 18,
  padding: '28px 28px',
};

const inputStyle: React.CSSProperties = {
  width: '100%', boxSizing: 'border-box',
  background: 'rgba(83,128,131,0.08)',
  border: `1px solid ${C.border}`,
  borderRadius: 10, padding: '11px 14px',
  color: C.text, fontSize: 14, outline: 'none',
  transition: 'border-color .2s', fontFamily: 'inherit',
};

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 12, fontWeight: 600,
  color: C.muted, letterSpacing: '0.05em',
  textTransform: 'uppercase', marginBottom: 7,
};

const selectStyle: React.CSSProperties = {
  ...inputStyle, appearance: 'none', cursor: 'pointer',
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2389909F' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center',
  paddingRight: 36,
};

/* ── Field wrapper ── */
function Field({ label, children, span2 = false }: { label: string; children: React.ReactNode; span2?: boolean }) {
  return (
    <div style={{ gridColumn: span2 ? '1/-1' : undefined }}>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}

/* ── Completion ring ── */
function CompletionRing({ pct }: { pct: number }) {
  const r = 28, circ = 2 * Math.PI * r;
  const dash = circ * (pct / 100);
  return (
    <div style={{ position: 'relative', width: 72, height: 72, flexShrink: 0 }}>
      <svg width={72} height={72} viewBox="0 0 72 72" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={36} cy={36} r={r} fill="none" stroke="rgba(83,128,131,0.15)" strokeWidth={6}/>
        <circle cx={36} cy={36} r={r} fill="none"
          stroke={pct >= 80 ? C.teal : C.pine} strokeWidth={6}
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          style={{ transition: 'stroke-dasharray .5s ease' }}
        />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 900, color: pct >= 80 ? C.teal : C.pine }}>
        {pct}%
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   TRAVEL ENTRY ROW
══════════════════════════════════════════════ */
function TravelRow({ t, onDelete }: { t: Travel; onDelete: (id: string) => void }) {
  const dep = new Date(t.departureDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const ret = t.returnDate ? new Date(t.returnDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : null;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', background: 'rgba(83,128,131,0.04)', border: `1px solid ${C.border}`, borderRadius: 12 }}>
      <div style={{ width: 38, height: 38, borderRadius: 10, background: `${C.pine}1a`, border: `1px solid ${C.pine}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Plane size={16} color={C.pine}/>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontWeight: 700, fontSize: 14, color: C.text }}>{t.destination}</p>
        <p style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>
          {dep} {ret ? `→ ${ret}` : '→ Still abroad'}
          {t.daysOutside > 0 && <span style={{ marginLeft: 8, color: C.dim }}>({t.daysOutside} days)</span>}
        </p>
        {t.reason && <p style={{ fontSize: 12, color: C.dim, marginTop: 1 }}>{t.reason}</p>}
      </div>
      {t.isCurrentTrip && (
        <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 999, background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.3)', color: '#f59e0b' }}>Ongoing</span>
      )}
      <button
        onClick={() => onDelete(t.id)}
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.dim, display: 'flex', padding: 4, borderRadius: 6, transition: 'color .15s' }}
        onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.color = '#fca5a5')}
        onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.color = C.dim)}
      >
        <Trash2 size={15}/>
      </button>
    </div>
  );
}

/* ══════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════ */
export default function ProfilePage() {
  const router = useRouter();
  const [tab,      setTab]      = useState<'details' | 'travel'>('details');
  const [profile,  setProfile]  = useState<Profile>({});
  const [travels,  setTravels]  = useState<Travel[]>([]);
  const [saving,   setSaving]   = useState(false);
  const [saved,    setSaved]    = useState(false);
  const [error,    setError]    = useState('');
  const [addingT,  setAddingT]  = useState(false);
  const [newTrip,  setNewTrip]  = useState({ departureDate: '', returnDate: '', destination: '', reason: '' });
  const [tErr,     setTErr]     = useState('');
  const [tSaving,  setTSaving]  = useState(false);

  // Auth guard + load data
  useEffect(() => {
    if (!localStorage.getItem('access_token')) { router.push('/login'); return; }
    apiFetch('/profile').then(setProfile).catch(() => {});
    apiFetch('/profile/travel').then(setTravels).catch(() => {});
  }, [router]);

  /* ── Save profile ── */
  const saveProfile = async () => {
    setSaving(true); setError(''); setSaved(false);
    try {
      const updated = await apiFetch('/profile', {
        method: 'PUT',
        body: JSON.stringify(profile),
      });
      setProfile(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  /* ── Add travel ── */
  const addTrip = async () => {
    if (!newTrip.departureDate || !newTrip.destination) {
      setTErr('Departure date and destination are required.'); return;
    }
    setTSaving(true); setTErr('');
    try {
      const trip = await apiFetch('/profile/travel', {
        method: 'POST',
        body: JSON.stringify(newTrip),
      });
      setTravels(t => [trip, ...t]);
      setNewTrip({ departureDate: '', returnDate: '', destination: '', reason: '' });
      setAddingT(false);
    } catch (err: any) {
      setTErr(err.message);
    } finally {
      setTSaving(false);
    }
  };

  /* ── Delete travel ── */
  const deleteTrip = async (id: string) => {
    try {
      await apiFetch(`/profile/travel/${id}`, { method: 'DELETE' });
      setTravels(t => t.filter(x => x.id !== id));
    } catch {}
  };

  const pct = profile.completionPercentage ?? 0;

  const focusBorder  = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => (e.target.style.borderColor = C.pine);
  const blurBorder   = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => (e.target.style.borderColor = C.border);

  return (
    <div style={{ minHeight: '100vh', background: C.bg, color: C.text, fontFamily: "'Inter',system-ui,sans-serif" }}>

      {/* Top nav */}
      <div style={{ position: 'sticky', top: 0, zIndex: 50, height: 56, background: 'rgba(10,15,20,0.95)', borderBottom: `1px solid ${C.border}`, backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', padding: '0 24px', gap: 16 }}>
        <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none', color: C.muted, fontSize: 14 }}>
          <ArrowLeft size={16}/> Dashboard
        </Link>
        <span style={{ color: C.border }}>·</span>
        <span style={{ fontSize: 14, color: C.text, fontWeight: 600 }}>My Profile</span>
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 24px' }}>

        {/* Profile header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 36, padding: '24px 28px', background: 'rgba(83,128,131,0.06)', border: `1px solid ${C.border}`, borderRadius: 18 }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: grad, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 22, color: '#fff', flexShrink: 0 }}>
            {(profile.firstName?.[0] || 'U').toUpperCase()}
          </div>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: 20, fontWeight: 900, letterSpacing: '-0.02em', marginBottom: 2 }}>
              {profile.firstName && profile.lastName ? `${profile.firstName} ${profile.lastName}` : 'Your Profile'}
            </h1>
            <p style={{ fontSize: 13, color: C.muted }}>
              {profile.visaType || 'F-1'} · {profile.department || 'UIC Student'} · Tax Year 2025
            </p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <CompletionRing pct={pct}/>
            <p style={{ fontSize: 11, color: C.muted, marginTop: 6 }}>Complete</p>
          </div>
        </div>

        {pct < 60 && (
          <div style={{ display: 'flex', gap: 10, padding: '12px 18px', borderRadius: 12, background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.22)', marginBottom: 24 }}>
            <AlertTriangle size={15} color="#f59e0b" style={{ flexShrink: 0, marginTop: 2 }}/>
            <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.65 }}>
              <strong style={{ color: '#f59e0b' }}>Profile {pct}% complete.</strong> Fill in all fields to unlock accurate residency check results.
            </p>
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 28, background: 'rgba(83,128,131,0.06)', border: `1px solid ${C.border}`, borderRadius: 12, padding: 4 }}>
          {([
            { id: 'details', icon: User,  label: 'Personal & Visa Details' },
            { id: 'travel',  icon: Plane, label: 'Travel History' },
          ] as const).map(({ id, icon: Icon, label }) => (
            <button key={id} onClick={() => setTab(id)} style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              padding: '10px 16px', borderRadius: 9, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600, transition: 'all .15s', fontFamily: 'inherit',
              background: tab === id ? C.pine : 'transparent',
              color: tab === id ? '#fff' : C.muted,
            }}>
              <Icon size={15}/> {label}
            </button>
          ))}
        </div>

        {/* ═══ TAB: DETAILS ═══ */}
        {tab === 'details' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Personal info */}
            <div style={card}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22 }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: `${C.pine}1a`, border: `1px solid ${C.pine}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User size={16} color={C.pine}/>
                </div>
                <h2 style={{ fontWeight: 800, fontSize: 15, color: C.text }}>Personal Information</h2>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <Field label="First Name">
                  <input style={inputStyle} value={profile.firstName || ''} placeholder="John"
                    onChange={e => setProfile(p => ({ ...p, firstName: e.target.value }))}
                    onFocus={focusBorder} onBlur={blurBorder}/>
                </Field>
                <Field label="Last Name">
                  <input style={inputStyle} value={profile.lastName || ''} placeholder="Doe"
                    onChange={e => setProfile(p => ({ ...p, lastName: e.target.value }))}
                    onFocus={focusBorder} onBlur={blurBorder}/>
                </Field>
                <Field label="Date of Birth">
                  <input type="date" style={inputStyle} value={profile.dateOfBirth?.slice(0, 10) || ''}
                    onChange={e => setProfile(p => ({ ...p, dateOfBirth: e.target.value }))}
                    onFocus={focusBorder} onBlur={blurBorder}/>
                </Field>
                <Field label="Passport Country (2-letter code)">
                  <input style={inputStyle} value={profile.passportCountry || ''} placeholder="IN"
                    maxLength={2} onChange={e => setProfile(p => ({ ...p, passportCountry: e.target.value.toUpperCase() }))}
                    onFocus={focusBorder} onBlur={blurBorder}/>
                </Field>
              </div>
            </div>

            {/* Visa info */}
            <div style={card}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22 }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: `${C.teal}1a`, border: `1px solid ${C.teal}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Globe size={16} color={C.teal}/>
                </div>
                <h2 style={{ fontWeight: 800, fontSize: 15, color: C.text }}>Visa & Immigration</h2>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <Field label="Visa Type">
                  <select style={selectStyle} value={profile.visaType || 'F_1'}
                    onChange={e => setProfile(p => ({ ...p, visaType: e.target.value }))}
                    onFocus={focusBorder} onBlur={blurBorder}>
                    <option value="F_1">F-1 Student</option>
                    <option value="J_1">J-1 Exchange Visitor</option>
                    <option value="M_1">M-1 Vocational</option>
                    <option value="H_1B">H-1B</option>
                    <option value="OPT">OPT</option>
                  </select>
                </Field>
                <Field label="SEVIS ID">
                  <input style={inputStyle} value={profile.sevisId || ''} placeholder="N0012345678"
                    onChange={e => setProfile(p => ({ ...p, sevisId: e.target.value }))}
                    onFocus={focusBorder} onBlur={blurBorder}/>
                </Field>
                <Field label="Visa Start Date">
                  <input type="date" style={inputStyle} value={profile.visaStartDate?.slice(0, 10) || ''}
                    onChange={e => setProfile(p => ({ ...p, visaStartDate: e.target.value }))}
                    onFocus={focusBorder} onBlur={blurBorder}/>
                </Field>
                <Field label="Visa Expiry Date">
                  <input type="date" style={inputStyle} value={profile.visaExpiryDate?.slice(0, 10) || ''}
                    onChange={e => setProfile(p => ({ ...p, visaExpiryDate: e.target.value }))}
                    onFocus={focusBorder} onBlur={blurBorder}/>
                </Field>
              </div>
            </div>

            {/* UIC / Academic info */}
            <div style={card}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22 }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: `${C.lilac}1a`, border: `1px solid ${C.lilac}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <GraduationCap size={16} color={C.lilac}/>
                </div>
                <h2 style={{ fontWeight: 800, fontSize: 15, color: C.text }}>Academic Details</h2>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <Field label="UIC Student ID">
                  <input style={inputStyle} value={profile.uicStudentId || ''} placeholder="A12345678"
                    onChange={e => setProfile(p => ({ ...p, uicStudentId: e.target.value }))}
                    onFocus={focusBorder} onBlur={blurBorder}/>
                </Field>
                <Field label="Department">
                  <input style={inputStyle} value={profile.department || ''} placeholder="Computer Science"
                    onChange={e => setProfile(p => ({ ...p, department: e.target.value }))}
                    onFocus={focusBorder} onBlur={blurBorder}/>
                </Field>
                <Field label="Degree">
                  <select style={selectStyle} value={profile.degree || ''}
                    onChange={e => setProfile(p => ({ ...p, degree: e.target.value }))}
                    onFocus={focusBorder} onBlur={blurBorder}>
                    <option value="">Select degree</option>
                    <option value="BACHELORS">Bachelor's</option>
                    <option value="MASTERS">Master's</option>
                    <option value="PHD">PhD</option>
                    <option value="OTHER">Other</option>
                  </select>
                </Field>
                <Field label="Program Start Date">
                  <input type="date" style={inputStyle} value={profile.programStartDate?.slice(0, 10) || ''}
                    onChange={e => setProfile(p => ({ ...p, programStartDate: e.target.value }))}
                    onFocus={focusBorder} onBlur={blurBorder}/>
                </Field>
                <Field label="Expected Graduation">
                  <input type="date" style={inputStyle} value={profile.expectedGraduation?.slice(0, 10) || ''}
                    onChange={e => setProfile(p => ({ ...p, expectedGraduation: e.target.value }))}
                    onFocus={focusBorder} onBlur={blurBorder}/>
                </Field>
              </div>
            </div>

            {/* Tax IDs — encrypted */}
            <div style={{ ...card, border: `1px solid rgba(42,127,98,0.25)`, background: 'rgba(42,127,98,0.04)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <Lock size={15} color={C.teal}/>
                <h2 style={{ fontWeight: 800, fontSize: 15, color: C.text }}>Tax Identifiers</h2>
                <span style={{ marginLeft: 'auto', fontSize: 11, color: C.teal, fontWeight: 700, padding: '2px 8px', borderRadius: 999, background: 'rgba(42,127,98,0.12)', border: '1px solid rgba(42,127,98,0.3)' }}>AES-256 Encrypted</span>
              </div>
              <p style={{ fontSize: 13, color: C.muted, marginBottom: 18, lineHeight: 1.65 }}>
                SSN and ITIN are encrypted before storage and never returned in plain text. Enter only if you have one.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <Field label={`SSN${profile.hasSsn ? ' (already saved)' : ''}`}>
                  <input type="password" style={inputStyle}
                    placeholder={profile.hasSsn ? '••••••••• (saved)' : '9-digit SSN'}
                    onChange={e => setProfile(p => ({ ...p, ssn: e.target.value }))}
                    onFocus={focusBorder} onBlur={blurBorder}/>
                </Field>
                <Field label={`ITIN${profile.hasItin ? ' (already saved)' : ''}`}>
                  <input type="password" style={inputStyle}
                    placeholder={profile.hasItin ? '••••••••• (saved)' : '9-digit ITIN'}
                    onChange={e => setProfile(p => ({ ...p, itin: e.target.value }))}
                    onFocus={focusBorder} onBlur={blurBorder}/>
                </Field>
              </div>
            </div>

            {/* Error + Save */}
            {error && (
              <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: '12px 16px', color: '#fca5a5', fontSize: 14 }}>
                {error}
              </div>
            )}

            <button
              onClick={saveProfile}
              disabled={saving}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                padding: '14px 24px', borderRadius: 12, border: 'none', cursor: saving ? 'not-allowed' : 'pointer',
                background: saved ? `linear-gradient(135deg,${C.teal},#1a6b48)` : saving ? 'rgba(83,128,131,0.4)' : grad,
                color: '#fff', fontWeight: 700, fontSize: 15, transition: 'all .2s',
              }}
              onMouseEnter={e => { if (!saving) (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 10px 32px rgba(83,128,131,.4)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.boxShadow = ''; }}
            >
              {saved ? <><CheckCircle size={16}/> Saved!</> : saving ? 'Saving...' : <><Save size={16}/> Save Profile</>}
            </button>
          </div>
        )}

        {/* ═══ TAB: TRAVEL ═══ */}
        {tab === 'travel' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Info banner */}
            <div style={{ display: 'flex', gap: 10, padding: '14px 18px', borderRadius: 12, background: 'rgba(83,128,131,0.07)', border: `1px solid ${C.border}` }}>
              <Plane size={15} color={C.pine} style={{ flexShrink: 0, marginTop: 2 }}/>
              <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.7 }}>
                <strong style={{ color: C.text }}>Why this matters:</strong> The IRS counts days spent outside the U.S. to determine your tax residency. Record every trip you took during 2023, 2024 and 2025 — even short ones.
              </p>
            </div>

            {/* Add trip button / form */}
            {!addingT ? (
              <button
                onClick={() => setAddingT(true)}
                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '13px 20px', borderRadius: 12, border: `1px dashed ${C.pine}`, background: `${C.pine}0d`, color: C.pine, fontWeight: 700, fontSize: 14, cursor: 'pointer' }}
              >
                <Plus size={16}/> Add a trip outside the U.S.
              </button>
            ) : (
              <div style={{ ...card, border: `1px solid rgba(83,128,131,0.35)` }}>
                <h3 style={{ fontWeight: 800, fontSize: 15, marginBottom: 18 }}>New trip</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                  <Field label="Destination">
                    <input style={inputStyle} value={newTrip.destination} placeholder="India"
                      onChange={e => setNewTrip(t => ({ ...t, destination: e.target.value }))}
                      onFocus={focusBorder} onBlur={blurBorder}/>
                  </Field>
                  <Field label="Reason (optional)">
                    <input style={inputStyle} value={newTrip.reason} placeholder="Summer vacation"
                      onChange={e => setNewTrip(t => ({ ...t, reason: e.target.value }))}
                      onFocus={focusBorder} onBlur={blurBorder}/>
                  </Field>
                  <Field label="Departure Date">
                    <input type="date" style={inputStyle} value={newTrip.departureDate}
                      onChange={e => setNewTrip(t => ({ ...t, departureDate: e.target.value }))}
                      onFocus={focusBorder} onBlur={blurBorder}/>
                  </Field>
                  <Field label="Return Date (leave blank if still abroad)">
                    <input type="date" style={inputStyle} value={newTrip.returnDate}
                      onChange={e => setNewTrip(t => ({ ...t, returnDate: e.target.value }))}
                      onFocus={focusBorder} onBlur={blurBorder}/>
                  </Field>
                </div>
                {tErr && <p style={{ fontSize: 13, color: '#fca5a5', marginBottom: 12 }}>{tErr}</p>}
                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={() => { setAddingT(false); setTErr(''); }} style={{ flex: 1, padding: '11px', borderRadius: 10, border: `1px solid ${C.border}`, background: 'transparent', color: C.muted, cursor: 'pointer', fontWeight: 600, fontSize: 14 }}>
                    Cancel
                  </button>
                  <button onClick={addTrip} disabled={tSaving} style={{ flex: 2, padding: '11px', borderRadius: 10, border: 'none', background: tSaving ? 'rgba(83,128,131,0.4)' : grad, color: '#fff', cursor: tSaving ? 'not-allowed' : 'pointer', fontWeight: 700, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                    {tSaving ? 'Saving...' : <><CheckCircle size={14}/> Save trip</>}
                  </button>
                </div>
              </div>
            )}

            {/* Trips list */}
            {travels.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px 24px', background: 'rgba(83,128,131,0.03)', border: `1px dashed ${C.border}`, borderRadius: 16 }}>
                <Plane size={32} color={C.dim} style={{ margin: '0 auto 12px' }}/>
                <p style={{ color: C.muted, fontSize: 14 }}>No trips recorded yet.</p>
                <p style={{ color: C.dim, fontSize: 13, marginTop: 4 }}>Add trips you took outside the U.S. during 2023, 2024, and 2025.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {travels.map(t => <TravelRow key={t.id} t={t} onDelete={deleteTrip}/>)}
              </div>
            )}

            {/* Summary */}
            {travels.length > 0 && (
              <div style={{ padding: '14px 18px', borderRadius: 12, background: 'rgba(42,127,98,0.06)', border: '1px solid rgba(42,127,98,0.2)', display: 'flex', alignItems: 'center', gap: 10 }}>
                <Shield size={15} color={C.teal}/>
                <p style={{ fontSize: 13, color: C.muted }}>
                  <strong style={{ color: C.text }}>{travels.length} trip{travels.length !== 1 ? 's' : ''}</strong> recorded.
                  {' '}Total days outside U.S.: <strong style={{ color: C.teal }}>{travels.reduce((a, t) => a + t.daysOutside, 0)}</strong>
                </p>
              </div>
            )}

            {/* CTA to residency */}
            <div style={{ ...card, display: 'flex', alignItems: 'center', gap: 16 }}>
              <div>
                <h3 style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Ready to check your residency?</h3>
                <p style={{ fontSize: 13, color: C.muted }}>Your travel history feeds directly into the residency calculation.</p>
              </div>
              <Link href="/residency" style={{ flexShrink: 0, textDecoration: 'none' }}>
                <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 18px', borderRadius: 10, background: grad, border: 'none', color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                  Run check <ChevronRight size={14}/>
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
