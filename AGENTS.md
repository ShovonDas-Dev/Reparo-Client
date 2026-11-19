<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project notes

Next.js 16.4.6 (App Router) + React 19 + TypeScript app ("Reparo", a repair-services marketplace) with better-auth on MongoDB Atlas. No test suite, no CI. `README.md` is untouched create-next-app boilerplate — ignore it.

## Commands

- `npm run dev` / `npm run build` / `npm run lint`
- No `typecheck` script — use `npx tsc --noEmit` (tsconfig pulls generated types from `.next/dev/types`, so run it after `dev`/`build` has run at least once).
- `lint` runs bare `eslint` (flat config, `eslint.config.mjs`); scope it with `npx eslint app components lib`.
- **Known lint failure (pre-existing):** `hooks/use-mobile.ts` (shadcn-generated) trips `react-hooks/set-state-in-effect`. Everything else is clean — don't chase it.
- There are no tests, so `npm run build` is the real gate: it type-checks and prerenders every route.

## Stack quirks

- Tailwind CSS v4 via `@tailwindcss/turbopack`, configured through Turbopack rules in `next.config.ts` — there is no `tailwind.config.*`; theme tokens (incl. `--sidebar-*`) live in `app/globals.css`. Turbopack is always on (Next 16); don't add webpack config.
- shadcn/ui, style `base-nova` (`components.json`). Add components with `npx shadcn add`; components → `@/components/ui`, icons → lucide, `cn()` → `@/lib/utils` (re-exports the `cn` package). Path alias `@/*` maps to repo root, not `src/` (no `src/` directory).
- This registry uses Base UI, not Radix: components take a `render={<Link href="..." />}` prop instead of `asChild` (see `SidebarMenuButton`, `DropdownMenuItem`).
- `next.config.ts` enables `cacheComponents` — respect the "use cache" / dynamic-IO conventions instead of adding caching workarounds.

## Dashboard (`app/dashboard/layout.tsx`)

- One shared `"use client"` layout: `SidebarProvider` + `AppSidebar` defined **in the same file**. Nav items come from the `ROLE_NAV` map keyed by `session.user.role` obtained via `useSession()` from `@/lib/auth-client`. Roles: `customer | technician | admin`.
- Sidebar subroutes (`/dashboard/customer/bookings`, `/dashboard/admin/users`, …) are intentionally linked but have **no pages yet** — they 404 until built. Only `/dashboard/{admin,customer,technician}` exist. Don't "fix" this by pointing everything at the role root.
- The marketing navbar is hidden on `/dashboard/*` by `components/Navbar/ConditionalLayout.tsx` (wired into `app/layout.tsx`). That's required: the sidebar is `fixed inset-y-0` and would otherwise sit underneath the sticky navbar.
- Never render shadcn's `SidebarMenuSkeleton` on a prerendered page — its `Math.random()` width initializer aborts `next build` with "unstable value `Math.random()`". Plain `Skeleton` rows are fine.
- Visual target for the dashboards: https://fixmate-teal.vercel.app/dashboard/{customer,admin,technician}

## Auth (don't break this)

- Server: `lib/auth.ts` (betterAuth + `mongodbAdapter`, db `Reparo`); client: `lib/auth-client.ts` (exports `useSession`, `signIn`, `signUp`, `authClient` — `signOut` only via `authClient.signOut`); handler route: `app/api/auth/[...all]`.
- `lib/auth.ts` has a `before` hook that blocks self-assigned `admin` roles and whitelists public sign-up roles (`customer`, `technician`) — never bypass or loosen it. `role` is an `additionalFields` user field (defaults to `customer`), so it's typed onto `session.user.role`.
- `.env` (gitignored) currently only defines `DB_USER`, `DB_PASS`. `next build` still exits 0 but prints a `BetterAuthError` (default secret) and a baseURL warning; add `BETTER_AUTH_SECRET` and `BASE_URL` before relying on sign-in/sign-up flows.

## Gotchas

- Static assets live in `Public/` (capital P). Next serves from `public/`; it works locally on case-insensitive Windows but will 404 on case-sensitive Linux deploys. Put new assets in lowercase `public/` and/or rename the folder.
- `*.tsbuildinfo` is gitignored but still used for `tsc --noEmit` incremental state; a stale cache has hidden a real type error that `next build` caught. If the two disagree, delete `tsconfig.tsbuildinfo` and re-run.


# Development Rules

- Work directly in Build mode.
- Inspect only relevant files.
- Avoid unnecessary planning.
- Do not repeatedly read the same files.
- Make code changes as soon as requirements are clear.
- Do not create unnecessary components or files.
- Avoid unnecessary tool calls.
- Never repeat a failed command without changing the approach.
- Run only relevant checks after implementation.
- If the task is clear, complete it without asking unnecessary questions.
- Report completed work and any remaining issues briefly.