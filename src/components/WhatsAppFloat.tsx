import { useState, useEffect } from "react";
import { X } from "lucide-react";
import whatsappIcon from "@/assets/whatsapp.svg";

const WhatsAppFloat = () => {
  const [showPopup, setShowPopup] = useState(false);
  const whatsappNumber = "919886579923";
  const message = "Hi! I want to sell my device.";

  useEffect(() => {
    const timer = setTimeout(() => setShowPopup(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleWhatsAppClick = () => {
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40">
      <div className="relative">
        {showPopup && (
          <div className="absolute bottom-14 sm:bottom-16 right-0 bg-card rounded-xl shadow-xl p-3 sm:p-4 mb-2 w-40 sm:w-48 animate-in slide-in-from-bottom-2 border">
            <button
              onClick={() => setShowPopup(false)}
              className="absolute -top-2 -right-2 bg-muted rounded-full p-1 hover:bg-muted/80 transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
            <p className="text-xs sm:text-sm font-semibold mb-0.5">Need Help?</p>
            <p className="text-[10px] sm:text-xs text-muted-foreground">Book Now on WhatsApp!</p>
          </div>
        )}

        <button
          onClick={handleWhatsAppClick}
          className="bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-full p-3 sm:p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group relative"
          aria-label="Contact us on WhatsApp"
        >
          <img src={whatsappIcon} alt="WhatsApp" className="h-5 w-5 sm:h-6 sm:w-6" />
          <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20"></span>
        </button>
      </div>
    </div>
  );
};

export default WhatsAppFloat;
