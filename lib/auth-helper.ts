"use client"

import { authClient } from "@/lib/auth-client"

// The only place that knows how the current user is identified.
// When real JWT auth is added later, change this function and every page
// that uses it keeps working the same way.
export async function getCurrentEmail(): Promise<string | null> {
  const { data } = await authClient.getSession()

  // No session means nobody is signed in.
  return data?.user?.email ?? null
}
