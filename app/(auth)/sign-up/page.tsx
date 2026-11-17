"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { ChevronDown, Loader2 } from "lucide-react"
import { buttonVariants } from "@/components/Navbar/button"
import { cn } from "@/lib/utils"
import { signUp, useSession } from "@/lib/auth-client"
import { PasswordInput } from "../_components/password-input"
import { FormMessage } from "../_components/form-message"
import { inputClass, labelClass, fieldErrorClass } from "../_components/form-styles"

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Better Auth's default minimum password length is 8 characters.
const MIN_PASSWORD_LENGTH = 8

// The three roles shown in the dropdown. "admin" is only a visible option —
// the server rejects it during signup (see lib/auth.ts).
const ROLE_OPTIONS = [
  { value: "customer", label: "Customer" },
  { value: "technician", label: "Technician" },
  { value: "admin", label: "Admin" },
]

export default function SignUpPage() {
  const router = useRouter()
  const { data: session, isPending } = useSession()

  // form fields
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [role, setRole] = useState("customer")
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  // form feedback
  const [fieldErrors, setFieldErrors] = useState<{
    fullName?: string
    email?: string
    password?: string
    confirmPassword?: string
    role?: string
    terms?: string
  }>({})
  const [serverError, setServerError] = useState("")
  const [success, setSuccess] = useState("")
  const [submitting, setSubmitting] = useState(false)

  // already signed in? go to the home page instead of showing this form
  useEffect(() => {
    if (!isPending && session) router.replace("/")
  }, [isPending, session, router])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setServerError("")

    // simple client-side validation before calling the API
    const errors: typeof fieldErrors = {}
    if (!fullName.trim()) {
      errors.fullName = "Full name is required."
    }
    if (!email.trim()) {
      errors.email = "Email is required."
    } else if (!EMAIL_PATTERN.test(email.trim())) {
      errors.email = "Please enter a valid email address."
    }
    if (!password) {
      errors.password = "Password is required."
    } else if (password.length < MIN_PASSWORD_LENGTH) {
      errors.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`
    }
    if (confirmPassword !== password) {
      errors.confirmPassword = "Passwords do not match."
    }
    if (!ROLE_OPTIONS.some((option) => option.value === role)) {
      errors.role = "Please choose a valid role."
    }
    if (!agreedToTerms) {
      errors.terms = "Please accept the Terms and Privacy Policy."
    }
    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) return

    setSubmitting(true)

    // the selected role is sent to Better Auth and saved on the user record
    // (after the server-side check in lib/auth.ts).
    const { error: authError } = await signUp.email({
      name: fullName.trim(),
      email: email.trim(),
      password,
      role,
    })

    if (authError) {
      setServerError(authError.message || "Could not create your account. Please try again.")
      setSubmitting(false)
      return
    }

    setSuccess("Account created! Taking you to the home page…")
    setTimeout(() => router.replace("/"), 700)
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Create your account</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Join Reparo to book repairs or offer your services.
      </p>

      <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-4">
        {serverError && <FormMessage type="error">{serverError}</FormMessage>}
        {success && <FormMessage type="success">{success}</FormMessage>}

        <div>
          <label htmlFor="fullName" className={labelClass}>
            Full name
          </label>
          <input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Jane Cooper"
            autoComplete="name"
            className={inputClass}
          />
          {fieldErrors.fullName && (
            <p className={fieldErrorClass}>{fieldErrors.fullName}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className={labelClass}>
            Email address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            className={inputClass}
          />
          {fieldErrors.email && (
            <p className={fieldErrorClass}>{fieldErrors.email}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className={labelClass}>
            Password
          </label>
          <PasswordInput
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters"
            autoComplete="new-password"
          />
          {fieldErrors.password && (
            <p className={fieldErrorClass}>{fieldErrors.password}</p>
          )}
        </div>

        <div>
          <label htmlFor="confirmPassword" className={labelClass}>
            Confirm password
          </label>
          <PasswordInput
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repeat your password"
            autoComplete="new-password"
          />
          {fieldErrors.confirmPassword && (
            <p className={fieldErrorClass}>{fieldErrors.confirmPassword}</p>
          )}
        </div>

        <div>
          <label htmlFor="role" className={labelClass}>
            I am joining as
          </label>
          <div className="relative">
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className={cn(inputClass, "cursor-pointer appearance-none pr-10")}
            >
              {ROLE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          </div>
          {fieldErrors.role && (
            <p className={fieldErrorClass}>{fieldErrors.role}</p>
          )}
        </div>

        <div>
          <label className="flex cursor-pointer items-start gap-2 text-[13px] leading-relaxed text-muted-foreground select-none">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-0.5 size-4 rounded accent-[#8cae48]"
            />
            <span>
              I agree to the{" "}
              <span className="text-foreground underline underline-offset-2">
                Terms of Service
              </span>{" "}
              and{" "}
              <span className="text-foreground underline underline-offset-2">
                Privacy Policy
              </span>
              .
            </span>
          </label>
          {fieldErrors.terms && (
            <p className={fieldErrorClass}>{fieldErrors.terms}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className={cn(buttonVariants(), "h-11 w-full justify-center rounded-md text-sm font-semibold")}
        >
          {submitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Creating account…
            </>
          ) : (
            "Create account"
          )}
        </button>

        <p className="text-center text-xs leading-relaxed text-muted-foreground">
          By creating an account, you agree to Reparo&apos;s Terms of Service and
          Privacy Policy.
        </p>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/sign-in"
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  )
}
