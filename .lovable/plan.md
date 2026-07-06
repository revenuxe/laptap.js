## Goal
Move the entire Laptap app (public site + admin + all sell/repair/auth/blog/location flows, ~60 routes) from the current Vite + `react-router-dom` SPA setup onto **TanStack Start** with server-side rendering, so every page ships fully-rendered HTML for maximum SEO.

This is a large migration. I'll do it in staged commits so the app stays runnable and reviewable at each step, rather than one giant unreviewable change.

---

## Why TanStack Start (vs. what we have)
- Current stack: Vite 5 + React 18 + `react-router-dom` + `react-helmet-async`. Everything is client-rendered — Google sees an empty `<div id="root">` until JS boots.
- TanStack Start: Vite-based, file-based routing, server functions, SSR + streaming, first-class `<head>` per route, works cleanly with Supabase.
- Result: real HTML for `/`, `/sell/*`, `/bangalore`, `/hyderabad/*`, `/blog/*`, `/models/*`, etc. — better crawling, better Core Web Vitals, no Helmet needed.

---

## Phased plan

### Phase 1 — Scaffold TanStack Start alongside current app
- Add TanStack Start deps: `@tanstack/react-start`, `@tanstack/react-router`, `@tanstack/router-plugin`, `vinxi`.
- Rewrite `vite.config.ts` using `@lovable.dev/vite-tanstack-config` with `tanstackStart.server.entry = "server"` (per SSR error-handling knowledge).
- Create the required infra files:
  - `src/server.ts` — lazy handler import + response normalizer + globalThis error capture.
  - `src/start.ts` — request middleware with `errorMiddleware`.
  - `src/lib/error-capture.ts`, `src/lib/error-page.ts`.
  - `src/routes/__root.tsx` with `errorComponent`, global providers (QueryClient, Tooltip, Toasters, Auth), and default `<head>`.
- Delete `src/main.tsx`, `src/App.tsx`, and `BrowserRouter` usage.
- Keep `index.css`, Tailwind config, shadcn components, Supabase client, contexts, and all existing components untouched.

### Phase 2 — Port every route to file-based routing
Map each React Router route to a `src/routes/*.tsx` file. Grouped by area:

```text
src/routes/
  __root.tsx
  index.tsx                       -> Home
  sell.tsx / sell.$category.tsx / sell.$category.$brand.tsx / …
  dashboard.tsx
  auth.tsx
  track.$id.tsx
  about.tsx  contact.tsx  terms.tsx  privacy.tsx
  blog/index.tsx  blog/$slug.tsx  blog/sell-used-laptop-bangalore.tsx
  admin/index.tsx        -> AdminLogin
  admin/dashboard.tsx    -> AdminDashboard
  bangalore/index.tsx  bangalore/macbook.tsx  …
  hyderabad/…
  models/macbook-pro.tsx  …  (all 13 model pages)
  gaming/asus-rog.tsx  gaming/acer-predator.tsx
  repair/index.tsx  repair/brands.tsx  repair/form.tsx  repair/thank-you.tsx
  $.tsx                           -> NotFound
```

Each route:
- Exports `Route = createFileRoute(...)({ component, head, loader? })`.
- Replaces `<Helmet>` blocks with the route's `head()` returning `{ title, meta, links }`.
- Replaces `useNavigate` / `Link` from `react-router-dom` with the TanStack equivalents.
- Keeps the existing page component body — no visual/UX changes.

### Phase 3 — Auth, data, and Supabase integration on SSR
- `AuthContext` becomes SSR-safe: read the Supabase session on the server via cookies (`@supabase/ssr`), hydrate on the client, keep `onAuthStateChange`.
- Wrap admin routes with `beforeLoad` guards that redirect unauthenticated / non-admin users server-side (so `/admin/dashboard` never flashes).
- Preserve the sell-flow state restoration behavior (memory rule).
- Realtime subscriptions and mutations stay client-only, unchanged.
- Convert a handful of high-value pages (Home, `/bangalore`, `/hyderabad`, blog list, individual blog post, model pages) to use `loader` for server-side data fetching so their HTML ships with content — the biggest SEO win.

### Phase 4 — SEO, sitemap, structured data
- Move all JSON-LD, canonical, OG, and Twitter tags into each route's `head()` (currently in Helmet blocks).
- Confirm strict `https://www.laptap.in` canonicalization everywhere (core memory rule).
- Regenerate `public/sitemap.xml` from the new route tree via `scripts/generate-sitemap.ts` (predev/prebuild) so it stays in sync.
- Keep `robots.txt` and phone/WhatsApp numbers (`6360039957`) intact.

### Phase 5 — Cleanup & verification
- Remove `react-router-dom`, `react-helmet-async`, unused `main.tsx`/`App.tsx`.
- Update `package.json` scripts for the TanStack dev/build commands.
- Playwright smoke run against key routes: Home, Sell wizard, Auth, Dashboard, Admin login, Repair flow, one location page, one blog post — verify SSR HTML contains real content and no 500s.
- Publish.

---

## What will NOT change
- Visual design, components under `src/components/**`, Tailwind tokens, shadcn UI.
- Supabase schema, edge functions, RLS policies, storage buckets.
- Business logic: pricing engines, validation schemas, invoice generator, referral logic.
- Phone number `6360039957`, Revenuxe credit, About page structure.

## Risks / call-outs
- **Scope**: ~60 route files to port + auth SSR rewrite. Realistically 4–6 commits; the app will be temporarily in a mixed state between Phase 1 and end of Phase 2.
- **Auth SSR**: Supabase session-in-cookies requires switching to `@supabase/ssr`. Existing `AuthContext` API stays the same for consumers.
- **Admin dashboard** is heavy and client-only (realtime, dialogs). It will be rendered as a client-only route (`ssr: false`) to avoid churn — still routed by TanStack, just not SSR'd. Confirm if you'd rather force SSR there too.
- **`public/sitemap.xml`** is currently hand-managed; I'll migrate it to the generator script (per sitemap knowledge, migration requires your OK).

---

## Confirm before I start
1. OK to migrate the sitemap to the generator script?
2. Admin dashboard as **client-only route** inside TanStack (recommended) vs. full SSR?
3. OK that the app will be in a partially-migrated state across intermediate commits (each still builds and runs)?

Reply "go" (with any tweaks) and I'll start Phase 1.