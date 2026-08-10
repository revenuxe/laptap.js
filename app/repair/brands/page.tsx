import type { Metadata } from "next";
import { PageClient } from "./page-client";

export const metadata: Metadata = {
  title: "Select Brand for Repair - Laptap",
  description: "Choose your laptop brand for repair service.",
  alternates: { canonical: "https://www.laptap.in/repair/brands" },
};

export default function Page() {
  return <PageClient />;
}