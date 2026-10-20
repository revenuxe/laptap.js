import { landingMetadata } from "@/lib/landing-metadata";
import { PageClient } from "./page-client";

export const metadata = landingMetadata("imac", "/models/imac");

export default function Page() { return <PageClient />; }
