import type { Metadata } from "next";
import { PageClient } from "./page-client";

export const metadata: Metadata = {
  title: "Terms of Service - Laptap",
  description: "Read Laptap's terms of service for selling used laptops and desktops.",
  alternates: { canonical: "https://www.laptap.in/terms" },
};

export default function Page() {
  return <PageClient />;
}