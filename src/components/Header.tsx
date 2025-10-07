import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, User } from "lucide-react";
import laptopLogo from "@/assets/laptop_logo.webp";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
const Header = () => {
  const navigate = useNavigate();
  const {
    user,
    signOut,
    isAdmin
  } = useAuth();
  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };
  return <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
          <Link to="/about" className="text-sm font-medium hover:text-primary transition-colors">
            About
          </Link>
          <Link to="/blog" className="text-sm font-medium hover:text-primary transition-colors">
            Blog
          </Link>
          {user && <Link to="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
              Dashboard
            </Link>}
        </nav>

        <div className="flex items-center gap-4">
          {!user ? <>
              <Button variant="outline" onClick={() => navigate("/auth")}>
                Login
              </Button>
              
            </> : <>
              <Button variant="cta" size="lg" onClick={() => navigate("/sell")}>
                Sell Now
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                    Dashboard
                  </DropdownMenuItem>
                  {isAdmin && <DropdownMenuItem onClick={() => navigate("/admin/dashboard")}>
                      Admin Panel
                    </DropdownMenuItem>}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>}
        </div>
      </div>
    </header>;
};
export default Header;