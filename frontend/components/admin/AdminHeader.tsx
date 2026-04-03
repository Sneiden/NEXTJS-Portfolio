import { auth, signOut } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ThemeToggle"

export async function AdminHeader() {
  const session = await auth()
  const displayName = session?.user?.name ?? session?.user?.email ?? "Admin"

  return (
    <header className="flex h-16 items-center justify-between border-b border-(--color-border) bg-(--color-surface) px-8">
      <p className="font-mono text-xs tracking-widest text-(--color-text-muted) uppercase">
        Welcome, {displayName}
      </p>

      <div className="flex items-center gap-3">
        <ThemeToggle />
        <form
          action={async () => {
            "use server"
            await signOut({ redirectTo: "/admin/login" })
          }}
        >
          <Button
            variant="outline"
            size="sm"
            type="submit"
            className="rounded-full border-(--color-border) bg-(--color-surface)
            hover:border-(--color-accent) hover:text-(--color-accent) text-(--color-text-muted) 
            font-mono text-xs"
          >
            Sign Out
          </Button>
        </form>
      </div>
    </header>
  )
}