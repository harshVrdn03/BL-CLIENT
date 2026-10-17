import { useQuery } from '@tanstack/react-query'
import { bookService } from '@/services'
import { queryKeys } from './queryKeys'

export function useMyBooks() {
  return useQuery({
    queryKey: queryKeys.books,
    queryFn: () => bookService.listMine(),
  })
}
