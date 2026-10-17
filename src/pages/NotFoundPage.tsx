import { Link } from 'react-router-dom'
import { Card, CardBody } from '@/components/ui/Card'

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <Card className="max-w-sm">
        <CardBody className="text-center">
          <p className="text-3xl font-semibold text-heading">404</p>
          <p className="mt-1 text-sm text-muted">This page does not exist.</p>
          <Link to="/" className="mt-4 inline-block text-sm font-medium text-primary hover:underline">
            Go home
          </Link>
        </CardBody>
      </Card>
    </div>
  )
}
