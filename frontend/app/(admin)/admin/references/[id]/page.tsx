import { getReferencesAdminAction, updateReferenceAction } from "@/app/actions/references"
import { ReferenceForm } from "@/components/admin/ReferenceForm"
import type { ReferenceFormData } from "@/app/actions/references"
import { notFound } from "next/navigation"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Edit Reference" }

export default async function EditReferencePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const references = await getReferencesAdminAction()
  const reference = references.find((r) => r.id === id)

  if (!reference) notFound()

  const initialData: ReferenceFormData = {
    name:      reference.name,
    role:      reference.role,
    company:   reference.company  ?? "",
    comment:   reference.comment,
    email:     reference.email    ?? "",
    linkedIn:  reference.linkedIn ?? "",
    featured:  reference.featured,
    published: reference.published,
  }

  return (
    <div className="mx-auto max-w-6xl w-full space-y-6">
      <div className="flex flex-col gap-1 border-b pb-6">
        <h1 className="font-serif text-4xl text-(--color-text-primary)">Edit Reference</h1>
        <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
          {reference.name}
        </p>
      </div>

      <ReferenceForm mode="edit" initialData={initialData} id={id}/>
    </div>
  )
}