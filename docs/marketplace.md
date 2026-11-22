# Laptap marketplace

## Connected database

The checkout is linked through the authenticated Supabase CLI to project `pdwdonojugtersushxtv` (Laptap mumbai), matching the app's configured Supabase URL. On 22 November 2026 the pending model-price default and all four marketplace migrations were applied:

- `20260921000000_model_base_price_default.sql`
- `20261122000000_marketplace.sql`
- `20261122000100_marketplace_admin.sql`
- `20261122000200_marketplace_demo.sql`
- `20261122000300_marketplace_hardening.sql`

The store uses the existing publishable key and authenticated session. No service-role key is included in the frontend. Migrations have been applied to Supabase; frontend source still needs its normal application deployment to appear on the hosted site.

## Routes and workflows

`/store`: catalog, category filters, saved devices, search, and carousel.

`/store/[id]`: device gallery, specifications, condition, independent warranty sections, inspection status, and buyer enquiry.

`/store/sellers/[id]`: a seller's published products.

`/store/sell`: seller signup/sign-in, actual-photo uploads, draft/published/sold inventory, and received enquiries. Seller entry links are in the footer.

`/admin/dashboard`: persistent Pick and Store workspaces. Pick retains the existing buyback catalog, pickups, forms, and blog tools. Store includes product moderation, seller suspension, customers grouped by email, order fulfilment, external payment records, enquiry follow-up, inspections, returns, reports, CSV exports, and an audit log.

Creating an order reserves one device atomically. Duplicate active orders are rejected. Cancellation does not automatically relist stock; admins check availability before publishing it again. Shipping requires courier and tracking details. Device-detail changes clear verification; availability changes preserve inspections. Suspension hides the seller's listings and blocks listing changes without removing existing orders.

Enquiry follow-up notes are shared with the listing seller. Order notes and customer order records are admin-only. The admin-grant function is restricted to server-side execution. Internal trigger functions are not directly callable by browser clients.

The public image bucket accepts JPG, PNG, and WebP uploads up to 5 MB. Each authenticated user can upload/remove only their own paths.

## Demo product

`/store/9af8d415-26e1-4b7d-9f2c-0d7a7e988001`

One published `Demo - Dell Latitude 5420` listing belongs to the existing admin account's marketplace seller profile. Its image, specifications, price, condition, and warranty are illustrative. The UI labels it as a demo. Database triggers reject enquiries, orders, and real inspection badges for demo listings. Demo stock is excluded from available inventory and pending-inspection metrics.

## Validation

`npx tsc --noEmit`

`node --test tests/store.test.cjs tests/store-admin.test.cjs tests/loading.test.cjs`

`npm run build`

`npx --no-install supabase db lint --remote --schema public --level error --fail-on error`

`npx --no-install supabase db push --remote --dry-run --skip-vault`

`npx --no-install supabase db query --remote --file tests/marketplace-live.sql --yes`

The live integration suite uses existing admin/non-admin IDs, creates no auth accounts or messages, and rolls back every fixture, including profile changes, orders, enquiries, support cases, and audit rows. Negative fixture order numbers avoid advancing the real sequence. It validates public browsing, seller isolation, admin-only verification, suspension, demo restrictions, order reservation, fulfilment transitions, payment references, support resolution, and audit protections. The demo is the only permanently seeded product.

## Integrations still to configure

Payment collection, refunds, seller payouts, shipping APIs, and automated email/SMS are not connected. Order payment fields record externally completed transactions; they do not transfer money. Purchases currently begin with buyer enquiries and are arranged directly with sellers. The setup screen reports these services accurately.

## Seller Centre

`/seller/login` provides seller sign-in, two-step registration, email-confirmation guidance, password recovery, and password updates. `/seller/dashboard` is the dedicated seller workspace. The former `/store/sell` route redirects to it, and the public footer links to seller login.

Migration `20261122000400_seller_portal.sql` was applied to the linked project on 22 November 2026. It adds application details, pending/rejected states, approval records, and private seller operations. Existing approved sellers remain approved.

New account registrations submit business details through Auth metadata. An Auth trigger creates a pending seller application even when email confirmation means no session is returned. Existing account holders can submit their business application after signing in. Admins review applications under Admin dashboard > Store > Sellers, with explicit approve/reject actions and visible review reasons.

Pending sellers can prepare complete product drafts and upload photos. Publishing is blocked in the database until approval. Rejected applications can be edited and resubmitted; suspended accounts cannot reactivate themselves. Changing the shop name, business address, or tax ID triggers another review and hides public inventory until approval. Seller-visible branding is synchronised after approval.

The dashboard includes inventory search/status filters, bulk publish/draft actions, safe CSV export, a three-step product editor, up to eight photo previews, cover-photo selection, condition and warranty details, order fulfilment, buyer enquiry follow-up, and shop settings. Uploads are limited to JPEG/PNG/WebP files of at most 5 MB. Pending sellers may upload draft photos; suspended sellers may not upload new media.

