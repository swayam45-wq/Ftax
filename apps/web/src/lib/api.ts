// Shared API helpers — wraps the backend at http://localhost:3001
// Uses plain fetch (no axios dependency) to keep the lib simple.

export const API_BASE = 'http://localhost:3001/api/v1';

export async function apiFetch(path: string, opts: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  const res = await fetch(`${API_BASE}${path}`, {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(opts.headers || {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || `Request failed (${res.status})`);
  return data;
}

// ── Premium Palette (cinematic dark — mirrors landing page vibe) ─────────────
export const C = {
  bg:     '#0a0f14',          // near-black base
  bg2:    '#0d1520',          // sidebar / elevated surface
  bg3:    '#111b28',          // card surface
  border: 'rgba(83,145,150,0.16)',
  card:   'rgba(83,145,150,0.05)',
  text:   '#f0eeee',          // primary text
  muted:  '#8A97A8',          // secondary text
  dim:    'rgba(138,151,168,0.38)',
  pine:   '#538083',          // primary teal accent
  teal:   '#2A7F62',          // secondary green
  gold:   '#C9A84C',          // premium gold for highlights
  lilac:  '#C3ACCE',          // gradient accent
  error:  '#e55',             // error red
} as const;

// Gradients
export const grad      = `linear-gradient(135deg, ${C.pine}, ${C.teal})`;
export const gradText  = `linear-gradient(135deg, ${C.lilac} 0%, ${C.pine} 55%, ${C.teal} 100%)`;
export const gradGold  = `linear-gradient(135deg, #C9A84C, #E8C96A)`;
export const gradDark  = `linear-gradient(160deg, ${C.bg2} 0%, ${C.bg} 100%)`;
