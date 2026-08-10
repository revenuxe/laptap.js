"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Laptop, Monitor, Smartphone, Shield, TrendingUp, Zap, Wrench, FileText } from "lucide-react";
import { DeviceSearch } from "@/components/DeviceSearch";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import SimpleForm from "./SimpleForm";

interface HeroProps {
  location?: string;
  title?: React.ReactNode;
  description?: string;
}

const Hero = ({ location, title, description }: HeroProps = {}) => {
  const router = useRouter();
  const [formOpen, setFormOpen] = useState(false);
  
  const defaultTitle = (
    <>
      Sell Your Laptop, Mobile or Desktop{" "}
      <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
        Instantly
      </span>
    </>
  );
  
  const defaultDescription = "Get the best price for your device with instant quotes, free doorstep pickup, and instant secure payment.";
  return <section className="relative overflow-hidden bg-gradient-to-b from-background via-muted/20 to-background py-8 sm:py-12 md:py-32">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-20 right-10 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="container">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="mb-4 sm:mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-primary">
            <Zap className="h-3 w-3 sm:h-4 sm:w-4" />
            Instant Price Quotes Available
          </div>

          {/* Main heading */}
          <h1 className="mb-4 sm:mb-6 text-2xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-7xl">
            {title || defaultTitle}
          </h1>
          
          <p className="mb-6 sm:mb-8 text-sm sm:text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto">
            {description || defaultDescription}
          </p>

          {/* Search bar */}
          <div className="mb-8 sm:mb-12">
            <DeviceSearch />
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-8 sm:mb-12 px-4 sm:px-0">
            <Button variant="cta" size="lg" onClick={() => router.push("/sell")} className="w-full sm:w-auto sm:min-w-[240px] h-12 sm:h-13 text-sm sm:text-base">
              Sell Now
            </Button>
            <Button variant="outline" size="lg" onClick={() => router.push("/sell")} className="w-full sm:w-auto sm:min-w-[240px] h-12 sm:h-13 text-sm sm:text-base">
              Get Instant Quote
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-8 sm:mb-12 text-xs sm:text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Shield className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
              <span>100% Secure</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <TrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
              <span>Best Market Prices</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Zap className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
              <span>Instant Payment</span>
            </div>
          </div>

          {/* Category cards */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-6 max-w-6xl mx-auto">
            <div className="group cursor-pointer rounded-2xl sm:rounded-3xl border-2 border-border bg-gradient-to-br from-card to-card/50 p-4 sm:p-8 transition-all hover:border-primary hover:shadow-xl hover:scale-105 hover:bg-gradient-to-br hover:from-primary/5 hover:to-card/50" onClick={() => router.push("/sell/laptop")}>
              <div className="mb-3 sm:mb-4 inline-flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-xl sm:rounded-2xl bg-primary/10 transition-all group-hover:bg-primary/20 group-hover:scale-110">
                <Laptop className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              </div>
              <h3 className="text-base sm:text-xl font-bold mb-1 sm:mb-2">Sell Laptop</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Get instant quotes for all laptop brands
              </p>
            </div>

            <div className="group cursor-pointer rounded-2xl sm:rounded-3xl border-2 border-border bg-gradient-to-br from-card to-card/50 p-4 sm:p-8 transition-all hover:border-primary hover:shadow-xl hover:scale-105 hover:bg-gradient-to-br hover:from-orange-500/5 hover:to-card/50" onClick={() => router.push("/repair")}>
              <div className="mb-3 sm:mb-4 inline-flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-xl sm:rounded-2xl bg-orange-500/10 transition-all group-hover:bg-orange-500/20 group-hover:scale-110">
                <Wrench className="h-6 w-6 sm:h-8 sm:w-8 text-orange-500" />
              </div>
              <h3 className="text-base sm:text-xl font-bold mb-1 sm:mb-2">Repair Laptop</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Expert repair services for all brands
              </p>
            </div>

            <div className="group cursor-pointer rounded-2xl sm:rounded-3xl border-2 border-border bg-gradient-to-br from-card to-card/50 p-4 sm:p-8 transition-all hover:border-primary hover:shadow-xl hover:scale-105 hover:bg-gradient-to-br hover:from-primary/5 hover:to-card/50" onClick={() => router.push("/sell/mobile")}>
              <div className="mb-3 sm:mb-4 inline-flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-xl sm:rounded-2xl bg-primary/10 transition-all group-hover:bg-primary/20 group-hover:scale-110">
                <Smartphone className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              </div>
              <h3 className="text-base sm:text-xl font-bold mb-1 sm:mb-2">Sell Mobile</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Get instant quotes for all mobile brands
              </p>
            </div>
            
            <div className="group cursor-pointer rounded-2xl sm:rounded-3xl border-2 border-border bg-gradient-to-br from-card to-card/50 p-4 sm:p-8 transition-all hover:border-primary hover:shadow-xl hover:scale-105 hover:bg-gradient-to-br hover:from-primary/5 hover:to-card/50" onClick={() => router.push("/sell/desktop")}>
              <div className="mb-3 sm:mb-4 inline-flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-xl sm:rounded-2xl bg-primary/10 transition-all group-hover:bg-primary/20 group-hover:scale-110">
                <Monitor className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              </div>
              <h3 className="text-base sm:text-xl font-bold mb-1 sm:mb-2">Sell Desktop</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Best prices for desktop computers
              </p>
            </div>

            <Dialog open={formOpen} onOpenChange={setFormOpen}>
              <DialogTrigger asChild>
                <div className="col-span-2 sm:col-span-2 lg:col-span-1 max-w-[280px] sm:max-w-none mx-auto w-full group cursor-pointer rounded-2xl sm:rounded-3xl border-2 border-border bg-gradient-to-br from-card to-card/50 p-4 sm:p-8 transition-all hover:border-primary hover:shadow-xl hover:scale-105 hover:bg-gradient-to-br hover:from-primary/5 hover:to-card/50">
                  <div className="mb-3 sm:mb-4 inline-flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-xl sm:rounded-2xl bg-primary/10 transition-all group-hover:bg-primary/20 group-hover:scale-110">
                    <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                  </div>
                  <h3 className="text-base sm:text-xl font-bold mb-1 sm:mb-2">Simple Form</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Quick inquiry form
                  </p>
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Get Quick Quote</DialogTitle>
                  <DialogDescription>
                    Fill in your details and we'll get back to you with the best price.
                  </DialogDescription>
                </DialogHeader>
                <SimpleForm onSuccess={() => setFormOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </section>;
};
export default Hero;