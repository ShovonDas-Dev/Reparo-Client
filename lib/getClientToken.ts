"use client"

import { authClient } from "@/lib/auth-client"

// Ask Better Auth for a JWT for the signed-in user.
// Returns "" when nobody is signed in (the backend then answers 401).
export async function getClientToken(): Promise<string> {
  const { data } = await authClient.token()

  return data?.token ?? ""
}
