import { useCallback, useState } from 'react'
import type { ZodType } from 'zod'

export function useForm<T extends Record<string, unknown>>(schema: ZodType<T>, initial: T) {
  const [values, setValues] = useState<T>(initial)
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({})

  const setField = useCallback(<K extends keyof T>(key: K, value: T[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev))
  }, [])

  const validate = useCallback((): T | null => {
    const result = schema.safeParse(values)
    if (result.success) {
      setErrors({})
      return result.data
    }
    const next: Partial<Record<keyof T, string>> = {}
    for (const issue of result.error.issues) {
      const key = issue.path[0] as keyof T | undefined
      if (key !== undefined && next[key] === undefined) next[key] = issue.message
    }
    setErrors(next)
    return null
  }, [schema, values])

  const reset = useCallback((next: T) => {
    setValues(next)
    setErrors({})
  }, [])

  return { values, errors, setField, setValues, validate, reset }
}
