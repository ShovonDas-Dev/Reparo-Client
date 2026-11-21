import "server-only"

import { headers } from "next/headers"
import { auth } from "@/lib/auth"

// Ask Better Auth for a JWT on the server.
// Used by async server pages before calling the protected backend routes.
export async function getServerToken(): Promise<string> {
  const result = await auth.api.getToken({
    headers: await headers(),
  })

  return result.token ?? ""
}
