import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Laptop, CheckCircle, TrendingUp, Shield, Zap, MapPin } from "lucide-react";

const BangaloreDell = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Sell Used Dell Laptop in Bangalore | Best Price for Dell XPS, Inspiron, Latitude | Instant Cash | Laptap</title>
        <meta name="description" content="Sell your used Dell laptop in Bangalore for instant cash. Get the best resale value for Dell XPS, Inspiron, Latitude, Vostro models. Free same-day doorstep pickup across all Bangalore areas. Instant payment via UPI." />
        <meta name="keywords" content="sell Dell laptop Bangalore, sell Dell XPS Bangalore, sell Dell Inspiron Bangalore, Dell laptop resale Bangalore, best price Dell laptop Bangalore, sell used Dell laptop Bangalore" />
        <link rel="canonical" href="https://www.laptap.in/bangalore/dell" />
        <link rel="alternate" hrefLang="en-IN" href="https://www.laptap.in/bangalore/dell" />
        <link rel="alternate" hrefLang="en" href="https://www.laptap.in/bangalore/dell" />
        <link rel="alternate" hrefLang="x-default" href="https://www.laptap.in/bangalore/dell" />
        <meta property="og:title" content="Sell Dell Laptop in Bangalore | Best Price | Laptap" />
        <meta property="og:description" content="Get instant cash for your Dell laptop in Bangalore. Free same-day pickup across Koramangala, Indiranagar, Whitefield." />
        <meta property="og:url" content="https://www.laptap.in/bangalore/dell" />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": "Sell Dell Laptop in Bangalore",
            "description": "Sell your used Dell laptop for instant cash in Bangalore with free doorstep pickup and best market prices",
            "brand": { "@type": "Brand", "name": "Dell" },
            "offers": {
              "@type": "AggregateOffer",
              "priceCurrency": "INR",
              "lowPrice": "8000",
              "highPrice": "140000",
              "offerCount": "500",
              "areaServed": { "@type": "City", "name": "Bangalore" }
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
                  <MapPin className="h-4 w-4" />
                  Bangalore
                </div>

                <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                  Sell Used Dell Laptop in Bangalore for{" "}
                  <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    Instant Cash
                  </span>
                </h1>

                <p className="mb-8 text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto">
                  Get the highest resale value for your Dell XPS, Inspiron, Latitude, Vostro laptops in Bangalore. 
                  Free same-day doorstep pickup with instant payment.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button variant="cta" size="lg" onClick={() => navigate("/sell/laptop")}>
                    Book Free Pickup Now
                  </Button>
                  <Button variant="outline" size="lg" onClick={() => navigate("/contact")}>
                    Get Instant Quote
                  </Button>
                </div>
              </div>
            </div>
          </section>

          <section className="py-16 md:py-24">
            <div className="container max-w-6xl">
              <div className="grid md:grid-cols-2 gap-12">
                <div>
                  <h2 className="text-3xl font-bold mb-6">
                    Sell Dell Laptop in Bangalore - Best Prices Guaranteed
                  </h2>
                  <div className="prose prose-slate">
                    <p className="text-muted-foreground mb-4">
                      Looking to sell your Dell laptop in Bangalore? Laptap offers the most competitive prices for all Dell models including XPS 13, XPS 15, XPS 17, Inspiron, Latitude, Vostro, and Alienware gaming laptops. Whether you own a premium Dell XPS with 11th/12th/13th Gen Intel or an older Inspiron model, we provide fair valuations and instant cash.
                    </p>
                    <p className="text-muted-foreground mb-4">
                      Our service covers all major localities in Bangalore - Koramangala, Indiranagar, Whitefield, Electronic City, HSR Layout, Marathahalli, BTM Layout, and more. We offer free same-day doorstep pickup, professional device inspection, secure data wiping, and instant payment via UPI, bank transfer, or cash.
                    </p>
                    <p className="text-muted-foreground">
                      Trusted by thousands of Bangalore residents, Laptap makes selling Dell laptops quick and hassle-free. Get your instant quote online, schedule pickup at your convenience, and receive payment within hours. No hidden fees, no haggling - just transparent service.
                    </p>
                  </div>
                </div>
                <div>
                  <h2 className="text-3xl font-bold mb-6">
                    Why Sell Dell Laptop with Laptap in Bangalore?
                  </h2>
                  <div className="space-y-4">
                    <div className="p-4 bg-card rounded-lg border">
                      <h3 className="font-bold mb-2">Top Market Rates</h3>
                      <p className="text-sm text-muted-foreground">
                        We offer the best prices for Dell XPS, Inspiron, Latitude, and Vostro models in Bangalore - typically 15-20% higher than competitors.
                      </p>
                    </div>
                    <div className="p-4 bg-card rounded-lg border">
                      <h3 className="font-bold mb-2">Free Doorstep Service</h3>
                      <p className="text-sm text-muted-foreground">
                        Verified technicians provide free same-day pickup across all Bangalore areas. We come to your location for device inspection.
                      </p>
                    </div>
                    <div className="p-4 bg-card rounded-lg border">
                      <h3 className="font-bold mb-2">Quick & Secure Payment</h3>
                      <p className="text-sm text-muted-foreground">
                        Receive instant payment via UPI, PhonePe, GPay, or cash immediately after verification. Professional data wiping included.
                      </p>
                    </div>
                    <div className="p-4 bg-card rounded-lg border">
                      <h3 className="font-bold mb-2">All Dell Models Accepted</h3>
                      <p className="text-sm text-muted-foreground">
                        We buy all Dell laptops - XPS, Inspiron, Latitude, Vostro, Alienware - in any condition including damaged or non-working devices.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Dell Models Section */}
          <section className="py-16 md:py-24 bg-muted/30">
            <div className="container">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Dell Laptop Models We Buy in Bangalore</h2>
              <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
                All Dell laptop series accepted - XPS, Inspiron, Latitude, Vostro, Alienware, Precision
              </p>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {[
                  { name: "Dell XPS 13, 15, 17", series: "Premium Ultrabooks" },
                  { name: "Dell Inspiron 14, 15, 16", series: "All-Purpose Laptops" },
                  { name: "Dell Latitude 5000, 7000, 9000", series: "Business Laptops" },
                  { name: "Dell Vostro 14, 15", series: "Small Business" },
                  { name: "Dell Alienware m15, m17, x14", series: "Gaming Laptops" },
                  { name: "Dell Precision 5000, 7000", series: "Mobile Workstations" },
                  { name: "Dell G15 Gaming", series: "Budget Gaming" },
                  { name: "Dell Inspiron 2-in-1", series: "Convertible Laptops" },
                  { name: "Dell XPS Plus", series: "Premium Thin & Light" },
                ].map((model, index) => (
                  <div key={index} className="p-6 rounded-2xl border-2 border-border bg-card hover:border-primary transition-all">
                    <h3 className="font-bold text-lg mb-2">{model.name}</h3>
                    <p className="text-sm text-muted-foreground">{model.series}</p>
                  </div>
                ))}
              </div>

              <div className="mt-12 text-center">
                <Button variant="cta" size="lg" onClick={() => navigate("/sell")}>
                  Get Started - Sell Dell Laptop Now
                </Button>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-16 md:py-24">
            <div className="container">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Ready to Sell Your Dell Laptop in Bangalore?
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Join thousands of satisfied customers in Bangalore. Get instant quote, free pickup, and immediate payment.
                </p>
              </div>
              <div className="mt-12 text-center">
                <p className="text-sm text-muted-foreground">
                  Also selling other brands? Check out{" "}
                  <Link to="/bangalore/macbook" className="text-primary hover:underline">Sell MacBook</Link>,{" "}
                  <Link to="/bangalore/lenovo" className="text-primary hover:underline">Sell Lenovo</Link>, or{" "}
                  <Link to="/bangalore/hp" className="text-primary hover:underline">Sell HP</Link> in Bangalore
                </p>
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

export default BangaloreDell;
