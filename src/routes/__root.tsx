import {
  Outlet,
  HeadContent,
  Scripts,
  createRootRouteWithContext,
  useRouter,
} from "@tanstack/react-router";
import type { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { useEffect, type ReactNode } from "react";
import { HelmetProvider } from "react-helmet-async";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import ScrollToTop from "@/components/ScrollToTop";
import PageLoader from "@/components/PageLoader";
import "@/index.css";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Laptap - Sell Your Used Laptop, Mobile & Desktop for Instant Cash" },
      {
        name: "description",
        content:
          "Sell your used laptop, mobile phone, or desktop computer for the best price. Free doorstep pickup, instant quote, and same-day payment across Bangalore, Hyderabad and India.",
      },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Laptap" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "icon", href: "/favicon.ico" },
    ],
  }),
  errorComponent: RootErrorComponent,
  notFoundComponent: () => <RootDocument><NotFoundBody /></RootDocument>,
  component: RootComponent,
});

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <RootDocument>
      <QueryClientProvider client={queryClient}>
        <HelmetProvider>
          {/* BrowserRouter shim: keeps react-router-dom hooks (useNavigate, Link, useParams)
              working inside components/pages during the incremental migration to TanStack.
              Will be removed in the final migration turn. */}
          <BrowserRouter>
            <AuthProvider>
              <TooltipProvider>
                <ScrollToTop />
                <PageLoader />
                <Outlet />
                <Toaster />
                <Sonner />
              </TooltipProvider>
            </AuthProvider>
          </BrowserRouter>
        </HelmetProvider>
      </QueryClientProvider>
    </RootDocument>
  );
}

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootErrorComponent({ error }: { error: Error }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    // Best-effort: log to console; Lovable captures it.
    console.error("[tanstack_root_error_component]", error);
  }, [error]);
  return (
    <RootDocument>
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: "system-ui, sans-serif" }}>
        <div style={{ maxWidth: 440, textAlign: "center" }}>
          <h1 style={{ fontSize: 24, margin: "0 0 8px" }}>Something went wrong</h1>
          <p style={{ color: "#71717a", margin: "0 0 24px" }}>{error.message}</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <button
              onClick={() => router.invalidate()}
              style={{ padding: "10px 18px", borderRadius: 10, border: 0, background: "#111", color: "#fff", fontWeight: 600, cursor: "pointer" }}
            >
              Try again
            </button>
            <a href="/" style={{ padding: "10px 18px", borderRadius: 10, border: "1px solid #e4e4e7", textDecoration: "none", color: "inherit", fontWeight: 600 }}>Go home</a>
          </div>
        </div>
      </div>
    </RootDocument>
  );
}

function NotFoundBody() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "system-ui" }}>
      <div style={{ textAlign: "center" }}>
        <h1>404</h1>
        <p>Page not found</p>
        <a href="/">Go home</a>
      </div>
    </div>
  );
}
