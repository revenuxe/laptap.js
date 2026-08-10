"use client";


import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Laptop, MapPin } from "lucide-react";

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
                  <MapPin className="h-4 w-4" />
                  Bangalore
                </div>

                <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                  Sell Used HP Laptop in Bangalore for{" "}
                  <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    Top Price
                  </span>
                </h1>

                <p className="mb-8 text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto">
                  Get the highest resale value for your HP Pavilion, Envy, Omen, EliteBook, ProBook laptops in Bangalore. 
                  Free same-day doorstep pickup with instant payment.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button variant="cta" size="lg" onClick={() => router.push("/sell/laptop")}>
                    Book Free Pickup Now
                  </Button>
                  <Button variant="outline" size="lg" onClick={() => router.push("/contact")}>
                    Get Instant Quote
                  </Button>
                </div>
              </div>
            </div>
          </section>

          <section className="py-16 md:py-24">
            <div className="container max-w-6xl">
              <div className="grid md:grid-cols-2 gap-12">
                <div>
                  <h2 className="text-3xl font-bold mb-6">
                    Sell HP Laptop in Bangalore - Get Best Market Value
                  </h2>
                  <div className="prose prose-slate">
                    <p className="text-muted-foreground mb-4">
                      Want to sell your HP laptop in Bangalore? Laptap provides the best prices for all HP models including Pavilion, Envy premium laptops, Omen gaming series, business-focused EliteBook and ProBook, and HP Spectre ultrabooks. Whether you own an HP laptop with AMD Ryzen, Intel Core processors, or dedicated NVIDIA/AMD graphics, we offer competitive valuations based on current market rates.
                    </p>
                    <p className="text-muted-foreground mb-4">
                      We cover all major neighborhoods in Bangalore - Koramangala, Indiranagar, Whitefield, Electronic City, HSR Layout, Marathahalli, BTM Layout, Jayanagar, JP Nagar, and more. Our services include free same-day doorstep pickup, thorough device inspection, professional data wiping, and instant payment through UPI, bank transfer, or cash.
                    </p>
                    <p className="text-muted-foreground">
                      Trusted by thousands in Bangalore, Laptap makes selling HP laptops simple and secure. Get your instant online quote, book pickup at your preferred time, and receive payment within hours. No hidden charges, no complicated process - just straightforward service.
                    </p>
                  </div>
                </div>
                <div>
                  <h2 className="text-3xl font-bold mb-6">
                    Why Sell HP Laptop with Laptap in Bangalore?
                  </h2>
                  <div className="space-y-4">
                    <div className="p-4 bg-card rounded-lg border">
                      <h3 className="font-bold mb-2">Best HP Laptop Prices</h3>
                      <p className="text-sm text-muted-foreground">
                        We offer the highest prices for HP Pavilion, Envy, Omen, and EliteBook models in Bangalore - typically 15-20% above other buyers.
                      </p>
                    </div>
                    <div className="p-4 bg-card rounded-lg border">
                      <h3 className="font-bold mb-2">Free Doorstep Collection</h3>
                      <p className="text-sm text-muted-foreground">
                        Our verified professionals provide free same-day pickup service across all Bangalore areas. We come to you for hassle-free selling.
                      </p>
                    </div>
                    <div className="p-4 bg-card rounded-lg border">
                      <h3 className="font-bold mb-2">Immediate Payment</h3>
                      <p className="text-sm text-muted-foreground">
                        Receive instant payment via UPI, PhonePe, GPay, or cash right after device verification. Complete data wiping for security.
                      </p>
                    </div>
                    <div className="p-4 bg-card rounded-lg border">
                      <h3 className="font-bold mb-2">All HP Models Welcome</h3>
                      <p className="text-sm text-muted-foreground">
                        We buy all HP laptops - Pavilion, Envy, Omen, EliteBook, ProBook, Spectre - in any condition including broken or non-functional.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* HP Models Section */}
          <section className="py-16 md:py-24 bg-muted/30">
            <div className="container">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">HP Laptop Models We Buy in Bangalore</h2>
              <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
                All HP laptop series accepted - Pavilion, Envy, Omen, EliteBook, ProBook, Spectre
              </p>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {[
                  { name: "HP Pavilion 14, 15, 16", series: "Consumer Laptops" },
                  { name: "HP Pavilion x360", series: "2-in-1 Convertibles" },
                  { name: "HP Envy 13, 14, 15", series: "Premium Laptops" },
                  { name: "HP Envy x360", series: "Premium Convertibles" },
                  { name: "HP Omen 15, 16, 17", series: "Gaming Laptops" },
                  { name: "HP EliteBook 840, 850, 860", series: "Business Laptops" },
                  { name: "HP ProBook 440, 450, 640", series: "Business Value" },
                  { name: "HP Spectre x360", series: "Ultra-Premium" },
                  { name: "HP Victus 15, 16", series: "Budget Gaming" },
                ].map((model, index) => (
                  <div key={index} className="p-6 rounded-2xl border-2 border-border bg-card hover:border-primary transition-all">
                    <h3 className="font-bold text-lg mb-2">{model.name}</h3>
                    <p className="text-sm text-muted-foreground">{model.series}</p>
                  </div>
                ))}
              </div>

              <div className="mt-12 text-center">
                <Button variant="cta" size="lg" onClick={() => router.push("/sell")}>
                  Get Started - Sell HP Laptop Now
                </Button>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-16 md:py-24">
            <div className="container">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Ready to Sell Your HP Laptop in Bangalore?
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Join thousands of satisfied customers in Bangalore. Get instant quote, free pickup, and same-day payment.
                </p>
              </div>
              <div className="mt-12 text-center">
                <p className="text-sm text-muted-foreground">
                  Looking for:{" "}
                  <Link href="/bangalore/macbook" className="text-primary hover:underline">Sell MacBook</Link>,{" "}
                  <Link href="/bangalore/dell" className="text-primary hover:underline">Sell Dell</Link>, or{" "}
                  <Link href="/bangalore/lenovo" className="text-primary hover:underline">Sell Lenovo</Link> in Bangalore
                </p>
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

