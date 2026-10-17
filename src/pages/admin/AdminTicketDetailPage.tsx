import { useState, type FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  useAdminTicket,
  useAssignToMe,
  useGenerateDraft,
  usePostAdminMessage,
  useUpdateTicket,
} from '@/hooks/useAdmin'
import { useAuth } from '@/hooks/useAuth'
import { ApiError } from '@/lib/http/ApiError'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { PageLoader } from '@/components/ui/PageLoader'
import { Field, Select, Textarea } from '@/components/ui/Field'
import { CategoryBadge, PriorityBadge, StatusBadge } from '@/components/tickets/TicketBadges'
import { formatDateTime } from '@/lib/format'
import {
  TICKET_CATEGORIES,
  TICKET_PRIORITIES,
  TICKET_STATUSES,
  type TicketCategory,
  type TicketMessage,
  type TicketPriority,
  type TicketStatus,
} from '@/types'

function AiStatusNote({ status }: { status: 'pending' | 'ok' | 'failed' }) {
  if (status === 'pending') return <Badge tone="info">Classifying…</Badge>
  if (status === 'failed') return <Badge tone="danger">Classification failed — update manually</Badge>
  return <Badge tone="success">Classified</Badge>
}

function MessageItem({ message }: { message: TicketMessage }) {
  const isAdmin = message.senderType === 'admin'
  if (message.isInternal) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm">
        <p className="mb-1 text-xs font-semibold text-amber-700">
          Internal note · {message.senderName}
        </p>
        <p className="whitespace-pre-wrap text-amber-900">{message.body}</p>
        <p className="mt-1 text-right text-[11px] text-amber-600">
          {formatDateTime(message.createdAt)}
        </p>
      </div>
    )
  }
  return (
    <div className={isAdmin ? 'flex justify-end' : 'flex justify-start'}>
      <div
        className={
          isAdmin
            ? 'max-w-[80%] rounded-2xl rounded-br-sm bg-primary px-4 py-2.5 text-sm text-white shadow-float'
            : 'max-w-[80%] rounded-2xl rounded-bl-sm bg-primary-tint px-4 py-2.5 text-sm text-heading'
        }
      >
        <p className="mb-1 text-xs font-medium opacity-80">
          {isAdmin ? `You (${message.senderName})` : message.senderName}
        </p>
        <p className="whitespace-pre-wrap">{message.body}</p>
        <p className="mt-1 text-right text-[11px] opacity-70">{formatDateTime(message.createdAt)}</p>
      </div>
    </div>
  )
}

