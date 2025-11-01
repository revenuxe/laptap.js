import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Laptop, CheckCircle, TrendingUp, Shield, Zap, Award } from "lucide-react";

const SellLenovo = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Sell Lenovo Laptop | Best Price for ThinkPad, IdeaPad, Legion | Instant Cash | Laptap</title>
        <meta name="description" content="Sell your used Lenovo laptop for instant cash. Get the best resale value for Lenovo ThinkPad, IdeaPad, Legion, Yoga. Free doorstep pickup with instant payment. Trusted by 10,000+ Lenovo laptop sellers." />
        <meta name="keywords" content="sell Lenovo laptop, sell Lenovo ThinkPad, sell Lenovo IdeaPad, sell Lenovo Legion, Lenovo laptop resale value, best price Lenovo laptop, Lenovo laptop buyback, sell old Lenovo laptop" />
        <link rel="canonical" href="https://laptap.in/sell/lenovo" />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <section className="relative overflow-hidden bg-gradient-to-b from-background via-muted/20 to-background py-20 md:py-32">
            <div className="container">
              <div className="mx-auto max-w-4xl text-center">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                  <Award className="h-4 w-4" />
                  Top Lenovo Laptop Buyback Platform
                </div>

                <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                  Sell Your Lenovo Laptop for{" "}
                  <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    Best Value
                  </span>
                </h1>

                <p className="mb-8 text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto">
                  Get maximum resale price for your Lenovo ThinkPad, IdeaPad, Legion, or Yoga. 
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
                Why Sell Your Lenovo Laptop With Us?
              </h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {[
                  {
                    icon: TrendingUp,
                    title: "Premium Lenovo Prices",
                    description: "Best rates for ThinkPad, IdeaPad, Legion, Yoga - up to 20% higher than competitors"
                  },
                  {
                    icon: Zap,
                    title: "Fast & Easy",
                    description: "Quick online quote, instant pickup booking, immediate payment"
                  },
                  {
                    icon: Shield,
                    title: "Secure Data Erasure",
                    description: "Professional data wiping ensuring complete privacy and security"
                  },
                  {
                    icon: CheckCircle,
                    title: "Free Home Pickup",
                    description: "Convenient doorstep service across all major Indian cities"
                  },
                  {
                    icon: Award,
                    title: "Instant Payment",
                    description: "Get paid immediately via UPI, bank transfer, or cash"
                  },
                  {
                    icon: Laptop,
                    title: "All Models Welcome",
                    description: "Buy any Lenovo laptop in any condition - working or damaged"
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
                Lenovo Laptop Resale Price Guide 2025
              </h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {[
                  { name: "Lenovo ThinkPad X1 Carbon", year: "2022-2024", price: "₹50,000 - ₹1,10,000" },
                  { name: "Lenovo ThinkPad T Series", year: "2021-2024", price: "₹40,000 - ₹85,000" },
                  { name: "Lenovo ThinkPad E Series", year: "2020-2023", price: "₹25,000 - ₹55,000" },
                  { name: "Lenovo IdeaPad Slim 5", year: "2021-2024", price: "₹25,000 - ₹50,000" },
                  { name: "Lenovo IdeaPad Gaming 3", year: "2021-2023", price: "₹30,000 - ₹60,000" },
                  { name: "Lenovo Yoga 9i/7i", year: "2022-2024", price: "₹45,000 - ₹95,000" },
                  { name: "Lenovo Legion 5 Pro", year: "2021-2024", price: "₹50,000 - ₹1,20,000" },
                  { name: "Lenovo Legion 5", year: "2020-2023", price: "₹35,000 - ₹75,000" },
                  { name: "Lenovo IdeaPad 3", year: "2019-2022", price: "₹12,000 - ₹30,000" },
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
                  Get Exact Price for Your Lenovo Laptop
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

export default SellLenovo;
