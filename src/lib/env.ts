function computeSocketBaseUrl(): string {
  const api = import.meta.env.VITE_API_BASE_URL ?? '/api'
  if (/^https?:\/\//.test(api)) {
    return api.replace(/\/api\/?$/, '')
  }
  return window.location.origin
}

export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? '/api',
  socketBaseUrl: computeSocketBaseUrl(),
} as const
