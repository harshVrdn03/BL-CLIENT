import { useMyBooks } from '@/hooks/useBooks'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { PageLoader } from '@/components/ui/PageLoader'
import { EmptyState } from '@/components/ui/EmptyState'
import { Badge } from '@/components/ui/Badge'
import { formatCurrency, formatDate, formatNumber } from '@/lib/format'
import type { Book } from '@/types'

function BookCard({ book }: { book: Book }) {
  const inProduction = book.publicationDate === null
  return (
    <Card>
      <CardHeader
        title={book.title}
        subtitle={`${book.bookId} · ${book.genre ?? 'Genre pending'}`}
        action={
          <Badge tone={inProduction ? 'warning' : 'success'}>{book.status}</Badge>
        }
      />
      <CardBody className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:grid-cols-3">
          <Detail label="ISBN" value={book.isbn ?? 'Not assigned'} />
          <Detail label="Published" value={formatDate(book.publicationDate)} />
          <Detail label="MRP" value={formatCurrency(book.mrp)} />
          <Detail label="Copies sold" value={formatNumber(book.totalCopiesSold)} />
          <Detail label="Print partner" value={book.printPartner ?? '—'} />
          <Detail
            label="Available on"
            value={book.availableOn.length > 0 ? book.availableOn.join(', ') : 'Not listed yet'}
          />
        </div>

        <div className="grid grid-cols-3 gap-3 rounded-lg bg-background p-3">
          <Royalty label="Earned" value={book.totalRoyaltyEarned} tone="text-heading" />
          <Royalty label="Paid" value={book.royaltyPaid} tone="text-emerald-700" />
          <Royalty label="Pending" value={book.royaltyPending} tone="text-amber-700" />
        </div>

        {book.lastRoyaltyPayoutDate && (
          <p className="text-xs text-muted">
            Last payout on {formatDate(book.lastRoyaltyPayoutDate)}
          </p>
        )}
      </CardBody>
    </Card>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-muted">{label}</p>
      <p className="text-heading">{value}</p>
    </div>
  )
}

function Royalty({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-muted">{label}</p>
      <p className={`text-sm font-semibold ${tone}`}>{formatCurrency(value)}</p>
    </div>
  )
}

export function MyBooksPage() {
  const booksQuery = useMyBooks()

  if (booksQuery.isLoading) return <PageLoader />

  const books = booksQuery.data ?? []

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-semibold text-heading">My Books</h1>
        <p className="text-sm text-muted">
          {books.length} {books.length === 1 ? 'title' : 'titles'} in your catalog
        </p>
      </div>

      {books.length === 0 ? (
        <EmptyState title="No books yet" description="Your published titles will appear here." />
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </div>
  )
}
