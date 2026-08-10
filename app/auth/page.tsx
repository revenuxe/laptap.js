import type { Metadata } from "next";
import { PageClient } from "./page-client";

export const metadata: Metadata = {
  title: "Login / Sign Up - Laptap",
  description: "Sign in or create an account on Laptap to track your sell orders.",
  alternates: { canonical: "https://www.laptap.in/auth" },
};

export default function Page() {
  return <PageClient />;
}