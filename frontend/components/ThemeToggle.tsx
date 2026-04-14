"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { LightbulbIcon, LightbulbFilamentIcon } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) return <div className="size-10 rounded-xl bg-secondary/10" />

  const isDark = resolvedTheme === "dark"

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "group relative flex size-10 items-center justify-center overflow-hidden rounded-xl border transition-all duration-500 active:scale-90",
        // Dark Mode: Visible via border and subtle background lift
        isDark 
          ? "border-zinc-700 bg-zinc-800/50 hover:border-amber-500/50 hover:bg-zinc-800 shadow-[0_4px_12px_rgba(0,0,0,0.3)]" 
          : "border-amber-200 bg-amber-50 hover:border-zinc-400 hover:bg-white shadow-[0_2px_8px_rgba(245,158,11,0.1)]",
        className
      )}
      aria-label="Toggle theme"
    >
      {/* 1. HOVER PREVIEW: The "Opposite" glow layer */}
      <div 
        className={cn(
          "absolute inset-0 transition-opacity duration-500 pointer-events-none",
          // If Dark: Show a faint glow on hover (previewing Light)
          // If Light: Show a faint shadow on hover (previewing Dark)
          isDark 
            ? "bg-amber-400/5 opacity-0 group-hover:opacity-100" 
            : "bg-zinc-900/5 opacity-0 group-hover:opacity-100"
        )} 
      />

      <div className="relative flex items-center justify-center">
        {/* 2. THE GLASS SHELL: Changes color/rotation */}
        <LightbulbIcon
          size={22}
          weight="duotone"
          className={cn(
            "transition-all duration-500 ease-in-out z-10",
            isDark 
              ? "text-zinc-500 rotate-12 group-hover:text-amber-500/70 group-hover:rotate-0" 
              : "text-amber-500 rotate-0 group-hover:text-zinc-400 group-hover:rotate-12"
          )}
        />

        {/* 3. THE ACTIVE FILAMENT: Pure light */}
        <div 
          className={cn(
            "absolute inset-0 flex items-center justify-center transition-all duration-500",
            isDark ? "opacity-0 scale-50" : "opacity-100 scale-100"
          )}
        >
          <LightbulbFilamentIcon
            size={22}
            weight="fill"
            className="text-yellow-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.8)]"
          />
        </div>

        {/* 4. THE HOVER FILAMENT: Ghostly preview of the opposite state */}
        <div 
          className={cn(
            "absolute inset-0 flex items-center justify-center transition-all duration-500 opacity-0",
            isDark 
              ? "group-hover:opacity-40 group-hover:scale-100 scale-50" 
              : "group-hover:opacity-0" // In Light mode, we just dim the main filament via step 3
          )}
        >
          <LightbulbFilamentIcon
            size={22}
            weight="fill"
            className="text-amber-500/50"
          />
        </div>
      </div>
    </button>
  )
}