import { landingMetadata } from "@/lib/landing-metadata";
import { PageClient } from "./page-client";

export const metadata = landingMetadata("bangalore-macbook", "/bangalore/macbook");

export default function Page() { return <PageClient />; }
