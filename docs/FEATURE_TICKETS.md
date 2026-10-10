# Frontend Feature Tickets

Actionable tickets for the already-built web app (React + Vite + TanStack Query + shadcn/ui), written on 2026-10-01 from evidence in the code: `ponytail:` comments, dead code, leftover `console.log`s, missing infrastructure, frontend/backend drift, and the last ~60 commits. The backend list lives in [`../../ai-wedding-rsvp-generator-backend/docs/FEATURE_TICKETS.md`](../../ai-wedding-rsvp-generator-backend/docs/FEATURE_TICKETS.md) (IDs `BE-xxx`).

## How to use this list

- Pick one ticket per session. Each one is meant to be independently actionable; read its Context links first, then do the Scope, then tick the Acceptance criteria.
- Follow the layering in [`../CLAUDE.md`](../CLAUDE.md) (model → `api/*.service.ts` → `hooks/use-*.ts` with a `*_QUERY_KEY` → zod validation → page composition with `XProvider`/`XDialogues`).
- Verify with `npm run build` (type-check + build) and `npx eslint <touched files>` (the repo is at 0 errors, 3 warnings today). Until FE-024 lands there is no test runner.
- Cross-repo tickets: the owning repo holds the main ticket; the other repo has a linked counterpart. Land the backend half first unless the ticket says otherwise.
- "Enhancement (proposed)" means the code clearly points at the extension (a ponytail upgrade path, a "being built" landing section, a backend roadmap) but it still needs a product decision before building.
- Line links point at the code as of commit `28498f5`; search for the quoted symbol if a link has drifted.

**Priority:** P0 = bug or security issue to fix now · P1 = important · P2 = nice-to-have.
**Size:** S = up to half a day · M = up to 2 days · L = more than 2 days.
**IDs:** `FE-` for this repo, `BE-` for the backend repo. "Depends on" lists tickets that should land first (or together, for cross-repo pairs).

## Summary

| ID | Title | Type | Priority | Size | Depends on |
|---|---|---|---|---|---|
| FE-001 | Fix mid-session access-token refresh (users are logged out after 15 min) | Bug | P0 | S | - |
| FE-002 | Sign-out always clears the local session and the query cache | Bug | P1 | S | BE-004 |
| FE-003 | Remove the unused cookie-auth flag | Tech debt | P2 | S | - |
| FE-004 | Guest import accepts only the `.xlsx` template | Bug | P2 | S | BE-008 |
| FE-005 | Show guest import progress | Enhancement | P2 | S | - |
| FE-006 | Form validation parity with backend schemas | Tech debt | P2 | S | BE-010 |
| FE-007 | Background guest export client | Enhancement (proposed) | P2 | S | BE-012 |
| FE-008 | Delete dialogs: wait for the request and refresh every dependent view | Bug | P2 | S | - |
| FE-009 | Wedding timezone field | Enhancement (proposed) | P2 | S | BE-015 |
| FE-010 | RSVP page: tell "invalid link" apart from temporary errors | Bug | P1 | S | - |
| FE-011 | Tie the signed view-URL cache to the real expiry | Bug | P2 | S | BE-016 |
| FE-012 | Type and size guards on RSVP illustration and profile photo uploads | Enhancement | P2 | S | - |
| FE-013 | Invite card page error state | Bug | P2 | S | - |
| FE-014 | Back off generation-status polling and handle 429 | Bug | P1 | S | BE-028 |
| FE-015 | Read AI credit costs from the API | Tech debt | P2 | S | BE-023 |
| FE-016 | Invite card version history picker | Enhancement (proposed) | P2 | M | BE-022 |
| FE-017 | Undo "mark sent" / "mark reminded" | Enhancement | P2 | S | BE-026 |
| FE-018 | Keep "x minutes ago" on Recent RSVPs current | Enhancement | P2 | S | - |
| FE-019 | Distinct colours for every dietary slice | Enhancement | P2 | S | - |
| FE-020 | QR code check-in: guest QR and host scanner | Enhancement (proposed) | P2 | M | BE-029 |
| FE-021 | Landing and pricing copy only claims what ships | Bug | P1 | S | - |
| FE-022 | Show plan limits and upgrade prompts | Enhancement (proposed) | P2 | S | BE-025 |
| FE-023 | CI: lint and build on every push | Infra | P1 | S | - |
| FE-024 | Add `npm test` for the import-free `lib/` helpers | Infra | P2 | S | - |
| FE-025 | Error monitoring for the web app | Infra | P2 | M | - |
| FE-026 | Delete dead files and `console.log`s; add a `no-console` lint rule | Tech debt | P2 | S | - |
| FE-027 | One image-cropping helper and component | Tech debt | P2 | S | - |
| FE-028 | Fix CLAUDE.md drift | Tech debt | P2 | S | - |

