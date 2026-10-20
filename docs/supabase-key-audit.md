# Supabase key audit — 17 October 2026

## Confirmed exposure

Before this change, `lib/supabase/client.ts:7` and `lib/supabase/server.ts:5` contained the same hardcoded legacy JWT with role `anon`. Both preferred `NEXT_PUBLIC_SUPABASE_ANON_KEY` and silently fell back to that JWT.

The local browser build contained this JWT in eight JavaScript files, including layout, contact, admin, repair, and tracking chunks. `app/providers.tsx` loads `AuthProvider`, which imports the shared browser client, so the client is reachable from the global layout.

Read-only inspection of https://www.laptap.in/ returned HTTP 200. Of its 24 linked scripts, two contained a legacy `anon` JWT:

- `/_next/static/chunks/2475-7b7bfa5c247f2adb.js`
- `/_next/static/chunks/app/layout-bdaf4d23a4ecec08.js`

No publishable key, secret key, or service-role JWT was found in those deployed homepage scripts. This confirms production exposure before redeployment; it is not a claim that every deployed route was fetched.

## Local remediation

Both clients now use a shared configuration that requires `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` to start with `sb_publishable_`. The legacy environment variable and hardcoded JWT fallbacks are removed. The supplied publishable key and existing project URL are configured in ignored `.env.local`. README setup instructions use the new variable.

A publishable key remains visible to browsers by design. It still uses the database's `anon` role for unauthenticated requests. Changing the key format does not change RLS permissions. Never put an `sb_secret_` key in a public environment variable.

## Related access-control findings

These findings come from local code/migrations, not a live database policy inspection:

- Guest sell, repair, and contact INSERT policies use `WITH CHECK (true)`. Direct API callers can bypass form validation and submit any columns allowed by table grants and constraints. Review status, ownership, pricing, and spam controls. See migrations `20260825000800`, `20260825000900`, and `20260825001000`.
- `generate-blog` has gateway `verify_jwt = true`, but its handler does not verify an admin role before spending the AI API key. A signed-in non-admin may therefore invoke generation. The frontend admin page does not enforce backend authorization. No paid generation request was made during this audit.
- Migration `20251113000000_admin_privileges_and_brand_logos.sql` automatically assigns admin to a signup matching a fixed email address. Review signup and email-verification settings and replace email-based automatic grants with explicit provisioning.
- The image allowlist in `next.config.mjs` references a different Supabase project than the client configuration. This is configuration drift, not a key leak.

## Scope and deployment

Validation after remediation: TypeScript (`npx tsc --noEmit`) passed. Configuration checks accepted a publishable key and rejected missing configuration, legacy JWTs, and secret keys. The fresh browser build contained 76 JavaScript files: zero JWT literals, zero secret keys, and eight files containing publishable-key configuration. The source scan found no remaining legacy JWT or `NEXT_PUBLIC_SUPABASE_ANON_KEY` references in application code and setup documentation.

Inspected application routes, shared components, auth context, Supabase clients, public assets, SQL migrations, edge function code, Next/Vercel configuration, README, and local browser bundles. Existing unrelated working-tree changes were preserved. No service-role JWT or literal `sb_secret_` credential was found in the scanned source/browser assets.

Hosting environment variables, live RLS policies, Supabase key ownership/validity, historical Git commits, and authenticated workflows were not verified. No database writes or key revocations were performed.

Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` in hosting, rebuild, and redeploy. Confirm auth, catalog, forms, and signed-in admin function calls work. Check deployed browser bundles for legacy JWTs again. After all consumers migrate, disable legacy API keys in Supabase; old bundles and repository history may retain the previous public key.

References: https://supabase.com/docs/guides/getting-started/api-keys and https://supabase.com/docs/guides/getting-started/migrating-to-new-api-keys.
