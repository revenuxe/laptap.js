"use client";


import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Monitor } from "lucide-react";

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
                  <Monitor className="h-4 w-4" />
                  iMac Desktop
                </div>

                <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                  Sell Your iMac Desktop for{" "}
                  <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    Best Price
                  </span>
                </h1>

                <p className="mb-8 text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto">
                  Get instant cash for iMac desktops. All models accepted with free doorstep pickup and instant payment.
                </p>

                <Button variant="cta" size="lg" onClick={() => router.push("/sell/desktop")}>
                  Get Instant Quote
                </Button>

                <div className="mt-16 p-8 bg-muted/30 rounded-2xl">
                  <h2 className="text-2xl font-bold mb-4 text-center">Related Products</h2>
                  <div className="flex flex-wrap gap-4 justify-center">
                    <Link href="/models/macbook-pro" className="text-primary hover:underline font-medium">
                      Sell MacBook Pro
                    </Link>
                    <span className="text-muted-foreground">Ã¢â‚¬Â¢</span>
                    <Link href="/models/dell-xps" className="text-primary hover:underline font-medium">
                      Sell Dell XPS
                    </Link>
                    <span className="text-muted-foreground">Ã¢â‚¬Â¢</span>
                    <Link href="/bangalore" className="text-primary hover:underline font-medium">
                      Sell in Bangalore
                    </Link>
                    <span className="text-muted-foreground">Ã¢â‚¬Â¢</span>
                    <Link href="/blog" className="text-primary hover:underline font-medium">
                      Read Our Blog
                    </Link>
                    <span className="text-muted-foreground">Ã¢â‚¬Â¢</span>
                    <Link href="/" className="text-primary hover:underline font-medium">
                      Homepage
                    </Link>
                  </div>
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


