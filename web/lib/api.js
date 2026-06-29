// web/lib/api.js
// Pattern Nexura frontend/lib/api.js — fetch wrapper centralisé

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'
const TOKEN_KEY = 'lapinou_admin_token'

// ─── Token admin (stocké côté client uniquement) ──────────────────────────────
export function getAdminToken() {
  if (typeof window === 'undefined') return null
  return window.localStorage.getItem(TOKEN_KEY)
}

export function setAdminToken(token) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(TOKEN_KEY, token)
}

export function clearAdminToken() {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(TOKEN_KEY)
}

async function apiFetch(endpoint, options = {}) {
  const token = getAdminToken()

  const res = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  })

  const data = await res.json().catch(() => null)

  if (!res.ok) {
    const message = data?.error || data?.message || `Erreur ${res.status}`
    throw Object.assign(new Error(message), { status: res.status, data })
  }

  return data
}

// ─── Lapins ───────────────────────────────────────────────────────────────────
export const rabbitsApi = {
  list:   (params = {}) => {
    const qs = new URLSearchParams(params).toString()
    return apiFetch(`/rabbits${qs ? `?${qs}` : ''}`)
  },
  detail: (slug)        => apiFetch(`/rabbits/${slug}`),
  reserve:(slug, body)  => apiFetch(`/rabbits/${slug}/reserve`, {
    method: 'POST',
    body:   JSON.stringify(body),
  }),
  // ── Admin (nécessite un token) ──────────────────────────────────────────────
  create: (body)        => apiFetch('/rabbits', { method: 'POST', body: JSON.stringify(body) }),
  update: (id, body)     => apiFetch(`/rabbits/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  remove: (id)           => apiFetch(`/rabbits/${id}`, { method: 'DELETE' }),
  // Upload de photos — on doit envoyer FormData (pas JSON) donc on bypass apiFetch
  uploadImages: async (id, files) => {
    const token = getAdminToken()
    const formData = new FormData()
    Array.from(files).forEach(f => formData.append('images', f))
    const res = await fetch(`${API_URL}/rabbits/${id}/images`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    })
    const data = await res.json().catch(() => null)
    if (!res.ok) throw Object.assign(new Error(data?.error || `Erreur ${res.status}`), { status: res.status })
    return data
  },
  deleteImage: (rabbitId, photoId) => apiFetch(`/rabbits/${rabbitId}/images/${photoId}`, { method: 'DELETE' }),
}

// ─── Admin ────────────────────────────────────────────────────────────────────
export const adminApi = {
  login: (password) => apiFetch('/admin/login', {
    method: 'POST',
    body:   JSON.stringify({ password }),
  }),
  reservations: {
    list:    (params = {}) => {
      const qs = new URLSearchParams(params).toString()
      return apiFetch(`/admin/reservations${qs ? `?${qs}` : ''}`)
    },
    confirm: (id, note) => apiFetch(`/admin/reservations/${id}/confirm`, {
      method: 'PATCH',
      body:   JSON.stringify({ note }),
    }),
    cancel:  (id)       => apiFetch(`/admin/reservations/${id}/cancel`, { method: 'PATCH' }),
    sold:    (id)       => apiFetch(`/admin/reservations/${id}/sold`,   { method: 'PATCH' }),
  },
  analytics: {
    stats:   () => apiFetch('/analytics/stats'),
  },
}

// ─── Contact ──────────────────────────────────────────────────────────────────
export const sendContactMessage = (body) => apiFetch('/contact', {
  method: 'POST',
  body:   JSON.stringify(body),
})

