"use client";
import MobileBottomNav from "@/components/MobileBottomNav";

import { useMemo, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { ArrowRight, BookOpen, Search, X, Clock, Laptop, ShieldCheck, Scale } from 'lucide-react';
import { BlogSummary } from '@/lib/blog';
import { BlogCTA } from '@/components/blog/BlogCTA';

const categoryIcons: Record<string, typeof Laptop> = { 'Selling Tips': Laptop, 'Buying Guide': ShieldCheck, Comparison: Scale };

function Cover({ post, featured = false }: { post: BlogSummary; featured?: boolean }) {
  const Icon = categoryIcons[post.category] || BookOpen;
  return <div className={`relative flex items-center justify-center overflow-hidden bg-primary/5 ${featured ? 'min-h-[240px] h-full' : 'h-44'} ${post.category === 'Comparison' ? 'bg-secondary/20' : ''}`}>
    {post.featured_image ? <img src={post.featured_image} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" /> : <>
      <div className="absolute h-64 w-64 rounded-full border border-primary/10" /><div className="absolute h-44 w-44 rounded-full border border-primary/10" />
      <div className="relative rounded-3xl border border-white/80 bg-white/90 p-7 text-primary shadow-sm"><Icon className={featured ? 'h-20 w-20' : 'h-12 w-12'} strokeWidth={1.2} /></div>
      <span className="absolute bottom-4 left-5 text-xs font-semibold uppercase tracking-[0.2em] text-primary/70">Laptap / Field notes</span>
    </>}
  </div>;
}

export function BlogListClient({ blogPosts }: { blogPosts: BlogSummary[] }) {
  const [category, setCategory] = useState('All guides');
  const [search, setSearch] = useState('');
  const categories = ['All guides', ...Array.from(new Set(blogPosts.map(post => post.category)))];
  const filtered = useMemo(() => blogPosts.filter(post => (category === 'All guides' || category === post.category) && `${post.title} ${post.excerpt} ${post.category}`.toLowerCase().includes(search.trim().toLowerCase())), [blogPosts, category, search]);
  const featured = blogPosts[0];
  const filtering = category !== 'All guides' || search.trim().length > 0;

  return <div className="reference-home flex min-h-screen flex-col"><Header /><main id="main-content" className="flex-1">
    <section className="border-b bg-gradient-to-br from-primary/5 via-background to-secondary/10">
      <div className="container py-12 md:py-20"><div className="grid items-end gap-8 lg:grid-cols-[1fr_320px]">
        <div><span className="mb-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-primary"><span className="h-2 w-2 rounded-full bg-secondary" /> The Laptap journal</span><h1 className="max-w-3xl text-4xl font-bold leading-[1.12] tracking-tight sm:text-5xl lg:text-6xl">Make your next<br className="hidden sm:block" /> laptop decision a good one.</h1><p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">Practical guides to selling, buying, and upgrading. Know what to check, what to ask, and what to do next.</p></div>
        <div className="rounded-2xl border bg-background/80 p-6"><BookOpen className="mb-3 h-6 w-6 text-primary" /><p className="font-semibold">Less guesswork. More useful answers.</p><p className="mt-2 text-sm leading-relaxed text-muted-foreground">Checklists, clear comparisons, and step-by-step advice you can use.</p><a href="#guides" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">Explore the guides <ArrowRight className="h-4 w-4" /></a></div>
      </div></div>
    </section>
    <section className="container py-10 md:py-14" aria-label="Featured guide">
      {featured && <Link href={`/blog/${featured.slug}`} className="group grid overflow-hidden rounded-3xl border bg-card transition-shadow hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary md:grid-cols-[0.85fr_1.15fr]">
        <Cover post={featured} featured /><div className="p-7 md:p-10"><div className="mb-4 flex flex-wrap items-center gap-3"><span className="rounded-full bg-secondary/30 px-3 py-1 text-xs font-bold text-foreground">Editor's pick</span><span className="text-sm text-muted-foreground">{featured.category}</span></div><h2 className="text-2xl font-bold leading-tight tracking-tight group-hover:text-primary md:text-3xl">{featured.title}</h2><p className="mt-4 leading-relaxed text-muted-foreground">{featured.excerpt}</p><div className="mt-7 flex items-center justify-between gap-3"><span className="inline-flex items-center gap-2 text-sm text-muted-foreground"><Clock className="h-4 w-4" />{featured.readingMinutes ? `${featured.readingMinutes} min read` : 'Practical guide'}</span><span className="inline-flex items-center gap-2 font-semibold text-primary">Read the guide <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span></div></div>
      </Link>}
    </section>
    <section id="guides" className="container scroll-mt-28 pb-16 md:pb-20">
      <div className="mb-7 flex flex-col justify-between gap-5 lg:flex-row lg:items-end"><div><p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-primary">Find your next step</p><h2 className="text-3xl font-bold tracking-tight">The guide library</h2></div><div className="relative w-full lg:w-80"><label htmlFor="guide-search" className="sr-only">Search guides</label><Search className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" /><input id="guide-search" type="search" value={search} onChange={event => setSearch(event.target.value)} placeholder="Search topics or questions" className="h-12 w-full rounded-xl border bg-background pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary" /></div></div>
      <div role="group" aria-label="Filter guides by topic" className="mb-7 flex flex-wrap gap-2">{categories.map(item => <button key={item} onClick={() => setCategory(item)} aria-pressed={category === item} className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-primary ${category === item ? 'border-primary bg-primary text-primary-foreground' : 'bg-background hover:border-primary hover:text-primary'}`}>{item}</button>)}</div>
      <p aria-live="polite" className="mb-5 text-sm text-muted-foreground">{filtered.length} {filtered.length === 1 ? 'guide' : 'guides'}{filtering ? ' found' : ' to help you decide'}</p>
      {filtered.length ? <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{filtered.map(post => <Link key={post.slug} href={`/blog/${post.slug}`} className="group flex flex-col overflow-hidden rounded-2xl border bg-card transition-all hover:-translate-y-1 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary motion-reduce:transform-none"><Cover post={post} /><div className="flex flex-1 flex-col p-6"><span className="mb-3 text-xs font-bold uppercase tracking-wider text-primary">{post.category}</span><h3 className="text-xl font-bold leading-snug tracking-tight group-hover:text-primary">{post.title}</h3><p className="mb-6 mt-3 text-sm leading-relaxed text-muted-foreground">{post.excerpt}</p><div className="mt-auto flex items-center justify-between border-t pt-4 text-sm"><span className="text-muted-foreground">{post.readingMinutes ? `${post.readingMinutes} min read` : 'Read the guide'}</span><ArrowRight className="h-5 w-5 text-primary transition-transform group-hover:translate-x-1" /></div></div></Link>)}</div> : <div className="rounded-2xl border border-dashed p-10 text-center"><Search className="mx-auto mb-4 h-8 w-8 text-muted-foreground" /><h3 className="text-xl font-semibold">No matching guides yet</h3><p className="mt-2 text-muted-foreground">Try a shorter search or browse all topics.</p><button onClick={() => { setSearch(''); setCategory('All guides'); }} className="mt-5 inline-flex items-center gap-2 font-semibold text-primary hover:underline"><X className="h-4 w-4" />Clear filters</button></div>}
      <div className="mt-12"><BlogCTA /></div>
    </section>
  </main><Footer />
      <MobileBottomNav /></div>;
}
