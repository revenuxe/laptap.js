import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Laptop, CheckCircle, TrendingUp, Shield, Zap, Award } from "lucide-react";

const SellHP = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Sell HP Laptop | Best Price for HP Pavilion, Envy, EliteBook | Instant Cash | Laptap</title>
        <meta name="description" content="Sell your used HP laptop for instant cash. Get the best resale value for HP Pavilion, Envy, EliteBook, ProBook, Omen. Free doorstep pickup with instant payment. Trusted by 10,000+ HP laptop sellers." />
        <meta name="keywords" content="sell HP laptop, sell HP Pavilion, sell HP Envy, sell HP EliteBook, HP laptop resale value, best price HP laptop, HP laptop buyback, sell old HP laptop, instant cash HP laptop" />
        <link rel="canonical" href="https://laptap.in/sell/hp" />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <section className="relative overflow-hidden bg-gradient-to-b from-background via-muted/20 to-background py-20 md:py-32">
            <div className="container">
              <div className="mx-auto max-w-4xl text-center">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                  <Award className="h-4 w-4" />
                  Trusted HP Laptop Buyback Service
                </div>

                <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                  Sell Your HP Laptop for{" "}
                  <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    Maximum Cash
                  </span>
                </h1>

                <p className="mb-8 text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto">
                  Get top resale value for your HP Pavilion, Envy, EliteBook, or any HP laptop model. 
                  Free doorstep pickup with instant payment across India.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                  <Button variant="cta" size="lg" onClick={() => navigate("/sell/laptop")}>
                    Get Instant Quote
                  </Button>
                  <Button variant="outline" size="lg" onClick={() => navigate("/contact")}>
                    Talk to Expert
                  </Button>
                </div>
              </div>
            </div>
          </section>

          <section className="py-16 md:py-24">
            <div className="container">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                Why Choose Us for HP Laptop Resale?
              </h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {[
                  {
                    icon: TrendingUp,
                    title: "Best HP Laptop Prices",
                    description: "Premium rates for HP Pavilion, Envy, EliteBook, ProBook, and Omen series"
                  },
                  {
                    icon: Zap,
                    title: "Quick Process",
                    description: "Instant online quote, free pickup scheduling, immediate payment"
                  },
                  {
                    icon: Shield,
                    title: "Data Security Guaranteed",
                    description: "Professional data wiping ensuring complete privacy protection"
                  },
                  {
                    icon: CheckCircle,
                    title: "Free Doorstep Service",
                    description: "Convenient home pickup service available across all major cities"
                  },
                  {
                    icon: Award,
                    title: "Instant Payment",
                    description: "Get paid immediately via UPI, PhonePe, GPay, or cash"
                  },
                  {
                    icon: Laptop,
                    title: "All HP Models Accepted",
                    description: "Buy any HP laptop - working, damaged, or non-functional"
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
                HP Laptop Resale Price Guide 2025
              </h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {[
                  { name: "HP Spectre x360", year: "2022-2024", price: "₹40,000 - ₹95,000" },
                  { name: "HP Envy 15/17", year: "2021-2024", price: "₹35,000 - ₹75,000" },
                  { name: "HP Envy 13", year: "2021-2023", price: "₹30,000 - ₹60,000" },
                  { name: "HP Pavilion 15", year: "2021-2024", price: "₹22,000 - ₹50,000" },
                  { name: "HP Pavilion Gaming", year: "2020-2023", price: "₹28,000 - ₹65,000" },
                  { name: "HP EliteBook 840/850", year: "2021-2024", price: "₹35,000 - ₹80,000" },
                  { name: "HP ProBook 450", year: "2020-2023", price: "₹20,000 - ₹45,000" },
                  { name: "HP Omen Gaming", year: "2021-2024", price: "₹45,000 - ₹1,20,000" },
                  { name: "HP 14/15 Series", year: "2019-2022", price: "₹12,000 - ₹30,000" },
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
                  Get Exact Price for Your HP Laptop
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

export default SellHP;
