import { landingMetadata } from "@/lib/landing-metadata";
import { PageClient } from "./page-client";

export const metadata = landingMetadata("macbook-pro", "/models/macbook-pro");

export default function Page() { return <PageClient />; }
