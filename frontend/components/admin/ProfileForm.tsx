"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { X, Plus } from "lucide-react"

interface SkillGroup {
  category: string
  items: string[]
}

interface SocialLinks {
  github?: string
  linkedin?: string
  email?: string
}

interface ProfileFormData {
  name: string
  title: string
  bio: string
  imageUrl: string
  availableForWork: boolean
  skills: SkillGroup[]
  socialLinks: SocialLinks
}

interface ProfileFormProps {
  initialData: ProfileFormData
  onSave: (data: ProfileFormData) => Promise<{ success: boolean; error?: string }>
}

export function ProfileForm({ initialData, onSave }: ProfileFormProps) {
  const [data, setData] = useState<ProfileFormData>(initialData)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  // skill tag input state per group
  const [skillInputs, setSkillInputs] = useState<Record<number, string>>(
    Object.fromEntries(initialData.skills.map((_, i) => [i, ""]))
  )

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    const result = await onSave(data)

    setSaving(false)
    setMessage(
      result.success
        ? { type: "success", text: "Profile saved successfully." }
        : { type: "error", text: result.error ?? "Something went wrong." }
    )
  }

  function updateSkillItem(groupIndex: number, itemIndex: number, value: string) {
    setData((prev) => {
      const skills = prev.skills.map((g, gi) =>
        gi === groupIndex
          ? { ...g, items: g.items.map((item, ii) => (ii === itemIndex ? value : item)) }
          : g
      )
      return { ...prev, skills }
    })
  }

  function removeSkillItem(groupIndex: number, itemIndex: number) {
    setData((prev) => {
      const skills = prev.skills.map((g, gi) =>
        gi === groupIndex
          ? { ...g, items: g.items.filter((_, ii) => ii !== itemIndex) }
          : g
      )
      return { ...prev, skills }
    })
  }

  function addSkillItem(groupIndex: number) {
    const val = skillInputs[groupIndex]?.trim()
    if (!val) return
    setData((prev) => {
      const skills = prev.skills.map((g, gi) =>
        gi === groupIndex ? { ...g, items: [...g.items, val] } : g
      )
      return { ...prev, skills }
    })
    setSkillInputs((prev) => ({ ...prev, [groupIndex]: "" }))
  }

  function addSkillGroup() {
    setData((prev) => ({
      ...prev,
      skills: [...prev.skills, { category: "New Category", items: [] }],
    }))
    setSkillInputs((prev) => ({ ...prev, [data.skills.length]: "" }))
  }

  function removeSkillGroup(groupIndex: number) {
    setData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, gi) => gi !== groupIndex),
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10">

      {/* Feedback message */}
      {message && (
        <div className={`rounded-none border px-4 py-3 font-mono text-xs ${
          message.type === "success"
            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
            : "border-red-200 bg-red-50 text-red-700"
        }`}>
          {message.text}
        </div>
      )}

      {/* ── Basic Info ─────────────────────────────────────── */}
      <section className="space-y-4">
        <h2 className="font-mono text-xs tracking-widest text-neutral-400 uppercase">
          Basic Info
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name" className="font-mono text-xs">Name</Label>
            <Input
              id="name"
              value={data.name}
              onChange={(e) => setData({ ...data, name: e.target.value })}
              className="rounded-none"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="title" className="font-mono text-xs">Title</Label>
            <Input
              id="title"
              value={data.title}
              onChange={(e) => setData({ ...data, title: e.target.value })}
              className="rounded-none"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio" className="font-mono text-xs">Bio</Label>
          <Textarea
            id="bio"
            rows={4}
            value={data.bio}
            onChange={(e) => setData({ ...data, bio: e.target.value })}
            className="rounded-none resize-none"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="imageUrl" className="font-mono text-xs">Profile Image URL</Label>
          <Input
            id="imageUrl"
            value={data.imageUrl}
            onChange={(e) => setData({ ...data, imageUrl: e.target.value })}
            placeholder="https://..."
            className="rounded-none"
          />
        </div>

        <div className="flex items-center gap-3">
          <Switch
            id="availableForWork"
            checked={data.availableForWork}
            onCheckedChange={(checked) =>
              setData({ ...data, availableForWork: checked })
            }
          />
          <Label htmlFor="availableForWork" className="font-mono text-xs">
            Available for work
          </Label>
        </div>
      </section>

      {/* ── Social Links ───────────────────────────────────── */}
      <section className="space-y-4">
        <h2 className="font-mono text-xs tracking-widest text-neutral-400 uppercase">
          Social Links
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {(["github", "linkedin", "email"] as const).map((key) => (
            <div key={key} className="space-y-2">
              <Label className="font-mono text-xs capitalize">{key}</Label>
              <Input
                value={data.socialLinks[key] ?? ""}
                onChange={(e) =>
                  setData({
                    ...data,
                    socialLinks: { ...data.socialLinks, [key]: e.target.value },
                  })
                }
                placeholder={key === "email" ? "you@example.com" : "https://..."}
                className="rounded-none"
              />
            </div>
          ))}
        </div>
      </section>

      {/* ── Skills ─────────────────────────────────────────── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-mono text-xs tracking-widest text-neutral-400 uppercase">
            Skills
          </h2>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addSkillGroup}
            className="rounded-none font-mono text-xs"
          >
            <Plus size={12} className="mr-1" /> Add Group
          </Button>
        </div>

        <div className="space-y-6">
          {data.skills.map((group, gi) => (
            <div key={gi} className="border border-neutral-200 p-4 space-y-3">
              {/* Category name */}
              <div className="flex items-center gap-2">
                <Input
                  value={group.category}
                  onChange={(e) => {
                    const skills = data.skills.map((g, i) =>
                      i === gi ? { ...g, category: e.target.value } : g
                    )
                    setData({ ...data, skills })
                  }}
                  className="rounded-none font-mono text-xs h-8 w-40"
                  placeholder="Category name"
                />
                <button
                  type="button"
                  onClick={() => removeSkillGroup(gi)}
                  className="ml-auto text-neutral-400 hover:text-red-500 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Skill tags */}
              <div className="flex flex-wrap gap-2">
                {group.items.map((item, ii) => (
                  <Badge
                    key={ii}
                    variant="outline"
                    className="rounded-none font-mono text-xs gap-1 pr-1"
                  >
                    {item}
                    <button
                      type="button"
                      onClick={() => removeSkillItem(gi, ii)}
                      className="text-neutral-400 hover:text-red-500 transition-colors"
                    >
                      <X size={10} />
                    </button>
                  </Badge>
                ))}
              </div>

              {/* Add skill input */}
              <div className="flex gap-2">
                <Input
                  value={skillInputs[gi] ?? ""}
                  onChange={(e) =>
                    setSkillInputs((prev) => ({ ...prev, [gi]: e.target.value }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") { e.preventDefault(); addSkillItem(gi) }
                  }}
                  placeholder="Add skill, press Enter"
                  className="rounded-none font-mono text-xs h-8"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addSkillItem(gi)}
                  className="rounded-none font-mono text-xs h-8"
                >
                  Add
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Submit ─────────────────────────────────────────── */}
      <div className="flex justify-end border-t border-neutral-200 pt-6">
        <Button
          type="submit"
          disabled={saving}
          className="rounded-none font-mono text-xs px-8"
        >
          {saving ? "Saving..." : "Save Profile"}
        </Button>
      </div>
    </form>
  )
}