import type { Metadata } from "next";
import { PageClient } from "./page-client";

export const metadata: Metadata = {
  title: "Sell ASUS ROG Gaming Laptop | Best Price - Laptap",
  description: "Sell your used device at the best price. Free doorstep pickup and instant cash payment from Laptap.",
  alternates: { canonical: "https://www.laptap.in/gaming/asus-rog" },
};

export default function Page() {
  return <PageClient />;
}
