import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { Calendar, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";

const Blog = () => {
  const blogPosts = [
    {
      id: 1,
      title: "Top 10 Things to Check Before Buying a Refurbished Laptop",
      excerpt: "Learn the essential factors to consider when purchasing a refurbished laptop to ensure you get the best value for your money.",
      date: "2025-10-01",
      category: "Buying Guide",
      slug: "buying-refurbished-laptop-guide",
    },
    {
      id: 2,
      title: "How to Prepare Your Laptop for Sale: A Complete Guide",
      excerpt: "Step-by-step instructions on backing up data, wiping your device, and getting the best price when selling your laptop.",
      date: "2025-09-28",
      category: "Selling Tips",
      slug: "prepare-laptop-for-sale",
    },
    {
      id: 3,
      title: "Refurbished vs New Laptops: Which Should You Choose?",
      excerpt: "Compare the pros and cons of refurbished and new laptops to make an informed decision for your needs and budget.",
      date: "2025-09-25",
      category: "Comparison",
      slug: "refurbished-vs-new-laptops",
    },
  ];

  return (
    <>
      <Helmet>
        <title>Laptap Blog - Laptop Buying Guides, Selling Tips & Tech Insights</title>
        <meta name="description" content="Read expert guides on buying refurbished laptops, selling tips, tech comparisons, and market insights from Laptap's technology experts." />
        <meta name="keywords" content="laptop blog, refurbished laptop guide, selling laptop tips, tech insights, laptop comparisons" />
        <link rel="canonical" href="https://laptap.in/blog" />
        <meta property="og:title" content="Laptap Blog - Tech Guides & Insights" />
        <meta property="og:url" content="https://laptap.in/blog" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            "name": "Laptap Blog",
            "description": "Expert guides on buying and selling laptops, tech insights, and market trends",
            "url": "https://laptap.in/blog",
            "publisher": {
              "@type": "Organization",
              "name": "Laptap",
              "logo": {
                "@type": "ImageObject",
                "url": "https://laptap.in/logo.png"
              }
            }
          })}
        </script>
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          {/* Hero Section */}
          <section className="py-16 md:py-24 bg-gradient-to-br from-primary/5 to-secondary/5">
            <div className="container">
              <div className="max-w-3xl mx-auto text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-6">Laptap Blog</h1>
                <p className="text-lg text-muted-foreground">
                  Expert insights, guides, and tips for buying and selling laptops
                </p>
              </div>
            </div>
          </section>

          {/* Blog Posts Section */}
          <section className="py-16 md:py-24">
            <div className="container">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogPosts.map((post) => (
                  <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="p-6">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                        <Calendar className="h-4 w-4" />
                        <time dateTime={post.date}>
                          {new Date(post.date).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </time>
                      </div>
                      <span className="inline-block px-3 py-1 text-xs font-semibold bg-primary/10 text-primary rounded-full mb-3">
                        {post.category}
                      </span>
                      <h2 className="text-xl font-bold mb-3 line-clamp-2">{post.title}</h2>
                      <p className="text-muted-foreground mb-4 line-clamp-3">{post.excerpt}</p>
                      <Link 
                        to={`/blog/${post.slug}`}
                        className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
                      >
                        Read More <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Coming Soon Message */}
              <div className="mt-12 text-center">
                <p className="text-muted-foreground">
                  More articles coming soon! Stay tuned for expert insights and guides.
                </p>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Blog;
