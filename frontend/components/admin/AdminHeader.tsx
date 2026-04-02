import { auth, signOut } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { redirect } from "next/navigation"

export async function AdminHeader() {
  const session = await auth()
  const displayName = session?.user?.name ?? session?.user?.email ?? "Admin"

  return (
    <header className="flex h-16 items-center justify-between border-b border-neutral-200 bg-white px-8">
      <p className="font-mono text-xs tracking-widest text-neutral-400 uppercase">
        Welcome, {displayName}
      </p>

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
          className="font-mono text-xs"
        >
          Sign Out
        </Button>
      </form>
    </header>
  )
}