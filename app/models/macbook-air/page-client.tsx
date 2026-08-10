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
                    MacBook Air
                  </div>

                  <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                    Sell Your MacBook Air for{" "}
                    <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                      Instant Cash
                    </span>
                  </h1>

                  <p className="mb-8 text-lg text-muted-foreground">
                    Get the best resale value for your MacBook Air. All models accepted - M3, M2, M1, Intel. 
                    Free doorstep pickup with instant payment.
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
                MacBook Air Models We Buy
              </h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {[
                  { name: "MacBook Air 15-inch M3", year: "2024" },
                  { name: "MacBook Air 13-inch M3", year: "2024" },
                  { name: "MacBook Air 15-inch M2", year: "2023" },
                  { name: "MacBook Air 13-inch M2", year: "2022" },
                  { name: "MacBook Air M1", year: "2020" },
                  { name: "MacBook Air Retina Intel", year: "2018-2020" },
                  { name: "MacBook Air 13-inch Intel", year: "2017" },
                  { name: "MacBook Air 11-inch", year: "2010-2015" },
                  { name: "MacBook Air 13-inch", year: "2008-2017" },
                ].map((model, index) => (
                  <div key={index} className="p-6 rounded-2xl border-2 border-border bg-card hover:border-primary transition-all">
                    <h3 className="font-bold text-lg mb-2">{model.name}</h3>
                    <p className="text-sm text-muted-foreground">{model.year}</p>
                  </div>
                ))}
              </div>

              <div className="mt-12 text-center">
                <p className="text-muted-foreground mb-6">
                  All MacBook Air models accepted - M3, M2, M1, Intel - in any condition
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
                Why Sell Your MacBook Air Online with Laptap?
              </h2>
              
              <div className="prose prose-lg max-w-none text-muted-foreground space-y-6">
                <p>
                  Looking to sell your used MacBook Air? You've come to the right place. Laptap offers India's most trusted platform for selling MacBook Air laptops online with instant cash payment. Whether you own a MacBook Air M3, M2, M1, or an older Intel-based model, we guarantee the best resale value in the market.
                </p>

                <h3 className="text-2xl font-bold text-foreground mt-8">Best Price for MacBook Air in India</h3>
                <p>
                  MacBook Air laptops retain excellent resale value, especially the newer Apple Silicon models. Our dynamic pricing algorithm considers your MacBook's processor (M3, M2, M1, Intel), screen size (13-inch, 15-inch), RAM configuration, storage capacity, and physical condition to offer you the highest possible price. We buy MacBook Air 2024, 2023, 2022, 2020, and older models.
                </p>

                <h3 className="text-2xl font-bold text-foreground mt-8">Sell MacBook Air 15-inch M2/M3</h3>
                <p>
                  The new MacBook Air 15-inch models with M2 and M3 chips command premium resale prices. Whether you're upgrading to a newer model or switching devices, we offer the best market rates for your 15-inch MacBook Air. The larger display and powerful Apple Silicon make these highly sought after in the resale market.
                </p>

                <h3 className="text-2xl font-bold text-foreground mt-8">Free Doorstep Pickup Across India</h3>
                <p>
                  Forget the hassle of visiting multiple shops or dealing with unreliable buyers. Our verified technicians provide free same-day doorstep pickup service across all major Indian cities including Bangalore, Mumbai, Delhi, Hyderabad, Chennai, and Pune.
                </p>

                <h3 className="text-2xl font-bold text-foreground mt-8">Instant Payment & Safe Transaction</h3>
                <p>
                  Get paid instantly after device verification. We support multiple payment methods including UPI, IMPS bank transfer, and cash. Your MacBook Air data is completely wiped using industry-standard security protocols. Every transaction is transparent and secure.
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


