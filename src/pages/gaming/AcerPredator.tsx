import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Gamepad2, Zap, Shield, IndianRupee } from "lucide-react";

const AcerPredator = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Sell Acer Predator Gaming Laptop | Best Price for Helios, Triton, Nitro | Instant Cash | Laptap</title>
        <meta name="description" content="Sell your used Acer Predator gaming laptop for instant cash. Get the best resale value for Predator Helios 300, Helios 16, Triton 500, Nitro 5, Nitro 16. Free doorstep pickup across India. Instant payment." />
        <meta name="keywords" content="sell Acer Predator laptop, sell Predator Helios, sell Predator Triton, sell Nitro 5, sell gaming laptop India, Acer Predator resale price, sell used gaming laptop, Predator laptop buyer, sell old Acer gaming laptop" />
        <link rel="canonical" href="https://www.laptap.in/gaming/acer-predator" />
        <link rel="alternate" hrefLang="en-IN" href="https://www.laptap.in/gaming/acer-predator" />
        <link rel="alternate" hrefLang="en" href="https://www.laptap.in/gaming/acer-predator" />
        <link rel="alternate" hrefLang="x-default" href="https://www.laptap.in/gaming/acer-predator" />
        <meta property="og:title" content="Sell Acer Predator Gaming Laptop | Best Price | Laptap" />
        <meta property="og:description" content="Get instant cash for your Acer Predator gaming laptop. Top prices for Helios, Triton, Nitro series." />
        <meta property="og:url" content="https://www.laptap.in/gaming/acer-predator" />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": "Sell Acer Predator Gaming Laptop",
            "description": "Sell your used Acer Predator gaming laptop for instant cash with free doorstep pickup and best market prices",
            "brand": { "@type": "Brand", "name": "Acer" },
            "category": "Gaming Laptops",
            "offers": {
              "@type": "AggregateOffer",
              "priceCurrency": "INR",
              "lowPrice": "25000",
              "highPrice": "180000",
              "offerCount": "280"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "bestRating": "5",
              "reviewCount": "720"
            },
            "review": [
              {
                "@type": "Review",
                "reviewRating": { "@type": "Rating", "ratingValue": "5" },
                "author": { "@type": "Person", "name": "Rahul Sharma" },
                "reviewBody": "Sold my Predator Helios 300 for a great price. Better than any local shop!"
              },
              {
                "@type": "Review",
                "reviewRating": { "@type": "Rating", "ratingValue": "5" },
                "author": { "@type": "Person", "name": "Karthik R" },
                "reviewBody": "Quick process, fair valuation for my Nitro 5. Got payment same day."
              }
            ]
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.laptap.in/" },
              { "@type": "ListItem", "position": 2, "name": "Gaming Laptops", "item": "https://www.laptap.in/gaming" },
              { "@type": "ListItem", "position": 3, "name": "Acer Predator", "item": "https://www.laptap.in/gaming/acer-predator" }
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
                "name": "How much can I get for my Acer Predator gaming laptop?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Acer Predator gaming laptops fetch ₹25,000 to ₹1,80,000 depending on model and specs. Predator Helios 16 with RTX 4080 commands highest prices."
                }
              },
              {
                "@type": "Question",
                "name": "Do you buy Nitro series laptops?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, we buy all Acer gaming laptops including Nitro 5, Nitro 16, Predator Helios, and Predator Triton series in any condition."
                }
              },
              {
                "@type": "Question",
                "name": "What affects Predator laptop resale value?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "GPU model (RTX series), display refresh rate, overall condition, battery health, and thermal performance are key factors for Predator resale value."
                }
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
                  <Gamepad2 className="h-4 w-4" />
                  Gaming Laptops
                </div>

                <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                  Sell Acer Predator Gaming Laptop for{" "}
                  <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    Maximum Cash
                  </span>
                </h1>

                <p className="mb-8 text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto">
                  Get premium resale value for your Acer Predator Helios 300, Helios 16, Triton 500, Nitro 5, and Nitro 16 gaming laptops. 
                  Free doorstep pickup with instant payment.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button variant="cta" size="lg" onClick={() => navigate("/sell/laptop")}>
                    Get Instant Quote
                  </Button>
                  <Button variant="outline" size="lg" onClick={() => navigate("/contact")}>
                    Talk to Expert
                  </Button>
                </div>

                <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">₹1.8L+</div>
                    <div className="text-sm text-muted-foreground">Max Payout</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">720+</div>
                    <div className="text-sm text-muted-foreground">Predators Sold</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">4.8★</div>
                    <div className="text-sm text-muted-foreground">Rating</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">2hrs</div>
                    <div className="text-sm text-muted-foreground">Avg Pickup</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="py-16 md:py-24">
            <div className="container max-w-6xl">
              <div className="grid md:grid-cols-2 gap-12">
                <div>
                  <h2 className="text-3xl font-bold mb-6">
                    Sell Acer Predator - Best Gaming Laptop Resale Prices
                  </h2>
                  <div className="prose prose-slate">
                    <p className="text-muted-foreground mb-4">
                      Looking to sell your Acer Predator gaming laptop? Laptap specializes in buying high-end gaming laptops and offers the most competitive prices for all Predator and Nitro models including Helios 300, Helios 16, Triton 500 SE, and the popular Nitro 5 and Nitro 16 series.
                    </p>
                    <p className="text-muted-foreground mb-4">
                      Acer Predator laptops are known for their excellent cooling systems and gaming performance. Whether you have the latest RTX 40-series Helios or an older GTX-powered Nitro, we understand gaming hardware and provide fair valuations that beat local dealers.
                    </p>
                    <p className="text-muted-foreground">
                      We buy Predator laptops in any condition - working perfectly, minor issues, or even with thermal problems. Our gaming laptop experts assess each device professionally and offer transparent pricing.
                    </p>
                  </div>
                </div>
                <div>
                  <h2 className="text-3xl font-bold mb-6">
                    Why Gamers Choose Laptap for Predator Resale
                  </h2>
                  <div className="space-y-4">
                    <div className="p-4 bg-card rounded-lg border flex gap-4">
                      <IndianRupee className="h-6 w-6 text-primary shrink-0" />
                      <div>
                        <h3 className="font-bold mb-1">Premium Gaming Prices</h3>
                        <p className="text-sm text-muted-foreground">
                          We value RTX GPUs, high-refresh displays, and Predator's cooling properly - up to 60% of original value.
                        </p>
                      </div>
                    </div>
                    <div className="p-4 bg-card rounded-lg border flex gap-4">
                      <Zap className="h-6 w-6 text-primary shrink-0" />
                      <div>
                        <h3 className="font-bold mb-1">Same-Day Pickup</h3>
                        <p className="text-sm text-muted-foreground">
                          Free doorstep pickup across major cities. Our experts handle gaming laptops with care.
                        </p>
                      </div>
                    </div>
                    <div className="p-4 bg-card rounded-lg border flex gap-4">
                      <Shield className="h-6 w-6 text-primary shrink-0" />
                      <div>
                        <h3 className="font-bold mb-1">Gaming Expert Valuation</h3>
                        <p className="text-sm text-muted-foreground">
                          We understand Predator specs - AeroBlade fans, Turbo mode, GPU performance all factor into pricing.
                        </p>
                      </div>
                    </div>
                    <div className="p-4 bg-card rounded-lg border flex gap-4">
                      <Gamepad2 className="h-6 w-6 text-primary shrink-0" />
                      <div>
                        <h3 className="font-bold mb-1">Any Condition Accepted</h3>
                        <p className="text-sm text-muted-foreground">
                          Thermal issues? Dead pixels? Battery problems? We buy Predator laptops in any condition.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="py-16 md:py-24 bg-muted/30">
            <div className="container">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Acer Gaming Models We Buy</h2>
              <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
                All Predator and Nitro gaming laptop series accepted
              </p>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {[
                  { name: "Predator Helios 16 (2024)", series: "Flagship Gaming", price: "₹90K-1.8L" },
                  { name: "Predator Helios 18", series: "Premium Large Screen", price: "₹1L-1.7L" },
                  { name: "Predator Helios 300 (2023)", series: "Popular Gaming", price: "₹60K-1.2L" },
                  { name: "Predator Triton 500 SE", series: "Slim Gaming", price: "₹70K-1.4L" },
                  { name: "Predator Triton 17 X", series: "Desktop Replacement", price: "₹90K-1.6L" },
                  { name: "Nitro 16 (2024)", series: "Mid-Range Gaming", price: "₹45K-85K" },
                  { name: "Nitro 5 (2022-2023)", series: "Budget Gaming", price: "₹30K-60K" },
                  { name: "Nitro V 15", series: "Entry Gaming", price: "₹25K-45K" },
                  { name: "Predator Helios Neo 16", series: "Value Flagship", price: "₹55K-1L" },
                ].map((model, index) => (
                  <div key={index} className="p-6 rounded-2xl border-2 border-border bg-card hover:border-primary transition-all">
                    <h3 className="font-bold text-lg mb-1">{model.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{model.series}</p>
                    <p className="text-primary font-semibold">{model.price}</p>
                  </div>
                ))}
              </div>

              <div className="mt-12 text-center">
                <Button variant="cta" size="lg" onClick={() => navigate("/sell")}>
                  Sell Your Predator Now - Get Quote
                </Button>
              </div>
            </div>
          </section>

          <section className="py-16 md:py-24">
            <div className="container">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Upgrade Your Gaming Setup
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Sell your current Predator and fund your next gaming upgrade. Get instant cash within hours.
                </p>
              </div>
              <div className="mt-12 text-center">
                <p className="text-sm text-muted-foreground">
                  Also selling other gaming brands? Check out{" "}
                  <Link to="/gaming/asus-rog" className="text-primary hover:underline">Sell ASUS ROG</Link>,{" "}
                  <Link to="/models/acer-laptop" className="text-primary hover:underline">Sell Acer Laptop</Link>, or{" "}
                  <Link to="/sell" className="text-primary hover:underline">All Brands</Link>
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

export default AcerPredator;