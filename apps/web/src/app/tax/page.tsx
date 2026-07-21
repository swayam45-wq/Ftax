'use client';
import { useState } from 'react';
import Link from 'next/link';
import { PageShell } from '@/components/page-shell';
import { C, grad, gradText } from '@/lib/api';
import { DollarSign, Info, ChevronDown, ChevronUp, CheckCircle, Shield, TrendingUp } from 'lucide-react';

// 2025 1040-NR brackets for nonresident single filers
const BRACKETS = [
  { max: 11925,  rate: 0.10 },
  { max: 48475,  rate: 0.12 },
  { max: 103350, rate: 0.22 },
  { max: 197300, rate: 0.24 },
  { max: 250525, rate: 0.32 },
  { max: 626350, rate: 0.35 },
  { max: Infinity, rate: 0.37 },
];

function calcFederal(taxable: number) {
  let tax = 0, prev = 0;
  const breakdown: { band: string; tax: number }[] = [];
  for (const { max, rate } of BRACKETS) {
    if (taxable <= 0) break;
    const chunk = Math.min(taxable, max - prev);
    if (chunk > 0) {
      tax += chunk * rate;
      breakdown.push({ band: `${(rate * 100).toFixed(0)}%`, tax: chunk * rate });
    }
    taxable -= chunk;
    prev = max;
  }
  return { total: tax, breakdown };
}

const fmt = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

function Row({ label, value, color, bold }: { label: string; value: string; color?: string; bold?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: `1px solid rgba(83,145,150,0.12)` }}>
      <span style={{ fontSize: 14, color: C.muted }}>{label}</span>
      <span style={{ fontSize: 14, fontWeight: bold ? 800 : 600, color: color || C.text, fontFamily: 'JetBrains Mono, monospace' }}>{value}</span>
    </div>
  );
}

