import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ChevronRight } from "lucide-react";
import {
  calculateMobilePrice,
  getVariantMultiplier,
} from "@/utils/mobilePricingEngine";
import { useAuth } from "@/hooks/useAuth"; // Your authentication hook

interface MobileSellFormProps {
  basePrice: number;
  brandName: string;
  modelName: string;
  onPriceCalculated: (
    price: number,
    displayPrice: number,
    breakdown: any
  ) => void;
}

type FormStep =
  | "variant"
  | "screen_defects"
  | "functional"
  | "accessories"
  | "device_details"
  | "age";

export const MobileSellForm = ({
  basePrice,
  brandName,
  modelName,
  onPriceCalculated,
}: MobileSellFormProps) => {
  const [currentStep, setCurrentStep] = useState<FormStep>("variant");
  const [selectedVariant, setSelectedVariant] = useState<{ ram: string; rom: string } | null>(null);
  const [screenBodyDefects, setScreenBodyDefects] = useState<string[]>([]);
  const [functionalIssues, setFunctionalIssues] = useState<string[]>([]);
  const [accessories, setAccessories] = useState<string[]>([]);
  const [deviceDetails, setDeviceDetails] = useState({
    canMakeCalls: true,
    touchWorking: true,
    originalScreen: true,
    underWarranty: false,
    hasGstBill: false,
  });
  const [ageCategory, setAgeCategory] = useState<string>("");
  const [finalPrice, setFinalPrice] = useState<number | null>(null);

  const { user, login } = useAuth(); // useAuth hook

  const variants = [
    { ram: "4", rom: "64" },
    { ram: "4", rom: "128" },
    { ram: "4", rom: "256" },
    { ram: "6", rom: "128" },
    { ram: "6", rom: "256" },
    { ram: "6", rom: "512" },
    { ram: "8", rom: "128" },
    { ram: "8", rom: "256" },
    { ram: "8", rom: "512" },
    { ram: "12", rom: "256" },
    { ram: "12", rom: "512" },
    { ram: "16", rom: "256" },
  ];

  const screenDefectOptions = [
    { id: "screen_broken_scratch", label: "Broken/scratch on device screen" },
    { id: "screen_dead_spot_line", label: "Dead spot/visible line on screen" },
    { id: "body_scratch_dent", label: "Scratch/Dent on device body" },
    { id: "panel_missing_broken", label: "Device panel missing/broken" },
  ];

  const functionalIssueOptions = [
    { id: "front_camera", label: "Front Camera not working" },
    { id: "back_camera", label: "Back Camera not working" },
    { id: "volume_button", label: "Volume Button not working" },
    { id: "finger_touch", label: "Finger Touch not working" },
    { id: "wifi", label: "WiFi not working" },
    { id: "battery_faulty", label: "Battery Faulty" },
    { id: "speaker_faulty", label: "Speaker Faulty" },
    { id: "power_button", label: "Power Button not working" },
    { id: "charging_port", label: "Charging Port not working" },
    { id: "face_sensor", label: "Face Sensor not working" },
    { id: "silent_button", label: "Silent Button not working" },
    { id: "audio_receiver", label: "Audio Receiver not working" },
    { id: "camera_glass_broken", label: "Camera Glass Broken" },
    { id: "bluetooth", label: "Bluetooth not working" },
    { id: "vibrator", label: "Vibrator not working" },
    { id: "microphone", label: "Microphone not working" },
    { id: "proximity_sensor", label: "Proximity Sensor not working" },
  ];

  const accessoryOptions = [
    { id: "original_charger", label: "Original Charger of Device" },
    { id: "original_box", label: "Original Box with same IMEI" },
  ];

  const ageOptions = [
    { id: "0-3", label: "Below 3 months", subtext: "Valid bill mandatory" },
    { id: "3-6", label: "3 months - 6 months", subtext: "Valid bill mandatory" },
    { id: "6-11", label: "6 months - 11 months", subtext: "Valid bill mandatory" },
    { id: "11+", label: "Above 11 months", subtext: "" },
  ];

  const handleDefectToggle = (defectId: string) =>
    setScreenBodyDefects((prev) =>
      prev.includes(defectId) ? prev.filter((d) => d !== defectId) : [...prev, defectId]
    );

  const handleFunctionalToggle = (issueId: string) =>
    setFunctionalIssues((prev) =>
      prev.includes(issueId) ? prev.filter((i) => i !== issueId) : [...prev, issueId]
    );

  const handleAccessoryToggle = (accessoryId: string) =>
    setAccessories((prev) =>
      prev.includes(accessoryId) ? prev.filter((a) => a !== accessoryId) : [...prev, accessoryId]
    );

  const calculateFinalPrice = () => {
    if (!selectedVariant || !ageCategory) return;
    const variantMultiplier = getVariantMultiplier(selectedVariant.ram, selectedVariant.rom);
    const result = calculateMobilePrice(
      basePrice,
      brandName,
      ageCategory,
      variantMultiplier,
      screenBodyDefects,
      functionalIssues,
      accessories,
      deviceDetails
    );
    setFinalPrice(result.displayedPrice);
    onPriceCalculated(result.finalPriceActual, result.displayedPrice, result.breakdown);
  };

  const canContinue = () => {
    switch (currentStep) {
      case "variant":
        return !!selectedVariant;
      case "age":
        return !!ageCategory;
      default:
        return true;
    }
  };

  const handleContinue = () => {
    const steps: FormStep[] = ["variant", "screen_defects", "functional", "accessories", "device_details", "age"];
    const currentIndex = steps.indexOf(currentStep);

    if (currentIndex === steps.length - 1) {
      // Last step: check login
      if (!user) {
        login(); // Trigger login flow
        return;
      }
      calculateFinalPrice();
    } else {
      setCurrentStep(steps[currentIndex + 1]);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Progress */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{
              width: `${
                currentStep === "variant"
                  ? "16%"
                  : currentStep === "screen_defects"
                  ? "33%"
                  : currentStep === "functional"
                  ? "50%"
                  : currentStep === "accessories"
                  ? "66%"
                  : currentStep === "device_details"
                  ? "83%"
                  : "100%"
              }`,
            }}
          />
        </div>
      </div>

      {/* Final Price Display (if calculated) */}
      {finalPrice !== null && (
        <Card className="p-6 bg-green-50 text-green-900">
          <h3 className="text-xl font-bold">Your Mobile Value: ₹{finalPrice}</h3>
        </Card>
      )}

      {/* Step Content */}
      {currentStep === "variant" && (
        <Card className="p-8">
          <h2 className="text-2xl font-bold mb-6">Choose a Variant</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {variants.map((variant) => (
              <button
                key={`${variant.ram}-${variant.rom}`}
                onClick={() => setSelectedVariant(variant)}
                className={`p-4 rounded-lg border-2 transition-all hover:scale-105 ${
                  selectedVariant?.ram === variant.ram && selectedVariant?.rom === variant.rom
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="text-lg font-semibold">{variant.ram} GB / {variant.rom} GB</div>
              </button>
            ))}
          </div>
        </Card>
      )}

      {/* Add the rest of the steps like screen_defects, functional, accessories, device_details, age
          The code remains the same as your original, just replace the final "Continue" button with handleContinue */}
      {/* Continue Button */}
      <div className="flex justify-center">
        <Button onClick={handleContinue} disabled={!canContinue()} size="lg" className="min-w-[200px]">
          {currentStep === "age" ? "Get Exact Value" : "Continue"}
          <ChevronRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

