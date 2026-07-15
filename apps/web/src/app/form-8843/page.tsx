'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PageShell } from '@/components/page-shell';
import { C, apiFetch, grad } from '@/lib/api';
import { FileText, Download, Check, Info } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

export default function Form8843Page() {
  const [mode, setMode] = useState<'guide' | 'fill'>('guide');
  const [profile, setProfile] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
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
          programName: p.department || '',
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
        <button onClick={() => setMode('fill')} style={{ flex: 1, padding: '10px', borderRadius: 9, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600, transition: 'all .15s', background: mode === 'fill' ? C.pine : 'transparent', color: mode === 'fill' ? '#fff' : C.muted }}>Auto-Fill Original Form</button>
      </div>

      {mode === 'guide' ? (
        <div>
          <div style={{ marginBottom: 30 }}>
            <h1 style={{ fontSize: 28, fontWeight: 900, letterSpacing: '-0.02em', marginBottom: 8 }}>Form 8843 Instructions</h1>
            <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.6 }}>Exempt individuals on F-1, J-1, or M-1 visas must file Form 8843 annually to exclude days of presence in the U.S. for tax residency testing.</p>
          </div>
          <div style={{ background: 'rgba(83,128,131,0.04)', border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, marginBottom: 24 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}><Info size={16} color={C.teal} /> Filing Information</h3>
            <ul style={{ paddingLeft: 18, color: C.muted, fontSize: 13, lineHeight: 1.8 }}>
              <li><strong>Requirement:</strong> Mandatory for all international students on F-1 status present in the U.S. during the tax year.</li>
              <li><strong>Filing Deadline:</strong> April 15, 2025.</li>
              <li><strong>Mailing Address:</strong> Department of the Treasury, Internal Revenue Service Center, Austin, TX 73301-0215.</li>
            </ul>
          </div>
          <button onClick={() => setMode('fill')} style={{ width: '100%', padding: '14px', borderRadius: 12, border: 'none', background: grad, color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <FileText size={16} /> Fill out the original form
          </button>
        </div>
      ) : (
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
            {loading ? 'Processing...' : success ? <><Check size={16} /> Generated Successfully!</> : <><Download size={16} /> Fill & Download Original U.S. Form 8843</>}
          </button>
        </div>
      )}
    </PageShell>
  );
}
