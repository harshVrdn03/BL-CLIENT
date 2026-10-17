interface ErrorEnvelope {
  error?: {
    code?: string
    message?: string
    details?: unknown
  }
}

export class ApiError extends Error {
  readonly status: number
  readonly code: string
  readonly details?: unknown

  constructor(status: number, code: string, message: string, details?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.details = details
    Object.setPrototypeOf(this, ApiError.prototype)
  }

  get isUnauthorized(): boolean {
    return this.status === 401
  }

  get isForbidden(): boolean {
    return this.status === 403
  }

  get fieldErrors(): Record<string, string> | undefined {
    const details = this.details
    if (details && typeof details === 'object' && 'fieldErrors' in details) {
      return (details as { fieldErrors?: Record<string, string> }).fieldErrors
    }
    return undefined
  }

  static from(error: unknown): ApiError {
    if (error instanceof ApiError) return error

    const response = (error as { response?: { status?: number; data?: ErrorEnvelope } })
      ?.response
    const status = response?.status ?? 0
    const envelope = response?.data
    const code = envelope?.error?.code ?? (status === 0 ? 'NETWORK_ERROR' : 'REQUEST_FAILED')
    const message =
      envelope?.error?.message ??
      (status === 0
        ? 'Unable to reach the server. Check your connection and try again.'
        : `Request failed with status ${status}`)

    return new ApiError(status, code, message, envelope?.error?.details)
  }
}
