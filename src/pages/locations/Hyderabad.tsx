import { Helmet } from "react-helmet-async";
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

const Hyderabad = () => {
  return (
    <>
      <Helmet>
        <title>Sell Old Laptop, Mobile & Desktop in Hyderabad | Instant Cash Payment at Doorstep | Laptap</title>
        <meta name="description" content="Sell your used laptop, mobile phone, or desktop computer for instant cash in Hyderabad. Free same-day doorstep pickup across all areas - Madhapur, Hitech City, Gachibowli, Banjara Hills, Jubilee Hills, Secunderabad. Get best market prices with instant payment within 24 hours. Trusted by 10,000+ Hyderabad sellers." />
        <meta name="keywords" content="sell old laptop Hyderabad, sell used laptop Hyderabad online, sell mobile phone Hyderabad, sell desktop computer Hyderabad, laptop buyback Hyderabad, instant cash for laptop Hyderabad, sell MacBook Hyderabad, sell iPhone Hyderabad, sell gaming laptop Hyderabad, sell laptop Madhapur, sell laptop Hitech City, sell laptop Gachibowli, sell laptop Banjara Hills, sell laptop Jubilee Hills, sell laptop Secunderabad, sell laptop Kukatpally, best price old laptop Hyderabad, laptop resale Hyderabad, sell broken laptop Hyderabad, doorstep laptop pickup Hyderabad, instant payment laptop sale Hyderabad, quick cash electronics Hyderabad, second hand laptop buyer Hyderabad" />
        
        <meta property="og:title" content="Sell Old Laptop, Mobile & Desktop in Hyderabad for Instant Cash | Laptap" />
        <meta property="og:description" content="Hyderabad's most trusted platform for selling used electronics. Free same-day pickup across Madhapur, Hitech City, Gachibowli, Banjara Hills & all areas. Best prices guaranteed with instant payment." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.laptap.in/hyderabad" />
        <meta property="og:image" content="https://www.laptap.in/og-image-hyderabad.jpg" />
        <meta property="og:locale" content="en_IN" />
        <meta property="og:site_name" content="Laptap Hyderabad" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Sell Old Laptop & Mobile in Hyderabad for Instant Cash | Laptap" />
        <meta name="twitter:description" content="Hyderabad's #1 platform for selling used electronics. Free doorstep pickup, best prices, instant payment across all Hyderabad areas." />
        <meta name="twitter:image" content="https://www.laptap.in/twitter-image-hyderabad.jpg" />
        
        <link rel="canonical" href="https://www.laptap.in/hyderabad" />
        <link rel="alternate" hrefLang="en-IN" href="https://www.laptap.in/hyderabad" />
        <link rel="alternate" hrefLang="en" href="https://www.laptap.in/hyderabad" />
        <link rel="alternate" hrefLang="x-default" href="https://www.laptap.in/hyderabad" />
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.laptap.in" },
              { "@type": "ListItem", "position": 2, "name": "Hyderabad", "item": "https://www.laptap.in/hyderabad" }
            ]
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "Laptap Hyderabad",
            "description": "Hyderabad's most trusted platform for selling used laptops, mobile phones, and desktop computers with instant cash payment and free same-day doorstep pickup",
            "url": "https://www.laptap.in/hyderabad",
            "telephone": "+916360039957",
            "priceRange": "₹₹",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Hyderabad",
              "addressRegion": "Telangana",
              "postalCode": "500001",
              "addressCountry": "IN"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": "17.3850",
              "longitude": "78.4867"
            },
            "areaServed": [
              { "@type": "City", "name": "Hyderabad" },
              { "@type": "Neighborhood", "name": "Madhapur" },
              { "@type": "Neighborhood", "name": "Hitech City" },
              { "@type": "Neighborhood", "name": "Gachibowli" },
              { "@type": "Neighborhood", "name": "Banjara Hills" },
              { "@type": "Neighborhood", "name": "Jubilee Hills" },
              { "@type": "Neighborhood", "name": "Secunderabad" },
              { "@type": "Neighborhood", "name": "Kukatpally" }
            ],
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "bestRating": "5",
              "worstRating": "1",
              "reviewCount": "4235"
            },
            "review": [
              {
                "@type": "Review",
                "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
                "author": { "@type": "Person", "name": "Srinivas Reddy" },
                "reviewBody": "Excellent service in Hitech City! Got best price for my HP laptop. Instant UPI payment."
              },
              {
                "@type": "Review",
                "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
                "author": { "@type": "Person", "name": "Lakshmi Devi" },
                "reviewBody": "Sold my old MacBook in Gachibowli. Very professional team and quick process."
              },
              {
                "@type": "Review",
                "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
                "author": { "@type": "Person", "name": "Mohammed Irfan" },
                "reviewBody": "Best laptop buyers in Hyderabad. Same-day pickup from Jubilee Hills. Highly recommend!"
              }
            ],
            "offers": {
              "@type": "Offer",
              "description": "Instant cash payment for used laptops, mobiles, and desktops with free same-day doorstep pickup across Hyderabad"
            }
          })}
        </script>
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "Which areas in Hyderabad do you provide doorstep pickup?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "We provide free same-day doorstep pickup across all areas of Hyderabad including Madhapur, Hitech City, Gachibowli, Banjara Hills, Jubilee Hills, Secunderabad, Kukatpally, Ameerpet, Begumpet, and all other localities. Our verified technicians will visit your location at your convenient time."
                }
              },
              {
                "@type": "Question",
                "name": "How do I sell my laptop in Hyderabad?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Selling your laptop in Hyderabad is simple: 1) Select your device model and get an instant quote online, 2) Schedule a free doorstep pickup at your preferred time and location, 3) Our verified technician will visit to inspect the device, 4) Receive instant payment immediately after verification via UPI, bank transfer, or cash."
                }
              },
              {
                "@type": "Question",
                "name": "How quickly will I receive payment in Hyderabad?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "You receive instant payment immediately after our technician verifies your device during the doorstep pickup. We support multiple payment methods including UPI, direct bank transfer, and digital wallets for your convenience."
                }
              },
              {
                "@type": "Question",
                "name": "What brands of laptops do you buy in Hyderabad?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "We buy all major laptop brands in Hyderabad including Apple MacBook, Dell, HP, Lenovo, Asus, Acer, MSI, Microsoft Surface, Samsung, and more. We accept laptops in any condition - working, damaged, or broken."
                }
              }
            ]
          })}
        </script>
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <Hero 
            location="Hyderabad"
            title={
              <>
                Sell Used Laptop in Hyderabad{" "}
                <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  for Instant Cash
                </span>
              </>
            }
            description="Hyderabad's most trusted platform for selling old laptops, mobiles & desktops. Get instant cash for MacBook, Dell, HP, Lenovo, iPhone & all brands. Free same-day pickup across all areas with instant payment via UPI or cash."
          />
          <CategorySection />
          <Stats />
          <BrandsSection />
          <Features />
          <TrustSignals />
          <AreasWeService 
            city="Hyderabad"
            areas={[
              "Madhapur", "Hitech City", "Gachibowli", "Banjara Hills",
              "Jubilee Hills", "Secunderabad", "Kukatpally", "Ameerpet",
              "Begumpet", "Kondapur", "Miyapur", "KPHB",
              "Nizampet", "Kompally", "Alwal", "Sainikpuri",
              "Uppal", "LB Nagar", "Dilsukhnagar", "Malakpet",
              "Attapur", "Tolichowki", "Mehdipatnam", "Masab Tank",
              "Nampally", "Abids", "Charminar", "Shamshabad"
            ]}
          />
          <FAQ location="Hyderabad" />
        </main>
        <QuickLinks />
        <Footer />
        <WhatsAppFloat />
      </div>
    </>
  );
};

export default Hyderabad;
