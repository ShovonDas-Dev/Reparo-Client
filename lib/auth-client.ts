import { createAuthClient } from "better-auth/react"
import { inferAdditionalFields, jwtClient } from "better-auth/client/plugins"
import type { auth } from "@/lib/auth"

// One shared client. Without a baseURL option it talks to the auth API
// on the same origin (/api/auth), which works in dev and production.
// inferAdditionalFields teaches the client about the custom `role` field
// defined in lib/auth.ts, so it can be sent during sign-up (and stays
// visible on session.user).
export const authClient = createAuthClient({
  // jwtClient adds authClient.token(), which asks for the JWT.
  plugins: [inferAdditionalFields<typeof auth>(), jwtClient()],
})

export const { signIn, signUp, useSession } = authClient
