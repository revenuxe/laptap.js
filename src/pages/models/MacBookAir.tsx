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

const MacBookAir = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Sell MacBook Air Online - Get Instant Cash for Your MacBook Air | Best Price Guaranteed | Laptap</title>
        <meta name="description" content="Sell your used MacBook Air for instant cash. Get the best resale value for MacBook Air M3, M2, M1, Intel models. Free doorstep pickup across India. Instant payment via UPI. Trusted by 10,000+ MacBook sellers. Sell MacBook Air 2024, 2023, 2022, 2020 models." />
        <meta name="keywords" content="sell MacBook Air, sell MacBook Air online, MacBook Air resale value, sell used MacBook Air, sell old MacBook Air, MacBook Air buyback, best price MacBook Air, sell MacBook Air 15 inch, sell MacBook Air 13 inch, sell MacBook Air M3, sell MacBook Air M2, sell MacBook Air M1, sell MacBook Air 2024, instant cash MacBook Air" />
        <link rel="canonical" href="https://www.laptap.in/models/macbook-air" />
        <link rel="alternate" hrefLang="en-IN" href="https://www.laptap.in/models/macbook-air" />
        <link rel="alternate" hrefLang="en" href="https://www.laptap.in/models/macbook-air" />
        <link rel="alternate" hrefLang="x-default" href="https://www.laptap.in/models/macbook-air" />
        <meta property="og:title" content="Sell MacBook Air Online | Best Price Guaranteed | Laptap" />
        <meta property="og:description" content="Get instant cash for your MacBook Air. Best resale value for M3, M2, M1, Intel models. Free doorstep pickup across India." />
        <meta property="og:url" content="https://www.laptap.in/models/macbook-air" />
        <meta property="og:type" content="product" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.laptap.in" },
              { "@type": "ListItem", "position": 2, "name": "Models", "item": "https://www.laptap.in/sell/laptop" },
              { "@type": "ListItem", "position": 3, "name": "MacBook Air", "item": "https://www.laptap.in/models/macbook-air" }
            ]
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": "Sell MacBook Air",
            "description": "Sell your used MacBook Air for instant cash with best market prices and free doorstep pickup across India",
            "brand": { "@type": "Brand", "name": "Apple" },
            "category": "Laptop",
            "offers": {
              "@type": "AggregateOffer",
              "priceCurrency": "INR",
              "lowPrice": "20000",
              "highPrice": "150000",
              "offerCount": "600",
              "availability": "https://schema.org/InStock"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.9",
              "bestRating": "5",
              "worstRating": "1",
              "reviewCount": "4200"
            },
            "review": [
              {
                "@type": "Review",
                "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
                "author": { "@type": "Person", "name": "Kavya Sharma" },
                "reviewBody": "Got ₹1,05,000 for my MacBook Air 15-inch M2. Fantastic price and instant payment!"
              },
              {
                "@type": "Review",
                "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
                "author": { "@type": "Person", "name": "Rohan Desai" },
                "reviewBody": "Sold my MacBook Air M1 in just 2 hours. Very professional service!"
              },
              {
                "@type": "Review",
                "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
                "author": { "@type": "Person", "name": "Sneha Patil" },
                "reviewBody": "Best resale value for my MacBook Air. Free pickup from my home in Pune."
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
                "name": "How much can I get for my MacBook Air?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "MacBook Air resale prices: M3 15-inch (₹90,000-₹1,50,000), M3 13-inch (₹75,000-₹1,20,000), M2 (₹55,000-₹95,000), M1 (₹40,000-₹70,000), Intel models (₹20,000-₹50,000). Exact price depends on model, year, storage, RAM, and condition."
                }
              },
              {
                "@type": "Question",
                "name": "Do you buy damaged MacBook Air?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes! We buy MacBook Air in any condition - cracked screen, battery issues, water damage, keyboard problems, or non-functional. Price is adjusted based on condition assessment."
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
                    MacBook Air
                  </div>

                  <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                    Sell Your MacBook Air for{" "}
                    <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                      Instant Cash
                    </span>
                  </h1>

                  <p className="mb-8 text-lg text-muted-foreground">
                    Get the best resale value for your MacBook Air. All models accepted - M3, M2, M1, Intel. 
                    Free doorstep pickup with instant payment.
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
                MacBook Air Models We Buy
              </h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {[
                  { name: "MacBook Air 15-inch M3", year: "2024" },
                  { name: "MacBook Air 13-inch M3", year: "2024" },
                  { name: "MacBook Air 15-inch M2", year: "2023" },
                  { name: "MacBook Air 13-inch M2", year: "2022" },
                  { name: "MacBook Air M1", year: "2020" },
                  { name: "MacBook Air Retina Intel", year: "2018-2020" },
                  { name: "MacBook Air 13-inch Intel", year: "2017" },
                  { name: "MacBook Air 11-inch", year: "2010-2015" },
                  { name: "MacBook Air 13-inch", year: "2008-2017" },
                ].map((model, index) => (
                  <div key={index} className="p-6 rounded-2xl border-2 border-border bg-card hover:border-primary transition-all">
                    <h3 className="font-bold text-lg mb-2">{model.name}</h3>
                    <p className="text-sm text-muted-foreground">{model.year}</p>
                  </div>
                ))}
              </div>

              <div className="mt-12 text-center">
                <p className="text-muted-foreground mb-6">
                  All MacBook Air models accepted - M3, M2, M1, Intel - in any condition
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
                Why Sell Your MacBook Air Online with Laptap?
              </h2>
              
              <div className="prose prose-lg max-w-none text-muted-foreground space-y-6">
                <p>
                  Looking to sell your used MacBook Air? You've come to the right place. Laptap offers India's most trusted platform for selling MacBook Air laptops online with instant cash payment. Whether you own a MacBook Air M3, M2, M1, or an older Intel-based model, we guarantee the best resale value in the market.
                </p>

                <h3 className="text-2xl font-bold text-foreground mt-8">Best Price for MacBook Air in India</h3>
                <p>
                  MacBook Air laptops retain excellent resale value, especially the newer Apple Silicon models. Our dynamic pricing algorithm considers your MacBook's processor (M3, M2, M1, Intel), screen size (13-inch, 15-inch), RAM configuration, storage capacity, and physical condition to offer you the highest possible price. We buy MacBook Air 2024, 2023, 2022, 2020, and older models.
                </p>

                <h3 className="text-2xl font-bold text-foreground mt-8">Sell MacBook Air 15-inch M2/M3</h3>
                <p>
                  The new MacBook Air 15-inch models with M2 and M3 chips command premium resale prices. Whether you're upgrading to a newer model or switching devices, we offer the best market rates for your 15-inch MacBook Air. The larger display and powerful Apple Silicon make these highly sought after in the resale market.
                </p>

                <h3 className="text-2xl font-bold text-foreground mt-8">Free Doorstep Pickup Across India</h3>
                <p>
                  Forget the hassle of visiting multiple shops or dealing with unreliable buyers. Our verified technicians provide free same-day doorstep pickup service across all major Indian cities including Bangalore, Mumbai, Delhi, Hyderabad, Chennai, and Pune.
                </p>

                <h3 className="text-2xl font-bold text-foreground mt-8">Instant Payment & Safe Transaction</h3>
                <p>
                  Get paid instantly after device verification. We support multiple payment methods including UPI, IMPS bank transfer, and cash. Your MacBook Air data is completely wiped using industry-standard security protocols. Every transaction is transparent and secure.
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

export default MacBookAir;
