import { landingMetadata } from "@/lib/landing-metadata";
import { PageClient } from "./page-client";

export const metadata = landingMetadata("dell-xps", "/models/dell-xps");

export default function Page() { return <PageClient />; }
