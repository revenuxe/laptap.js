import type { Metadata } from "next";
import { PageClient } from "./page-client";

export const metadata: Metadata = {
  title: "Sell Lenovo ThinkPad | Best Price for Used ThinkPad - Laptap",
  description: "Sell your used device at the best price. Free doorstep pickup and instant cash payment from Laptap.",
  alternates: { canonical: "https://www.laptap.in/models/lenovo-thinkpad" },
};

export default function Page() {
  return <PageClient />;
}
