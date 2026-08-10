import type { Metadata } from "next";
import { PageClient } from "./page-client";

export const metadata: Metadata = {
  title: "Book Repair Service - Laptap",
  description: "Fill in details to book a repair service for your laptop.",
  alternates: { canonical: "https://www.laptap.in/repair/form" },
};

export default function Page() {
  return <PageClient />;
}