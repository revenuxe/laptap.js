import { landingMetadata } from "@/lib/landing-metadata";
import { PageClient } from "./page-client";

export const metadata = landingMetadata("lenovo-desktop", "/models/lenovo-desktop");

export default function Page() { return <PageClient />; }
