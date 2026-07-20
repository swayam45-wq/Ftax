'use client';
import { useState, useEffect } from 'react';
import { PageShell } from '@/components/page-shell';
import { C, apiFetch, grad } from '@/lib/api';
import { Shield, BookOpen, AlertCircle, HelpCircle } from 'lucide-react';

const TREATIES: Record<string, { article: string; type: string; limit: string; duration: string; details: string }> = {
  India: {
    article: 'Article 21(2)',
    type: 'Standard Deduction & Wages',
    limit: 'Standard deduction equivalent ($15,000 for 2025)',
    duration: 'Duration of studies / training',
    details: 'Unlike other nonresidents, Indian students can claim the standard deduction on Form 1040-NR. Scholarships, fellowships, and grants received from non-U.S. sources are also fully exempt from U.S. tax.'
  },
  China: {
    article: 'Article 20',
    type: 'Wages & Scholarships',
    limit: '$5,000/year for income; Unlimited for scholarships',
    duration: 'Up to 5 calendar years',
    details: 'Chinese F-1 students can exempt up to $5,000 of personal service income (wages/salaries) per year. Scholarships or grants are fully exempt. This applies even if you become a resident under the Substantial Presence Test (due to the saving clause exception).'
  },
  'South Korea': {
    article: 'Article 21',
    type: 'Wages & Scholarships',
    limit: '$2,000/year for wages; Unlimited for scholarships',
    duration: 'Up to 5 calendar years',
    details: 'Korean students can exclude up to $2,000 of wages per year from federal income tax, plus scholarships are fully tax-exempt.'
  },
  Germany: {
    article: 'Article 20',
    type: 'Wages & Maintenance',
    limit: '$9,000/year for wages; Unlimited for maintenance',
    duration: 'Up to 4 calendar years',
    details: 'German students can exempt up to $9,000 of wage income earned in the U.S. per year if it is necessary for maintenance, education, or training.'
  }
};

export default function TreatyPage() {
  const [country, setCountry] = useState('India');
  const [rules, setRules] = useState<any>(null);

  useEffect(() => {
    apiFetch('/tax/rules/current').then(setRules).catch(() => {});
  }, []);

  const treaty = TREATIES[country];

  return (
    <PageShell title="Tax Treaty Lookup" back="/dashboard" backLabel="Dashboard">
      <div style={{ marginBottom: 30 }}>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', padding: '3px 10px', borderRadius: 999, background: `${C.pine}1a`, border: `1px solid ${C.pine}40`, color: C.pine }}>STEP 3 OF 4</span>
        <h1 style={{ fontSize: 'clamp(24px, 4vw, 34px)', fontWeight: 900, letterSpacing: '-0.03em', margin: '12px 0 8px' }}>Tax Treaty Lookup</h1>
        <p style={{ color: C.muted, fontSize: 15, lineHeight: 1.7 }}>Find out if your country has a bilateral tax treaty with the U.S. that can reduce your tax liability.</p>
      </div>

      {/* Select Country */}
      <div style={{ background: 'rgba(83,128,131,0.05)', border: `1px solid ${C.border}`, borderRadius: 16, padding: 24, marginBottom: 24 }}>
        <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: C.muted, textTransform: 'uppercase', marginBottom: 8 }}>Select Passport Country</label>
        <select
          value={country}
          onChange={e => setCountry(e.target.value)}
          style={{ width: '100%', background: 'rgba(83,128,131,0.08)', border: `1px solid ${C.border}`, borderRadius: 10, padding: 12, color: C.text, fontSize: 14, outline: 'none' }}
        >
          <option value="India">India</option>
          <option value="China">China</option>
          <option value="South Korea">South Korea</option>
          <option value="Germany">Germany</option>
          <option value="Other">Other Country</option>
        </select>
      </div>

      {/* Treaty Card or Fallback */}
      {treaty ? (
        <div style={{ background: 'rgba(42,127,98,0.04)', border: '1px solid rgba(42,127,98,0.22)', borderRadius: 16, padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Shield size={18} color={C.teal} />
            <h2 style={{ fontSize: 16, fontWeight: 800, color: C.text }}>{country} — US Tax Treaty ({treaty.article})</h2>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, padding: '16px 0' }}>
            <div>
              <p style={{ fontSize: 11, color: C.muted, textTransform: 'uppercase', fontWeight: 600 }}>Exemption Type</p>
              <p style={{ fontSize: 14, fontWeight: 700, marginTop: 4 }}>{treaty.type}</p>
            </div>
            <div>
              <p style={{ fontSize: 11, color: C.muted, textTransform: 'uppercase', fontWeight: 600 }}>Exemption Limit</p>
              <p style={{ fontSize: 14, fontWeight: 700, marginTop: 4 }}>{treaty.limit}</p>
            </div>
            <div>
              <p style={{ fontSize: 11, color: C.muted, textTransform: 'uppercase', fontWeight: 600 }}>Duration Limit</p>
              <p style={{ fontSize: 14, fontWeight: 700, marginTop: 4 }}>{treaty.duration}</p>
            </div>
            <div>
              <p style={{ fontSize: 11, color: C.muted, textTransform: 'uppercase', fontWeight: 600 }}>Status</p>
              <p style={{ fontSize: 14, fontWeight: 700, marginTop: 4, color: C.teal }}>Active Benefit</p>
            </div>
          </div>

          <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.7 }}>{treaty.details}</p>
        </div>
      ) : (
        <div style={{ background: 'rgba(83,128,131,0.05)', border: `1px solid ${C.border}`, borderRadius: 16, padding: 24, textAlign: 'center' }}>
          <AlertCircle size={32} color={C.muted} style={{ margin: '0 auto 12px' }} />
          <h3 style={{ fontSize: 15, fontWeight: 700, color: C.text }}>No Standard Student Exemption Found</h3>
          <p style={{ fontSize: 13, color: C.muted, marginTop: 6, lineHeight: 1.6 }}>
            The U.S. does not have a standard student tax treaty benefit for this country, or the benefit is restricted. You will file under standard Form 1040-NR rules with no treaty exemptions.
          </p>
        </div>
      )}

      {/* Guide Info */}
      <div style={{ marginTop: 24, padding: 16, background: 'rgba(83,128,131,0.03)', border: `1px dashed ${C.border}`, borderRadius: 12, display: 'flex', gap: 12 }}>
        <HelpCircle size={16} color={C.muted} style={{ flexShrink: 0, marginTop: 2 }} />
        <div>
          <h4 style={{ fontSize: 13, fontWeight: 700, color: C.text }}>How to Claim</h4>
          <p style={{ fontSize: 12, color: C.muted, marginTop: 4, lineHeight: 1.6 }}>
            Treaty benefits are claimed by attaching <strong style={{ color: C.text }}>Form 8833</strong> (Treaty-Based Return Position Disclosure) to your Form 1040-NR federal tax return, or by filing <strong style={{ color: C.text }}>Form 8233</strong> with your employer&apos;s payroll office.
          </p>
        </div>
      </div>
    </PageShell>
  );
}
