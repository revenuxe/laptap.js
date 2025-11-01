import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Laptop, CheckCircle, TrendingUp, Shield, Zap, Award } from "lucide-react";

const SellAcer = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Sell Acer Laptop | Best Price for Aspire, Swift, Predator | Instant Cash | Laptap</title>
        <meta name="description" content="Sell your used Acer laptop for instant cash. Get the best resale value for Acer Aspire, Swift, Predator, Nitro. Free doorstep pickup with instant payment. Trusted Acer laptop buyback service." />
        <meta name="keywords" content="sell Acer laptop, sell Acer Aspire, sell Acer Swift, sell Acer Predator, Acer laptop resale value, best price Acer laptop, Acer laptop buyback, sell old Acer laptop" />
        <link rel="canonical" href="https://laptap.in/sell/acer" />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <section className="relative overflow-hidden bg-gradient-to-b from-background via-muted/20 to-background py-20 md:py-32">
            <div className="container">
              <div className="mx-auto max-w-4xl text-center">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                  <Award className="h-4 w-4" />
                  Reliable Acer Laptop Buyback Platform
                </div>

                <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                  Sell Your Acer Laptop for{" "}
                  <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    Best Price
                  </span>
                </h1>

                <p className="mb-8 text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto">
                  Get maximum resale value for your Acer Aspire, Swift, Predator, or Nitro laptop. 
                  Free home pickup with instant payment via UPI or cash.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                  <Button variant="cta" size="lg" onClick={() => navigate("/sell/laptop")}>
                    Get Instant Quote
                  </Button>
                  <Button variant="outline" size="lg" onClick={() => navigate("/contact")}>
                    Contact Us
                  </Button>
                </div>
              </div>
            </div>
          </section>

          <section className="py-16 md:py-24">
            <div className="container">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                Why Choose Us for Acer Laptop Resale?
              </h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {[
                  {
                    icon: TrendingUp,
                    title: "Top Acer Laptop Prices",
                    description: "Best rates for Aspire, Swift, Predator, Nitro - up to 20% higher"
                  },
                  {
                    icon: Zap,
                    title: "Fast Process",
                    description: "Quick online quote, instant pickup scheduling, immediate payment"
                  },
                  {
                    icon: Shield,
                    title: "Secure Data Wiping",
                    description: "Professional data erasure ensuring complete privacy and security"
                  },
                  {
                    icon: CheckCircle,
                    title: "Free Home Pickup",
                    description: "Convenient doorstep service available across all major cities"
                  },
                  {
                    icon: Award,
                    title: "Instant Payment",
                    description: "Get paid immediately via UPI, bank transfer, or cash"
                  },
                  {
                    icon: Laptop,
                    title: "All Models Welcome",
                    description: "Buy any Acer laptop in any condition - working or damaged"
                  }
                ].map((feature, index) => (
                  <div key={index} className="p-6 rounded-2xl bg-card border border-border hover:border-primary transition-all">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mb-4">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-bold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="py-16 md:py-24 bg-muted/30">
            <div className="container">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                Acer Laptop Resale Price Guide 2025
              </h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {[
                  { name: "Acer Predator Helios", year: "2022-2024", price: "₹50,000 - ₹1,30,000" },
                  { name: "Acer Nitro 5", year: "2021-2024", price: "₹35,000 - ₹70,000" },
                  { name: "Acer Swift 3/5", year: "2022-2024", price: "₹30,000 - ₹60,000" },
                  { name: "Acer Swift X", year: "2021-2023", price: "₹35,000 - ₹65,000" },
                  { name: "Acer Aspire 7", year: "2021-2023", price: "₹25,000 - ₹50,000" },
                  { name: "Acer Aspire 5", year: "2020-2023", price: "₹18,000 - ₹40,000" },
                  { name: "Acer TravelMate", year: "2020-2023", price: "₹20,000 - ₹45,000" },
                  { name: "Acer ConceptD", year: "2021-2024", price: "₹45,000 - ₹1,00,000" },
                  { name: "Acer Aspire 3", year: "2019-2022", price: "₹12,000 - ₹28,000" },
                ].map((model, index) => (
                  <div key={index} className="p-6 rounded-2xl bg-card border border-border">
                    <h3 className="font-bold text-lg mb-2">{model.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">Year: {model.year}</p>
                    <p className="text-primary font-semibold text-lg">{model.price}</p>
                  </div>
                ))}
              </div>

              <div className="text-center mt-12">
                <Button variant="cta" size="lg" onClick={() => navigate("/sell/laptop")}>
                  Get Exact Price for Your Acer Laptop
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

export default SellAcer;
