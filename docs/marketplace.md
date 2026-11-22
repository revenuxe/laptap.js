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

Store commerce (20261122000900): /store now owns its header, left-hand menu and footer. Its menu includes cart, customer account, saved devices and My orders; seller registration stays in the footer. Cart stores at most eight listing IDs locally and never stores buyer contact/address data. Each listing represents one physical unit. Buy Now opens /store/checkout?buy=<listing ID>; Add to cart supports a mixed-seller checkout. Customer account pages support registration, email confirmation, sign-in and password reset, with store-specific auth redirect URLs. Private account/cart/checkout/order routes are noindex.

Sellers explicitly choose home delivery with COD, public store pickup with payment at collection, or both. Delivery charges are per device; service areas use selected pincodes or an explicit Across India choice. Pickup has its own public collection address and instructions. Publishing through the seller editor validates fulfilment settings. Existing listings without options remain enquiry-only until configured. Pickup-only checkout asks for name and phone without requiring a home address. Mixed orders collect a delivery address only for delivery items; pickup orders store the pickup location instead of the buyer's home address.

marketplace_place_order validates the verified buyer, contact/address details, seller approval, delivery area, fulfilment method, exact current total, and consent. It locks sellers and device rows in a consistent order and atomically reserves all devices. A client-generated checkout ID and canonical request fingerprint make retries idempotent. Failed or stale carts roll back in full. Buyers cannot purchase their own listings. Limits are 20 checkouts/day and 12 pending devices per account. COD and pay-at-pickup remain unpaid until actual collection is recorded by an admin; checkout never claims an online charge. Product/condition/warranty/price and pickup details are saved as immutable order snapshots.

Buyer orders and event timelines are exposed through account-scoped projections, excluding internal notes and transaction references. Buyers can cancel only their own unpaid pending orders with a reason. Sellers can accept pending orders, dispatch delivery orders with courier/tracking, mark delivery, or confirm pickup readiness and collection without a courier. Admins manage recorded payments, refunds and support; cancellation does not automatically relist inventory. My orders refreshes periodically while visible and on focus, displays current status and tracking, and links to shopping help. Signed-in account changes clear checkout contact state and prevent another account's cached orders from appearing. SQL tests/checkout-live.sql uses rolled-back fixtures; tests/checkout.test.cjs covers contact/address, service areas, seller fulfilment validation and status labels. Browser QA uses mock orders and does not place real purchases or send emails.

Google customer sign-in: Continue with Google is available in store sign-in/create-account and inline checkout. Supabase performs OAuth; the callback is the already-allowed /store/account URL. A same-tab, 30-minute return intent sends shoppers back to their original checkout (including Buy Now) or store destination after authentication. Return paths are normalized and restricted to store routes. OAuth cancellation/provider-disabled errors retain the email sign-in option. Google must be enabled with the business's own Google OAuth client ID/secret in Supabase; the Google Cloud authorized redirect URI is https://pdwdonojugtersushxtv.supabase.co/auth/v1/callback. No OAuth secrets belong in browser environment variables or committed files.

Category browsing: /store/laptop and /store/desktop are dedicated category routes. Homepage category cards, carousel category actions, navigation, drawer, footer, tabs and product breadcrumbs point to these paths. Category pages render their initial published inventory on the server using anonymous RLS, and client filters/pagination remain restricted to the category. Category pages have distinct H1s, descriptions, canonical and social metadata, visible breadcrumbs, CollectionPage/ItemList and BreadcrumbList JSON-LD, relevant buying guidance and FAQs, and sitemap entries. Demo listings are excluded from structured product lists. Legacy /store?category=laptop|desktop links redirect permanently to their category route. First-page rendering uses 24 products plus a pagination sentinel; the complete non-demo product sitemap supports discovery beyond the first page. These technical improvements support discovery and indexing without promising search rankings.

## Managed marketplace (migrations 010-014)

