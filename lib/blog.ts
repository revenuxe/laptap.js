export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string | null;
  created_at: string | null;
  updated_at: string | null;
  featured_image: string | null;
  keywords: string[] | null;
  meta_title: string;
  meta_description: string;
}

export type BlogSummary = Pick<BlogPost, 'id' | 'slug' | 'title' | 'excerpt' | 'category' | 'created_at' | 'featured_image'> & { readingMinutes?: number };

export function readingMinutes(content: string) {
  return Math.max(1, Math.ceil(content.trim().split(/\s+/).length / 220));
}

export function headingId(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-') || 'section';
}

export function articleSections(content: string) {
  const counts = new Map<string, number>();
  // Ignore heading-like text inside fenced code blocks.
  let inFence = false;
  return content.split('\n').flatMap(line => {
    if (/^\s*(```|~~~)/.test(line)) { inFence = !inFence; return []; }
    const match = !inFence && line.match(/^##\s+(.+?)\s*#*$/);
    if (!match) return [];
    const title = match[1].replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').replace(/[*_`]/g, '');
    const base = headingId(title);
    const count = counts.get(base) || 0;
    counts.set(base, count + 1);
    return [{ title, id: count ? `${base}-${count + 1}` : base }];
  });
}

export function jsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

export function formatBlogDate(date: string | null) {
  if (!date || Number.isNaN(new Date(date).getTime())) return null;
  return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata' }).format(new Date(date));
}
