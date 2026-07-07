import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";

const LegacyApp = lazy(() => import("@/App"));

export const Route = createFileRoute("/")({
  ssr: false,
  component: HomeRoute,
});

function HomeRoute() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <LegacyApp />
    </Suspense>
  );
}
