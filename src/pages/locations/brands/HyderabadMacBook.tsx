import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { MapPin } from "lucide-react";

const HyderabadMacBook = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Sell Used MacBook in Hyderabad | Best Price for MacBook Pro, Air, M1, M2, M3 | Instant Cash | Laptap</title>
        <meta name="description" content="Sell your used MacBook in Hyderabad for instant cash. Get the best resale value for MacBook Pro, MacBook Air, M1, M2, M3 models. Free same-day doorstep pickup across all Hyderabad areas. Instant payment via UPI." />
        <meta name="keywords" content="sell MacBook Hyderabad, sell MacBook Pro Hyderabad, sell MacBook Air Hyderabad, MacBook resale Hyderabad, best price MacBook Hyderabad, sell used MacBook Hyderabad, Apple laptop buyer Hyderabad, sell old MacBook Hyderabad, sell M1 MacBook Hyderabad, sell M2 MacBook Hyderabad" />
        <link rel="canonical" href="https://www.laptap.in/hyderabad/macbook" />
        <link rel="alternate" hrefLang="en-IN" href="https://www.laptap.in/hyderabad/macbook" />
        <link rel="alternate" hrefLang="en" href="https://www.laptap.in/hyderabad/macbook" />
        <link rel="alternate" hrefLang="x-default" href="https://www.laptap.in/hyderabad/macbook" />
        <meta property="og:title" content="Sell MacBook in Hyderabad | Best Price | Laptap" />
        <meta property="og:description" content="Get instant cash for your MacBook in Hyderabad. Free same-day pickup across HITEC City, Gachibowli, Madhapur." />
        <meta property="og:url" content="https://www.laptap.in/hyderabad/macbook" />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": "Sell MacBook in Hyderabad",
            "description": "Sell your used MacBook Pro or MacBook Air for instant cash in Hyderabad with free doorstep pickup and best market prices",
            "brand": { "@type": "Brand", "name": "Apple" },
            "offers": {
              "@type": "AggregateOffer",
              "priceCurrency": "INR",
              "lowPrice": "25000",
              "highPrice": "180000",
              "offerCount": "350",
              "areaServed": { "@type": "City", "name": "Hyderabad" }
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.9",
              "bestRating": "5",
              "reviewCount": "1500"
            }
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.laptap.in/" },
              { "@type": "ListItem", "position": 2, "name": "Hyderabad", "item": "https://www.laptap.in/hyderabad" },
              { "@type": "ListItem", "position": 3, "name": "Sell MacBook", "item": "https://www.laptap.in/hyderabad/macbook" }
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
                  <MapPin className="h-4 w-4" />
                  Hyderabad
                </div>

                <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                  Sell Used MacBook in Hyderabad for{" "}
                  <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    Instant Cash
                  </span>
                </h1>

                <p className="mb-8 text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto">
                  Get the highest resale value for your MacBook Pro, MacBook Air, M1, M2, M3 chip models in Hyderabad. 
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
                    Sell MacBook in Hyderabad - Best Prices Guaranteed
                  </h2>
                  <div className="prose prose-slate">
                    <p className="text-muted-foreground mb-4">
                      Looking to sell your MacBook in Hyderabad? Laptap offers the most competitive prices for all MacBook models including MacBook Pro 13", 14", 16", MacBook Air M1, M2, M3, and older Intel models. Whether you own the latest M3 MacBook Pro or an older Intel model, we provide fair valuations and instant cash.
                    </p>
                    <p className="text-muted-foreground mb-4">
                      Our service covers all major localities in Hyderabad - HITEC City, Gachibowli, Madhapur, Kondapur, Kukatpally, Secunderabad, Ameerpet, Jubilee Hills, Banjara Hills, and more. We offer free same-day doorstep pickup, professional device inspection, and instant payment.
                    </p>
                    <p className="text-muted-foreground">
                      MacBooks retain excellent resale value, and Laptap ensures you get the best price in Hyderabad market. Get your instant quote online, schedule pickup at your convenience, and receive payment within hours.
                    </p>
                  </div>
                </div>
                <div>
                  <h2 className="text-3xl font-bold mb-6">
                    Why Sell MacBook with Laptap in Hyderabad?
                  </h2>
                  <div className="space-y-4">
                    <div className="p-4 bg-card rounded-lg border">
                      <h3 className="font-bold mb-2">Premium Prices for Apple</h3>
                      <p className="text-sm text-muted-foreground">
                        We offer the best prices for MacBook Pro, MacBook Air, M1/M2/M3 models in Hyderabad - up to 70% of original value.
                      </p>
                    </div>
                    <div className="p-4 bg-card rounded-lg border">
                      <h3 className="font-bold mb-2">Free Doorstep Service</h3>
                      <p className="text-sm text-muted-foreground">
                        Verified Apple experts provide free same-day pickup across all Hyderabad areas including HITEC City.
                      </p>
                    </div>
                    <div className="p-4 bg-card rounded-lg border">
                      <h3 className="font-bold mb-2">Quick & Secure Payment</h3>
                      <p className="text-sm text-muted-foreground">
                        Receive instant payment via UPI, PhonePe, GPay, or cash immediately after verification.
                      </p>
                    </div>
                    <div className="p-4 bg-card rounded-lg border">
                      <h3 className="font-bold mb-2">All MacBook Models Accepted</h3>
                      <p className="text-sm text-muted-foreground">
                        We buy all MacBooks - Pro, Air, M1, M2, M3, Intel - in any condition including damaged screens.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="py-16 md:py-24 bg-muted/30">
            <div className="container">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">MacBook Models We Buy in Hyderabad</h2>
              <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
                All MacBook models accepted - Pro, Air, M1, M2, M3, Intel
              </p>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {[
                  { name: "MacBook Pro 14\" M3 Pro/Max", series: "Latest Pro Models" },
                  { name: "MacBook Pro 16\" M3 Pro/Max", series: "Latest Pro Models" },
                  { name: "MacBook Air 15\" M3", series: "Latest Air Models" },
                  { name: "MacBook Air 13\" M2/M3", series: "Latest Air Models" },
                  { name: "MacBook Pro 13\" M1/M2", series: "Compact Pro" },
                  { name: "MacBook Pro 14\" M1 Pro/Max", series: "Previous Gen Pro" },
                  { name: "MacBook Pro 16\" M1 Pro/Max", series: "Previous Gen Pro" },
                  { name: "MacBook Air M1", series: "M1 Air Models" },
                  { name: "MacBook Pro Intel (2015-2020)", series: "Intel Models" },
                ].map((model, index) => (
                  <div key={index} className="p-6 rounded-2xl border-2 border-border bg-card hover:border-primary transition-all">
                    <h3 className="font-bold text-lg mb-2">{model.name}</h3>
                    <p className="text-sm text-muted-foreground">{model.series}</p>
                  </div>
                ))}
              </div>

              <div className="mt-12 text-center">
                <Button variant="cta" size="lg" onClick={() => navigate("/sell")}>
                  Get Started - Sell MacBook Now
                </Button>
              </div>
            </div>
          </section>

          <section className="py-16 md:py-24">
            <div className="container">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Ready to Sell Your MacBook in Hyderabad?
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Join thousands of satisfied Apple users in Hyderabad. Get instant quote, free pickup, and immediate payment.
                </p>
              </div>
              <div className="mt-12 text-center">
                <p className="text-sm text-muted-foreground">
                  Also selling other brands? Check out{" "}
                  <Link to="/hyderabad/dell" className="text-primary hover:underline">Sell Dell</Link>,{" "}
                  <Link to="/hyderabad/lenovo" className="text-primary hover:underline">Sell Lenovo</Link>, or{" "}
                  <Link to="/hyderabad/hp" className="text-primary hover:underline">Sell HP</Link> in Hyderabad
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

export default HyderabadMacBook;