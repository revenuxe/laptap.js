import { Link } from "react-router-dom";
import laptopLogo from "@/assets/laptop_logo.webp";
const Footer = () => {
  return <footer className="border-t bg-muted/30 py-12 md:py-16">
      <div className="container">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-7">
          <div className="space-y-4">
            <img src={laptopLogo} alt="Laptap Logo" className="h-10" />
            <p className="text-sm text-muted-foreground">
              India's most trusted platform for selling used laptops and desktops.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-muted-foreground hover:text-foreground transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/sell" className="text-muted-foreground hover:text-foreground transition-colors">
                  Sell Device
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
                  My Dashboard
                </Link>
              </li>
              <li>
                <Link to="/track/order" className="text-muted-foreground hover:text-foreground transition-colors">
                  Track Order
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold">Locations</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/bangalore" className="text-muted-foreground hover:text-foreground transition-colors">
                  Bangalore
                </Link>
              </li>
              <li>
                <Link to="/hyderabad" className="text-muted-foreground hover:text-foreground transition-colors">
                  Hyderabad
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold">Sell by Brand</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/bangalore/macbook" className="text-muted-foreground hover:text-foreground transition-colors">
                  Sell MacBook Bangalore
                </Link>
              </li>
              <li>
                
              </li>
              <li>
                
              </li>
              <li>
                
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/blog/sell-used-laptop-bangalore" className="text-muted-foreground hover:text-foreground transition-colors">
                  Sell Laptop Guide
                </Link>
              </li>
              <li>
                <Link to="/sell" className="text-muted-foreground hover:text-foreground transition-colors">
                  Price Calculator
                </Link>
              </li>
              <li>
                <Link to="/track/order" className="text-muted-foreground hover:text-foreground transition-colors">
                  Track Order
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t pt-8">
          <div className="flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground md:flex-row">
            <p>&copy; {new Date().getFullYear()} Laptap. All rights reserved.</p>
            <p className="flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-primary"></span>
              Location: Bengaluru
            </p>
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;