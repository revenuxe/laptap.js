import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Laptop } from "lucide-react";

const LenovoThinkPad = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Sell Lenovo ThinkPad Laptop Online - Best Price for ThinkPad | Instant Cash | Laptap</title>
        <meta name="description" content="Sell your used Lenovo ThinkPad laptop for instant cash. Get the best resale value for ThinkPad X1, T-series, E-series models. Free doorstep pickup across India." />
        <meta name="keywords" content="sell Lenovo ThinkPad, sell ThinkPad X1, ThinkPad resale value, sell used Lenovo laptop, ThinkPad buyback India" />
        <link rel="canonical" href="https://www.laptap.in/models/lenovo-thinkpad" />
        <link rel="alternate" hrefLang="en-IN" href="https://www.laptap.in/models/lenovo-thinkpad" />
        <link rel="alternate" hrefLang="en" href="https://www.laptap.in/models/lenovo-thinkpad" />
        <link rel="alternate" hrefLang="x-default" href="https://www.laptap.in/models/lenovo-thinkpad" />
        <meta property="og:title" content="Sell Lenovo ThinkPad | Best Price Guaranteed | Laptap" />
        <meta property="og:description" content="Get instant cash for your ThinkPad. Best resale value for X1 Carbon, T-series, E-series. Free doorstep pickup across India." />
        <meta property="og:url" content="https://www.laptap.in/models/lenovo-thinkpad" />
        <meta property="og:type" content="product" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": "Sell Lenovo ThinkPad",
            "description": "Sell your used Lenovo ThinkPad laptop for instant cash with best market prices and free doorstep pickup across India",
            "brand": { "@type": "Brand", "name": "Lenovo" },
            "category": "Laptop",
            "offers": {
              "@type": "AggregateOffer",
              "priceCurrency": "INR",
              "lowPrice": "15000",
              "highPrice": "120000",
              "offerCount": "300",
              "availability": "https://schema.org/InStock"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "reviewCount": "950"
            }
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
                  <Laptop className="h-4 w-4" />
                  Lenovo ThinkPad Series
                </div>

                <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                  Sell Your ThinkPad Laptop for{" "}
                  <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    Best Price
                  </span>
                </h1>

                <p className="mb-8 text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto">
                  Get instant cash for Lenovo ThinkPad laptops. All models accepted with free doorstep pickup and instant payment.
                </p>

                <Button variant="cta" size="lg" onClick={() => navigate("/sell")}>
                  Get Instant Quote
                </Button>
              </div>
            </div>
          </section>

          {/* SEO Content */}
          <section className="py-16 md:py-24">
            <div className="container max-w-6xl">
              <div className="grid md:grid-cols-2 gap-12 mb-16">
                <div className="prose prose-slate">
                  <h2 className="text-3xl font-bold mb-6">Sell Lenovo ThinkPad - Premium Business Laptops</h2>
                  <p className="text-muted-foreground mb-4">
                    Looking to sell your Lenovo ThinkPad? Laptap offers the best resale value for all ThinkPad models including X1 Carbon, T-series, E-series, L-series, and P-series workstations. Whether you own a latest ThinkPad X1 Carbon Gen 11 or an older T480, we provide competitive pricing based on current market rates.
                  </p>
                  <p className="text-muted-foreground">
                    ThinkPad laptops are renowned for their durability, business-grade features, and excellent resale value. We buy all configurations - Intel Core i5, i7, i9, AMD Ryzen processors, touchscreen models, 2-in-1 convertibles, and workstation-grade P-series. Get instant quote, free doorstep pickup across India, and immediate payment.
                  </p>
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold mb-4">Why Sell ThinkPad with Laptap?</h3>
                  <div className="p-4 bg-card rounded-lg border">
                    <h4 className="font-bold mb-2">Best Market Prices</h4>
                    <p className="text-sm text-muted-foreground">Get 15-20% more than other buyers for ThinkPad models</p>
                  </div>
                  <div className="p-4 bg-card rounded-lg border">
                    <h4 className="font-bold mb-2">All ThinkPad Models Accepted</h4>
                    <p className="text-sm text-muted-foreground">X1 Carbon, T-series, E-series, L-series, P-series workstations</p>
                  </div>
                  <div className="p-4 bg-card rounded-lg border">
                    <h4 className="font-bold mb-2">Free Doorstep Pickup</h4>
                    <p className="text-sm text-muted-foreground">Same-day pickup service across all major cities in India</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ThinkPad Models Section */}
          <section className="py-16 md:py-24 bg-muted/30">
            <div className="container">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Lenovo ThinkPad Models We Buy</h2>
              <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
                We accept all Lenovo ThinkPad models in any condition - working or damaged
              </p>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {[
                  { name: "ThinkPad X1 Carbon Gen 11", series: "Premium Ultrabook" },
                  { name: "ThinkPad X1 Carbon Gen 10", series: "Premium Ultrabook" },
                  { name: "ThinkPad X1 Yoga Gen 8", series: "2-in-1 Convertible" },
                  { name: "ThinkPad T14 Gen 4", series: "Business Series" },
                  { name: "ThinkPad T16 Gen 2", series: "Business Series" },
                  { name: "ThinkPad E14 Gen 5", series: "Essential Business" },
                  { name: "ThinkPad E15 Gen 4", series: "Essential Business" },
                  { name: "ThinkPad L13 Yoga Gen 4", series: "Convertible" },
                  { name: "ThinkPad P1 Gen 6", series: "Mobile Workstation" },
                  { name: "ThinkPad P16s Gen 2", series: "Workstation" },
                  { name: "ThinkPad X13 Gen 4", series: "Compact Business" },
                  { name: "ThinkPad T480", series: "Classic Business" },
                ].map((model, index) => (
                  <div key={index} className="p-6 rounded-2xl border-2 border-border bg-card hover:border-primary transition-all">
                    <h3 className="font-bold text-lg mb-2">{model.name}</h3>
                    <p className="text-sm text-muted-foreground">{model.series}</p>
                  </div>
                ))}
              </div>

              <div className="mt-12 text-center">
                <p className="text-muted-foreground mb-6">
                  Don't see your ThinkPad model? We buy all Lenovo ThinkPad laptops!
                </p>
                <Button variant="cta" size="lg" onClick={() => navigate("/sell")}>
                  Sell Your ThinkPad Now
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

export default LenovoThinkPad;
