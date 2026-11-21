"use client"

import Image from "next/image"
import { CalendarDays, Mail, MapPin, Pencil, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Profile } from "@/lib/API/profile"

// A different colour for each role.
const ROLE_STYLES: Record<Profile["role"], string> = {
  customer: "bg-[#eef5e3] text-[#4f6b2e] dark:bg-[#2a3a22] dark:text-[#a8cf5f]",
  technician:
    "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
  admin: "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300",
}

const ROLE_LABELS: Record<Profile["role"], string> = {
  customer: "Customer",
  technician: "Technician",
  admin: "Admin",
}

// Turn "Rahim Uddin" into "RU" for the fallback avatar.
function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

// Format the joined date in a friendly way.
function formatDate(date?: string) {
  if (!date) return ""

  const parsed = new Date(date)
  if (Number.isNaN(parsed.getTime())) return ""

  return parsed.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

type ProfileCardProps = {
  profile: Profile
  onEdit: () => void
}

// Shows the profile picture, name, role and contact details.
export default function ProfileCard({ profile, onEdit }: ProfileCardProps) {
  const joined = formatDate(profile.createdAt)

  return (
    <section className="rounded-2xl border border-border bg-card p-6 sm:p-8">
      {/* Picture, name, role badge and the edit button */}
      <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-start sm:text-left">
        {profile.image ? (
          <Image
            src={profile.image}
            alt={profile.name}
            width={96}
            height={96}
            className="size-24 shrink-0 rounded-full border border-border object-cover"
          />
        ) : (
          <div className="grid size-24 shrink-0 place-items-center rounded-full bg-muted text-2xl font-semibold text-muted-foreground">
            {getInitials(profile.name)}
          </div>
        )}

        <div className="min-w-0">
          <h2 className="font-heading text-xl font-semibold tracking-tight">
            {profile.name}
          </h2>

          <span
            className={`mt-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${ROLE_STYLES[profile.role]}`}
          >
            {ROLE_LABELS[profile.role]}
          </span>

          {joined && (
            <p className="mt-2 flex items-center justify-center gap-1.5 text-xs text-muted-foreground sm:justify-start">
              <CalendarDays className="size-3.5" />
              Joined {joined}
            </p>
          )}
        </div>

        <Button
          variant="outline"
          onClick={onEdit}
          className="gap-2 sm:ml-auto"
        >
          <Pencil className="size-4" />
          Edit Profile
        </Button>
      </div>

      {/* Contact details. Empty phone / address show a gentle hint. */}
      <dl className="mt-6 grid gap-5 border-t border-border pt-6 sm:grid-cols-2">
        <div>
          <dt className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            <Mail className="size-3.5" />
            Email
          </dt>
          <dd className="mt-1 break-all text-sm">{profile.email}</dd>
        </div>

        <div>
          <dt className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            <Phone className="size-3.5" />
            Phone
          </dt>
          <dd className="mt-1 text-sm">
            {profile.phone ? (
              profile.phone
            ) : (
              <span className="italic text-muted-foreground">Not added yet</span>
            )}
          </dd>
        </div>

        <div className="sm:col-span-2">
          <dt className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            <MapPin className="size-3.5" />
            Address
          </dt>
          <dd className="mt-1 break-words text-sm">
            {profile.address ? (
              profile.address
            ) : (
              <span className="italic text-muted-foreground">Not added yet</span>
            )}
          </dd>
        </div>
      </dl>
    </section>
  )
}
