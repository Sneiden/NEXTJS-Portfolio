import { auth } from "@/lib/auth"
import { logoutAction } from "@/app/actions/auth"
import { ThemeToggle } from "@/components/ThemeToggle"
import { AppButton } from "../ui/wrappers/AppButton"
import { SignOutIcon, UserIcon } from "@phosphor-icons/react/dist/ssr"

export async function AdminHeader() {
  const session = await auth()
  const displayName = session?.user?.name ?? session?.user?.email?.split('@')[0] ?? "Admin"

  return (
    <header className="flex h-16 items-center justify-between border-b border-(--color-border) bg-(--color-surface)/80 px-8 backdrop-blur-md">
      <div className="flex items-center gap-2">
        <div className="flex size-8 items-center justify-center rounded-full bg-secondary/50 text-(--color-text-muted)">
          <UserIcon size={16} weight="duotone" />
        </div>
        <p className="font-mono text-[11px] tracking-wider text-(--color-text-muted) uppercase">
          Session: <span className="text-(--color-text-primary) font-bold">{displayName}</span>
        </p>
      </div>

      <div className="flex items-center gap-4">
        <ThemeToggle />
        
        <div className="h-4 w-px bg-(--color-border)" />

        <form action={logoutAction}>
          <AppButton
            variant="remove-custom"
            type="submit"
            className="flex items-center gap-2 px-2 font-mono text-[10px] uppercase tracking-widest hover:text-destructive transition-colors"
          >
            <SignOutIcon size={16} weight="duotone" />
            <span>Sign Out</span>
          </AppButton>
        </form>
      </div>
    </header>
  )
}