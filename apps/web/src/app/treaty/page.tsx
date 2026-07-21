'use client';
import { useState, useEffect } from 'react';
import { PageShell } from '@/components/page-shell';
import { C, grad, gradText, apiFetch } from '@/lib/api';
import { Shield, AlertCircle, HelpCircle } from 'lucide-react';

/* ─── Treaty Data ───────────────────────────────────────────────────────────── */
const TREATIES: Record<
  string,
  { article: string; type: string; limit: string; duration: string; details: string }
> = {
  India: {
    article: 'Article 21(2)',
    type: 'Standard Deduction & Wages',
    limit: 'Standard deduction equivalent ($15,000 for 2025)',
    duration: 'Duration of studies / training',
    details:
      'Unlike other nonresidents, Indian students can claim the standard deduction on Form 1040-NR. Scholarships, fellowships, and grants received from non-U.S. sources are also fully exempt from U.S. tax.',
  },
  China: {
    article: 'Article 20',
    type: 'Wages & Scholarships',
    limit: '$5,000/year for income; Unlimited for scholarships',
    duration: 'Up to 5 calendar years',
    details:
      'Chinese F-1 students can exempt up to $5,000 of personal service income (wages/salaries) per year. Scholarships or grants are fully exempt. This applies even if you become a resident under the Substantial Presence Test (due to the saving clause exception).',
  },
  'South Korea': {
    article: 'Article 21',
    type: 'Wages & Scholarships',
    limit: '$2,000/year for wages; Unlimited for scholarships',
    duration: 'Up to 5 calendar years',
    details:
      'Korean students can exclude up to $2,000 of wages per year from federal income tax, plus scholarships are fully tax-exempt.',
  },
  Germany: {
    article: 'Article 20',
    type: 'Wages & Maintenance',
    limit: '$9,000/year for wages; Unlimited for maintenance',
    duration: 'Up to 4 calendar years',
    details:
      'German students can exempt up to $9,000 of wage income earned in the U.S. per year if it is necessary for maintenance, education, or training.',
  },
};

/* ─── Info Cell ─────────────────────────────────────────────────────────────── */
function InfoCell({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: string;
}) {
  return (
    <div
      style={{
        background: 'rgba(83,145,150,0.04)',
        border: `1px solid rgba(83,145,150,0.12)`,
        borderRadius: 12,
        padding: '14px 16px',
      }}
    >
      <p
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: C.muted,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginBottom: 6,
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontSize: 15,
          fontWeight: 700,
          color: accent ?? C.text,
          lineHeight: 1.4,
        }}
      >
        {value}
      </p>
    </div>
  );
}

