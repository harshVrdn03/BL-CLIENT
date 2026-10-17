import { Badge } from '@/components/ui/Badge'
import type { TicketCategory, TicketPriority, TicketStatus } from '@/types'

const statusTones: Record<TicketStatus, 'info' | 'warning' | 'success' | 'neutral'> = {
  Open: 'warning',
  'In Progress': 'info',
  Resolved: 'success',
  Closed: 'neutral',
}

const priorityTones: Record<TicketPriority, 'danger' | 'warning' | 'info' | 'neutral'> = {
  Critical: 'danger',
  High: 'warning',
  Medium: 'info',
  Low: 'neutral',
}

export function StatusBadge({ status }: { status: TicketStatus }) {
  return <Badge tone={statusTones[status]}>{status}</Badge>
}

export function PriorityBadge({ priority }: { priority: TicketPriority }) {
  return <Badge tone={priorityTones[priority]}>{priority} priority</Badge>
}

export function CategoryBadge({ category }: { category: TicketCategory }) {
  return <Badge tone="brand">{category}</Badge>
}
