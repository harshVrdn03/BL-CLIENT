export type Role = 'author' | 'admin'

export const TICKET_STATUSES = ['Open', 'In Progress', 'Resolved', 'Closed'] as const
export type TicketStatus = (typeof TICKET_STATUSES)[number]

export const TICKET_CATEGORIES = [
  'Royalty & Payments',
  'ISBN & Metadata Issues',
  'Printing & Quality',
  'Distribution & Availability',
  'Book Status & Production Updates',
  'General Inquiry',
] as const
export type TicketCategory = (typeof TICKET_CATEGORIES)[number]

export const TICKET_PRIORITIES = ['Critical', 'High', 'Medium', 'Low'] as const
export type TicketPriority = (typeof TICKET_PRIORITIES)[number]

export const AI_STATUSES = ['pending', 'ok', 'failed'] as const
export type AiStatus = (typeof AI_STATUSES)[number]

export interface Author {
  authorId: string
  name: string
  email: string
  phone: string | null
  city: string | null
  joinedDate: string | null
}

export interface User {
  id: string
  email: string
  role: Role
  author: Author | null
}

export interface Book {
  id: string
  bookId: string
  title: string
  isbn: string | null
  genre: string | null
  publicationDate: string | null
  status: string
  mrp: number | null
  authorRoyaltyPerCopy: number | null
  totalCopiesSold: number
  totalRoyaltyEarned: number
  royaltyPaid: number
  royaltyPending: number
  lastRoyaltyPayoutDate: string | null
  printPartner: string | null
  availableOn: string[]
}

export interface TicketMessage {
  id: string
  ticketId: string
  senderType: 'author' | 'admin'
  senderName: string
  body: string
  isInternal: boolean
  createdAt: string
}

export interface Ticket {
  id: string
  ticketNumber: string
  authorId: string
  authorName: string
  authorEmail: string
  bookId: string | null
  bookTitle: string | null
  subject: string
  description: string
  attachmentUrl: string | null
  status: TicketStatus
  category: TicketCategory
  aiCategory: TicketCategory | null
  categoryOverridden: boolean
  priority: TicketPriority
  aiPriority: TicketPriority | null
  priorityOverridden: boolean
  aiStatus: AiStatus
  assignedTo: { id: string; name: string } | null
  createdAt: string
  updatedAt: string
  resolvedAt: string | null
  messages?: TicketMessage[]
}

export interface TicketSummary {
  id: string
  ticketNumber: string
  authorName: string
  bookTitle: string | null
  subject: string
  status: TicketStatus
  category: TicketCategory
  priority: TicketPriority
  aiStatus: AiStatus
  assignedTo: { id: string; name: string } | null
  createdAt: string
  updatedAt: string
}

export interface AdminStats {
  total: number
  open: number
  inProgress: number
  resolved: number
  closed: number
  byCategory: Record<TicketCategory, number>
  byPriority: Record<TicketPriority, number>
}

export interface TicketFilters {
  status?: TicketStatus
  category?: TicketCategory
  priority?: TicketPriority
  assignedToMe?: boolean
  from?: string
  to?: string
  q?: string
  sort?: 'oldest' | 'newest' | 'priority'
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface LoginResult {
  token: string
  user: User
}

export interface CreateTicketInput {
  bookId: string | null
  subject: string
  description: string
  attachmentUrl?: string | null
}

export interface UpdateTicketInput {
  status?: TicketStatus
  category?: TicketCategory
  priority?: TicketPriority
  assignedToUserId?: string | null
}

export interface PostMessageInput {
  body: string
  isInternal?: boolean
}

export interface AiDraft {
  draft: string
  generatedAt: string
  provider: string
  model: string
  tokensUsed: number | null
}
