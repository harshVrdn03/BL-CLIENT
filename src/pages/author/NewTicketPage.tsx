import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMyBooks } from '@/hooks/useBooks'
import { useCreateTicket } from '@/hooks/useTickets'
import { useForm } from '@/hooks/useForm'
import { createTicketSchema, type CreateTicketForm } from '@/schemas'
import { ApiError } from '@/lib/http/ApiError'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Field, Input, Select, Textarea } from '@/components/ui/Field'

const GENERAL_VALUE = 'general'

export function NewTicketPage() {
  const navigate = useNavigate()
  const booksQuery = useMyBooks()
  const createTicket = useCreateTicket()
  const [formError, setFormError] = useState<string | null>(null)
  const [attachmentVisible, setAttachmentVisible] = useState(false)

  const form = useForm<CreateTicketForm>(createTicketSchema, {
    bookId: GENERAL_VALUE,
    subject: '',
    description: '',
    attachmentUrl: '',
  })

  const books = booksQuery.data ?? []

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setFormError(null)
    const values = form.validate()
    if (!values) return

    try {
      const ticket = await createTicket.mutateAsync({
        bookId: values.bookId === GENERAL_VALUE ? null : values.bookId,
        subject: values.subject,
        description: values.description,
        attachmentUrl: values.attachmentUrl ? values.attachmentUrl : null,
      })
      navigate(`/author/tickets/${ticket.id}`)
    } catch (error) {
      setFormError(ApiError.from(error).message)
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-5">
        <h1 className="text-xl font-semibold text-heading">Submit a Support Query</h1>
        <p className="text-sm text-muted">
          Tell us what is going on and our team will get back to you.
        </p>
      </div>

      <Card>
        <CardHeader title="Query details" />
        <CardBody>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
            <Field
              label="Which book is this about?"
              htmlFor="bookId"
              error={form.errors.bookId}
              hint="Choose General / Account Level for royalties, payouts or account matters."
            >
              <Select
                id="bookId"
                value={form.values.bookId}
                invalid={Boolean(form.errors.bookId)}
                onChange={(event) => form.setField('bookId', event.target.value)}
              >
                <option value={GENERAL_VALUE}>General / Account Level</option>
                {books.map((book) => (
                  <option key={book.id} value={book.id}>
                    {book.title} ({book.bookId})
                  </option>
                ))}
              </Select>
            </Field>

            <Field label="Subject" htmlFor="subject" error={form.errors.subject}>
              <Input
                id="subject"
                placeholder="Brief summary of your query"
                value={form.values.subject}
                invalid={Boolean(form.errors.subject)}
                onChange={(event) => form.setField('subject', event.target.value)}
              />
            </Field>

            <Field
              label="Description"
              htmlFor="description"
              error={form.errors.description}
              hint="Include order numbers, dates, or specific figures where relevant."
            >
              <Textarea
                id="description"
                rows={6}
                placeholder="Describe your issue in detail…"
                value={form.values.description}
                invalid={Boolean(form.errors.description)}
                onChange={(event) => form.setField('description', event.target.value)}
              />
            </Field>

            {attachmentVisible ? (
              <Field
                label="Attachment link (optional)"
                htmlFor="attachmentUrl"
                error={form.errors.attachmentUrl}
                hint="Paste a link to photos or documents (e.g. Google Drive, Dropbox)."
              >
                <Input
                  id="attachmentUrl"
                  type="url"
                  placeholder="https://…"
                  value={form.values.attachmentUrl ?? ''}
                  invalid={Boolean(form.errors.attachmentUrl)}
                  onChange={(event) => form.setField('attachmentUrl', event.target.value)}
                />
              </Field>
            ) : (
              <button
                type="button"
                className="self-start text-sm font-medium text-primary hover:underline"
                onClick={() => setAttachmentVisible(true)}
              >
                + Add attachment link
              </button>
            )}

            {formError && (
              <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{formError}</p>
            )}

            <div className="flex justify-end gap-2 pt-1">
              <Button type="button" variant="secondary" onClick={() => navigate('/author/tickets')}>
                Cancel
              </Button>
              <Button type="submit" loading={createTicket.isPending}>
                Submit query
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  )
}
