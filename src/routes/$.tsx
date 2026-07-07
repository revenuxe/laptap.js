import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";

// Client-only mount of the existing react-router-dom SPA during migration.
const LegacyApp = lazy(() => import("@/App"));

export const Route = createFileRoute("/$")({
  ssr: false,
  component: LegacyRoute,
});

function LegacyRoute() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <LegacyApp />
    </Suspense>
  );
}
