import { Spinner } from './Spinner'

export function PageLoader({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 py-20 text-muted">
      <Spinner />
      <span className="text-sm">{label}</span>
    </div>
  )
}
