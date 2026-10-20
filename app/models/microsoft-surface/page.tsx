import { landingMetadata } from "@/lib/landing-metadata";
import { PageClient } from "./page-client";

export const metadata = landingMetadata("microsoft-surface", "/models/microsoft-surface");

export default function Page() { return <PageClient />; }
