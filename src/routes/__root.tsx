import { useEffect } from "react";
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
  useRouter,
} from "@tanstack/react-router";
import type { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import { reportLovableError } from "@/lib/lovable-error-reporting";
import appCss from "@/index.css?url";

function ErrorComponent({ error }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return (
    <RootDocument>
      <div className="min-h-screen flex items-center justify-center p-6 bg-background text-foreground">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold mb-3">Something went wrong</h1>
          <p className="text-muted-foreground mb-6">{error.message}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => router.invalidate()}
              className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-medium"
            >
              Try again
            </button>
            <a href="/" className="px-4 py-2 rounded-xl bg-muted font-medium">
              Go home
            </a>
          </div>
        </div>
      </div>
    </RootDocument>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1.0" },
      { title: "Laptap - Sell Your Laptop, Desktop & MacBook Instantly" },
      {
        name: "description",
        content:
          "Sell your laptop, desktop, or MacBook instantly at the best price. Free doorstep pickup in Bangalore & Hyderabad. Instant quote, same-day payment.",
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico" },
    ],
  }),
  errorComponent: ErrorComponent,
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  const { queryClient } = Route.useRouteContext();
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          <HelmetProvider>
            <TooltipProvider>
              <AuthProvider>
                <Toaster />
                <Sonner />
                {children}
              </AuthProvider>
            </TooltipProvider>
          </HelmetProvider>
        </QueryClientProvider>
        <Scripts />
      </body>
    </html>
  );
}
