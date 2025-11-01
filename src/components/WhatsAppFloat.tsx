import { useState, useEffect } from "react";
import { X } from "lucide-react";
import whatsappIcon from "@/assets/whatsapp.svg";

const WhatsAppFloat = () => {
  const [showPopup, setShowPopup] = useState(false);
  const whatsappNumber = "919886579923";
  const message = "Hi! I want to sell my device.";

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPopup(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleWhatsAppClick = () => {
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <>
      {/* Floating WhatsApp Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <div className="relative">
          {/* Popup */}
          {showPopup && (
            <div className="absolute bottom-16 right-0 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 mb-2 w-48 animate-in slide-in-from-bottom-2">
              <button
                onClick={() => setShowPopup(false)}
                className="absolute -top-2 -right-2 bg-gray-200 dark:bg-gray-700 rounded-full p-1 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-1">
                Need Help?
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-300">
                Book Now on WhatsApp!
              </p>
            </div>
          )}

          {/* WhatsApp Button */}
          <button
            onClick={handleWhatsAppClick}
            className="bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group relative"
            aria-label="Contact us on WhatsApp"
          >
            <img src={whatsappIcon} alt="WhatsApp" className="h-6 w-6" />
            
            {/* Ripple effect */}
            <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20"></span>
          </button>
        </div>
      </div>
    </>
  );
};

export default WhatsAppFloat;
