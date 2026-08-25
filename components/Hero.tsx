"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Laptop, Monitor, Shield, TrendingUp, Zap, Wrench, FileText } from "lucide-react";
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
  const [formOpen, setFormOpen] = useState(false);
  
  const defaultTitle = (
    <>
      Sell Your Laptop or Desktop{" "}
      <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
        Instantly
      </span>
    </>
  );
  
  const defaultDescription = "Get the best price for your device with instant quotes, free doorstep pickup, and instant secure payment.";
  
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background via-muted/20 to-background py-6 sm:py-8 md:py-12">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-10 left-10 h-60 w-60 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-10 right-10 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="container">
        <div className="mx-auto max-w-4xl text-center">
          {/* Main heading */}
          <h1 className="mb-3 sm:mb-4 text-2xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
            {title || defaultTitle}
          </h1>
          
          <p className="mb-4 sm:mb-6 text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            {description || defaultDescription}
          </p>

          {/* Search bar */}
          <div className="mb-5 sm:mb-6">
            <DeviceSearch />
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-6 sm:mb-8 px-4 sm:px-0">
            <Button variant="cta" size="lg" asChild className="w-full sm:w-auto sm:min-w-[220px] h-11 sm:h-12 text-sm sm:text-base">
              <Link href="/sell/laptop">Sell Now</Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="w-full sm:w-auto sm:min-w-[220px] h-11 sm:h-12 text-sm sm:text-base">
              <Link href="/sell/laptop">Get Instant Quote</Link>
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-6 sm:mb-8 text-xs sm:text-sm text-muted-foreground">
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
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-5xl mx-auto">
            <Link href="/sell/laptop" className="group block overflow-hidden rounded-2xl border border-slate-200 bg-white p-0 shadow-[0_8px_22px_-14px_rgba(15,23,42,0.42)] ring-1 ring-slate-100 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_18px_32px_-16px_rgba(37,99,235,0.45)] dark:border-slate-700 dark:bg-card dark:ring-slate-800">
              <div className="flex h-28 items-center justify-center bg-[#e9f5f3] sm:h-36"><img src="/assets/sell-laptop-cutout.webp" alt="Laptop" className="h-full w-full object-contain p-2" /></div>
              <div className="p-3 text-center"><h3 className="text-sm font-bold text-slate-900 sm:text-base dark:text-white">Sell Laptops</h3><p className="mt-1 text-[11px] text-muted-foreground">Select your model</p></div>
            </Link>

            <Link href="/repair" className="group block overflow-hidden rounded-2xl border border-slate-200 bg-white p-0 shadow-[0_8px_22px_-14px_rgba(15,23,42,0.42)] ring-1 ring-slate-100 transition-all duration-300 hover:-translate-y-1 hover:border-orange-400/50 hover:shadow-[0_18px_32px_-16px_rgba(234,88,12,0.45)] dark:border-slate-700 dark:bg-card dark:ring-slate-800">
              <div className="flex h-28 items-center justify-center bg-[#e9f5f3] sm:h-36"><img src="/assets/repair-laptop-cutout.webp" alt="Laptop repair" className="h-full w-full object-contain p-2" /></div>
              <div className="p-3 text-center"><h3 className="text-sm font-bold text-slate-900 sm:text-base dark:text-white">Repair Laptops</h3><p className="mt-1 text-[11px] text-muted-foreground">Trusted service experts</p></div>
            </Link>
            
            <Link href="/sell/desktop" className="group block overflow-hidden rounded-2xl border border-slate-200 bg-white p-0 shadow-[0_8px_22px_-14px_rgba(15,23,42,0.42)] ring-1 ring-slate-100 transition-all duration-300 hover:-translate-y-1 hover:border-violet-400/50 hover:shadow-[0_18px_32px_-16px_rgba(124,58,237,0.45)] dark:border-slate-700 dark:bg-card dark:ring-slate-800">
              <div className="flex h-28 items-center justify-center bg-[#e9f5f3] sm:h-36"><img src="/assets/sell-desktop-cutout.webp" alt="Desktop computer" className="h-full w-full object-contain p-2" /></div>
              <div className="p-3 text-center"><h3 className="text-sm font-bold text-slate-900 sm:text-base dark:text-white">Sell Desktops</h3><p className="mt-1 text-[11px] text-muted-foreground">Select your model</p></div>
            </Link>

            <Dialog open={formOpen} onOpenChange={setFormOpen}>
              <DialogTrigger asChild>
                <div className="group cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white p-0 shadow-[0_8px_22px_-14px_rgba(15,23,42,0.42)] ring-1 ring-slate-100 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-400/50 hover:shadow-[0_18px_32px_-16px_rgba(5,150,105,0.45)] dark:border-slate-700 dark:bg-card dark:ring-slate-800">
                  <div className="flex h-28 items-center justify-center bg-[#e7f6ee] sm:h-36">
                    <FileText className="h-12 w-12 text-emerald-600 transition-transform duration-300 group-hover:scale-110" />
                  </div>
                  <div className="p-3 text-center"><h3 className="text-sm font-bold text-slate-900 sm:text-base dark:text-white">Simple Form</h3><p className="mt-1 text-[11px] text-muted-foreground">We’ll call you back</p></div>
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
    </section>
  );
};

export default Hero;
