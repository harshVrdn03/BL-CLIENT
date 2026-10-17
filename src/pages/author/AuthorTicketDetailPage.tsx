import { useState, type FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useMyTicket, usePostAuthorMessage } from '@/hooks/useTickets'
import { ApiError } from '@/lib/http/ApiError'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { PageLoader } from '@/components/ui/PageLoader'
import { Textarea } from '@/components/ui/Field'
import { CategoryBadge, StatusBadge } from '@/components/tickets/TicketBadges'
import { formatDateTime } from '@/lib/format'
import type { TicketMessage } from '@/types'

function MessageBubble({ message }: { message: TicketMessage }) {
  const isAuthor = message.senderType === 'author'
  return (
    <div className={isAuthor ? 'flex justify-end' : 'flex justify-start'}>
      <div
        className={
          isAuthor
            ? 'max-w-[80%] rounded-2xl rounded-br-sm bg-primary px-4 py-2.5 text-sm text-white shadow-float'
            : 'max-w-[80%] rounded-2xl rounded-bl-sm bg-primary-tint px-4 py-2.5 text-sm text-heading'
        }
      >
        <p className="mb-1 text-xs font-medium opacity-80">
          {isAuthor ? 'You' : message.senderName}
        </p>
        <p className="whitespace-pre-wrap">{message.body}</p>
        <p className="mt-1 text-right text-[11px] opacity-70">{formatDateTime(message.createdAt)}</p>
      </div>
    </div>
  )
}

export function AuthorTicketDetailPage() {
  const { ticketId } = useParams<{ ticketId: string }>()
  const ticketQuery = useMyTicket(ticketId)
  const postMessage = usePostAuthorMessage(ticketId ?? '')
  const [reply, setReply] = useState('')
  const [replyError, setReplyError] = useState<string | null>(null)

  if (ticketQuery.isLoading) return <PageLoader />
  if (ticketQuery.isError || !ticketQuery.data) {
    return (
      <Card>
        <CardBody>
          <p className="text-sm text-body">This ticket could not be found.</p>
          <Link to="/author/tickets" className="mt-3 inline-block text-sm text-primary hover:underline">
            Back to My Tickets
          </Link>
        </CardBody>
      </Card>
    )
  }

  const ticket = ticketQuery.data
  const messages = ticket.messages ?? []

  async function handleReply(event: FormEvent) {
    event.preventDefault()
    setReplyError(null)
    if (reply.trim().length === 0) {
      setReplyError('Message cannot be empty')
      return
    }
    try {
      await postMessage.mutateAsync({ body: reply.trim() })
      setReply('')
    } catch (error) {
      setReplyError(ApiError.from(error).message)
    }
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-5">
      <Link to="/author/tickets" className="text-sm text-muted hover:text-body">
        ← Back to My Tickets
      </Link>

      <Card>
        <CardHeader
          title={ticket.subject}
          subtitle={`${ticket.ticketNumber} · ${ticket.bookTitle ?? 'General / Account Level'}`}
          action={<StatusBadge status={ticket.status} />}
        />
        <CardBody className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <CategoryBadge category={ticket.category} />
            {ticket.attachmentUrl && (
              <a
                href={ticket.attachmentUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-medium text-primary hover:underline"
              >
                View attachment
              </a>
            )}
          </div>
          <p className="whitespace-pre-wrap text-sm text-body">{ticket.description}</p>
          <p className="text-xs text-muted">Raised {formatDateTime(ticket.createdAt)}</p>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Conversation" subtitle="Our team's replies appear here automatically" />
        <CardBody className="flex flex-col gap-3">
          {messages.length === 0 ? (
            <p className="text-sm text-muted">
              No replies yet. Our support team typically responds within 48 hours.
            </p>
          ) : (
            messages.map((message) => <MessageBubble key={message.id} message={message} />)
          )}
        </CardBody>
      </Card>

      {ticket.status !== 'Closed' && (
        <Card>
          <CardHeader title="Add a reply" />
          <CardBody>
            <form onSubmit={handleReply} className="flex flex-col gap-3">
              <Textarea
                rows={3}
                placeholder="Add more details or reply to the team…"
                value={reply}
                invalid={Boolean(replyError)}
                onChange={(event) => setReply(event.target.value)}
              />
              {replyError && <p className="text-xs font-medium text-rose-600">{replyError}</p>}
              <div className="flex justify-end">
                <Button type="submit" loading={postMessage.isPending}>
                  Send reply
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      )}
    </div>
  )
}
