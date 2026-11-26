The store is administered from `/admin/dashboard` ? **Store**. Seller login, registration, dashboards and the seller upload endpoint have been removed. Old collection URLs redirect to the store.

Start with **Store setup** and save the store name, description, email, phone, city, store address. Use **Pickup & delivery** to set the pickup address, opening hours, collection instructions, delivery fee, serviceable pincodes, estimated delivery time and delivery terms once for every listing. The storefront reads the saved identity and contact details from Supabase. Renaming the store updates its listings; historical order snapshots remain fixed.

Use **Products ? Add laptop** to enter brand/model, guided specifications, year, screen, battery, accessories, condition disclosures, description, manufacturer/store warranty, photos, price, quantity. Pickup and delivery settings are applied automatically; the listing editor has no fulfilment inputs. Save a draft or publish directly. No seller application, commission acceptance or listing review is required. Publication does not award an inspection badge.

Only admins may write inventory or upload photos. An internal ownership reference maintains compatibility with checkout and order history; new inventory has no external seller payable. Historical finance records remain available where applicable. Active orders protect specifications, and stock guards prevent overselling or changing batch size after orders exist.

Applied Supabase migrations: `20261127000000_admin_owned_store.sql` and `20261127000100_admin_listing_fulfilment.sql`, and `20261127000200_store_wide_fulfilment.sql`.

Validation: `npx tsc --noEmit`, `node --test tests/*.test.cjs`, `npm run build`, and Supabase database lint. Run `npx --yes supabase db query --remote --file tests/admin-store-live.sql --yes` for rollback-only checks of publication, editing, store-wide fulfilment inheritance and updates, permissions, checkout, stock, rename and deletion preserving order history.

Pickup and delivery changes update existing admin-owned listings, including those with active orders. Placed order amounts and pickup snapshots remain fixed. Hours and delivery terms are visible in Shopping help.
