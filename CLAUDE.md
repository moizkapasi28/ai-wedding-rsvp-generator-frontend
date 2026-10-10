# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Vite dev server
npm run build     # tsc -b (type-check) + vite build — use this to verify changes
npm run lint      # eslint over the whole repo — keep it at 0 errors
npx eslint <files>  # lint only touched files
npm test          # node:test over src/lib/*.test.ts (no framework, no DOM)
```

Tests cover only the import-free helpers in `src/lib` (e.g. `sse.ts`, `pageRange.ts`, `weddingDate.ts`): put logic worth testing in such a file and add a `<name>.test.ts` beside it, importing with the `.ts` extension. Test files are type-checked by `tsconfig.node.json`, not the app config. There are no component tests. CI (`.github/workflows/ci.yml`) runs lint, tests and build.

Env vars are validated at build/dev time by `@julr/vite-plugin-validate-env` against the zod schema in `env.ts` (`VITE_APP_URL` — trailing slash stripped; optional `VITE_GOOGLE_MAPS_API_KEY`). Adding a `VITE_*` var means adding it to `env.ts` and `.env.example`; `node check-env.cjs` checks `.env` against both. Production frontend: https://ai-wedding-rsvp-generator.pages.dev.

## Backend

The API lives in the sibling repo `../ai-wedding-rsvp-generator-backend` (Express + Prisma + BullMQ, separate `npm run worker` process for background jobs). Frontend features usually need matching backend changes; its routes are mounted under `/api/<resource>` (`guest`, `event`, `wedding`, `page-setting`, `invite-card`, `general`, `rsvp`, `auth`), and `VITE_APP_URL` should point at that `/api` base. Responses are shaped `{ success, statusCode, message, data }` (`GenericResponse<T>` in `src/models/generic.ts`).

## Architecture

**Layering per resource** — each domain (guest, event, wedding, pageSetting, inviteCard, rsvp, auth; auth's types are in `user.model.ts`) follows the same stack:
- `src/models/<x>.model.ts` — response/entity types. Request payload types must be `type` aliases, not `interface`, so they satisfy `Record<string, unknown>` in `apiService`.
- `src/api/<x>.service.ts` — singleton class wrapping `apiService` with a `controller` path prefix.
- `src/hooks/use-<x>.ts` — TanStack Query hooks. Each file exports a `*_QUERY_KEY`; mutations invalidate that key and show `react-hot-toast` success/error toasts in `onSuccess`/`onError`.
- `src/validations/<x>.validation.ts` — zod schemas used with react-hook-form (`@hookform/resolvers`).

**HTTP client** (`src/api/api.service.ts`) — thin `fetch` wrapper. Attaches the in-memory access token. On a 401 it exchanges the refresh token at `auth/access-token` (one shared refresh for requests that fail together, since the backend rotates the refresh token on every use), stores the new pair and retries once; if the refresh is refused it dispatches a window `unauthorized` event (handled in `router.tsx` → logout). Thrown errors carry `.status`, `.type` and, on a 429, `.retryAfter` (seconds). `post/put/patch` require a body argument (pass `{}` if none).

**Auth/state**
- Access token: in-memory `tokenStore` (`src/store/token.ts`), synced across tabs via `BroadcastChannel`.
- Persisted jotai atoms (`src/store/store.ts`, localStorage): `userAtom`, `isLoggedInAtom`, `refreshTokenAtom`, `activeWeddingIdAtom`, `activeWeddingAtom`.
- On load, `Router` in `src/router.tsx` exchanges the refresh token for an access token before rendering routes.
- Logout (`useAuth().logout` in `hooks/use-auth.ts`) resets those atoms, leaving other localStorage keys such as the theme, and clears the query cache.
- AI credits: generating an invite card or an RSVP header image spends credits (`AI_CREDIT_COST` in `src/constants/index.ts`, mirroring the backend). Read the balance with `useAiCredits` (from `auth/me`), not from the persisted `userAtom`, which goes stale after each generation.

**Routing** — `src/router.tsx` is the router. Routes are `lazy`-loaded pages from `src/pages`. Logged-in pages sit under a pathless `AppLayout` (sidebar + header); everything except `/weddings` and `/profile` is further wrapped in `RequireWedding`. Almost every in-app page is scoped to the **active wedding** (`activeWeddingIdAtom`), which `AppLayout` auto-selects and the `WeddingSwitcher` changes. `/rsvp/:slug/:token` is the public guest-facing RSVP page (token = per-event `GuestEventInvite.invite_token`, the only thing the API looks up; slug = wedding slug, cosmetic). `Rsvp.tsx` redirects legacy `/rsvp/:token` links and stale slugs to the current slug. Guest-facing URLs (RSVP link, `wa.me` link) are built by the backend (`GET guest/invites/whatsapp` → `rsvp_url`, `whatsapp_url`), not in the frontend.

**Page composition pattern** (see `pages/Guests.tsx`, also Events/Weddings): `<XProvider>` context holds dialog state (`open: "add" | "edit" | "delete" | null`), `currentRow`, and filters → `Page`/`PageHeader` → toolbar + `XPrimaryButtons` → `XList` → `XDialogues`, which renders `XActionDialogue` (add/edit form) and `XDeleteDialogue` based on `open`. Row actions call `setCurrentRow(row); setOpen("edit")`. The page title shown in the header comes from `HeaderContext`.

**Background jobs** — long backend operations (Excel guest import, AI invite card generation) return `202 { jobId }`; hooks poll a status endpoint (`pollJob` in `hooks/use-guest.ts`, `useInviteCardGenerationStatus` in `hooks/use-inviteCard.ts`) until `completed`/`failed`.

**Live updates** — `hooks/use-wedding-live.ts` consumes the backend SSE stream (`wedding/:id/live`) via `fetch` + `lib/sse.ts` parser (EventSource can't send the Bearer header) and invalidates the dashboard query on `rsvp` events.

**UI** — shadcn/ui (`components.json`, style `radix-nova`, primitives in `src/components/ui`, add new ones with the shadcn CLI) on Tailwind v4 (`src/index.css`, no tailwind config file). Icons: `lucide-react`. `@/` aliases `src/`. Dark theme is the default (`ThemeProvider`). Dropdown option lists for AI card/page settings and sidebar nav live in `src/constants/index.ts`; `DIETARY_OPTIONS` values intentionally mirror the backend enum's `NON_VEGETARAIN` misspelling.

## Conventions

- Deliberate shortcuts are marked with `// ponytail:` comments naming the limitation and upgrade path.
- Component files are PascalCase in `src/components` (note existing typos in names like `SerachBar.tsx`, `ForgotPasswod.tsx` — import them as-is).
