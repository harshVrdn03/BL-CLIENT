import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdminStats, useAdminTickets } from '@/hooks/useAdmin'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { PageLoader } from '@/components/ui/PageLoader'
import { Select, Input } from '@/components/ui/Field'
import { PriorityBadge, StatusBadge } from '@/components/tickets/TicketBadges'
import { formatDate } from '@/lib/format'
import {
  TICKET_CATEGORIES,
  TICKET_PRIORITIES,
  TICKET_STATUSES,
  type TicketFilters,
} from '@/types'

function StatTile({ label, value, tone }: { label: string; value: number; tone?: string }) {
  return (
    <Card>
      <CardBody>
        <p className="text-xs font-medium uppercase tracking-wide text-muted">{label}</p>
        <p className={`mt-1 text-2xl font-semibold ${tone ?? 'text-heading'}`}>{value}</p>
      </CardBody>
    </Card>
  )
}

export function AdminQueuePage() {
  const navigate = useNavigate()
  const [filters, setFilters] = useState<TicketFilters>({ sort: 'priority' })
  const ticketsQuery = useAdminTickets(filters)
  const statsQuery = useAdminStats()

  const tickets = ticketsQuery.data ?? []
  const stats = statsQuery.data

  const setFilter = useMemo(
    () => (key: keyof TicketFilters, value: string) =>
      setFilters((prev) => ({ ...prev, [key]: value === 'all' || value === '' ? undefined : value })),
    [],
  )

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-heading">Ticket Queue</h1>
        <p className="text-sm text-muted">Triage and respond to author support queries.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <StatTile label="Total" value={stats?.total ?? 0} />
        <StatTile label="Open" value={stats?.open ?? 0} tone="text-amber-600" />
        <StatTile label="In progress" value={stats?.inProgress ?? 0} tone="text-sky-600" />
        <StatTile label="Resolved" value={stats?.resolved ?? 0} tone="text-emerald-600" />
        <StatTile label="Critical" value={stats?.byPriority?.Critical ?? 0} tone="text-rose-600" />
      </div>

      <Card>
        <CardHeader title="Filters" />
        <CardBody className="grid grid-cols-2 gap-3 md:grid-cols-5">
          <Input
            placeholder="Search subject or author…"
            value={filters.q ?? ''}
            onChange={(event) => setFilter('q', event.target.value)}
          />
          <Select value={filters.status ?? 'all'} onChange={(e) => setFilter('status', e.target.value)}>
            <option value="all">All statuses</option>
            {TICKET_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </Select>
          <Select
            value={filters.category ?? 'all'}
            onChange={(e) => setFilter('category', e.target.value)}
          >
            <option value="all">All categories</option>
            {TICKET_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </Select>
          <Select
            value={filters.priority ?? 'all'}
            onChange={(e) => setFilter('priority', e.target.value)}
          >
            <option value="all">All priorities</option>
            {TICKET_PRIORITIES.map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </Select>
          <Select
            value={filters.sort ?? 'priority'}
            onChange={(e) => setFilter('sort', e.target.value)}
          >
            <option value="priority">Sort: Priority</option>
            <option value="oldest">Sort: Oldest first</option>
            <option value="newest">Sort: Newest first</option>
          </Select>
        </CardBody>
      </Card>

      {ticketsQuery.isLoading ? (
        <PageLoader />
      ) : ticketsQuery.isError ? (
        <EmptyState
          title="Could not load tickets"
          description="The queue failed to load. Check that the API is running, then refresh the page."
        />
      ) : tickets.length === 0 ? (
        <EmptyState title="No tickets match" description="Try clearing some filters." />
      ) : (
        <Card className="overflow-hidden">
          <CardBody className="overflow-x-auto p-0">
            <table className="min-w-full divide-y divide-border/60 text-sm">
              <thead className="bg-background text-left text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-5 py-3 font-medium">Ticket</th>
                  <th className="px-5 py-3 font-medium">Author</th>
                  <th className="px-5 py-3 font-medium">Category</th>
                  <th className="px-5 py-3 font-medium">Priority</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Assigned</th>
                  <th className="px-5 py-3 font-medium">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {tickets.map((ticket) => (
                  <tr
                    key={ticket.id}
                    className="hover:bg-primary-tint/40 cursor-pointer"
                    onClick={() => navigate(`/admin/tickets/${ticket.id}`)}
                  >
                    <td className="px-5 py-3">
                      <div className="block max-w-xs">
                        <span className="font-medium text-heading">
                          {ticket.subject}
                        </span>
                        <span className="block text-xs text-muted">
                          {ticket.ticketNumber}
                          {ticket.bookTitle ? ` · ${ticket.bookTitle}` : ''}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-body">{ticket.authorName}</td>
                    <td className="px-5 py-3 text-body">{ticket.category}</td>
                    <td className="px-5 py-3">
                      <PriorityBadge priority={ticket.priority} />
                    </td>
                    <td className="px-5 py-3">
                      <StatusBadge status={ticket.status} />
                    </td>
                    <td className="px-5 py-3 text-body">
                      {ticket.assignedTo?.name ?? 'Unassigned'}
                    </td>
                    <td className="px-5 py-3 text-muted">{formatDate(ticket.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardBody>
        </Card>
      )}
    </div>
  )
}
