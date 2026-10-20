import type { Metadata } from "next";
import { PageClient } from "./page-client";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: { absolute: "Repair Request Submitted - Laptap" },
  description: "Your repair request has been submitted successfully.",
  alternates: { canonical: "https://www.laptap.in/repair/thank-you" },
};

export default function Page() {
  return <PageClient />;
}