import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Laptop, CheckCircle, TrendingUp, Shield, Zap, Award } from "lucide-react";

const SellMacBook = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Sell MacBook | Get Best Price for MacBook Pro, Air | Instant Cash Payment | Laptap</title>
        <meta name="description" content="Sell your used MacBook for instant cash. Get the best resale value for MacBook Pro, MacBook Air (M1, M2, M3, Intel). Free doorstep pickup across India with instant payment. Trusted by 10,000+ MacBook sellers." />
        <meta name="keywords" content="sell MacBook, sell MacBook Pro, sell MacBook Air, MacBook resale value, best price MacBook, MacBook buyback, sell old MacBook, MacBook trade in, instant cash MacBook, doorstep MacBook pickup" />
        <link rel="canonical" href="https://laptap.in/sell/macbook" />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          {/* Hero Section */}
          <section className="relative overflow-hidden bg-gradient-to-b from-background via-muted/20 to-background py-20 md:py-32">
            <div className="container">
              <div className="mx-auto max-w-4xl text-center">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                  <Award className="h-4 w-4" />
                  India's #1 MacBook Buyback Platform
                </div>

                <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                  Sell Your MacBook for{" "}
                  <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    Maximum Value
                  </span>
                </h1>

                <p className="mb-8 text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto">
                  Get the highest resale price for your MacBook Pro, MacBook Air - any model, any condition. 
                  Free doorstep pickup with instant payment via UPI or cash.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                  <Button variant="cta" size="lg" onClick={() => navigate("/sell/laptop")}>
                    Get Instant Quote
                  </Button>
                  <Button variant="outline" size="lg" onClick={() => navigate("/contact")}>
                    Talk to Expert
                  </Button>
                </div>

                <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-primary" />
                    <span>100% Data Security</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    <span>Best Market Price</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-primary" />
                    <span>Instant Payment</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Why Sell MacBook With Us */}
          <section className="py-16 md:py-24">
            <div className="container">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
                Why Choose Us to Sell Your MacBook?
              </h2>
              <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
                India's most trusted platform for selling MacBook with guaranteed best prices and hassle-free experience
              </p>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {[
                  {
                    icon: TrendingUp,
                    title: "Highest Resale Value",
                    description: "We offer 15-20% more than competitors for all MacBook models - Pro, Air, M1, M2, M3, Intel"
                  },
                  {
                    icon: Zap,
                    title: "Quick & Easy Process",
                    description: "Get instant online quote, book free pickup, and receive payment within hours"
                  },
                  {
                    icon: Shield,
                    title: "100% Data Security",
                    description: "Professional data wiping certified by Apple standards. Your privacy is guaranteed"
                  },
                  {
                    icon: CheckCircle,
                    title: "Free Doorstep Pickup",
                    description: "Convenient pickup service across India at your preferred time and location"
                  },
                  {
                    icon: Award,
                    title: "Instant Payment",
                    description: "Get paid immediately via UPI, PhonePe, GPay, bank transfer, or cash"
                  },
                  {
                    icon: Laptop,
                    title: "All Conditions Accepted",
                    description: "Working, damaged, broken - we buy MacBooks in any condition with fair prices"
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

          {/* MacBook Models Price Guide */}
          <section className="py-16 md:py-24 bg-muted/30">
            <div className="container">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
                MacBook Resale Price Guide 2025
              </h2>
              <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
                Estimated resale values for popular MacBook models. Get exact price with our instant quote tool.
              </p>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {[
                  { name: "MacBook Pro 16\" M3 Max", year: "2024", price: "₹1,20,000 - ₹2,50,000" },
                  { name: "MacBook Pro 14\" M3 Pro", year: "2024", price: "₹90,000 - ₹1,80,000" },
                  { name: "MacBook Air 15\" M2", year: "2023", price: "₹70,000 - ₹1,10,000" },
                  { name: "MacBook Air 13\" M2", year: "2022-2023", price: "₹55,000 - ₹85,000" },
                  { name: "MacBook Pro 16\" M1 Max", year: "2021", price: "₹80,000 - ₹1,50,000" },
                  { name: "MacBook Pro 13\" M1", year: "2020", price: "₹45,000 - ₹75,000" },
                  { name: "MacBook Pro 16\" Intel", year: "2019", price: "₹40,000 - ₹80,000" },
                  { name: "MacBook Air Intel", year: "2017-2020", price: "₹25,000 - ₹55,000" },
                  { name: "MacBook Pro 15\" Intel", year: "2015-2019", price: "₹30,000 - ₹70,000" },
                ].map((model, index) => (
                  <div key={index} className="p-6 rounded-2xl bg-card border border-border hover:border-primary transition-all">
                    <h3 className="font-bold text-lg mb-2">{model.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">Year: {model.year}</p>
                    <p className="text-primary font-semibold text-lg">{model.price}</p>
                  </div>
                ))}
              </div>

              <div className="text-center mt-12">
                <p className="text-muted-foreground mb-4">
                  Actual price depends on storage, RAM, condition, and accessories
                </p>
                <Button variant="cta" size="lg" onClick={() => navigate("/sell/laptop")}>
                  Get Exact Price for Your MacBook
                </Button>
              </div>
            </div>
          </section>

          {/* How to Sell MacBook */}
          <section className="py-16 md:py-24">
            <div className="container">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                How to Sell Your MacBook in 4 Simple Steps
              </h2>

              <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
                {[
                  { step: "1", title: "Get Instant Quote", desc: "Select your MacBook model and get real-time pricing in seconds" },
                  { step: "2", title: "Schedule Pickup", desc: "Book free doorstep pickup at your convenient time and location" },
                  { step: "3", title: "Device Verification", desc: "Our expert verifies your MacBook condition at your doorstep" },
                  { step: "4", title: "Receive Payment", desc: "Get instant payment via UPI, bank transfer, or cash" }
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
            </div>
          </section>

          {/* FAQ Section */}
          <section className="py-16 md:py-24 bg-muted/30">
            <div className="container max-w-4xl">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                Frequently Asked Questions
              </h2>

              <div className="space-y-6">
                {[
                  {
                    q: "How much can I get for my used MacBook?",
                    a: "MacBook resale prices vary by model, year, and condition. MacBook Pro M3 (₹90,000-₹2,50,000), MacBook Air M2 (₹55,000-₹1,10,000), MacBook Pro M1 (₹45,000-₹1,50,000), Intel MacBooks (₹25,000-₹80,000). Use our instant quote tool for exact pricing."
                  },
                  {
                    q: "Do you buy damaged or broken MacBooks?",
                    a: "Yes! We purchase MacBooks in any condition - cracked screen, battery issues, water damage, keyboard problems, or non-functional. Price is adjusted based on the damage severity. Get instant quote for damaged MacBooks."
                  },
                  {
                    q: "How quickly can I sell my MacBook?",
                    a: "You can sell your MacBook within hours. Get instant online quote (2 mins), schedule free pickup, and receive payment immediately after verification. Same-day service available in major cities."
                  },
                  {
                    q: "Is my data safe when selling MacBook?",
                    a: "Absolutely! We provide professional data wiping certified by Apple standards. All personal data, accounts, and files are securely erased beyond recovery. Your privacy and data security are our top priority."
                  },
                  {
                    q: "What do I need to sell my MacBook?",
                    a: "You need: 1) Your MacBook (any condition), 2) Original charger (preferred but not mandatory), 3) Valid ID proof, 4) Original purchase invoice (optional). Even without accessories, we'll buy your MacBook."
                  },
                  {
                    q: "Which locations do you provide pickup service?",
                    a: "We provide free doorstep pickup service across all major cities in India including Delhi, Mumbai, Bangalore, Hyderabad, Chennai, Pune, Kolkata, and 500+ other cities. Book online for convenient home pickup."
                  }
                ].map((faq, index) => (
                  <div key={index} className="p-6 rounded-2xl bg-card border border-border">
                    <h3 className="font-bold mb-2 text-lg">{faq.q}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
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

export default SellMacBook;
