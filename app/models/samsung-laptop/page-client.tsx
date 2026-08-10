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
                    Samsung Laptops
                  </div>

                  <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                    Sell Your Samsung Laptop for{" "}
                    <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                      Top Price
                    </span>
                  </h1>

                  <p className="mb-8 text-lg text-muted-foreground">
                    Get instant cash for your Samsung Galaxy Book Pro, Galaxy Book 3, and Notebook laptops. 
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
                Samsung Laptop Models We Buy
              </h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {[
                  { name: "Samsung Galaxy Book 3 Ultra", series: "Flagship" },
                  { name: "Samsung Galaxy Book 3 Pro 360", series: "Premium 2-in-1" },
                  { name: "Samsung Galaxy Book 3 Pro", series: "Premium Ultrabook" },
                  { name: "Samsung Galaxy Book 3", series: "Mainstream" },
                  { name: "Samsung Galaxy Book 2 Pro", series: "Previous Gen" },
                  { name: "Samsung Galaxy Book 2", series: "Previous Gen" },
                  { name: "Samsung Galaxy Book Pro 360", series: "Convertible" },
                  { name: "Samsung Galaxy Book Pro", series: "AMOLED Display" },
                  { name: "Samsung Galaxy Book Flex", series: "2-in-1" },
                  { name: "Samsung Galaxy Book Ion", series: "Ultra-Light" },
                  { name: "Samsung Notebook 9", series: "Legacy" },
                  { name: "Samsung Notebook Series", series: "Older Models" },
                ].map((model, index) => (
                  <div key={index} className="p-6 rounded-2xl border-2 border-border bg-card hover:border-primary transition-all">
                    <h3 className="font-bold text-lg mb-2">{model.name}</h3>
                    <p className="text-sm text-muted-foreground">{model.series}</p>
                  </div>
                ))}
              </div>

              <div className="mt-12 text-center">
                <p className="text-muted-foreground mb-6">
                  All Samsung laptop models accepted - Galaxy Book, Notebook - in any condition
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
                Why Sell Your Samsung Laptop Online with Laptap?
              </h2>
              
              <div className="prose prose-lg max-w-none text-muted-foreground space-y-6">
                <p>
                  Looking to sell your used Samsung laptop? Laptap offers India's most trusted platform for selling Samsung laptops online with instant cash payment. Whether you own a Samsung Galaxy Book 3 Ultra, Galaxy Book Pro 360, or an older Notebook series, we guarantee the best resale value.
                </p>

                <h3 className="text-2xl font-bold text-foreground mt-8">Best Price for Samsung Laptops in India</h3>
                <p>
                  Samsung Galaxy Book laptops with stunning AMOLED displays and premium build quality retain excellent resale value. Our pricing considers your laptop's processor (Intel Core 13th Gen, Intel Evo), RAM, storage, display type (AMOLED, Dynamic AMOLED), and physical condition to offer you the highest possible price.
                </p>

                <h3 className="text-2xl font-bold text-foreground mt-8">Sell Samsung Galaxy Book Pro</h3>
                <p>
                  Samsung Galaxy Book Pro series with Super AMOLED displays are highly valued in the resale market. Whether you have a Galaxy Book 3 Ultra with Intel Core i9, a Galaxy Book 3 Pro 360 convertible, or a Galaxy Book 2 Pro, we offer competitive prices that beat local dealers.
                </p>

                <h3 className="text-2xl font-bold text-foreground mt-8">Free Doorstep Pickup Across India</h3>
                <p>
                  No need to visit local shops or deal with unreliable buyers. Our verified technicians provide free same-day doorstep pickup service across Bangalore, Mumbai, Delhi, Hyderabad, Chennai, Pune, and all major cities.
                </p>

                <h3 className="text-2xl font-bold text-foreground mt-8">Instant Payment & Secure Transaction</h3>
                <p>
                  Get paid instantly after device verification via UPI, IMPS bank transfer, or cash. Your data is completely wiped using Samsung's secure protocols. Every transaction is transparent and backed by thousands of satisfied customer reviews.
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


