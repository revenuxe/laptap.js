import type { Metadata } from "next";
import { TrackClient } from "./track-client";

export const metadata: Metadata = {
  title: "Track Your Order - Laptap",
  description: "Track the status of your sell order on Laptap.",
};

export default function TrackPage() {
  return <TrackClient />;
}