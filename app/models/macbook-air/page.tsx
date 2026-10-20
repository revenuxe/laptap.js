import { landingMetadata } from "@/lib/landing-metadata";
import { PageClient } from "./page-client";

export const metadata = landingMetadata("macbook-air", "/models/macbook-air");

export default function Page() { return <PageClient />; }
