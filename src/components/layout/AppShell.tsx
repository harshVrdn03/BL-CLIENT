import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useTicketStream } from '@/hooks/useTicketStream'
import { cn } from '@/lib/cn'
import { Button } from '@/components/ui/Button'
import type { Role } from '@/types'

interface NavItem {
  to: string
  label: string
  end?: boolean
}

const navByRole: Record<Role, NavItem[]> = {
  author: [
    { to: '/author', label: 'Dashboard', end: true },
    { to: '/author/books', label: 'My Books' },
    { to: '/author/tickets', label: 'My Tickets' },
    { to: '/author/tickets/new', label: 'Submit a Query' },
  ],
  admin: [
    { to: '/admin', label: 'Ticket Queue', end: true },
  ],
}

export function AppShell() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  useTicketStream()

  if (!user) return null

  const items = navByRole[user.role]

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-surface md:flex">
        <div className="flex items-center gap-2 px-5 py-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-sm font-bold text-white">
            BL
          </div>
          <div>
            <p className="text-sm font-semibold text-heading">BL</p>
            <p className="text-xs text-muted">Support Portal</p>
          </div>
        </div>
        <nav className="flex flex-1 flex-col gap-1 px-3 py-2">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  'rounded-lg px-3 py-2 text-sm font-medium transition',
                  isActive
                    ? 'bg-primary-tint text-primary'
                    : 'text-body hover:bg-primary-tint/60 hover:text-heading',
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="flex shrink-0 items-center justify-between border-b border-border bg-surface px-5 py-3">
          <div className="md:hidden text-sm font-semibold text-heading">Support Portal</div>
          <div className="ml-auto flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium text-heading">{user.author?.name ?? user.email}</p>
              <p className="text-xs capitalize text-muted">{user.role}</p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                logout()
                navigate('/login', { replace: true })
              }}
            >
              Log out
            </Button>
          </div>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto px-5 py-6">
          <div className="mx-auto max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
