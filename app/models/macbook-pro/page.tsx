import type { Metadata } from "next";
import { PageClient } from "./page-client";

export const metadata: Metadata = {
  title: "Sell MacBook Pro | Best Price for Used MacBook Pro - Laptap",
  description: "Sell your used device at the best price. Free doorstep pickup and instant cash payment from Laptap.",
  alternates: { canonical: "https://www.laptap.in/models/macbook-pro" },
};

export default function Page() {
  return <PageClient />;
}
