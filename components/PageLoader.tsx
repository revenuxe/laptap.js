"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/**
 * Full-screen centered page loader with brand logo.
 * Shows during Next.js page navigation with a smooth fade + scale animation.
 */
const PageLoader = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show loader
    setLoading(true);
    setVisible(true);

    // Hide after the page has rendered
    const hideTimer = setTimeout(() => {
      setVisible(false);
      // Remove from DOM after fade-out animation completes
      const removeTimer = setTimeout(() => setLoading(false), 300);
      return () => clearTimeout(removeTimer);
    }, 400);

    return () => clearTimeout(hideTimer);
  }, [pathname, searchParams]);

  if (!loading) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/80 backdrop-blur-sm"
      style={{
        opacity: visible ? 1 : 0,
        transition: "opacity 300ms ease-out",
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      <div
        className="flex flex-col items-center gap-5"
        style={{
          transform: visible ? "scale(1)" : "scale(0.9)",
          transition: "transform 300ms ease-out",
        }}
      >
        {/* Logo with pulse ring */}
        <div className="relative">
          <img
            src="/assets/loader-logo.ico"
            alt="Loading..."
            className="h-16 w-16 animate-pulse"
          />
          <div
            className="absolute inset-0 rounded-full animate-ping"
            style={{
              background: "hsl(var(--primary) / 0.15)",
            }}
          />
          {/* Outer glow ring */}
          <div
            className="absolute -inset-3 rounded-full animate-pulse"
            style={{
              border: "2px solid hsl(var(--primary) / 0.2)",
            }}
          />
        </div>

        {/* Loading dots */}
        <div className="flex items-center gap-1.5">
          <div
            className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce"
            style={{ animationDelay: "0ms" }}
          />
          <div
            className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce"
            style={{ animationDelay: "150ms" }}
          />
          <div
            className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce"
            style={{ animationDelay: "300ms" }}
          />
        </div>
      </div>
    </div>
  );
};

export default PageLoader;
