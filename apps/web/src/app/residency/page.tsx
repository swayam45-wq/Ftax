'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiFetch, C, grad, gradText } from '@/lib/api';
import {
  ArrowLeft, ArrowRight, CheckCircle, XCircle, AlertTriangle,
  Info, FileText, Globe, Shield, Calculator, ChevronRight,
} from 'lucide-react';

/* ── Step progress bar ── */
function StepBar({ step, total }: { step:number; total:number }) {
  return (
    <div style={{ display:'flex', gap:6, marginBottom:32 }}>
      {Array.from({ length:total }).map((_,i) => (
        <div key={i} style={{
          flex:1, height:4, borderRadius:999,
          background: i < step ? C.pine : `rgba(83,128,131,0.2)`,
          transition:'background .3s',
        }}/>
      ))}
    </div>
  );
}

/* ── Result status badge ── */
function StatusBadge({ isResident }: { isResident:boolean }) {
  return (
    <div style={{
      display:'inline-flex', alignItems:'center', gap:10, padding:'14px 20px', borderRadius:14,
      background: isResident ? 'rgba(245,158,11,0.12)' : 'rgba(42,127,98,0.12)',
      border: `1px solid ${isResident ? 'rgba(245,158,11,0.3)' : 'rgba(42,127,98,0.3)'}`,
    }}>
      {isResident
        ? <AlertTriangle size={20} color="#f59e0b"/>
        : <CheckCircle    size={20} color={C.teal}/>
      }
      <div>
        <p style={{ fontWeight:800, fontSize:17, color: isResident ? '#f59e0b' : C.teal }}>
          {isResident ? 'Resident Alien' : 'Nonresident Alien'}
        </p>
        <p style={{ fontSize:12, color:C.muted, marginTop:2 }}>
          {isResident ? 'File Form 1040 · Standard tax rates apply' : 'File Form 8843 + 1040-NR · Treaty benefits may apply'}
        </p>
      </div>
    </div>
  );
}

/* ── Select option ── */
function Option({ value, label, sub, selected, onSelect }: { value:string; label:string; sub?:string; selected:boolean; onSelect:(v:string)=>void }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(value)}
      style={{
        width:'100%', textAlign:'left', padding:'14px 18px', borderRadius:12, cursor:'pointer',
        background: selected ? 'rgba(83,128,131,0.12)' : 'rgba(83,128,131,0.04)',
        border: `1px solid ${selected ? C.pine : C.border}`,
        transition:'all .15s', display:'flex', alignItems:'center', gap:14,
      }}
    >
      <div style={{
        width:20, height:20, borderRadius:'50%', border:`2px solid ${selected ? C.pine : C.border}`,
        background: selected ? C.pine : 'transparent', flexShrink:0,
        display:'flex', alignItems:'center', justifyContent:'center',
      }}>
        {selected && <div style={{ width:8, height:8, borderRadius:'50%', background:'#fff' }}/>}
      </div>
      <div>
        <span style={{ fontWeight:600, fontSize:14, color:C.text }}>{label}</span>
        {sub && <p style={{ fontSize:12, color:C.muted, marginTop:2 }}>{sub}</p>}
      </div>
    </button>
  );
}