export function AdminTicketDetailPage() {
  const { ticketId = '' } = useParams<{ ticketId: string }>()
  const { user } = useAuth()
  const ticketQuery = useAdminTicket(ticketId)
  const updateTicket = useUpdateTicket(ticketId)
  const assignToMe = useAssignToMe(ticketId)
  const postMessage = usePostAdminMessage(ticketId)
  const generateDraft = useGenerateDraft(ticketId)

  const [reply, setReply] = useState('')
  const [isInternal, setIsInternal] = useState(false)
  const [composerError, setComposerError] = useState<string | null>(null)
  const [draftError, setDraftError] = useState<string | null>(null)
  const [triageError, setTriageError] = useState<string | null>(null)

  async function handleTriageUpdate(patch: {
    status?: TicketStatus
    category?: TicketCategory
    priority?: TicketPriority
  }) {
    setTriageError(null)
    try {
      await updateTicket.mutateAsync(patch)
    } catch (error) {
      setTriageError(ApiError.from(error).message)
    }
  }

  if (ticketQuery.isLoading) return <PageLoader />
  if (ticketQuery.isError || !ticketQuery.data) {
    return (
      <Card>
        <CardBody>
          <p className="text-sm text-body">This ticket could not be found.</p>
          <Link to="/admin" className="mt-3 inline-block text-sm text-primary hover:underline">
            Back to queue
          </Link>
        </CardBody>
      </Card>
    )
  }

  const ticket = ticketQuery.data
  const messages = ticket.messages ?? []
  const isMine = ticket.assignedTo?.id === user?.id

  async function handleGenerateDraft() {
    setDraftError(null)
    try {
      const result = await generateDraft.mutateAsync()
      setReply(result.draft)
      setIsInternal(false)
    } catch (error) {
      setDraftError(ApiError.from(error).message)
    }
  }

  async function handleSend(event: FormEvent) {
    event.preventDefault()
    setComposerError(null)
    if (reply.trim().length === 0) {
      setComposerError('Message cannot be empty')
      return
    }
    try {
      await postMessage.mutateAsync({ body: reply.trim(), isInternal })
      setReply('')
      setIsInternal(false)
    } catch (error) {
      setComposerError(ApiError.from(error).message)
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <Link to="/admin" className="text-sm text-muted hover:text-body">
        ← Back to queue
      </Link>

      <Card>
        <CardHeader
          title={ticket.subject}
          subtitle={`${ticket.ticketNumber} · ${ticket.authorName} (${ticket.authorEmail}) · ${
            ticket.bookTitle ?? 'General / Account Level'
          }`}
          action={<StatusBadge status={ticket.status} />}
        />
        <CardBody className="flex flex-wrap items-center gap-2">
          <CategoryBadge category={ticket.category} />
          <PriorityBadge priority={ticket.priority} />
          <AiStatusNote status={ticket.aiStatus} />
          {ticket.assignedTo ? (
            <Badge tone="neutral">Assigned to {ticket.assignedTo.name}</Badge>
          ) : (
            <Badge tone="warning">Unassigned</Badge>
          )}
        </CardBody>
      </Card>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="flex flex-col gap-5 lg:col-span-2">
          <Card>
            <CardHeader title="Original query" />
            <CardBody className="flex flex-col gap-2">
              <p className="whitespace-pre-wrap text-sm text-body">{ticket.description}</p>
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
              <p className="text-xs text-muted">Raised {formatDateTime(ticket.createdAt)}</p>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Conversation" subtitle="Author replies and your responses" />
            <CardBody className="flex flex-col gap-3">
              {messages.length === 0 ? (
                <p className="text-sm text-muted">No messages yet.</p>
              ) : (
                messages.map((message) => <MessageItem key={message.id} message={message} />)
              )}
            </CardBody>
          </Card>

          <Card>
            <CardHeader
              title="Compose"
              action={
                <label className="flex items-center gap-2 text-xs font-medium text-body">
                  <input
                    type="checkbox"
                    checked={isInternal}
                    onChange={(event) => setIsInternal(event.target.checked)}
                  />
                  Internal note
                </label>
              }
            />
            <CardBody>
              <form onSubmit={handleSend} className="flex flex-col gap-3">
                <Textarea
                  rows={5}
                  placeholder={isInternal ? 'Write a note for the team (hidden from author)…' : 'Write a reply to the author…'}
                  value={reply}
                  invalid={Boolean(composerError)}
                  onChange={(event) => setReply(event.target.value)}
                />
                {composerError && (
                  <p className="text-xs font-medium text-rose-600">{composerError}</p>
                )}
                <div className="flex justify-end gap-2">
                  <Button type="submit" loading={postMessage.isPending} disabled={reply.trim().length === 0}>
                    {isInternal ? 'Save note' : 'Send reply'}
                  </Button>
                </div>
              </form>
            </CardBody>
          </Card>
        </div>

        <div className="flex flex-col gap-5">
          <Card>
            <CardHeader title="AI assistant" subtitle="Draft a response from the query + knowledge base" />
            <CardBody className="flex flex-col gap-3">
              <Button variant="secondary" onClick={handleGenerateDraft} loading={generateDraft.isPending}>
                Generate draft
              </Button>
              {draftError && <p className="text-xs font-medium text-rose-600">{draftError}</p>}
              <p className="text-xs text-muted">
                The draft fills the composer so you can edit before sending.
              </p>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Triage" subtitle="Override AI suggestions where needed" />
            <CardBody className="flex flex-col gap-4">
              <Field label="Status" htmlFor="status">
                <Select
                  id="status"
                  value={ticket.status}
                  disabled={updateTicket.isPending}
                  onChange={(event) =>
                    void handleTriageUpdate({ status: event.target.value as TicketStatus })
                  }
                >
                  {TICKET_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </Select>
              </Field>

              <Field
                label="Category"
                htmlFor="category"
                hint={
                  ticket.aiCategory && ticket.category !== ticket.aiCategory
                    ? `Overridden (AI: ${ticket.aiCategory})`
                    : ticket.aiCategory
                      ? `AI suggestion: ${ticket.aiCategory}`
                      : undefined
                }
              >
                <Select
                  id="category"
                  value={ticket.category}
                  disabled={updateTicket.isPending}
                  onChange={(event) =>
                    void handleTriageUpdate({ category: event.target.value as TicketCategory })
                  }
                >
                  {TICKET_CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </Select>
              </Field>

              <Field
                label="Priority"
                htmlFor="priority"
                hint={
                  ticket.aiPriority && ticket.priority !== ticket.aiPriority
                    ? `Overridden (AI: ${ticket.aiPriority})`
                    : ticket.aiPriority
                      ? `AI suggestion: ${ticket.aiPriority}`
                      : undefined
                }
              >
                <Select
                  id="priority"
                  value={ticket.priority}
                  disabled={updateTicket.isPending}
                  onChange={(event) =>
                    void handleTriageUpdate({ priority: event.target.value as TicketPriority })
                  }
                >
                  {TICKET_PRIORITIES.map((priority) => (
                    <option key={priority} value={priority}>
                      {priority}
                    </option>
                  ))}
                </Select>
              </Field>

              {triageError && <p className="text-xs font-medium text-rose-600">{triageError}</p>}

              <Button
                variant="secondary"
                disabled={isMine}
                loading={assignToMe.isPending}
                onClick={() => {
                  setTriageError(null)
                  assignToMe.mutate(undefined, {
                    onError: (error) => setTriageError(ApiError.from(error).message),
                  })
                }}
              >
                {isMine ? 'Assigned to you' : 'Assign to me'}
              </Button>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  )
}
