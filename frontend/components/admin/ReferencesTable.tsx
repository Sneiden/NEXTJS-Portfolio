"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { Switch } from "@/components/ui/switch"
import { AppButton } from "@/components/ui/wrappers/AppButton"
import { FormMessage } from "@/components/ui/FormMessage"
import { cn } from "@/lib/utils"
import {
  PencilSimpleIcon,
  TrashIcon,
  StarIcon,
  PlusIcon,
} from "@phosphor-icons/react"
import { deleteReferenceAction, updateReferenceAction } from "@/app/actions/references"
import type { Reference } from "@/app/actions/references"

interface ReferencesTableProps {
  initialReferences: Reference[]
  // onDelete: (id: string) => Promise<{ success: boolean; error?: string }>
  // onTogglePublished: (id: string, published: boolean) => Promise<{ success: boolean; error?: string }>
}

export function ReferencesTable({
  initialReferences,
  // onDelete,
  // onTogglePublished,
}: ReferencesTableProps) {
  const [isPending, startTransition] = useTransition()
  const [deleteId, setDeleteId]      = useState<string | null>(null)
  const [message, setMessage]        = useState<{ type: "success" | "error"; text: string } | null>(null)

  function handleToggle(ref: Reference) {
    startTransition(async () => {
      const result = await updateReferenceAction(ref.id, { published: !ref.published })
      if (!result.success) setMessage({ type: "error", text: result.error ?? "Failed." })
    })
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      const result = await deleteReferenceAction(id)
      if (result.success) {
        setDeleteId(null)
      } else {
        setMessage({ type: "error", text: result.error ?? "Failed." })
      }
    })
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
          {initialReferences.length} total
        </p>
        <Link href="/admin/references/new">
          <AppButton variant="accent-custom" className="h-9 font-mono text-[11px] uppercase tracking-widest">
            <PlusIcon size={13} className="mr-1.5" />
            New Reference
          </AppButton>
        </Link>
      </div>

      <FormMessage message={message} />

      {/* Empty state */}
      {initialReferences.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed py-20 text-center">
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            No references yet
          </p>
          <Link href="/admin/references/new">
            <AppButton variant="outline-custom" className="font-mono text-[11px] uppercase tracking-widest">
              <PlusIcon size={13} className="mr-1.5" />
              Add your first reference
            </AppButton>
          </Link>
        </div>
      ) : (
        <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-secondary/30">
                {["Name", "Role", "Company", "Featured", "Published", "Actions"].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-widest text-muted-foreground"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {initialReferences.map((ref) => (
                <tr
                  key={ref.id}
                  className={cn(
                    "border-b last:border-0 transition-colors hover:bg-secondary/20",
                    deleteId === ref.id && "opacity-40 pointer-events-none"
                  )}
                >
                  {/* Name */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {ref.featured && (
                        <StarIcon size={12} weight="fill" className="text-amber-400 shrink-0" />
                      )}
                      <span className="font-medium text-sm text-(--color-text-primary)">
                        {ref.name}
                      </span>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                    {ref.role}
                  </td>

                  {/* Company */}
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                    {ref.company ?? "—"}
                  </td>

                  {/* Featured */}
                  <td className="px-4 py-3">
                    <span className={cn(
                      "font-mono text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-md",
                      ref.featured
                        ? "bg-amber-400/10 text-amber-600"
                        : "text-muted-foreground"
                    )}>
                      {ref.featured ? "Yes" : "No"}
                    </span>
                  </td>

                  {/* Published toggle */}
                  <td className="px-4 py-3">
                    <Switch
                      checked={ref.published}
                      onCheckedChange={() => handleToggle(ref)}
                      disabled={isPending}
                    />
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      {/* Edit → navigates to /admin/references/[id] */}
                      <Link href={`/admin/references/${ref.id}`}>
                        <AppButton
                          variant="remove-custom"
                          className="size-8 p-0 flex items-center justify-center text-muted-foreground hover:text-(--color-accent) transition-colors"
                        >
                          <PencilSimpleIcon size={14} />
                        </AppButton>
                      </Link>

                      {/* Delete — two-click confirm */}
                      {deleteId === ref.id ? (
                        <div className="flex items-center gap-1">
                          <AppButton
                            variant="destructive-custom"
                            onClick={() => handleDelete(ref.id)}
                            disabled={isPending}
                            className="h-7 px-2 font-mono text-[10px] uppercase tracking-widest"
                          >
                            {isPending ? "…" : "Confirm"}
                          </AppButton>
                          <AppButton
                            variant="remove-custom"
                            onClick={() => setDeleteId(null)}
                            className="h-7 px-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground"
                          >
                            Cancel
                          </AppButton>
                        </div>
                      ) : (
                        <AppButton
                          variant="remove-custom"
                          onClick={() => setDeleteId(ref.id)}
                          className="size-8 p-0 flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <TrashIcon size={14} />
                        </AppButton>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}