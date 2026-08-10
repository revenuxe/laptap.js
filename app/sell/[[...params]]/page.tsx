import type { Metadata } from "next";
import { SellClient } from "./sell-client";

export const metadata: Metadata = {
  title: "Sell Your Laptop, Desktop or Mobile | Get Instant Quote - Laptap",
  description:
    "Sell your used laptop, desktop, or mobile phone for the best price. Get an instant quote, free doorstep pickup, and instant cash payment. Trusted by 10,000+ sellers.",
  keywords: [
    "sell laptop",
    "sell desktop",
    "sell mobile",
    "instant quote",
    "laptop buyback",
    "sell used laptop online",
    "best price for old laptop",
  ],
  alternates: { canonical: "https://www.laptap.in/sell" },
  openGraph: {
    title: "Sell Your Used Laptop, Desktop or Mobile | Laptap",
    description: "Get instant cash for your used electronics. Best prices guaranteed.",
    url: "https://www.laptap.in/sell",
  },
};

export default function SellPage() {
  return <SellClient />;
}