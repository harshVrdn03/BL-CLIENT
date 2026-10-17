import { Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { PageLoader } from '@/components/ui/PageLoader'

export function HomeRedirect() {
  const { status, user } = useAuth()

  if (status === 'loading') return <PageLoader />
  if (status === 'unauthenticated' || !user) return <Navigate to="/login" replace />
  return <Navigate to={user.role === 'admin' ? '/admin' : '/author'} replace />
}
