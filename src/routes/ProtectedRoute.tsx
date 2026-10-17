import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { PageLoader } from '@/components/ui/PageLoader'
import type { Role } from '@/types'

export function ProtectedRoute({ allow }: { allow?: Role[] }) {
  const { status, user } = useAuth()
  const location = useLocation()

  if (status === 'loading') return <PageLoader label="Checking your session…" />
  if (status === 'unauthenticated' || !user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  if (allow && !allow.includes(user.role)) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/author'} replace />
  }

  return <Outlet />
}
