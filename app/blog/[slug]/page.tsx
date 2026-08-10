import type { Metadata } from "next";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { BlogPostClient } from "./blog-post-client";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createServerSupabaseClient();
  const { data: post } = await supabase
    .from("blogs")
    .select("meta_title, meta_description, keywords, slug, featured_image")
    .eq("slug", params.slug)
    .eq("published", true)
    .single();

  if (!post) {
    return { title: "Blog Post Not Found" };
  }

  return {
    title: post.meta_title,
    description: post.meta_description,
    keywords: post.keywords ?? [],
    alternates: { canonical: `https://www.laptap.in/blog/${post.slug}` },
    openGraph: {
      title: post.meta_title,
      description: post.meta_description,
      url: `https://www.laptap.in/blog/${post.slug}`,
      images: post.featured_image ? [{ url: post.featured_image }] : [],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const supabase = createServerSupabaseClient();
  const { data: post } = await supabase
    .from("blogs")
    .select("*")
    .eq("slug", params.slug)
    .eq("published", true)
    .single();

  if (!post) {
    notFound();
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.excerpt,
            datePublished: post.created_at,
            dateModified: post.updated_at,
            author: { "@type": "Person", name: post.author },
            keywords: post.keywords?.join(", "),
          }),
        }}
      />
      <BlogPostClient post={post} />
    </>
  );
}