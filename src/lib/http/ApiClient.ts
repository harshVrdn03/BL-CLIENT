import axios, { AxiosError, type AxiosInstance, type AxiosRequestConfig } from 'axios'
import { ApiError } from './ApiError'

interface ApiEnvelope<T> {
  data: T
}

export interface ApiClientOptions {
  baseURL: string
  tokenProvider: () => string | null
}

export class ApiClient {
  private readonly instance: AxiosInstance
  private readonly tokenProvider: () => string | null
  private onUnauthorized?: () => void

  constructor(options: ApiClientOptions) {
    this.tokenProvider = options.tokenProvider

    this.instance = axios.create({
      baseURL: options.baseURL,
      timeout: 20_000,
      headers: { 'Content-Type': 'application/json' },
    })

    this.instance.interceptors.request.use((config) => {
      const token = this.tokenProvider()
      if (token) config.headers.Authorization = `Bearer ${token}`
      return config
    })

    this.instance.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        const normalized = ApiError.from(error)
        if (normalized.isUnauthorized) this.onUnauthorized?.()
        return Promise.reject(normalized)
      },
    )
  }

  setUnauthorizedHandler(handler: () => void): void {
    this.onUnauthorized = handler
  }

  async request<T>(config: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.request<ApiEnvelope<T>>(config)
    return response.data?.data as T
  }

  get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'GET', url })
  }

  post<T>(url: string, body?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'POST', url, data: body })
  }

  patch<T>(url: string, body?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'PATCH', url, data: body })
  }

  delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'DELETE', url })
  }
}
