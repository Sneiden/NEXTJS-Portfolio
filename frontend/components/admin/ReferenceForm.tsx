"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { AppButton } from "@/components/ui/wrappers/AppButton"
import { FormMessage } from "@/components/ui/FormMessage"
import {
  SlidersHorizontalIcon,
  LinkSimpleIcon,
  QuotesIcon,
  UserIcon,
} from "@phosphor-icons/react"
import { updateReferenceAction, createReferenceAction } from "@/app/actions/references"
import type { ReferenceFormData } from "@/app/actions/references"

interface ReferenceFormProps {
  initialData?: Partial<ReferenceFormData>
  mode: "create" | "edit"
  id?: string
}

const empty: ReferenceFormData = {
  name: "",
  role: "",
  company: "",
  comment: "",
  email: "",
  linkedIn: "",
  featured: false,
  published: false,
}

export function ReferenceForm({ initialData, mode, id }: ReferenceFormProps) {
  const router = useRouter()
  const [data, setData] = useState<ReferenceFormData>({ ...empty, ...initialData })
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const inputClasses =
    "bg-secondary/50 border-transparent transition-all duration-200 focus:bg-background focus:border-border focus:ring-0 focus:shadow-md"

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    let result;
    if (mode === "edit" && id) {
      result = await updateReferenceAction(id, data)
    } else {
      result = await createReferenceAction(data)
    }

    setSaving(false)

    if (result.success) {
      setMessage({ type: "success", text: "Reference saved successfully." })
      setTimeout(() => router.push("/admin/references"), 1200)
    } else {
      setMessage({ type: "error", text: result.error ?? "Something went wrong." })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <FormMessage message={message} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

        {/* LEFT COLUMN: Main content (2/3) */}
        <div className="lg:col-span-2 space-y-6 bg-card shadow-sm rounded-xl border p-6">

          {/* Person Details */}
          <section className="border-b pb-10 space-y-6">
            <h2 className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase flex items-center gap-2">
              <UserIcon size={14} weight="duotone" className="text-(--color-accent) dark:brightness-130" />
              Person
            </h2>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="font-mono text-[10px] uppercase tracking-wider ml-1">
                  Full Name *
                </Label>
                <Input
                  value={data.name}
                  onChange={(e) => setData({ ...data, name: e.target.value })}
                  placeholder="Jane Smith"
                  className={inputClasses}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="font-mono text-[10px] uppercase tracking-wider ml-1">
                  Job Title *
                </Label>
                <Input
                  value={data.role}
                  onChange={(e) => setData({ ...data, role: e.target.value })}
                  placeholder="Senior Engineer"
                  className={inputClasses}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="font-mono text-[10px] uppercase tracking-wider ml-1">
                Company
              </Label>
              <Input
                value={data.company}
                onChange={(e) => setData({ ...data, company: e.target.value })}
                placeholder="Acme Corp"
                className={inputClasses}
              />
            </div>
          </section>

          {/* Testimonial */}
          <section className="space-y-6">
            <h2 className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase flex items-center gap-2">
              <QuotesIcon size={14} weight="duotone" className="text-(--color-accent) dark:brightness-130" />
              Testimonial
            </h2>

            <div className="space-y-2">
              <Label className="font-mono text-[10px] uppercase tracking-wider ml-1">
                Comment *
              </Label>
              <Textarea
                value={data.comment}
                onChange={(e) => setData({ ...data, comment: e.target.value })}
                placeholder="Write the testimonial here..."
                className={`${inputClasses} min-h-48 leading-relaxed`}
                required
              />
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN: Settings (1/3) */}
        <div className="space-y-6">

          {/* Visibility & Actions */}
          <section className="bg-card shadow-sm rounded-xl border p-6 space-y-6">
            <h2 className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase flex items-center gap-2">
              <SlidersHorizontalIcon size={14} weight="duotone" className="text-(--color-accent) dark:brightness-130" />
              Visibility
            </h2>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg border border-transparent hover:border-border transition-all">
                <Label htmlFor="published" className="text-sm cursor-pointer font-medium">
                  Published
                </Label>
                <Switch
                  id="published"
                  checked={data.published}
                  onCheckedChange={(v) => setData({ ...data, published: v })}
                />
              </div>
              <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg border border-transparent hover:border-border transition-all">
                <Label htmlFor="featured" className="text-sm cursor-pointer font-medium">
                  Feature on Portfolio
                </Label>
                <Switch
                  id="featured"
                  checked={data.featured}
                  onCheckedChange={(v) => setData({ ...data, featured: v })}
                />
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-4 border-t">
              <AppButton
                type="submit"
                variant="accent-custom"
                disabled={saving}
                className="w-full h-11 font-mono text-[11px] uppercase tracking-widest"
              >
                {saving ? "Saving..." : mode === "create" ? "Confirm & Save" : "Update Reference"}
              </AppButton>
              <AppButton
                type="button"
                variant="destructive-custom"
                onClick={() => router.push("/admin/references")}
                className="w-full h-11 font-mono text-[11px] uppercase tracking-widest"
              >
                Discard
              </AppButton>
            </div>
          </section>

          {/* Contact Links */}
          <section className="bg-card shadow-sm rounded-xl border p-6 space-y-4">
            <h2 className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase flex items-center gap-2">
              <LinkSimpleIcon size={14} weight="duotone" className="text-(--color-accent) dark:brightness-130" />
              Contact
            </h2>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase text-muted-foreground ml-1">
                  Email
                </Label>
                <Input
                  type="email"
                  value={data.email}
                  onChange={(e) => setData({ ...data, email: e.target.value })}
                  placeholder="jane@acme.com"
                  className={inputClasses}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase text-muted-foreground ml-1">
                  LinkedIn URL
                </Label>
                <Input
                  value={data.linkedIn}
                  onChange={(e) => setData({ ...data, linkedIn: e.target.value })}
                  placeholder="https://linkedin.com/in/jane"
                  className={inputClasses}
                />
              </div>
            </div>
          </section>
        </div>
      </div>
    </form>
  )
}