# Website audit — 20 October 2026

Audited the local working copy. This report does not describe a deployed release.

## Verified

- 65 public sitemap pages returned HTTP 200 with one H1, a description, and the expected canonical URL. No duplicate titles or descriptions were found in that crawl.
- The crawl discovered 85 internal URL targets. Public static and editorial links were checked, along with referenced local image files. Database-driven `/sell/...` inventory paths require separate catalog-data checks.
- JSON-LD encountered in the crawl parsed successfully. Matching visible FAQ content supplies the homepage FAQ markup. Model and area pages include breadcrumb/service markup.
- The generated social-preview endpoint returns an image/png response.
- Admin, tracking, repair form, and repair confirmation pages return noindex metadata. Invalid area and unknown page URLs return HTTP 404.
- TypeScript and five loading regression tests pass.

Machine-readable page results: `site-audit-results.json`. Blog inventory: `blog-audit-results.json`.

## Changes made

- Removed conflicting static robots/sitemap copies, leaving the generated Next routes as the source of truth.
- Removed Googlebot/Bingbot exceptions that bypassed the common private-route exclusions.
- Fixed selling-entry canonicals and repeated brand names in titles. Gave all 20 model/brand/gaming landing pages distinct descriptions and social metadata.
- Replaced missing social-image references with a working generated preview, using the Edge runtime to avoid the local Windows image-rendering error.
- Removed homepage review/rating markup without supporting evidence in the repository, removed a nonfunctional search action, and aligned FAQ schema with the rendered FAQ data.
- Replaced unsupported homepage metrics and numerical competitive-price claims with practical assessment and handover information.
- Restored homepage selling steps and added contextual guides on preparation, resale-value comparisons, and selling routes. Connected device guides so they are discoverable from one another.
- Fixed the generic tracking link to open order help instead of a fabricated order ID. Preserved existing blog redirects.
- Added the floating navigation/footer treatment to blog, about, contact, and repair information pages. Added skip-to-content targets and mobile menu state announcements.
- Made search results keyboard-operable, safe against missing catalog relationships, and responsive to catalog data arriving after a visitor starts typing.
- Added contact-form pending/timeout handling and protected against repeated taps while submission is pending.
- Bounded optional CMS summary/sitemap queries so built-in articles remain available during a slow CMS request. Removed generated “last modified now” timestamps from unchanged sitemap entries.
- Isolated audit output via `LAPTAP_BUILD_DIR=.next-audit` so audit servers do not share `.next` files with the normal development server.

## Blog review

The six built-in guides cover selling options, preparation/data removal, refurbished-device checks, refurbished versus new, the Bangalore selling process, and resale-value comparisons. They contain approximately 1,224–1,400 words and 9–12 main sections each. All contain contextual internal links. Preparation and operating-system guidance links to manufacturer documentation where relevant.

Word count is an inventory measure, not a quality or ranking score. Keep future updates specific to the reader’s decision; avoid adding interchangeable area paragraphs, unsupported prices, or invented customer stories. The existing table of contents, related reading, author/date display, and contextual CTAs support navigation through the guides.

## Remaining checks outside this local audit

- Confirm business-owned statistics, address, opening hours, pickup promises, and payment terms against actual operations. Historical numbers still appearing on About were not independently verified.
- Check live Search Console indexing, submitted sitemap, rich-result eligibility, search traffic, and real-user Core Web Vitals after deployment. No ranking or performance score is implied by this audit.
- Validate database-managed brand/model inventory and any CMS articles beyond the six built-in guides. No production form submissions were created.
- Perform browser-based mobile/desktop visual, keyboard, and screen-reader checks. Source and rendered HTML checks do not establish pixel-perfect appearance or complete accessibility compliance.
- Configure a real analytics measurement ID if analytics is intended; the root layout currently contains a placeholder ID.

## Reproduce

In PowerShell, start an isolated server:

```powershell
$env:LAPTAP_BUILD_DIR = '.next-audit'
npx next dev -p 3106
```

In another terminal:

```powershell
node tests/site-audit.cjs http://localhost:3106
npx tsc --noEmit
node --test tests/loading.test.cjs
```

## References

- [Google: crawlable internal links and descriptive anchor text](https://developers.google.com/search/docs/crawling-indexing/links-crawlable)
- [Google: structured data must represent visible, accurate content](https://developers.google.com/search/docs/appearance/structured-data/sd-policies)
- [Google: helpful, reliable, people-first content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)
