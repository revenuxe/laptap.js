import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Laptop, CheckCircle, TrendingUp, Shield, Zap, Award } from "lucide-react";

const SellDell = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Sell Dell Laptop | Best Price for Dell XPS, Inspiron, Latitude | Instant Cash | Laptap</title>
        <meta name="description" content="Sell your used Dell laptop for instant cash. Get the best resale value for Dell XPS, Inspiron, Latitude, Vostro, Alienware. Free doorstep pickup with instant payment. Trusted by 10,000+ Dell laptop sellers." />
        <meta name="keywords" content="sell Dell laptop, sell Dell XPS, sell Dell Inspiron, sell Dell Latitude, Dell laptop resale value, best price Dell laptop, Dell laptop buyback, sell old Dell laptop, instant cash Dell laptop" />
        <link rel="canonical" href="https://laptap.in/sell/dell" />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <section className="relative overflow-hidden bg-gradient-to-b from-background via-muted/20 to-background py-20 md:py-32">
            <div className="container">
              <div className="mx-auto max-w-4xl text-center">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                  <Award className="h-4 w-4" />
                  #1 Dell Laptop Buyback Platform
                </div>

                <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                  Sell Your Dell Laptop for{" "}
                  <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    Best Price
                  </span>
                </h1>

                <p className="mb-8 text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto">
                  Get maximum value for your Dell XPS, Inspiron, Latitude, or any Dell laptop. 
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
                Why Sell Your Dell Laptop With Us?
              </h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {[
                  {
                    icon: TrendingUp,
                    title: "Highest Dell Laptop Prices",
                    description: "Get up to 20% more than market rates for Dell XPS, Inspiron, Latitude, and all models"
                  },
                  {
                    icon: Zap,
                    title: "Same Day Service",
                    description: "Quick online quote, instant pickup scheduling, and immediate payment"
                  },
                  {
                    icon: Shield,
                    title: "Secure Data Erasure",
                    description: "Professional data wiping ensuring complete privacy and security"
                  },
                  {
                    icon: CheckCircle,
                    title: "Free Home Pickup",
                    description: "Convenient doorstep pickup service across all major cities in India"
                  },
                  {
                    icon: Award,
                    title: "Instant Payment",
                    description: "Get paid immediately via UPI, bank transfer, or cash on verification"
                  },
                  {
                    icon: Laptop,
                    title: "All Models Accepted",
                    description: "XPS, Inspiron, Latitude, Vostro, Alienware - any condition, any age"
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
                Dell Laptop Resale Price Guide 2025
              </h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {[
                  { name: "Dell XPS 15/17", year: "2022-2024", price: "₹45,000 - ₹1,20,000" },
                  { name: "Dell XPS 13", year: "2021-2024", price: "₹35,000 - ₹85,000" },
                  { name: "Dell Inspiron 15 7000", year: "2022-2024", price: "₹30,000 - ₹65,000" },
                  { name: "Dell Inspiron 14 5000", year: "2021-2023", price: "₹20,000 - ₹45,000" },
                  { name: "Dell Latitude 7000 Series", year: "2021-2024", price: "₹35,000 - ₹80,000" },
                  { name: "Dell Latitude 5000 Series", year: "2020-2023", price: "₹25,000 - ₹55,000" },
                  { name: "Dell Vostro 15", year: "2020-2023", price: "₹18,000 - ₹40,000" },
                  { name: "Dell Alienware", year: "2020-2024", price: "₹50,000 - ₹1,50,000" },
                  { name: "Dell Inspiron 3000 Series", year: "2019-2022", price: "₹12,000 - ₹30,000" },
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
                  Get Exact Price for Your Dell Laptop
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

export default SellDell;
