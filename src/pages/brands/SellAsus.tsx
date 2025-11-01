import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Laptop, CheckCircle, TrendingUp, Shield, Zap, Award } from "lucide-react";

const SellAsus = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Sell Asus Laptop | Best Price for ROG, ZenBook, VivoBook | Instant Cash | Laptap</title>
        <meta name="description" content="Sell your used Asus laptop for instant cash. Get the best resale value for Asus ROG, ZenBook, VivoBook, TUF Gaming. Free doorstep pickup with instant payment. Trusted Asus laptop buyback service." />
        <meta name="keywords" content="sell Asus laptop, sell Asus ROG, sell Asus ZenBook, sell Asus VivoBook, Asus laptop resale value, best price Asus laptop, Asus laptop buyback, sell old Asus laptop" />
        <link rel="canonical" href="https://laptap.in/sell/asus" />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <section className="relative overflow-hidden bg-gradient-to-b from-background via-muted/20 to-background py-20 md:py-32">
            <div className="container">
              <div className="mx-auto max-w-4xl text-center">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                  <Award className="h-4 w-4" />
                  Trusted Asus Laptop Buyback Service
                </div>

                <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                  Sell Your Asus Laptop for{" "}
                  <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    Top Cash
                  </span>
                </h1>

                <p className="mb-8 text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto">
                  Get maximum value for your Asus ROG, ZenBook, VivoBook, or TUF Gaming laptop. 
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
                Why Sell Asus Laptop With Us?
              </h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {[
                  {
                    icon: TrendingUp,
                    title: "Best Asus Laptop Prices",
                    description: "Premium rates for ROG, ZenBook, VivoBook, TUF - higher than market value"
                  },
                  {
                    icon: Zap,
                    title: "Quick & Simple",
                    description: "Instant quote online, free pickup, immediate payment on verification"
                  },
                  {
                    icon: Shield,
                    title: "Data Security",
                    description: "Professional data wiping ensuring complete privacy protection"
                  },
                  {
                    icon: CheckCircle,
                    title: "Free Doorstep Pickup",
                    description: "Convenient home service available across all major cities"
                  },
                  {
                    icon: Award,
                    title: "Instant Payment",
                    description: "Get paid immediately via UPI, PhonePe, GPay, or cash"
                  },
                  {
                    icon: Laptop,
                    title: "All Models Accepted",
                    description: "Buy any Asus laptop - working, damaged, or non-functional"
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
                Asus Laptop Resale Price Guide 2025
              </h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {[
                  { name: "Asus ROG Zephyrus", year: "2022-2024", price: "₹60,000 - ₹1,50,000" },
                  { name: "Asus ROG Strix", year: "2021-2024", price: "₹50,000 - ₹1,20,000" },
                  { name: "Asus TUF Gaming", year: "2021-2023", price: "₹35,000 - ₹75,000" },
                  { name: "Asus ZenBook 14/15", year: "2022-2024", price: "₹40,000 - ₹85,000" },
                  { name: "Asus ZenBook Flip", year: "2021-2023", price: "₹35,000 - ₹70,000" },
                  { name: "Asus VivoBook S15", year: "2021-2024", price: "₹25,000 - ₹50,000" },
                  { name: "Asus VivoBook 15", year: "2020-2023", price: "₹18,000 - ₹40,000" },
                  { name: "Asus ProArt StudioBook", year: "2021-2024", price: "₹55,000 - ₹1,30,000" },
                  { name: "Asus X Series", year: "2019-2022", price: "₹12,000 - ₹28,000" },
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
                  Get Exact Price for Your Asus Laptop
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

export default SellAsus;
