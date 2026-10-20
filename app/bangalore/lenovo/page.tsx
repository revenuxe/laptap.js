import { landingMetadata } from "@/lib/landing-metadata";
import { PageClient } from "./page-client";

export const metadata = landingMetadata("bangalore-lenovo", "/bangalore/lenovo");

export default function Page() { return <PageClient />; }