Seller orders are returned through an authenticated, owner-scoped function that excludes admin notes and external payment references. Sellers can update courier/tracking and move their own confirmed orders to shipped and shipped orders to delivered. They cannot modify order totals, payment state, other sellers' orders, or internal admin data. Enquiry updates are restricted to follow-up status and seller notes.

The Supabase Auth production site URL is now `https://www.laptap.in`, with seller confirmation/recovery routes and local development return URLs allowlisted in `supabase/config.toml`. Existing email-confirmation and MFA settings were preserved. Browser auth checks use mocked requests, and SQL integration checks create only rollback-scoped auth rows; no confirmation or recovery emails were sent during verification. Real email delivery still depends on the project's mail provider configuration.

Run `node --test tests/seller.test.cjs tests/store.test.cjs tests/store-admin.test.cjs tests/loading.test.cjs` for local checks. Run `npx --no-install supabase db query --remote --file tests/seller-live.sql --yes` for the 19 seller lifecycle/access checks; its users, applications, products, orders, and enquiries all roll back. The existing marketplace integration suite remains available in `tests/marketplace-live.sql`.

Admin seller controls: Open Store > Sellers > Manage to review a seller's profile, products, orders, private notes, and account history. Admins can suspend/reactivate and delete/restore the marketplace seller account. Deletion requires an exact shop-name confirmation and recorded reason; protected admin identities, open orders, unpaid delivered orders, cancelled paid orders, and unresolved support cases block deletion. Products become drafts and seller marketplace access closes. General authentication identity and historical records remain intact. Restoration returns the seller to application review and does not republish inventory. Private admin notes are append-only and protected by admin-only RLS. Migration 20261122000500 installs these rules.

Product SEO: Migration 20261122000600 persists stable brand/series/model URL paths, such as /store/dell/latitude/5420. Duplicate model listings use readable configuration suffixes, followed by a listing count if necessary. Product cards and related-product links use canonical paths. Legacy public UUID links redirect permanently through middleware; private admin previews retain UUID access. Product pages render the product on the server with per-product title/description, canonical, social metadata and Product structured data. Public non-demo listings appear in the sitemap; illustrative demo listings are noindex and have no structured Offer.

Performance and image pipeline (20261122000700): Both seller editors send each photo to POST /api/seller/images using the current bearer session. The Node route verifies the user and seller status before decoding. Sharp accepts only real still JPEG/PNG/WebP, caps source size at 5 MiB and decoded area at 40 megapixels, auto-orients, strips metadata, preserves transparency and avoids upscaling. Output is WebP, at most 1600 px on its longest edge; adaptive quality/resizing targets 220 KiB and rejects output above 300 KiB. Storage accepts only WebP up to 300 KiB. Each object path requires an account-scoped quota reservation valid for 15 minutes (60/hour, 300/day), enforced by Storage RLS as well as the API. Files use unique immutable names with a one-year cache lifetime. Save failures clean up newly uploaded objects.

Store product, card, gallery, thumbnail and hero images use responsive Next Image delivery; unrecognized third-party sources fall back to native image loading. Allowed optimization sources are explicitly configured, including the linked marketplace bucket. Smaller responsive variants are cached, offscreen images load lazily, and hero/main product images receive loading priority. The store skips the artificial global loader; server-rendered product data is reused instead of fetched again. Catalog queries request only card columns, use indexed prefix search, cancel obsolete requests, debounce typing and fetch 24 products plus a next-page sentinel. Product details and availability remain uncached for fresh stock/status checks. No checkout or private account responses are publicly cached.

The runtime was upgraded to Next.js 15.5.29, with asynchronous route parameters updated. Zod and form resolvers were upgraded together and CSS dependency patches are pinned through compatible npm overrides. npm audit reported zero known vulnerabilities at validation time. Deploy on Node 22 LTS (or a compatible Node 20.19+ runtime), with native Sharp support, sufficient CPU/memory, and a request-body allowance above 5 MiB; /api/seller/images is a Node function with a 60-second execution budget. Keep the lockfile and install optional platform binaries (normal npm ci); do not use --omit=optional for Sharp. Frontend/API code must be deployed alongside the applied storage migration; the former direct raw upload flow is intentionally rejected by the updated bucket/RLS policies. Production speed still depends on hosting location, cache behavior, traffic, and real device/network conditions; use field Web Vitals after deployment to measure it.

Migration 20261122000800 excludes generated catalog search data and URL metadata from inspection invalidation. Genuine device-detail edits still clear verification; availability-only updates and assigning an inspection preserve it. Marketplace regression tests cover this behavior.

Local builds: Development uses .next-dev; production build/start uses .next. LAPTAP_BUILD_DIR remains available for isolated verification. After dependency changes, restart the Node development process so its module-resolution cache cannot retain removed nested dependency paths. A clean npm ci reproduces the committed dependency tree.
