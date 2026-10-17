export const queryKeys = {
  books: ['books'] as const,
  tickets: ['tickets'] as const,
  ticket: (ticketId: string) => ['tickets', ticketId] as const,
  adminTickets: (filtersKey: string) => ['admin', 'tickets', filtersKey] as const,
  adminTicket: (ticketId: string) => ['admin', 'ticket', ticketId] as const,
  adminStats: ['admin', 'stats'] as const,
}
