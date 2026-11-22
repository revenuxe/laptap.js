import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getBlogPost, relatedBlogPosts } from '@/lib/blog-server';
import { BlogArticleSchema } from '@/components/blog/BlogArticleSchema';
import { BlogPostClient } from './blog-post-client';

export const dynamic = 'force-dynamic';

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getBlogPost((await params).slug);
  if (!post) return { title: 'Blog Post Not Found', robots: { index: false } };
  const title = post.meta_title || post.title;
  const description = post.meta_description || post.excerpt;
  const url = `https://www.laptap.in/blog/${post.slug}`;
  return {
    title: { absolute: title.endsWith('Laptap') ? title : `${title} | Laptap` }, description, keywords: post.keywords || [], alternates: { canonical: url },
    openGraph: { type: 'article', title, description, url, publishedTime: post.created_at || undefined, modifiedTime: post.updated_at || undefined, images: post.featured_image ? [{ url: post.featured_image }] : [] },
    twitter: { card: post.featured_image ? 'summary_large_image' : 'summary', title, description },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const post = await getBlogPost((await params).slug);
  if (!post) notFound();
  const relatedPosts = await relatedBlogPosts(post.slug, post.category);
  return <><BlogArticleSchema post={post} /><BlogPostClient post={post} relatedPosts={relatedPosts} /></>;
}
