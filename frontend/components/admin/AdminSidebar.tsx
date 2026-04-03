"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, User, FolderKanban, Quote, Inbox } from "lucide-react"

const navItems = [
  { href: "/admin",            label: "Dashboard",  icon: LayoutDashboard },
  { href: "/admin/profile",    label: "Profile",    icon: User },
  { href: "/admin/projects",   label: "Projects",   icon: FolderKanban },
  { href: "/admin/references", label: "References", icon: Quote },
  { href: "/admin/inbox",      label: "Inbox",      icon: Inbox },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex h-full w-60 flex-col border-r border-(--color-border) bg-(--color-surface)">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-(--color-border) px-6">
        <span className="font-mono text-sm font-medium tracking-widest uppercase text-(--color-accent)">
          CMS
        </span>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 p-3 flex-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive =
            href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(href)

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200",
                isActive
                  ? "bg-(--color-accent) text-white shadow-sm"
                  : "text-(--color-text-muted) hover:bg-(--color-accent-muted) hover:text-(--color-accent)"
              )}
            >
              <Icon size={16} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-(--color-border) px-6 py-4">
        <p className="font-mono text-[10px] tracking-widest text-(--color-text-muted) uppercase">
          Portfolio CMS
        </p>
      </div>
    </aside>
  )
}