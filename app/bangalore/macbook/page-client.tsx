"use client";


import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Laptop, CheckCircle, TrendingUp, Shield, Zap, MapPin } from "lucide-react";

export const PageClient = () => {
  const router = useRouter();

  return (
    <>
      

      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          {/* Hero Section */}
          <section className="relative overflow-hidden bg-gradient-to-b from-background via-muted/20 to-background py-20 md:py-32">
            <div className="container">
              <div className="mx-auto max-w-4xl text-center">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                  <MapPin className="h-4 w-4" />
                  Bangalore
                </div>

                <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                  Sell Used MacBook in Bangalore for{" "}
                  <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    Instant Cash
                  </span>
                </h1>

                <p className="mb-8 text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto">
                  Get the highest resale value for your MacBook Pro, MacBook Air in Bangalore. 
                  Free same-day doorstep pickup across all areas with instant payment via UPI or cash.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                  <Button variant="cta" size="lg" onClick={() => router.push("/sell/laptop")}>
                    Book Free Pickup Now
                  </Button>
                  <Button variant="outline" size="lg" onClick={() => router.push("/contact")}>
                    Get Instant Quote
                  </Button>
                </div>

                <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-primary" />
                    <span>100% Safe & Secure</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    <span>Best Market Price</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-primary" />
                    <span>Same Day Pickup</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SEO Content Section */}
          <section className="py-16 md:py-24">
            <div className="container max-w-6xl">
              <div className="grid md:grid-cols-2 gap-12">
                <div>
                  <h2 className="text-3xl font-bold mb-6">
                    Sell MacBook in Bangalore - Get Maximum Value
                  </h2>
                  <div className="prose prose-slate">
                    <p className="text-muted-foreground mb-4">
                      Looking to sell your MacBook in Bangalore? Laptap offers the best resale value for all MacBook models including MacBook Pro and MacBook Air with M3, M2, M1, and Intel processors. Whether you have the latest MacBook Pro 16-inch M3 Max or an older MacBook Air, we provide competitive pricing and instant cash payment.
                    </p>
                    <p className="text-muted-foreground mb-4">
                      Our service covers all major areas in Bangalore including Koramangala, Indiranagar, Whitefield, Electronic City, HSR Layout, and Marathahalli. We offer free same-day doorstep pickup, professional data wiping, and secure payment options via UPI, PhonePe, GPay, or cash.
                    </p>
                    <p className="text-muted-foreground">
                      With over 5,000+ satisfied customers in Bangalore, Laptap is the most trusted platform for selling used MacBooks. Get an instant online quote, schedule a convenient pickup time, and receive payment within hours. No hidden charges, no bargaining - just transparent pricing and quick service.
                    </p>
                  </div>
                </div>
                <div>
                  <h2 className="text-3xl font-bold mb-6">
                    Why Choose Laptap to Sell MacBook in Bangalore?
                  </h2>
                  <div className="space-y-4">
                    <div className="p-4 bg-card rounded-lg border">
                      <h3 className="font-bold mb-2">Highest Market Price</h3>
                      <p className="text-sm text-muted-foreground">
                        We offer 15-20% more than other buyers in Bangalore. Our pricing algorithm ensures you get the best value for your MacBook based on current market rates.
                      </p>
                    </div>
                    <div className="p-4 bg-card rounded-lg border">
                      <h3 className="font-bold mb-2">Free Doorstep Pickup Across Bangalore</h3>
                      <p className="text-sm text-muted-foreground">
                        Our verified technicians provide free same-day pickup service across all localities in Bangalore. Book online and we reach within 2-4 hours.
                      </p>
                    </div>
                    <div className="p-4 bg-card rounded-lg border">
                      <h3 className="font-bold mb-2">Instant Payment & Data Security</h3>
                      <p className="text-sm text-muted-foreground">
                        Get paid immediately via UPI or cash after device verification. Professional data wiping ensures 100% privacy and security.
                      </p>
                    </div>
                    <div className="p-4 bg-card rounded-lg border">
                      <h3 className="font-bold mb-2">All MacBook Models Accepted</h3>
                      <p className="text-sm text-muted-foreground">
                        From MacBook Pro M3 Max to older Intel models, we buy all MacBooks in any condition - working, damaged, or broken screen.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Why Sell MacBook in Bangalore With Us */}
          <section className="py-16 md:py-24 bg-muted/30">
            <div className="container">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                Why Bangalore Customers Trust Us
              </h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                {[
                  {
                    icon: TrendingUp,
                    title: "Highest Price in Bangalore",
                    description: "We offer 15-20% more than competitors for MacBook models in Bangalore"
                  },
                  {
                    icon: Zap,
                    title: "Same Day Pickup",
                    description: "Free doorstep pickup within 2-4 hours across Koramangala, Indiranagar, Whitefield"
                  },
                  {
                    icon: Shield,
                    title: "100% Data Security",
                    description: "Professional data wiping certified by Apple standards. Your privacy guaranteed"
                  },
                  {
                    icon: CheckCircle,
                    title: "Instant UPI Payment",
                    description: "Get paid immediately after verification via UPI, PhonePe, GPay, or cash"
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

          {/* Bangalore Areas Served */}
          <section className="py-16 md:py-24">
            <div className="container">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
                MacBook Pickup Areas in Bangalore
              </h2>
              <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
                Our verified technicians provide free same-day doorstep pickup service across all localities in Bangalore
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
                {[
                  "Koramangala", "Indiranagar", "Whitefield", "Electronic City",
                  "HSR Layout", "Marathahalli", "BTM Layout", "Jayanagar",
                  "JP Nagar", "Bellandur", "Sarjapur Road", "Hebbal",
                  "Yelahanka", "Malleshwaram", "Rajajinagar", "Bannerghatta"
                ].map((area, index) => (
                  <div key={index} className="p-3 rounded-lg bg-card border border-border text-center text-sm font-medium hover:border-primary transition-all">
                    {area}
                  </div>
                ))}
              </div>

              <div className="mt-8 text-center">
                <p className="text-muted-foreground">
                  Don't see your area? We cover <span className="text-primary font-semibold">entire Bangalore</span>. Contact us for immediate pickup.
                </p>
              </div>
            </div>
          </section>

          {/* Process */}
          <section className="py-16 md:py-24 bg-muted/30">
            <div className="container">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                How to Sell Your MacBook in Bangalore
              </h2>

              <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
                {[
                  { step: "1", title: "Get Instant Quote", desc: "Select MacBook model online and get real-time price in Bangalore" },
                  { step: "2", title: "Book Free Pickup", desc: "Schedule convenient time. We reach within 2-4 hours in Bangalore" },
                  { step: "3", title: "Device Verification", desc: "Our expert checks your MacBook at your doorstep in Bangalore" },
                  { step: "4", title: "Get Paid Instantly", desc: "Receive immediate payment via UPI, PhonePe, GPay or cash" }
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
                <Button variant="cta" size="lg" onClick={() => router.push("/sell/laptop")}>
                  Start Selling Your MacBook Now
                </Button>
              </div>
            </div>
          </section>

          {/* MacBook Models Section */}
          <section className="py-16 md:py-24 bg-muted/30">
            <div className="container">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">MacBook Models We Buy in Bangalore</h2>
              <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
                All MacBook models accepted - Pro, Air, Intel, M1, M2, M3 - any condition
              </p>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {[
                  { name: "MacBook Pro 16\" M3 Max", series: "2024 Latest" },
                  { name: "MacBook Pro 14\" M3 Pro", series: "2024 Latest" },
                  { name: "MacBook Air 15\" M3", series: "2024" },
                  { name: "MacBook Air 13\" M3", series: "2024" },
                  { name: "MacBook Pro 16\" M2 Max", series: "2023" },
                  { name: "MacBook Pro 14\" M2 Pro", series: "2023" },
                  { name: "MacBook Air 15\" M2", series: "2023" },
                  { name: "MacBook Air 13\" M2", series: "2022" },
                  { name: "MacBook Pro 16\" M1 Max", series: "2021" },
                  { name: "MacBook Pro 14\" M1 Pro", series: "2021" },
                  { name: "MacBook Air 13\" M1", series: "2020" },
                  { name: "MacBook Pro 16\" Intel", series: "2019-2020" },
                ].map((model, index) => (
                  <div key={index} className="p-6 rounded-2xl border-2 border-border bg-card hover:border-primary transition-all">
                    <h3 className="font-bold text-lg mb-2">{model.name}</h3>
                    <p className="text-sm text-muted-foreground">{model.series}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* FAQ Bangalore Specific */}
          <section className="py-16 md:py-24">
            <div className="container max-w-4xl">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                Selling MacBook in Bangalore - FAQs
              </h2>

              <div className="space-y-6">
                {[
                  {
                    q: "What is the best place to sell MacBook in Bangalore?",
                    a: "Laptap is the most trusted platform to sell MacBook in Bangalore. We offer the highest resale value (15-20% more than competitors), free same-day doorstep pickup across all Bangalore areas including Koramangala, Indiranagar, Whitefield, and instant payment via UPI. Over 5000+ Bangalore residents have sold their MacBooks with us."
                  },
                  {
                    q: "How much can I get for my MacBook in Bangalore?",
                    a: "MacBook resale prices in Bangalore: MacBook Pro M3 (Ã¢â€šÂ¹90,000-Ã¢â€šÂ¹2,50,000), MacBook Air M2 (Ã¢â€šÂ¹55,000-Ã¢â€šÂ¹1,10,000), MacBook Pro M1 (Ã¢â€šÂ¹45,000-Ã¢â€šÂ¹1,50,000), Intel MacBooks (Ã¢â€šÂ¹25,000-Ã¢â€šÂ¹80,000). Exact price depends on model, year, storage, RAM, and condition. Get instant quote online for Bangalore-specific pricing."
                  },
                  {
                    q: "How quickly can I sell my MacBook in Bangalore?",
                    a: "You can sell your MacBook in Bangalore within 2-4 hours. Process: 1) Get instant online quote (2 mins), 2) Schedule pickup (free same-day service across Bangalore), 3) Our technician visits your location in Koramangala, Indiranagar, HSR, Whitefield etc., 4) Get instant payment via UPI/cash after verification."
                  },
                  {
                    q: "Which Bangalore areas do you provide MacBook pickup service?",
                    a: "We provide free same-day MacBook pickup across all Bangalore areas: Koramangala, Indiranagar, Whitefield, Electronic City, HSR Layout, Marathahalli, BTM Layout, Jayanagar, JP Nagar, Bellandur, Sarjapur Road, Hebbal, Yelahanka, Malleshwaram, Bannerghatta, and all other localities. Our verified technicians reach within 2-4 hours."
                  },
                  {
                    q: "Can I sell damaged MacBook in Bangalore?",
                    a: "Yes! We buy MacBooks in any condition in Bangalore - cracked screen, battery issues, water damage, keyboard problems, or non-functional. We accept MacBook Pro and MacBook Air with any defects. Price is adjusted based on condition. Free doorstep inspection and instant payment across all Bangalore areas."
                  },
                  {
                    q: "Is selling MacBook in Bangalore safe with Laptap?",
                    a: "Absolutely safe! We provide: 1) Verified technicians with ID proof for doorstep visits across Bangalore, 2) Professional data wiping certified by Apple standards, 3) Instant payment via secure UPI/bank transfer, 4) 4.9Ã¢Ëœâ€¦ rating from 5000+ Bangalore customers. Your MacBook and data are 100% secure with us."
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

