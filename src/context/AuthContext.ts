import { createContext } from 'react'
import type { LoginCredentials, User } from '@/types'

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated'

export interface AuthContextValue {
  user: User | null
  status: AuthStatus
  login(credentials: LoginCredentials): Promise<User>
  logout(): void
}

export const AuthContext = createContext<AuthContextValue | null>(null)