export default function TaxPage() {
  const [wages,     setWages]     = useState('');
  const [scholar,   setScholar]   = useState('');
  const [other,     setOther]     = useState('');
  const [treaty,    setTreaty]    = useState('0');
  const [fica,      setFica]      = useState('0');
  const [calcDone,  setCalcDone]  = useState(false);
  const [showBreak, setShowBreak] = useState(false);

  const w = parseFloat(wages) || 0;
  const s = parseFloat(scholar) || 0;
  const o = parseFloat(other) || 0;
  const t = parseFloat(treaty) || 0;
  const f = parseFloat(fica) || 0;

  const grossIncome   = w + s + o;
  const taxableIncome = Math.max(0, grossIncome - t); // treaty reduces taxable income
  const { total: fedTax, breakdown } = calcFederal(taxableIncome);
  const ilTax         = taxableIncome * 0.0495;
  const ficaRefund    = f; // withheld FICA — user may reclaim
  const totalTax      = fedTax + ilTax;
  const effectiveRate = grossIncome > 0 ? ((fedTax / grossIncome) * 100).toFixed(1) : '0';

  const cardStyle: React.CSSProperties = {
    background: 'rgba(13,21,32,0.72)',
    border: `1px solid rgba(83,145,150,0.20)`,
    borderRadius: 20,
    padding: 28,
    marginBottom: 20,
    backdropFilter: 'blur(16px)',
    boxShadow: '0 16px 48px rgba(0,0,0,0.35)',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', boxSizing: 'border-box',
    background: 'rgba(83,145,150,0.07)', border: `1px solid rgba(83,145,150,0.18)`,
    borderRadius: 12, padding: '12px 14px 12px 42px',
    color: C.text, fontSize: 14, outline: 'none',
    fontFamily: 'JetBrains Mono, monospace',
    transition: 'border-color .2s, box-shadow .2s',
  };

  return (
    <PageShell title="Tax Calculator" back="/dashboard" backLabel="Dashboard">
      {/* Ambient Glow */}
      <div style={{ position: 'fixed', top: 0, left: '50%', transform: 'translateX(-50%)', width: 800, height: 400, background: 'radial-gradient(ellipse, rgba(83,128,131,0.10) 0%, transparent 65%)', pointerEvents: 'none', zIndex: 0 }}/>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ marginBottom: 32 }}>
          <span className="step-badge" style={{ color: C.pine, borderColor: 'rgba(83,128,131,0.30)', background: 'rgba(83,128,131,0.12)' }}>STEP 4 OF 4</span>
          <h1 style={{ fontSize: 'clamp(26px,4vw,36px)', fontWeight: 900, letterSpacing: '-0.03em', margin: '14px 0 8px', background: gradText, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            Tax Estimate Calculator
          </h1>
          <p style={{ color: C.muted, fontSize: 15, lineHeight: 1.6 }}>
            Federal (1040-NR) + Illinois (IL-1040) estimate for nonresident F-1 students. Zero black boxes.
          </p>
        </div>

        {/* Income inputs */}
        <div style={cardStyle}>
          <h2 style={{ fontSize: 16, fontWeight: 800, marginBottom: 20, color: C.text, display: 'flex', alignItems: 'center', gap: 8 }}>
            <TrendingUp size={18} color={C.pine}/> Income Sources
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {[
              { label: 'W-2 Wages / OPT Salary', value: wages, set: setWages, tip: 'Box 1 of your W-2' },
              { label: 'Taxable Scholarship / Fellowship', value: scholar, set: setScholar, tip: 'Box 5 minus Box 1 of 1098-T' },
              { label: 'Other Income (1099-NEC, interest…)', value: other, set: setOther, tip: 'Any other U.S.-source income' },
            ].map(({ label, value, set, tip }) => (
              <div key={label}>
                <label style={{ fontSize: 12, fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span>{label}</span>
                  <span style={{ color: C.dim, textTransform: 'none', letterSpacing: 'normal' }}>{tip}</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <DollarSign size={15} color={C.muted} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }}/>
                  <input type="number" min="0" style={inputStyle} value={value} placeholder="0"
                    onChange={e => { set(e.target.value); setCalcDone(false); }}/>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Deductions */}
        <div style={cardStyle}>
          <h2 style={{ fontSize: 16, fontWeight: 800, marginBottom: 20, color: C.text, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Shield size={18} color={C.teal}/> Deductions &amp; Treaty Exemptions
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 8 }}>
                Tax Treaty Exemption <span style={{ color: C.dim, textTransform: 'none', letterSpacing: 'normal', marginLeft: 6 }}>— e.g. $15,000 (India Art. 21) or $5,000 (China Art. 20)</span>
              </label>
              <div style={{ position: 'relative' }}>
                <DollarSign size={15} color={C.muted} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }}/>
                <input type="number" min="0" style={inputStyle} value={treaty} placeholder="0"
                  onChange={e => { setTreaty(e.target.value); setCalcDone(false); }}/>
              </div>
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 8 }}>
                FICA Withheld In Error <span style={{ color: C.dim, textTransform: 'none', letterSpacing: 'normal', marginLeft: 6 }}>— Social Security + Medicare withheld by mistake</span>
              </label>
              <div style={{ position: 'relative' }}>
                <DollarSign size={15} color={C.muted} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }}/>
                <input type="number" min="0" style={inputStyle} value={fica} placeholder="0"
                  onChange={e => { setFica(e.target.value); setCalcDone(false); }}/>
              </div>
            </div>
          </div>
        </div>

        {/* Calculate button */}
        <button onClick={() => setCalcDone(true)} className="btn-primary" style={{ width: '100%', padding: '16px', borderRadius: 14, background: grad, color: '#fff', fontWeight: 700, fontSize: 16, cursor: 'pointer', marginBottom: 28, justifyContent: 'center', boxShadow: '0 8px 28px rgba(83,128,131,0.35)' }}>
          Calculate My Taxes
        </button>

        {/* Results */}
        {calcDone && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Summary cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
              {[
                { label: 'Federal Tax', value: fmt(fedTax),  color: C.pine  },
                { label: 'Illinois Tax', value: fmt(ilTax),  color: C.teal  },
                { label: 'Effective Rate', value: `${effectiveRate}%`, color: C.gold },
              ].map(({ label, value, color }) => (
                <div key={label} style={{ textAlign: 'center', padding: '22px 16px', background: 'rgba(13,21,32,0.75)', border: `1px solid rgba(83,145,150,0.22)`, borderRadius: 18, backdropFilter: 'blur(16px)' }}>
                  <p style={{ fontSize: 26, fontWeight: 900, color, fontFamily: 'JetBrains Mono, monospace', letterSpacing: '-0.03em' }}>{value}</p>
                  <p style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 6 }}>{label}</p>
                </div>
              ))}
            </div>

            {/* Breakdown */}
            <div style={{ ...cardStyle, marginBottom: 0 }}>
              <h3 style={{ fontSize: 15, fontWeight: 800, marginBottom: 14, color: C.text }}>Tax Summary</h3>
              <Row label="Gross Income"            value={fmt(grossIncome)}    />
              <Row label="Treaty Exemption"        value={`− ${fmt(t)}`}  color={C.teal} />
              <Row label="Federal Taxable Income"  value={fmt(taxableIncome)} bold />
              <Row label="Federal Tax (1040-NR)"   value={fmt(fedTax)}    color={C.pine} />
              <Row label="Illinois Tax (4.95%)"    value={fmt(ilTax)}     color={C.teal} />
              <Row label="Total Tax Owed"          value={fmt(totalTax)}  bold color={C.text}/>
              {f > 0 && <Row label="FICA Refund Eligible"  value={fmt(f)} color={C.gold}/>}
            </div>

            {/* Federal bracket breakdown toggle */}
            <div style={{ border: `1px solid rgba(83,145,150,0.20)`, borderRadius: 18, overflow: 'hidden', background: 'rgba(13,21,32,0.60)', backdropFilter: 'blur(12px)' }}>
              <button onClick={() => setShowBreak(b => !b)} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 22px', background: 'transparent', border: 'none', color: C.text, cursor: 'pointer', fontSize: 14, fontWeight: 700 }}>
                <span>Federal Tax Brackets Breakdown</span>
                {showBreak ? <ChevronUp size={16} color={C.pine}/> : <ChevronDown size={16} color={C.pine}/>}
              </button>
              {showBreak && (
                <div style={{ padding: '0 22px 20px' }}>
                  {breakdown.map((b, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < breakdown.length - 1 ? `1px solid rgba(83,145,150,0.12)` : 'none' }}>
                      <span style={{ fontSize: 13, color: C.muted }}>Taxed at {b.band}</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: C.pine, fontFamily: 'JetBrains Mono, monospace' }}>{fmt(b.tax)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Disclaimer */}
            <div style={{ display: 'flex', gap: 12, padding: '14px 18px', borderRadius: 14, background: 'rgba(83,145,150,0.06)', border: `1px solid rgba(83,145,150,0.18)` }}>
              <Info size={16} color={C.pine} style={{ flexShrink: 0, marginTop: 2 }}/>
              <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.6 }}>
                This is an estimate only. Actual liability may differ based on withholding, credits, or treaty filings. Verify with a licensed tax professional for your official return.
              </p>
            </div>

            {/* Next steps */}
            <Link href="/form-8843" className="btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '15px', borderRadius: 14, background: grad, color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: 15, boxShadow: '0 8px 24px rgba(83,128,131,0.30)' }}>
              <CheckCircle size={16}/> File Form 8843 Next
            </Link>
          </div>
        )}
      </div>
    </PageShell>
  );
}
