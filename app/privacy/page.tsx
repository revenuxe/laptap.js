import type { Metadata } from "next";
import { PageClient } from "./page-client";

export const metadata: Metadata = {
  title: "Privacy Policy - Laptap",
  description: "Read Laptap's privacy policy. We protect your personal data and information.",
  alternates: { canonical: "https://www.laptap.in/privacy" },
};

export default function Page() {
  return <PageClient />;
}