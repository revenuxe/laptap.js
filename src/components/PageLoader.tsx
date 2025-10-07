import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import loaderLogo from "@/assets/loader-logo.ico";

const PageLoader = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <img 
            src={loaderLogo} 
            alt="Loading..." 
            className="w-16 h-16 animate-pulse"
          />
          <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
        </div>
        <p className="text-sm text-muted-foreground animate-pulse">Loading...</p>
      </div>
    </div>
  );
};

export default PageLoader;
