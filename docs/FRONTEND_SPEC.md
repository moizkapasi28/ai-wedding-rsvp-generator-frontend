# Frontend Spec — WeddlyAI

How the interface looks, behaves and functions, as built on 2026-10-01 (branch `dev`). Every statement is taken from the linked source file. Items that look unintended are listed as observations in [§9](#9-known-ui-gaps-and-inconsistencies); nothing was changed.

Companion document: [TECHNICAL_ARCHITECTURE.md](./TECHNICAL_ARCHITECTURE.md) (layers, state, routing, data flow).

---

## 1. Design system

### 1.1 Theme

| Aspect | Behaviour | File |
|---|---|---|
| Provider | `ThemeProvider` wraps every route, including the error element | [router.tsx](../src/router.tsx) |
| Default | `dark` (router passes `defaultTheme="dark"`; the provider's own fallback is `system`) | [router.tsx](../src/router.tsx), [ThemeProvider.tsx](../src/components/ThemeProvider.tsx) |
| Persistence | localStorage `vite-ui-theme`; values `light`, `dark`, `system` | [ThemeProvider.tsx](../src/components/ThemeProvider.tsx) |
| Mechanism | Adds `light` or `dark` class to `<html>`; `system` reads `prefers-color-scheme` once when the theme changes | [ThemeProvider.tsx](../src/components/ThemeProvider.tsx) |
| Toggle | Only in the app header: ghost icon button (sun/moon) opening a menu Light / Dark / System with a check on the current one | [ThemeToggle.tsx](../src/components/ThemeToggle.tsx), [Header.tsx](../src/components/Header.tsx) |
| Dark variant | `@custom-variant dark (&:is(.dark *))` | [index.css](../src/index.css) |

### 1.2 Colour tokens

Defined as OKLCH CSS variables in [index.css](../src/index.css) and exposed to Tailwind through `@theme inline` (`bg-background`, `text-muted-foreground`, …). Neutrals are achromatic; the brand hue is violet (~293°).

| Token | Light | Dark | Typical use |
|---|---|---|---|
| `--background` | `oklch(1 0 0)` | `oklch(0.145 0 0)` | page |
| `--foreground` | `oklch(0.145 0 0)` | `oklch(0.985 0 0)` | text |
| `--card` / `--popover` | `oklch(1 0 0)` | `oklch(0.205 0 0)` | cards, menus |
| `--primary` | `oklch(0.491 0.27 292.581)` | `oklch(0.432 0.232 292.759)` | filled buttons, active states, badges |
| `--primary-foreground` | `oklch(0.969 0.016 293.756)` | same | text on primary |
| `--secondary` | `oklch(0.967 0.001 286.375)` | `oklch(0.274 0.006 286.033)` | secondary buttons, count badges |
| `--muted` / `--accent` | `oklch(0.97 0 0)` | `oklch(0.269 0 0)` | subtle fills, hover |
| `--muted-foreground` | `oklch(0.556 0 0)` | `oklch(0.708 0 0)` | secondary text |
| `--destructive` | `oklch(0.577 0.245 27.325)` | `oklch(0.704 0.191 22.216)` | delete, errors, required star |
| `--border` | `oklch(0.922 0 0)` | `oklch(1 0 0 / 10%)` | hairlines |
| `--input` | `oklch(0.922 0 0)` | `oklch(1 0 0 / 15%)` | field borders |
| `--ring` | `oklch(0.708 0 0)` | `oklch(0.556 0 0)` | focus rings, card hover border |
| `--chart-1…5` | violet ramp `0.811/0.111` → `0.432/0.232` (L/C), hue ~293 | same | charts |
| `--sidebar*` | `--sidebar` `oklch(0.985 0 0)`, primary `oklch(0.541 0.281 293.009)` | `--sidebar` `oklch(0.205 0 0)`, primary `oklch(0.606 0.25 292.717)` | sidebar |

Semantic colour maps (Tailwind palette, not tokens):

| Meaning | Values | File |
|---|---|---|
| RSVP status | Attending green-500, Maybe yellow-500, Declined red-500, Pending violet-500; each has a tinted badge class, a dot and a left-edge class | [rsvpStatus.ts](../src/lib/rsvpStatus.ts) |
| Side | Bride pink, Groom sky, Both purple; outlined badge style and a filled "selected" style | [eventSide.ts](../src/lib/eventSide.ts) |
| Wedding identity | One of 5 gradients picked from a hash of the wedding id; used on the initials chip and the confirmation bar | [weddingColor.ts](../src/lib/weddingColor.ts) |
| Invite not sent | Dashed border on the event badge | [GuestFields.tsx](../src/components/guests/GuestFields.tsx) |

### 1.3 Typography

| Role | Font | Rule | File |
|---|---|---|---|
| Body / UI (`font-sans`) | Geist Variable | set on `html` | [index.css](../src/index.css) |
| Headings `h1`–`h3`, `font-display`, `font-heading` | Bricolage Grotesque Variable | `letter-spacing: -0.02em`, optical sizing; explicit `tracking-*` classes override | [index.css](../src/index.css) |
| Numbers | `tabular-nums` on counts, stats, pagers | throughout |
| Field text | `text-base` on phones, `md:text-sm` (16px avoids iOS zoom on focus) | [input.tsx](../src/components/ui/input.tsx), [rsvpFieldStyles.ts](../src/lib/rsvpFieldStyles.ts) |

Recurring scale: app bar title `text-base sm:text-lg`; stat values `font-display text-xl`–`text-3xl`; card titles `text-base font-semibold`; labels/captions `text-xs text-muted-foreground`.

### 1.4 Shape, spacing, elevation

| Aspect | Convention | File |
|---|---|---|
| Radius scale | `--radius: 0.625rem`; `sm` ×0.6, `md` ×0.8, `lg` ×1, `xl` ×1.4, `2xl` ×1.8, `3xl` ×2.2, `4xl` ×2.6 | [index.css](../src/index.css) |
| App surfaces | Hairline cards `rounded-xl border border-border bg-card p-5`, hover `border-ring`; no gradient slabs (repeated in component comments) | e.g. [EventCard.tsx](../src/components/EventCard.tsx), [WeddingCard.tsx](../src/components/WeddingCard.tsx) |
| Invitation surfaces | Square corners (`rounded-none`), hairline border, 9:16 frame for cards: "a printed invitation has square corners" | [RsvpForm.tsx](../src/components/RsvpForm.tsx), [RsvpInviteHero.tsx](../src/components/RsvpInviteHero.tsx), [DesignPreviewCard.tsx](../src/components/DesignPreviewCard.tsx), [GuestPreviewMain.tsx](../src/components/GuestPreviewMain.tsx) |
| Page padding | `p-4 sm:p-6` | [Page.tsx](../src/components/Page.tsx) |
| Grid gaps | `gap-5` between cards; `gap-3` in toolbars; `gap-x-4 gap-y-3` in dialog forms | list and dialog components |
| Fields | Height `h-8`, `rounded-lg`, `border-input`, focus `ring-3 ring-ring/50`, invalid `border-destructive ring-destructive/20` | [input.tsx](../src/components/ui/input.tsx) |
| Buttons | shadcn style `radix-nova`; sizes `xs` h-6, `sm` h-7, `default` h-8, `lg` h-9, `icon` 8/6/7/9; variants default, outline, secondary, ghost, destructive (tinted, not solid), link; `loading` prop shows a spinner | [button.tsx](../src/components/ui/button.tsx), [components.json](../components.json) |
| Scrollbars | Hidden on `html`/`body` globally and on `.no-scrollbar` rows | [index.css](../src/index.css) |
| Motion | Skeleton `animate-pulse`; progress bars animate width over 1 s; landing "settle" animation only under `prefers-reduced-motion: no-preference` | [MultiProgressBar.tsx](../src/components/custom/MultiProgressBar.tsx), [index.css](../src/index.css) |

### 1.5 Icons, components, toasts

| Aspect | Detail |
|---|---|
| Icons | `lucide-react` everywhere; default `size-4` inside buttons ([button.tsx](../src/components/ui/button.tsx)) |
| Primitives | shadcn in [src/components/ui](../src/components/ui): badge, button, card, chart, dialog, dropdown-menu, field, form, input, input-group, label, pagination, select, separator, sheet, sidebar, skeleton, slider, switch, table, tabs, textarea, tooltip; local additions `loader.tsx` (full-screen spinner) and `multi-select.tsx` (dropdown with checkboxes, "Select All", infinite scroll hook) |
| Toasts | `react-hot-toast` `<Toaster position="top-center" />`, default styling ([main.tsx](../src/main.tsx)) |

### 1.6 Responsive behaviour

| Mechanism | Values | Where |
|---|---|---|
| Tailwind breakpoints | `sm` 640, `md` 768, `lg` 1024, `xl` 1280, `2xl` 1536 (used ~95 / 78 / 163 / 5 / 1 times) | throughout |
| Mobile/desktop split | `useIsMobile()` = `max-width: 767px` | [use-mobile.ts](../src/hooks/use-mobile.ts) |
| Sidebar | < 768px: off-canvas sheet (`min(16rem, 80vw)`); 768–1023px: icon rail (3.5rem) by default; ≥ 1024px: expanded (16rem). User choice persists in cookie `sidebar_state` | [AppLayout.tsx](../src/layout/AppLayout.tsx), [sidebar.tsx](../src/components/ui/sidebar.tsx) |
| Container queries | Most in-app layouts respond to their container, not the viewport, so collapsing the sidebar re-flows them: `@container/dash`, `/guests` (table ≥ 60rem, cards below), `/events` (2 cols ≥ 52rem, 3 ≥ 80rem, 4 ≥ 110rem), `/settings`, `/invite`, `/preview` (3 cols ≥ 64rem), `/eventbar` (label hidden < 26rem), `/toolbar`, `/guest`, `/profile`, `/summary`, `/rsvpcard` (2 cols ≥ 22rem), `/event`, `/design` | component files |
| Arbitrary viewport breakpoints | Weddings grid: 1 col < 700px, 2 cols 700–1535, 3 cols 1536–2099, 4 cols ≥ 2100 | [WeddingList.tsx](../src/components/WeddingList.tsx) |
| Landing scaling | On `.landing` pages the root font size grows as `max(100%, 100vw / 98)` so the 90rem column scales on wide screens | [index.css](../src/index.css) |

---

## 2. Layout

### 2.1 Public pages

| Family | Structure | Files |
|---|---|---|
| Landing, Blog | `.landing` wrapper; fixed marketing `Header` (links Features `/#features`, How it works `/#programme`, What's next `/#upcoming`, Pricing `/#pricing`, Blog `/blog`, Sign in, Sign up; mobile menu button with `aria-expanded`); `Footer` with section anchors and latest posts | [Landing.tsx](../src/pages/Landing.tsx), [landing/Header.tsx](../src/components/landing/Header.tsx), [landing/Footer.tsx](../src/components/landing/Footer.tsx) |
| Auth | `AuthLayout`: 12-column split on `lg` (form 7 cols, `AuthAside` 5 cols showing an inert sample RSVP card); logo link to `/`; title, description, form, footer rule, © line. Desktop is locked to one viewport and the form column scrolls; mobile scrolls the document. `wide` (signup) widens the form to `max-w-xl` | [AuthLayout.tsx](../src/components/auth/AuthLayout.tsx), [AuthAside.tsx](../src/components/auth/AuthAside.tsx) |
| Guest RSVP | Standalone page on `bg-muted/30`, no header/sidebar, footer credit linking to `/` in a new tab | [Rsvp.tsx](../src/pages/Rsvp.tsx) |
| Error pages | `ErrorState`: large faded code, title, body, "Back to weddings" (logged in) or "Back home", plus a page-specific action | [ErrorState.tsx](../src/components/ErrorState.tsx) |

### 2.2 App shell

[AppLayout.tsx](../src/layout/AppLayout.tsx) = `SidebarProvider` → `HeaderProvider` → `AppSidebar` + `SidebarInset` (`Header` + `<main>` + page). While weddings load, or before one is auto-selected, a full-screen spinner shows.

**Sidebar** ([AppSidebar.tsx](../src/components/AppSidebar.tsx)), `collapsible="icon"`:

| Zone | Content |
|---|---|
| Header | Logo (mark + wordmark; wordmark hidden in rail) linking to `/weddings`, `aria-label="WeddlyAI"` |
| Wedding switcher | See below |
| Nav group (no label) | Weddings `/weddings` (LayoutList icon) |
| Nav group "This wedding" | Dashboard `/wedding-dashboard` (Gauge), Guests `/guests` (Users2), Events `/events` (Calendar) |
| Nav group "Invitation" | RSVP page `/page-settings` (Settings, badge "Beta"), Invite card `/invite-card` (Sparkles, badge "Beta"), Guest preview `/guest-preview` (Eye) |
| Footer | "AI credits" readout with the server balance (`useAiCredits`), turns destructive when below 10 (invite card cost); `UserMenu` |

Nav source: `APP_SIDEBAR` in [constants/index.ts](../src/constants/index.ts). Active state: exact match for `/weddings`, prefix match for the rest. Each item has a tooltip (visible in the collapsed rail). On mobile, choosing an item closes the drawer. Ctrl/Cmd+B toggles the sidebar ([sidebar.tsx](../src/components/ui/sidebar.tsx)).

**UserMenu** ([UserMenu.tsx](../src/components/UserMenu.tsx)): avatar (S3 key → signed URL, or initials via `react-avatar`) with a green presence dot, name, email; dropdown with "View profile" → `/profile` and "Sign out" → `useLogout`.

**Header** ([Header.tsx](../src/components/Header.tsx)): sticky, `h-14`, `z-30`, bottom border. Sidebar trigger, `<h1>` with the page title from `PageHeader` and, from `sm` up, the active wedding title in muted text (hidden only when the title is "Weddings"), theme toggle at the right.

**WeddingSwitcher** ([WeddingSwitcher.tsx](../src/components/WeddingSwitcher.tsx)):

| State | Rendering |
|---|---|
| Loading | Centred spinner |
| No weddings | Box "No weddings found" |
| Default | Button (`aria-label="Select wedding"`): gradient initials chip, title, calendar icon + `formatWeddingDate` ("28 Oct, in 12 days"); rail shows only the chip |
| Open | Custom popover (not Radix): search input (autofocus, 500 ms debounce, server search), "Switch to" list of 5 per page with infinite scroll (IntersectionObserver), active row marked with heart + check, "Add Wedding" action opening `WeddingActionDialogue` in add mode. Height capped to the viewport; beside the rail when collapsed |
| Select | Writes `activeWeddingIdAtom` and `activeWeddingAtom`, closes, clears search |
| Close | Mousedown outside |

---

## 3. Shared interaction patterns

### 3.1 List page composition

Used by Weddings, Events, Guests ([AllWeddings.tsx](../src/pages/AllWeddings.tsx), [Events.tsx](../src/pages/Events.tsx), [Guests.tsx](../src/pages/Guests.tsx)):

```
<XProvider>           open: "add" | "edit" | "delete" | null, currentRow, search/filters/sort
  <Page>              p-4 sm:p-6
    <PageHeader/>     sets the app-bar title; renders nothing unless given children
    <XToolbar actions={<XPrimaryButtons/>}/>   (Weddings places buttons and toolbar side by side)
    <XList/>          query + loading / error / empty / data + pagination
    <XDialogues/>     add dialog always mounted; edit + delete mounted when currentRow is set
```

Row actions: `setCurrentRow(row); setOpen("edit" | "delete")`. Providers: [WeddingProvider.tsx](../src/components/WeddingProvider.tsx), [EventProvider.tsx](../src/components/EventProvider.tsx), [GuestProvider.tsx](../src/components/GuestProvider.tsx).

### 3.2 Add / edit dialogs

Wedding, Event and Guest action dialogs share one anatomy ([WeddingActionDialogue.tsx](../src/components/WeddingActionDialogue.tsx), [EventActionDialogue.tsx](../src/components/EventActionDialogue.tsx), [GuestActionDialogue.tsx](../src/components/GuestActionDialogue.tsx)):

| Aspect | Behaviour |
|---|---|
| Size | `sm:max-w-2xl`, `max-h-[calc(100%-2rem)]`; header and footer fixed, only the field grid scrolls |
| Grid | 1 column, 2 columns from `sm`; no section headings or helper paragraphs |
| Reset | Form resets from `currentRow` (edit) or empty values (add) every time the dialog opens |
| Closing | X, Esc, overlay and Cancel all go through one handler that refuses to close while the save is pending |
| Google Places | Clicks inside `.pac-container` are not treated as outside clicks; Enter in the address box does not submit |
| Submit button | Label "Add …" / "Save changes"; `loading={isPending}`; in edit mode `disabled` until the form is dirty (see [§9](#9-known-ui-gaps-and-inconsistencies) G1 for how `disabled` interacts with `loading`) |
| Success | Mutation toast, then the dialog closes |
| Failure | Error toast; dialog stays open with values intact |
| Required marker | `FormLabel required` appends a red `*` ([form.tsx](../src/components/ui/form.tsx)) |
| Counters | Textareas with limits show `n/limit`, red when over |

### 3.3 Delete dialogs

[WeddingDeleteDialogue.tsx](../src/components/WeddingDeleteDialogue.tsx), [EventDeleteDialogue.tsx](../src/components/EventDeleteDialogue.tsx), [GuestDeleteDialogue.tsx](../src/components/GuestDeleteDialogue.tsx): `sm:max-w-md`, trash icon in a tinted circle, "Are you sure you want to delete **{name}**? This action cannot be undone…" with what cascades (wedding → guests and events; event → RSVP responses; guest → event invitations). Buttons Cancel (outline) and "Delete …" (destructive). Confirm fires the mutation and closes immediately; the result arrives as a toast.

### 3.4 Other save buttons

| Location | Rule |
|---|---|
| RSVP page settings | "Save changes" in the sticky EventBar; disabled until dirty; "Unsaved changes" text shown when dirty (from 26rem bar width); form re-based after success ([PageSettingMain.tsx](../src/components/PageSettingMain.tsx)) |
| Invite card | "Save changes" in the EventBar; disabled when no event is selected or a reference/couple photo is uploading; same unsaved marker ([InviteCardMain.tsx](../src/components/InviteCardMain.tsx)) |
| Profile | "Save changes" disabled until dirty; Cancel resets and leaves edit mode ([ViewProfile.tsx](../src/pages/ViewProfile.tsx)) |

### 3.5 Search, filters, pagination, infinite lists

| Pattern | Behaviour | File |
|---|---|---|
| Search box | Leading search icon; keeps a local value and calls `onChange` after 500 ms of no typing; adopts external resets | [SerachBar.tsx](../src/components/SerachBar.tsx) |
| Filter reset | Changing search/filter/sort returns the list to page 1 | list components |
| Clear | "Clear" ghost button appears only when a filter is active (Events counts a non-default sort as a filter) | [GuestToolbar.tsx](../src/components/GuestToolbar.tsx), [EventToolbar.tsx](../src/components/EventToolbar.tsx) |
| Toolbar layout | One row when wide (search, filters, actions); when narrow the filters drop to their own horizontally scrolling line and the actions stay beside the search | same |
| Pagination | "Showing a–b of n" + Previous / numbers / Next; ≤ 7 pages shows all, otherwise first, last, current ± 1 with ellipses; hidden when there are no items | [TablePagination.tsx](../src/components/TablePagination.tsx), [pageRange.ts](../src/lib/pageRange.ts) |
| Last row deleted | List steps back one page | list components |
| Infinite: switcher | IntersectionObserver sentinel at the list foot | [WeddingSwitcher.tsx](../src/components/WeddingSwitcher.tsx) |
| Infinite: multi-select | Loads more when scrolled within 20px of the bottom; "Loading more..." row | [multi-select.tsx](../src/components/ui/multi-select.tsx) |
| Infinite: event bar | "Load more" ghost button after the event pills | [EventBar.tsx](../src/components/EventBar.tsx) |

### 3.6 Loading, empty and error states

| State | Component | Look |
|---|---|---|
| App bootstrap / route shell | [loader.tsx](../src/components/ui/loader.tsx) | Full-viewport spinning icon, `sr-only` "loading" |
| Page/list loading | [skeleton.tsx](../src/components/ui/skeleton.tsx) | Shape-matched skeletons (cards, table rows, chart blocks) |
| Empty / nothing found / failed | [Notice.tsx](../src/components/Notice.tsx) | Bordered box `py-16`, centred title, body (max 46ch), optional action |
| No events for an event-scoped page | [NoEventsState.tsx](../src/components/NoEventsState.tsx) | Notice "No events yet." + "Go to events" |
| Route error | [ErrorPage.tsx](../src/pages/ErrorPage.tsx) | ErrorState with Reload |

Error copy is consistent: "We couldn't load your {things}." / "Something went wrong on the way to the server. Refresh the page to try again."

### 3.7 Event-scoped pages

RSVP page, Invite card and Guest preview share the sticky `EventBar` ([EventBar.tsx](../src/components/EventBar.tsx)): `sticky top-14`, full-bleed, bottom border; a horizontally scrolling row of event pills ([EventSwitcher.tsx](../src/components/EventSwitcher.tsx)) coloured by side (outlined when unselected, filled when selected, `aria-pressed`), plus the page's action on the right (label collapses to icon below 26rem).

Initial event: RSVP page uses `?event=` if present, else the first; Invite card uses `location.state.eventId` if present, else the first; Guest preview uses the first.

### 3.8 Toast catalogue

Server `message` takes precedence where shown as "‖".

| Action | Success | Error |
|---|---|---|
| Sign in | none (navigates) | `message` ‖ "Something went wrong. Please try again." |
| Sign up | none (navigates) | `message` |
| Resend verification | "Verification email sent successfully" | `message` |
| Forgot password | "Reset password link sent to registered email address" | `message` ‖ generic |
| Reset password | `message` ‖ "Password reset successfully" | no toast; errors mentioning token/expire/link switch to the expired-link view, any other error is silent |
| Sign out | none (navigates) | `message` ‖ generic |
| Update profile | "Profile updated" | `message` ‖ "Failed to update profile. Please try again." |
| Wedding create / update / delete | `message` ‖ "New Wedding Created Successfully" / "New Wedding Updated Successfully" / "Wedding Deleted Successfully" | `message` ‖ "Something went wrong! Please try again later" |
| Event create / update / delete | `message` ‖ "New Event Created Successfully" / "New Wedding Updated Successfully" / "Wedding Deleted Successfully" | same generic |
| Guest create / update / delete | `message` ‖ "New Guest Created Successfully" / "Guest Updated Successfully" / "Guest Deleted Successfully" | same generic |
| Guest import | "Imported N guest(s)"; "No guests found in the file" (error); partial: "Imported X, failed Y." + up to 3 row errors (8 s) | `message` ‖ "Failed to upload guest list! …"; client checks: "That isn't a spreadsheet. Upload an .xlsx or .xls file.", "That file is over 5MB. Split the list and import again." |
| Template / export | "Template downloaded successfully" / "Guest list exported successfully" | "Failed to download template! …" / "Failed to export guest list! …" |
| Mark invite / reminder sent | none | "Couldn't mark the invite as sent" / "Couldn't mark the reminder as sent" |
| Host sets a guest's reply | `message` ‖ "RSVP updated" | generic |
| Copy RSVP link | "RSVP link copied" | "Couldn't copy the link" |
| RSVP settings save | `message` ‖ "Settings updated successfully" | generic |
| Illustration photo upload / generate | "Image uploaded successfully!" / "Illustration generated!" | "Failed to generate upload URL…", "Failed to generate image…", "Please upload an image first.", "Please select an event first." |
| Invite card save | `message` ‖ "Invite Card configuration saved successfully" | `message` ‖ "Failed to save configuration. Please try again later."; "No card configuration found to update for this event." |
| Invite card generate | "Generating your invitation — you can leave this page."; later "Invitation generated successfully!" | "Failed to start generation." (402 shows server message); later "Failed to generate invitation." |
| Invite card uploads | "Invitation uploaded." | "Upload a JPG, PNG or WebP image.", "Images must be 20 MB or smaller.", "Failed to upload reference image.", "Failed to upload character photo.", "Failed to upload your invitation." |
| Guest RSVP submit | `message` ‖ "Your RSVP has been saved" | `message` ‖ generic |

Sources: [use-auth.ts](../src/hooks/use-auth.ts), [use-wedding.ts](../src/hooks/use-wedding.ts), [use-event.ts](../src/hooks/use-event.ts), [use-guest.ts](../src/hooks/use-guest.ts), [use-rsvp.ts](../src/hooks/use-rsvp.ts), [use-pageSetting.ts](../src/hooks/use-pageSetting.ts), [use-inviteCard.ts](../src/hooks/use-inviteCard.ts), [GuestPrimaryButtons.tsx](../src/components/GuestPrimaryButtons.tsx), [rsvp-link.ts](../src/lib/rsvp-link.ts), [PageSettingsIllustration.tsx](../src/components/PageSettingsIllustration.tsx), [InviteCardMain.tsx](../src/components/InviteCardMain.tsx).

---

## 4. Public pages

### 4.1 `/` Landing — [Landing.tsx](../src/pages/Landing.tsx)

| Item | Detail |
|---|---|
| Purpose | Marketing page; logged-in users are redirected to `/weddings` |
| Data | None; sample data from [sampleData.ts](../src/components/landing/sampleData.ts), posts from [posts.ts](../src/content/posts.ts) |
| Sections (anchor ids) | Hero, Features `#features`, Ceremonies `#ceremonies`, Invitations `#invitations`, Guest list `#guest-list`, Guest experience `#guest-experience`, Dashboard `#dashboard`, Programme `#programme`, Specs `#specs`, Upcoming `#upcoming`, Pricing `#pricing`, FAQ `#faq` (native `<details>`), Blog teaser `#writing`, Closing |
| Actions | CTAs link to `/signup` and `/signin`; Hero secondary link to `#programme` |
| Notes | Pricing has no billing behind it and Upcoming features are unreleased (`ponytail:` comments in [PricingSection.tsx](../src/components/landing/PricingSection.tsx), [UpcomingSection.tsx](../src/components/landing/UpcomingSection.tsx)) |

### 4.2 `/blog`, `/blog/:slug` — [Blog.tsx](../src/pages/Blog.tsx), [BlogPost.tsx](../src/pages/BlogPost.tsx)

| Page | Content | States / actions |
|---|---|---|
| Blog | Intro, lead post (date, reading minutes, title, summary), list of remaining posts, "Start free" CTA → `/signup` | Static |
| Post | "All posts" link, date + reading time, title, summary, body blocks (`h`, `p`, `ul`, `quote`), CTA band, "Keep reading" (3 others) | Unknown slug: "We don't have that one." + "Read the blog"; scrolls to top on slug change |

### 4.3 Auth pages

| Route | Title / description | Body | Footer link | Result |
|---|---|---|---|---|
| `/signin` [Login.tsx](../src/pages/Login.tsx) | "Welcome back." / "Sign in to pick up where your guest list left off." | [LoginForm.tsx](../src/components/LoginForm.tsx): email, password (show/hide), "Forgot it?" → `/forgot-password`, "Sign in" | "No account yet? Create one" → `/signup` | Success → `/weddings` |
| `/signup` [Signup.tsx](../src/pages/Signup.tsx) (wide) | "Start with your first wedding." | [SignUpForm.tsx](../src/components/SignUpForm.tsx): first/last name (2 cols), email, mobile (PhoneInput), password (strength tooltip) + confirm, "Create account" | "Already have an account? Sign in" | Success → `/verification-pending` with `state.email` |
| `/verification-pending` [EmailVerificationPending.tsx](../src/pages/EmailVerificationPending.tsx) | "Check your inbox." / "We've sent a confirmation link to {email}…" | Notice "Not there?" + outline "Send it again" (spinner, "Sending") | "Already confirmed? Sign in" | No `state.email` → redirect `/` |
| `/verify-email?token=` [VerifyEmail.tsx](../src/pages/VerifyEmail.tsx) | pending: "Checking your link." · success: "You're verified." · error/no token: "We couldn't verify that." | spinner + "Keep this tab open" · "Account active" + Sign in · "Link expired or already used" + "Back to sign in" | — | Query runs once, no retry |
| `/forgot-password` [ForgotPasswod.tsx](../src/pages/ForgotPasswod.tsx) | "Let's get you back in." | [ForgotPasswordForm.tsx](../src/components/ForgotPasswordForm.tsx): email, "Send the reset link" | "Remembered it? Sign in" | Success toast, navigates to `/weddings` |
| `/reset-password?token=` [ResetPassword.tsx](../src/pages/ResetPassword.tsx) | "Choose a new password." · expired: "That link has expired." | [ResetPasswordForm.tsx](../src/components/ResetPasswordForm.tsx): new password (strength tooltip) + confirm, "Save new password" · expired: "Send me a new link", "Back to sign in" | "Changed your mind? Back to sign in" | Success → `/signin`; no token → `/` |

Password strength UI ([PasswordInput.tsx](../src/components/custom/PasswordInput.tsx), [PasswordIndicator.tsx](../src/components/custom/PasswordIndicator.tsx)): shown on focus for signup and reset only. From `md` a tooltip to the left with label (Weak < 2, Fair = 2, Strong ≥ 3 of 5 rules), 5-segment bar and a checklist; below `md` the bar and a one-line rule appear under the field.

### 4.4 Error pages

| Route | Code | Title | Actions | File |
|---|---|---|---|---|
| route error (`errorElement`) | 401 / 403 / 500 (any non-response error → 500) | "You're signed out" / "This isn't yours to open" / "Something went wrong" | Home link + "Reload" | [ErrorPage.tsx](../src/pages/ErrorPage.tsx) |
| `*` | 404 | "This page doesn't exist" | Home link + "Go back" (history −1) | [NotFound.tsx](../src/pages/NotFound.tsx) |
| `/maintenance` | 503 | "We're down for maintenance" | "Try again" (reload), no home link | [Maintenance.tsx](../src/pages/Maintenance.tsx) |

---

## 5. Public RSVP page — `/rsvp/:slug/:token`

[Rsvp.tsx](../src/pages/Rsvp.tsx), [RsvpForm.tsx](../src/components/RsvpForm.tsx), [EventLocationCard.tsx](../src/components/EventLocationCard.tsx), [use-rsvp.ts](../src/hooks/use-rsvp.ts).

| Aspect | Behaviour |
|---|---|
| Lookup | `GET rsvp/:token`; the token (per-event invite) is the only key; `retry: false` |
| Loading | Full-screen spinner |
| Invalid | Any error or empty data: centred "This invitation link isn't valid" / "Please check the link you received, or ask the couple to send it again." |
| Slug correction | `canonicalSlug = wedding.slug ‖ "invite"`. If the URL slug differs (legacy `/rsvp/:token`, where slug is undefined, or a wedding renamed since sending) → `<Navigate replace>` to `/rsvp/{canonicalSlug}/{token}` |
| Heading | `h1` in small muted text: "Hi {guest name}, you're invited to celebrate" |
| Layout | With a card image: `max-w-7xl`, 3 columns from `xl` (card 9:16, form, location). Without: `max-w-5xl`, 2 columns from `xl`. Stacked below `xl`; card capped at `max-w-sm` |
| Invitation hero | Optional square illustration (from Page Settings), event title + date between short rules, couple names in the display face (bride only / groom only / both by `event_side`), place · time |
| Questions | Only those enabled in the RSVP page settings: dietary (select from `DIETARY_OPTIONS`), plus-ones (stepper 0–9), song request (textarea, max 500), message to the couple (textarea, max 500). Fields are ruled lines, not boxes ([rsvpFieldStyles.ts](../src/lib/rsvpFieldStyles.ts)) |
| Reply | Three buttons: filled "Yes, I'll be there", outline "Maybe", outline "Can't make it", each with its status dot ([RsvpReplyButtons.tsx](../src/components/RsvpReplyButtons.tsx)). Clicking submits `PUT rsvp/:token` with the status and only the enabled, non-empty answers |
| After replying | Toast; query refetches; the form is keyed by `responded_at` so it resets to the saved reply; line "You replied {yes, you'll be there ‖ maybe ‖ you can't make it}. You can change your reply below." |
| Deadline | If `invite_deadline` is in the past: all inputs and buttons disabled, "RSVPs for this event are closed" |
| 404 on submit | Invite removed while open: error toast and refetch (which then shows the invalid-link view) |
| Location card | "When and where", date · time, venue, city, address; embedded Google Maps iframe (lat/lng when present, else address or venue+city), "Get directions" opens Google Maps search in a new tab; without any location: "The couple hasn't added a venue for this event yet." |
| Stay card | When the guest needs accommodation and has an address: "Where you're staying", address, "Get directions" |
| Footer | "This invitation was made with" + logo + "Planning a wedding? Create your own invitations and RSVPs free →" → `/` in a new tab |
| Link previews | Static OG tags from [index.html](../index.html) apply to every route, including RSVP links |

---

## 6. App pages

All require login; all except Weddings and Profile also require an active wedding (otherwise an always-open dialog "Create a Wedding First" whose "Go to Weddings" button, X, Esc or overlay click all navigate to `/weddings`, [RequireWedding.tsx](../src/layout/RequireWedding.tsx)).

### 6.1 `/weddings` — Weddings

[AllWeddings.tsx](../src/pages/AllWeddings.tsx), [WeddingList.tsx](../src/components/WeddingList.tsx), [WeddingCard.tsx](../src/components/WeddingCard.tsx), [WeddingToolbar.tsx](../src/components/WeddingToolbar.tsx).

| Aspect | Spec |
|---|---|
| Purpose | List, create, edit, delete weddings; choose the active wedding |
| Data | `useGetWeddingsWithStats(page, 6, true, search, filter, sortBy, sortOrder)` |
| Header title | "Weddings" (wedding subtitle hidden) |
| Toolbar | "New wedding" (full width on phones, right on `lg`); search "Search by couple, city or venue"; toggle chips "This week", "Upcoming", "Completed" (multi-select, `aria-pressed`); "Date" sort button cycling none → desc → asc → none with an arrow icon |
| Card | Gradient initials chip, title (2 lines), "{date}, in N days, {city}" + optional `tag`, row menu (Edit, Delete); venue + address; stats Guests / Events / Confirmed %; thin confirmation bar in the wedding's colour (`role="progressbar"`); footer button "Switch to this wedding" (outline) or, for the active one, "Open dashboard" (filled) + "Active" pill; active card has a primary border |
| Card click result | Sets the active wedding and navigates to `/wedding-dashboard` |
| Loading | 6 skeleton cards |
| Empty | "No weddings yet." + "New wedding"; filtered: "Nothing matches that." + "Clear search and filters" |
| Error | Notice "We couldn't load your weddings." |
| Pagination | 6 per page |

**Wedding form** — [wedding.validation.ts](../src/validations/wedding.validation.ts), dialog title "Add a wedding" / "Edit wedding" with a live initials badge (neutral dashed for a new wedding).

| Field (label) | Input | Required marker | Rules | Error messages |
|---|---|---|---|---|
| `title` (Wedding title) | text | yes | min 1, min 3, max 100 | "Title is required", "Title must be at least 3 characters", zod default for max |
| `bride_name` (Bride) | text | yes | min 1, min 3, max 50 | "Bride name is required", "Bride name must be at least 3 characters" |
| `groom_name` (Groom) | text | yes | min 1, max 50 | "Groom name is required" |
| `date` (Date) | `type=date` (whole box opens picker) | yes | min 1; `YYYY-MM-DD` or ISO 8601 | "Date is required", "Invalid date format. Please use YYYY-MM-DD or ISO 8601 format (e.g., 2026-10-15)" |
| `city` (City) | text; auto-filled from the address | yes | min 1, max 50 | "City is required" |
| `venue` (Venue) | text | yes | trim, min 1, max 200 | "Venue is required" |
| `address` (Address) | Google Places autocomplete | yes | trim, min 1, max 200 | "Address is required" |
| `message` (Message to guests) | textarea + `n/250` counter | no | optional, but when present min 1, min 3, max 250 | "Message is required", "Message must be at least 3 characters", "Message must be at most 250 characters" |

### 6.2 `/profile` — My Profile

[ViewProfile.tsx](../src/pages/ViewProfile.tsx).

| Aspect | Spec |
|---|---|
| Data | Persisted `userAtom` (not refetched here); avatar via `useGetViewUrl` when the stored picture is an S3 key |
| Header title | "My Profile" |
| No user | Single skeleton block |
| View mode | One card: 72px avatar (hover/focus shows camera overlay; trash button to remove when a picture exists), name, email, Verified (green) / Unverified (amber, shield icon) badge, "Edit profile"; facts: First name, Last name, Mobile number, Email address, Member since, Last updated |
| Edit mode | Same card, fields replace the first three facts, read-only facts stay so height doesn't change; Cancel / "Save changes" (disabled until dirty). Success returns to view mode |
| Change picture | File picker (`image/*`) → crop dialog "Crop profile picture" (round crop, zoom slider 1–3) → "Save & upload" → presigned upload → profile update; preview shown immediately, reverted on error |
| Remove picture | Updates profile with `profilePicture: null` |

**Profile form** — `updateProfileSchema` in [auth.validation.ts](../src/validations/auth.validation.ts):

| Field | Input | Required | Rules | Messages |
|---|---|---|---|---|
| `firstName` | text | yes | trim, min 1, min 3, max 50 | "First name is required", "First name must be of minimum 3 characters", "First name can not be greater than 50 characters" |
| `lastName` | text | yes | same | "Last name is required", "Last name must be of minimum 3 characters", "Last name can not be greater than 50 characters" |
| `mobileNumber` | plain text (placeholder `+1234567890`) | yes | min 10, max 15 | "Please enter a valid mobile number", "Mobile number too long" |
| `profilePicture` | set by upload/remove | no | string, nullable | — |

### 6.3 `/wedding-dashboard` — Wedding Dashboard

[Dashboard.tsx](../src/pages/Dashboard.tsx) and cards.

| Aspect | Spec |
|---|---|
| Data | `useGetWeddingDashboard(weddingId)`; `useWeddingLive(weddingId)` keeps it current |
| Header title | "Wedding Dashboard" |
| Loading | Skeletons in the final layout |
| Error | Notice "We couldn't load this dashboard." |
| Summary ([DashboardSummary.tsx](../src/components/DashboardSummary.tsx)) | Countdown with wedding chip: "N days to go" / "1 day to go" / "Today is the day" / "N days ago" / "— No date set yet", plus day and city; stats Guests invited ("N added this week"), Attending ("N% confirmed"), Awaiting reply ("N replies this week"), Need a room |
| Live row (3 cols ≥ 60rem container) | [RsvpProgressCard.tsx](../src/components/RsvpProgressCard.tsx) (2 cols): per event title, attending / total, date · venue, 4-colour bar, legend; "View all events" → `/events`; scrolls after ~5 rows; empty: "No events yet. Add a ceremony to start tracking RSVPs." · [RecentRsvpsCard.tsx](../src/components/RecentRsvpsCard.tsx): live indicator (green "Live" / pulsing amber "Connecting…"/"Reconnecting…"), rows with guest, event, relative time, status badge; replies under a minute old are highlighted; empty: "No replies yet. They'll appear here the moment a guest responds." |
| Chart row (2 cols ≥ 42rem, 3 ≥ 68rem) | "Responses this week" bar chart by weekday ([ResponseStatsChart.tsx](../src/components/ResponseStatsChart.tsx)); "Dietary breakdown" donut (labels from `DIETARY_OPTIONS`); "Guests by side" donut. Empty donut: "Nothing to show yet" |

### 6.4 `/events` — Events

[Events.tsx](../src/pages/Events.tsx), [EventList.tsx](../src/components/EventList.tsx), [EventCard.tsx](../src/components/EventCard.tsx), [EventToolbar.tsx](../src/components/EventToolbar.tsx).

| Aspect | Spec |
|---|---|
| Data | `useGetEventsWithStats(weddingId, page, 6, true, search, side, sort)` |
| Toolbar | Search "Search by name, venue or city"; Side select (All sides, Bride, Groom, Bride & Groom); Sort (Recently added, Date: earliest first, Date: latest first); Clear; "New event" |
| Card | Date block (day + month, UTC), title (2 lines), time and the year when not the current one ("Time not set"), side badge, always-visible menu (Edit, Delete); venue ("Venue not set") + address; stats Invited / Attending / Maybe / Declined / Pending (3 cols, 5 when wide); "Replied N%"; 4-colour bar; buttons "Guest list" → `/guests?event={id}` and "RSVP page" → `/page-settings?event={id}` |
| Legend | One RSVP colour legend under the grid |
| Loading | 6 skeleton cards |
| Empty | "No events yet." ("Add the first event — the mehendi, the sangeet, the wedding itself. Every guest you invite to one gets their own RSVP link for it.") + "New event"; filtered: "No events match these filters." + "Clear filters" |
| Error | Notice "We couldn't load your events." |

**Event form** — [event.validation.ts](../src/validations/event.validation.ts); dialog "Add an event" / "Edit event".

| Field (label) | Input | Required marker | Rules | Error messages |
|---|---|---|---|---|
| `weddingId` | hidden, from the active wedding | — | uuid | — |
| `title` (Title) | text, placeholder "Sangeet" | yes | min 1, max 100 | "Title is required" |
| `event_side` (Side) | select Bride / Groom / Both, default Both | yes | enum BRIDE/GROOM/BOTH | — |
| `date` (Date) | `type=date`, `min` = today | yes | min 1; date format regex; not before today | "Date is required", "Invalid date format…", "Date cannot be in the past" |
| `time` (Start time) | `type=time` | yes | `HH:MM` 24h; not earlier than now when the date is today | "Invalid time format. Example: 12:30", "Time cannot be in the past for today's events" |
| `venue` (Venue) | text | yes | min 1, max 200 | "Venue is required" |
| `city` (City) | text; auto-filled from address | yes | min 1, max 50 | "City is required" |
| `address` (Address) | Google Places autocomplete | yes | min 1, max 250 | "Address is required" |
| `description` (Message to guests) | textarea + `n/250` | yes | min 1, max 250 | "Message is required", "Message Can't be greater than 250 characters" |

### 6.5 `/guests` — Guests

[Guests.tsx](../src/pages/Guests.tsx), [GuestList.tsx](../src/components/GuestList.tsx), [GuestToolbar.tsx](../src/components/GuestToolbar.tsx), [GuestPrimaryButtons.tsx](../src/components/GuestPrimaryButtons.tsx), [guests/](../src/components/guests).

| Aspect | Spec |
|---|---|
| Data | `useGetGuests(weddingId, page, 10, search, events, sides, groups, inviteSent)`; event options from `useGetEventsWithStatsInfinite(weddingId, 20)` |
| Deep link | `?event={id}` pre-selects that event filter |
| Toolbar | Search "Search by name or phone"; multi-selects Events (infinite), Side, Group; select All invites / Invite sent / Not sent yet; Clear |
| Actions | "…" menu (`aria-label="Guest list options"`, spinner while busy): "Import from spreadsheet" (.xlsx/.xls ≤ 5 MB, background job), "Download import template", "Export this list" (honours current search and filters); primary "Add guest" |
| Wide (container ≥ 60rem) | Table: Name, Mobile, Email (truncated, title tooltip), Side badge, Group (plain text), Events (status-coloured badges, dashed = not sent), sticky row menu |
| Narrow | Cards: name, mobile, email, side badge, menu, group, event badges |
| Row menu | View → `/guests/{id}`, Edit, Delete |
| Legend | Attending / Maybe / Declined / Pending + "Invite not sent yet" |
| Loading | 5 skeleton rows / cards |
| Empty | "No guests yet." + "Add guest"; filtered: "No guests match that." + "Clear search and filters" |
| Error | Notice "We couldn't load your guests." |
| Pagination | 10 per page |

**Guest form** — [guest.validation.ts](../src/validations/guest.validation.ts); dialog "Add a guest" / "Edit guest".

| Field (label) | Input | Required marker | Rules | Error messages |
|---|---|---|---|---|
| `eventIds` (Invited to) | multi-select of the wedding's events (Select All, infinite) | yes | ≥ 1 uuid | "At least one event must be selected"; edit mode note: removing a ceremony deletes that invitation and its reply |
| `name` (Name) | text | yes | min 1, max 50 | "Name is required" |
| `mobile_number` (Mobile) | PhoneInput: country code select (+1 default, 10 codes) + digits-only number, value stored as `+CCdigits` | yes | min 1, max 15; ≥ 8 digits after removing non-digits and leading zeros | "Mobile number is required", "Enter a valid mobile number (at least 8 digits)" |
| `email` (Email) | `type=email` | no | valid email ≤ 50, or empty | zod default |
| `side` (Side) | select Bride / Groom / Both, default Bride | yes | enum | — |
| `group` (Group) | select Family, Relative, Friend, Colleague, Employee, VIP, Other; default Family | yes | enum | — |
| `accomodation_required` (Needs a room) | switch row (border turns primary when on) | — | boolean | — |
| `accomodation_address` (Where they're staying) | Google Places autocomplete, shown only when the switch is on | yes (when shown) | required when switch on | "Accommodation address is required when accommodation is requested" |
| `note` (Note) | textarea + `n/100` | no | max 100 | "Note cannot exceed 100 characters" |

### 6.6 `/guests/:id` — Guest

[GuestDetails.tsx](../src/pages/GuestDetails.tsx), [GuestInviteCard.tsx](../src/components/GuestInviteCard.tsx).

| Aspect | Spec |
|---|---|
| Data | `useGetGuest(id)`; `useGetWhatsAppInvites("guestId", id)` for backend-built RSVP and WhatsApp links |
| Header title | "Guest" |
| States | Loading skeletons; error Notice "We couldn't load this guest." + "Back to guests"; missing id Notice + "All guests" |
| Top | Ghost "All guests" back link; identity card: initials tile, name, side badge, group; facts Email (`mailto:`), Mobile (`tel:`), Added, Accommodation ("Requested"/"Not required"); optional "Where they're staying" and "Notes" |
| Invitations | "Invitations" heading + "{replied} of {n} replied"; grid of invite cards (2 cols ≥ 46rem, 3 ≥ 72rem); none: "Not invited to anything yet." + "Go to events" |
| Invite card | Left edge in status colour; event title, weekday date and time (UTC), place; status select ("Awaiting reply" placeholder; Attending / Maybe / Declined) lets the host set the reply; description (2 lines); reply details (plus-ones, dietary label, song, message); footer activity ("Replied …" / "Reminder sent …" / "Invite sent …" / "Invite not sent yet"), amber "Reply by {deadline}" while unanswered; "Send on WhatsApp"/"Resend on WhatsApp" opens `wa.me` in a new tab and marks the invite sent (disabled with a hint when no valid number); link icon copies the RSVP URL |

### 6.7 `/page-settings` — RSVP page

[PageSettings.tsx](../src/pages/PageSettings.tsx), [PageSettingMain.tsx](../src/components/PageSettingMain.tsx), [PageSettingsIllustration.tsx](../src/components/PageSettingsIllustration.tsx), [PageSettingsGuestQuestions.tsx](../src/components/PageSettingsGuestQuestions.tsx), [PageSettingsReminders.tsx](../src/components/PageSettingsReminders.tsx), [PageSettingsGuestList.tsx](../src/components/PageSettingsGuestList.tsx).

| Aspect | Spec |
|---|---|
| Purpose | Configure each event's guest-facing RSVP page |
| Data | `useGetGuestEventInviteFormatsInfinite(weddingId, 5)` (events with their format, wedding and stats); `useGetViewUrl` for images |
| Header title | "RSVP page" |
| States | Loading skeletons; error Notice "We couldn't load these settings."; no events → NoEventsState |
| EventBar | Event pills (+ Load more); "Unsaved changes"; "Save changes" |
| Layout | 2/3 settings column + 1/3 sticky "Live preview" (from 64rem container) |
| Card "Invitation illustration" | Empty: "Upload a photo of the couple" + "Choose photo" → round crop dialog "Crop Thumbnail" (zoom 1–3, "Apply Crop") → upload. With photo: 1. Photo Type (couple/bride/groom buttons), 2. Illustration Theme (Traditional Indian, Modern Minimalist, Watercolor, Royal Heritage), 3. Illustration Style (12 tiles), 4./5. attire selects (bride + groom for couple, one otherwise; 13 options), Original Photo + "Change"; right column preview ("Creating your illustration…" with a warning not to leave, generated image + "Ready" + "Download", or placeholder); "Generate Illustration · 5 credits" (disabled when credits < 5, with explanation); "Remove Images" confirm dialog |
| Card "What to ask guests" | Switches: Dietary preference, Plus ones, Song request, Message to the couple (icon, title, description) |
| Card "Deadline and WhatsApp reminders" | RSVP deadline date input (empty = open); switches First reminder (7 days after invite), Final reminder (3 days before deadline) |
| Card "Who's invited" | Row "{n} guests invited" / "{a} attending · {m} maybe · {d} declined · {p} pending", chevron; activating it goes to `/guests?event={id}` |
| Live preview | `RsvpPhonePreview` reflecting unsaved toggles and the generated illustration |
| Save | `PATCH page-setting/{formatId}`; the deadline is sent as the end of that day in the host's timezone (ISO); the form re-bases on success |

**RSVP settings form** — [pageSetting.validation.ts](../src/validations/pageSetting.validation.ts). No field has validation rules; every field is optional.

| Field | Type | Set by |
|---|---|---|
| `illustration_theme`, `illustration_style`, `photo_type`, `bride_attire_style`, `groom_attire_style` | string ‖ null | illustration controls (defaults applied once a photo exists: traditional, royal_regal_portrait, couple, default, default) |
| `raw_image`, `generated_image` | S3 key ‖ null | upload / generate / remove |
| `dietary_preference`, `plus_ones`, `song_request`, `message` | boolean (default false) | switches |
| `first_reminder`, `final_reminder` | boolean (default false) | switches |
| `rsvp_deadline` | `YYYY-MM-DD` ‖ null | date input |

### 6.8 `/invite-card` — Invite Card

[InviteCard.tsx](../src/pages/InviteCard.tsx), [InviteCardMain.tsx](../src/components/InviteCardMain.tsx), [DesignConfigForm.tsx](../src/components/DesignConfigForm.tsx), [ReferenceUploadForm.tsx](../src/components/ReferenceUploadForm.tsx), [OwnCardUploadForm.tsx](../src/components/OwnCardUploadForm.tsx), [CustomMessageForm.tsx](../src/components/CustomMessageForm.tsx), [CharacterPhotoForm.tsx](../src/components/CharacterPhotoForm.tsx), [DesignPreviewCard.tsx](../src/components/DesignPreviewCard.tsx).

| Aspect | Spec |
|---|---|
| Purpose | Produce each event's invitation card: AI from presets, AI from an example, or upload an existing card |
| Data | `useGetInviteCardsByWeddingInfinite(weddingId)`; generation status polling; `useAiCredits` |
| Header title | "Invite Card" |
| States | Loading skeletons; no events → NoEventsState "Create an event to design its invitation card." |
| EventBar | Event pills; "Unsaved changes"; "Save changes" (saves configuration without generating) |
| Tabs | "Describe a design" / "Use an example" / "Use my own card" (shorten to Describe / Example / My card below 34rem; icons hidden below 22rem). Reopens on the tab matching the saved `card_source` |
| Describe tab | "Design your invitation": 8 required selects with info tooltips — Design Preset, Texture, Typography, Metallic Accents, Padding, Monogram Style, Text Alignment, Border Style — and "Additional Details (Optional)" |
| Example tab | "Reference an example *" upload (JPG/PNG/WebP ≤ 20 MB) with preview and "Remove"; "Anything to change from the example?" |
| My card tab | Upload area "Click to upload your card" / "Replace the current card"; blocked while a generation runs ("A card is being generated right now. Upload once it's finished.") or when the event has no card record. Upload saves immediately as `card_source: UPLOAD` |
| Below tabs (not on My card) | "Your own message" (optional); "Put the couple on the card" (optional photo; then who is in the photo, placement choice in Example mode, illustration style tiles (optional, toggle), attire selects); full-width "Generate invitation" / "Generate from example" "· 10 credits", disabled when credits < 10 or uploads are running |
| Preview card | 9:16 frame: image + "Download"; generating: stage text ("Queued — starting shortly…", "Designing your invitation…", "Adding your wedding details…", or "The AI service is busy. Retrying automatically…" + "Attempt n of m"); failed: message by error code + "Try again" (not for BILLING); empty: "Nothing generated yet" |
| Background run | Generation continues on the server; the page resumes polling after reload and toasts completion only for runs it watched |

**AI invite form** — [inviteCard.validation.ts](../src/validations/inviteCard.validation.ts).

| Field | Input | Required when | Message |
|---|---|---|---|
| `activeTab` | tabs | always (`describe` ‖ `upload`) | — |
| `designPreset`, `textureEmulation`, `typographyPairing`, `metallicAccents`, `negativeSpace`, `monogramStyle`, `textAlignment`, `edgeStyling` | selects (options in [constants/index.ts](../src/constants/index.ts)) | `activeTab = describe` | "Design preset is required.", "Texture is required.", "Typography is required.", "Metallic accent is required.", "Padding is required.", "Monogram style is required.", "Text alignment is required.", "Border style is required." |
| `additionalDetails`, `customMessage` | textarea | never | — |
| `referenceKey` | example upload | `activeTab = upload` | "Reference image is required when in upload mode." |
| `characterKey` | couple photo upload | never | — |
| `photoType` | couple / bride / groom | always (default couple) | — |
| `photoPlacement` | "Put our faces on the example's couple" / "Add us as a framed portrait" | photo uploaded and `activeTab = upload` | "Choose how your photo should be used." |
| `illustrationStyle` | 12 tiles | never | — |
| `brideAttireStyle`, `groomAttireStyle` | selects | photo uploaded, new portrait composed (Describe, or Example + framed inset), couple | "Bride attire style is required.", "Groom attire style is required." |
| `singleAttireStyle` | select | same, bride or groom only | "Attire style is required." |

### 6.9 `/guest-preview` — Guest Preview

[GuestPreview.tsx](../src/pages/GuestPreview.tsx), [GuestPreviewMain.tsx](../src/components/GuestPreviewMain.tsx), [SendInvitesDialogue.tsx](../src/components/SendInvitesDialogue.tsx).

| Aspect | Spec |
|---|---|
| Purpose | See exactly what a guest gets for an event, and send it on WhatsApp |
| Data | `useGetGuestEventInviteFormatsInfinite(weddingId, 5)`, `useGetDueReminders(eventId)`, signed URLs for the card and the RSVP illustration |
| Header title | "Guest Preview" |
| States | Loading 3 skeleton frames; error Notice "We couldn't load this preview."; no events → NoEventsState |
| EventBar action | "Send RSVPs on WhatsApp" (icon only below 26rem) with "{n} due" pill when reminders are due |
| Note | "What a guest sees when they open their link. Replies made here don't count — this is a preview." |
| Columns (3 at ≥ 64rem) | Invitation card 9:16 (skeleton while loading; missing: "No invitation card yet." + "Create invitation card" → `/invite-card` with the event in navigation state; load error message); RSVP card preview with saved settings; location card |
| Send dialog | Title "{event} on WhatsApp"; tabs Invites / Reminders (count). Invites: "{sent} of {n} sent" bar, switch "Show guests already sent", rows with guest, detail ("Sent {date}" / "Not sent yet" / "No valid mobile number") and Send / Resend (opens `wa.me` in a new tab and marks sent). Reminders: rows with "Send reminder"; empty text explains the 7-day and 3-day rules, or that reminders are off. "Close" |

---

## 7. Form rules for auth

[auth.validation.ts](../src/validations/auth.validation.ts). Password rule set (signup, reset): min 8 "Password must be at least 8 characters long"; an uppercase, a lowercase, a number and a special character ("Password must include at least one …"); max 20 "Password must be no longer than 20 characters".

| Form | Field | Required | Rules | Messages |
|---|---|---|---|---|
| Sign in | `email` | yes | min 1, email | "Please enter your email", "Invalid email address" |
| | `password` | yes | min 1 only (strength rules deliberately not shown) | "Please enter your password" |
| Sign up | `firstName`, `lastName` | yes | trim, min 1, min 3, max 50 | as in §6.2 |
| | `email` | yes | email, trim | "Enter valid email address" |
| | `mobileNumber` | yes | PhoneInput; min 10, max 15 | "Please enter a valid mobile number", "Mobile number too long" |
| | `password` | yes | password rule set | as above |
| | `confirmPassword` | yes | equals `password` | "Passwords don't match." |
| Forgot password | `email` | yes | email, trim | "Enter valid email address" |
| Reset password | `token` | hidden (from URL) | string | — |
| | `newPassword` | yes | password rule set | as above |
| | `confirmPassword` | yes | equals `newPassword` | "Passwords don't match." |

The guest RSVP form has no schema: inputs cap free text at 500 characters and plus-ones at 0–9 ([RsvpForm.tsx](../src/components/RsvpForm.tsx)).

---

## 8. Accessibility

### 8.1 Present in code

| Feature | Where |
|---|---|
| Form fields: label `htmlFor`, `aria-invalid`, `aria-describedby` linking description and error | [form.tsx](../src/components/ui/form.tsx) |
| Keyboard-operable non-button row: `role="button"`, `tabIndex={0}`, Enter/Space | [PageSettingsGuestList.tsx](../src/components/PageSettingsGuestList.tsx) |
| Toggle state via `aria-pressed` | [EventSwitcher.tsx](../src/components/EventSwitcher.tsx), [WeddingToolbar.tsx](../src/components/WeddingToolbar.tsx), [CharacterPhotoForm.tsx](../src/components/CharacterPhotoForm.tsx) |
| Icon buttons with `aria-label` | "Toggle Theme", "Select wedding", "Guest list options", "Guest options", "Options for {title}", "Copy RSVP link", "Change profile picture", "Remove profile picture", "Save changes" (collapsing label), "Show/Hide password", "Decrease/Increase plus-ones", "RSVP status for {event}", "Invite status", "Side", "Sort events", "RSVP deadline", brand link "WeddlyAI" |
| Collapsed sidebar items keep labels as tooltips; sidebar toggle has `sr-only` text; Ctrl/Cmd+B shortcut | [AppSidebar.tsx](../src/components/AppSidebar.tsx), [sidebar.tsx](../src/components/ui/sidebar.tsx) |
| Progress semantics: `role="progressbar"` with `aria-valuenow/min/max` and label | [WeddingCard.tsx](../src/components/WeddingCard.tsx) |
| Live regions: `role="status"` on the SSE indicator; `aria-live="polite"` on the plus-ones count | [RecentRsvpsCard.tsx](../src/components/RecentRsvpsCard.tsx), [RsvpForm.tsx](../src/components/RsvpForm.tsx) |
| Stepper grouped with `role="group"` + `aria-labelledby` | [RsvpForm.tsx](../src/components/RsvpForm.tsx) |
| Decorative dots, initials and logo `aria-hidden` | many |
| `sr-only` text on spinner and dialog close | [loader.tsx](../src/components/ui/loader.tsx), [dialog.tsx](../src/components/ui/dialog.tsx) |
| Menus previously hover-only are always visible (touch reachable) | [EventCard.tsx](../src/components/EventCard.tsx), [ReferenceUploadForm.tsx](../src/components/ReferenceUploadForm.tsx) |
| Preview on auth pages is `inert` | [AuthAside.tsx](../src/components/auth/AuthAside.tsx) |
| Native `<details>` for FAQ; mobile menu `aria-expanded` | [FaqSection.tsx](../src/components/landing/FaqSection.tsx), [landing/Header.tsx](../src/components/landing/Header.tsx) |
| `iframe` title on the map; `alt` on card images | [EventLocationCard.tsx](../src/components/EventLocationCard.tsx), [Rsvp.tsx](../src/pages/Rsvp.tsx) |
| Reduced motion respected for the landing animation | [index.css](../src/index.css) |
| Colour status also carried by text (badge labels, legends, `title` on event badges) | [GuestFields.tsx](../src/components/guests/GuestFields.tsx) |

### 8.2 Gaps

| Gap | Where |
|---|---|
| Wedding switcher popover is custom: no `aria-expanded`/`aria-haspopup`, no Escape to close, no focus return, closes only on outside mousedown | [WeddingSwitcher.tsx](../src/components/WeddingSwitcher.tsx) |
| Illustration style tiles are clickable `div`s (no role, tab stop or key handling); step labels are `<label>` without `htmlFor` | [PageSettingsIllustration.tsx](../src/components/PageSettingsIllustration.tsx) |
| Upload areas are `<label>`s around an input with class `hidden` (display: none), so they cannot be reached with the keyboard | [ReferenceUploadForm.tsx](../src/components/ReferenceUploadForm.tsx), [CharacterPhotoForm.tsx](../src/components/CharacterPhotoForm.tsx), [OwnCardUploadForm.tsx](../src/components/OwnCardUploadForm.tsx) |
| Info tooltip triggers in the design form have no accessible name | [DesignConfigForm.tsx](../src/components/DesignConfigForm.tsx) |
| `MultiProgressBar` exposes no values to assistive tech (legend nearby is visual) | [MultiProgressBar.tsx](../src/components/custom/MultiProgressBar.tsx) |
| RSVP preview labels are not associated with controls (preview only) | [RsvpPreviewCard.tsx](../src/components/RsvpPreviewCard.tsx) |
| No per-route `document.title`; every tab reads "WeddlyAI" | [index.html](../index.html) (no `document.title` in `src`) |
| Password strength UI uses fixed grays and hex colours rather than theme tokens | [PasswordIndicator.tsx](../src/components/custom/PasswordIndicator.tsx) |
| Delete confirmations give no pending feedback | delete dialogues |

---

## 9. Known UI gaps and inconsistencies

Observations only.

| # | Observation | Evidence |
|---|---|---|
| G1 | Fixed 2026-10-01: `Button` used to spread `props` after `disabled={props.disabled ‖ loading}`, so an explicit `disabled={false}` re-enabled a loading button. `disabled` is now applied after the spread, so every button is disabled while `loading`. | [button.tsx](../src/components/ui/button.tsx) |
| G2 | Wedding "Message to guests" has no required marker and the schema marks it optional, but the form sends `""`, which fails `min(1)` ("Message is required"). | [wedding.validation.ts](../src/validations/wedding.validation.ts), [WeddingActionDialogue.tsx](../src/components/WeddingActionDialogue.tsx) |
| G3 | Groom name has no 3-character minimum; bride name does. | [wedding.validation.ts](../src/validations/wedding.validation.ts) |
| G4 | An event whose date has passed cannot be edited without moving it to today or later (`min` on the input + schema check). | [EventActionDialogue.tsx](../src/components/EventActionDialogue.tsx), [event.validation.ts](../src/validations/event.validation.ts) |
| G5 | Fallback toast copy for events says "New Wedding Updated Successfully" and "Wedding Deleted Successfully"; the wedding delete guard says "Missing wedding id for edit". | [use-event.ts](../src/hooks/use-event.ts), [WeddingDeleteDialogue.tsx](../src/components/WeddingDeleteDialogue.tsx) |
| G6 | Dietary options drift: the settings toggle says guests are asked about "vegetarian, vegan, Jain or none of these"; the real form uses `DIETARY_OPTIONS` (no Jain; has Eggetarian, Lactose free, Other); the preview hard-codes Vegetarian / Non-vegetarian / Jain / Gluten-free. Preview plus-ones start at 1, the real form at 0. | [PageSettingsGuestQuestions.tsx](../src/components/PageSettingsGuestQuestions.tsx), [constants/index.ts](../src/constants/index.ts), [RsvpPreviewCard.tsx](../src/components/RsvpPreviewCard.tsx), [RsvpForm.tsx](../src/components/RsvpForm.tsx) |
| G7 | Profile mobile number is a plain text input; signup and guests use `PhoneInput` with a country code. | [ViewProfile.tsx](../src/pages/ViewProfile.tsx) |
| G8 | Page titles differ from nav labels: Dashboard → "Wedding Dashboard", Invite card → "Invite Card", Guest preview → "Guest Preview", View profile → "My Profile" (its loading skeleton says "Profile"). The header shows the active wedding next to "My Profile" too. | pages, [Header.tsx](../src/components/Header.tsx) |
| G9 | Forgot-password success navigates to `/weddings`; a signed-out user is then redirected to `/signin`. | [use-auth.ts](../src/hooks/use-auth.ts) |
| G10 | `/signup` does not redirect signed-in users; `/` and `/signin` do. | [router.tsx](../src/router.tsx) |
| G11 | Delete dialogs close immediately without a pending state; failures only toast. | delete dialogues |
| G12 | Switching events on the RSVP page or Invite card discards unsaved edits; only the "Unsaved changes" marker warns. | [PageSettingMain.tsx](../src/components/PageSettingMain.tsx), [InviteCardMain.tsx](../src/components/InviteCardMain.tsx) |
| G13 | On the RSVP page, uploading the source photo sets `raw_image` without `shouldDirty`, so "Save changes" may stay disabled until something else changes (generating marks the form dirty). | [PageSettingsIllustration.tsx](../src/components/PageSettingsIllustration.tsx) |
| G14 | Illustration steps are numbered "5. Groom Attire Style" and "5. Original Photo" for couples; its labels are title case ("1. Photo Type") while the rest of the app uses sentence case. | [PageSettingsIllustration.tsx](../src/components/PageSettingsIllustration.tsx) |
| G15 | RSVP illustration generation is a synchronous request ("do not leave this page"), whereas invite card generation runs in the background and survives reloads. | [PageSettingsIllustration.tsx](../src/components/PageSettingsIllustration.tsx), [InviteCardMain.tsx](../src/components/InviteCardMain.tsx) |
| G16 | Invite card page has no error state for a failed list load (it only handles loading and empty). | [InviteCardMain.tsx](../src/components/InviteCardMain.tsx) |
| G17 | The public RSVP page shows "This invitation link isn't valid" for any failure, including network errors. | [Rsvp.tsx](../src/pages/Rsvp.tsx) |
| G18 | Toasts use `react-hot-toast` default styling, not the theme tokens. | [main.tsx](../src/main.tsx) |
| G19 | Casing is mixed: "Delete Wedding" vs "Delete guest"/"Delete event"; "Add Wedding" in the switcher vs "New wedding" on the page; switcher empty copy "No weddings found" vs "No wedding projects found". Switcher rows format dates with the browser locale, elsewhere `en-GB`. | [WeddingDeleteDialogue.tsx](../src/components/WeddingDeleteDialogue.tsx), [WeddingSwitcher.tsx](../src/components/WeddingSwitcher.tsx) |
| G20 | CSS utilities `.glass`, `.glass-card`, `.glow`, `.text-gradient` are defined but not used in any component. | [index.css](../src/index.css) |
| G21 | `EventList` has a "No wedding selected." notice that `RequireWedding` makes unreachable. | [EventList.tsx](../src/components/EventList.tsx) |
| G22 | Global scrollbars are hidden on `html`/`body`; only `ScrollFade` lists add a fade cue. | [index.css](../src/index.css), [ScrollFade.tsx](../src/components/custom/ScrollFade.tsx) |
| G23 | Reset password shows no feedback for errors that don't mention "token", "expire" or "link". | [use-auth.ts](../src/hooks/use-auth.ts) |
