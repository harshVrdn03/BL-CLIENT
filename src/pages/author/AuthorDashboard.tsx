import { Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useMyBooks } from '@/hooks/useBooks'
import { useMyTickets } from '@/hooks/useTickets'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { PageLoader } from '@/components/ui/PageLoader'
import { EmptyState } from '@/components/ui/EmptyState'
import { StatusBadge } from '@/components/tickets/TicketBadges'
import { formatCurrency, formatDate, formatNumber } from '@/lib/format'

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardBody>
        <p className="text-xs font-medium uppercase tracking-wide text-muted">{label}</p>
        <p className="mt-1 text-2xl font-semibold text-heading">{value}</p>
      </CardBody>
    </Card>
  )
}

export function AuthorDashboard() {
  const { user } = useAuth()
  const booksQuery = useMyBooks()
  const ticketsQuery = useMyTickets()

  if (booksQuery.isLoading || ticketsQuery.isLoading) return <PageLoader />

  const books = booksQuery.data ?? []
  const tickets = ticketsQuery.data ?? []

  const totals = books.reduce(
    (acc, book) => ({
      earned: acc.earned + book.totalRoyaltyEarned,
      paid: acc.paid + book.royaltyPaid,
      pending: acc.pending + book.royaltyPending,
      sold: acc.sold + book.totalCopiesSold,
    }),
    { earned: 0, paid: 0, pending: 0, sold: 0 },
  )

  const recentTickets = tickets.slice(0, 5)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-heading">
            Welcome back, {user?.author?.name?.split(' ')[0] ?? 'Author'}
          </h1>
          <p className="text-sm text-muted">Here is a snapshot of your publishing account.</p>
        </div>
        <Link to="/author/tickets/new">
          <Button>Submit a query</Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Royalty earned" value={formatCurrency(totals.earned)} />
        <StatCard label="Royalty paid" value={formatCurrency(totals.paid)} />
        <StatCard label="Royalty pending" value={formatCurrency(totals.pending)} />
        <StatCard label="Copies sold" value={formatNumber(totals.sold)} />
      </div>

      <Card>
        <CardHeader
          title="Recent tickets"
          subtitle="Your latest support conversations"
          action={
            <Link to="/author/tickets" className="text-sm font-medium text-primary hover:underline">
              View all
            </Link>
          }
        />
        <CardBody className="p-0">
          {recentTickets.length === 0 ? (
            <div className="p-5">
              <EmptyState
                title="No tickets yet"
                description="Raise a query about royalties, ISBN, printing, or anything else."
                action={
                  <Link to="/author/tickets/new">
                    <Button size="sm">Submit a query</Button>
                  </Link>
                }
              />
            </div>
          ) : (
            <ul className="divide-y divide-border/60">
              {recentTickets.map((ticket) => (
                <li key={ticket.id}>
                  <Link
                    to={`/author/tickets/${ticket.id}`}
                    className="flex items-center justify-between gap-4 px-5 py-3 hover:bg-background"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-heading">{ticket.subject}</p>
                      <p className="text-xs text-muted">
                        {ticket.ticketNumber} · {ticket.bookTitle ?? 'General / Account Level'} ·{' '}
                        {formatDate(ticket.createdAt)}
                      </p>
                    </div>
                    <StatusBadge status={ticket.status} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </CardBody>
      </Card>
    </div>
  )
}
