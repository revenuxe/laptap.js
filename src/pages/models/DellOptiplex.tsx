import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Monitor } from "lucide-react";

const DellOptiplex = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Sell Dell Optiplex Desktop Online - Best Price for Dell Desktop | Instant Cash | Laptap</title>
        <meta name="description" content="Sell your used Dell Optiplex desktop for instant cash. Get the best resale value for Dell Optiplex models. Free doorstep pickup across India." />
        <meta name="keywords" content="sell Dell Optiplex, sell Dell desktop, Dell Optiplex resale value, sell used Dell desktop, Dell desktop buyback India" />
        <link rel="canonical" href="https://www.laptap.in/models/dell-optiplex" />
        <link rel="alternate" hrefLang="en-IN" href="https://www.laptap.in/models/dell-optiplex" />
        <link rel="alternate" hrefLang="en" href="https://www.laptap.in/models/dell-optiplex" />
        <link rel="alternate" hrefLang="x-default" href="https://www.laptap.in/models/dell-optiplex" />
        <meta property="og:title" content="Sell Dell Optiplex Desktop | Best Price Guaranteed | Laptap" />
        <meta property="og:description" content="Get instant cash for your Dell Optiplex desktop. Best resale value with free doorstep pickup across India." />
        <meta property="og:url" content="https://www.laptap.in/models/dell-optiplex" />
        <meta property="og:type" content="product" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.laptap.in" },
              { "@type": "ListItem", "position": 2, "name": "Models", "item": "https://www.laptap.in/sell/desktop" },
              { "@type": "ListItem", "position": 3, "name": "Dell Optiplex", "item": "https://www.laptap.in/models/dell-optiplex" }
            ]
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": "Sell Dell Optiplex Desktop",
            "description": "Sell your used Dell Optiplex desktop for instant cash with best market prices and free doorstep pickup",
            "brand": { "@type": "Brand", "name": "Dell" },
            "category": "Desktop Computer",
            "offers": {
              "@type": "AggregateOffer",
              "priceCurrency": "INR",
              "lowPrice": "5000",
              "highPrice": "50000",
              "offerCount": "150",
              "availability": "https://schema.org/InStock"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.7",
              "bestRating": "5",
              "worstRating": "1",
              "reviewCount": "320"
            },
            "review": [
              {
                "@type": "Review",
                "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
                "author": { "@type": "Person", "name": "Suresh Babu" },
                "reviewBody": "Sold multiple Dell Optiplex units from our office. Excellent bulk pricing!"
              }
            ]
          })}
        </script>
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <section className="relative overflow-hidden bg-gradient-to-b from-background via-muted/20 to-background py-20 md:py-32">
            <div className="container">
              <div className="mx-auto max-w-4xl text-center">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                  <Monitor className="h-4 w-4" />
                  Dell Optiplex Series
                </div>

                <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                  Sell Your Dell Optiplex Desktop for{" "}
                  <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    Best Price
                  </span>
                </h1>

                <p className="mb-8 text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto">
                  Get instant cash for Dell Optiplex desktops. All models accepted with free doorstep pickup and instant payment.
                </p>

                <Button variant="cta" size="lg" onClick={() => navigate("/sell/desktop")}>
                  Get Instant Quote
                </Button>
              </div>
            </div>
          </section>
        </main>
        <Footer />
        <WhatsAppFloat />
      </div>
    </>
  );
};

export default DellOptiplex;
