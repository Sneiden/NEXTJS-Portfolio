"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  User,
  FolderKanban,
  Quote,
  Inbox,
} from "lucide-react"

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
    <aside className="flex h-full w-60 flex-col border-r border-neutral-200 bg-white">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-neutral-200 px-6">
        <span className="font-mono text-sm font-medium tracking-widest uppercase text-neutral-900">
          CMS
        </span>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 p-3 flex-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          // exact match for dashboard, prefix match for everything else
          const isActive =
            href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(href)

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-neutral-900 text-white"
                  : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
              )}
            >
              <Icon size={16} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-neutral-200 px-6 py-4">
        <p className="font-mono text-[10px] tracking-widest text-neutral-400 uppercase">
          Portfolio CMS
        </p>
      </div>
    </aside>
  )
}