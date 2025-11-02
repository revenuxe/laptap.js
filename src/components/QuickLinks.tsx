import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";

const QuickLinks = () => {
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    // Location-based selling
    { text: "Sell Used Laptop Bangalore", url: "/bangalore" },
    { text: "Sell Old Laptop Hyderabad", url: "/hyderabad" },
    { text: "Sell MacBook Bangalore", url: "/bangalore/macbook" },
    
    // Brand-specific pages
    { text: "Sell Dell Laptop Online", url: "/models/dell-xps" },
    { text: "Sell HP Laptop India", url: "/models/hp-pavilion" },
    { text: "Sell Lenovo ThinkPad", url: "/models/lenovo-thinkpad" },
    { text: "Sell MacBook Pro", url: "/models/macbook-pro" },
    
    // Desktop selling
    { text: "Sell Desktop Computer Bangalore", url: "/models/dell-optiplex" },
    { text: "Sell iMac Online", url: "/models/imac" },
    { text: "Sell HP Desktop", url: "/models/hp-desktop" },
    { text: "Sell Lenovo Desktop", url: "/models/lenovo-desktop" },
    
    // General pages
    { text: "Sell Old Laptop Online", url: "/sell" },
    { text: "Laptop Repair Services", url: "/repair" },
    { text: "Track My Laptop Sale Order", url: "/track/order" },
    { text: "Laptop Selling Guide Blog", url: "/blog/sell-used-laptop-bangalore" },
    
    // Info pages
    { text: "About Laptap", url: "/about" },
    { text: "Contact Us", url: "/contact" },
    { text: "Laptop Buyback Blog", url: "/blog" },
  ];

  return (
    <section className="py-12 bg-background border-t">
      <div className="container">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Quick Links - Sell Laptops & Desktops</h3>
            <CollapsibleTrigger className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <span className="text-sm">{isOpen ? "Hide" : "Show"} Links</span>
              <ChevronDown 
                className={`h-5 w-5 transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`} 
              />
            </CollapsibleTrigger>
          </div>

          <CollapsibleContent className="mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {links.map((link, index) => (
                <Link
                  key={index}
                  to={link.url}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors px-3 py-2 rounded-md hover:bg-muted/50"
                >
                  {link.text}
                </Link>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </section>
  );
};

export default QuickLinks;
