import type { Metadata } from "next";
import { PageClient } from "./page-client";

export const metadata: Metadata = {
  title: "Sell Acer Laptop | Best Price for Used Acer Laptop - Laptap",
  description: "Sell your used device at the best price. Free doorstep pickup and instant cash payment from Laptap.",
  alternates: { canonical: "https://www.laptap.in/models/acer-laptop" },
};

export default function Page() {
  return <PageClient />;
}
