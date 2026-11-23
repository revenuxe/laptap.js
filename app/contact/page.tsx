import type { Metadata } from "next";
import { PageClient } from "./page-client";

export const metadata: Metadata = {
  title: { absolute: "Contact Us - Laptap | Get in Touch for Selling Your Laptop" },
  description: "Contact Laptap for queries about selling your used laptop or desktop. We're currently offline and not accepting orders or enquiries. We'll be back soon.",
  alternates: { canonical: "https://www.laptap.in/contact" },
};

export default function Page() {
  return <PageClient />;
}
