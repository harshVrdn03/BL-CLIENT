import { Link } from 'react-router-dom'
import { useMyTickets } from '@/hooks/useTickets'
import { Card, CardBody } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { PageLoader } from '@/components/ui/PageLoader'
import { EmptyState } from '@/components/ui/EmptyState'
import { CategoryBadge, StatusBadge } from '@/components/tickets/TicketBadges'
import { formatDate } from '@/lib/format'

export function MyTicketsPage() {
  const ticketsQuery = useMyTickets()

  if (ticketsQuery.isLoading) return <PageLoader />

  const tickets = ticketsQuery.data ?? []

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-heading">My Tickets</h1>
          <p className="text-sm text-muted">Track the status of your support queries.</p>
        </div>
        <Link to="/author/tickets/new">
          <Button>Submit a query</Button>
        </Link>
      </div>

      {tickets.length === 0 ? (
        <EmptyState
          title="No tickets yet"
          description="When you submit a query, it will show up here with the admin team's replies."
          action={
            <Link to="/author/tickets/new">
              <Button size="sm">Submit a query</Button>
            </Link>
          }
        />
      ) : (
        <Card className="overflow-hidden">
          <CardBody className="p-0">
            <ul className="divide-y divide-border/60">
              {tickets.map((ticket) => (
                <li key={ticket.id}>
                  <Link
                    to={`/author/tickets/${ticket.id}`}
                    className="flex flex-col gap-2 px-5 py-4 hover:bg-background sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-heading">{ticket.subject}</p>
                      <p className="mt-0.5 text-xs text-muted">
                        {ticket.ticketNumber} · {ticket.bookTitle ?? 'General / Account Level'} ·{' '}
                        {formatDate(ticket.createdAt)}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <CategoryBadge category={ticket.category} />
                      <StatusBadge status={ticket.status} />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      )}
    </div>
  )
}
