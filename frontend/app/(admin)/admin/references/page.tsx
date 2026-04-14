import { getReferencesAdminAction } from "@/app/actions/references"
import { ReferencesTable } from "@/components/admin/ReferencesTable"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "References | Admin" }

export default async function ReferencesPage() {
  const references = await getReferencesAdminAction()

  return (
    <div className="mx-auto max-w-6xl w-full space-y-6">
      <div className="flex items-end justify-between border-b pb-6">
        <div className="flex flex-col gap-1">
          <h1 className="font-serif text-4xl text-(--color-text-primary)">References</h1>
          <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
            Portfolio Management System / References
          </p>
        </div>
      </div>

      <ReferencesTable
        initialReferences={references}
      />
    </div>
  )
}