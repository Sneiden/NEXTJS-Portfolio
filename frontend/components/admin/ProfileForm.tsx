"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { CameraIcon, ChartDonutIcon, EnvelopeIcon, GithubLogoIcon, LinkedinLogoIcon, PlusIcon, TagIcon, UserIcon, XIcon } from "@phosphor-icons/react"
import { AppButton } from "../ui/wrappers/AppButton"
import { FormMessage } from "../ui/FormMessage"

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
  const router = useRouter()
  const [data, setData] = useState<ProfileFormData>(initialData)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [skillInputs, setSkillInputs] = useState<Record<number, string>>(
    Object.fromEntries(data.skills.map((_, i) => [i, ""]))
  )

  const inputClasses = "bg-secondary/50 border-transparent transition-all duration-200 focus:bg-background focus:border-border focus:ring-0 focus:shadow-md"

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMessage(null)
    const result = await onSave(data)
    setSaving(false)
    setMessage(result.success
      ? { type: "success", text: "Profile updated successfully." }
      : { type: "error", text: result.error ?? "Error saving profile." }
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
    <form onSubmit={handleSubmit} className="space-y-8">

      <FormMessage message={message} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

        {/* LEFT COLUMN: Main Info & Skills (2/3) */}
        <div className="lg:col-span-2 space-y-6 bg-card shadow-sm rounded-xl border p-6">

          {/* Basic Info Card */}
          <section className="border-b pb-10 space-y-6">
            <h2 className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase flex items-center gap-2">
              <UserIcon size={14} weight="duotone" className="text-(--color-accent) dark:brightness-130" />
              Identity & Bio
            </h2>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="font-mono text-[10px] uppercase tracking-wider ml-1">Full Name</Label>
                <Input
                  value={data.name}
                  onChange={(e) => setData({ ...data, name: e.target.value })}
                  className={inputClasses}
                />
              </div>
              <div className="space-y-2">
                <Label className="font-mono text-[10px] uppercase tracking-wider ml-1">Professional Title</Label>
                <Input
                  value={data.title}
                  onChange={(e) => setData({ ...data, title: e.target.value })}
                  className={inputClasses}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="font-mono text-[10px] uppercase tracking-wider ml-1">About Me (Bio)</Label>
              <Textarea
                rows={5}
                value={data.bio}
                onChange={(e) => setData({ ...data, bio: e.target.value })}
                className={`${inputClasses} leading-relaxed`}
              />
            </div>
          </section>

          {/* Skills Section */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase flex items-center gap-2">
                <TagIcon size={14} weight="duotone" className="text-(--color-accent) dark:brightness-130" />
                Expertise Groups
              </h2>
              <AppButton type="button" variant="outline-custom" size="sm" onClick={addSkillGroup} className="h-8 px-3 items-center">
                <PlusIcon weight="bold" size={14} className="mr-1" /> Add Group
              </AppButton>
            </div>

            <div className="space-y-4">
              {data.skills.map((group, gi) => (
                <div key={gi} className="group relative border border-dashed rounded-xl p-5 space-y-4 bg-secondary/10 hover:bg-secondary/20 transition-colors">
                  <div className="flex items-center gap-3">
                    <Input
                      value={group.category}
                      onChange={(e) => {
                        const skills = data.skills.map((g, i) => i === gi ? { ...g, category: e.target.value } : g)
                        setData({ ...data, skills })
                      }}
                      className="font-mono text-xs font-bold uppercase tracking-wider bg-transparent border-b border-t-0 border-x-0 rounded-none focus:ring-0 focus:border-accent h-7 px-1 w-full max-w-50"
                      placeholder="Category Name"
                    />
                    <AppButton
                      type="button"
                      variant="remove-custom"
                      onClick={() => removeSkillGroup(gi)}
                      className="ml-auto"
                    >
                      <XIcon weight="bold" size={20} />
                    </AppButton>
                  </div>

                  <div className="flex flex-wrap gap-2 min-h-8">
                    {group.items.map((item, ii) => (
                      <Badge key={ii} variant="secondary" className="pl-3 pr-1 py-1 rounded-lg border-transparent font-mono text-[10px] flex items-center gap-1 group/badge">
                        {item}
                        <AppButton
                          type="button"
                          variant="remove-custom"
                          onClick={() => removeSkillItem(gi, ii)}
                          className="hover:bg-destructive/20 rounded-full p-0.5"
                        >
                          <XIcon weight="bold" size={12} />
                        </AppButton>
                      </Badge>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Input
                      value={skillInputs[gi] ?? ""}
                      onChange={(e) => setSkillInputs((prev) => ({ ...prev, [gi]: e.target.value }))}
                      onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkillItem(gi) } }}
                      placeholder="Type skill and press Enter..."
                      className={`${inputClasses} h-9 text-xs`}
                    />
                    <AppButton type="button" variant="outline-custom" onClick={() => addSkillItem(gi)} className="h-9">
                      Add
                    </AppButton>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN: Status & Links (1/3) */}
        <div className="space-y-6">
          {/* Availability Card */}
          <section className="bg-card shadow-sm rounded-xl border p-6 space-y-4">
            <h2 className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase flex items-center gap-2">
              <ChartDonutIcon size={14} weight="duotone" className="text-(--color-accent) dark:brightness-130" />
              Work Status
            </h2>
            <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg border border-transparent hover:border-border transition-all">
              <Label htmlFor="availableForWork" className="text-sm cursor-pointer font-medium">Available for hire</Label>
              <Switch id="availableForWork" checked={data.availableForWork} onCheckedChange={(v) => setData({ ...data, availableForWork: v })} />
            </div>

            <div className="pt-2">
              <AppButton type="submit" variant="accent-custom" disabled={saving} className="w-full h-11">
                {saving ? "Saving Changes..." : "Update Profile"}
              </AppButton>
            </div>
          </section>

          {/* Image URL Card */}
          <section className="bg-card shadow-sm rounded-xl border p-6 space-y-4">
            <h2 className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase flex items-center gap-2">
              <CameraIcon size={14} weight="duotone" className="text-(--color-accent) dark:brightness-130" />
              Media
            </h2>
            <div className="space-y-2">
              <Label className="text-[10px] uppercase text-muted-foreground ml-1">
                Avatar URL
              </Label>
              <Input value={data.imageUrl} onChange={(e) => setData({ ...data, imageUrl: e.target.value })} className={inputClasses} />
            </div>
          </section>

          {/* Social Links Card */}
          <section className="bg-card shadow-sm rounded-xl border p-6 space-y-4">
            <h2 className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">Social Presence</h2>
            <div className="space-y-4">
              {(["github", "linkedin", "email"] as const).map((key) => (
                <div key={key} className="space-y-2">
                  <div className="flex items-center gap-2 ml-1">
                    {/* {key === 'github' && <FolderGit2 size={12} className="text-muted-foreground" />} */}
                    {key === 'github' && <GithubLogoIcon size={14} weight="duotone" className="text-(--color-accent) dark:brightness-130" />}
                    {key === 'linkedin' && <LinkedinLogoIcon size={14} weight="duotone" className="text-(--color-accent) dark:brightness-130" />}
                    {key === 'email' && <EnvelopeIcon size={14} weight="duotone" className="text-(--color-accent) dark:brightness-130" />}
                    <Label className="font-mono text-[10px] uppercase tracking-wider">{key}</Label>
                  </div>
                  <Input
                    value={data.socialLinks[key] ?? ""}
                    onChange={(e) => setData({ ...data, socialLinks: { ...data.socialLinks, [key]: e.target.value } })}
                    placeholder={key === "email" ? "hello@domain.com" : "https://..."}
                    className={inputClasses}
                  />
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </form>
  )
}