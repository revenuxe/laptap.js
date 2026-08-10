import type { Metadata } from "next";
import { PageClient } from "./page-client";

export const metadata: Metadata = {
  title: "About Us - Laptap | India's Trusted Platform for Selling Used Laptops",
  description: "Learn about Laptap's mission to make selling used laptops and desktops easy, fast, and transparent. Trusted by thousands across Bangalore.",
  alternates: { canonical: "https://www.laptap.in/about" },
};

export default function Page() {
  return <PageClient />;
}