Totals: 28 tickets. P0: 1 · P1: 5 · P2: 22.

---

## Auth

### FE-001 Fix mid-session access-token refresh (users are logged out after 15 min)

**Type:** Bug · **Priority:** P0 · **Size:** S · **Depends on:** -

**Context**
- Access tokens live 15 minutes (`JWT_ACCESS_EXPIRATION_MINUTES=15`, backend [`.env.example:13`](../../ai-wedding-rsvp-generator-backend/.env.example#L13)). When a request gets 401, [`api.service.ts:49-98`](../src/api/api.service.ts#L49) calls `auth/access-token` and then reads `refreshData.data?.tokens?.access` ([`:67`](../src/api/api.service.ts#L67)). The endpoint returns `data: { access, refresh }` with no `tokens` wrapper (backend [`token.service.ts:54-63`](../../ai-wedding-rsvp-generator-backend/src/services/token.service.ts#L54); the boot path in [`router.tsx:249-255`](../src/router.tsx#L249) and `GenerateNewTokenResponse` in [`user.model.ts`](../src/models/user.model.ts) use the right shape). So the new access token is never stored, the retry reuses the dead token, gets 401, and the app dispatches `unauthorized` and logs the user out.
- The rotated refresh token is not saved either, and the backend deletes all of the user's old tokens on refresh ([`auth.service.ts:256`](../../ai-wedding-rsvp-generator-backend/src/services/auth.service.ts#L256)), so even a fixed access token would fail on the next refresh.
- Several queries failing at once each start their own refresh; the first one invalidates the others' refresh token.
- The live dashboard stream relies on this path to recover ([`use-wedding-live.ts:65-66`](../src/hooks/use-wedding-live.ts#L65)).

**Scope**
- In [`src/api/api.service.ts`](../src/api/api.service.ts): read `refreshData.data.access` / `.refresh`, call `tokenStore.setAccessToken(access)`, and persist `refresh.token` to the `refreshTokenAtom` storage key (use jotai's `getDefaultStore().set(refreshTokenAtom, ...)` so React state stays in sync).
- Make the refresh single-flight: keep one module-level in-flight promise that concurrent 401s await.
- Read the refresh token through the same store instead of hand-parsing `localStorage.getItem("refreshToken")`.
- Optional: use `tokenStore.getExpiresAt()` to refresh proactively shortly before expiry.

**Acceptance criteria**
- [x] With the backend at `JWT_ACCESS_EXPIRATION_MINUTES=1`, stay idle 70 s, then navigate: data loads, no sign-out, exactly one `POST /auth/access-token` in the network tab.
- [x] After that refresh, `localStorage.refreshToken` holds the new token, and a second expiry cycle also succeeds.
- [x] Three queries that 401 together trigger one refresh request.
- [x] If the refresh itself fails, the user lands on `/signin` once (one `unauthorized` event).
- [ ] The dashboard live indicator returns to "live" after an expiry.

**Notes/risks**
- Two tabs refreshing at the same moment can still race until BE-005 (per-session tokens) lands; the `BroadcastChannel` in [`store/token.ts`](../src/store/token.ts) shares the access token, not the in-flight refresh.

### FE-002 Sign-out always clears the local session and the query cache

**Type:** Bug · **Priority:** P1 · **Size:** S · **Depends on:** BE-004

**Context**
- [`useLogout`, `use-auth.ts:156-178`](../src/hooks/use-auth.ts#L156) only clears local state in `onSuccess`. If `POST /auth/logout` fails (an expired refresh token currently makes the backend return 500, BE-004), the user sees an error toast and stays signed in.
- `logout()` ([`use-auth.ts:38-44`](../src/hooks/use-auth.ts#L38)) runs `localStorage.clear()`, which also wipes the theme preference (`vite-ui-theme`), but leaves the TanStack Query cache in memory; the comment at [`use-auth.ts:185-186`](../src/hooks/use-auth.ts#L185) notes that logout keeps the cache, so a second account signing in in the same tab can briefly see the previous account's cached data.

**Scope**
- Clear local session in `onSettled` (success or failure) and navigate to `/signin`.
- Remove only the auth/session keys (the jotai atoms in [`store/store.ts`](../src/store/store.ts)) instead of `localStorage.clear()`.
- Call `queryClient.clear()` on logout (also for the `unauthorized` event path in [`router.tsx:234-242`](../src/router.tsx#L234)).

**Acceptance criteria**
- [x] With the backend logout returning an error, clicking Sign out still lands on `/signin` with no session in storage.
- [x] The chosen theme survives sign-out.
- [x] Signing in as user B after user A in the same tab shows no data from A (check the Guests page before the first fetch completes).

**Notes/risks**
- None.

### FE-003 Remove the unused cookie-auth flag

**Type:** Tech debt · **Priority:** P2 · **Size:** S · **Depends on:** -

**Context**
- `VITE_COOKIE_BASED_AUTHENTICATION` ([`env.ts:16-18`](../env.ts#L16), [`.env.example`](../.env.example)) branches token handling in [`api.service.ts:56`](../src/api/api.service.ts#L56), [`:67`](../src/api/api.service.ts#L67) and [`use-auth.ts:57`](../src/hooks/use-auth.ts#L57), [`:164`](../src/hooks/use-auth.ts#L164). The backend never sets cookies (it only mounts `cookieParser`, [`index.ts:42`](../../ai-wedding-rsvp-generator-backend/src/index.ts#L42), and reads the refresh token from the body), so `true` would silently break auth.

**Scope**
- Remove the variable from `env.ts`, `.env.example`, `check-env.cjs` expectations and all branches; keep the body-token behaviour.

**Acceptance criteria**
- [ ] `grep -rn COOKIE_BASED` returns nothing; `npm run build` passes; sign-in, refresh (after FE-001) and sign-out work.

**Notes/risks**
- If httpOnly-cookie refresh tokens are wanted later, that is a new cross-repo ticket.

## Guests

### FE-004 Guest import accepts only the `.xlsx` template

**Type:** Bug · **Priority:** P2 · **Size:** S · **Depends on:** BE-008

**Context**
- The picker accepts `.xlsx, .xls` and the error says "Upload an .xlsx or .xls file" ([`GuestPrimaryButtons.tsx:60-81`](../src/components/GuestPrimaryButtons.tsx#L60)). The backend parses with `read-excel-file` (xlsx only) and requires the downloaded template's `_meta` sheet ([`guest.service.ts:628-676`](../../ai-wedding-rsvp-generator-backend/src/services/guest.service.ts#L628)), so `.xls` and arbitrary spreadsheets fail only after the job is polled.

**Scope**
- `accept=".xlsx"`, update the extension check and message ("Upload the .xlsx template you downloaded").
- Show the backend's synchronous 400 message (BE-008) as the toast.

**Acceptance criteria**
- [ ] `.xls`/`.csv` files are rejected in the browser with a message pointing to the template download.
- [ ] A valid template imports as before.

**Notes/risks**
- Landing copy promising CSV is FE-021.

### FE-005 Show guest import progress

**Type:** Enhancement · **Priority:** P2 · **Size:** S · **Depends on:** -

**Context**
- The worker reports progress ([`guest.service.ts:832-834`](../../ai-wedding-rsvp-generator-backend/src/services/guest.service.ts#L832)) and the status endpoint returns it (`progress` in [`guest.model.ts:83`](../src/models/guest.model.ts#L83)), but `pollJob` ([`use-guest.ts:189-211`](../src/hooks/use-guest.ts#L189)) ignores it, so a large import shows a spinner with no feedback for up to 5 minutes.
- Ponytail at [`use-guest.ts:200`](../src/hooks/use-guest.ts#L200): fixed 30 s "worker not running" and 5 min "taking too long" timeouts.

**Scope**
- Let `pollJob` accept an `onProgress` callback; show "Importing… 40%" in the import button or a toast that updates.
- Reset the 5-minute timeout whenever progress increases (a slow but moving job is not stuck); keep the 30 s "waiting" check.

**Acceptance criteria**
- [ ] Importing a 300-row template shows increasing percentages.
- [ ] A job that keeps progressing past 5 minutes is not reported as "taking too long".
- [x] With the worker stopped, the "Is the backend worker running?" error still appears after ~30 s.

**Notes/risks**
- Remove the ponytail comment if the timeout becomes progress-based.

### FE-006 Form validation parity with backend schemas

**Type:** Tech debt · **Priority:** P2 · **Size:** S · **Depends on:** BE-010

**Context**
- Mismatches that surface as server 400s or as rules the server does not enforce:
  - Event address: `max(250)` in [`event.validation.ts:46-49`](../src/validations/event.validation.ts#L46) vs `max(200)` in the backend ([`event.validations.ts:71-72`](../../ai-wedding-rsvp-generator-backend/src/validations/event.validations.ts#L71)): 201–250 characters pass the form and fail the API.
  - Bride name: `min(3)` in [`wedding.validation.ts:13`](../src/validations/wedding.validation.ts#L13) vs `min(1)` for the backend and for the groom name.
  - Guest accommodation address: no max in [`guest.validation.ts:51`](../src/validations/guest.validation.ts#L51) vs `max(250)` in the backend.
  - Wedding message: `max(250)` in the form, no limit in the backend (fix on the backend side or accept).

**Scope**
- Align each field to the backend rule (or ask for the backend to change, noted in BE-010). Keep messages human.

**Acceptance criteria**
- [ ] For every field above, a value accepted by the form is accepted by the API and vice versa (check by submitting boundary values).

**Notes/risks**
- Sharing schemas between repos would remove this class of drift but needs a shared package; out of scope.

### FE-007 Background guest export client

**Type:** Enhancement (proposed) · **Priority:** P2 · **Size:** S · **Depends on:** BE-012

**Context**
- `useExportGuestList` ([`use-guest.ts:149-183`](../src/hooks/use-guest.ts#L149)) downloads the workbook synchronously. BE-012 proposes an `export-excel` job on the guest queue.

**Scope**
- If BE-012 ships: start the export, reuse `pollJob`, then download via a view URL from the job result.

**Acceptance criteria**
- [ ] Export of a large list shows progress and downloads the file when done; errors show a toast.

**Notes/risks**
- Only if BE-012 is accepted.

## Events and weddings

### FE-008 Delete dialogs: wait for the request and refresh every dependent view

**Type:** Bug · **Priority:** P2 · **Size:** S · **Depends on:** -

**Context**
- [`EventDeleteDialogue.tsx:35`](../src/components/EventDeleteDialogue.tsx#L35), [`GuestDeleteDialogue.tsx:34`](../src/components/GuestDeleteDialogue.tsx#L34) and [`WeddingDeleteDialogue.tsx:34`](../src/components/WeddingDeleteDialogue.tsx#L34) call `mutateAsync` without awaiting and close immediately: a failure becomes an unhandled promise rejection and the dialog is gone before the result.
- `useDeleteEvent` falls back to "Wedding Deleted Successfully" ([`use-event.ts:124`](../src/hooks/use-event.ts#L124)) and does not invalidate the dashboard or invite-card queries; guests use the shared `invalidateGuestData` ([`use-guest.ts:22-32`](../src/hooks/use-guest.ts#L22)), events and weddings do not.
- [`EventDialogues.tsx:29-32`](../src/components/EventDialogues.tsx#L29) passes an `onConfirm` that only does `console.log("Event delete confirmed")`; the dialog never calls it.

**Scope**
- Use `mutate` with `onSuccess: close`, disable the confirm button while pending.
- Fix the event toast text; invalidate `wedding-dashboard` and invite-card keys after event delete.
- Remove the dead `onConfirm` prop and the `console.log`.

**Acceptance criteria**
- [x] With the API returning 500, the delete dialog stays open, shows the error toast and logs no unhandled rejection.
- [x] Deleting an event updates the dashboard counts and the invite-card event bar without a reload.

**Notes/risks**
- Recent commit `e181833` fixed the same "counts not refreshed" class for guests; follow its pattern.

### FE-009 Wedding timezone field

**Type:** Enhancement (proposed) · **Priority:** P2 · **Size:** S · **Depends on:** BE-015

**Context**
- The backend formats RSVP deadlines in messages and buckets the dashboard week in UTC/server time (ponytails in BE-015). The wedding form has no timezone.

**Scope**
- Add a timezone select to [`WeddingActionDialogue.tsx`](../src/components/WeddingActionDialogue.tsx), defaulting to `Intl.DateTimeFormat().resolvedOptions().timeZone`; add it to [`wedding.validation.ts`](../src/validations/wedding.validation.ts) and the model.

**Acceptance criteria**
- [ ] New weddings send the browser's timezone; editing shows and saves the stored value.

**Notes/risks**
- Only if BE-015 is accepted.

## Page settings and RSVP

### FE-010 RSVP page: tell "invalid link" apart from temporary errors

**Type:** Bug · **Priority:** P1 · **Size:** S · **Depends on:** -

**Context**
- The public guest page shows "This invitation link isn't valid… ask the couple to send it again" for any error ([`Rsvp.tsx:20-32`](../src/pages/Rsvp.tsx#L20)), and `useGetRsvp` never retries ([`use-rsvp.ts:14-20`](../src/hooks/use-rsvp.ts#L14)). A 429 from the rate limiters (BE-028), a 5xx, or a flaky mobile connection tells a guest their invitation is broken, which is the most damaging message this app can show.

**Scope**
- Use the `status` that `api.service` attaches: 404 (or 400 for a malformed token) keeps the current message; anything else shows "We couldn't load your invitation right now" with a Try again button (`refetch`).
- Allow `retry` for non-4xx errors.

**Acceptance criteria**
- [x] A random UUID token shows the invalid-link message.
- [x] With the API stopped, the page shows the temporary-error message and Try again recovers once the API is back.
- [x] A 429 shows the temporary-error message.

**Notes/risks**
- Keep the page free of app chrome; it is the couple's page.

### FE-011 Tie the signed view-URL cache to the real expiry

**Type:** Bug · **Priority:** P2 · **Size:** S · **Depends on:** BE-016

**Context**
- Ponytail at [`use-pageSetting.ts:131`](../src/hooks/use-pageSetting.ts#L131): `staleTime` is 5 minutes and "assumes signed URLs live longer than 5 min". The backend signs view URLs with the upload expiry, 300 s (BE-016), so the assumption is broken at the boundary and images can 403 when a cached URL is reused.

**Scope**
- After BE-016 returns `expires_at`, set `staleTime`/`refetchInterval` from it (e.g. refresh one minute before expiry). Remove the ponytail.

**Acceptance criteria**
- [ ] With the backend view expiry set to 120 s, an image left on screen and re-rendered after 3 minutes still loads.

**Notes/risks**
- `useGenerateViewUrl` (mutation-based) callers in `InviteCardMain`/`PageSettingsIllustration` have the same issue; move them to `useGetViewUrl` where possible.

### FE-012 Type and size guards on RSVP illustration and profile photo uploads

**Type:** Enhancement · **Priority:** P2 · **Size:** S · **Depends on:** -

**Context**
- Invite card uploads restrict type and size (`accept="image/jpeg,image/png,image/webp"` in [`CharacterPhotoForm.tsx:69`](../src/components/CharacterPhotoForm.tsx#L69), 20 MB check at [`InviteCardMain.tsx:50-65`](../src/components/InviteCardMain.tsx#L50)), but the RSVP illustration source ([`PageSettingsIllustration.tsx:656`](../src/components/PageSettingsIllustration.tsx#L656)) and profile photo ([`ViewProfile.tsx:241`](../src/pages/ViewProfile.tsx#L241)) accept `image/*` of any size. The illustration source goes straight to Gemini without server-side normalisation (BE-017), so HEIC or huge files fail late and cost a generation attempt.

**Scope**
- Same accept list and a size check (reuse one helper/constant from `InviteCardMain.tsx`) for both inputs, with an inline error.

**Acceptance criteria**
- [ ] A `.heic` or 25 MB file is rejected before upload with a clear message on both screens.
- [ ] JPEG/PNG/WebP under the limit upload as before.

**Notes/risks**
- If BE-020 adds HEIC decoding, relax the list for AI inputs.

## AI invite cards

### FE-013 Invite card page error state

**Type:** Bug · **Priority:** P2 · **Size:** S · **Depends on:** -

**Context**
- [`InviteCardMain.tsx:135-136`](../src/components/InviteCardMain.tsx#L135) ignores `isError`. On a failed load, `events` is empty and `data?.pages` is undefined, so neither the skeleton ([`:562`](../src/components/InviteCardMain.tsx#L562)) nor `NoEventsState` renders and the user gets an empty editor. Other list pages handle this ([`EventList.tsx:100`](../src/components/EventList.tsx#L100), [`PageSettingMain.tsx:178`](../src/components/PageSettingMain.tsx#L178)).

**Scope**
- Add an error branch with a retry, matching the pattern and copy of `PageSettingMain`.

**Acceptance criteria**
- [x] With `GET /invite-card/cards/:weddingId` failing, the page shows an error with Try again, and retry recovers.

**Notes/risks**
- None.

### FE-014 Back off generation-status polling and handle 429

**Type:** Bug · **Priority:** P1 · **Size:** S · **Depends on:** BE-028

**Context**
- `useInviteCardGenerationStatus` polls every 3 s while a card is QUEUED/PROCESSING ([`use-inviteCard.ts:61-66`](../src/hooks/use-inviteCard.ts#L61)). A generation can run several minutes (two Gemini stages at up to 120 s each, retries with 30 s/90 s backoff), which alone approaches the backend's global limit of 100 requests per 15 minutes per IP ([`rateLimiter.middleware.ts:24-40`](../../ai-wedding-rsvp-generator-backend/src/middlewares/rateLimiter.middleware.ts#L24)). A 429 then breaks every other page for the same household.

**Scope**
- Poll at 3 s for the first 30 s, then 10 s (e.g. derive from `query.state.dataUpdateCount` or elapsed time).
- On a 429 from the status query, wait for `Retry-After`/`RateLimit-Reset` (the limiter sends standard headers) instead of retrying immediately.

**Acceptance criteria**
- [x] A 4-minute generation makes fewer than 35 status requests.
- [x] A simulated 429 pauses polling and then resumes; the card status still updates to COMPLETED.

**Notes/risks**
- BE-028 raises the limit; this ticket keeps the client polite regardless.

### FE-015 Read AI credit costs from the API

**Type:** Tech debt · **Priority:** P2 · **Size:** S · **Depends on:** BE-023

**Context**
- [`constants/index.ts:36-40`](../src/constants/index.ts#L36) "Mirrors AI_CREDIT_COST in the backend's credits.service.ts"; used by [`AppSidebar.tsx:29`](../src/components/AppSidebar.tsx#L29) and [`InviteCardMain.tsx:15`](../src/components/InviteCardMain.tsx#L15). A backend price change shows wrong costs until the frontend redeploys.

**Scope**
- Read costs from `/auth/me` (BE-023) through `useUserProfile`; keep the constant as a fallback while loading.

**Acceptance criteria**
- [ ] Changing the backend cost changes the displayed cost after a profile refetch, with no frontend deploy.

**Notes/risks**
- None.

### FE-016 Invite card version history picker

**Type:** Enhancement (proposed) · **Priority:** P2 · **Size:** M · **Depends on:** BE-022

**Context**
- Each generation overwrites the event's card; the backend spec roadmap lists "variations, history" as a later sub-project (BE-022). The preview is [`DesignPreviewCard.tsx`](../src/components/DesignPreviewCard.tsx).

**Scope**
- A thumbnail strip of previous versions under the preview, with "Use this version" calling the restore endpoint and invalidating invite-card and guest-preview queries.

**Acceptance criteria**
- [ ] After two generations, both versions are visible and restoring the first updates the preview and the Guest Preview page.

**Notes/risks**
- Only if BE-022 is accepted.

## Invites and reminders

### FE-017 Undo "mark sent" / "mark reminded"

**Type:** Enhancement · **Priority:** P2 · **Size:** S · **Depends on:** BE-026

**Context**
- Opening a guest's WhatsApp link marks the invite sent ([`SendInvitesDialogue.tsx:205`](../src/components/SendInvitesDialogue.tsx#L205), [`GuestInviteCard.tsx:173`](../src/components/GuestInviteCard.tsx#L173)); the backend ponytail notes WhatsApp cannot confirm the message was actually sent. A mis-tap is permanent today.

**Scope**
- An "Undo" action (toast action or menu item) calling the BE-026 endpoints via new `useUnmarkInviteSent`/`useUnmarkReminderSent` hooks that invalidate the same keys as `useMarkInviteSent` ([`use-guest.ts:227-242`](../src/hooks/use-guest.ts#L227)).

**Acceptance criteria**
- [ ] After undo, the guest shows as not sent in the dialog and in the "not sent" guest filter, and reminders re-time from the next send.

**Notes/risks**
- None.

## Dashboard and live updates

### FE-018 Keep "x minutes ago" on Recent RSVPs current

**Type:** Enhancement · **Priority:** P2 · **Size:** S · **Depends on:** -

**Context**
- Ponytail at [`RecentRsvpsCard.tsx:35`](../src/components/RecentRsvpsCard.tsx#L35): relative times use the fetch time passed from [`Dashboard.tsx:79`](../src/pages/Dashboard.tsx#L79) (`now={dataUpdatedAt}`), so on a quiet dashboard "2 minutes ago" stays frozen.

**Scope**
- A small `useNow(60_000)` interval in the Dashboard page passed as `now` (keeps the card pure). Remove the ponytail.

**Acceptance criteria**
- [x] Leaving the dashboard open for 3 minutes with no RSVPs updates "just now" to "3 minutes ago".

**Notes/risks**
- One interval per page, not per row.

### FE-019 Distinct colours for every dietary slice

**Type:** Enhancement · **Priority:** P2 · **Size:** S · **Depends on:** -

**Context**
- Ponytail at [`DietaryBreakDownChart.tsx:14`](../src/components/DietaryBreakDownChart.tsx#L14): 5 chart colours repeat past 5 slices. There are 7 dietary options ([`constants/index.ts:230-238`](../src/constants/index.ts#L230)), and `--chart-1..5` in [`index.css:72-76`](../src/index.css#L72) are all close purple shades, so repeated slices are indistinguishable.

**Scope**
- Add `--chart-6`/`--chart-7` (light and dark) and the `--color-chart-*` mappings; use `(i % 7) + 1`. Check contrast in both themes.

**Acceptance criteria**
- [x] A wedding with all 7 dietary answers shows 7 distinguishable slices and legend entries in light and dark mode.

**Notes/risks**
- Remove the ponytail comment.

### FE-020 QR code check-in: guest QR and host scanner

**Type:** Enhancement (proposed) · **Priority:** P2 · **Size:** M · **Depends on:** BE-029

**Context**
- The landing page lists "QR code attendance" as being built ([`UpcomingSection.tsx:3-11`](../src/components/landing/UpcomingSection.tsx#L3)); its ponytail says to move it into `FeaturesSection` when it lands.

**Scope**
- Show a QR of the invite token on the RSVP page for attending guests; a host "Check-in" page (camera scan via the native `BarcodeDetector` where available, manual token entry as fallback) calling BE-029; arrivals on the dashboard; move the landing item into `FeaturesSection`.

**Acceptance criteria**
- [ ] Scanning a guest's QR on a phone marks them arrived and the dashboard arrival count updates live.
- [ ] Scanning twice shows "already checked in".

**Notes/risks**
- `BarcodeDetector` is not in every browser; the manual fallback is required.

## Landing and pricing

### FE-021 Landing and pricing copy only claims what ships

**Type:** Bug · **Priority:** P1 · **Size:** S · **Depends on:** -

**Context**
- The ponytail at [`PricingSection.tsx:3-5`](../src/components/landing/PricingSection.tsx#L3) says "Every listed feature below does exist today", but:
  - "Excel and CSV import" ([`PricingSection.tsx:15`](../src/components/landing/PricingSection.tsx#L15), [`FeaturesSection.tsx:28`](../src/components/landing/FeaturesSection.tsx#L28), [`FaqSection.tsx:17`](../src/components/landing/FaqSection.tsx#L17), [`GuestListSection.tsx:9`](../src/components/landing/GuestListSection.tsx#L9), [`SpecsSection.tsx:47`](../src/components/landing/SpecsSection.tsx#L47)): only the downloaded `.xlsx` template imports (FE-004).
  - "Unlimited AI invitation cards" ([`PricingSection.tsx:29`](../src/components/landing/PricingSection.tsx#L29)): generations cost credits from a fixed 100-credit balance with no top-up (backend `credits.service.ts`).
  - "Up to 50 guests" / "One wedding" on Free ([`PricingSection.tsx:13-14`](../src/components/landing/PricingSection.tsx#L13)): not enforced anywhere (BE-025).

**Scope**
- Reword to "Excel import (from our template)", describe AI credits honestly, and either drop the plan limits or mark prices/limits as coming soon until BE-025/billing exists. Update the ponytail comment to match.

**Acceptance criteria**
- [x] Every claim on the landing and pricing sections maps to shipped behaviour (walk through each bullet once).
- [x] No page mentions CSV unless CSV import exists.

**Notes/risks**
- Product/marketing call on wording; keep the layout untouched.

### FE-022 Show plan limits and upgrade prompts

**Type:** Enhancement (proposed) · **Priority:** P2 · **Size:** S · **Depends on:** BE-025

**Context**
- Once BE-025 enforces plan limits with 402 responses, the guest form, Excel import result and wedding creation need to explain them; today a 402 would surface as a generic error toast.

**Scope**
- Detect `status === 402` in the create-guest/create-wedding/import flows and show a message with the limit and a link to pricing; show usage (e.g. "42 of 50 guests") on the Guests page header.

**Acceptance criteria**
- [ ] Hitting the guest limit shows a specific message, not "Something went wrong".

**Notes/risks**
- Only if BE-025 is accepted.

## Infra and quality

### FE-023 CI: lint and build on every push

**Type:** Infra · **Priority:** P1 · **Size:** S · **Depends on:** -

**Context**
- No `.github/` workflows; the repo is on GitHub (`moizkapasi28/ai-wedding-rsvp-generator-frontend`) and deploys to Cloudflare Pages. `npm run lint` (0 errors) and `npm run build` are the documented checks in [`CLAUDE.md`](../CLAUDE.md), but nothing runs them automatically; several recent commits are named "Resolved build error" / "resolve build error" (`e840511`, `3f4e930`).

**Scope**
- A workflow on push/PR: `npm ci`, `npm run lint`, `npm run build` with a dummy `VITE_APP_URL` (the env plugin validates at build time), and `npm test` once FE-024 exists.

**Acceptance criteria**
- [ ] A PR with a type error or lint error fails CI; main is green.

**Notes/risks**
- `VITE_GOOGLE_MAPS_API_KEY` is optional; do not put real keys in the workflow.

### FE-024 Add `npm test` for the import-free `lib/` helpers

**Type:** Infra · **Priority:** P2 · **Size:** S · **Depends on:** -

**Context**
- "There is no test runner" ([`CLAUDE.md:14`](../CLAUDE.md#L14)); `package.json` has no `test` script. [`lib/sse.ts:5`](../src/lib/sse.ts#L5) and [`lib/pageRange.ts:8`](../src/lib/pageRange.ts#L8) are deliberately import-free "so it can be checked", as are `rsvpStatus.ts`, `weddingDate.ts`, `event-display.ts` and `eventSide.ts`, but no checks exist.

**Scope**
- `"test": "node --test --experimental-strip-types src/lib/*.test.ts"` (Node 22, no new dependency) with tests for `parseSseChunk` (split chunks, CRLF, heartbeat comments), `pageRange` (small totals, gaps at both ends) and one or two of the date/status helpers.

**Acceptance criteria**
- [ ] `npm test` passes locally and in CI (FE-023).
- [x] Breaking `parseSseChunk`'s handling of a message split across two chunks fails a test.

**Notes/risks**
- Component tests (Vitest + Testing Library) are a separate decision; do not add them here.

### FE-025 Error monitoring for the web app

**Type:** Infra · **Priority:** P2 · **Size:** M · **Depends on:** -

**Context**
- Route errors only reach `console.error` ([`ErrorPage.tsx:23`](../src/pages/ErrorPage.tsx#L23)); every failed request is `console.error`ed in [`api.service.ts:122`](../src/api/api.service.ts#L122) and nowhere else. Production failures on the public RSVP page (guests' phones) are invisible.

**Scope**
- Add an error tracker (e.g. Sentry browser SDK) behind an optional `VITE_*` DSN (add to `env.ts` and `.env.example`); report router errors and 5xx API errors with the route, not tokens or form values.

**Acceptance criteria**
- [ ] With a DSN set, a thrown render error and an API 500 appear in the tracker; without it nothing is sent.
- [ ] No access/refresh tokens or RSVP tokens appear in captured URLs or breadcrumbs.

**Notes/risks**
- Adds bundle weight; lazy-load it if needed.

### FE-026 Delete dead files and `console.log`s; add a `no-console` lint rule

**Type:** Tech debt · **Priority:** P2 · **Size:** S · **Depends on:** -

**Context**
- Imported nowhere: [`src/components/DashboardCard.tsx`](../src/components/DashboardCard.tsx), [`src/components/ToolBar.tsx`](../src/components/ToolBar.tsx), `src/assets/hero.png`, `src/assets/vite.svg`, `src/assets/react.svg` (Vite scaffold leftovers); `src/components/ui/field.tsx` is an unused shadcn primitive (keeping it is fine).
- Leftover debug logs: [`use-guest.ts:141`](../src/hooks/use-guest.ts#L141) `console.log(error)`, [`EventDialogues.tsx:30`](../src/components/EventDialogues.tsx#L30) (also covered by FE-008).

**Scope**
- Delete the unused files; replace `console.log` with nothing (the toast already reports); add `no-console: ["warn", { allow: ["error"] }]` to [`eslint.config.js`](../eslint.config.js).

**Acceptance criteria**
- [ ] `npm run build` and `npm run lint` pass; `grep -rn "console.log" src` is empty.

**Notes/risks**
- Leave `console.error` calls until FE-025 replaces them.

### FE-027 One image-cropping helper and component

**Type:** Tech debt · **Priority:** P2 · **Size:** S · **Depends on:** -

**Context**
- Two copies of the crop helper: [`src/lib/cropImage.ts`](../src/lib/cropImage.ts) (returns `{ url, blob }`, used by [`ImageCropper.tsx:9`](../src/components/ImageCropper.tsx#L9)) and [`src/utilities/cropImage.ts`](../src/utilities/cropImage.ts) (returns a `File`, adds flip, used by [`ViewProfile.tsx:28`](../src/pages/ViewProfile.tsx#L28)). The profile page also re-implements the cropper dialog inline with `react-easy-crop` ([`ViewProfile.tsx:37`](../src/pages/ViewProfile.tsx#L37), crop state at `:65-101`) instead of using `ImageCropper`.

**Scope**
- Keep one helper in `src/lib/cropImage.ts` (return a `Blob`; callers wrap in `File` if needed); make the profile page use `ImageCropper`; delete `src/utilities/cropImage.ts`.

**Acceptance criteria**
- [ ] Profile photo crop/upload and the invite-card/page-settings croppers behave as before.
- [ ] Only one `cropImage.ts` exists.

**Notes/risks**
- `src/utilities/regex.ts` is still used; leave the folder if it keeps that file.

### FE-028 Fix CLAUDE.md drift

**Type:** Tech debt · **Priority:** P2 · **Size:** S · **Depends on:** -

**Context**
- [`CLAUDE.md:37`](../CLAUDE.md#L37) says `src/routes/index.tsx` is an unused older router; the file no longer exists.
- [`CLAUDE.md:20`](../CLAUDE.md#L20) lists the backend resource as `ai-invite-card`; the API is mounted at `/api/invite-card` ([`inviteCard.service.ts:51`](../src/api/inviteCard.service.ts#L51), backend [`index.ts`](../../ai-wedding-rsvp-generator-backend/src/index.ts)).
- [`CLAUDE.md:41`](../CLAUDE.md#L41) names `useAiInviteCardGenerationStatus`; the hook is `useInviteCardGenerationStatus` ([`use-inviteCard.ts`](../src/hooks/use-inviteCard.ts)).
- AI credits (`useAiCredits`, `AI_CREDIT_COST`) are not mentioned.

**Scope**
- Correct the three references, add a one-line note on AI credits, and mention `npm test` once FE-024 lands.

**Acceptance criteria**
- [ ] Every file, hook and route named in CLAUDE.md exists (grep each one).

**Notes/risks**
- Keep it terse; it is loaded into every AI session.
