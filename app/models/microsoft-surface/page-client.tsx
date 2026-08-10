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
                    Microsoft Surface
                  </div>

                  <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                    Sell Your Microsoft Surface for{" "}
                    <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                      Best Price
                    </span>
                  </h1>

                  <p className="mb-8 text-lg text-muted-foreground">
                    Get instant cash for your Surface Pro, Surface Laptop, Surface Book, and Surface Go. 
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
                Microsoft Surface Models We Buy
              </h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {[
                  { name: "Surface Pro 9/10", series: "Flagship Tablet" },
                  { name: "Surface Pro 8/7+", series: "Premium Tablet" },
                  { name: "Surface Laptop 5/6", series: "Flagship Laptop" },
                  { name: "Surface Laptop 4", series: "Previous Gen" },
                  { name: "Surface Laptop Studio 2", series: "Creator Device" },
                  { name: "Surface Laptop Studio", series: "Previous Gen" },
                  { name: "Surface Book 3", series: "Detachable" },
                  { name: "Surface Book 2", series: "Previous Gen" },
                  { name: "Surface Go 3/4", series: "Compact Tablet" },
                  { name: "Surface Pro X", series: "ARM-based" },
                  { name: "Surface Laptop Go 2/3", series: "Budget Laptop" },
                  { name: "Surface 3/Pro 3-6", series: "Legacy Models" },
                ].map((model, index) => (
                  <div key={index} className="p-6 rounded-2xl border-2 border-border bg-card hover:border-primary transition-all">
                    <h3 className="font-bold text-lg mb-2">{model.name}</h3>
                    <p className="text-sm text-muted-foreground">{model.series}</p>
                  </div>
                ))}
              </div>

              <div className="mt-12 text-center">
                <p className="text-muted-foreground mb-6">
                  All Microsoft Surface models accepted - Pro, Laptop, Book, Go - in any condition
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
                Why Sell Your Microsoft Surface Online with Laptap?
              </h2>
              
              <div className="prose prose-lg max-w-none text-muted-foreground space-y-6">
                <p>
                  Looking to sell your used Microsoft Surface? Laptap offers India's most trusted platform for selling Microsoft Surface devices online with instant cash payment. Whether you own a Surface Pro 9, Surface Laptop 5, Surface Book 3, or a Surface Go, we guarantee the best resale value.
                </p>

                <h3 className="text-2xl font-bold text-foreground mt-8">Best Price for Microsoft Surface in India</h3>
                <p>
                  Microsoft Surface devices with premium PixelSense displays and versatile form factors retain excellent resale value. Our pricing considers your device's processor (Intel Core, Microsoft SQ), RAM, storage, accessories (Type Cover, Surface Pen), and physical condition to offer you the highest possible price.
                </p>

                <h3 className="text-2xl font-bold text-foreground mt-8">Sell Surface Pro with Type Cover</h3>
                <p>
                  Surface Pro tablets with Type Cover keyboard are highly valued. Whether you have a Surface Pro 9 with Intel Core i7, a Surface Pro 8, or a Surface Pro X with ARM processor, we offer competitive prices that beat local dealers. Selling your Surface with original accessories like Type Cover and Surface Pen increases your resale value.
                </p>

                <h3 className="text-2xl font-bold text-foreground mt-8">Free Doorstep Pickup Across India</h3>
                <p>
                  Skip the hassle of visiting multiple shops. Our verified technicians provide free same-day doorstep pickup service across Bangalore, Mumbai, Delhi, Hyderabad, Chennai, Pune, and all major cities.
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


