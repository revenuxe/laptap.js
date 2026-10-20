import { landingMetadata } from "@/lib/landing-metadata";
import { PageClient } from "./page-client";

export const metadata = landingMetadata("acer-predator", "/gaming/acer-predator");

export default function Page() { return <PageClient />; }
