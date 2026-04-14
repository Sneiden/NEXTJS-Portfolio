import { createReferenceAction } from "@/app/actions/references"
import { ReferenceForm } from "@/components/admin/ReferenceForm"
import type { ReferenceFormData } from "@/app/actions/references"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "New Reference" }

export default function NewReferencePage() {
  async function createReference(
    data: ReferenceFormData
  ): Promise<{ success: boolean; error?: string }> {
    "use server"
    return createReferenceAction(data)
  }

  return (
    <div className="mx-auto max-w-6xl w-full space-y-6">
      <div className="flex flex-col gap-1 border-b pb-6">
        <h1 className="font-serif text-4xl text-(--color-text-primary)">New Reference</h1>
        <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
          Portfolio Management System / References
        </p>
      </div>

      <ReferenceForm mode="create" onSave={createReference} />
    </div>
  )
}