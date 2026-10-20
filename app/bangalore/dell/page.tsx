import { landingMetadata } from "@/lib/landing-metadata";
import { PageClient } from "./page-client";

export const metadata = landingMetadata("bangalore-dell", "/bangalore/dell");

export default function Page() { return <PageClient />; }
