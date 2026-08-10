import type { Metadata } from "next";
import { PageClient } from "./page-client";

export const metadata: Metadata = {
  title: "Sell Lenovo Laptop in Bangalore | Best Price - Laptap",
  description: "Sell your used laptop at the best price with free doorstep pickup and instant cash payment.",
  alternates: { canonical: "https://www.laptap.in/bangalore/lenovo" },
};

export default function Page() {
  return <PageClient />;
}