"use client"

import { TrashIcon } from "@phosphor-icons/react"
import { deleteProject } from "@/app/actions/projects"
import { useState } from "react"
import { AppButton } from "../ui/wrappers/AppButton"

export function DeleteProjectButton({ id }: { id: string }) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this project? This action cannot be undone.")) return

    setIsDeleting(true)
    try {
      await deleteProject(id)
    } catch (error) {
      alert("Error deleting project")
      setIsDeleting(false)
    }
  }

  return (
    <AppButton
      type="button"
      variant="destructive-custom"
      onClick={handleDelete}
      disabled={isDeleting}
      className="p-2.5 rounded-xl"
    >
      <TrashIcon size={18} weight="duotone" />
    </AppButton>
  )
}