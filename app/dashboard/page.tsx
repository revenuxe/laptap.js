import type { Metadata } from "next";
import { PageClient } from "./page-client";

export const metadata: Metadata = {
  title: "My Dashboard - Laptap",
  description: "View and manage your sell orders on Laptap.",
  alternates: { canonical: "https://www.laptap.in/dashboard" },
};

export default function Page() {
  return <PageClient />;
}