import type { Metadata } from "next";
import { PageClient } from "./page-client";

export const metadata: Metadata = {
  title: "Sell Used Laptop in Bangalore | Best Prices, Free Pickup - Laptap",
  description: "Sell your used laptop at the best price with free doorstep pickup and instant cash payment.",
  alternates: { canonical: "https://www.laptap.in/bangalore" },
};

export default function Page() {
  return <PageClient />;
}