"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Sun, Moon } from "lucide-react"
import { cn } from "@/lib/utils"

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch — only render after mount
  useEffect(() => setMounted(true), [])
  if (!mounted) return <div className="h-9 w-9" />

  const isDark = resolvedTheme === "dark"

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "relative flex h-9 w-9 items-center justify-center rounded-full border transition-colors",
        // "border-[var(--color-border)] bg-[var(--color-surface)]",
        // "hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]",
        // "text-[var(--color-text-muted)]",
        "border-(--color-border) bg-(--color-surface)",
        "hover:border-(--color-accent) hover:text-(--color-accent)",
        "text-(--color-text-muted)",
        className
      )}
      aria-label="Toggle theme"
    >
      {isDark ? <Sun size={15} /> : <Moon size={15} />}
    </button>
  )
}