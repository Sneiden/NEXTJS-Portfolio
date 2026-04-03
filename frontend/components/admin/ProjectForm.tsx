"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

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

  // Auto-generate slug from title on create
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
      setTimeout(() => router.push("/admin/projects"), 1000)
    } else {
      setMessage({ type: "error", text: result.error ?? "Something went wrong." })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">

      {message && (
        <div className={`rounded-xl border px-4 py-3 font-mono text-xs ${
          message.type === "success"
            ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:border-emerald-800 dark:text-emerald-400"
            : "border-red-200 bg-red-50 text-red-700 dark:bg-red-950 dark:border-red-800 dark:text-red-400"
        }`}>
          {message.text}
        </div>
      )}

      {/* ── Basic Info ─────────────────────────────── */}
      <section className="space-y-4 rounded-xl border border-(--color-border) bg-(--color-surface) p-6">
        <h2 className="font-mono text-xs tracking-widest text-(--color-text-muted) uppercase">
          Basic Info
        </h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label className="font-mono text-xs">Title</Label>
            <Input
              value={data.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="My Awesome Project"
              required
            />
          </div>
          <div className="space-y-2">
            <Label className="font-mono text-xs">Slug</Label>
            <Input
              value={data.slug}
              onChange={(e) => setData({ ...data, slug: e.target.value })}
              placeholder="my-awesome-project"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="font-mono text-xs">Short Description</Label>
          <Textarea
            value={data.description}
            onChange={(e) => setData({ ...data, description: e.target.value })}
            placeholder="A brief description shown on the projects grid..."
            rows={2}
            className="resize-none"
            required
          />
        </div>

        <div className="space-y-2">
          <Label className="font-mono text-xs">Full Content</Label>
          <Textarea
            value={data.content}
            onChange={(e) => setData({ ...data, content: e.target.value })}
            placeholder="Full project description shown on the detail page..."
            rows={6}
            className="resize-none"
            required
          />
        </div>
      </section>

      {/* ── Links ──────────────────────────────────── */}
      <section className="space-y-4 rounded-xl border border-(--color-border) bg-(--color-surface) p-6">
        <h2 className="font-mono text-xs tracking-widest text-(--color-text-muted) uppercase">
          Links
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label className="font-mono text-xs">Cover Image URL</Label>
            <Input
              value={data.imageUrl}
              onChange={(e) => setData({ ...data, imageUrl: e.target.value })}
              placeholder="https://..."
            />
          </div>
          <div className="space-y-2">
            <Label className="font-mono text-xs">Live URL</Label>
            <Input
              value={data.liveUrl}
              onChange={(e) => setData({ ...data, liveUrl: e.target.value })}
              placeholder="https://..."
            />
          </div>
          <div className="space-y-2">
            <Label className="font-mono text-xs">Repo URL</Label>
            <Input
              value={data.repoUrl}
              onChange={(e) => setData({ ...data, repoUrl: e.target.value })}
              placeholder="https://github.com/..."
            />
          </div>
        </div>
      </section>

      {/* ── Screenshots ────────────────────────────── */}
      <section className="space-y-4 rounded-xl border border-(--color-border) bg-(--color-surface) p-6">
        <h2 className="font-mono text-xs tracking-widest text-(--color-text-muted) uppercase">
          Screenshots
        </h2>

        <div className="flex flex-wrap gap-2">
          {data.images.map((url, i) => (
            <Badge
              key={i}
              variant="outline"
              className="rounded-full font-mono text-xs gap-2 pr-2 max-w-xs truncate"
            >
              <span className="truncate">{url}</span>
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="text-(--color-text-muted) hover:text-red-500 transition-colors"
              >
                <X size={10} />
              </button>
            </Badge>
          ))}
        </div>

        <div className="flex gap-2">
          <Input
            value={imageInput}
            onChange={(e) => setImageInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addImage() } }}
            placeholder="Paste screenshot URL, press Enter"
          />
          <Button type="button" variant="outline" onClick={addImage}>
            Add
          </Button>
        </div>
      </section>

      {/* ── Visibility ─────────────────────────────── */}
      <section className="space-y-4 rounded-xl border border-(--color-border) bg-(--color-surface) p-6">
        <h2 className="font-mono text-xs tracking-widest text-(--color-text-muted) uppercase">
          Visibility
        </h2>
        <div className="flex flex-col gap-4 sm:flex-row sm:gap-8">
          <div className="flex items-center gap-3">
            <Switch
              checked={data.featured}
              onCheckedChange={(v) => setData({ ...data, featured: v })}
            />
            <Label className="font-mono text-xs">Featured on homepage</Label>
          </div>
          <div className="flex items-center gap-3">
            <Switch
              checked={data.published}
              onCheckedChange={(v) => setData({ ...data, published: v })}
            />
            <Label className="font-mono text-xs">Published (visible publicly)</Label>
          </div>
        </div>
      </section>

      {/* ── Actions ────────────────────────────────── */}
      <div className="flex items-center justify-between pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/projects")}
          className="rounded-full font-mono text-xs"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={saving}
          className="rounded-full font-mono text-xs px-8 bg-(--color-accent) hover:bg-(--color-accent-hover) text-white"
        >
          {saving ? "Saving..." : mode === "create" ? "Create Project" : "Save Changes"}
        </Button>
      </div>
    </form>
  )
}