This replaces the seller self-publication and self-fulfilment workflow described above. Checkout remains **cash on delivery or cash at the Laptap hub**. No gateway, online charge, refund transfer, or bank payout API is connected.

- Every non-demo listing starts privately and requires admin review. Sellers submit ownership confirmation, private serial/service tag, diagnostic notes or private diagnostic images, and a private collection address. The seller accepts the current price/commission policy. Rejection feedback appears in the editor. Material changes to an approved listing hide it and return it to review. Reserved devices cannot be materially edited.
- Default commission tiers: below INR 10,000 = 12%; 10,000-19,999 = 10%; 20,000-39,999 = 9%; 40,000-69,999 = 8%; 70,000+ = 7%. Minimum commission INR 799. Minimum listing price INR 1,000. No maximum commission. Buyer inspection/support fee INR 299 on eligible devices, configurable per policy with an admin listing-level waiver. Default desktop handling and delivery fees are zero; initial acceptance period is 48 hours. Admin policy changes use optimistic version checks. The listing saves accepted seller commission and acceptance terms; orders save immutable financial snapshots. Buyer fees are recalculated and disclosed before checkout.
- Admin Store now has Listing reviews, Managed orders/inspection jobs, COD reconciliation, Seller payouts and Commission & services. Review remote diagnostics before approving. Approval alone does not award physical verification. Physical inspection checks cover display, keyboard/trackpad, battery/power, storage, ports, performance, BIOS/device locks, ownership and serial matching. Failed inspections can be rescheduled or the uncollected order cancelled.
- Laptap confirms availability, schedules inspection, records the actual report/checklist, schedules seller pickup, records collection proof, confirms actual secure wipe and serial-matched packaging, dispatches with courier/run tracking, and records delivery/hub collection proof. The database gates these transitions. Buyer and seller see a safe progress projection; staff assignment and private collection information remain private. Hub pickup becomes ready only after collection, wipe and packing.
- COD collection records are append-only, reference-unique and idempotent. Partial collections cannot exceed the order total. Only full collection marks an order paid. Refund records represent an actual full remaining refund after a cancellation/return request. Admin confirms the transaction occurred outside the app. The ledger does not move money. Operating costs have immutable records and server-calculated totals; the policy contribution calculator is an estimate, not an audited profit statement.
- A seller payout needs completed delivery, fully recorded buyer payment, an elapsed accepted reporting window, active seller, independently verified payout destination, and no unresolved case/refund. Preparing it freezes the destination. Marking paid requires actual external transfer confirmation and a unique reference. Holds and failed-transfer reconciliation are supported. Refund after payout preserves the transfer reference and creates recovery due, closed only with actual recovery proof. Seller deletion is blocked while settlements/recovery remain unresolved.
- Seller Earnings shows net/commission, pending and paid amounts, eligibility blockers, transfer references and destination verification. For bank payments the app stores bank name, last four account digits and IFSC plus an externally registered beneficiary reference; full account numbers are deliberately not collected here. Register and verify the beneficiary through the business's private banking process. UPI destinations are verified by admin before payout.
- Buyers can report issues from delivered order pages. An open case blocks payout. Admin reviews and resolves or declines it with a buyer-visible note, restores completed delivery when resolved without a refund, or records the actual completed refund and closes the case. Restoring delivery retains the original acceptance deadline. The initial reporting window does not restrict applicable consumer rights.
- Private diagnostic images use the same decode/resize/metadata stripping/WebP pipeline and upload quotas as public photos, but a private bucket and signed previews. Referenced evidence cannot be deleted through the seller storage policy. New admin queues and the seller payout ledger fetch 24 records at a time; private order/review details are loaded only when opened. Financial totals are computed on the server, independent of the latest 100 visible transaction/cost entries.

### Required business setup before real sales

