import { ApiClient } from '@/lib/http/ApiClient'
import { env } from '@/lib/env'
import { tokenStorage } from '@/lib/storage/TokenStorage'

export const httpClient = new ApiClient({
  baseURL: env.apiBaseUrl,
  tokenProvider: () => tokenStorage.get(),
})
