import { auth } from "@/lib/auth"
import { ProfileForm } from "@/components/admin/ProfileForm"
import { revalidatePath } from "next/cache"
import type { Metadata } from "next"
import type { Session } from "next-auth"

export const metadata: Metadata = { title: "Edit Profile" }

interface SkillGroup {
  category: string
  items: string[]
}

interface SocialLinks {
  github?: string
  linkedin?: string
  email?: string
}

interface ProfileData {
  name: string
  title: string
  bio: string
  imageUrl: string
  availableForWork: boolean
  skills: SkillGroup[]
  socialLinks: SocialLinks
}

async function getProfile(): Promise<ProfileData | null> {
  try {
    const res = await fetch(`${process.env.BACKEND_URL}/profile`, {
      cache: "no-store",
    })
    if (!res.ok) return null
    const data = await res.json()

    // Sanitise null values — controlled inputs need empty strings not null
    return {
      name: data.name ?? "",
      title: data.title ?? "",
      bio: data.bio ?? "",
      imageUrl: data.imageUrl ?? "",           // null → ""
      availableForWork: data.availableForWork ?? true,
      skills: data.skills ?? [],
      socialLinks: {
        github: data.socialLinks?.github ?? "",   // null → ""
        linkedin: data.socialLinks?.linkedin ?? "",
        email: data.socialLinks?.email ?? "",
      },
    }
  } catch {
    return null
  }
}

export default async function AdminProfilePage() {
  const profile = await getProfile()

  const initialData: ProfileData = profile ?? {
    name: "",
    title: "",
    bio: "",
    imageUrl: "",
    availableForWork: true,
    skills: [],
    socialLinks: {},
  }

  async function saveProfile(
    data: ProfileData
  ): Promise<{ success: boolean; error?: string }> {
    "use server"

    const session: Session | null = await auth()
    if (!session?.user?.accessToken) {
      return { success: false, error: "Not authenticated." }
    }

    try {
      const res = await fetch(`${process.env.BACKEND_URL}/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.user.accessToken}`,
        },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        return { success: false, error: err.message ?? "Failed to save profile." }
      }

      revalidatePath("/")
      revalidatePath("/admin/profile")
      return { success: true }
    } catch {
      return { success: false, error: "Network error. Is the backend running?" }
    }
  }

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="font-serif text-3xl text-neutral-900">Profile</h1>
        <p className="font-mono text-xs text-neutral-400 mt-1 tracking-wider uppercase">
          Controls Hero + About sections on the public site
        </p>
      </div>

      <ProfileForm initialData={initialData} onSave={saveProfile} />
    </div>
  )
}