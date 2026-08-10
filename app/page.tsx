import type { Metadata } from "next";
import { HomeClient } from "./home-client";

export const metadata: Metadata = {
  title: "Sell Old Laptop & Desktop Online in Bengaluru | Instant Cash Payment | Laptap",
  description:
    "Sell your old laptop or desktop computer for instant cash in Bengaluru. Get best prices, free doorstep pickup, instant payment within 24 hours. Trusted by 10,000+ sellers across India.",
  keywords: [
    "sell old laptop Bengaluru",
    "sell used laptop online",
    "sell desktop computer",
    "laptop buyback India",
    "instant cash for laptop",
    "sell MacBook Bengaluru",
    "sell gaming laptop",
    "sell Dell laptop",
    "sell HP laptop",
    "sell Lenovo laptop",
    "best price for old laptop",
    "laptop resale value",
    "sell broken laptop",
    "doorstep laptop pickup Bengaluru",
    "instant payment laptop sale",
    "quick cash for electronics Bengaluru",
  ],
  openGraph: {
    title: "Sell Old Laptop & Desktop for Instant Cash | Laptap Bengaluru",
    description:
      "Get the best price for your used electronics. Free pickup, instant evaluation, and payment within 24 hours. Bengaluru's most trusted platform for selling laptops.",
    type: "website",
    url: "https://www.laptap.in",
    images: [{ url: "/og-image.jpg" }],
    locale: "en_IN",
    siteName: "Laptap",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sell Old Laptop & Desktop for Instant Cash | Laptap",
    description:
      "Bengaluru's trusted platform for selling used electronics. Best prices, free pickup, instant payment.",
    images: ["/twitter-image.jpg"],
  },
  alternates: {
    canonical: "https://www.laptap.in",
    languages: {
      "en-IN": "https://www.laptap.in",
      en: "https://www.laptap.in",
      "x-default": "https://www.laptap.in",
    },
  },
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Laptap",
            url: "https://www.laptap.in",
            potentialAction: {
              "@type": "SearchAction",
              target: "https://www.laptap.in/sell?q={search_term_string}",
              "query-input": "required name=search_term_string",
            },
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: "Laptap",
            description:
              "Bengaluru's most trusted platform for selling used laptops and desktop computers with instant cash payment",
            url: "https://www.laptap.in",
            telephone: "+919886579923",
            priceRange: "₹₹",
            address: {
              "@type": "PostalAddress",
              streetAddress: "HBR Layout, Nagawara Main Road",
              addressLocality: "Bengaluru",
              addressRegion: "Karnataka",
              postalCode: "560045",
              addressCountry: "IN",
            },
            geo: {
              "@type": "GeoCoordinates",
              latitude: "12.9716",
              longitude: "77.5946",
            },
            areaServed: { "@type": "City", name: "Bengaluru" },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: "4.8",
              bestRating: "5",
              worstRating: "1",
              reviewCount: "10000",
            },
            review: [
              {
                "@type": "Review",
                reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
                author: { "@type": "Person", name: "Rahul Sharma" },
                reviewBody:
                  "Excellent service! Got the best price for my MacBook Pro. Quick pickup and instant payment. Highly recommended!",
              },
              {
                "@type": "Review",
                reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
                author: { "@type": "Person", name: "Priya Singh" },
                reviewBody:
                  "Very professional team. Sold my Dell XPS in Koramangala. Same-day pickup and instant UPI payment.",
              },
              {
                "@type": "Review",
                reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
                author: { "@type": "Person", name: "Arun Kumar" },
                reviewBody:
                  "Best platform for selling old laptops in Bangalore. Got 20% more than other buyers offered.",
              },
            ],
            offers: {
              "@type": "Offer",
              description: "Instant cash for used laptops and desktops",
            },
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "How do I sell my laptop to Laptap?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Simply select your device, get an instant quote, schedule a pickup, and receive instant payment after verification. Our technicians will come to your doorstep for free pickup.",
                },
              },
              {
                "@type": "Question",
                name: "How quickly will I receive payment?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "You receive instant payment immediately after our technicians verify your device during pickup. We support multiple payment methods including UPI, bank transfer, and digital wallets.",
                },
              },
              {
                "@type": "Question",
                name: "Is doorstep pickup available?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes, we offer free same-day doorstep pickup across Bangalore. Our verified technicians will come to your location at your preferred time.",
                },
              },
            ],
          }),
        }}
      />
      <HomeClient />
    </>
  );
}
