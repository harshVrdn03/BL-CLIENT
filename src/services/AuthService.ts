import { BaseService } from './BaseService'
import type { LoginCredentials, LoginResult, User } from '@/types'

export class AuthService extends BaseService {
  login(credentials: LoginCredentials): Promise<LoginResult> {
    return this.http.post<LoginResult>('/auth/login', credentials)
  }

  me(): Promise<User> {
    return this.http.get<User>('/auth/me')
  }
}
