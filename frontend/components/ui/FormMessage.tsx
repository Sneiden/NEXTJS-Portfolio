"use client"

import { cn } from "@/lib/utils"

interface FormMessageProps {
  message: {
    type: "success" | "error"
    text: string
  } | null
  className?: string
}

export function FormMessage({ message, className }: FormMessageProps) {
  if (!message) return null

  const isSuccess = message.type === "success"

  return (
    <div
      className={cn(
        "rounded-xl border px-4 py-3 font-mono text-xs transition-all animate-in fade-in slide-in-from-top-1",
        isSuccess
          ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:border-emerald-800 dark:text-emerald-400"
          : "border-red-200 bg-red-50 text-red-700 dark:bg-red-950 dark:border-red-800 dark:text-red-400",
        className
      )}
    >
      {message.text}
    </div>
  )
}