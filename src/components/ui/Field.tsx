import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react'
import { cn } from '@/lib/cn'

const fieldClasses =
  'w-full rounded-lg border w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-heading placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-tint disabled:bg-background'

interface FieldProps {
  label: string
  htmlFor: string
  error?: string
  hint?: string
  children: ReactNode
}

export function Field({ label, htmlFor, error, hint, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium text-body">
        {label}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-muted">{hint}</p>}
      {error && <p className="text-xs font-medium text-rose-600">{error}</p>}
    </div>
  )
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean
}

export function Input({ invalid, className, ...rest }: InputProps) {
  return <input {...rest} className={cn(fieldClasses, invalid && 'border-rose-400', className)} />
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean
}

export function Textarea({ invalid, className, ...rest }: TextareaProps) {
  return (
    <textarea
      {...rest}
      className={cn(fieldClasses, 'min-h-28 resize-y', invalid && 'border-rose-400', className)}
    />
  )
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  invalid?: boolean
}

export function Select({ invalid, className, children, ...rest }: SelectProps) {
  return (
    <select {...rest} className={cn(fieldClasses, invalid && 'border-rose-400', className)}>
      {children}
    </select>
  )
}
