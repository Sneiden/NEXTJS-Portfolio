"use server"

import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function deleteProject(id: string) {
  const session = await auth()
  
  const res = await fetch(`${process.env.BACKEND_URL}/projects/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${session?.user?.accessToken}` },
  })

  if (!res.ok) throw new Error("Failed to delete project")
  
  revalidatePath("/admin/projects")
}

export async function togglePublished(id: string, currentStatus: boolean) {
  const session = await auth()
  
  const res = await fetch(`${process.env.BACKEND_URL}/projects/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.user?.accessToken}`,
    },
    body: JSON.stringify({ published: !currentStatus }),
  })

  if (!res.ok) throw new Error("Failed to update status")
  
  revalidatePath("/admin/projects")
}