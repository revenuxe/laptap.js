import { landingMetadata } from "@/lib/landing-metadata";
import { PageClient } from "./page-client";

export const metadata = landingMetadata("dell-optiplex", "/models/dell-optiplex");

export default function Page() { return <PageClient />; }
