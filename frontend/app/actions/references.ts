"use server"

import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import type { Session } from "next-auth"

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Reference {
  id: string
  name: string
  role: string
  company: string | null
  comment: string
  email: string | null
  linkedIn: string | null
  featured: boolean
  published: boolean
  createdAt: string
  updatedAt: string
  authorId: string
}

export interface ReferenceFormData {
  name: string
  role: string
  company: string
  comment: string
  email: string
  linkedIn: string
  featured: boolean
  published: boolean
}

// ─── Helper ───────────────────────────────────────────────────────────────────

async function getSession(): Promise<Session> {
  const session = await auth()
  if (!session?.user?.accessToken) throw new Error("Not authenticated.")
  return session
}

// ─── Actions ──────────────────────────────────────────────────────────────────

export async function getReferencesAdminAction(): Promise<Reference[]> {
  const session = await getSession()
  const token: string = session.user.accessToken

  const res = await fetch(`${process.env.BACKEND_URL}/references/admin`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  })
  if (!res.ok) throw new Error("Failed to fetch references.")
  return res.json()
}

export async function createReferenceAction(
  data: ReferenceFormData
): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await getSession()
    const token: string = session.user.accessToken

    const res = await fetch(`${process.env.BACKEND_URL}/references`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      return { success: false, error: err.message ?? "Failed to create reference." }
    }

    revalidatePath("/admin/references")
    return { success: true }
  } catch {
    return { success: false, error: "Network error. Is the backend running?" }
  }
}

export async function updateReferenceAction(
  id: string,
  data: ReferenceFormData | Partial<ReferenceFormData>
): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await getSession()
    const token: string = session.user.accessToken

    const res = await fetch(`${process.env.BACKEND_URL}/references/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      return { success: false, error: err.message ?? "Failed to update reference." }
    }

    revalidatePath("/admin/references")
    return { success: true }
  } catch {
    return { success: false, error: "Network error. Is the backend running?" }
  }
}

export async function deleteReferenceAction(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await getSession()
    const token: string = session.user.accessToken

    const res = await fetch(`${process.env.BACKEND_URL}/references/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      return { success: false, error: err.message ?? "Failed to delete reference." }
    }

    revalidatePath("/admin/references")
    return { success: true }
  } catch {
    return { success: false, error: "Network error. Is the backend running?" }
  }
}