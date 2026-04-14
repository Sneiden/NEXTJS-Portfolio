import { auth } from "@/lib/auth"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import {
  PlusIcon,
  PencilSimpleIcon,
  EyeIcon,
  EyeSlashIcon,
  StarIcon,
  FilesIcon,
} from "@phosphor-icons/react/dist/ssr"
import { cn } from "@/lib/utils"
import { togglePublished } from "@/app/actions/projects"
import { DeleteProjectButton } from "@/components/admin/DeleteProjectButton"
import type { Metadata } from "next"
import { AppButton } from "@/components/ui/wrappers/AppButton"

export const metadata: Metadata = { title: "Projects | Studio CMS" }

interface Project {
  id: string
  title: string
  slug: string
  description: string
  published: boolean
  featured: boolean
}

async function getProjects(): Promise<Project[]> {
  try {
    const session = await auth()
    const res = await fetch(`${process.env.BACKEND_URL}/projects/admin`, {
      headers: { Authorization: `Bearer ${session?.user?.accessToken}` },
      cache: "no-store",
    })
    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}
export default async function AdminProjectsPage() {
  const projects = await getProjects()

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* 1. HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-(--color-border) pb-8">
        <div>
          <div className="flex items-center gap-2 text-(--color-accent) mb-1">
            <FilesIcon size={20} weight="duotone" />
            <span className="font-mono text-[10px] font-bold tracking-[0.2em] uppercase">
              Records / Database
            </span>
          </div>
          <h1 className="font-serif text-4xl text-(--color-text-primary) tracking-tight">
            Project Library
          </h1>
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-(--color-text-muted) mt-2 flex items-center gap-2">
            Index — <span className="text-(--color-text-primary)">{projects.length}</span> Entries Recorded
          </p>
        </div>

        <Link href="/admin/projects/new">
          <AppButton
            type="submit"
            variant="accent-custom"
            className="rounded-xl h-12 px-6 font-mono text-[11px] w-full uppercase tracking-widest"
          >
            <PlusIcon size={16} weight="bold" />
            New Project
          </AppButton>
        </Link>
      </div>

      {/* 2. PROJECT LIST */}
      <div className="grid gap-3">
        {projects.map((project: any) => (
          <div key={project.id} className="group relative flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl border border-(--color-border) bg-card p-5 transition-all hover:border-accent/40">

            <div className="flex items-center gap-5">
              {/* Status Toggle Form (Simple Action, no onSubmit needed) */}
              <form action={togglePublished.bind(null, project.id, project.published)}>
                <button type="submit" className={cn(
                  "size-14 rounded-xl flex items-center justify-center border transition-colors shrink-0",
                  project.published
                    ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/10"
                    : "bg-zinc-500/5 border-zinc-500/20 text-zinc-500 hover:bg-zinc-500/10"
                )}>
                  {project.published ? <EyeIcon size={28} weight="duotone" /> : <EyeSlashIcon size={28} weight="duotone" />}
                </button>
              </form>

              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h3 className="font-bold text-lg text-(--color-text-primary)">{project.title}</h3>
                  {project.featured && (
                    <Badge className="bg-accent/10 text-(--color-accent) border-accent/20 rounded-md px-1.5 py-0 text-[9px] font-bold uppercase tracking-tighter">
                      <StarIcon size={10} weight="fill" className="mr-1" /> Featured
                    </Badge>
                  )}
                </div>
                <p className="font-mono text-[10px] text-(--color-text-muted) uppercase tracking-wider italic">/{project.slug}</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 border-t md:border-t-0 pt-4 md:pt-0 border-(--color-border)">
              <Link href={`/admin/projects/${project.id}`} className="flex-1 md:flex-none">
                <AppButton
                  type="submit"
                  variant="outline-custom"
                  className="font-mono w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-[11px] uppercase tracking-wider"
                >
                  <PencilSimpleIcon size={16} weight="duotone" />
                  Edit
                </AppButton>
              </Link>

              <div className="h-8 w-px bg-(--color-border) hidden md:block mx-1" />

              {/* Client Component for Delete */}
              <DeleteProjectButton id={project.id} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}