const API_BASE = import.meta.env.VITE_API_URL || ''

export function apiUrl(path) {
  return `${API_BASE}${path}`
}

export function imgUrl(url) {
  return url ? `${API_BASE}${url}?t=${Date.now()}` : ''
}
