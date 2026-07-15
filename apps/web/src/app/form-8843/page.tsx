'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PageShell } from '@/components/page-shell';
import { C, apiFetch, grad } from '@/lib/api';
import { FileText, Download, Printer, Check, Info } from 'lucide-react';

export default function Form8843Page() {
  const [mode, setMode] = useState<'guide' | 'fill'>('guide');
  const [profile, setProfile] = useState<any>({});
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    ssnOrItin: '',
    addressUS: '',
    addressForeign: '',
    countryPassport: '',
    visaType: 'F1',
    entryDate: '',
    uniName: 'University of Illinois Chicago',
    uniAddress: '601 S Morgan St, Chicago, IL 60607',
    uniDirector: 'UIC International Services, 1200 W Harrison St, Chicago, IL 60607',
    programName: '',
    priorYears: '0',
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
          visaType: p.visaType || 'F1',
          entryDate: p.programStartDate ? p.programStartDate.slice(0, 10) : '',
          programName: p.department || '',
        }));
      })
      .catch(() => {});
  }, []);

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Form 8843 Statement - ${formData.firstName} ${formData.lastName}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; color: #333; line-height: 1.6; }
            .header { border-bottom: 2px solid #000; padding-bottom: 20px; margin-bottom: 30px; text-align: center; }
            .title { font-size: 24px; font-weight: bold; }
            .subtitle { font-size: 14px; color: #666; margin-top: 5px; }
            .section { margin-top: 25px; border: 1px solid #ccc; padding: 20px; border-radius: 6px; }
            .section-title { font-weight: bold; font-size: 16px; border-bottom: 1px solid #eee; padding-bottom: 8px; margin-bottom: 15px; text-transform: uppercase; color: #111; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
            .field { margin-bottom: 12px; }
            .label { font-size: 11px; color: #666; text-transform: uppercase; font-weight: bold; }
            .value { font-size: 15px; font-weight: bold; margin-top: 2px; }
            .footer { margin-top: 40px; border-top: 1px solid #eee; padding-top: 20px; font-size: 12px; color: #777; }
            .sig-line { margin-top: 40px; border-top: 1px solid #000; width: 250px; display: inline-block; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">Form 8843 Statement</div>
            <div class="subtitle">Exempt Individual Declaration - Tax Year 2025</div>
          </div>
          
          <div class="section">
            <div class="section-title">Part I - General Information</div>
            <div class="grid">
              <div class="field"><div class="label">First Name</div><div class="value">${formData.firstName || 'N/A'}</div></div>
              <div class="field"><div class="label">Last Name</div><div class="value">${formData.lastName || 'N/A'}</div></div>
              <div class="field"><div class="label">SSN or ITIN</div><div class="value">${formData.ssnOrItin || 'None / Not Applicable'}</div></div>
              <div class="field"><div class="label">Passport Country</div><div class="value">${formData.countryPassport || 'N/A'}</div></div>
              <div class="field"><div class="label">Visa Type</div><div class="value">${formData.visaType}</div></div>
              <div class="field"><div class="label">Date of Entry</div><div class="value">${formData.entryDate || 'N/A'}</div></div>
            </div>
            <div class="field" style="margin-top: 15px;"><div class="label">U.S. Address</div><div class="value">${formData.addressUS || 'N/A'}</div></div>
            <div class="field" style="margin-top: 15px;"><div class="label">Foreign Address</div><div class="value">${formData.addressForeign || 'N/A'}</div></div>
          </div>

          <div class="section">
            <div class="section-title">Part II - Student & Academic Information</div>
            <div class="field"><div class="label">University Name & Address</div><div class="value">${formData.uniName}<br>${formData.uniAddress}</div></div>
            <div class="field" style="margin-top: 15px;"><div class="label">University Director Info</div><div class="value">${formData.uniDirector}</div></div>
            <div class="grid" style="margin-top: 15px;">
              <div class="field"><div class="label">Program of Study</div><div class="value">${formData.programName || 'N/A'}</div></div>
              <div class="field"><div class="label">Prior Years in U.S.</div><div class="value">${formData.priorYears} Year(s)</div></div>
            </div>
          </div>

          <div style="margin-top: 40px;">
            <p>Under penalties of perjury, I declare that I have examined this statement and the accompanying information, and to the best of my knowledge and belief, they are true, correct, and complete.</p>
            <div style="display: flex; justify-content: space-between; margin-top: 50px;">
              <div>
                <div class="sig-line"></div>
                <div style="font-size: 12px; color: #666; margin-top: 5px;">Signature of Exempt Individual</div>
              </div>
              <div>
                <div class="sig-line" style="width: 150px;"></div>
                <div style="font-size: 12px; color: #666; margin-top: 5px;">Date</div>
              </div>
            </div>
          </div>

          <div class="footer">
            Generated via FTax Assistant - UIC. File this form along with Form 1040-NR or mail separately if no income.
          </div>
          <script>window.print();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const inputStyle = {
    width: '100%',
    background: 'rgba(83,128,131,0.08)',
    border: `1px solid ${C.border}`,
    borderRadius: 10,
    padding: '12px 14px',
    color: C.text,
    fontSize: 14,
    outline: 'none',
    boxSizing: 'border-box' as const,
    marginTop: 6
  };

  return (
    <PageShell title="Form 8843 Guide" back="/dashboard" backLabel="Dashboard">
      <div style={{ display: 'flex', gap: 4, marginBottom: 28, background: 'rgba(83,128,131,0.06)', border: `1px solid ${C.border}`, borderRadius: 12, padding: 4 }}>
        <button onClick={() => setMode('guide')} style={{ flex: 1, padding: '10px', borderRadius: 9, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600, transition: 'all .15s', background: mode === 'guide' ? C.pine : 'transparent', color: mode === 'guide' ? '#fff' : C.muted }}>Filing Guide</button>
        <button onClick={() => setMode('fill')} style={{ flex: 1, padding: '10px', borderRadius: 9, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600, transition: 'all .15s', background: mode === 'fill' ? C.pine : 'transparent', color: mode === 'fill' ? '#fff' : C.muted }}>Fill Form 8843</button>
      </div>

      {mode === 'guide' ? (
        <div>
          <div style={{ marginBottom: 30 }}>
            <h1 style={{ fontSize: 28, fontWeight: 900, letterSpacing: '-0.02em', marginBottom: 8 }}>Form 8843 Instructions</h1>
            <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.6 }}>F-1, J-1, and M-1 visa students must file Form 8843 annually to verify their exempt status, regardless of income.</p>
          </div>
          <div style={{ background: 'rgba(83,128,131,0.04)', border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, marginBottom: 24 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}><Info size={16} color={C.teal} /> Filing Information</h3>
            <ul style={{ paddingLeft: 18, color: C.muted, fontSize: 13, lineHeight: 1.8 }}>
              <li><strong>Who must file:</strong> All international students on F-1, F-2, J-1, or J-2 status present in the U.S. for any part of the tax year.</li>
              <li><strong>Filing Deadline:</strong> April 15, 2025.</li>
              <li><strong>Mail Address (No Income):</strong> Internal Revenue Service Center, Austin, TX 73301-0215.</li>
            </ul>
          </div>
          <button onClick={() => setMode('fill')} style={{ width: '100%', padding: '14px', borderRadius: 12, border: 'none', background: grad, color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <FileText size={16} /> Fill out Form 8843 directly
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ background: 'rgba(83,128,131,0.04)', border: `1px solid ${C.border}`, borderRadius: 16, padding: 24 }}>
            <h2 style={{ fontSize: 16, fontWeight: 800, marginBottom: 16, color: C.text }}>Part I - Personal Information</h2>
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
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ fontSize: 12, color: C.muted }}>Program of Study / Department</label>
                <input style={inputStyle} value={formData.programName} placeholder="e.g. Computer Science" onChange={e => setFormData({ ...formData, programName: e.target.value })} />
              </div>
              <div>
                <label style={{ fontSize: 12, color: C.muted }}>Entry Visa Type</label>
                <input style={inputStyle} value={formData.visaType} onChange={e => setFormData({ ...formData, visaType: e.target.value })} />
              </div>
              <div>
                <label style={{ fontSize: 12, color: C.muted }}>Prior U.S. Student Years</label>
                <input type="number" style={inputStyle} value={formData.priorYears} onChange={e => setFormData({ ...formData, priorYears: e.target.value })} />
              </div>
            </div>
          </div>

          <button onClick={handlePrint} style={{ padding: '14px', borderRadius: 12, border: 'none', background: grad, color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <Printer size={16} /> Generate & Print Statement
          </button>
        </div>
      )}
    </PageShell>
  );
}
