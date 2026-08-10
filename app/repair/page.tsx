import type { Metadata } from "next";
import { PageClient } from "./page-client";

export const metadata: Metadata = {
  title: "Laptop & Desktop Repair Services - Laptap",
  description: "Get your laptop or desktop repaired by certified technicians. Affordable rates and quick turnaround.",
  alternates: { canonical: "https://www.laptap.in/repair" },
};

export default function Page() {
  return <PageClient />;
}