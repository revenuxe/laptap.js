import type { Metadata } from "next";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { BlogListClient } from "./blog-list-client";

export const metadata: Metadata = {
  title: "Laptap Blog - Laptop Buying Guides, Selling Tips & Tech Insights",
  description:
    "Read expert guides on buying refurbished laptops, selling tips, tech comparisons, and market insights from Laptap's technology experts.",
  keywords: ["laptop blog", "refurbished laptop guide", "selling laptop tips", "tech insights", "laptop comparisons"],
  alternates: { canonical: "https://www.laptap.in/blog" },
  openGraph: {
    title: "Laptap Blog - Tech Guides & Insights",
    url: "https://www.laptap.in/blog",
  },
};

export default async function BlogPage() {
  const supabase = createServerSupabaseClient();

  const { data: blogPosts } = await supabase
    .from("blogs")
    .select("id, title, excerpt, created_at, category, slug")
    .eq("published", true)
    .order("created_at", { ascending: false });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://www.laptap.in" },
              { "@type": "ListItem", position: 2, name: "Blog", item: "https://www.laptap.in/blog" },
            ],
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            name: "Laptap Blog",
            description: "Expert guides on buying and selling laptops, tech insights, and market trends",
            url: "https://www.laptap.in/blog",
            publisher: {
              "@type": "Organization",
              name: "Laptap",
              logo: { "@type": "ImageObject", url: "https://www.laptap.in/logo.png" },
            },
          }),
        }}
      />
      <BlogListClient blogPosts={blogPosts} />
    </>
  );
}
