import type { Metadata } from "next";
import { PageClient } from "./page-client";

export const metadata: Metadata = {
  title: "How to Sell Used Laptop in Bangalore - Complete Guide | Laptap",
  description: "Complete guide to selling your used laptop in Bangalore. Get the best price, free pickup, and instant cash payment.",
  alternates: { canonical: "https://www.laptap.in/blog/sell-used-laptop-bangalore" },
};

export default function Page() {
  return <PageClient />;
}