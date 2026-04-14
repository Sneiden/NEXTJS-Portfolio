"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { FileText } from "lucide-react"
import { SlidersHorizontalIcon, LinkIcon, PlusIcon, XIcon, ImagesIcon, ImageIcon, ImageSquareIcon, FileTextIcon } from "@phosphor-icons/react"
import { AppButton } from "@/components/ui/wrappers/AppButton"
import { FormMessage } from "@/components/ui/FormMessage"

interface ProjectFormData {
  title: string
  slug: string
  description: string
  content: string
  imageUrl: string
  images: string[]
  liveUrl: string
  repoUrl: string
  featured: boolean
  published: boolean
}

interface ProjectFormProps {
  initialData?: Partial<ProjectFormData>
  mode: "create" | "edit"
  onSave: (data: ProjectFormData) => Promise<{ success: boolean; error?: string }>
}

const empty: ProjectFormData = {
  title: "",
  slug: "",
  description: "",
  content: "",
  imageUrl: "",
  images: [],
  liveUrl: "",
  repoUrl: "",
  featured: false,
  published: false,
}

export function ProjectForm({ initialData, mode, onSave }: ProjectFormProps) {
  const router = useRouter()
  const [data, setData] = useState<ProjectFormData>({ ...empty, ...initialData })
  const [saving, setSaving] = useState(false)
  const [imageInput, setImageInput] = useState("")
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const inputClasses = "bg-secondary/50 border-transparent transition-all duration-200 focus:bg-background focus:border-border focus:ring-0 focus:shadow-md"

  function handleTitleChange(value: string) {
    setData((prev) => ({
      ...prev,
      title: value,
      slug: mode === "create"
        ? value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
        : prev.slug,
    }))
  }

  function addImage() {
    const val = imageInput.trim()
    if (!val) return
    setData((prev) => ({ ...prev, images: [...prev.images, val] }))
    setImageInput("")
  }

  function removeImage(index: number) {
    setData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    const result = await onSave(data)
    setSaving(false)

    if (result.success) {
      setMessage({ type: "success", text: "Project saved successfully." })
      setTimeout(() => router.push("/admin/projects"), 1200)
    } else {
      setMessage({ type: "error", text: result.error ?? "Something went wrong." })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">

      <FormMessage message={message} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* LEFT COLUMN: Main Content (2/3) */}
        <div className="lg:col-span-2 space-y-6 bg-card shadow-sm rounded-xl border p-6">
          
          {/* Core Info */}
          <section className="border-b pb-10 space-y-6">
            <h2 className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase flex items-center gap-2">
              <FileTextIcon size={14} weight="duotone" className="text-(--color-accent) dark:brightness-130" /> Project Details
            </h2>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="font-mono text-[10px] uppercase tracking-wider ml-1">Title</Label>
                <Input
                  value={data.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Project Name"
                  className={inputClasses}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="font-mono text-[10px] uppercase tracking-wider ml-1">Slug (URL)</Label>
                <Input
                  value={data.slug}
                  onChange={(e) => setData({ ...data, slug: e.target.value })}
                  placeholder="url-slug"
                  className={`${inputClasses} font-mono text-xs italic`}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="font-mono text-[10px] uppercase tracking-wider ml-1">Short Summary</Label>
              <Textarea
                rows={2}
                value={data.description}
                onChange={(e) => setData({ ...data, description: e.target.value })}
                className={inputClasses}
              />
            </div>

            <div className="space-y-2">
              <Label className="font-mono text-[10px] uppercase tracking-wider ml-1">Project Content (Markdown)</Label>
              <Textarea
                value={data.content}
                onChange={(e) => setData({ ...data, content: e.target.value })}
                className={`${inputClasses} min-h-80 font-mono text-sm leading-relaxed`}
                placeholder="# Introduction..."
              />
            </div>
          </section>

          {/* Media Assets */}
          <section className="space-y-6">
            <h2 className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase flex items-center gap-2">
              <ImageSquareIcon size={14} weight="duotone" className="text-(--color-accent) dark:brightness-130" /> Visual Assets
            </h2>
            
            <div className="flex flex-wrap gap-2 min-h-8">
              {data.images.map((url, i) => (
                <Badge key={i} variant="secondary" className="pl-3 pr-1 py-1 rounded-lg border-transparent font-mono text-[10px] flex items-center gap-1 group/badge">
                  <span className="max-w-50 truncate">{url}</span>
                  <AppButton
                    type="button"
                    variant="remove-custom"
                    onClick={() => removeImage(i)}
                    className="hover:bg-destructive/20 rounded-full p-0.5"
                  >
                    <XIcon weight="bold" size={12} />
                  </AppButton>
                </Badge>
              ))}
              {data.images.length === 0 && (
                <p className="text-[10px] text-muted-foreground italic">No screenshots added yet.</p>
              )}
            </div>

            <div className="flex gap-2">
              <Input
                value={imageInput}
                onChange={(e) => setImageInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addImage() } }}
                placeholder="Paste image URL and press Enter..."
                className={`${inputClasses} h-9 text-xs`}
              />
              <AppButton type="button" variant="outline-custom" onClick={addImage} className="h-9">
                <PlusIcon size={12} className="mr-1" /> Add
              </AppButton>
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN: Settings & Links (1/3) */}
        <div className="space-y-6">
          
          {/* Status & Actions */}
          <section className="bg-card shadow-sm rounded-xl border p-6 space-y-6">
            <h2 className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase flex items-center gap-2">
              <SlidersHorizontalIcon size={14} weight="duotone" className="text-(--color-accent) dark:brightness-130" /> Visibility
            </h2>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg border border-transparent hover:border-border transition-all">
                <Label htmlFor="published" className="text-sm cursor-pointer font-medium">Published</Label>
                <Switch id="published" checked={data.published} onCheckedChange={(v) => setData({ ...data, published: v })} />
              </div>
              <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg border border-transparent hover:border-border transition-all">
                <Label htmlFor="featured" className="text-sm cursor-pointer font-medium">Feature on Home</Label>
                <Switch id="featured" checked={data.featured} onCheckedChange={(v) => setData({ ...data, featured: v })} />
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-4 border-t">
              <AppButton type="submit" variant="accent-custom" disabled={saving} className="w-full h-11 font-mono text-[11px] uppercase tracking-widest">
                {saving ? "Saving..." : mode === "create" ? "Confirm & Publish" : "Update Project"}
              </AppButton>
              <AppButton type="button" variant="destructive-custom" onClick={() => router.push("/admin/projects")} className="w-full h-11 font-mono text-[11px] uppercase tracking-widest">
                Discard Draft
              </AppButton>
            </div>
          </section>

          {/* Links Card */}
          <section className="bg-card shadow-sm rounded-xl border p-6 space-y-4">
            <h2 className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase flex items-center gap-2">
              <LinkIcon size={14} weight="duotone" className="text-(--color-accent) dark:brightness-130" /> External Links
            </h2>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase text-muted-foreground ml-1">Main Cover Image</Label>
                <Input 
                  value={data.imageUrl} 
                  onChange={(e) => setData({ ...data, imageUrl: e.target.value })} 
                  placeholder="https://..."
                  className={inputClasses} 
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase text-muted-foreground ml-1">Live Demo URL</Label>
                <Input 
                  value={data.liveUrl} 
                  onChange={(e) => setData({ ...data, liveUrl: e.target.value })} 
                  placeholder="https://..."
                  className={inputClasses} 
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase text-muted-foreground ml-1">Repository URL</Label>
                <Input 
                  value={data.repoUrl} 
                  onChange={(e) => setData({ ...data, repoUrl: e.target.value })} 
                  placeholder="https://github.com/..."
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