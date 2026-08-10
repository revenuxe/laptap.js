import type { MetadataRoute } from "next";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createServerSupabaseClient();

  // Fetch all published blog slugs from Supabase
  const { data: blogs } = await supabase
    .from("blogs")
    .select("slug, updated_at")
    .eq("published", true);

  const blogEntries: MetadataRoute.Sitemap = (blogs ?? []).map((blog) => ({
    url: `https://www.laptap.in/blog/${blog.slug}`,
    lastModified: blog.updated_at ? new Date(blog.updated_at) : new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const staticPages: MetadataRoute.Sitemap = [
    { url: "https://www.laptap.in/", lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: "https://www.laptap.in/sell", lastModified: new Date(), changeFrequency: "daily", priority: 0.95 },
    { url: "https://www.laptap.in/sell/laptop", lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: "https://www.laptap.in/sell/desktop", lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: "https://www.laptap.in/sell/mobile", lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: "https://www.laptap.in/about", lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: "https://www.laptap.in/contact", lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: "https://www.laptap.in/terms", lastModified: new Date(), changeFrequency: "yearly", priority: 0.5 },
    { url: "https://www.laptap.in/privacy", lastModified: new Date(), changeFrequency: "yearly", priority: 0.5 },
    { url: "https://www.laptap.in/blog", lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: "https://www.laptap.in/blog/sell-used-laptop-bangalore", lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    // Location Pages - Bangalore
    { url: "https://www.laptap.in/bangalore", lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: "https://www.laptap.in/bangalore/macbook", lastModified: new Date(), changeFrequency: "weekly", priority: 0.85 },
    { url: "https://www.laptap.in/bangalore/dell", lastModified: new Date(), changeFrequency: "weekly", priority: 0.85 },
    { url: "https://www.laptap.in/bangalore/hp", lastModified: new Date(), changeFrequency: "weekly", priority: 0.85 },
    { url: "https://www.laptap.in/bangalore/lenovo", lastModified: new Date(), changeFrequency: "weekly", priority: 0.85 },
    // Location Pages - Hyderabad
    { url: "https://www.laptap.in/hyderabad", lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: "https://www.laptap.in/hyderabad/macbook", lastModified: new Date(), changeFrequency: "weekly", priority: 0.85 },
    { url: "https://www.laptap.in/hyderabad/dell", lastModified: new Date(), changeFrequency: "weekly", priority: 0.85 },
    { url: "https://www.laptap.in/hyderabad/hp", lastModified: new Date(), changeFrequency: "weekly", priority: 0.85 },
    { url: "https://www.laptap.in/hyderabad/lenovo", lastModified: new Date(), changeFrequency: "weekly", priority: 0.85 },
    // Gaming
    { url: "https://www.laptap.in/gaming/asus-rog", lastModified: new Date(), changeFrequency: "weekly", priority: 0.85 },
    { url: "https://www.laptap.in/gaming/acer-predator", lastModified: new Date(), changeFrequency: "weekly", priority: 0.85 },
    // Models
    { url: "https://www.laptap.in/models/macbook-pro", lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: "https://www.laptap.in/models/macbook-air", lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: "https://www.laptap.in/models/dell-xps", lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: "https://www.laptap.in/models/hp-pavilion", lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: "https://www.laptap.in/models/lenovo-thinkpad", lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: "https://www.laptap.in/models/asus-laptop", lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: "https://www.laptap.in/models/acer-laptop", lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: "https://www.laptap.in/models/samsung-laptop", lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: "https://www.laptap.in/models/microsoft-surface", lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: "https://www.laptap.in/models/imac", lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: "https://www.laptap.in/models/dell-optiplex", lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: "https://www.laptap.in/models/hp-desktop", lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: "https://www.laptap.in/models/lenovo-desktop", lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    // Repair
    { url: "https://www.laptap.in/repair", lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
  ];

  return [...staticPages, ...blogEntries];
}
