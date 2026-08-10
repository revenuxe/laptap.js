"use client";


import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Laptop, CheckCircle, TrendingUp, Shield, Zap } from "lucide-react";

export const PageClient = () => {
  const router = useRouter();

  return (
    <>
      

      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <section className="relative overflow-hidden bg-gradient-to-b from-background via-muted/20 to-background py-20 md:py-32">
            <div className="container">
              <div className="mx-auto max-w-4xl text-center">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                  <Laptop className="h-4 w-4" />
                  Dell XPS Series
                </div>

                <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                  Sell Your Dell XPS Laptop for{" "}
                  <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    Best Price
                  </span>
                </h1>

                <p className="mb-8 text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto">
                  Get instant cash for Dell XPS 13, XPS 15, XPS 17. All configurations accepted. 
                  Free doorstep pickup with instant payment across India.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                  <Button variant="cta" size="lg" onClick={() => router.push("/sell/laptop")}>
                    Get Instant Quote
                  </Button>
                  <Button variant="outline" size="lg" onClick={() => router.push("/contact")}>
                    Contact Us
                  </Button>
                </div>
              </div>
            </div>
          </section>

          <section className="py-16 md:py-24">
            <div className="container">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                Dell XPS Models We Buy
              </h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {[
                  { name: "Dell XPS 17 9730", year: "2024 (13th Gen Intel)" },
                  { name: "Dell XPS 15 9530", year: "2024 (13th Gen Intel)" },
                  { name: "Dell XPS 13 Plus 9320", year: "2024 (12th Gen Intel)" },
                  { name: "Dell XPS 13 9315", year: "2023 (12th Gen Intel)" },
                  { name: "Dell XPS 17 9720", year: "2023 (12th Gen Intel)" },
                  { name: "Dell XPS 15 9520", year: "2022 (12th Gen Intel)" },
                  { name: "Dell XPS 13 9310", year: "2021 (11th Gen Intel)" },
                  { name: "Dell XPS 15 9510", year: "2021 (11th Gen Intel)" },
                  { name: "Dell XPS 13 9300", year: "2020 (10th Gen Intel)" },
                ].map((model, index) => (
                  <div key={index} className="p-6 rounded-2xl border-2 border-border bg-card hover:border-primary transition-all">
                    <h3 className="font-bold text-lg mb-2">{model.name}</h3>
                    <p className="text-sm text-muted-foreground">{model.year}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="py-16 md:py-24 bg-muted/30">
            <div className="container">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                Why Sell Your Dell XPS With Us?
              </h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                {[
                  {
                    icon: TrendingUp,
                    title: "Premium Pricing",
                    description: "Highest resale value for Dell XPS laptops in the market"
                  },
                  {
                    icon: Zap,
                    title: "Quick Process",
                    description: "Get quote, schedule pickup, and receive payment in 24 hours"
                  },
                  {
                    icon: Shield,
                    title: "Safe & Secure",
                    description: "Professional data wiping and secure transaction guaranteed"
                  },
                  {
                    icon: CheckCircle,
                    title: "Free Doorstep Pickup",
                    description: "Convenient pickup service available across all major cities"
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

              <div className="mt-16 p-8 bg-muted/30 rounded-2xl">
                <h3 className="text-2xl font-bold mb-4 text-center">Also Selling Other Brands?</h3>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Link href="/models/macbook-pro" className="text-primary hover:underline font-medium">
                    Sell MacBook Pro
                  </Link>
                  <span className="text-muted-foreground">•</span>
                  <Link href="/models/hp-pavilion" className="text-primary hover:underline font-medium">
                    Sell HP Pavilion
                  </Link>
                  <span className="text-muted-foreground">•</span>
                  <Link href="/models/lenovo-thinkpad" className="text-primary hover:underline font-medium">
                    Sell Lenovo ThinkPad
                  </Link>
                  <span className="text-muted-foreground">•</span>
                  <Link href="/about" className="text-primary hover:underline font-medium">
                    About Us
                  </Link>
                  <span className="text-muted-foreground">•</span>
                  <Link href="/" className="text-primary hover:underline font-medium">
                    Homepage
                  </Link>
                </div>
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


