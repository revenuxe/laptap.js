import type { Metadata } from "next";
import { PageClient } from "./page-client";

export const metadata: Metadata = {
  title: "Sell HP Pavilion | Best Price for Used HP Pavilion - Laptap",
  description: "Sell your used device at the best price. Free doorstep pickup and instant cash payment from Laptap.",
  alternates: { canonical: "https://www.laptap.in/models/hp-pavilion" },
};

export default function Page() {
  return <PageClient />;
}
