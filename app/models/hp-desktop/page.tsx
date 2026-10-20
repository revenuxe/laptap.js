import { landingMetadata } from "@/lib/landing-metadata";
import { PageClient } from "./page-client";

export const metadata = landingMetadata("hp-desktop", "/models/hp-desktop");

export default function Page() { return <PageClient />; }
