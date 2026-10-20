import { landingMetadata } from "@/lib/landing-metadata";
import { PageClient } from "./page-client";

export const metadata = landingMetadata("asus-rog", "/gaming/asus-rog");

export default function Page() { return <PageClient />; }
