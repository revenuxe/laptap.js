import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5 py-16">
        <div className="container max-w-2xl text-center px-4">
          <div className="mb-8">
            <h1 className="text-9xl font-bold text-primary mb-4">404</h1>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Page Not Found</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Oops! The page you're looking for doesn't exist or has been moved.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link to="/">
                <Home className="mr-2 h-5 w-5" />
                Back to Home
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/sell">
                <Search className="mr-2 h-5 w-5" />
                Sell Device
              </Link>
            </Button>
          </div>

          <div className="mt-12 pt-8 border-t">
            <p className="text-muted-foreground mb-4">Popular Pages:</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/about" className="text-primary hover:underline">About Us</Link>
              <Link to="/contact" className="text-primary hover:underline">Contact</Link>
              <Link to="/blog" className="text-primary hover:underline">Blog</Link>
              <Link to="/terms" className="text-primary hover:underline">Terms</Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
