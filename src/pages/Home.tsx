import { Helmet } from "react-helmet-async";
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
const Home = () => {
  return <>
      <Helmet>
        <title>Sell Old Laptop, Mobile & Desktop Online in Bengaluru | Instant Cash Payment | Laptap</title>
        <meta name="description" content="Sell your old laptop, mobile phone, or desktop computer for instant cash in Bengaluru. Get best prices, free doorstep pickup, instant payment within 24 hours. Trusted by 10,000+ sellers across India." />
        <meta name="keywords" content="sell old laptop Bengaluru, sell used laptop online, sell mobile phone Bengaluru, sell desktop computer, laptop buyback India, instant cash for laptop, sell MacBook Bengaluru, sell iPhone Bengaluru, sell gaming laptop, sell Dell laptop, sell HP laptop, sell Lenovo laptop, best price for old laptop, laptop resale value, sell broken laptop, doorstep laptop pickup Bengaluru, instant payment laptop sale, quick cash for electronics Bengaluru" />
        <meta property="og:title" content="Sell Old Laptop, Mobile & Desktop for Instant Cash | Laptap Bengaluru" />
        <meta property="og:description" content="Get the best price for your used electronics. Free pickup, instant evaluation, and payment within 24 hours. Bengaluru's most trusted platform for selling laptops and mobiles." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.laptap.in" />
        <meta property="og:image" content="https://www.laptap.in/og-image.jpg" />
        <meta property="og:locale" content="en_IN" />
        <meta property="og:site_name" content="Laptap" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Sell Old Laptop, Mobile & Desktop for Instant Cash | Laptap" />
        <meta name="twitter:description" content="Bengaluru's trusted platform for selling used electronics. Best prices, free pickup, instant payment." />
        <meta name="twitter:image" content="https://www.laptap.in/twitter-image.jpg" />
        
        <link rel="canonical" href="https://www.laptap.in" />
        <link rel="alternate" hrefLang="en-IN" href="https://www.laptap.in" />
        <link rel="alternate" hrefLang="en" href="https://www.laptap.in" />
        <link rel="alternate" hrefLang="x-default" href="https://www.laptap.in" />
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Laptap",
            "url": "https://www.laptap.in",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://www.laptap.in/sell?q={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "Laptap",
            "description": "Bengaluru's most trusted platform for selling used laptops, mobile phones, and desktop computers with instant cash payment",
            "url": "https://www.laptap.in",
            "telephone": "+919886579923",
            "priceRange": "₹₹",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "HBR Layout, Nagawara Main Road",
              "addressLocality": "Bengaluru",
              "addressRegion": "Karnataka",
              "postalCode": "560045",
              "addressCountry": "IN"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": "12.9716",
              "longitude": "77.5946"
            },
            "areaServed": {
              "@type": "City",
              "name": "Bengaluru"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "bestRating": "5",
              "worstRating": "1",
              "reviewCount": "10000"
            },
            "review": [
              {
                "@type": "Review",
                "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
                "author": { "@type": "Person", "name": "Rahul Sharma" },
                "reviewBody": "Excellent service! Got the best price for my MacBook Pro. Quick pickup and instant payment. Highly recommended!"
              },
              {
                "@type": "Review",
                "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
                "author": { "@type": "Person", "name": "Priya Singh" },
                "reviewBody": "Very professional team. Sold my Dell XPS in Koramangala. Same-day pickup and instant UPI payment."
              },
              {
                "@type": "Review",
                "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
                "author": { "@type": "Person", "name": "Arun Kumar" },
                "reviewBody": "Best platform for selling old laptops in Bangalore. Got 20% more than other buyers offered."
              }
            ],
            "offers": {
              "@type": "Offer",
              "description": "Instant cash for used laptops, mobiles, and desktops"
            }
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [{
              "@type": "Question",
              "name": "How do I sell my laptop to Laptap?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Simply select your device, get an instant quote, schedule a pickup, and receive instant payment after verification. Our technicians will come to your doorstep for free pickup."
              }
            }, {
              "@type": "Question",
              "name": "How quickly will I receive payment?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "You receive instant payment immediately after our technicians verify your device during pickup. We support multiple payment methods including UPI, bank transfer, and digital wallets."
              }
            }, {
              "@type": "Question",
              "name": "Is doorstep pickup available?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes, we offer free same-day doorstep pickup across Bangalore. Our verified technicians will come to your location at your preferred time."
              }
            }]
          })}
        </script>
      </Helmet>

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
    </>;
};
export default Home;