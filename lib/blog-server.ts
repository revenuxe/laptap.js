import { withTimeout } from "./request-timeout";
import { cache } from 'react';
import { createServerSupabaseClient } from './supabase/server';
import { getEditorialPost, mergeBlogSummaries } from './blog-content';

export const getBlogPost = cache(async (slug: string) => {
  const editorial = getEditorialPost(slug);
  if (editorial) return editorial;
  const { data } = await createServerSupabaseClient().from('blogs').select('*').eq('slug', slug).eq('published', true).maybeSingle();
  return data;
});

export const getBlogSummaries = cache(async () => {
  const { data } = await withTimeout(createServerSupabaseClient().from('blogs').select('id, title, excerpt, created_at, category, slug, featured_image').eq('published', true).order('created_at', { ascending: false }), 3000).catch(() => ({ data: null }));
  return mergeBlogSummaries(data);
});

export async function relatedBlogPosts(slug: string, category: string) {
  const posts = await getBlogSummaries();
  return posts.filter(post => post.slug !== slug).sort((a, b) => Number(b.category === category) - Number(a.category === category)).slice(0, 3);
}
