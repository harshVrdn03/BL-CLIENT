import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { adminService } from '@/services'
import { queryKeys } from './queryKeys'
import type { PostMessageInput, TicketFilters, UpdateTicketInput } from '@/types'

export function useAdminTickets(filters: TicketFilters) {
  const filtersKey = JSON.stringify(filters)
  return useQuery({
    queryKey: queryKeys.adminTickets(filtersKey),
    queryFn: () => adminService.listTickets(filters),
    refetchInterval: 15_000,
  })
}

export function useAdminTicket(ticketId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.adminTicket(ticketId ?? ''),
    queryFn: () => adminService.getTicket(ticketId as string),
    enabled: Boolean(ticketId),
    refetchInterval: 15_000,
  })
}

export function useAdminStats() {
  return useQuery({
    queryKey: queryKeys.adminStats,
    queryFn: () => adminService.getStats(),
    refetchInterval: 30_000,
  })
}

function useInvalidateTicket(ticketId: string) {
  const queryClient = useQueryClient()
  return () => {
    void queryClient.invalidateQueries({ queryKey: queryKeys.adminTicket(ticketId) })
    void queryClient.invalidateQueries({ queryKey: ['admin', 'tickets'] })
    void queryClient.invalidateQueries({ queryKey: queryKeys.adminStats })
  }
}

export function useUpdateTicket(ticketId: string) {
  const invalidate = useInvalidateTicket(ticketId)
  return useMutation({
    mutationFn: (input: UpdateTicketInput) => adminService.updateTicket(ticketId, input),
    onSuccess: invalidate,
  })
}

export function useAssignToMe(ticketId: string) {
  const invalidate = useInvalidateTicket(ticketId)
  return useMutation({
    mutationFn: () => adminService.assignToMe(ticketId),
    onSuccess: invalidate,
  })
}

export function usePostAdminMessage(ticketId: string) {
  const invalidate = useInvalidateTicket(ticketId)
  return useMutation({
    mutationFn: (input: PostMessageInput) => adminService.postMessage(ticketId, input),
    onSuccess: invalidate,
  })
}

export function useGenerateDraft(ticketId: string) {
  return useMutation({
    mutationFn: () => adminService.generateDraft(ticketId),
  })
}
