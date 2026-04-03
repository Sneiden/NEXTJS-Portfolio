import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { ProjectForm } from "@/components/admin/ProjectForm"
import type { Metadata } from "next"
import type { Session } from "next-auth"

export const metadata: Metadata = { title: "New Project" }

export default function NewProjectPage() {
  async function createProject(
    data: Parameters<React.ComponentProps<typeof ProjectForm>["onSave"]>[0]
  ): Promise<{ success: boolean; error?: string }> {
    "use server"
    const session: Session | null = await auth()
    if (!session?.user?.accessToken) {
      return { success: false, error: "Not authenticated." }
    }

    try {
      const res = await fetch(`${process.env.BACKEND_URL}/projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.user.accessToken}`,
        },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        return { success: false, error: err.message ?? "Failed to create project." }
      }

      revalidatePath("/admin/projects")
      revalidatePath("/")
      return { success: true }
    } catch {
      return { success: false, error: "Network error. Is the backend running?" }
    }
  }

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="font-serif text-3xl text-(--color-text-primary)">New Project</h1>
        <p className="font-mono text-xs text-(--color-text-muted) mt-1 tracking-wider uppercase">
          Create a new portfolio project
        </p>
      </div>
      <ProjectForm mode="create" onSave={createProject} />
    </div>
  )
}