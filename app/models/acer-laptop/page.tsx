import { landingMetadata } from "@/lib/landing-metadata";
import { PageClient } from "./page-client";

export const metadata = landingMetadata("acer-laptop", "/models/acer-laptop");

export default function Page() { return <PageClient />; }
