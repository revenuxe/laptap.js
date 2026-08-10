"use client";


import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Laptop, CheckCircle, TrendingUp, Shield, Zap } from "lucide-react";
import HeroForm from "@/components/HeroForm";
import FAQ from "@/components/FAQ";

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
              <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
                <div>
                  <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                    <Laptop className="h-4 w-4" />
                    Acer Laptops
                  </div>

                  <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                    Sell Your Acer Laptop for{" "}
                    <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                      Instant Cash
                    </span>
                  </h1>

                  <p className="mb-8 text-lg text-muted-foreground">
                    Get the best resale value for your Acer Predator, Aspire, Swift, Nitro laptops. 
                    Free doorstep pickup with instant payment across India.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button variant="cta" size="lg" onClick={() => router.push("/sell/laptop")}>
                      Get Instant Quote
                    </Button>
                    <Button variant="outline" size="lg" onClick={() => router.push("/contact")}>
                      Contact Us
                    </Button>
                  </div>
                </div>

                <HeroForm defaultSellingType="laptop" />
              </div>
            </div>
          </section>

          {/* Models We Accept */}
          <section className="py-16 md:py-24 bg-muted/30">
            <div className="container">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                Acer Laptop Models We Buy
              </h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {[
                  { name: "Acer Predator Helios 16/18", series: "Premium Gaming" },
                  { name: "Acer Predator Triton 300/500", series: "Slim Gaming" },
                  { name: "Acer Nitro 5/7/16", series: "Gaming Series" },
                  { name: "Acer Swift 3/5/7", series: "Ultrabook" },
                  { name: "Acer Swift X", series: "Creator Laptop" },
                  { name: "Acer Spin 3/5", series: "2-in-1 Convertible" },
                  { name: "Acer Aspire 3/5/7", series: "Everyday Laptop" },
                  { name: "Acer Aspire Vero", series: "Eco-Friendly" },
                  { name: "Acer TravelMate", series: "Business Laptop" },
                  { name: "Acer ConceptD", series: "Creator Pro" },
                  { name: "Acer Chromebook", series: "Chrome OS" },
                  { name: "Acer Enduro", series: "Rugged Laptop" },
                ].map((model, index) => (
                  <div key={index} className="p-6 rounded-2xl border-2 border-border bg-card hover:border-primary transition-all">
                    <h3 className="font-bold text-lg mb-2">{model.name}</h3>
                    <p className="text-sm text-muted-foreground">{model.series}</p>
                  </div>
                ))}
              </div>

              <div className="mt-12 text-center">
                <p className="text-muted-foreground mb-6">
                  All Acer laptop models accepted - Predator, Nitro, Swift, Aspire - in any condition
                </p>
                <Button variant="cta" size="lg" onClick={() => router.push("/sell")}>
                  Get Instant Quote Now
                </Button>
              </div>
            </div>
          </section>

          {/* SEO Content Section */}
          <section className="py-16 md:py-24 bg-muted/30">
            <div className="container max-w-4xl">
              <h2 className="text-3xl md:text-4xl font-bold mb-8">
                Why Sell Your Acer Laptop Online with Laptap?
              </h2>
              
              <div className="prose prose-lg max-w-none text-muted-foreground space-y-6">
                <p>
                  Looking to sell your used Acer laptop? Laptap offers India's most trusted platform for selling Acer laptops online with instant cash payment. Whether you own an Acer Predator gaming powerhouse, a sleek Swift ultrabook, or a budget-friendly Aspire, we guarantee the best resale value.
                </p>

                <h3 className="text-2xl font-bold text-foreground mt-8">Best Price for Acer Laptops in India</h3>
                <p>
                  Acer laptops, particularly the Predator gaming series and Swift ultrabooks, hold strong resale value. Our pricing algorithm considers your laptop's processor (Intel Core, AMD Ryzen), GPU (NVIDIA GeForce RTX), RAM, storage, display quality, and physical condition to offer you the highest possible price.
                </p>

                <h3 className="text-2xl font-bold text-foreground mt-8">Sell Acer Predator Gaming Laptop</h3>
                <p>
                  Acer Predator gaming laptops are highly sought after in the resale market. Whether you have a Predator Helios 300 with RTX 4060, a Predator Triton 500 SE, or a Nitro 5 gaming laptop, we offer competitive prices that beat local dealers. Upgrade to the latest gaming hardware by selling your current Acer gaming laptop with us.
                </p>

                <h3 className="text-2xl font-bold text-foreground mt-8">Free Doorstep Pickup Across India</h3>
                <p>
                  No need to visit local shops or deal with unreliable buyers. Our verified technicians provide free same-day doorstep pickup service across Bangalore, Mumbai, Delhi, Hyderabad, Chennai, Pune, and all major cities.
                </p>

                <h3 className="text-2xl font-bold text-foreground mt-8">Instant Payment & Secure Transaction</h3>
                <p>
                  Get paid instantly after device verification via UPI, IMPS bank transfer, or cash. Your data is completely wiped using industry-standard security protocols. Every transaction is transparent and backed by thousands of satisfied customer reviews.
                </p>
              </div>
            </div>
          </section>

          <FAQ />
        </main>
        <Footer />
        <WhatsAppFloat />
      </div>
    </>
  );
};


