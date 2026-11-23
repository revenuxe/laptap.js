import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Script from "next/script";
import { Suspense } from "react";
import PageLoader from "@/components/PageLoader";
import OfflineNotice from '@/components/OfflineNotice';
import ScrollToTop from "@/components/ScrollToTop";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://www.laptap.in"),
  title: {
    default: "Sell Used Laptop & Desktop in Bangalore | Laptap",
    template: "%s | Laptap",
  },
  description:
    "Sell your used laptop or desktop in Bangalore. Choose your model, share its condition, and discuss assessment and pickup availability with Laptap.",
  keywords: [
    "sell laptop bangalore",
    "sell desktop",
    "used laptops",
    "refurbished laptops",
    "pre-owned tech",
    "instant quote",
    "doorstep pickup",
    "laptop buyback",
  ],
  authors: [{ name: "Laptap" }],
  openGraph: {
    type: "website",
    url: "https://www.laptap.in/",
    title: "Sell Used Laptop & Desktop in Bangalore | Laptap",
    description:
      "Choose your laptop or desktop, share the details, and discuss assessment and pickup in Bangalore.",
    siteName: "Laptap",
    locale: "en_IN",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sell Used Laptop & Desktop in Bangalore | Laptap",
    description:
      "Choose your laptop or desktop, share the details, and discuss assessment and pickup in Bangalore.",
    images: ["/opengraph-image"],
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
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'Organization', name: 'Laptap', url: 'https://www.laptap.in', logo: 'https://www.laptap.in/assets/laptop_logo.webp', description: "We're currently offline and are not accepting orders or enquiries. We'll be back soon." }) }} />
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
        <a href="#main-content" className="skip-link">Skip to content</a>
        <Suspense fallback={null}>
          <PageLoader />
        </Suspense>
        <ScrollToTop />
        <Providers><OfflineNotice />{children}</Providers>
      </body>
    </html>
  );
}
