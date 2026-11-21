"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getClientToken } from "@/lib/getClientToken"
import { updateProfile, uploadImage, type Profile } from "@/lib/API/profile"

// The biggest photo we accept.
const MAX_IMAGE_SIZE = 2 * 1024 * 1024

// Bangladeshi mobile numbers: 11 digits, starting with 01.
const PHONE_PATTERN = /^01\d{9}$/

type EditProfileDialogProps = {
  profile: Profile
  onClose: () => void
  onSaved: () => Promise<void>
}

// The modal where the user edits their name, phone, address and photo.
export default function EditProfileDialog({
  profile,
  onClose,
  onSaved,
}: EditProfileDialogProps) {
  // Form values, filled from the current profile when the modal opens.
  const [name, setName] = useState(profile.name)
  const [phone, setPhone] = useState(profile.phone ?? "")
  const [address, setAddress] = useState(profile.address ?? "")

  // The new file and its local preview (empty until a file is chosen).
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState("")

  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)

  // Free the temporary preview link when it changes or the modal closes.
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  // Check the chosen file and show a preview.
  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const chosen = event.target.files?.[0]

    if (!chosen) {
      return
    }

    // Only image files are allowed.
    if (!chosen.type.startsWith("image/")) {
      setError("Please choose an image file.")
      event.target.value = ""
      return
    }

    // Keep the upload small.
    if (chosen.size > MAX_IMAGE_SIZE) {
      setError("The image must be 2MB or smaller.")
      event.target.value = ""
      return
    }

    setError("")
    setFile(chosen)

    // Show the chosen picture right away.
    const url = URL.createObjectURL(chosen)
    setPreviewUrl(url)
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")

    // Friendly checks before calling the API.
    if (!name.trim()) {
      setError("Name is required.")
      return
    }

    // Phone is optional, but when filled in it must be a valid BD number.
    if (phone.trim() && !PHONE_PATTERN.test(phone.trim())) {
      setError(
        "Phone must be 11 digits and start with 01 (for example 01712345678).",
      )
      return
    }

    setSaving(true)

    try {
      // Upload the new photo first (if any), then save the profile.
      let image = profile.image ?? ""

      if (file) {
        image = await uploadImage(file)
      }

      // Get the JWT for this signed-in user.
      const token = await getClientToken()
      await updateProfile(profile.email, {
        name: name.trim(),
        phone: phone.trim(),
        address: address.trim(),
        image,
      }, token)

      // Ask the page to reload the profile so the new values show up.
      await onSaved()

      toast.success("Profile updated.")
      onClose()
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Could not update the profile."
      setError(message)
      toast.error(message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog
      open
      onOpenChange={(nextOpen) => {
        if (!nextOpen) onClose()
      }}
    >
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Update your details and save the changes.
            </DialogDescription>
          </DialogHeader>

          {/* Photo picker with a small preview */}
          <div className="flex items-center gap-4">
            {previewUrl || profile.image ? (
              <Image
                src={previewUrl || profile.image || ""}
                alt="Profile picture preview"
                width={72}
                height={72}
                unoptimized
                className="size-[72px] shrink-0 rounded-full border border-border object-cover"
              />
            ) : (
              <div className="grid size-[72px] shrink-0 place-items-center rounded-full bg-muted text-xs text-muted-foreground">
                No photo
              </div>
            )}

            <div className="min-w-0 flex-1">
              <label
                htmlFor="profile-photo"
                className="mb-1.5 block text-sm font-medium"
              >
                Photo
              </label>
              <Input
                id="profile-photo"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="h-auto py-1.5"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Image only, max 2MB.
              </p>
            </div>
          </div>

          {/* Name */}
          <div>
            <label
              htmlFor="profile-name"
              className="mb-1.5 block text-sm font-medium"
            >
              Name
            </label>
            <Input
              id="profile-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Your full name"
              className="h-10"
            />
          </div>

          {/* Email is read-only */}
          <div>
            <label
              htmlFor="profile-email"
              className="mb-1.5 block text-sm font-medium"
            >
              Email
            </label>
            <Input
              id="profile-email"
              type="email"
              value={profile.email}
              disabled
              className="h-10"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Email cannot be changed.
            </p>
          </div>

          {/* Phone */}
          <div>
            <label
              htmlFor="profile-phone"
              className="mb-1.5 block text-sm font-medium"
            >
              Phone
            </label>
            <Input
              id="profile-phone"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="01XXXXXXXXX"
              className="h-10"
            />
          </div>

          {/* Address */}
          <div>
            <label
              htmlFor="profile-address"
              className="mb-1.5 block text-sm font-medium"
            >
              Address
            </label>
            <Input
              id="profile-address"
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              placeholder="House, road, area, city"
              className="h-10"
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
