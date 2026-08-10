import type { Metadata } from "next";
import { PageClient } from "./page-client";

export const metadata: Metadata = {
  title: "Admin Login - Laptap",
  description: "Laptap admin login portal.",
  alternates: { canonical: "https://www.laptap.in/admin" },
};

export default function Page() {
  return <PageClient />;
}