import { landingMetadata } from "@/lib/landing-metadata";
import { PageClient } from "./page-client";

export const metadata = landingMetadata("samsung-laptop", "/models/samsung-laptop");

export default function Page() { return <PageClient />; }
