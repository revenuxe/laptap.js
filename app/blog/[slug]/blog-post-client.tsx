"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Calendar, User, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string | null;
  category: string;
  slug: string;
  created_at: string | null;
  updated_at: string | null;
  featured_image: string | null;
  keywords: string[] | null;
  meta_title: string;
  meta_description: string;
}

export function BlogPostClient({ post }: { post: BlogPost }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Back Button */}
        <section className="py-6 border-b">
          <div className="container max-w-4xl">
            <Link href="/blog">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Button>
            </Link>
          </div>
        </section>

        {/* Hero Section */}
        <article className="py-12">
          <div className="container max-w-4xl">
            <div className="mb-8">
              <span className="inline-block px-4 py-2 text-sm font-semibold bg-primary/10 text-primary rounded-full mb-4">
                {post.category}
              </span>

              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                {post.title}
              </h1>

              <div className="flex items-center gap-6 text-muted-foreground text-sm">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{post.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <time dateTime={post.created_at ?? undefined}>
                    {post.created_at
                      ? new Date(post.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : ""}
                  </time>
                </div>
              </div>
            </div>

            {/* Featured Image */}
            {post.featured_image && (
              <div className="mb-12 rounded-2xl overflow-hidden">
                <img
                  src={post.featured_image}
                  alt={post.title}
                  className="w-full h-auto"
                />
              </div>
            )}

            {/* Content */}
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <ReactMarkdown
                components={{
                  h2: ({ node, ...props }) => <h2 className="text-3xl font-bold mt-12 mb-6" {...props} />,
                  h3: ({ node, ...props }) => <h3 className="text-2xl font-bold mt-8 mb-4" {...props} />,
                  p: ({ node, ...props }) => <p className="mb-6 leading-relaxed text-lg" {...props} />,
                  ul: ({ node, ...props }) => <ul className="my-6 ml-6 list-disc space-y-3" {...props} />,
                  ol: ({ node, ...props }) => <ol className="my-6 ml-6 list-decimal space-y-3" {...props} />,
                  li: ({ node, ...props }) => <li className="leading-relaxed" {...props} />,
                  img: ({ node, ...props }) => (
                    <div className="my-12 rounded-2xl overflow-hidden">
                      <img className="w-full h-auto" {...props} />
                    </div>
                  ),
                  blockquote: ({ node, ...props }) => (
                    <blockquote className="border-l-4 border-primary pl-6 italic my-8 text-muted-foreground" {...props} />
                  ),
                }}
              >
                {post.content}
              </ReactMarkdown>
            </div>

            {/* Keywords */}
            {post.keywords && post.keywords.length > 0 && (
              <div className="mt-12 pt-8 border-t">
                <h3 className="text-sm font-semibold text-muted-foreground mb-4">Tags:</h3>
                <div className="flex flex-wrap gap-2">
                  {post.keywords.map((keyword, index) => (
                    <span key={index} className="px-3 py-1 text-sm bg-muted rounded-full">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* CTA Section */}
            <div className="mt-16 p-8 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl text-center">
              <h3 className="text-2xl font-bold mb-4">Ready to Sell Your Laptop?</h3>
              <p className="text-muted-foreground mb-6">
                Get instant quotes and the best prices for your used laptops
              </p>
              <Link href="/sell">
                <Button size="lg">Get Started Now</Button>
              </Link>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}