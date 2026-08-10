import type { Metadata } from "next";
import { PageClient } from "./page-client";

export const metadata: Metadata = {
  title: "Admin Dashboard - Laptap",
  description: "Laptap admin dashboard.",
  alternates: { canonical: "https://www.laptap.in/admin/dashboard" },
};

export default function Page() {
  return <PageClient />;
}