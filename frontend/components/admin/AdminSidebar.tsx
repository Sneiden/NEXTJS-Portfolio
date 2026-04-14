"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  SquaresFourIcon, 
  UserCircleIcon, 
  FolderNotchIcon, 
  QuotesIcon, 
  TrayIcon,
  TerminalWindowIcon 
} from "@phosphor-icons/react"

const navItems = [
  { href: "/admin",            label: "Dashboard",  icon: SquaresFourIcon },
  { href: "/admin/profile",    label: "Profile",    icon: UserCircleIcon },
  { href: "/admin/projects",   label: "Projects",   icon: FolderNotchIcon },
  { href: "/admin/references", label: "References", icon: QuotesIcon },
  { href: "/admin/inbox",      label: "Inbox",      icon: TrayIcon },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex h-full w-64 flex-col border-r border-(--color-border) bg-(--color-surface)">
      {/* Logo Section */}
      <div className="flex h-16 items-center gap-3 border-b border-(--color-border) px-6">
        <div className="flex size-8 items-center justify-center rounded-lg bg-(--color-accent) text-white shadow-lg shadow-accent/20">
          <TerminalWindowIcon size={20} weight="duotone" />
        </div>
        <span className="font-mono text-xs font-bold tracking-widest uppercase text-(--color-text-primary)">
          Admin <span className="text-(--color-accent)">CMS</span>
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-1.5 p-4 overflow-y-auto">
        <p className="px-3 pb-2 font-mono text-[10px] font-semibold tracking-widest text-(--color-text-muted) uppercase">
          Menu
        </p>
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = href === "/admin" 
            ? pathname === "/admin" 
            : pathname.startsWith(href)

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ease-in-out",
                isActive
                  ? "bg-(--color-accent) text-white shadow-md shadow-accent/10 translate-x-1"
                  : "text-(--color-text-muted) hover:bg-(--color-accent-muted)/10 hover:text-(--color-accent) hover:translate-x-1"
              )}
            >
              <Icon 
                size={20} 
                weight={isActive ? "fill" : "duotone"} 
                className={cn(
                  "transition-colors",
                  isActive ? "text-white" : "text-(--color-text-muted) group-hover:text-(--color-accent)"
                )}
              />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Footer / System Status */}
      <div className="border-t border-(--color-border) p-4">
        <div className="flex items-center gap-3 rounded-xl bg-secondary/30 p-3">
          <div className="size-2 animate-pulse rounded-full bg-emerald-500" />
          <p className="font-mono text-[10px] tracking-tight text-(--color-text-muted) uppercase">
            System Online v1.0.4
          </p>
        </div>
      </div>
    </aside>
  )
}