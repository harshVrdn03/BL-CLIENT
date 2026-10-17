import { AuthService } from './AuthService'
import { BookService } from './BookService'
import { TicketService } from './TicketService'
import { AdminService } from './AdminService'
import { httpClient } from './http'

export const authService = new AuthService()
export const bookService = new BookService()
export const ticketService = new TicketService()
export const adminService = new AdminService()

export { httpClient }
export type { AuthService, BookService, TicketService, AdminService }
