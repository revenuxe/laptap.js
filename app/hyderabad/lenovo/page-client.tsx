"use client";


import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { MapPin } from "lucide-react";

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
                  Hyderabad
                </div>

                <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                  Sell Used Lenovo Laptop in Hyderabad for{" "}
                  <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    Instant Cash
                  </span>
                </h1>

                <p className="mb-8 text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto">
                  Get the highest resale value for your Lenovo ThinkPad, IdeaPad, Legion, Yoga laptops in Hyderabad. 
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
                    Sell Lenovo Laptop in Hyderabad - Best Prices Guaranteed
                  </h2>
                  <div className="prose prose-slate">
                    <p className="text-muted-foreground mb-4">
                      Looking to sell your Lenovo laptop in Hyderabad? Laptap offers the most competitive prices for all Lenovo models including ThinkPad X1 Carbon, T-series, IdeaPad, Legion gaming laptops, and Yoga convertibles. Whether you own a premium ThinkPad or an everyday IdeaPad, we provide fair valuations and instant cash.
                    </p>
                    <p className="text-muted-foreground mb-4">
                      Our service covers all major localities in Hyderabad - HITEC City, Gachibowli, Madhapur, Kondapur, Kukatpally, Secunderabad, Ameerpet, Jubilee Hills, Banjara Hills, and more. We offer free same-day doorstep pickup, professional device inspection, and instant payment.
                    </p>
                    <p className="text-muted-foreground">
                      Trusted by thousands of Hyderabad residents, Laptap makes selling Lenovo laptops quick and hassle-free. Get your instant quote online and receive payment within hours.
                    </p>
                  </div>
                </div>
                <div>
                  <h2 className="text-3xl font-bold mb-6">
                    Why Sell Lenovo Laptop with Laptap in Hyderabad?
                  </h2>
                  <div className="space-y-4">
                    <div className="p-4 bg-card rounded-lg border">
                      <h3 className="font-bold mb-2">Top Market Rates</h3>
                      <p className="text-sm text-muted-foreground">
                        We offer the best prices for Lenovo ThinkPad, IdeaPad, Legion models in Hyderabad - typically 15-20% higher than competitors.
                      </p>
                    </div>
                    <div className="p-4 bg-card rounded-lg border">
                      <h3 className="font-bold mb-2">Free Doorstep Service</h3>
                      <p className="text-sm text-muted-foreground">
                        Verified technicians provide free same-day pickup across all Hyderabad areas including HITEC City.
                      </p>
                    </div>
                    <div className="p-4 bg-card rounded-lg border">
                      <h3 className="font-bold mb-2">Quick & Secure Payment</h3>
                      <p className="text-sm text-muted-foreground">
                        Receive instant payment via UPI, PhonePe, GPay, or cash immediately after verification.
                      </p>
                    </div>
                    <div className="p-4 bg-card rounded-lg border">
                      <h3 className="font-bold mb-2">All Lenovo Models Accepted</h3>
                      <p className="text-sm text-muted-foreground">
                        We buy all Lenovo laptops - ThinkPad, IdeaPad, Legion, Yoga - in any condition.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="py-16 md:py-24 bg-muted/30">
            <div className="container">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Lenovo Laptop Models We Buy in Hyderabad</h2>
              <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
                All Lenovo laptop series accepted - ThinkPad, IdeaPad, Legion, Yoga
              </p>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {[
                  { name: "Lenovo ThinkPad X1 Carbon", series: "Premium Business" },
                  { name: "Lenovo ThinkPad T14, T16", series: "Business Workhorses" },
                  { name: "Lenovo ThinkPad E14, E15", series: "Budget Business" },
                  { name: "Lenovo IdeaPad Slim 5, 7", series: "Premium Consumer" },
                  { name: "Lenovo Legion 5, 7 Pro", series: "Gaming Laptops" },
                  { name: "Lenovo Yoga 9i, 7i", series: "Premium Convertibles" },
                  { name: "Lenovo LOQ 15", series: "Budget Gaming" },
                  { name: "Lenovo IdeaPad Gaming 3", series: "Entry Gaming" },
                  { name: "Lenovo ThinkBook 14, 16", series: "SMB Laptops" },
                ].map((model, index) => (
                  <div key={index} className="p-6 rounded-2xl border-2 border-border bg-card hover:border-primary transition-all">
                    <h3 className="font-bold text-lg mb-2">{model.name}</h3>
                    <p className="text-sm text-muted-foreground">{model.series}</p>
                  </div>
                ))}
              </div>

              <div className="mt-12 text-center">
                <Button variant="cta" size="lg" onClick={() => router.push("/sell")}>
                  Get Started - Sell Lenovo Laptop Now
                </Button>
              </div>
            </div>
          </section>

          <section className="py-16 md:py-24">
            <div className="container">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Ready to Sell Your Lenovo Laptop in Hyderabad?
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Join thousands of satisfied customers in Hyderabad. Get instant quote, free pickup, and immediate payment.
                </p>
              </div>
              <div className="mt-12 text-center">
                <p className="text-sm text-muted-foreground">
                  Also selling other brands? Check out{" "}
                  <Link href="/hyderabad/macbook" className="text-primary hover:underline">Sell MacBook</Link>,{" "}
                  <Link href="/hyderabad/dell" className="text-primary hover:underline">Sell Dell</Link>, or{" "}
                  <Link href="/hyderabad/hp" className="text-primary hover:underline">Sell HP</Link> in Hyderabad
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

