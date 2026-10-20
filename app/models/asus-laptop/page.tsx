import { landingMetadata } from "@/lib/landing-metadata";
import { PageClient } from "./page-client";

export const metadata = landingMetadata("asus-laptop", "/models/asus-laptop");

export default function Page() { return <PageClient />; }
