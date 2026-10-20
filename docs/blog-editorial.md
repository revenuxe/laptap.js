# Blog editing and publishing

The six core guides are maintained in `lib/blog-content.ts`. They replace older seeded CMS articles with matching slugs. Their article bodies, summaries, metadata, related links, and sitemap entries use the same source. Update the edition date when materially revising a guide.

Other published posts continue to load from the Supabase `blogs` table. Draft posts are excluded. The old `sell-used-laptop-bangalore-guide` route permanently redirects to `sell-used-laptop-bangalore` and is omitted from listings and the sitemap.

Core guides take precedence over CMS copies; editing or deleting a matching database row does not change the code-managed guide. The admin blog screen explains this. No database migration is required to deliver these rewrites.

The shared article layout supports Markdown, tables, task lists, heading navigation, mobile contents, reading progress, contextual valuation links, and related guides. Keep headings descriptive, use one page title, and link to relevant existing guides where they help the reader.

Use actual service terms for pickup availability, payment, pricing, and warranties. Do not invent statistics, testimonials, certifications, or guarantees. Device-reset advice links to Microsoft and Apple support instructions. Check those sources when revising the advice.

The updated `generate-blog` Edge Function prompt improves future drafts. Deploy that function through the normal Supabase workflow to activate its prompt changes; a frontend deployment alone does not update the Edge Function. Generated articles still require editorial review before publishing.
