import { landingMetadata } from "@/lib/landing-metadata";
import { PageClient } from "./page-client";

export const metadata = landingMetadata("lenovo-thinkpad", "/models/lenovo-thinkpad");

export default function Page() { return <PageClient />; }
