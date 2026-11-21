"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { LogOut } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { authClient } from "@/lib/auth-client"
import { getCurrentEmail } from "@/lib/auth-helper"
import { getClientToken } from "@/lib/getClientToken"
import { getProfile, type Profile } from "@/lib/API/profile"
import ProfileCard from "@/components/Profile/ProfileCard"
import EditProfileDialog from "@/components/Profile/EditProfileDialog"
import ChangePasswordCard from "@/components/Profile/ChangePasswordCard"

// The profile page: loads the user, shows the card and handles the modals.
export default function ProfilePage() {
  const router = useRouter()

  // The email is found through the auth helper, so auth stays in one place.
  const [email, setEmail] = useState<string | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // When true, the edit modal is open.
  const [editOpen, setEditOpen] = useState(false)

  // Bumping this number runs the loading effect again (the "Try again" button).
  const [reloadKey, setReloadKey] = useState(0)

  // Load the profile once the page opens.
  useEffect(() => {
    let active = true

    async function load() {
      try {
        const currentEmail = await getCurrentEmail()

        // Nobody is signed in: go to the login page.
        if (!currentEmail) {
          if (active) router.replace("/sign-in")
          return
        }

        if (active) setEmail(currentEmail)

        // Get the JWT for this signed-in user.
        const token = await getClientToken()
        const data = await getProfile(currentEmail, token)

        if (active) {
          setProfile(data)
          setError("")
        }
      } catch (err) {
        if (!active) return
        const message =
          err instanceof Error ? err.message : "Could not load the profile."
        setError(message)
      } finally {
        if (active) setLoading(false)
      }
    }

    load()

    // Stop saving data if the page closes before the request finishes.
    return () => {
      active = false
    }
  }, [router, reloadKey])

  // Re-read the profile after a save so the page updates without a reload.
  async function refreshProfile() {
    if (!email) return

    // Get the JWT for this signed-in user.
    const token = await getClientToken()
    const data = await getProfile(email, token)
    setProfile(data)
  }

  // The "Try again" button starts the loading effect from the top.
  function handleRetry() {
    setLoading(true)
    setError("")
    setReloadKey((key) => key + 1)
  }

  // Sign out and go back to the login page.
  async function handleLogout() {
    await authClient.signOut()
    toast.success("Signed out.")
    router.replace("/sign-in")
  }

  // Keep showing the skeleton while the page is loading or redirecting.
  const showSkeleton = loading || (!profile && !error)

  return (
    <main className="mx-auto w-full max-w-5xl px-5 py-12 md:px-8">
      {/* Page title */}
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-semibold tracking-tight">
          My profile
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Manage your personal details and account security.
        </p>
      </div>

      {/* Loading skeleton */}
      {showSkeleton && <ProfileSkeleton />}

      {/* Error message with a retry button */}
      {!showSkeleton && error && (
        <div className="rounded-2xl border border-border bg-card p-8 text-center">
          <p className="text-sm text-destructive">{error}</p>
          <Button variant="outline" className="mt-4" onClick={handleRetry}>
            Try again
          </Button>
        </div>
      )}

      {/* The real profile content */}
      {!showSkeleton && !error && profile && (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ProfileCard profile={profile} onEdit={() => setEditOpen(true)} />
          </div>

          <div className="space-y-6">
            <ChangePasswordCard />

            {/* Logout card */}
            <section className="rounded-2xl border border-border bg-card p-6 sm:p-8">
              <h2 className="font-heading text-lg font-semibold">Sign out</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                End this session on this device.
              </p>
              <Button
                variant="outline"
                className="mt-4 w-full gap-2"
                onClick={handleLogout}
              >
                <LogOut className="size-4" />
                Logout
              </Button>
            </section>
          </div>

          {/* The edit modal is only mounted while it is open. */}
          {editOpen && (
            <EditProfileDialog
              profile={profile}
              onClose={() => setEditOpen(false)}
              onSaved={refreshProfile}
            />
          )}
        </div>
      )}
    </main>
  )
}

// A simple skeleton that looks like the profile layout.
function ProfileSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <Skeleton className="size-24 rounded-full" />
            <div className="w-full space-y-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>

          <div className="mt-6 grid gap-5 border-t border-border pt-6 sm:grid-cols-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full sm:col-span-2" />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <Skeleton className="h-72 w-full rounded-2xl" />
        <Skeleton className="h-36 w-full rounded-2xl" />
      </div>
    </div>
  )
}
