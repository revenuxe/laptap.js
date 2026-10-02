"use client";

import { useEffect, useState, useCallback } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/**
 * Premium app-like top progress bar for page navigation.
 * Inspired by YouTube/GitHub's loading indicator — thin, fast, and elegant.
 */
const TopLoader = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const startLoading = useCallback(() => {
    setIsComplete(false);
    setIsVisible(true);
    setProgress(0);

    // Simulate fast progress in stages
    const t1 = setTimeout(() => setProgress(30), 50);
    const t2 = setTimeout(() => setProgress(60), 200);
    const t3 = setTimeout(() => setProgress(80), 500);
    const t4 = setTimeout(() => setProgress(90), 1000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  const completeLoading = useCallback(() => {
    setProgress(100);
    setIsComplete(true);

    const hideTimer = setTimeout(() => {
      setIsVisible(false);
      setProgress(0);
      setIsComplete(false);
    }, 400);

    return () => clearTimeout(hideTimer);
  }, []);

  useEffect(() => {
    const cleanupStart = startLoading();
    // Complete after a brief delay (Next.js will have rendered by then)
    const completeTimer = setTimeout(() => {
      completeLoading();
    }, 150);

    return () => {
      cleanupStart();
      clearTimeout(completeTimer);
    };
  }, [pathname, searchParams, startLoading, completeLoading]);

  // Also intercept <a> clicks for instant feedback
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:") || anchor.target === "_blank") return;
      // Internal link — show loader immediately
      startLoading();
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [startLoading]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-[3px]" aria-hidden="true">
      {/* Track background */}
      <div className="absolute inset-0 bg-primary/10" />

      {/* Progress bar */}
      <div
        className="absolute left-0 top-0 h-full bg-primary"
        style={{
          width: `${progress}%`,
          transition: isComplete
            ? "width 200ms ease-out, opacity 300ms ease-out 100ms"
            : "width 400ms cubic-bezier(0.4, 0, 0.2, 1)",
          opacity: isComplete ? 0 : 1,
        }}
      >
        {/* Glow effect at the tip */}
        <div
          className="absolute right-0 top-0 h-full w-24"
          style={{
            background: "linear-gradient(to right, transparent, hsl(var(--primary) / 0.4))",
            boxShadow: "0 0 12px hsl(var(--primary) / 0.5), 0 0 4px hsl(var(--primary) / 0.3)",
          }}
        />
      </div>
    </div>
  );
};

export default TopLoader;
