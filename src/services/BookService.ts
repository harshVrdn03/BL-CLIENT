import { BaseService } from './BaseService'
import type { Book } from '@/types'

export class BookService extends BaseService {
  listMine(): Promise<Book[]> {
    return this.http.get<Book[]>('/books')
  }
}
