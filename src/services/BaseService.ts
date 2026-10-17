import { httpClient } from './http'
import type { ApiClient } from '@/lib/http/ApiClient'

export abstract class BaseService {
  protected readonly http: ApiClient = httpClient
}
