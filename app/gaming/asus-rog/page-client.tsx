"use client";


import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Gamepad2, Zap, Shield, IndianRupee } from "lucide-react";

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
                  <Gamepad2 className="h-4 w-4" />
                  Gaming Laptops
                </div>

                <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                  Sell ASUS ROG Gaming Laptop for{" "}
                  <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    Maximum Cash
                  </span>
                </h1>

                <p className="mb-8 text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto">
                  Get premium resale value for your ASUS ROG Strix, Zephyrus G14/G15/G16, Flow Z13, and SCAR gaming laptops. 
                  Free doorstep pickup with instant payment.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button variant="cta" size="lg" onClick={() => router.push("/sell/laptop")}>
                    Get Instant Quote
                  </Button>
                  <Button variant="outline" size="lg" onClick={() => router.push("/contact")}>
                    Talk to Expert
                  </Button>
                </div>

                <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">₹2L+</div>
                    <div className="text-sm text-muted-foreground">Max Payout</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">850+</div>
                    <div className="text-sm text-muted-foreground">ROG Sold</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">4.9★</div>
                    <div className="text-sm text-muted-foreground">Rating</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">2hrs</div>
                    <div className="text-sm text-muted-foreground">Avg Pickup</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="py-16 md:py-24">
            <div className="container max-w-6xl">
              <div className="grid md:grid-cols-2 gap-12">
                <div>
                  <h2 className="text-3xl font-bold mb-6">
                    Sell ASUS ROG Laptop - Best Gaming Laptop Resale Prices
                  </h2>
                  <div className="prose prose-slate">
                    <p className="text-muted-foreground mb-4">
                      Looking to sell your ASUS ROG gaming laptop? Laptap specializes in buying high-end gaming laptops and offers the most competitive prices for all ROG models including Zephyrus G14, G15, G16, Strix G15, G17, SCAR 15, 17, and Flow Z13, X13 convertibles.
                    </p>
                    <p className="text-muted-foreground mb-4">
                      Gaming laptops depreciate differently than regular laptops - the GPU and display specs matter most. Whether you have an RTX 4090 beast or an older GTX model, we understand gaming hardware and provide fair valuations that beat local dealers.
                    </p>
                    <p className="text-muted-foreground">
                      We buy ROG laptops in any condition - working perfectly, minor issues, or even damaged. Our gaming laptop experts assess each device professionally and offer transparent pricing with no hidden deductions.
                    </p>
                  </div>
                </div>
                <div>
                  <h2 className="text-3xl font-bold mb-6">
                    Why Gamers Choose Laptap for ROG Resale
                  </h2>
                  <div className="space-y-4">
                    <div className="p-4 bg-card rounded-lg border flex gap-4">
                      <IndianRupee className="h-6 w-6 text-primary shrink-0" />
                      <div>
                        <h3 className="font-bold mb-1">Premium Gaming Prices</h3>
                        <p className="text-sm text-muted-foreground">
                          We value RTX GPUs, high-refresh displays, and gaming specs properly - up to 65% of original value for recent models.
                        </p>
                      </div>
                    </div>
                    <div className="p-4 bg-card rounded-lg border flex gap-4">
                      <Zap className="h-6 w-6 text-primary shrink-0" />
                      <div>
                        <h3 className="font-bold mb-1">Same-Day Pickup</h3>
                        <p className="text-sm text-muted-foreground">
                          Free doorstep pickup across major cities. Our experts handle gaming laptops with care.
                        </p>
                      </div>
                    </div>
                    <div className="p-4 bg-card rounded-lg border flex gap-4">
                      <Shield className="h-6 w-6 text-primary shrink-0" />
                      <div>
                        <h3 className="font-bold mb-1">Gaming Expert Valuation</h3>
                        <p className="text-sm text-muted-foreground">
                          We understand gaming specs - GPU benchmarks, thermal performance, display specs all factor into our pricing.
                        </p>
                      </div>
                    </div>
                    <div className="p-4 bg-card rounded-lg border flex gap-4">
                      <Gamepad2 className="h-6 w-6 text-primary shrink-0" />
                      <div>
                        <h3 className="font-bold mb-1">Any Condition Accepted</h3>
                        <p className="text-sm text-muted-foreground">
                          Overheating issues? Dead pixels? Battery problems? We buy ROG laptops in any condition.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="py-16 md:py-24 bg-muted/30">
            <div className="container">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">ASUS ROG Models We Buy</h2>
              <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
                All ROG gaming laptop series accepted - Zephyrus, Strix, SCAR, Flow
              </p>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {[
                  { name: "ROG Zephyrus G14 (2024)", series: "Premium 14\" Gaming" },
                  { name: "ROG Zephyrus G15/G16", series: "Premium 15/16\" Gaming" },
                  { name: "ROG Strix G15/G17", series: "Performance Gaming" },
                  { name: "ROG Strix SCAR 15/17", series: "Esports Gaming" },
                  { name: "ROG Flow Z13/X13", series: "Gaming Convertibles" },
                  { name: "ROG Zephyrus Duo 16", series: "Dual-Screen Gaming" },
                  { name: "ROG Zephyrus M16", series: "Creator Gaming" },
                  { name: "ROG Strix G (2021-2023)", series: "Previous Gen Gaming" },
                  { name: "TUF Gaming Series", series: "Budget Gaming" },
                ].map((model, index) => (
                  <div key={index} className="p-6 rounded-2xl border-2 border-border bg-card hover:border-primary transition-all">
                    <h3 className="font-bold text-lg mb-1">{model.name}</h3>
                    <p className="text-sm text-muted-foreground">{model.series}</p>
                  </div>
                ))}
              </div>

              <div className="mt-12 text-center">
                <Button variant="cta" size="lg" onClick={() => router.push("/sell")}>
                  Sell Your ROG Now - Get Quote
                </Button>
              </div>
            </div>
          </section>

          <section className="py-16 md:py-24">
            <div className="container">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Upgrade Your Gaming Setup
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Sell your current ROG and fund your next gaming upgrade. Get instant cash within hours.
                </p>
              </div>
              <div className="mt-12 text-center">
                <p className="text-sm text-muted-foreground">
                  Also selling other gaming brands? Check out{" "}
                  <Link href="/gaming/acer-predator" className="text-primary hover:underline">Sell Acer Predator</Link>,{" "}
                  <Link href="/models/asus-laptop" className="text-primary hover:underline">Sell ASUS Laptop</Link>, or{" "}
                  <Link href="/sell" className="text-primary hover:underline">All Brands</Link>
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

