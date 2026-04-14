import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { notFound } from "next/navigation"
import { ProjectForm } from "@/components/admin/ProjectForm"
import type { Metadata } from "next"
import type { Session } from "next-auth"

export const metadata: Metadata = { title: "Edit Project" }

interface Project {
  id: string
  title: string
  slug: string
  description: string
  content: string
  imageUrl?: string
  images?: string[]
  liveUrl?: string
  repoUrl?: string
  featured: boolean
  published: boolean
}

async function getProject(id: string): Promise<Project | null> {
  try {
    const session = await auth()
    const res = await fetch(`${process.env.BACKEND_URL}/projects/admin`, {
      headers: { Authorization: `Bearer ${session?.user?.accessToken}` },
      cache: "no-store",
    })
    if (!res.ok) return null
    const projects: Project[] = await res.json()
    return projects.find((p) => p.id === id) ?? null
  } catch {
    return null
  }
}

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const project = await getProject(id)

  if (!project) notFound()

  const initialData = {
    title: project.title,
    slug: project.slug,
    description: project.description,
    content: project.content,
    imageUrl: project.imageUrl ?? "",
    images: project.images ?? [],
    liveUrl: project.liveUrl ?? "",
    repoUrl: project.repoUrl ?? "",
    featured: project.featured,
    published: project.published,
  }

  async function updateProject(
    data: Parameters<React.ComponentProps<typeof ProjectForm>["onSave"]>[0]
  ): Promise<{ success: boolean; error?: string }> {
    "use server"
    const session: Session | null = await auth()
    if (!session?.user?.accessToken) {
      return { success: false, error: "Not authenticated." }
    }

    try {
      const res = await fetch(`${process.env.BACKEND_URL}/projects/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.user.accessToken}`,
        },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        return { success: false, error: err.message ?? "Failed to update project." }
      }

      revalidatePath("/admin/projects")
      revalidatePath("/")
      return { success: true }
    } catch {
      return { success: false, error: "Network error. Is the backend running?" }
    }
  }

  return (
    <div className="mx-auto max-w-6xl w-full space-y-6">
      <div className="flex flex-col gap-1 border-b pb-6">
        <h1 className="font-serif text-4xl text-(--color-text-primary)">Edit Project</h1>
        <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
          {project.title} 
        </p>
      </div>
      
      <ProjectForm mode="edit" initialData={initialData} onSave={updateProject} />
    </div>
  )
}