import type { Metadata } from 'next';
import { getEditorialPost } from '@/lib/blog-content';
import { relatedBlogPosts } from '@/lib/blog-server';
import { BlogArticleSchema } from '@/components/blog/BlogArticleSchema';
import { BlogPostClient } from '../[slug]/blog-post-client';

const post = getEditorialPost('sell-used-laptop-bangalore')!;
export const metadata: Metadata = {
  title: { absolute: post.meta_title }, description: post.meta_description, keywords: post.keywords || [],
  alternates: { canonical: 'https://www.laptap.in/blog/sell-used-laptop-bangalore' },
  openGraph: { type: 'article', title: post.title, description: post.excerpt, url: 'https://www.laptap.in/blog/sell-used-laptop-bangalore', publishedTime: post.created_at || undefined, modifiedTime: post.updated_at || undefined },
};

export default async function Page() {
  const relatedPosts = await relatedBlogPosts(post.slug, post.category);
  return <><BlogArticleSchema post={post} /><BlogPostClient post={post} relatedPosts={relatedPosts} /></>;
}
