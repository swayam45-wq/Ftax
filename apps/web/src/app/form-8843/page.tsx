'use client';
import { useState, useEffect } from 'react';
import { PageShell } from '@/components/page-shell';
import { C, apiFetch, grad } from '@/lib/api';
import { FileText, Download, Check, Info, Landmark, Shield, Printer } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

export default function Form8843Page() {
  const [mode, setMode] = useState<'guide' | 'fill' | 'state'>('guide');
  const [profile, setProfile] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // State worksheet values
  const [wages, setWages] = useState('0');
  const [interest, setInterest] = useState('0');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    ssnOrItin: '',
    addressUS: '',
    addressForeign: '',
    countryPassport: '',
    visaType: 'F-1',
    entryDate: '',
    uniName: 'University of Illinois Chicago',
    uniAddress: '601 S Morgan St, Chicago, IL 60607',
    uniDirector: 'UIC International Services Director, 1200 W Harrison St, Chicago, IL 60607',
  });

  useEffect(() => {
    apiFetch('/profile')
      .then(p => {
        setProfile(p);
        setFormData(prev => ({
          ...prev,
          firstName: p.firstName || '',
          lastName: p.lastName || '',
          countryPassport: p.passportCountry || '',
          visaType: p.visaType || 'F-1',
          entryDate: p.programStartDate ? p.programStartDate.slice(0, 10) : '',
        }));
      })
      .catch(() => {});
  }, []);

  const handleDownloadFilledPDF = async () => {
    setLoading(true);
    setSuccess(false);
    try {
      const response = await fetch('/f8843.pdf');
      const formPdfBytes = await response.arrayBuffer();
      const pdfDoc = await PDFDocument.load(formPdfBytes);
      const form = pdfDoc.getForm();

      const fieldsMap: Record<string, string> = {
        'topmostSubform[0].Page1[0].f1_01[0]': formData.firstName,
        'topmostSubform[0].Page1[0].f1_02[0]': formData.lastName,
        'topmostSubform[0].Page1[0].f1_03[0]': formData.ssnOrItin,
        'topmostSubform[0].Page1[0].f1_04[0]': formData.addressUS,
        'topmostSubform[0].Page1[0].f1_06[0]': formData.addressForeign,
        'topmostSubform[0].Page1[0].f1_08[0]': formData.countryPassport,
        'topmostSubform[0].Page1[0].f1_09[0]': formData.countryPassport,
        'topmostSubform[0].Page1[0].f1_11[0]': formData.visaType,
        'topmostSubform[0].Page1[0].f1_12[0]': formData.entryDate,
        'topmostSubform[0].Page1[0].f1_26[0]': formData.uniName,
        'topmostSubform[0].Page1[0].f1_27[0]': formData.uniAddress,
        'topmostSubform[0].Page1[0].f1_28[0]': formData.uniDirector,
      };

      Object.entries(fieldsMap).forEach(([key, value]) => {
        try {
          const field = form.getField(key);
          if (field) {
            (field as any).setText(value || '');
          }
        } catch (e) {
          console.warn(`Could not set PDF field: ${key}`, e);
        }
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `f8843_filled_${formData.lastName || 'student'}.pdf`;
      link.click();
      setSuccess(true);
    } catch (err) {
      console.error('Error generating PDF:', err);
    } finally {
      setLoading(false);
    }
  };

  const printStateWorksheet = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const wNum = parseFloat(wages) || 0;
    const iNum = parseFloat(interest) || 0;
    const gross = wNum + iNum;
    const baseExempt = 2775; // 2024-2025 IL exemption threshold
    const taxOwed = Math.max(0, (gross - baseExempt) * 0.0495);

    printWindow.document.write(`
      <html>
        <head>
          <title>IL-1040 State Tax Helper Sheet - ${formData.firstName} ${formData.lastName}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; color: #333; line-height: 1.6; }
            .header { border-bottom: 2px solid #2A7F62; padding-bottom: 20px; margin-bottom: 30px; }
            .title { font-size: 22px; font-weight: bold; color: #2A7F62; }
            .subtitle { font-size: 13px; color: #666; margin-top: 5px; }
            .section { margin-top: 25px; border: 1px solid #ddd; padding: 20px; border-radius: 6px; }
            .section-title { font-weight: bold; font-size: 15px; border-bottom: 1px solid #eee; padding-bottom: 8px; margin-bottom: 15px; color: #111; }
            .line-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px dotted #ccc; }
            .line-num { font-weight: bold; color: #2A7F62; min-width: 140px; }
            .line-desc { flex: 1; margin-right: 15px; }
            .line-val { font-weight: bold; text-align: right; }
            .footer { margin-top: 40px; border-top: 1px solid #eee; padding-top: 20px; font-size: 11px; color: #777; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">Illinois Form IL-1040 Nonresident Helper Worksheet</div>
            <div class="subtitle">Tax Year 2025 - For Student: ${formData.firstName} ${formData.lastName}</div>
          </div>

          <p>Use this reference sheet to fill out the official Illinois State Individual Income Tax Return (Form IL-1040) and Schedule NR. Do not mail this helper sheet itself.</p>

          <div class="section">
            <div class="section-title">Schedule NR (Nonresident Allocation)</div>
            <div class="line-row">
              <span class="line-num">Part I, Line 1, Col A</span>
              <span class="line-desc">Total Wages from Federal Return</span>
              <span class="line-val">$${wNum.toFixed(2)}</span>
            </div>
            <div class="line-row">
              <span class="line-num">Part I, Line 1, Col B</span>
              <span class="line-desc">Wages earned inside Illinois (UIC/OPT)</span>
              <span class="line-val">$${wNum.toFixed(2)}</span>
            </div>
            <div class="line-row">
              <span class="line-num">Part I, Line 21, Col B</span>
              <span class="line-desc">Illinois Base Income</span>
              <span class="line-val">$${gross.toFixed(2)}</span>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Form IL-1040 Line-by-Line Guide</div>
            <div class="line-row">
              <span class="line-num">Line 1</span>
              <span class="line-desc">Adjusted Gross Income (from Federal 1040-NR)</span>
              <span class="line-val">$${gross.toFixed(2)}</span>
            </div>
            <div class="line-row">
              <span class="line-num">Line 9</span>
              <span class="line-desc">Illinois Base Income (matching Schedule NR)</span>
              <span class="line-val">$${gross.toFixed(2)}</span>
            </div>
            <div class="line-row">
              <span class="line-num">Line 10</span>
              <span class="line-desc">Standard Exemption (allocated based on residency)</span>
              <span class="line-val">$${baseExempt.toFixed(2)}</span>
            </div>
            <div class="line-row">
              <span class="line-num">Line 12</span>
              <span class="line-desc">Net Taxable Income</span>
              <span class="line-val">$${Math.max(0, gross - baseExempt).toFixed(2)}</span>
            </div>
            <div class="line-row">
              <span class="line-num">Line 13</span>
              <span class="line-desc">Illinois Tax Due (Flat 4.95%)</span>
              <span class="line-val">$${taxOwed.toFixed(2)}</span>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Mailing Instructions</div>
            <p><strong>If you owe tax (attaching payment):</strong><br>
            Illinois Department of Revenue<br>
            P.O. Box 19027<br>
            Springfield, IL 62794-9027</p>
            
            <p><strong>If you are claiming a refund or owe $0:</strong><br>
            Illinois Department of Revenue<br>
            P.O. Box 19005<br>
            Springfield, IL 62794-9005</p>
          </div>

          <div class="footer">
            Generated via FTax Assistant - UIC. Based on flat tax rates for tax year 2025.
          </div>
          <script>window.print();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const inputStyle = {
    width: '100%',
    background: 'rgba(83,145,150,0.07)',
    border: `1px solid rgba(83,145,150,0.18)`,
    borderRadius: 12,
    padding: '12px 14px',
    color: C.text,
    fontSize: 14,
    outline: 'none',
    boxSizing: 'border-box' as const,
    marginTop: 6,
    transition: 'border-color .2s, box-shadow .2s',
  };

  return (
    <PageShell title="Tax Form Hub" back="/dashboard" backLabel="Dashboard">
      {/* Three tabs */}
      <div style={{ display:'flex', gap:4, marginBottom:28, background:'rgba(10,15,20,0.60)', border:`1px solid rgba(83,145,150,0.18)`, borderRadius:14, padding:5, backdropFilter:'blur(8px)' }}>
        <button onClick={() => setMode('guide')} style={{ flex:1, padding:'11px 10px', borderRadius:10, border:'none', cursor:'pointer', fontSize:13, fontWeight:600, transition:'all .18s', background:mode==='guide'?`linear-gradient(135deg,${C.pine},${C.teal})`:'transparent', color:mode==='guide'?'#fff':C.muted, boxShadow:mode==='guide'?'0 4px 16px rgba(83,128,131,0.30)':'none' }}>Filing Guide</button>
        <button onClick={() => setMode('fill')} style={{ flex:1, padding:'11px 10px', borderRadius:10, border:'none', cursor:'pointer', fontSize:13, fontWeight:600, transition:'all .18s', background:mode==='fill'?`linear-gradient(135deg,${C.pine},${C.teal})`:'transparent', color:mode==='fill'?'#fff':C.muted, boxShadow:mode==='fill'?'0 4px 16px rgba(83,128,131,0.30)':'none' }}>Federal 8843</button>
        <button onClick={() => setMode('state')} style={{ flex:1, padding:'11px 10px', borderRadius:10, border:'none', cursor:'pointer', fontSize:13, fontWeight:600, transition:'all .18s', background:mode==='state'?`linear-gradient(135deg,${C.pine},${C.teal})`:'transparent', color:mode==='state'?'#fff':C.muted, boxShadow:mode==='state'?'0 4px 16px rgba(83,128,131,0.30)':'none' }}>Illinois State (IL-1040)</button>
      </div>

      {/* ── MODE: GUIDE ── */}
      {mode === 'guide' && (
        <div>
          <div style={{ marginBottom: 30 }}>
            <h1 style={{ fontSize: 26, fontWeight: 900, letterSpacing: '-0.02em', marginBottom: 8 }}>Federal vs State Filing</h1>
            <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.6 }}>F-1 student tax returns consist of two separate components: Federal (sent to the IRS) and State (sent to the Illinois Department of Revenue).</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
            <div style={{ background: 'rgba(83,128,131,0.04)', border: `1px solid ${C.border}`, borderRadius: 12, padding: 20 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10, color: C.pine }}><Shield size={16} /> 1. U.S. Federal Tax</h3>
              <p style={{ color: C.muted, fontSize: 12, lineHeight: 1.7 }}>
                All F-1 students must file <strong style={{ color: C.text }}>Form 8843</strong> to declare their exempt individual status, even with zero income. If you earned wages, you must also file <strong style={{ color: C.text }}>Form 1040-NR</strong>.
              </p>
            </div>
            <div style={{ background: 'rgba(42,127,98,0.04)', border: '1px solid rgba(42,127,98,0.2)', borderRadius: 12, padding: 20 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10, color: C.teal }}><Landmark size={16} /> 2. Illinois State Tax</h3>
              <p style={{ color: C.muted, fontSize: 12, lineHeight: 1.7 }}>
                If you earned income in Illinois (campus job, OPT, CPT), you must file <strong style={{ color: C.text }}>Form IL-1040</strong> along with <strong style={{ color: C.text }}>Schedule NR</strong> to pay Illinois&apos;s flat 4.95% income tax.
              </p>
            </div>
          </div>
          <button onClick={() => setMode('fill')} style={{ width: '100%', padding: '14px', borderRadius: 12, border: 'none', background: grad, color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <FileText size={16} /> Get started with tax forms
          </button>
        </div>
      )}

      {/* ── MODE: FEDERAL FILL ── */}
      {mode === 'fill' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ background: 'rgba(83,128,131,0.04)', border: `1px solid ${C.border}`, borderRadius: 16, padding: 24 }}>
            <h2 style={{ fontSize: 16, fontWeight: 800, marginBottom: 16, color: C.text }}>Part I - General Information</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, color: C.muted }}>First Name</label>
                <input style={inputStyle} value={formData.firstName} onChange={e => setFormData({ ...formData, firstName: e.target.value })} />
              </div>
              <div>
                <label style={{ fontSize: 12, color: C.muted }}>Last Name</label>
                <input style={inputStyle} value={formData.lastName} onChange={e => setFormData({ ...formData, lastName: e.target.value })} />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ fontSize: 12, color: C.muted }}>SSN or ITIN (leave blank if none)</label>
                <input style={inputStyle} value={formData.ssnOrItin} placeholder="e.g. 000-00-0000" onChange={e => setFormData({ ...formData, ssnOrItin: e.target.value })} />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ fontSize: 12, color: C.muted }}>U.S. Residence Address</label>
                <input style={inputStyle} placeholder="U.S. Street Address, City, State, ZIP" value={formData.addressUS} onChange={e => setFormData({ ...formData, addressUS: e.target.value })} />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ fontSize: 12, color: C.muted }}>Foreign Address</label>
                <input style={inputStyle} placeholder="Street Address, City, Region, Country" value={formData.addressForeign} onChange={e => setFormData({ ...formData, addressForeign: e.target.value })} />
              </div>
            </div>
          </div>

          <div style={{ background: 'rgba(83,128,131,0.04)', border: `1px solid ${C.border}`, borderRadius: 16, padding: 24 }}>
            <h2 style={{ fontSize: 16, fontWeight: 800, marginBottom: 16, color: C.text }}>Part II - Academic Details</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ fontSize: 12, color: C.muted }}>University Name</label>
                <input style={inputStyle} value={formData.uniName} onChange={e => setFormData({ ...formData, uniName: e.target.value })} />
              </div>
              <div>
                <label style={{ fontSize: 12, color: C.muted }}>Entry Visa Type</label>
                <input style={inputStyle} value={formData.visaType} onChange={e => setFormData({ ...formData, visaType: e.target.value })} />
              </div>
              <div>
                <label style={{ fontSize: 12, color: C.muted }}>Entry Date</label>
                <input type="date" style={inputStyle} value={formData.entryDate} onChange={e => setFormData({ ...formData, entryDate: e.target.value })} />
              </div>
            </div>
          </div>

          <button onClick={handleDownloadFilledPDF} disabled={loading} style={{ padding: '14px', borderRadius: 12, border: 'none', background: loading ? 'rgba(83,128,131,0.4)' : grad, color: '#fff', fontWeight: 700, fontSize: 14, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            {loading ? 'Processing...' : success ? <><Check size={16} /> Generated Successfully!</> : <><Download size={16} /> Fill &amp; Download Original U.S. Form 8843</>}
          </button>
        </div>
      )}

      {/* ── MODE: STATE FILL ── */}
      {mode === 'state' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ background: 'rgba(42,127,98,0.04)', border: '1px solid rgba(42,127,98,0.2)', borderRadius: 16, padding: 24 }}>
            <h2 style={{ fontSize: 16, fontWeight: 800, marginBottom: 8, color: C.text }}>Illinois IL-1040 Calculator Data</h2>
            <p style={{ color: C.muted, fontSize: 13, marginBottom: 16 }}>Input your income details to determine line items for Form IL-1040 and Schedule NR.</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, color: C.muted }}>Total Wages (Box 1 of W-2)</label>
                <input type="number" style={inputStyle} value={wages} onChange={e => setWages(e.target.value)} />
              </div>
              <div>
                <label style={{ fontSize: 12, color: C.muted }}>Other Income / Interest</label>
                <input type="number" style={inputStyle} value={interest} onChange={e => setInterest(e.target.value)} />
              </div>
            </div>
          </div>

          <div style={{ background: 'rgba(83,128,131,0.04)', border: `1px solid ${C.border}`, borderRadius: 16, padding: 20 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}><Info size={16} color={C.teal} /> Filing instructions</h3>
            <p style={{ color: C.muted, fontSize: 12, lineHeight: 1.6 }}>
              Illinois requires nonresidents with source income to file <strong style={{ color: C.text }}>Form IL-1040</strong> individual tax return along with <strong style={{ color: C.text }}>Schedule NR</strong> (to allocate the portion of federal income earned in Illinois).
            </p>
          </div>

          <button onClick={printStateWorksheet} style={{ padding: '14px', borderRadius: 12, border: 'none', background: `linear-gradient(135deg, ${C.teal}, #1b533f)`, color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <Printer size={16} /> Generate &amp; Print IL-1040 Helper Sheet
          </button>
        </div>
      )}
    </PageShell>
  );
}
