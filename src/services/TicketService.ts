import { BaseService } from './BaseService'
import type { CreateTicketInput, PostMessageInput, Ticket, TicketMessage } from '@/types'

export class TicketService extends BaseService {
  listMine(): Promise<Ticket[]> {
    return this.http.get<Ticket[]>('/tickets')
  }

  getMine(ticketId: string): Promise<Ticket> {
    return this.http.get<Ticket>(`/tickets/${ticketId}`)
  }

  create(input: CreateTicketInput): Promise<Ticket> {
    return this.http.post<Ticket>('/tickets', input)
  }

  postMessage(ticketId: string, input: PostMessageInput): Promise<TicketMessage> {
    return this.http.post<TicketMessage>(`/tickets/${ticketId}/messages`, input)
  }
}
