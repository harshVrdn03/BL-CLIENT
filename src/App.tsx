import { Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from '@/routes/ProtectedRoute'
import { HomeRedirect } from '@/routes/HomeRedirect'
import { AppShell } from '@/components/layout/AppShell'
import { LoginPage } from '@/pages/LoginPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { AuthorDashboard } from '@/pages/author/AuthorDashboard'
import { MyBooksPage } from '@/pages/author/MyBooksPage'
import { NewTicketPage } from '@/pages/author/NewTicketPage'
import { MyTicketsPage } from '@/pages/author/MyTicketsPage'
import { AuthorTicketDetailPage } from '@/pages/author/AuthorTicketDetailPage'
import { AdminQueuePage } from '@/pages/admin/AdminQueuePage'
import { AdminTicketDetailPage } from '@/pages/admin/AdminTicketDetailPage'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<HomeRedirect />} />

      <Route element={<ProtectedRoute allow={['author']} />}>
        <Route element={<AppShell />}>
          <Route path="/author" element={<AuthorDashboard />} />
          <Route path="/author/books" element={<MyBooksPage />} />
          <Route path="/author/tickets" element={<MyTicketsPage />} />
          <Route path="/author/tickets/new" element={<NewTicketPage />} />
          <Route path="/author/tickets/:ticketId" element={<AuthorTicketDetailPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allow={['admin']} />}>
        <Route element={<AppShell />}>
          <Route path="/admin" element={<AdminQueuePage />} />
          <Route path="/admin/tickets/:ticketId" element={<AdminTicketDetailPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
