// This layout wraps all public-facing pages: Home, Projects, About, References, Contact.
// It includes the shared Header and Footer that visitors always see.

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header will go here in a future step */}
      <header className="border-b px-6 py-4">
        <p className="text-sm text-muted-foreground">Header — Coming Soon</p>
      </header>

      {/* Main content area — each public page renders here */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer will go here in a future step */}
      <footer className="border-t px-6 py-4">
        <p className="text-sm text-muted-foreground">Footer — Coming Soon</p>
      </footer>
    </div>
  )
}