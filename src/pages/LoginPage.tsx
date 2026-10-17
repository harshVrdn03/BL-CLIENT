import { useState, type FormEvent } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useForm } from '@/hooks/useForm'
import { loginSchema, type LoginForm } from '@/schemas'
import { ApiError } from '@/lib/http/ApiError'
import { Button } from '@/components/ui/Button'
import { Field, Input } from '@/components/ui/Field'

export function LoginPage() {
  const { login, status, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const form = useForm<LoginForm>(loginSchema, { email: '', password: '' })

  if (status === 'authenticated' && user) {
    const from = (location.state as { from?: string } | null)?.from
    return <Navigate to={from ?? (user.role === 'admin' ? '/admin' : '/author')} replace />
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setFormError(null)
    const values = form.validate()
    if (!values) return

    setSubmitting(true)
    try {
      const currentUser = await login(values)
      const from = (location.state as { from?: string } | null)?.from
      navigate(from ?? (currentUser.role === 'admin' ? '/admin' : '/author'), { replace: true })
    } catch (error) {
      setFormError(ApiError.from(error).message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-surface shadow-float p-8 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-sm font-bold text-white">
            BL
          </div>
          <div>
            <h1 className="text-lg font-semibold text-heading">Support Portal</h1>
            <p className="text-xs text-muted">Author Support &amp; Communication</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          <Field label="Email" htmlFor="email" error={form.errors.email}>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={form.values.email}
              invalid={Boolean(form.errors.email)}
              onChange={(event) => form.setField('email', event.target.value)}
            />
          </Field>

          <Field label="Password" htmlFor="password" error={form.errors.password}>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={form.values.password}
              invalid={Boolean(form.errors.password)}
              onChange={(event) => form.setField('password', event.target.value)}
            />
          </Field>

          {formError && (
            <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{formError}</p>
          )}

          <Button type="submit" loading={submitting} className="mt-1 w-full">
            Sign in
          </Button>
        </form>

        <div className="mt-6 rounded-lg bg-background p-3 text-xs text-muted">
          <p className="font-medium text-body">Demo credentials</p>
          <p className="mt-1">Author: priya.sharma@email.com / password123</p>
          <p>Admin: admin@bl.com / admin123</p>
        </div>
      </div>
    </div>
  )
}
