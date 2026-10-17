const STORAGE_KEY = 'bl.auth.token'

export class TokenStorage {
  get(): string | null {
    try {
      return localStorage.getItem(STORAGE_KEY)
    } catch {
      return null
    }
  }

  set(token: string): void {
    try {
      localStorage.setItem(STORAGE_KEY, token)
    } catch {
    }
  }

  clear(): void {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
    }
  }
}

export const tokenStorage = new TokenStorage()
