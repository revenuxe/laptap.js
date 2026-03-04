import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, User, Menu, X } from "lucide-react";
import laptopLogo from "@/assets/laptop_logo.webp";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useState } from "react";

const Header = () => {
  const navigate = useNavigate();
  const { user, signOut, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 sm:h-16 md:h-20 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <img src={laptopLogo} alt="Laptap Logo" className="h-8 sm:h-10 md:h-12" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">Home</Link>
          <Link to="/sell" className="text-sm font-medium hover:text-primary transition-colors">Sell Device</Link>
          <Link to="/about" className="text-sm font-medium hover:text-primary transition-colors">About</Link>
          <Link to="/blog" className="text-sm font-medium hover:text-primary transition-colors">Blog</Link>
          {user && <Link to="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">Dashboard</Link>}
        </nav>

        <div className="flex items-center gap-2 sm:gap-4">
          {!user ? (
            <>
              <Button variant="outline" size="sm" onClick={() => navigate("/auth")} className="text-xs sm:text-sm h-8 sm:h-9">
                Login
              </Button>
            </>
          ) : (
            <>
              <Button variant="cta" size="sm" onClick={() => navigate("/sell")} className="hidden sm:inline-flex">
                Sell Now
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9">
                    <User className="h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-xl">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/dashboard")}>Dashboard</DropdownMenuItem>
                  {isAdmin && <DropdownMenuItem onClick={() => navigate("/admin/dashboard")}>Admin Panel</DropdownMenuItem>}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-1.5 rounded-lg hover:bg-muted transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background/98 backdrop-blur animate-in slide-in-from-top-2 duration-200">
          <nav className="container py-4 flex flex-col gap-1">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium py-2.5 px-3 rounded-xl hover:bg-muted transition-colors">Home</Link>
            <Link to="/sell" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium py-2.5 px-3 rounded-xl hover:bg-muted transition-colors">Sell Device</Link>
            <Link to="/repair" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium py-2.5 px-3 rounded-xl hover:bg-muted transition-colors">Repair</Link>
            <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium py-2.5 px-3 rounded-xl hover:bg-muted transition-colors">About</Link>
            <Link to="/blog" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium py-2.5 px-3 rounded-xl hover:bg-muted transition-colors">Blog</Link>
            <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium py-2.5 px-3 rounded-xl hover:bg-muted transition-colors">Contact</Link>
            {user && (
              <>
                <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium py-2.5 px-3 rounded-xl hover:bg-muted transition-colors">Dashboard</Link>
                <div className="pt-2 px-3">
                  <Button variant="cta" className="w-full" size="sm" onClick={() => { navigate("/sell"); setMobileMenuOpen(false); }}>
                    Sell Now
                  </Button>
                </div>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};
export default Header;
