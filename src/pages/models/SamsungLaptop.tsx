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

const SamsungLaptop = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Sell Samsung Laptop Online - Get Instant Cash for Samsung Galaxy Book | Best Price | Laptap</title>
        <meta name="description" content="Sell your used Samsung laptop for instant cash. Get the best resale value for Samsung Galaxy Book Pro, Galaxy Book 3, Galaxy Book Flex, Notebook laptops. Free doorstep pickup across India. Instant payment via UPI." />
        <meta name="keywords" content="sell Samsung laptop, sell Samsung Galaxy Book, sell Samsung Galaxy Book Pro, sell Samsung Galaxy Book 3, Samsung laptop resale value, sell used Samsung laptop, Samsung laptop buyback India, best price Samsung laptop, sell Samsung Notebook, instant cash Samsung laptop" />
        <link rel="canonical" href="https://www.laptap.in/models/samsung-laptop" />
        <link rel="alternate" hrefLang="en-IN" href="https://www.laptap.in/models/samsung-laptop" />
        <link rel="alternate" hrefLang="en" href="https://www.laptap.in/models/samsung-laptop" />
        <link rel="alternate" hrefLang="x-default" href="https://www.laptap.in/models/samsung-laptop" />
        <meta property="og:title" content="Sell Samsung Laptop Online | Best Price Guaranteed | Laptap" />
        <meta property="og:description" content="Get instant cash for your Samsung laptop. Best resale value for Galaxy Book Pro, Galaxy Book 3 models. Free doorstep pickup across India." />
        <meta property="og:url" content="https://www.laptap.in/models/samsung-laptop" />
        <meta property="og:type" content="product" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.laptap.in" },
              { "@type": "ListItem", "position": 2, "name": "Models", "item": "https://www.laptap.in/sell/laptop" },
              { "@type": "ListItem", "position": 3, "name": "Samsung Laptop", "item": "https://www.laptap.in/models/samsung-laptop" }
            ]
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": "Sell Samsung Laptop",
            "description": "Sell your used Samsung laptop for instant cash with best market prices and free doorstep pickup across India",
            "brand": { "@type": "Brand", "name": "Samsung" },
            "category": "Laptop",
            "offers": {
              "@type": "AggregateOffer",
              "priceCurrency": "INR",
              "lowPrice": "15000",
              "highPrice": "140000",
              "offerCount": "280",
              "availability": "https://schema.org/InStock"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "bestRating": "5",
              "worstRating": "1",
              "reviewCount": "1800"
            },
            "review": [
              {
                "@type": "Review",
                "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
                "author": { "@type": "Person", "name": "Deepak Joshi" },
                "reviewBody": "Got ₹85,000 for my Samsung Galaxy Book 3 Pro 360. Excellent service!"
              },
              {
                "@type": "Review",
                "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
                "author": { "@type": "Person", "name": "Anita Verma" },
                "reviewBody": "Sold my Galaxy Book Pro in 3 hours. Instant UPI payment. Very smooth process!"
              },
              {
                "@type": "Review",
                "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
                "author": { "@type": "Person", "name": "Mohammed Rizwan" },
                "reviewBody": "Best price for my Samsung laptop. Free pickup from my home. Highly recommended!"
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
                "name": "How much can I get for my Samsung laptop?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Samsung laptop resale prices: Galaxy Book 3 Ultra (₹70,000-₹1,40,000), Galaxy Book 3 Pro (₹50,000-₹95,000), Galaxy Book 3 (₹30,000-₹60,000), Older models (₹15,000-₹45,000). Price depends on model, specs, and condition."
                }
              },
              {
                "@type": "Question",
                "name": "Do you buy damaged Samsung laptops?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes! We buy Samsung laptops in any condition - cracked screen, battery issues, keyboard problems, or non-functional. Price is adjusted based on condition assessment."
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
                    Samsung Laptops
                  </div>

                  <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                    Sell Your Samsung Laptop for{" "}
                    <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                      Top Price
                    </span>
                  </h1>

                  <p className="mb-8 text-lg text-muted-foreground">
                    Get instant cash for your Samsung Galaxy Book Pro, Galaxy Book 3, and Notebook laptops. 
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
                Samsung Laptop Models We Buy
              </h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {[
                  { name: "Samsung Galaxy Book 3 Ultra", series: "Flagship" },
                  { name: "Samsung Galaxy Book 3 Pro 360", series: "Premium 2-in-1" },
                  { name: "Samsung Galaxy Book 3 Pro", series: "Premium Ultrabook" },
                  { name: "Samsung Galaxy Book 3", series: "Mainstream" },
                  { name: "Samsung Galaxy Book 2 Pro", series: "Previous Gen" },
                  { name: "Samsung Galaxy Book 2", series: "Previous Gen" },
                  { name: "Samsung Galaxy Book Pro 360", series: "Convertible" },
                  { name: "Samsung Galaxy Book Pro", series: "AMOLED Display" },
                  { name: "Samsung Galaxy Book Flex", series: "2-in-1" },
                  { name: "Samsung Galaxy Book Ion", series: "Ultra-Light" },
                  { name: "Samsung Notebook 9", series: "Legacy" },
                  { name: "Samsung Notebook Series", series: "Older Models" },
                ].map((model, index) => (
                  <div key={index} className="p-6 rounded-2xl border-2 border-border bg-card hover:border-primary transition-all">
                    <h3 className="font-bold text-lg mb-2">{model.name}</h3>
                    <p className="text-sm text-muted-foreground">{model.series}</p>
                  </div>
                ))}
              </div>

              <div className="mt-12 text-center">
                <p className="text-muted-foreground mb-6">
                  All Samsung laptop models accepted - Galaxy Book, Notebook - in any condition
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
                Why Sell Your Samsung Laptop Online with Laptap?
              </h2>
              
              <div className="prose prose-lg max-w-none text-muted-foreground space-y-6">
                <p>
                  Looking to sell your used Samsung laptop? Laptap offers India's most trusted platform for selling Samsung laptops online with instant cash payment. Whether you own a Samsung Galaxy Book 3 Ultra, Galaxy Book Pro 360, or an older Notebook series, we guarantee the best resale value.
                </p>

                <h3 className="text-2xl font-bold text-foreground mt-8">Best Price for Samsung Laptops in India</h3>
                <p>
                  Samsung Galaxy Book laptops with stunning AMOLED displays and premium build quality retain excellent resale value. Our pricing considers your laptop's processor (Intel Core 13th Gen, Intel Evo), RAM, storage, display type (AMOLED, Dynamic AMOLED), and physical condition to offer you the highest possible price.
                </p>

                <h3 className="text-2xl font-bold text-foreground mt-8">Sell Samsung Galaxy Book Pro</h3>
                <p>
                  Samsung Galaxy Book Pro series with Super AMOLED displays are highly valued in the resale market. Whether you have a Galaxy Book 3 Ultra with Intel Core i9, a Galaxy Book 3 Pro 360 convertible, or a Galaxy Book 2 Pro, we offer competitive prices that beat local dealers.
                </p>

                <h3 className="text-2xl font-bold text-foreground mt-8">Free Doorstep Pickup Across India</h3>
                <p>
                  No need to visit local shops or deal with unreliable buyers. Our verified technicians provide free same-day doorstep pickup service across Bangalore, Mumbai, Delhi, Hyderabad, Chennai, Pune, and all major cities.
                </p>

                <h3 className="text-2xl font-bold text-foreground mt-8">Instant Payment & Secure Transaction</h3>
                <p>
                  Get paid instantly after device verification via UPI, IMPS bank transfer, or cash. Your data is completely wiped using Samsung's secure protocols. Every transaction is transparent and backed by thousands of satisfied customer reviews.
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

export default SamsungLaptop;
