import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import laptopLogo from "@/assets/laptop_logo.webp";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <img src={laptopLogo} alt="Laptap Logo" className="h-12" />
        </Link>

        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
            Home
          </Link>
          <Link to="/sell" className="text-sm font-medium hover:text-primary transition-colors">
            Sell Device
          </Link>
          <Link to="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
            Dashboard
          </Link>
        </nav>

        <Button variant="cta" size="lg" onClick={() => navigate("/sell")}>
          Sell Now
        </Button>
      </div>
    </header>
  );
};

export default Header;
