import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ticketService } from '@/services'
import { queryKeys } from './queryKeys'
import type { CreateTicketInput, PostMessageInput } from '@/types'

export function useMyTickets() {
  return useQuery({
    queryKey: queryKeys.tickets,
    queryFn: () => ticketService.listMine(),
    refetchInterval: 15_000,
  })
}

export function useMyTicket(ticketId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.ticket(ticketId ?? ''),
    queryFn: () => ticketService.getMine(ticketId as string),
    enabled: Boolean(ticketId),
    refetchInterval: 15_000,
  })
}

export function useCreateTicket() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateTicketInput) => ticketService.create(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.tickets })
    },
  })
}

export function usePostAuthorMessage(ticketId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: PostMessageInput) => ticketService.postMessage(ticketId, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.ticket(ticketId) })
      void queryClient.invalidateQueries({ queryKey: queryKeys.tickets })
    },
  })
}
