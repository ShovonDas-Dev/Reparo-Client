<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project notes

Next.js 16.4.6 (App Router) + React 19 + TypeScript app ("Reparo") with better-auth on MongoDB Atlas. No test suite, no CI.

## Commands

- `npm run dev` / `npm run build` / `npm run lint`
- No `typecheck` script — use `npx tsc --noEmit` (tsconfig pulls generated types from `.next/dev/types`, so run it after `dev`/`build` has run at least once)
- `lint` runs bare `eslint` (flat config, `eslint.config.mjs`)

## Stack quirks

- Tailwind CSS v4 via `@tailwindcss/turbopack`, configured through Turbopack rules in `next.config.ts` — there is no `tailwind.config.*`; theme tokens live in `app/globals.css`. Turbopack is always on (Next 16); don't add webpack config.
- shadcn/ui, style `base-nova` (`components.json`). Add components with `npx shadcn add`; components → `@/components/ui`, icons → lucide, `cn()` → `@/lib/utils`. Path alias `@/*` maps to repo root, not `src/` (no `src/` directory).
- `next.config.ts` enables `cacheComponents` — respect the "use cache" / dynamic-IO conventions instead of adding caching workarounds.

## Auth (don't break this)

- Server: `lib/auth.ts` (betterAuth + `mongodbAdapter`, db `Reparo`); client: `lib/auth-client.ts`; handler route: `app/api/auth/[...all]`.
- `lib/auth.ts` has a `before` hook that blocks self-assigned `admin` roles and whitelists public sign-up roles (`customer`, `technician`) — never bypass or loosen it.
- Required env (`.env`): `BETTER_AUTH_SECRET`, `DB_USER`, `DB_PASS`, `BASE_URL`. Build/dev fails on auth routes without them.

## Gotchas

- Static assets live in `Public/` (capital P). Next serves from `public/`; it works locally on case-insensitive Windows but will 404 on case-sensitive Linux deploys. Put new assets in lowercase `public/` and/or rename the folder.
