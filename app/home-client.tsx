"use client";

import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ReferralCard from "@/components/ReferralCard";
import CategorySection from "@/components/CategorySection";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import Stats from "@/components/Stats";
import ProcessSteps from "@/components/ProcessSteps";
import TrustSignals from "@/components/TrustSignals";
import { BrandsSection } from "@/components/BrandsSection";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import FAQ from "@/components/FAQ";
import QuickLinks from "@/components/QuickLinks";

export function HomeClient() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        
        {/* Referral Card Section */}
        <section className="py-8 sm:py-12 bg-muted/30">
          <div className="container max-w-2xl px-4">
            <ReferralCard />
          </div>
        </section>
        
        <CategorySection />
        <Stats />
        <BrandsSection />
        <Features />
        <FAQ />
      </main>
      <QuickLinks />
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
