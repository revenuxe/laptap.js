import type { Metadata } from 'next';
import { landingContent } from '@/components/landing/content';

export function landingMetadata(key: string, path: string): Metadata {
  const content = landingContent[key];
  const title = `Sell ${content.name} in Bangalore`;
  const description = `Sell your ${content.name} in Bangalore. Explore model families, configuration and condition checks, device preparation, and pickup options by pincode.`;
  const url = `https://www.laptap.in${path}`;
  return {
    title, description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: 'website', images: [{ url: '/opengraph-image' }] },
    twitter: { card: 'summary_large_image', title, description, images: ['/opengraph-image'] },
  };
}
