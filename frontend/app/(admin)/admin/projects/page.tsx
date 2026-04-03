import { auth } from "@/lib/auth"
import Link from "next/link"
import { revalidatePath } from "next/cache"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Pencil, Trash2 } from "lucide-react"
import type { Metadata } from "next"
import type { Session } from "next-auth"

export const metadata: Metadata = { title: "Projects" }

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

  async function deleteProject(id: string): Promise<void> {
    "use server"
    const session: Session | null = await auth()
    await fetch(`${process.env.BACKEND_URL}/projects/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${session?.user?.accessToken}` },
    })
    revalidatePath("/admin/projects")
  }

  async function togglePublished(id: string, published: boolean): Promise<void> {
    "use server"
    const session: Session | null = await auth()
    await fetch(`${process.env.BACKEND_URL}/projects/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.user?.accessToken}`,
      },
      body: JSON.stringify({ published: !published }),
    })
    revalidatePath("/admin/projects")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl text-(--color-text-primary)">Projects</h1>
          <p className="font-mono text-xs text-(--color-text-muted) mt-1 tracking-wider uppercase">
            {projects.length} total
          </p>
        </div>
        <Link href="/admin/projects/new">
          <Button className="rounded-full font-mono text-xs gap-2 bg-(--color-accent) hover:bg-(--color-accent-hover) text-white">
            <Plus size={14} /> New Project
          </Button>
        </Link>
      </div>

      {/* Table */}
      {projects.length === 0 ? (
        <div className="rounded-xl border border-(--color-border) bg-(--color-surface) p-16 text-center">
          <p className="font-mono text-sm text-(--color-text-muted)">No projects yet.</p>
          <Link href="/admin/projects/new">
            <Button variant="outline" className="mt-4 rounded-full font-mono text-xs">
              Create your first project
            </Button>
          </Link>
        </div>
      ) : (
        <div className="rounded-xl border border-(--color-border) bg-(--color-surface) overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-(--color-border) bg-(--color-surface-raised)">
                <th className="px-6 py-3 text-left font-mono text-xs text-(--color-text-muted) uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left font-mono text-xs text-(--color-text-muted) uppercase tracking-wider">
                  Slug
                </th>
                <th className="px-6 py-3 text-left font-mono text-xs text-(--color-text-muted) uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right font-mono text-xs text-(--color-text-muted) uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-(--color-border)">
              {projects.map((project) => (
                <tr
                  key={project.id}
                  className="hover:bg-(--color-surface-raised) transition-colors"
                >
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-(--color-text-primary)">{project.title}</p>
                      <p className="font-mono text-xs text-(--color-text-muted) mt-0.5 line-clamp-1">
                        {project.description}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-(--color-text-muted)">
                    {project.slug}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={`rounded-full font-mono text-xs ${
                          project.published
                            ? "border-emerald-300 text-emerald-600 bg-emerald-50 dark:bg-emerald-950 dark:text-emerald-400"
                            : "border-(--color-border) text-(--color-text-muted)"
                        }`}
                      >
                        {project.published ? "Published" : "Draft"}
                      </Badge>
                      {project.featured && (
                        <Badge
                          variant="outline"
                          className="rounded-full font-mono text-xs border-(--color-accent) text-(--color-accent)"
                        >
                          Featured
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      {/* Publish toggle */}
                      <form action={togglePublished.bind(null, project.id, project.published)}>
                        <button
                          type="submit"
                          className="font-mono text-xs text-(--color-text-muted) hover:text-(--color-accent) transition-colors px-2 py-1 rounded-lg hover:bg-(--color-accent-muted)"
                        >
                          {project.published ? "Unpublish" : "Publish"}
                        </button>
                      </form>

                      {/* Edit */}
                      <Link href={`/admin/projects/${project.id}`}>
                        <button className="p-1.5 rounded-lg text-(--color-text-muted) hover:text-(--color-accent) hover:bg-(--color-accent-muted) transition-colors">
                          <Pencil size={14} />
                        </button>
                      </Link>

                      {/* Delete */}
                      <form action={deleteProject.bind(null, project.id)}>
                        <button
                          type="submit"
                          className="p-1.5 rounded-lg text-(--color-text-muted) hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </form>
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