/* ─── Page ──────────────────────────────────────────────────────────────────── */
export default function TreatyPage() {
  const [country, setCountry] = useState('India');
  const [rules, setRules] = useState<any>(null);

  useEffect(() => {
    apiFetch('/tax/rules/current').then(setRules).catch(() => {});
  }, []);

  const treaty = TREATIES[country];

  return (
    <PageShell title="Tax Treaty Lookup" back="/dashboard" backLabel="Dashboard">
      {/* Ambient glow */}
      <div
        aria-hidden
        style={{
          position: 'fixed',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 700,
          height: 320,
          background:
            'radial-gradient(ellipse at 50% 0%, rgba(83,128,131,0.13) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Content wrapper */}
      <div style={{ position: 'relative', zIndex: 1, maxWidth: 680, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <span
            className="step-badge"
            style={{
              color: C.pine,
              borderColor: `${C.pine}40`,
              background: `${C.pine}18`,
            }}
          >
            STEP 3 OF 4
          </span>

          <h1
            style={{
              fontSize: 'clamp(26px, 4vw, 36px)',
              fontWeight: 900,
              letterSpacing: '-0.03em',
              margin: '14px 0 10px',
              background: gradText,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Tax Treaty Lookup
          </h1>

          <p style={{ color: C.muted, fontSize: 15, lineHeight: 1.7, maxWidth: 520 }}>
            Find out if your country has a bilateral tax treaty with the U.S. that can
            reduce your tax liability.
          </p>
        </div>

        {/* Country Selector */}
        <div
          className="glass-card"
          style={{ marginBottom: 24, padding: '20px 24px' }}
        >
          <label
            style={{
              display: 'block',
              fontSize: 12,
              fontWeight: 700,
              color: C.muted,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: 10,
            }}
          >
            Select Passport Country
          </label>
          <select
            className="inp"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            style={{ width: '100%', appearance: 'none', cursor: 'pointer' }}
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
          <div
            style={{
              background: 'rgba(13,21,32,0.70)',
              border: '1px solid rgba(83,145,150,0.22)',
              borderRadius: 20,
              padding: 28,
              backdropFilter: 'blur(16px)',
              display: 'flex',
              flexDirection: 'column',
              gap: 20,
            }}
          >
            {/* Card Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  background: grad,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: '0 2px 12px rgba(83,128,131,0.25)',
                }}
              >
                <Shield size={17} color="#fff" />
              </div>
              <div>
                <h2
                  style={{
                    fontSize: 16,
                    fontWeight: 800,
                    color: C.text,
                    lineHeight: 1.2,
                  }}
                >
                  {country} — U.S. Tax Treaty
                </h2>
                <p style={{ fontSize: 12, color: C.muted, marginTop: 3 }}>
                  {treaty.article}
                </p>
              </div>
            </div>

            {/* Info Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 12,
              }}
            >
              <InfoCell label="Exemption Type" value={treaty.type} />
              <InfoCell label="Exemption Limit" value={treaty.limit} />
              <InfoCell label="Duration" value={treaty.duration} />
              <InfoCell label="Status" value="Active Benefit" accent={C.teal} />
            </div>

            {/* Divider */}
            <div style={{ borderTop: `1px solid ${C.border}` }} />

            {/* Details */}
            <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.75, margin: 0 }}>
              {treaty.details}
            </p>
          </div>
        ) : (
          /* No Treaty Fallback */
          <div
            style={{
              background: 'rgba(13,21,32,0.70)',
              border: '1px solid rgba(83,145,150,0.22)',
              borderRadius: 20,
              padding: 40,
              backdropFilter: 'blur(16px)',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 14,
                background: 'rgba(138,151,168,0.08)',
                border: `1px solid ${C.border}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <AlertCircle size={24} color={C.muted} />
            </div>
            <h3
              style={{ fontSize: 16, fontWeight: 800, color: C.text, marginTop: 4 }}
            >
              No Standard Student Exemption Found
            </h3>
            <p
              style={{
                fontSize: 14,
                color: C.muted,
                lineHeight: 1.7,
                maxWidth: 440,
              }}
            >
              The U.S. does not have a standard student tax treaty benefit for this
              country, or the benefit is restricted. You will file under standard Form
              1040-NR rules with no treaty exemptions.
            </p>
          </div>
        )}

        {/* How to Claim */}
        <div
          style={{
            marginTop: 20,
            padding: '18px 20px',
            background: 'rgba(83,128,131,0.04)',
            border: `1px dashed rgba(83,145,150,0.28)`,
            borderRadius: 14,
            display: 'flex',
            gap: 14,
            alignItems: 'flex-start',
          }}
        >
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              background: 'rgba(83,128,131,0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              marginTop: 1,
            }}
          >
            <HelpCircle size={15} color={C.pine} />
          </div>
          <div>
            <h4
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: C.text,
                marginBottom: 6,
              }}
            >
              How to Claim
            </h4>
            <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.75 }}>
              Treaty benefits are claimed by attaching{' '}
              <strong style={{ color: C.text, fontWeight: 700 }}>Form 8833</strong>{' '}
              (Treaty-Based Return Position Disclosure) to your Form 1040-NR federal
              tax return, or by filing{' '}
              <strong style={{ color: C.text, fontWeight: 700 }}>Form 8233</strong>{' '}
              with your employer&apos;s payroll office.
            </p>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
