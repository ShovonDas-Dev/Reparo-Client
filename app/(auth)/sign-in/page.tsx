"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import { buttonVariants } from "@/components/Navbar/button"
import { cn } from "@/lib/utils"
import { signIn, useSession } from "@/lib/auth-client"
import { PasswordInput } from "../_components/password-input"
import { FormMessage } from "../_components/form-message"
import { inputClass, labelClass, fieldErrorClass } from "../_components/form-styles"

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function SignInPage() {
  const router = useRouter()
  const { data: session, isPending } = useSession()

  // form fields
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(true)

  // form feedback
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string
    password?: string
  }>({})
  const [serverError, setServerError] = useState("")
  const [info, setInfo] = useState("")
  const [success, setSuccess] = useState("")
  const [submitting, setSubmitting] = useState(false)

  // already signed in? go to the home page instead of showing this form
  useEffect(() => {
    if (!isPending && session) router.replace("/")
  }, [isPending, session, router])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setServerError("")
    setInfo("")

    // simple client-side validation before calling the API
    const errors: { email?: string; password?: string } = {}
    if (!email.trim()) {
      errors.email = "Email is required."
    } else if (!EMAIL_PATTERN.test(email.trim())) {
      errors.email = "Please enter a valid email address."
    }
    if (!password) {
      errors.password = "Password is required."
    }
    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) return

    setSubmitting(true)

    // Better Auth creates the session cookie on success
    const { error: authError } = await signIn.email({
      email: email.trim(),
      password,
      rememberMe,
    })

    if (authError) {
      setServerError(authError.message || "Could not sign in. Please try again.")
      setSubmitting(false)
      return
    }

    setSuccess("Signed in successfully! Taking you to the home page…")
    setTimeout(() => router.replace("/"), 700)
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Sign in to your Reparo account.
      </p>

      <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-4">
        {serverError && <FormMessage type="error">{serverError}</FormMessage>}
        {info && <FormMessage type="info">{info}</FormMessage>}
        {success && <FormMessage type="success">{success}</FormMessage>}

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
          <div className="mb-1.5 flex items-center justify-between">
            <label htmlFor="password" className={labelClass}>
              Password
            </label>
            <button
              type="button"
              onClick={() =>
                setInfo("Password reset is not available yet. Please contact support.")
              }
              className="text-[13px] font-medium text-ring transition-colors hover:text-foreground"
            >
              Forgot password?
            </button>
          </div>
          <PasswordInput
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your password"
          />
          {fieldErrors.password && (
            <p className={fieldErrorClass}>{fieldErrors.password}</p>
          )}
        </div>

        <label className="flex cursor-pointer items-center gap-2 text-[13px] text-muted-foreground select-none">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="size-4 rounded accent-[#8cae48]"
          />
          Remember me for 30 days
        </label>

        <button
          type="submit"
          disabled={submitting}
          className={cn(buttonVariants(), "h-11 w-full justify-center rounded-md text-sm font-semibold")}
        >
          {submitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Signing in…
            </>
          ) : (
            "Sign in"
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href="/sign-up"
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Create one
        </Link>
      </p>
    </div>
  )
}
