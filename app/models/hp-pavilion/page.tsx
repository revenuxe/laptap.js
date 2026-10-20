import { landingMetadata } from "@/lib/landing-metadata";
import { PageClient } from "./page-client";

export const metadata = landingMetadata("hp-pavilion", "/models/hp-pavilion");

export default function Page() { return <PageClient />; }
