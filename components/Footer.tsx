import Link from "next/link";
import { Facebook, Linkedin, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t bg-muted/30 py-8 sm:py-12 md:py-16">
      <div className="container">
        <div className="grid grid-cols-2 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-7">
          {/* Logo - full width on mobile */}
          <div className="col-span-2 sm:col-span-1 space-y-3 sm:space-y-4">
            <img src="/assets/laptop_logo.webp" alt="Laptap Logo" className="h-8 sm:h-10" />
            <p className="text-xs sm:text-sm text-muted-foreground">
              India's most trusted platform for selling used laptops and desktops.
            </p>
          </div>

          <div>
            <h3 className="mb-3 sm:mb-4 text-xs sm:text-sm font-semibold">Company</h3>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
              <li><Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">Contact</Link></li>
              <li><Link href="/blog" className="text-muted-foreground hover:text-foreground transition-colors">Blog</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 sm:mb-4 text-xs sm:text-sm font-semibold">Quick Links</h3>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
              <li><Link href="/sell" className="text-muted-foreground hover:text-foreground transition-colors">Sell Device</Link></li>
              <li><Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">My Dashboard</Link></li>
              <li><Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">Terms</Link></li>
              <li><Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">Privacy</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 sm:mb-4 text-xs sm:text-sm font-semibold">Bangalore</h3>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
              <li><Link href="/bangalore" className="text-muted-foreground hover:text-foreground transition-colors">Sell Laptop</Link></li>
              <li><Link href="/bangalore/macbook" className="text-muted-foreground hover:text-foreground transition-colors">Sell MacBook</Link></li>
              <li><Link href="/bangalore/dell" className="text-muted-foreground hover:text-foreground transition-colors">Sell Dell</Link></li>
              <li><Link href="/bangalore/hp" className="text-muted-foreground hover:text-foreground transition-colors">Sell HP</Link></li>
              <li><Link href="/bangalore/lenovo" className="text-muted-foreground hover:text-foreground transition-colors">Sell Lenovo</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 sm:mb-4 text-xs sm:text-sm font-semibold">Hyderabad</h3>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
              <li><Link href="/hyderabad" className="text-muted-foreground hover:text-foreground transition-colors">Sell Laptop</Link></li>
              <li><Link href="/hyderabad/macbook" className="text-muted-foreground hover:text-foreground transition-colors">Sell MacBook</Link></li>
              <li><Link href="/hyderabad/dell" className="text-muted-foreground hover:text-foreground transition-colors">Sell Dell</Link></li>
              <li><Link href="/hyderabad/hp" className="text-muted-foreground hover:text-foreground transition-colors">Sell HP</Link></li>
              <li><Link href="/hyderabad/lenovo" className="text-muted-foreground hover:text-foreground transition-colors">Sell Lenovo</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 sm:mb-4 text-xs sm:text-sm font-semibold">Popular Models</h3>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
              <li><Link href="/models/macbook-pro" className="text-muted-foreground hover:text-foreground transition-colors">MacBook Pro</Link></li>
              <li><Link href="/models/macbook-air" className="text-muted-foreground hover:text-foreground transition-colors">MacBook Air</Link></li>
              <li><Link href="/models/dell-xps" className="text-muted-foreground hover:text-foreground transition-colors">Dell XPS</Link></li>
              <li><Link href="/models/lenovo-thinkpad" className="text-muted-foreground hover:text-foreground transition-colors">ThinkPad</Link></li>
              <li><Link href="/gaming/asus-rog" className="text-muted-foreground hover:text-foreground transition-colors">ASUS ROG</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 sm:mt-12 border-t pt-6 sm:pt-8">
          <div className="flex flex-col items-center justify-between gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground md:flex-row">
            <p>&copy; {new Date().getFullYear()} Laptap. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <a href="https://www.facebook.com/ilaptap/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors" aria-label="Facebook">
                <Facebook className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>
              <a href="https://www.instagram.com/ilaptap?igsh=MWt3NHU3YzdoemJmcA==" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors" aria-label="Instagram">
                <Instagram className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>
              <a href="https://www.linkedin.com/company/laptap/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors" aria-label="LinkedIn">
                <Linkedin className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>
            </div>
            <p className="flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-primary"></span>
              Bengaluru
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
