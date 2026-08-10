import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://www.laptap.in"),
  title: {
    default: "Sell Used Laptop and Desktop in Bangalore | Same-Day Cash – Laptap",
    template: "%s | Laptap",
  },
  description:
    "Sell used laptop & desktop in Bangalore at the best price. Instant quote, same-day pickup, quick cash, and 500+ happy customers. Trusted, safe & hassle-free",
  keywords: [
    "sell laptop bangalore",
    "sell desktop",
    "used laptops",
    "refurbished laptops",
    "pre-owned tech",
    "instant quote",
    "doorstep pickup",
    "laptop buyback",
    "hbr layout",
    "nagawara",
  ],
  authors: [{ name: "Laptap" }],
  openGraph: {
    type: "website",
    url: "https://www.laptap.in/",
    title: "Sell Used Laptop and Desktop in Bangalore | Same-Day Cash – Laptap",
    description:
      "Sell used laptop & desktop in Bangalore at the best price. Instant quote, same-day pickup, quick cash, and 500+ happy customers.",
    siteName: "Laptap",
    locale: "en_IN",
    images: [{ url: "/og-image.webp", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sell Used Laptop and Desktop in Bangalore | Same-Day Cash – Laptap",
    description:
      "Sell used laptop & desktop in Bangalore at the best price. Instant quote, same-day pickup, quick cash, and 500+ happy customers.",
    images: ["/og-image.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: "https://www.laptap.in",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-IN">
      <head>
        <link rel="canonical" href="https://www.laptap.in/" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Laptap",
              url: "https://www.laptap.in",
              logo: "https://www.laptap.in/logo.png",
              description: "India's most trusted platform for selling used laptops and desktops",
              address: {
                "@type": "PostalAddress",
                streetAddress: "HBR Layout, Nagawara Main Road",
                addressLocality: "Bangalore",
                addressRegion: "Karnataka",
                postalCode: "560045",
                addressCountry: "IN",
              },
              contactPoint: {
                "@type": "ContactPoint",
                email: "laptap.in@gmail.com",
                contactType: "Customer Service",
                areaServed: "IN",
                availableLanguage: ["English", "Hindi"],
              },
              sameAs: [],
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
              image: "https://www.laptap.in/logo.png",
              priceRange: "₹₹",
              address: {
                "@type": "PostalAddress",
                streetAddress: "HBR Layout, Nagawara Main Road",
                addressLocality: "Bangalore",
                addressRegion: "Karnataka",
                postalCode: "560045",
                addressCountry: "IN",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: "13.0358",
                longitude: "77.6431",
              },
              url: "https://www.laptap.in",
              email: "laptap.in@gmail.com",
              openingHoursSpecification: [
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                  opens: "10:00",
                  closes: "19:00",
                },
              ],
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.8",
                reviewCount: "500",
              },
            }),
          }}
        />
        {/* Google Analytics 4 */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
          strategy="afterInteractive"
        />
        <Script id="ga4" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX');
          `}
        </Script>
      </head>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
