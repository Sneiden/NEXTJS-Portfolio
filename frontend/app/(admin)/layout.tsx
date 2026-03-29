// This layout wraps all admin CMS pages: Dashboard, Projects, Posts, References, Inbox.
// It is separate from the public layout — admins see a sidebar instead of a header/footer.
// Route protection is handled by middleware.ts — no need to check auth here.

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar will go here in a future step */}
      <aside className="w-64 border-r px-4 py-6">
        <p className="text-sm text-muted-foreground">Sidebar — Coming Soon</p>
      </aside>

      {/* Main content area — each admin page renders here */}
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  )
}