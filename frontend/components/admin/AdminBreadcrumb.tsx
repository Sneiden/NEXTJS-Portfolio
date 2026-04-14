"use client"

import { usePathname } from "next/navigation"
import { CaretRightIcon } from "@phosphor-icons/react"

// Maps route prefixes to display labels — extend as you add new sections
const ROUTE_LABELS: { prefix: string; label: string }[] = [
  { prefix: "/admin/profile",    label: "Profile"    },
  { prefix: "/admin/projects",   label: "Projects"   },
  { prefix: "/admin/references", label: "References" },
  { prefix: "/admin/inbox",      label: "Inbox"      },
  { prefix: "/admin",            label: "Dashboard"  }, // most general — must be last
]

export function AdminBreadcrumb() {
  const pathname = usePathname()

  // Walk from most-specific to most-general, return first match
  const current = ROUTE_LABELS.find(({ prefix }) => pathname.startsWith(prefix))
  const label = current?.label ?? "Admin"

  return (
    <div className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest">
      <span className="text-(--color-text-muted)">CMS</span>
      <CaretRightIcon size={10} className="text-(--color-text-muted)" weight="bold" />
      <span className="text-(--color-text-primary) font-semibold">{label}</span>
    </div>
  )
}
