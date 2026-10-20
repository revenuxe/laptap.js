import { landingMetadata } from "@/lib/landing-metadata";
import { PageClient } from "./page-client";

export const metadata = landingMetadata("bangalore-hp", "/bangalore/hp");

export default function Page() { return <PageClient />; }
