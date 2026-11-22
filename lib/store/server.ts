import 'server-only';
import { supabaseUrl, supabasePublishableKey } from '@/lib/supabase/config';
import { cache } from 'react';
import type { Listing } from './domain';
export const getStoreProduct = cache(async (path: string): Promise<Listing | null> => {
 const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(path);
 const url = new URL(`${supabaseUrl}/rest/v1/marketplace_listings`);
 url.searchParams.set(uuid ? 'id' : 'seo_path', `eq.${path}`);
 url.searchParams.set('select', '*'); url.searchParams.set('limit', '1');
 const key = supabasePublishableKey;
 const response = await fetch(url, { headers: { apikey: key }, cache: 'no-store', signal: AbortSignal.timeout(8000) });
 if (!response.ok) throw new Error('Store product lookup failed');
 const products: Listing[] = await response.json(); return products[0] || null;
});
export async function getStoreSitemapProducts(): Promise<Pick<Listing, 'seo_path' | 'created_at'>[]> {
 const key = supabasePublishableKey;
 const products: Pick<Listing, 'seo_path' | 'created_at'>[] = [];
 for (let offset = 0; ; offset += 1000) {
  const url = new URL(`${supabaseUrl}/rest/v1/marketplace_listings`);
  url.searchParams.set('select', 'seo_path,created_at');url.searchParams.set('status', 'eq.published');url.searchParams.set('is_demo', 'eq.false');url.searchParams.set('order','id');url.searchParams.set('limit','1000');url.searchParams.set('offset',String(offset));
  const response = await fetch(url, { headers: { apikey: key }, cache: 'no-store', signal: AbortSignal.timeout(8000) });
  if (!response.ok) throw new Error('Store sitemap lookup failed');
  const rows = await response.json();products.push(...rows);if(rows.length < 1000) return products;
 }
}
