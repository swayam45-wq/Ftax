'use client';
import { useState } from 'react';
import Link from 'next/link';
import { PageShell } from '@/components/page-shell';
import { C, grad, gradText } from '@/lib/api';
import { CheckCircle, ChevronDown, ChevronUp, FileText, AlertTriangle, ArrowRight, Download } from 'lucide-react';

const SECTIONS = [
  {
    title: 'What is Form 8843?',
    body: `Form 8843 is an IRS statement filed by F-1, J-1, and M-1 visa holders declaring themselves as "exempt individuals" — meaning days spent in the U.S. on these visas don't count toward the Substantial Presence Test. It is NOT a tax return; it is simply a declaration.`,
  },
  {
    title: 'Who must file?',
    body: `Every F-1 student who was physically present in the U.S. at any point during the tax year must file Form 8843 — even with zero income and even if you only stayed for a few days. Failing to file can jeopardize your immigration status.`,
  },
  {
    title: 'Deadline',
    body: `April 15, 2025. If you had no income, you may file as late as June 16, 2025. Mail it even if you're filing late — there is no penalty for late filing of 8843 alone, but filing on time is best practice.`,
  },
  {
    title: 'Part I — General information',
    body: `Fill in your full legal name (as on passport), U.S. address, country of citizenship, U.S. visa type (F-1), date you became an F-1 student, and your current nonimmigrant status.`,
  },
  {
    title: 'Part III — Students (your section)',
    body: `This is the section most F-1 students complete. You need:\n• Name and address of your university (University of Illinois Chicago, 601 S Morgan St, Chicago IL 60607)\n• Name of your academic department or program\n• Dates of your current academic year\n• Number of prior calendar years you held F/J/M/Q status`,
  },
  {
    title: 'Where to mail it',
    body: `If filing only Form 8843 with no tax return:\nDepartment of the Treasury\nInternal Revenue Service Center\nAustin, TX 73301-0215\n\nIf attaching to Form 1040-NR, mail to the address shown on the 1040-NR instructions.`,
  },
];

const CHECKLIST = [
  'Legal name exactly as shown on passport',
  'U.S. address during tax year',
  'Country of citizenship',
  'Visa type: F-1',
  'Date you became an F-1 student (arrival date)',
  'UIC name and address',
  'Your academic department',
  'Number of prior years in F/J/M/Q status',
  'Dates of your program (start → expected graduation)',
  'Your signature and date',
];

function Accordion({ title, body }: { title: string; body: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div onClick={() => setOpen(o => !o)} style={{ background: open ? 'rgba(83,128,131,0.08)' : 'rgba(83,128,131,0.04)', border: `1px solid ${open ? 'rgba(83,128,131,0.35)' : C.border}`, borderRadius: 12, marginBottom: 8, cursor: 'pointer', transition: 'all .2s' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px' }}>
        <span style={{ fontWeight: 600, fontSize: 15, color: C.text }}>{title}</span>
        {open ? <ChevronUp size={16} color={C.pine}/> : <ChevronDown size={16} color={C.muted}/>}
      </div>
      {open && <p style={{ padding: '0 20px 18px', color: C.muted, fontSize: 14, lineHeight: 1.75, whiteSpace: 'pre-line' }}>{body}</p>}
    </div>
  );
}

export default function Form8843Page() {
  const [checked, setChecked] = useState<Set<number>>(new Set());
  const toggle = (i: number) => setChecked(s => { const n = new Set(s); n.has(i) ? n.delete(i) : n.add(i); return n; });
  const pct = Math.round((checked.size / CHECKLIST.length) * 100);

  return (
    <PageShell title="Form 8843 Guide">
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', padding: '3px 10px', borderRadius: 999, background: `${C.pine}1a`, border: `1px solid ${C.pine}40`, color: C.pine }}>STEP 2 OF 4</span>
        <h1 style={{ fontSize: 'clamp(24px,4vw,34px)', fontWeight: 900, letterSpacing: '-0.03em', margin: '12px 0 8px' }}>Form 8843 Guide</h1>
        <p style={{ color: C.muted, fontSize: 15, lineHeight: 1.7 }}>The exempt individual declaration every F-1 student must file — even with zero income.</p>
      </div>

      {/* Warning banner */}
      <div style={{ display: 'flex', gap: 10, padding: '14px 18px', borderRadius: 12, background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.22)', marginBottom: 28 }}>
        <AlertTriangle size={16} color="#f59e0b" style={{ flexShrink: 0, marginTop: 2 }}/>
        <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.65 }}>
          <strong style={{ color: '#f59e0b' }}>Required even with zero income.</strong> Every F-1 student physically present in the U.S. during 2024 must file Form 8843 by April 15, 2025.
        </p>
      </div>

      {/* Quick stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 32 }}>
        {[['Form', '8843', C.pine], ['Deadline', 'Apr 15', C.teal], ['Cost', 'Free', C.lilac]].map(([l, v, c]) => (
          <div key={l} style={{ textAlign: 'center', padding: '18px 12px', background: 'rgba(83,128,131,0.05)', border: `1px solid ${C.border}`, borderRadius: 12 }}>
            <p style={{ fontSize: 22, fontWeight: 900, background: gradText, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{v}</p>
            <p style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>{l}</p>
          </div>
        ))}
      </div>

      {/* Sections */}
      <h2 style={{ fontWeight: 800, fontSize: 16, marginBottom: 14 }}>Everything you need to know</h2>
      {SECTIONS.map(s => <Accordion key={s.title} {...s}/>)}

      {/* Checklist */}
      <div style={{ margin: '32px 0 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontWeight: 800, fontSize: 16 }}>Filing checklist</h2>
        <span style={{ fontSize: 13, color: pct === 100 ? C.teal : C.muted, fontWeight: 600 }}>{checked.size}/{CHECKLIST.length} done</span>
      </div>
      {/* Progress bar */}
      <div style={{ height: 4, borderRadius: 999, background: 'rgba(83,128,131,0.15)', marginBottom: 16, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: pct === 100 ? `linear-gradient(90deg,${C.teal},${C.pine})` : grad, borderRadius: 999, transition: 'width .3s' }}/>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 32 }}>
        {CHECKLIST.map((item, i) => (
          <div key={i} onClick={() => toggle(i)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: checked.has(i) ? 'rgba(42,127,98,0.08)' : 'rgba(83,128,131,0.04)', border: `1px solid ${checked.has(i) ? 'rgba(42,127,98,0.3)' : C.border}`, borderRadius: 10, cursor: 'pointer', transition: 'all .15s' }}>
            <CheckCircle size={17} color={checked.has(i) ? C.teal : 'rgba(83,128,131,0.3)'}/>
            <span style={{ fontSize: 14, color: checked.has(i) ? C.text : C.muted, textDecoration: checked.has(i) ? 'line-through' : 'none' }}>{item}</span>
          </div>
        ))}
      </div>

      {/* Download link + next step */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <a href="https://www.irs.gov/pub/irs-pdf/f8843.pdf" target="_blank" rel="noreferrer" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '13px 20px', borderRadius: 12, border: `1px solid ${C.border}`, background: 'rgba(83,128,131,0.05)', color: C.text, textDecoration: 'none', fontWeight: 600, fontSize: 14 }}>
          <Download size={15}/> Download Form 8843 (IRS)
        </a>
        <Link href="/treaty" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '13px 20px', borderRadius: 12, background: grad, color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: 14 }}>
          Next: Tax Treaty Check <ArrowRight size={15}/>
        </Link>
      </div>
    </PageShell>
  );
}
