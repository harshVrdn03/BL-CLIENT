import { z } from 'zod'

export const loginSchema = z.object({
  email: z.email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export type LoginForm = z.infer<typeof loginSchema>

export const createTicketSchema = z.object({
  bookId: z.string().min(1),
  subject: z
    .string()
    .trim()
    .min(5, 'Subject must be at least 5 characters')
    .max(200, 'Subject must be 200 characters or fewer'),
  description: z
    .string()
    .trim()
    .min(20, 'Please describe your query in at least 20 characters')
    .max(4000, 'Description must be 4000 characters or fewer'),
  attachmentUrl: z
    .union([z.url('Enter a valid URL'), z.literal('')])
    .optional(),
})

export type CreateTicketForm = z.infer<typeof createTicketSchema>
