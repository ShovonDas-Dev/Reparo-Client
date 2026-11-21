"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"
import PasswordField from "./PasswordField"

// The "Change password" card. It uses the Better Auth client directly.
export default function ChangePasswordCard() {
  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")

    // Simple checks before calling the auth server.
    if (!oldPassword || !newPassword || !confirmPassword) {
      setError("Please fill in all three fields.")
      return
    }

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters.")
      return
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match.")
      return
    }

    if (newPassword === oldPassword) {
      setError("New password must be different from the old password.")
      return
    }

    setSaving(true)

    // Better Auth checks the old password and saves the new one.
    const { error: authError } = await authClient.changePassword({
      currentPassword: oldPassword,
      newPassword,
      revokeOtherSessions: true,
    })

    setSaving(false)

    if (authError) {
      const message = authError.message || "Could not change the password."
      setError(message)
      toast.error(message)
      return
    }

    // Clear the form after a successful change.
    setOldPassword("")
    setNewPassword("")
    setConfirmPassword("")
    toast.success("Password changed.")
  }

  return (
    <section className="rounded-2xl border border-border bg-card p-6 sm:p-8">
      <h2 className="font-heading text-lg font-semibold">Change password</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Use at least 6 characters.
      </p>

      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        <PasswordField
          id="old-password"
          label="Old password"
          value={oldPassword}
          onChange={setOldPassword}
        />

        <PasswordField
          id="new-password"
          label="New password"
          value={newPassword}
          onChange={setNewPassword}
          autoComplete="new-password"
        />

        <PasswordField
          id="confirm-password"
          label="Confirm password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          autoComplete="new-password"
        />

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button type="submit" disabled={saving} className="w-full">
          {saving ? "Changing..." : "Change password"}
        </Button>
      </form>
    </section>
  )
}
