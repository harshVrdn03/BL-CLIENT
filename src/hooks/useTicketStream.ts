import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { io } from 'socket.io-client'
import { env } from '@/lib/env'
import { tokenStorage } from '@/lib/storage/TokenStorage'

export function useTicketStream(): void {
  const queryClient = useQueryClient()

  useEffect(() => {
    const token = tokenStorage.get()
    if (!token) return

    const socket = io(env.socketBaseUrl, {
      path: '/api/socket.io',
      auth: { token },
      transports: ['websocket', 'polling'],
    })

    const invalidate = () => {
      void queryClient.invalidateQueries({ queryKey: ['tickets'] })
      void queryClient.invalidateQueries({ queryKey: ['admin'] })
    }

    socket.on('created', invalidate)
    socket.on('updated', invalidate)
    socket.on('message', invalidate)

    return () => {
      socket.off('created', invalidate)
      socket.off('updated', invalidate)
      socket.off('message', invalidate)
      socket.disconnect()
    }
  }, [queryClient])
}
