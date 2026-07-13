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

// ── Palette (mirrors landing page) ──────────────────────────────────────────
export const C = {
  bg:     '#0a0f14',
  bg2:    '#0f1920',
  border: 'rgba(83,128,131,0.18)',
  card:   'rgba(83,128,131,0.06)',
  text:   '#f0eeee',
  muted:  '#89909F',
  dim:    'rgba(137,144,159,0.45)',
  pine:   '#538083',
  teal:   '#2A7F62',
  lilac:  '#C3ACCE',
} as const;

export const grad     = `linear-gradient(135deg,${C.pine},${C.teal})`;
export const gradText = `linear-gradient(135deg,${C.lilac} 0%,${C.pine} 55%,${C.teal} 100%)`;
