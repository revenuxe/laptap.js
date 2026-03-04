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
    { text: "Sell Used Laptop Bangalore", url: "/bangalore" },
    { text: "Sell Old Laptop Hyderabad", url: "/hyderabad" },
    { text: "Sell MacBook Bangalore", url: "/bangalore/macbook" },
    { text: "Sell Dell Laptop Online", url: "/models/dell-xps" },
    { text: "Sell HP Laptop India", url: "/models/hp-pavilion" },
    { text: "Sell Lenovo ThinkPad", url: "/models/lenovo-thinkpad" },
    { text: "Sell MacBook Pro", url: "/models/macbook-pro" },
    { text: "Sell Desktop Computer", url: "/models/dell-optiplex" },
    { text: "Sell iMac Online", url: "/models/imac" },
    { text: "Sell HP Desktop", url: "/models/hp-desktop" },
    { text: "Sell Lenovo Desktop", url: "/models/lenovo-desktop" },
    { text: "Sell Old Laptop Online", url: "/sell" },
    { text: "Laptop Repair Services", url: "/repair" },
    { text: "Track Order", url: "/track/order" },
    { text: "Selling Guide", url: "/blog/sell-used-laptop-bangalore" },
    { text: "About Laptap", url: "/about" },
    { text: "Contact Us", url: "/contact" },
    { text: "Blog", url: "/blog" },
  ];

  return (
    <section className="py-6 sm:py-12 bg-background border-t">
      <div className="container">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-xl font-semibold">Quick Links</h3>
            <CollapsibleTrigger className="flex items-center gap-1.5 sm:gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <span className="text-xs sm:text-sm">{isOpen ? "Hide" : "Show"}</span>
              <ChevronDown className={`h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
            </CollapsibleTrigger>
          </div>

          <CollapsibleContent className="mt-4 sm:mt-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5 sm:gap-3">
              {links.map((link, index) => (
                <Link
                  key={index}
                  to={link.url}
                  className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:bg-muted/50"
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
