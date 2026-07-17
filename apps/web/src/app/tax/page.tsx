'use client';
import { useState } from 'react';
import Link from 'next/link';
import { PageShell } from '@/components/page-shell';
import { C, grad, gradText } from '@/lib/api';
import { DollarSign, Info, ChevronDown, ChevronUp, CheckCircle } from 'lucide-react';

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
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: `1px solid ${C.border}` }}>
      <span style={{ fontSize: 14, color: C.muted }}>{label}</span>
      <span style={{ fontSize: 14, fontWeight: bold ? 800 : 600, color: color || C.text }}>{value}</span>
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

  const inputStyle = {
    width: '100%', boxSizing: 'border-box' as const,
    background: 'rgba(83,128,131,0.08)', border: `1px solid ${C.border}`,
    borderRadius: 10, padding: '12px 14px 12px 40px',
    color: C.text, fontSize: 14, outline: 'none',
  };

  return (
    <PageShell title="Tax Calculator" back="/dashboard" backLabel="Dashboard">
      <div style={{ marginBottom: 28 }}>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', padding: '3px 10px', borderRadius: 999, background: `${C.lilac}1a`, border: `1px solid ${C.lilac}40`, color: C.lilac }}>STEP 4 OF 4</span>
        <h1 style={{ fontSize: 'clamp(22px,4vw,32px)', fontWeight: 900, letterSpacing: '-0.02em', margin: '12px 0 6px' }}>Tax Estimate Calculator</h1>
        <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.6 }}>Federal (1040-NR) + Illinois (IL-1040) estimate for nonresident F-1 students. No black boxes.</p>
      </div>

      {/* Income inputs */}
      <div style={{ background: 'rgba(83,128,131,0.04)', border: `1px solid ${C.border}`, borderRadius: 16, padding: 24, marginBottom: 16 }}>
        <h2 style={{ fontSize: 15, fontWeight: 800, marginBottom: 18 }}>Income</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[
            { label: 'W-2 Wages / OPT Salary', value: wages, set: setWages, tip: 'From Box 1 of your W-2' },
            { label: 'Taxable Scholarship / Fellowship', value: scholar, set: setScholar, tip: 'Box 5 of 1098-T minus Box 1' },
            { label: 'Other Income (1099-NEC, interest…)', value: other, set: setOther, tip: 'Any other U.S.-source income' },
          ].map(({ label, value, set, tip }) => (
            <div key={label}>
              <label style={{ fontSize: 12, color: C.muted, display: 'flex', gap: 6, alignItems: 'center', marginBottom: 6 }}>
                {label} <span style={{ color: C.dim, fontSize: 11 }}>— {tip}</span>
              </label>
              <div style={{ position: 'relative' }}>
                <DollarSign size={14} color={C.muted} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }}/>
                <input type="number" min="0" style={inputStyle} value={value} placeholder="0"
                  onChange={e => { set(e.target.value); setCalcDone(false); }}/>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Deductions */}
      <div style={{ background: 'rgba(83,128,131,0.04)', border: `1px solid ${C.border}`, borderRadius: 16, padding: 24, marginBottom: 16 }}>
        <h2 style={{ fontSize: 15, fontWeight: 800, marginBottom: 18 }}>Deductions &amp; Credits</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ fontSize: 12, color: C.muted, marginBottom: 6, display: 'block' }}>
              Tax Treaty Exemption <span style={{ color: C.dim, fontSize: 11 }}>— e.g. $15,000 for India Art. 21, $5,000 for China Art. 20</span>
            </label>
            <div style={{ position: 'relative' }}>
              <DollarSign size={14} color={C.muted} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }}/>
              <input type="number" min="0" style={inputStyle} value={treaty} placeholder="0"
                onChange={e => { setTreaty(e.target.value); setCalcDone(false); }}/>
            </div>
          </div>
          <div>
            <label style={{ fontSize: 12, color: C.muted, marginBottom: 6, display: 'block' }}>
              FICA Withheld (Social Security + Medicare) <span style={{ color: C.dim, fontSize: 11 }}>— if employer withheld incorrectly</span>
            </label>
            <div style={{ position: 'relative' }}>
              <DollarSign size={14} color={C.muted} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }}/>
              <input type="number" min="0" style={inputStyle} value={fica} placeholder="0"
                onChange={e => { setFica(e.target.value); setCalcDone(false); }}/>
            </div>
          </div>
        </div>
      </div>

      {/* Calculate button */}
      <button onClick={() => setCalcDone(true)} style={{ width: '100%', padding: '14px', borderRadius: 12, border: 'none', background: grad, color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer', marginBottom: 24 }}>
        Calculate My Taxes
      </button>

      {/* Results */}
      {calcDone && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Summary cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
            {[
              { label: 'Federal Tax', value: fmt(fedTax),  color: C.pine  },
              { label: 'Illinois Tax', value: fmt(ilTax),  color: C.teal  },
              { label: 'Effective Rate', value: `${effectiveRate}%`, color: C.lilac },
            ].map(({ label, value, color }) => (
              <div key={label} style={{ textAlign: 'center', padding: '18px 12px', background: 'rgba(83,128,131,0.05)', border: `1px solid ${C.border}`, borderRadius: 14 }}>
                <p style={{ fontSize: 20, fontWeight: 900, color }}>{value}</p>
                <p style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>{label}</p>
              </div>
            ))}
          </div>

          {/* Breakdown */}
          <div style={{ background: 'rgba(83,128,131,0.04)', border: `1px solid ${C.border}`, borderRadius: 14, padding: 20 }}>
            <Row label="Gross Income"            value={fmt(grossIncome)}    />
            <Row label="Treaty Exemption"        value={`− ${fmt(t)}`}  color={C.teal} />
            <Row label="Federal Taxable Income"  value={fmt(taxableIncome)} bold />
            <Row label="Federal Tax (1040-NR)"   value={fmt(fedTax)}    color={C.pine} />
            <Row label="Illinois Tax (4.95%)"    value={fmt(ilTax)}     color={C.teal} />
            <Row label="Total Tax Owed"          value={fmt(totalTax)}  bold />
            {f > 0 && <Row label="FICA Refund Eligible"  value={fmt(f)} color={C.teal}/>}
          </div>

          {/* Federal bracket breakdown toggle */}
          <div style={{ border: `1px solid ${C.border}`, borderRadius: 14, overflow: 'hidden' }}>
            <button onClick={() => setShowBreak(b => !b)} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', background: 'rgba(83,128,131,0.04)', border: 'none', color: C.text, cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>
              Federal bracket breakdown {showBreak ? <ChevronUp size={15}/> : <ChevronDown size={15}/>}
            </button>
            {showBreak && (
              <div style={{ padding: '0 20px 16px' }}>
                {breakdown.map((b, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: i < breakdown.length - 1 ? `1px solid ${C.border}` : 'none' }}>
                    <span style={{ fontSize: 13, color: C.muted }}>Taxed at {b.band}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: C.pine }}>{fmt(b.tax)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Disclaimer */}
          <div style={{ display: 'flex', gap: 10, padding: '12px 16px', borderRadius: 10, background: 'rgba(83,128,131,0.04)', border: `1px solid ${C.border}` }}>
            <Info size={14} color={C.muted} style={{ flexShrink: 0, marginTop: 2 }}/>
            <p style={{ fontSize: 12, color: C.dim, lineHeight: 1.6 }}>
              This is an estimate only. Actual liability may differ based on withholding, credits, or treaty filings. Always verify with a licensed CPA or CFP for your official return.
            </p>
          </div>

          {/* Next steps */}
          <Link href="/form-8843" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '13px', borderRadius: 12, background: grad, color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: 14 }}>
            <CheckCircle size={15}/> File Form 8843 next
          </Link>
        </div>
      )}
    </PageShell>
  );
}
