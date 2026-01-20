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

const AsusLaptop = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Sell Asus Laptop Online - Get Instant Cash for Asus ROG, ZenBook, VivoBook | Best Price | Laptap</title>
        <meta name="description" content="Sell your used Asus laptop for instant cash. Get the best resale value for Asus ROG Gaming, ZenBook, VivoBook, TUF Gaming, ProArt laptops. Free doorstep pickup across India. Instant payment via UPI. Trusted by 10,000+ sellers." />
        <meta name="keywords" content="sell Asus laptop, sell Asus ROG laptop, sell Asus ZenBook, sell Asus VivoBook, sell Asus TUF Gaming, Asus laptop resale value, sell used Asus laptop, Asus laptop buyback India, best price Asus laptop, sell Asus ROG Strix, sell Asus ProArt, instant cash Asus laptop" />
        <link rel="canonical" href="https://www.laptap.in/models/asus-laptop" />
        <link rel="alternate" hrefLang="en-IN" href="https://www.laptap.in/models/asus-laptop" />
        <link rel="alternate" hrefLang="en" href="https://www.laptap.in/models/asus-laptop" />
        <link rel="alternate" hrefLang="x-default" href="https://www.laptap.in/models/asus-laptop" />
        <meta property="og:title" content="Sell Asus Laptop Online | Best Price Guaranteed | Laptap" />
        <meta property="og:description" content="Get instant cash for your Asus laptop. Best resale value for ROG, ZenBook, VivoBook, TUF Gaming models. Free doorstep pickup across India." />
        <meta property="og:url" content="https://www.laptap.in/models/asus-laptop" />
        <meta property="og:type" content="product" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.laptap.in" },
              { "@type": "ListItem", "position": 2, "name": "Models", "item": "https://www.laptap.in/sell/laptop" },
              { "@type": "ListItem", "position": 3, "name": "Asus Laptop", "item": "https://www.laptap.in/models/asus-laptop" }
            ]
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": "Sell Asus Laptop",
            "description": "Sell your used Asus laptop for instant cash with best market prices and free doorstep pickup across India",
            "brand": { "@type": "Brand", "name": "Asus" },
            "category": "Laptop",
            "offers": {
              "@type": "AggregateOffer",
              "priceCurrency": "INR",
              "lowPrice": "8000",
              "highPrice": "180000",
              "offerCount": "450",
              "availability": "https://schema.org/InStock"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "bestRating": "5",
              "worstRating": "1",
              "reviewCount": "2800"
            },
            "review": [
              {
                "@type": "Review",
                "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
                "author": { "@type": "Person", "name": "Vikram Singh" },
                "reviewBody": "Got ₹95,000 for my Asus ROG Strix G16. Best price compared to local shops!"
              },
              {
                "@type": "Review",
                "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
                "author": { "@type": "Person", "name": "Priya Sharma" },
                "reviewBody": "Sold my Asus ZenBook 14 OLED in just 3 hours. Instant UPI payment. Highly recommended!"
              },
              {
                "@type": "Review",
                "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
                "author": { "@type": "Person", "name": "Karthik Menon" },
                "reviewBody": "Professional service. They picked up my Asus TUF Gaming from my office. Fair valuation."
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
                "name": "How much can I get for my Asus laptop?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Asus laptop resale prices: ROG Strix/Zephyrus (₹40,000-₹1,80,000), ZenBook (₹20,000-₹90,000), VivoBook (₹8,000-₹45,000), TUF Gaming (₹25,000-₹80,000). Price depends on model, specs, and condition."
                }
              },
              {
                "@type": "Question",
                "name": "Do you buy damaged Asus laptops?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes! We buy Asus laptops in any condition - cracked screen, battery issues, keyboard problems, or non-functional. Price is adjusted based on condition assessment."
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
                    Asus Laptops
                  </div>

                  <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                    Sell Your Asus Laptop for{" "}
                    <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                      Best Price
                    </span>
                  </h1>

                  <p className="mb-8 text-lg text-muted-foreground">
                    Get instant cash for your Asus ROG, ZenBook, VivoBook, TUF Gaming laptops. 
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
                Asus Laptop Models We Buy
              </h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {[
                  { name: "Asus ROG Strix G16/G18", series: "Gaming Series" },
                  { name: "Asus ROG Zephyrus G14/G16", series: "Premium Gaming" },
                  { name: "Asus ROG Flow X13/X16", series: "Convertible Gaming" },
                  { name: "Asus ZenBook 14/16 OLED", series: "Premium Ultrabook" },
                  { name: "Asus ZenBook Pro", series: "Creator Series" },
                  { name: "Asus ZenBook Flip", series: "2-in-1 Premium" },
                  { name: "Asus VivoBook 14/15/16", series: "Everyday Laptop" },
                  { name: "Asus VivoBook Pro", series: "Performance" },
                  { name: "Asus TUF Gaming F15/F17", series: "Gaming" },
                  { name: "Asus TUF Dash", series: "Slim Gaming" },
                  { name: "Asus ProArt StudioBook", series: "Creator Pro" },
                  { name: "Asus Chromebook", series: "Chrome OS" },
                ].map((model, index) => (
                  <div key={index} className="p-6 rounded-2xl border-2 border-border bg-card hover:border-primary transition-all">
                    <h3 className="font-bold text-lg mb-2">{model.name}</h3>
                    <p className="text-sm text-muted-foreground">{model.series}</p>
                  </div>
                ))}
              </div>

              <div className="mt-12 text-center">
                <p className="text-muted-foreground mb-6">
                  All Asus laptop models accepted - ROG, ZenBook, VivoBook, TUF - in any condition
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
                Why Sell Your Asus Laptop Online with Laptap?
              </h2>
              
              <div className="prose prose-lg max-w-none text-muted-foreground space-y-6">
                <p>
                  Looking to sell your used Asus laptop? Laptap offers India's most trusted platform for selling Asus laptops online with instant cash payment. Whether you own an Asus ROG gaming beast, a sleek ZenBook ultrabook, or a reliable VivoBook, we guarantee the best resale value in the market.
                </p>

                <h3 className="text-2xl font-bold text-foreground mt-8">Best Price for Asus Laptops in India</h3>
                <p>
                  Asus laptops, especially the ROG gaming series and ZenBook premium line, retain excellent resale value. Our dynamic pricing considers your laptop's processor (Intel Core, AMD Ryzen), GPU (NVIDIA RTX, AMD Radeon), RAM, storage, display type (OLED, IPS), and physical condition to offer you the highest possible price. We buy Asus ROG Strix, ROG Zephyrus, ZenBook, VivoBook, TUF Gaming, and ProArt models.
                </p>

                <h3 className="text-2xl font-bold text-foreground mt-8">Sell Asus ROG Gaming Laptop</h3>
                <p>
                  Gaming laptops from Asus ROG (Republic of Gamers) command premium resale values. Whether you have a ROG Strix G16 with RTX 4070, a ROG Zephyrus G14 with AMD Ryzen 9, or an ROG Flow convertible, we offer competitive prices that beat local markets. Upgrade to the latest gaming hardware by selling your current Asus ROG with us.
                </p>

                <h3 className="text-2xl font-bold text-foreground mt-8">Free Doorstep Pickup Across India</h3>
                <p>
                  Skip the hassle of visiting multiple shops. Our verified technicians provide free same-day doorstep pickup service across Bangalore, Mumbai, Delhi, Hyderabad, Chennai, Pune, and all major cities. Schedule a convenient time, and we'll come to your location.
                </p>

                <h3 className="text-2xl font-bold text-foreground mt-8">Instant Payment & Secure Transaction</h3>
                <p>
                  Get paid instantly after device verification via UPI, IMPS bank transfer, or cash. Your data is completely wiped using industry-standard security protocols. Every transaction is transparent and secure.
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

export default AsusLaptop;
