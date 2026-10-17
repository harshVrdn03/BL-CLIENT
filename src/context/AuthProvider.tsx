import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { authService, httpClient } from '@/services'
import { tokenStorage } from '@/lib/storage/TokenStorage'
import { AuthContext, type AuthStatus, type AuthContextValue } from './AuthContext'
import type { LoginCredentials, User } from '@/types'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [status, setStatus] = useState<AuthStatus>('loading')

  const logout = useCallback(() => {
    tokenStorage.clear()
    setUser(null)
    setStatus('unauthenticated')
  }, [])

  useEffect(() => {
    httpClient.setUnauthorizedHandler(() => {
      tokenStorage.clear()
      setUser(null)
      setStatus('unauthenticated')
    })
  }, [])

  useEffect(() => {
    let cancelled = false

    async function hydrate() {
      if (!tokenStorage.get()) {
        setStatus('unauthenticated')
        return
      }
      try {
        const current = await authService.me()
        if (!cancelled) {
          setUser(current)
          setStatus('authenticated')
        }
      } catch {
        if (!cancelled) {
          tokenStorage.clear()
          setUser(null)
          setStatus('unauthenticated')
        }
      }
    }

    void hydrate()
    return () => {
      cancelled = true
    }
  }, [])

  const login = useCallback(async (credentials: LoginCredentials): Promise<User> => {
    const result = await authService.login(credentials)
    tokenStorage.set(result.token)
    setUser(result.user)
    setStatus('authenticated')
    return result.user
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({ user, status, login, logout }),
    [user, status, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
