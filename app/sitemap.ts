import { getStoreSitemapProducts } from '@/lib/store/server';
import { withTimeout } from "@/lib/request-timeout";
import { areas, areaUrl } from "@/lib/areas";
import type { MetadataRoute } from "next";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { editorialPosts, getEditorialPost } from "@/lib/blog-content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createServerSupabaseClient();

  // Fetch all published blog slugs from Supabase
  const { data: blogs } = await withTimeout(supabase
    .from("blogs")
    .select("slug, updated_at")
    .eq("published", true), 3000).catch(() => ({ data: null }));

  const allBlogs = [...editorialPosts, ...(blogs ?? []).filter(blog => !getEditorialPost(blog.slug) && blog.slug !== 'sell-used-laptop-bangalore-guide')];
  const blogEntries: MetadataRoute.Sitemap = allBlogs.map((blog) => ({
    url: `https://www.laptap.in/blog/${blog.slug}`,
    lastModified: blog.updated_at ? new Date(blog.updated_at) : undefined,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const staticPages: MetadataRoute.Sitemap = [
    { url: "https://www.laptap.in/", changeFrequency: "daily", priority: 1.0 },
    { url: "https://www.laptap.in/sell", changeFrequency: "daily", priority: 0.95 },
    { url: "https://www.laptap.in/sell/laptop", changeFrequency: "daily", priority: 0.9 },
    { url: "https://www.laptap.in/sell/desktop", changeFrequency: "daily", priority: 0.9 },
    { url: "https://www.laptap.in/about", changeFrequency: "monthly", priority: 0.8 },
    { url: "https://www.laptap.in/contact", changeFrequency: "monthly", priority: 0.8 },
    { url: "https://www.laptap.in/terms", changeFrequency: "yearly", priority: 0.5 },
    { url: "https://www.laptap.in/privacy", changeFrequency: "yearly", priority: 0.5 },
    { url: "https://www.laptap.in/blog", changeFrequency: "weekly", priority: 0.7 },
    // Location Pages - Bangalore
    { url: "https://www.laptap.in/bangalore", changeFrequency: "weekly", priority: 0.9 },
    { url: "https://www.laptap.in/bangalore/macbook", changeFrequency: "weekly", priority: 0.85 },
    { url: "https://www.laptap.in/bangalore/dell", changeFrequency: "weekly", priority: 0.85 },
    { url: "https://www.laptap.in/bangalore/hp", changeFrequency: "weekly", priority: 0.85 },
    { url: "https://www.laptap.in/bangalore/lenovo", changeFrequency: "weekly", priority: 0.85 },
    // Gaming
    { url: "https://www.laptap.in/gaming/asus-rog", changeFrequency: "weekly", priority: 0.85 },
    { url: "https://www.laptap.in/gaming/acer-predator", changeFrequency: "weekly", priority: 0.85 },
    // Models
    { url: "https://www.laptap.in/models/macbook-pro", changeFrequency: "monthly", priority: 0.8 },
    { url: "https://www.laptap.in/models/macbook-air", changeFrequency: "monthly", priority: 0.8 },
    { url: "https://www.laptap.in/models/dell-xps", changeFrequency: "monthly", priority: 0.8 },
    { url: "https://www.laptap.in/models/hp-pavilion", changeFrequency: "monthly", priority: 0.8 },
    { url: "https://www.laptap.in/models/lenovo-thinkpad", changeFrequency: "monthly", priority: 0.8 },
    { url: "https://www.laptap.in/models/asus-laptop", changeFrequency: "monthly", priority: 0.8 },
    { url: "https://www.laptap.in/models/acer-laptop", changeFrequency: "monthly", priority: 0.8 },
    { url: "https://www.laptap.in/models/samsung-laptop", changeFrequency: "monthly", priority: 0.8 },
    { url: "https://www.laptap.in/models/microsoft-surface", changeFrequency: "monthly", priority: 0.8 },
    { url: "https://www.laptap.in/models/imac", changeFrequency: "monthly", priority: 0.7 },
    { url: "https://www.laptap.in/models/dell-optiplex", changeFrequency: "monthly", priority: 0.7 },
    { url: "https://www.laptap.in/models/hp-desktop", changeFrequency: "monthly", priority: 0.7 },
    { url: "https://www.laptap.in/models/lenovo-desktop", changeFrequency: "monthly", priority: 0.7 },
    // Repair
    { url: "https://www.laptap.in/repair", changeFrequency: "weekly", priority: 0.8 },
  ];

  const areaEntries: MetadataRoute.Sitemap = areas.map(area => ({ url: `https://www.laptap.in${areaUrl(area.slug)}`, changeFrequency: "monthly", priority: 0.75 }));
  const storeProducts = await getStoreSitemapProducts().catch(() => []);
  const storeEntries: MetadataRoute.Sitemap = storeProducts.filter(p => p.seo_path).map(p => ({ url: `https://www.laptap.in/store/laptop/${p.seo_path}`, lastModified: new Date(p.created_at), changeFrequency: "daily", priority: 0.8 }));
  return [...staticPages, { url: "https://www.laptap.in/store", changeFrequency: "daily", priority: 0.9 }, { url: "https://www.laptap.in/store/laptop", changeFrequency: "daily", priority: 0.9 }, ...storeEntries, { url: "https://www.laptap.in/bangalore/areas", changeFrequency: "monthly", priority: 0.85 }, ...areaEntries, ...blogEntries];
}