/* ── Number stepper ── */
function Stepper({ value, onChange, min, max, label, sub }: { value:number; onChange:(n:number)=>void; min:number; max:number; label:string; sub:string }) {
  return (
    <div style={{ background:`rgba(83,128,131,0.05)`, border:`1px solid ${C.border}`, borderRadius:14, padding:'20px 24px' }}>
      <p style={{ fontWeight:700, fontSize:15, color:C.text, marginBottom:4 }}>{label}</p>
      <p style={{ fontSize:13, color:C.muted, marginBottom:18, lineHeight:1.6 }}>{sub}</p>
      <div style={{ display:'flex', alignItems:'center', gap:16 }}>
        <button type="button"
          onClick={() => onChange(Math.max(min, value-1))}
          style={{ width:40, height:40, borderRadius:10, background:`rgba(83,128,131,0.1)`, border:`1px solid ${C.border}`, color:C.text, fontSize:20, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
          -
        </button>
        <span style={{ fontSize:32, fontWeight:900, letterSpacing:'-0.04em', minWidth:48, textAlign:'center', background:gradText, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
          {value}
        </span>
        <button type="button"
          onClick={() => onChange(Math.min(max, value+1))}
          style={{ width:40, height:40, borderRadius:10, background:`rgba(83,128,131,0.1)`, border:`1px solid ${C.border}`, color:C.text, fontSize:20, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
          +
        </button>
        <span style={{ fontSize:13, color:C.muted }}>{value === 1 ? 'year' : 'years'} on F-1</span>
      </div>

      {/* 5-year bar */}
      <div style={{ marginTop:16 }}>
        <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, color:C.dim, marginBottom:6 }}>
          <span>Year 1</span>
          <span style={{ color: value <= 5 ? C.teal : '#f59e0b', fontWeight:700 }}>
            {value <= 5 ? `Exempt (${5 - value} more year${5-value===1?'':'s'} remaining)` : 'Exempt years exceeded'}
          </span>
          <span>Year 5+</span>
        </div>
        <div style={{ height:6, borderRadius:999, background:`rgba(83,128,131,0.15)`, overflow:'hidden' }}>
          <div style={{
            height:'100%', borderRadius:999, transition:'width .3s',
            background: value <= 5 ? `linear-gradient(90deg,${C.teal},${C.pine})` : `linear-gradient(90deg,#f59e0b,#ef4444)`,
            width:`${Math.min(100, (value/5)*100)}%`,
          }}/>
        </div>
        <div style={{ textAlign:'center', fontSize:11, color:C.dim, marginTop:4 }}>F-1 exempt years: 5 max</div>
      </div>
    </div>
  );
}

/* ── Page ── */
export default function ResidencyPage() {
  const router = useRouter();

  // Form state
  const [step,      setStep]      = useState(1); // 1=visa, 2=years, 3=result
  const [visaType,  setVisaType]  = useState('F-1');
  const [years,     setYears]     = useState(1);
  const [taxYear,   setTaxYear]   = useState(new Date().getFullYear());
  const [result,    setResult]    = useState<any>(null);
  const [error,     setError]     = useState('');
  const [loading,   setLoading]   = useState(false);

  // Auth guard
  useEffect(() => {
    if (!localStorage.getItem('access_token')) router.push('/login');
  }, [router]);

  const submit = async () => {
    setError('');
    setLoading(true);
    try {
      const data = await apiFetch('/tax/residency-check', {
        method:'POST',
        body: JSON.stringify({ visaType: visaType.replace('-',''), calendarYearsInUS: years, taxYear }),
      });
      setResult(data);
      setStep(3);
      window.scrollTo({ top:0, behavior:'smooth' });
    } catch (err:any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const cardStyle: React.CSSProperties = {
    background:'rgba(83,128,131,0.05)',
    border:`1px solid ${C.border}`,
    borderRadius:20, padding:'32px',
    boxShadow:'0 16px 48px rgba(0,0,0,0.4)',
  };

  return (
    <div style={{ minHeight:'100vh', background:C.bg, color:C.text, fontFamily:"'Inter',system-ui,sans-serif" }}>

      {/* Top nav bar */}
      <div style={{ position:'sticky', top:0, zIndex:50, height:56, background:`rgba(10,15,20,0.95)`, borderBottom:`1px solid ${C.border}`, backdropFilter:'blur(12px)', display:'flex', alignItems:'center', padding:'0 24px', gap:16 }}>
        <Link href="/dashboard" style={{ display:'flex', alignItems:'center', gap:6, textDecoration:'none', color:C.muted, fontSize:14 }}>
          <ArrowLeft size={16}/> Dashboard
        </Link>
        <span style={{ color:C.border }}>·</span>
        <span style={{ fontSize:14, color:C.text, fontWeight:600 }}>Tax Residency Check</span>
        <div style={{ marginLeft:'auto', fontSize:12, color:C.dim }}>Tax Year {taxYear}</div>
      </div>

      <div style={{ maxWidth:680, margin:'0 auto', padding:'40px 24px' }}>

        {/* Header */}
        {step < 3 && (
          <div style={{ marginBottom:36 }}>
            <div style={{ marginBottom:12 }}>
              <span style={{ fontSize:11, fontWeight:700, letterSpacing:'0.08em', padding:'3px 10px', borderRadius:999, background:`${C.pine}1a`, border:`1px solid ${C.pine}40`, color:C.pine }}>STEP {step} OF 2</span>
            </div>
            <h1 style={{ fontSize:'clamp(24px,4vw,34px)', fontWeight:900, letterSpacing:'-0.03em', marginBottom:8 }}>
              {step === 1 ? 'What is your visa type?' : 'How many years on F-1?'}
            </h1>
            <p style={{ color:C.muted, fontSize:15, lineHeight:1.7 }}>
              {step === 1
                ? 'The IRS treats different visas differently when calculating tax residency.'
                : 'F-1 students are exempt from the Substantial Presence Test for their first 5 calendar years in the U.S.'}
            </p>
          </div>
        )}

        {/* Step bar */}
        {step < 3 && <StepBar step={step} total={2}/>}

        {/* ── STEP 1: Visa type ── */}
        {step === 1 && (
          <div style={cardStyle}>
            <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:28 }}>
              {[
                { value:'F-1', label:'F-1 Student Visa', sub:'Most common for international degree students at UIC' },
                { value:'J-1', label:'J-1 Exchange Visitor', sub:'Exchange programs, research scholars' },
                { value:'M-1', label:'M-1 Vocational Student', sub:'Vocational and non-academic studies' },
              ].map(o => (
                <Option key={o.value} value={o.value} label={o.label} sub={o.sub} selected={visaType===o.value} onSelect={setVisaType}/>
              ))}
            </div>

            <div style={{ background:'rgba(42,127,98,0.07)', border:'1px solid rgba(42,127,98,0.2)', borderRadius:12, padding:'12px 16px', marginBottom:24, display:'flex', gap:10 }}>
              <Info size={15} color={C.teal} style={{ flexShrink:0, marginTop:2 }}/>
              <p style={{ fontSize:13, color:C.muted, lineHeight:1.65 }}>
                F-1, J-1, and M-1 visa holders are considered <strong style={{ color:C.text }}>&quot;exempt individuals&quot;</strong> under IRS rules. This means days spent in the U.S. on these visas are excluded from the Substantial Presence Test for a limited period.
              </p>
            </div>

            <button
              onClick={() => setStep(2)}
              style={{ width:'100%', background:grad, color:'#fff', fontWeight:700, border:'none', borderRadius:12, padding:'14px', fontSize:15, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}
            >
              Continue <ArrowRight size={16}/>
            </button>
          </div>
        )}

        {/* ── STEP 2: Years ── */}
        {step === 2 && (
          <div style={cardStyle}>
            <Stepper
              value={years} onChange={setYears} min={1} max={20}
              label="Calendar years you have been in F-1 status"
              sub="Count all years from when you first arrived on an F-1 visa, including partial years. Example: arrived in Aug 2022 = 1 year (2022 counts as a full calendar year for IRS purposes)."
            />

            <div style={{ marginTop:20, background:`rgba(83,128,131,0.05)`, border:`1px solid ${C.border}`, borderRadius:12, padding:'14px 18px' }}>
              <p style={{ fontSize:13, color:C.muted, lineHeight:1.7 }}>
                <strong style={{ color:C.text }}>Why does this matter?</strong> F-1 students who have been exempt for fewer than 5 calendar years are automatically classified as <strong style={{ color:C.teal }}>Nonresident Aliens</strong>, regardless of how many days they spent in the U.S.
              </p>
            </div>

            {error && (
              <div style={{ marginTop:16, background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.3)', borderRadius:10, padding:'12px 16px', color:'#fca5a5', fontSize:14 }}>
                {error}
              </div>
            )}

            <div style={{ display:'flex', gap:10, marginTop:20 }}>
              <button
                onClick={() => setStep(1)}
                style={{ flex:1, background:'transparent', color:C.muted, fontWeight:600, border:`1px solid ${C.border}`, borderRadius:12, padding:'14px', fontSize:15, cursor:'pointer' }}
              >
                <ArrowLeft size={16} style={{ display:'inline', marginRight:6 }}/>Back
              </button>
              <button
                onClick={submit}
                disabled={loading}
                style={{ flex:2, background: loading ? 'rgba(83,128,131,0.4)' : grad, color:'#fff', fontWeight:700, border:'none', borderRadius:12, padding:'14px', fontSize:15, cursor: loading ? 'not-allowed' : 'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}
              >
                {loading ? 'Calculating...' : (<>Check my status <ArrowRight size={16}/></>)}
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: Result ── */}
        {step === 3 && result && (
          <div>
            {/* Status headline */}
            <div style={{ textAlign:'center', marginBottom:28 }}>
              <h1 style={{ fontSize:'clamp(24px,4vw,32px)', fontWeight:900, letterSpacing:'-0.03em', marginBottom:16 }}>
                Your residency status
              </h1>
              <StatusBadge isResident={result.isResident ?? (result.status === 'RESIDENT_ALIEN')}/>
            </div>

            {/* Explanation */}
            <div style={{ ...cardStyle, marginBottom:16 }}>
              <h2 style={{ fontWeight:800, fontSize:16, marginBottom:10 }}>What this means</h2>
              <p style={{ color:C.muted, fontSize:14, lineHeight:1.75 }}>
                {result.explanation || result.reasoning?.plainEnglish || 'Based on your input, we have determined your IRS tax residency status.'}
              </p>
            </div>

            {/* Weighted days breakdown (if available) */}
            {result.weightedDays !== undefined && (
              <div style={{ ...cardStyle, marginBottom:16 }}>
                <h2 style={{ fontWeight:800, fontSize:16, marginBottom:16 }}>Substantial Presence Test</h2>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10 }}>
                  {[
                    ['Current year',   result.daysCount?.currentYear,           '100%',  C.pine],
                    ['Prior year',     result.daysCount?.priorYearWeighted,     '1/3',   C.teal],
                    ['2 years ago',    result.daysCount?.twoYearsAgoWeighted,   '1/6',   C.lilac],
                  ].map(([label, val, weight, color]) => (
                    <div key={label as string} style={{ textAlign:'center', background:`rgba(83,128,131,0.06)`, borderRadius:10, padding:'14px 10px', border:`1px solid ${C.border}` }}>
                      <p style={{ fontSize:22, fontWeight:900, color: color as string }}>{val ?? '—'}</p>
                      <p style={{ fontSize:11, color:C.muted, marginTop:4 }}>{label as string}</p>
                      <p style={{ fontSize:10, color:C.dim }}>{weight as string} weight</p>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop:14, padding:'12px 16px', borderRadius:10, background:`rgba(83,128,131,0.07)`, border:`1px solid ${C.border}` }}>
                  <p style={{ fontSize:13, color:C.muted }}>
                    Weighted total: <strong style={{ color:C.text }}>{result.daysCount?.totalWeighted ?? 'N/A'}</strong> days
                    {' '}(threshold: <strong style={{ color:C.text }}>183</strong>)
                  </p>
                </div>
              </div>
            )}

            {/* Required forms */}
            <div style={{ ...cardStyle, marginBottom:16 }}>
              <h2 style={{ fontWeight:800, fontSize:16, marginBottom:14 }}>Forms you need to file</h2>
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                {(result.requiredForms || result.forms || ['Form 8843']).map((form: string) => (
                  <div key={form} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 16px', borderRadius:10, background:`rgba(83,128,131,0.06)`, border:`1px solid ${C.border}` }}>
                    <FileText size={16} color={C.pine}/>
                    <span style={{ fontWeight:600, fontSize:14, color:C.text }}>{form}</span>
                    <ChevronRight size={14} color={C.dim} style={{ marginLeft:'auto' }}/>
                  </div>
                ))}
              </div>
            </div>

            {/* Treaty */}
            {result.treatyEligible && (
              <div style={{ ...cardStyle, marginBottom:16, border:`1px solid rgba(83,128,131,0.4)`, background:`rgba(83,128,131,0.08)` }}>
                <div style={{ display:'flex', gap:12 }}>
                  <Globe size={18} color={C.pine} style={{ flexShrink:0, marginTop:2 }}/>
                  <div>
                    <h3 style={{ fontWeight:700, fontSize:15, color:C.pine, marginBottom:6 }}>Tax Treaty May Apply</h3>
                    <p style={{ fontSize:13, color:C.muted, lineHeight:1.7 }}>{result.treatyInfo}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Disclaimer */}
            <div style={{ display:'flex', gap:10, padding:'14px 18px', borderRadius:12, background:'rgba(255,255,255,0.02)', border:`1px solid ${C.border}`, marginBottom:24 }}>
              <Shield size={15} color={C.muted} style={{ flexShrink:0, marginTop:2 }}/>
              <p style={{ fontSize:12, color:C.dim, lineHeight:1.65 }}>
                This is an educational tool, not tax advice. Consult a qualified tax professional for your specific situation.
              </p>
            </div>

            {/* Actions */}
            <div style={{ display:'flex', gap:12 }}>
              <button
                onClick={() => { setStep(1); setResult(null); }}
                style={{ flex:1, background:'transparent', color:C.muted, fontWeight:600, border:`1px solid ${C.border}`, borderRadius:12, padding:'13px', fontSize:14, cursor:'pointer' }}
              >
                Re-run check
              </button>
              <Link href="/dashboard" style={{ flex:2, textDecoration:'none' }}>
                <button style={{ width:'100%', background:grad, color:'#fff', fontWeight:700, border:'none', borderRadius:12, padding:'13px', fontSize:14, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
                  Back to dashboard <ArrowRight size={15}/>
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
