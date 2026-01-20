import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Laptop, CheckCircle, TrendingUp, Shield, Zap } from "lucide-react";
import HeroForm from "@/components/HeroForm";
import FAQ from "@/components/FAQ";

const AcerLaptop = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Sell Acer Laptop Online - Get Instant Cash for Acer Predator, Aspire, Swift, Nitro | Best Price | Laptap</title>
        <meta name="description" content="Sell your used Acer laptop for instant cash. Get the best resale value for Acer Predator Gaming, Aspire, Swift, Nitro, Spin laptops. Free doorstep pickup across India. Instant payment via UPI. Trusted by 10,000+ sellers." />
        <meta name="keywords" content="sell Acer laptop, sell Acer Predator, sell Acer Aspire, sell Acer Swift, sell Acer Nitro, Acer laptop resale value, sell used Acer laptop, Acer laptop buyback India, best price Acer laptop, sell Acer Predator Helios, instant cash Acer laptop" />
        <link rel="canonical" href="https://www.laptap.in/models/acer-laptop" />
        <link rel="alternate" hrefLang="en-IN" href="https://www.laptap.in/models/acer-laptop" />
        <link rel="alternate" hrefLang="en" href="https://www.laptap.in/models/acer-laptop" />
        <link rel="alternate" hrefLang="x-default" href="https://www.laptap.in/models/acer-laptop" />
        <meta property="og:title" content="Sell Acer Laptop Online | Best Price Guaranteed | Laptap" />
        <meta property="og:description" content="Get instant cash for your Acer laptop. Best resale value for Predator, Aspire, Swift, Nitro models. Free doorstep pickup across India." />
        <meta property="og:url" content="https://www.laptap.in/models/acer-laptop" />
        <meta property="og:type" content="product" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.laptap.in" },
              { "@type": "ListItem", "position": 2, "name": "Models", "item": "https://www.laptap.in/sell/laptop" },
              { "@type": "ListItem", "position": 3, "name": "Acer Laptop", "item": "https://www.laptap.in/models/acer-laptop" }
            ]
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": "Sell Acer Laptop",
            "description": "Sell your used Acer laptop for instant cash with best market prices and free doorstep pickup across India",
            "brand": { "@type": "Brand", "name": "Acer" },
            "category": "Laptop",
            "offers": {
              "@type": "AggregateOffer",
              "priceCurrency": "INR",
              "lowPrice": "5000",
              "highPrice": "150000",
              "offerCount": "380",
              "availability": "https://schema.org/InStock"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.7",
              "bestRating": "5",
              "worstRating": "1",
              "reviewCount": "2200"
            },
            "review": [
              {
                "@type": "Review",
                "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
                "author": { "@type": "Person", "name": "Amit Patel" },
                "reviewBody": "Got ₹78,000 for my Acer Predator Helios 300. Much better than local dealers!"
              },
              {
                "@type": "Review",
                "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
                "author": { "@type": "Person", "name": "Sneha Reddy" },
                "reviewBody": "Sold my Acer Swift 3 in just 2 hours. Quick pickup and instant payment!"
              },
              {
                "@type": "Review",
                "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
                "author": { "@type": "Person", "name": "Rajesh Kumar" },
                "reviewBody": "Very professional service. Fair price for my Acer Nitro 5 gaming laptop."
              }
            ]
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "How much can I get for my Acer laptop?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Acer laptop resale prices: Predator Helios (₹35,000-₹1,50,000), Nitro 5/7 (₹20,000-₹70,000), Swift (₹15,000-₹60,000), Aspire (₹5,000-₹35,000). Price depends on model, specs, and condition."
                }
              },
              {
                "@type": "Question",
                "name": "Do you buy damaged Acer laptops?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes! We buy Acer laptops in any condition - cracked screen, battery issues, keyboard problems, or non-functional. Price is adjusted based on condition assessment."
                }
              }
            ]
          })}
        </script>
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          {/* Hero Section */}
          <section className="relative overflow-hidden bg-gradient-to-b from-background via-muted/20 to-background py-20 md:py-32">
            <div className="container">
              <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
                <div>
                  <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                    <Laptop className="h-4 w-4" />
                    Acer Laptops
                  </div>

                  <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                    Sell Your Acer Laptop for{" "}
                    <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                      Instant Cash
                    </span>
                  </h1>

                  <p className="mb-8 text-lg text-muted-foreground">
                    Get the best resale value for your Acer Predator, Aspire, Swift, Nitro laptops. 
                    Free doorstep pickup with instant payment across India.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button variant="cta" size="lg" onClick={() => navigate("/sell/laptop")}>
                      Get Instant Quote
                    </Button>
                    <Button variant="outline" size="lg" onClick={() => navigate("/contact")}>
                      Contact Us
                    </Button>
                  </div>
                </div>

                <HeroForm defaultSellingType="laptop" />
              </div>
            </div>
          </section>

          {/* Models We Accept */}
          <section className="py-16 md:py-24 bg-muted/30">
            <div className="container">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                Acer Laptop Models We Buy
              </h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {[
                  { name: "Acer Predator Helios 16/18", series: "Premium Gaming" },
                  { name: "Acer Predator Triton 300/500", series: "Slim Gaming" },
                  { name: "Acer Nitro 5/7/16", series: "Gaming Series" },
                  { name: "Acer Swift 3/5/7", series: "Ultrabook" },
                  { name: "Acer Swift X", series: "Creator Laptop" },
                  { name: "Acer Spin 3/5", series: "2-in-1 Convertible" },
                  { name: "Acer Aspire 3/5/7", series: "Everyday Laptop" },
                  { name: "Acer Aspire Vero", series: "Eco-Friendly" },
                  { name: "Acer TravelMate", series: "Business Laptop" },
                  { name: "Acer ConceptD", series: "Creator Pro" },
                  { name: "Acer Chromebook", series: "Chrome OS" },
                  { name: "Acer Enduro", series: "Rugged Laptop" },
                ].map((model, index) => (
                  <div key={index} className="p-6 rounded-2xl border-2 border-border bg-card hover:border-primary transition-all">
                    <h3 className="font-bold text-lg mb-2">{model.name}</h3>
                    <p className="text-sm text-muted-foreground">{model.series}</p>
                  </div>
                ))}
              </div>

              <div className="mt-12 text-center">
                <p className="text-muted-foreground mb-6">
                  All Acer laptop models accepted - Predator, Nitro, Swift, Aspire - in any condition
                </p>
                <Button variant="cta" size="lg" onClick={() => navigate("/sell")}>
                  Get Instant Quote Now
                </Button>
              </div>
            </div>
          </section>

          {/* SEO Content Section */}
          <section className="py-16 md:py-24 bg-muted/30">
            <div className="container max-w-4xl">
              <h2 className="text-3xl md:text-4xl font-bold mb-8">
                Why Sell Your Acer Laptop Online with Laptap?
              </h2>
              
              <div className="prose prose-lg max-w-none text-muted-foreground space-y-6">
                <p>
                  Looking to sell your used Acer laptop? Laptap offers India's most trusted platform for selling Acer laptops online with instant cash payment. Whether you own an Acer Predator gaming powerhouse, a sleek Swift ultrabook, or a budget-friendly Aspire, we guarantee the best resale value.
                </p>

                <h3 className="text-2xl font-bold text-foreground mt-8">Best Price for Acer Laptops in India</h3>
                <p>
                  Acer laptops, particularly the Predator gaming series and Swift ultrabooks, hold strong resale value. Our pricing algorithm considers your laptop's processor (Intel Core, AMD Ryzen), GPU (NVIDIA GeForce RTX), RAM, storage, display quality, and physical condition to offer you the highest possible price.
                </p>

                <h3 className="text-2xl font-bold text-foreground mt-8">Sell Acer Predator Gaming Laptop</h3>
                <p>
                  Acer Predator gaming laptops are highly sought after in the resale market. Whether you have a Predator Helios 300 with RTX 4060, a Predator Triton 500 SE, or a Nitro 5 gaming laptop, we offer competitive prices that beat local dealers. Upgrade to the latest gaming hardware by selling your current Acer gaming laptop with us.
                </p>

                <h3 className="text-2xl font-bold text-foreground mt-8">Free Doorstep Pickup Across India</h3>
                <p>
                  No need to visit local shops or deal with unreliable buyers. Our verified technicians provide free same-day doorstep pickup service across Bangalore, Mumbai, Delhi, Hyderabad, Chennai, Pune, and all major cities.
                </p>

                <h3 className="text-2xl font-bold text-foreground mt-8">Instant Payment & Secure Transaction</h3>
                <p>
                  Get paid instantly after device verification via UPI, IMPS bank transfer, or cash. Your data is completely wiped using industry-standard security protocols. Every transaction is transparent and backed by thousands of satisfied customer reviews.
                </p>
              </div>
            </div>
          </section>

          <FAQ />
        </main>
        <Footer />
        <WhatsAppFloat />
      </div>
    </>
  );
};

export default AcerLaptop;
