import { BaseService } from './BaseService'
import type {
  AdminStats,
  AiDraft,
  PostMessageInput,
  Ticket,
  TicketFilters,
  TicketMessage,
  TicketSummary,
  UpdateTicketInput,
} from '@/types'

export class AdminService extends BaseService {
  listTickets(filters: TicketFilters = {}): Promise<TicketSummary[]> {
    return this.http.get<TicketSummary[]>('/admin/tickets', { params: filters })
  }

  getTicket(ticketId: string): Promise<Ticket> {
    return this.http.get<Ticket>(`/admin/tickets/${ticketId}`)
  }

  updateTicket(ticketId: string, input: UpdateTicketInput): Promise<Ticket> {
    return this.http.patch<Ticket>(`/admin/tickets/${ticketId}`, input)
  }

  assignToMe(ticketId: string): Promise<Ticket> {
    return this.http.post<Ticket>(`/admin/tickets/${ticketId}/assign`, {})
  }

  postMessage(ticketId: string, input: PostMessageInput): Promise<TicketMessage> {
    return this.http.post<TicketMessage>(`/admin/tickets/${ticketId}/messages`, input)
  }

  generateDraft(ticketId: string): Promise<AiDraft> {
    return this.http.post<AiDraft>(`/admin/tickets/${ticketId}/ai/draft`, {})
  }

  getStats(): Promise<AdminStats> {
    return this.http.get<AdminStats>('/admin/stats')
  }
}
