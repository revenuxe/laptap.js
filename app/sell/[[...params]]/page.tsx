import type { Metadata } from "next";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { SellClient } from "./sell-client";

interface Props {
  params: { params?: string[] };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const urlSegments = params?.params || [];
  const category = urlSegments[0] || "laptop";
  const brandSlug = urlSegments[1];
  const seriesSlug = urlSegments[2];
  const modelSlug = urlSegments[3];

  const categoryName = category === "desktop" ? "Desktop" : "Laptop";
  let title = `Sell Used ${categoryName} Online | Instant Quote & Cash Payment - Laptap`;
  let description = `Get the best price for your used ${categoryName.toLowerCase()} on Laptap. Free doorstep pickup, instant evaluation, and immediate payment in Bangalore.`;
  let canonicalUrl = `https://www.laptap.in/sell/${category}`;

  if (brandSlug) {
    const supabase = createServerSupabaseClient();
    const { data: brand } = await supabase
      .from("brands")
      .select("name, slug")
      .eq("slug", brandSlug)
      .maybeSingle();

    const brandName = brand?.name || brandSlug.toUpperCase();
    title = `Sell Used ${brandName} ${categoryName}s | Best Buyback Price - Laptap`;
    description = `Sell your old ${brandName} ${categoryName.toLowerCase()} for instant cash. Free doorstep pickup and instant payment guaranteed on Laptap.`;
    canonicalUrl = `https://www.laptap.in/sell/${category}/${brandSlug}`;

    if (seriesSlug) {
      const { data: series } = await supabase
        .from("series")
        .select("name, slug")
        .eq("slug", seriesSlug)
        .maybeSingle();

      const seriesName = series?.name || seriesSlug;
      title = `Sell Used ${brandName} ${seriesName} ${categoryName} | Instant Quote - Laptap`;
      description = `Get instant price valuation for your used ${brandName} ${seriesName} ${categoryName.toLowerCase()}. Safe data wipe, free pickup & quick payment.`;
      canonicalUrl = `https://www.laptap.in/sell/${category}/${brandSlug}/${seriesSlug}`;

      if (modelSlug) {
        const { data: model } = await supabase
          .from("models")
          .select("name, slug")
          .eq("slug", modelSlug)
          .maybeSingle();

        const modelName = model?.name || modelSlug;
        title = `Sell ${modelName} ${categoryName} | Best Resale Value - Laptap`;
        description = `Sell your ${modelName} ${categoryName.toLowerCase()} at the top market price. Free doorstep pickup and instant payment across Bangalore & India.`;
        canonicalUrl = `https://www.laptap.in/sell/${category}/${brandSlug}/${seriesSlug}/${modelSlug}`;
      }
    }
  }

  return {
    title,
    description,
    keywords: [
      `sell ${categoryName.toLowerCase()}`,
      `sell used ${categoryName.toLowerCase()}`,
      "laptop buyback",
      "instant quote laptop",
      "free doorstep pickup",
      "sell old electronics",
    ],
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "website",
      siteName: "Laptap",
      locale: "en_IN",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default function SellPage() {
  return <SellClient />;
}