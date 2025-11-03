import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Laptop, CheckCircle, TrendingUp, Shield, Zap } from "lucide-react";

const MacBookPro = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Sell MacBook Pro Online - Get Instant Cash for Your MacBook | Best Price Guaranteed | Laptap</title>
        <meta name="description" content="Sell your used MacBook Pro for instant cash. Get the best resale value for MacBook Pro 13-inch, 14-inch, 15-inch, 16-inch models (M1, M2, M3, Intel). Free doorstep pickup across India. Instant payment via UPI. Trusted by 10,000+ MacBook sellers. Sell MacBook Pro 2024, 2023, 2022, 2021, 2020 models." />
        <meta name="keywords" content="sell MacBook Pro, sell MacBook Pro online, MacBook Pro resale value, sell used MacBook Pro, sell old MacBook Pro, MacBook Pro buyback, best price MacBook Pro, sell MacBook Pro 16 inch, sell MacBook Pro 14 inch, sell MacBook Pro 13 inch, sell MacBook Pro M3, sell MacBook Pro M2, sell MacBook Pro M1, sell MacBook Pro 2024, sell MacBook Pro 2023, sell MacBook Pro India, instant cash MacBook Pro" />
        <link rel="canonical" href="https://www.laptap.in/models/macbook-pro" />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          {/* Hero Section */}
          <section className="relative overflow-hidden bg-gradient-to-b from-background via-muted/20 to-background py-20 md:py-32">
            <div className="container">
              <div className="mx-auto max-w-4xl text-center">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                  <Laptop className="h-4 w-4" />
                  MacBook Pro
                </div>

                <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                  Sell Your MacBook Pro for{" "}
                  <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    Instant Cash
                  </span>
                </h1>

                <p className="mb-8 text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto">
                  Get the best resale value for your MacBook Pro. All models accepted - M3, M2, M1, Intel. 
                  Free doorstep pickup with instant payment.
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

          {/* Models We Accept */}
          <section className="py-16 md:py-24">
            <div className="container">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                MacBook Pro Models We Buy
              </h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {[
                  { name: "MacBook Pro 16-inch", year: "2024 (M3 Max/Pro)", price: "₹80,000 - ₹2,50,000" },
                  { name: "MacBook Pro 14-inch", year: "2024 (M3 Max/Pro)", price: "₹70,000 - ₹1,80,000" },
                  { name: "MacBook Pro 16-inch", year: "2023 (M2 Max/Pro)", price: "₹75,000 - ₹2,00,000" },
                  { name: "MacBook Pro 14-inch", year: "2023 (M2 Max/Pro)", price: "₹65,000 - ₹1,50,000" },
                  { name: "MacBook Pro 13-inch", year: "2022 (M2)", price: "₹55,000 - ₹95,000" },
                  { name: "MacBook Pro 16-inch", year: "2021 (M1 Max/Pro)", price: "₹65,000 - ₹1,50,000" },
                  { name: "MacBook Pro 14-inch", year: "2021 (M1 Max/Pro)", price: "₹55,000 - ₹1,20,000" },
                  { name: "MacBook Pro 13-inch", year: "2020 (M1)", price: "₹45,000 - ₹75,000" },
                  { name: "MacBook Pro 16-inch", year: "2019 (Intel)", price: "₹40,000 - ₹80,000" },
                ].map((model, index) => (
                  <div key={index} className="p-6 rounded-2xl border-2 border-border bg-card hover:border-primary transition-all">
                    <h3 className="font-bold text-lg mb-2">{model.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{model.year}</p>
                    <p className="text-primary font-semibold">{model.price}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Why Sell MacBook Pro With Us */}
          <section className="py-16 md:py-24 bg-muted/30">
            <div className="container">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                Why Sell Your MacBook Pro With Us?
              </h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                {[
                  {
                    icon: TrendingUp,
                    title: "Best Market Prices",
                    description: "We offer the highest resale value for MacBook Pro models"
                  },
                  {
                    icon: Zap,
                    title: "Instant Payment",
                    description: "Get paid immediately via UPI, bank transfer, or cash"
                  },
                  {
                    icon: Shield,
                    title: "100% Secure",
                    description: "Complete data wiping and secure transaction process"
                  },
                  {
                    icon: CheckCircle,
                    title: "Free Pickup",
                    description: "Doorstep pickup across all major cities in India"
                  }
                ].map((feature, index) => (
                  <div key={index} className="p-6 rounded-2xl bg-card text-center">
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

          {/* Process */}
          <section className="py-16 md:py-24">
            <div className="container">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                How to Sell Your MacBook Pro
              </h2>

              <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
                {[
                  { step: "1", title: "Get Quote", desc: "Select MacBook Pro model and get instant price" },
                  { step: "2", title: "Schedule Pickup", desc: "Choose convenient time for free doorstep pickup" },
                  { step: "3", title: "Device Check", desc: "Our expert verifies your MacBook Pro condition" },
                  { step: "4", title: "Get Paid", desc: "Receive instant payment via your preferred method" }
                ].map((item, index) => (
                  <div key={index} className="text-center">
                    <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-2xl font-bold">
                      {item.step}
                    </div>
                    <h3 className="font-bold mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                ))}
              </div>

              <div className="text-center mt-12">
                <Button variant="cta" size="lg" onClick={() => navigate("/sell/laptop")}>
                  Start Selling Now
                </Button>
              </div>

              <div className="mt-16 p-8 bg-muted/30 rounded-2xl">
                <h3 className="text-2xl font-bold mb-4 text-center">Explore More Models</h3>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Link to="/models/imac" className="text-primary hover:underline font-medium">
                    Sell iMac Desktop
                  </Link>
                  <span className="text-muted-foreground">•</span>
                  <Link to="/models/dell-xps" className="text-primary hover:underline font-medium">
                    Sell Dell XPS
                  </Link>
                  <span className="text-muted-foreground">•</span>
                  <Link to="/models/lenovo-thinkpad" className="text-primary hover:underline font-medium">
                    Sell Lenovo ThinkPad
                  </Link>
                  <span className="text-muted-foreground">•</span>
                  <Link to="/blog/sell-used-laptop-bangalore" className="text-primary hover:underline font-medium">
                    Selling Guide
                  </Link>
                  <span className="text-muted-foreground">•</span>
                  <Link to="/contact" className="text-primary hover:underline font-medium">
                    Contact Us
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="py-16 md:py-24 bg-muted/30">
            <div className="container max-w-4xl">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                Frequently Asked Questions
              </h2>

              <div className="space-y-6">
                {[
                  {
                    q: "What is the resale value of MacBook Pro?",
                    a: "MacBook Pro resale value depends on the model, year, processor (M3/M2/M1/Intel), screen size, RAM, storage, and condition. MacBook Pro M3 models fetch ₹70,000-₹2,50,000, while older Intel models range from ₹25,000-₹80,000."
                  },
                  {
                    q: "Do you buy MacBook Pro with M1, M2, or M3 chips?",
                    a: "Yes! We buy all MacBook Pro models including the latest M3, M2, M1, and older Intel-based models. Apple Silicon MacBooks (M-series) typically have higher resale values."
                  },
                  {
                    q: "Can I sell a damaged MacBook Pro?",
                    a: "Yes, we accept MacBook Pro in any condition - working, damaged, broken screen, battery issues, water damage, or non-functional. The price will be adjusted based on the actual condition."
                  },
                  {
                    q: "How long does the MacBook Pro selling process take?",
                    a: "The entire process takes 24-48 hours. Get instant quote online, schedule pickup, our technician visits your location, verifies the device, and you receive payment immediately."
                  },
                  {
                    q: "Is my MacBook Pro data safe?",
                    a: "Absolutely! We recommend backing up and erasing your data before selling. Our team also performs professional data wiping using industry-standard methods to ensure complete data security."
                  }
                ].map((faq, index) => (
                  <div key={index} className="p-6 rounded-2xl bg-card border border-border">
                    <h3 className="font-bold mb-2">{faq.q}</h3>
                    <p className="text-sm text-muted-foreground">{faq.a}</p>
                  </div>
                ))}
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

export default MacBookPro;
