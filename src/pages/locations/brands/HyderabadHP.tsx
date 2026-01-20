import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { MapPin } from "lucide-react";

const HyderabadHP = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Sell Used HP Laptop in Hyderabad | Best Price for HP Pavilion, Spectre, EliteBook | Instant Cash | Laptap</title>
        <meta name="description" content="Sell your used HP laptop in Hyderabad for instant cash. Get the best resale value for HP Pavilion, Spectre, EliteBook, Envy, ProBook models. Free same-day doorstep pickup across all Hyderabad areas." />
        <meta name="keywords" content="sell HP laptop Hyderabad, sell HP Pavilion Hyderabad, sell HP Spectre Hyderabad, HP laptop resale Hyderabad, best price HP laptop Hyderabad, sell used HP laptop Hyderabad, HP laptop buyer Hyderabad, sell old HP laptop Hyderabad" />
        <link rel="canonical" href="https://www.laptap.in/hyderabad/hp" />
        <link rel="alternate" hrefLang="en-IN" href="https://www.laptap.in/hyderabad/hp" />
        <link rel="alternate" hrefLang="en" href="https://www.laptap.in/hyderabad/hp" />
        <link rel="alternate" hrefLang="x-default" href="https://www.laptap.in/hyderabad/hp" />
        <meta property="og:title" content="Sell HP Laptop in Hyderabad | Best Price | Laptap" />
        <meta property="og:description" content="Get instant cash for your HP laptop in Hyderabad. Free same-day pickup across HITEC City, Gachibowli, Madhapur." />
        <meta property="og:url" content="https://www.laptap.in/hyderabad/hp" />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": "Sell HP Laptop in Hyderabad",
            "description": "Sell your used HP laptop for instant cash in Hyderabad with free doorstep pickup and best market prices",
            "brand": { "@type": "Brand", "name": "HP" },
            "offers": {
              "@type": "AggregateOffer",
              "priceCurrency": "INR",
              "lowPrice": "5000",
              "highPrice": "120000",
              "offerCount": "400",
              "areaServed": { "@type": "City", "name": "Hyderabad" }
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "bestRating": "5",
              "reviewCount": "980"
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
              { "@type": "ListItem", "position": 3, "name": "Sell HP Laptop", "item": "https://www.laptap.in/hyderabad/hp" }
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
                  Sell Used HP Laptop in Hyderabad for{" "}
                  <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    Instant Cash
                  </span>
                </h1>

                <p className="mb-8 text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto">
                  Get the highest resale value for your HP Pavilion, Spectre, EliteBook, Envy laptops in Hyderabad. 
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
                    Sell HP Laptop in Hyderabad - Best Prices Guaranteed
                  </h2>
                  <div className="prose prose-slate">
                    <p className="text-muted-foreground mb-4">
                      Looking to sell your HP laptop in Hyderabad? Laptap offers the most competitive prices for all HP models including Pavilion, Spectre x360, EliteBook, Envy, ProBook, and OMEN gaming laptops. Whether you own a premium HP Spectre or an everyday Pavilion model, we provide fair valuations and instant cash.
                    </p>
                    <p className="text-muted-foreground mb-4">
                      Our service covers all major localities in Hyderabad - HITEC City, Gachibowli, Madhapur, Kondapur, Kukatpally, Secunderabad, Ameerpet, Jubilee Hills, Banjara Hills, and more. We offer free same-day doorstep pickup, professional device inspection, and instant payment.
                    </p>
                    <p className="text-muted-foreground">
                      Trusted by thousands of Hyderabad residents, Laptap makes selling HP laptops quick and hassle-free. Get your instant quote online, schedule pickup at your convenience, and receive payment within hours.
                    </p>
                  </div>
                </div>
                <div>
                  <h2 className="text-3xl font-bold mb-6">
                    Why Sell HP Laptop with Laptap in Hyderabad?
                  </h2>
                  <div className="space-y-4">
                    <div className="p-4 bg-card rounded-lg border">
                      <h3 className="font-bold mb-2">Top Market Rates</h3>
                      <p className="text-sm text-muted-foreground">
                        We offer the best prices for HP Pavilion, Spectre, EliteBook models in Hyderabad - typically 15-20% higher than competitors.
                      </p>
                    </div>
                    <div className="p-4 bg-card rounded-lg border">
                      <h3 className="font-bold mb-2">Free Doorstep Service</h3>
                      <p className="text-sm text-muted-foreground">
                        Verified technicians provide free same-day pickup across all Hyderabad areas including HITEC City and Gachibowli.
                      </p>
                    </div>
                    <div className="p-4 bg-card rounded-lg border">
                      <h3 className="font-bold mb-2">Quick & Secure Payment</h3>
                      <p className="text-sm text-muted-foreground">
                        Receive instant payment via UPI, PhonePe, GPay, or cash immediately after verification.
                      </p>
                    </div>
                    <div className="p-4 bg-card rounded-lg border">
                      <h3 className="font-bold mb-2">All HP Models Accepted</h3>
                      <p className="text-sm text-muted-foreground">
                        We buy all HP laptops - Pavilion, Spectre, EliteBook, Envy, ProBook, OMEN - in any condition.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="py-16 md:py-24 bg-muted/30">
            <div className="container">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">HP Laptop Models We Buy in Hyderabad</h2>
              <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
                All HP laptop series accepted - Pavilion, Spectre, EliteBook, Envy, ProBook, OMEN
              </p>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {[
                  { name: "HP Spectre x360 13, 14, 16", series: "Premium Convertibles" },
                  { name: "HP Pavilion 14, 15, 16", series: "All-Purpose Laptops" },
                  { name: "HP EliteBook 830, 840, 850", series: "Business Laptops" },
                  { name: "HP Envy 13, 14, 15, 17", series: "Premium Entertainment" },
                  { name: "HP OMEN 15, 16, 17", series: "Gaming Laptops" },
                  { name: "HP ProBook 440, 450, 640", series: "Business Essential" },
                  { name: "HP Victus 15, 16", series: "Budget Gaming" },
                  { name: "HP Chromebook", series: "Chrome OS Laptops" },
                  { name: "HP ZBook", series: "Mobile Workstations" },
                ].map((model, index) => (
                  <div key={index} className="p-6 rounded-2xl border-2 border-border bg-card hover:border-primary transition-all">
                    <h3 className="font-bold text-lg mb-2">{model.name}</h3>
                    <p className="text-sm text-muted-foreground">{model.series}</p>
                  </div>
                ))}
              </div>

              <div className="mt-12 text-center">
                <Button variant="cta" size="lg" onClick={() => navigate("/sell")}>
                  Get Started - Sell HP Laptop Now
                </Button>
              </div>
            </div>
          </section>

          <section className="py-16 md:py-24">
            <div className="container">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Ready to Sell Your HP Laptop in Hyderabad?
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Join thousands of satisfied customers in Hyderabad. Get instant quote, free pickup, and immediate payment.
                </p>
              </div>
              <div className="mt-12 text-center">
                <p className="text-sm text-muted-foreground">
                  Also selling other brands? Check out{" "}
                  <Link to="/hyderabad/macbook" className="text-primary hover:underline">Sell MacBook</Link>,{" "}
                  <Link to="/hyderabad/lenovo" className="text-primary hover:underline">Sell Lenovo</Link>, or{" "}
                  <Link to="/hyderabad/dell" className="text-primary hover:underline">Sell Dell</Link> in Hyderabad
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

export default HyderabadHP;