1. In Admin > Store > Commission & services, enter the **actual** delivery pincodes and/or public Laptap hub address and collection hours. Defaults intentionally contain no invented service area or hub. Approval requires at least one valid fulfilment option. Existing approved listing fulfilment settings are preserved until reviewed again; accepted seller financial terms remain fixed.
2. Approve the seller account, review each listing, and confirm that the business can physically inspect, collect and fulfil it. Sellers keep inventory until a buyer is confirmed. No automatic courier dispatch or automated inspection is performed.
3. Verify seller payout destinations privately. Record cash receipts and external transfers only after they actually occur. Online payments can be added later without changing the recorded COD history.
4. Configure operational notifications separately if required; email/SMS dispatch and carrier APIs are not connected. Buyer/seller dashboards refresh while visible and on focus.

Validation: `node --test tests/*.test.cjs`, `npx tsc --noEmit`, production build, and `supabase db lint --remote --schema public --level error --fail-on error`. The current workflow integration test is `tests/managed-live.sql`: it creates isolated auth/profile/listing/order fixtures inside a rollback block, verifies role boundaries, approvals, fees, immutable terms, checklist-gated fulfilment, idempotent COD, payout gating/destination freeze, issue resolution, refunds/recovery and cancellation, then rolls every fixture back. No emails, real purchases or money transfers are made. The historical `marketplace-live.sql`, `seller-live.sql` and `checkout-live.sql` suites describe the superseded direct-publish/self-fulfilment model and are not acceptance tests for the managed flow. Other existing SQL suites may require reviewed fixtures when they create public inventory.

Laptop-only commerce (migration 015): Store navigation, hero, search, saved products, category browsing, seller listing options and product discovery focus on laptops. `/store/desktop` and old desktop category query links redirect temporarily to `/store/laptop`; the desktop store category is removed from the sitemap. Public inventory, cart reads and product/sitemap queries filter laptops. Database guards reject new desktop listings/publication/submissions and new desktop orders. Historical records and non-store desktop sell/Pick pages are retained. The home carousel uses two short laptop-focused slides with one active H1 and no additional eyebrow text.

Brand selection: the seller editor uses a searchable manufacturer dropdown, including series aliases (for example MacBook -> Apple, ThinkPad -> Lenovo), major and legacy brands, and an explicit unlisted-brand entry. Canonical names are saved for consistent new listing metadata/brand URLs. Existing custom brands remain editable and existing persisted SEO paths are not regenerated. The former `/store/desktop` route file is deleted; requests to that removed category return HTTP 410 with `X-Robots-Tag: noindex`. Old desktop query filters still lead to the laptop collection.

Guided seller listing (migration 016): sellers select processor make/family and Intel generation or AMD series, RAM/storage, integrated or dedicated graphics, dedicated VRAM where applicable, condition, battery observations, accessories and warranty duration. Unlisted values remain editable; existing specifications are preserved. "Not sure" records an explicit Laptap-confirmation value instead of inventing specifications. Exact CPU model, RAM type, screen/model year and custom description are optional. Unknown year is NULL rather than a fabricated year; public cards/details show that appropriately and duplicate readable SEO paths handle missing year. Blank descriptions are generated only from supplied title, condition and known specifications. Wear/issue statements are selected explicitly. Warranty starter text is opt-in and editable, never applied simply by choosing a duration. It is a draft coverage description; it does not replace applicable consumer rights (see [Consumer Protection Act, 2019](https://www.indiacode.nic.in/bitstream/123456789/12808/1/the_consumer_protection_act%2C_2019_no._35_of_2019_date_09.08.2019.pdf)).

Seller serial numbers, diagnostic notes and evidence images are optional and collapsed under Extra details. Pickup address defaults to the shop address. Ownership and commission consent, actual photos, price, device model/brand and honest condition disclosure remain required. Admin still reviews each listing; Laptap must record a physical serial/service tag plus all required inspection checks before passing physical inspection. This simplifies the seller form without bypassing the managed fulfilment or payout safeguards.
