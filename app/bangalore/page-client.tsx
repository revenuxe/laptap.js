"use client";


import Header from "@/components/Header";
import Hero from "@/components/Hero";
import CategorySection from "@/components/CategorySection";
import Features from "@/components/Features";
import Stats from "@/components/Stats";
import ProcessSteps from "@/components/ProcessSteps";
import TrustSignals from "@/components/TrustSignals";
import { BrandsSection } from "@/components/BrandsSection";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import AreasWeService from "@/components/AreasWeService";
import FAQ from "@/components/FAQ";
import QuickLinks from "@/components/QuickLinks";

export const PageClient = () => {
  return (
    <>
      

      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <Hero 
            location="Bangalore"
            title={
              <>
                Sell Used Laptop in Bangalore{" "}
                <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  for Instant Cash
                </span>
              </>
            }
            description="Bangalore's most trusted platform for selling old laptops, mobiles & desktops. Get instant cash for MacBook, Dell, HP, Lenovo, iPhone & all brands. Free same-day pickup across all areas with instant payment via UPI or cash."
          />
          <CategorySection />
          <Stats />
          <BrandsSection />
          <Features />
          <TrustSignals />
          <AreasWeService 
            city="Bangalore"
            areas={[
              "Koramangala", "Indiranagar", "Whitefield", "Electronic City",
              "HSR Layout", "Marathahalli", "BTM Layout", "Jayanagar",
              "JP Nagar", "Banashankari", "Malleshwaram", "Rajajinagar",
              "Yelahanka", "Hebbal", "Bellandur", "Sarjapur Road",
              "Bommanahalli", "Bannerghatta Road", "RT Nagar", "Sadashivanagar",
              "CV Raman Nagar", "Frazer Town", "Domlur", "KR Puram",
              "Mahadevapura", "Varthur", "Kadugodi", "Brookefield"
            ]}
          />
          <FAQ location="Bangalore" />
        </main>
        <QuickLinks />
        <Footer />
        <WhatsAppFloat />
      </div>
    </>
  );
};

