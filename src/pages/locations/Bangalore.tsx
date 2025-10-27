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

const Bangalore = () => {
  return (
    <>
      <Helmet>
        <title>Sell Old Laptop, Mobile & Desktop in Bangalore | Instant Cash Payment at Doorstep | Laptap</title>
        <meta name="description" content="Sell your used laptop, mobile phone, or desktop computer for instant cash in Bangalore. Free same-day doorstep pickup across all areas - Koramangala, Indiranagar, Whitefield, Electronic City, HSR Layout. Get best market prices with instant payment within 24 hours. Trusted by 10,000+ Bangalore sellers." />
        <meta name="keywords" content="sell old laptop Bangalore, sell used laptop Bangalore online, sell mobile phone Bangalore, sell desktop computer Bangalore, laptop buyback Bangalore, instant cash for laptop Bangalore, sell MacBook Bangalore, sell iPhone Bangalore, sell gaming laptop Bangalore, sell laptop Koramangala, sell laptop Indiranagar, sell laptop Whitefield, sell laptop Electronic City, sell laptop HSR Layout, sell laptop Marathahalli, sell laptop BTM Layout, best price old laptop Bangalore, laptop resale Bangalore, sell broken laptop Bangalore, doorstep laptop pickup Bangalore, instant payment laptop sale Bangalore, quick cash electronics Bangalore, second hand laptop buyer Bangalore" />
        
        <meta property="og:title" content="Sell Old Laptop, Mobile & Desktop in Bangalore for Instant Cash | Laptap" />
        <meta property="og:description" content="Bangalore's most trusted platform for selling used electronics. Free same-day pickup across Koramangala, Indiranagar, Whitefield, Electronic City & all areas. Best prices guaranteed with instant payment." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://laptap.in/bangalore" />
        <meta property="og:image" content="https://laptap.in/og-image-bangalore.jpg" />
        <meta property="og:locale" content="en_IN" />
        <meta property="og:site_name" content="Laptap Bangalore" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Sell Old Laptop & Mobile in Bangalore for Instant Cash | Laptap" />
        <meta name="twitter:description" content="Bangalore's #1 platform for selling used electronics. Free doorstep pickup, best prices, instant payment across all Bangalore areas." />
        <meta name="twitter:image" content="https://laptap.in/twitter-image-bangalore.jpg" />
        
        <link rel="canonical" href="https://laptap.in/bangalore" />
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "Laptap Bangalore",
            "description": "Bangalore's most trusted platform for selling used laptops, mobile phones, and desktop computers with instant cash payment and free same-day doorstep pickup",
            "url": "https://laptap.in/bangalore",
            "telephone": "+919886285028",
            "priceRange": "₹₹",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Bangalore",
              "addressRegion": "Karnataka",
              "postalCode": "560001",
              "addressCountry": "IN"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": "12.9716",
              "longitude": "77.5946"
            },
            "areaServed": [
              {
                "@type": "City",
                "name": "Bangalore"
              },
              {
                "@type": "Neighborhood",
                "name": "Koramangala"
              },
              {
                "@type": "Neighborhood",
                "name": "Indiranagar"
              },
              {
                "@type": "Neighborhood",
                "name": "Whitefield"
              },
              {
                "@type": "Neighborhood",
                "name": "Electronic City"
              },
              {
                "@type": "Neighborhood",
                "name": "HSR Layout"
              },
              {
                "@type": "Neighborhood",
                "name": "Marathahalli"
              },
              {
                "@type": "Neighborhood",
                "name": "BTM Layout"
              }
            ],
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.9",
              "reviewCount": "5847"
            },
            "offers": {
              "@type": "Offer",
              "description": "Instant cash payment for used laptops, mobiles, and desktops with free same-day doorstep pickup across Bangalore"
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
                "name": "Which areas in Bangalore do you provide doorstep pickup?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "We provide free same-day doorstep pickup across all areas of Bangalore including Koramangala, Indiranagar, Whitefield, Electronic City, HSR Layout, Marathahalli, BTM Layout, Jayanagar, JP Nagar, and all other localities. Our verified technicians will visit your location at your convenient time."
                }
              },
              {
                "@type": "Question",
                "name": "How do I sell my laptop in Bangalore?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Selling your laptop in Bangalore is simple: 1) Select your device model and get an instant quote online, 2) Schedule a free doorstep pickup at your preferred time and location, 3) Our verified technician will visit to inspect the device, 4) Receive instant payment immediately after verification via UPI, bank transfer, or cash."
                }
              },
              {
                "@type": "Question",
                "name": "How quickly will I receive payment in Bangalore?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "You receive instant payment immediately after our technician verifies your device during the doorstep pickup. We support multiple payment methods including UPI, direct bank transfer, and digital wallets for your convenience."
                }
              },
              {
                "@type": "Question",
                "name": "What brands of laptops do you buy in Bangalore?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "We buy all major laptop brands in Bangalore including Apple MacBook, Dell, HP, Lenovo, Asus, Acer, MSI, Microsoft Surface, Samsung, and more. We accept laptops in any condition - working, damaged, or broken."
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
        </main>
        <Footer />
        <WhatsAppFloat />
      </div>
    </>
  );
};

export default Bangalore;
