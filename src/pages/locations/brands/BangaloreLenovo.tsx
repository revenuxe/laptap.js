import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Laptop, MapPin } from "lucide-react";

const BangaloreLenovo = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Sell Used Lenovo Laptop in Bangalore | Best Price for ThinkPad, IdeaPad, Legion | Instant Cash | Laptap</title>
        <meta name="description" content="Sell your used Lenovo laptop in Bangalore for instant cash. Get the best resale value for Lenovo ThinkPad, IdeaPad, Legion, Yoga models. Free same-day doorstep pickup across all Bangalore areas." />
        <meta name="keywords" content="sell Lenovo laptop Bangalore, sell ThinkPad Bangalore, sell IdeaPad Bangalore, Lenovo laptop resale Bangalore, best price Lenovo laptop Bangalore, sell used Lenovo laptop Bangalore" />
        <link rel="canonical" href="https://www.laptap.in/bangalore/lenovo" />
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
                  Sell Used Lenovo Laptop in Bangalore for{" "}
                  <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    Best Price
                  </span>
                </h1>

                <p className="mb-8 text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto">
                  Get the highest resale value for your Lenovo ThinkPad, IdeaPad, Legion, Yoga laptops in Bangalore. 
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
                    Sell Lenovo Laptop in Bangalore - Maximum Value Guaranteed
                  </h2>
                  <div className="prose prose-slate">
                    <p className="text-muted-foreground mb-4">
                      Planning to sell your Lenovo laptop in Bangalore? Laptap offers the best prices for all Lenovo models including ThinkPad (T-series, X-series, P-series), IdeaPad, Yoga 2-in-1 convertibles, and Legion gaming laptops. Whether you have a business-grade ThinkPad with Intel Core or AMD Ryzen processor, or a gaming-focused Legion with RTX graphics, we ensure fair market pricing.
                    </p>
                    <p className="text-muted-foreground mb-4">
                      We serve all major areas across Bangalore - Koramangala, Indiranagar, Whitefield, Electronic City, HSR Layout, Marathahalli, BTM Layout, Bellandur, and more. Our service includes free same-day doorstep pickup, professional device assessment, secure data deletion, and immediate payment via UPI, bank transfer, or cash.
                    </p>
                    <p className="text-muted-foreground">
                      With thousands of happy customers in Bangalore, Laptap is your trusted partner for selling Lenovo laptops. Get instant online valuation, schedule convenient pickup, and receive payment the same day. No hassle, no hidden costs - just honest service.
                    </p>
                  </div>
                </div>
                <div>
                  <h2 className="text-3xl font-bold mb-6">
                    Why Choose Laptap for Lenovo Laptop Sale in Bangalore?
                  </h2>
                  <div className="space-y-4">
                    <div className="p-4 bg-card rounded-lg border">
                      <h3 className="font-bold mb-2">Premium Pricing for ThinkPad</h3>
                      <p className="text-sm text-muted-foreground">
                        Lenovo ThinkPad laptops retain excellent resale value. We offer the best market rates in Bangalore - up to 20% more than other buyers.
                      </p>
                    </div>
                    <div className="p-4 bg-card rounded-lg border">
                      <h3 className="font-bold mb-2">Free Pickup Across Bangalore</h3>
                      <p className="text-sm text-muted-foreground">
                        Our certified technicians provide free doorstep pickup service across all Bangalore localities. Book online and we arrive within 2-4 hours.
                      </p>
                    </div>
                    <div className="p-4 bg-card rounded-lg border">
                      <h3 className="font-bold mb-2">Instant & Secure Payment</h3>
                      <p className="text-sm text-muted-foreground">
                        Get paid immediately via UPI or cash after device verification. We ensure complete data wiping for your privacy and security.
                      </p>
                    </div>
                    <div className="p-4 bg-card rounded-lg border">
                      <h3 className="font-bold mb-2">All Lenovo Series Accepted</h3>
                      <p className="text-sm text-muted-foreground">
                        We buy ThinkPad, IdeaPad, Yoga, Legion, ThinkBook - all Lenovo models in any condition including damaged or faulty devices.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Lenovo Models Section */}
          <section className="py-16 md:py-24 bg-muted/30">
            <div className="container">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Lenovo Laptop Models We Buy in Bangalore</h2>
              <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
                All Lenovo laptop series accepted - ThinkPad, IdeaPad, Yoga, Legion, ThinkBook
              </p>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {[
                  { name: "ThinkPad X1 Carbon", series: "Premium Business" },
                  { name: "ThinkPad T14, T15, T16", series: "Business Series" },
                  { name: "ThinkPad E14, E15", series: "Essential Business" },
                  { name: "ThinkPad X1 Yoga", series: "Premium 2-in-1" },
                  { name: "ThinkPad P1, P15, P16", series: "Mobile Workstations" },
                  { name: "IdeaPad Slim 3, 5, 7", series: "Consumer Laptops" },
                  { name: "Yoga 7i, 9i", series: "Premium Convertibles" },
                  { name: "Legion 5, 5 Pro, 7", series: "Gaming Laptops" },
                  { name: "ThinkBook 14, 15", series: "Small Business" },
                ].map((model, index) => (
                  <div key={index} className="p-6 rounded-2xl border-2 border-border bg-card hover:border-primary transition-all">
                    <h3 className="font-bold text-lg mb-2">{model.name}</h3>
                    <p className="text-sm text-muted-foreground">{model.series}</p>
                  </div>
                ))}
              </div>

              <div className="mt-12 text-center">
                <Button variant="cta" size="lg" onClick={() => navigate("/sell")}>
                  Get Started - Sell Lenovo Laptop Now
                </Button>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-16 md:py-24">
            <div className="container">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Sell Your Lenovo Laptop in Bangalore Today
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Join thousands of satisfied Bangalore customers. Get instant quote, free pickup, and immediate payment.
                </p>
              </div>
              <div className="mt-12 text-center">
                <p className="text-sm text-muted-foreground">
                  Also interested in:{" "}
                  <Link to="/bangalore/macbook" className="text-primary hover:underline">Sell MacBook</Link>,{" "}
                  <Link to="/bangalore/dell" className="text-primary hover:underline">Sell Dell</Link>, or{" "}
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

export default BangaloreLenovo;
