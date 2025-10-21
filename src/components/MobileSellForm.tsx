import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Smartphone,
  ShieldAlert,
  Wrench,
  Box,
  FileCheck,
  Calendar,
  Cpu,
  ChevronRight,
  Monitor,
  AlertTriangle,
  Square,
  Package,
} from "lucide-react";
import {
  calculateMobilePrice,
  getVariantMultiplier,
  getMobileAgeCategoryLabel,
} from "@/utils/mobilePricingEngine";

interface MobileSellFormProps {
  basePrice: number;
  brandName: string;
  modelName: string;
  onPriceCalculated: (price: number, displayPrice: number, breakdown: any) => void;
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

  // Form state
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

  // Updated variants
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

  // Screen/body defect options with icons fixed
  const screenDefectOptions = [
    { id: "screen_broken_scratch", label: "Broken/scratch on device screen", icon: <Monitor /> },
    { id: "screen_dead_spot_line", label: "Dead spot/visible line/discoloration on screen", icon: <AlertTriangle /> },
    { id: "body_scratch_dent", label: "Scratch/Dent on device body", icon: <Square /> },
    { id: "panel_missing_broken", label: "Device panel missing/broken", icon: <Package /> },
  ];

  // Functional issues (icons removed)
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
    { id: "original_charger", label: "Original Charger of Device", icon: "🔌" },
    { id: "original_box", label: "Original Box with same IMEI", icon: "📦" },
  ];

  const ageOptions = [
    { id: "0-3", label: "Below 3 months", subtext: "Valid bill mandatory" },
    { id: "3-6", label: "3 months - 6 months", subtext: "Valid bill mandatory" },
    { id: "6-11", label: "6 months - 11 months", subtext: "Valid bill mandatory" },
    { id: "11+", label: "Above 11 months", subtext: "" },
  ];

  const handleDefectToggle = (defectId: string) => {
    setScreenBodyDefects((prev) =>
      prev.includes(defectId) ? prev.filter((d) => d !== defectId) : [...prev, defectId]
    );
  };

  const handleFunctionalToggle = (issueId: string) => {
    setFunctionalIssues((prev) =>
      prev.includes(issueId) ? prev.filter((i) => i !== issueId) : [...prev, issueId]
    );
  };

  const handleAccessoryToggle = (accessoryId: string) => {
    setAccessories((prev) =>
      prev.includes(accessoryId) ? prev.filter((a) => a !== accessoryId) : [...prev, accessoryId]
    );
  };

  const handleContinue = () => {
    const steps: FormStep[] = [
      "variant",
      "screen_defects",
      "functional",
      "accessories",
      "device_details",
      "age",
    ];
    const currentIndex = steps.indexOf(currentStep);

    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      calculateFinalPrice();
    }
  };

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

    onPriceCalculated(result.finalPriceActual, result.displayedPrice, result.breakdown);
  };

  const canContinue = () => {
    switch (currentStep) {
      case "variant":
        return selectedVariant !== null;
      case "age":
        return ageCategory !== "";
      default:
        return true;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Progress bar */}
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

      {/* Variant Selection */}
      {currentStep === "variant" && (
        <Card className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <Cpu className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">Choose a Variant</h2>
          </div>
          <p className="text-muted-foreground mb-6">Select your device's RAM and storage configuration</p>

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
                <div className="text-lg font-semibold">
                  {variant.ram} GB / {variant.rom} GB
                </div>
              </button>
            ))}
          </div>
        </Card>
      )}

      {/* Screen/Body Defects */}
      {currentStep === "screen_defects" && (
        <Card className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <ShieldAlert className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">Select screen/body defects</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {screenDefectOptions.map((defect) => (
              <button
                key={defect.id}
                onClick={() => handleDefectToggle(defect.id)}
                className={`p-6 rounded-lg border-2 transition-all hover:scale-105 text-center ${
                  screenBodyDefects.includes(defect.id)
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="flex justify-center mb-3">{defect.icon}</div>
                <div className="text-sm font-medium">{defect.label}</div>
              </button>
            ))}
          </div>
        </Card>
      )}

      {/* Functional Issues */}
      {currentStep === "functional" && (
        <Card className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <Wrench className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">Functional or Physical Problems</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {functionalIssueOptions.map((issue) => (
              <button
                key={issue.id}
                onClick={() => handleFunctionalToggle(issue.id)}
                className={`p-4 rounded-lg border-2 transition-all hover:scale-105 text-center ${
                  functionalIssues.includes(issue.id)
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="text-xs font-medium">{issue.label}</div>
              </button>
            ))}
          </div>
        </Card>
      )}

      {/* Continue Button */}
      <div className="flex justify-center">
        <Button
          onClick={handleContinue}
          disabled={!canContinue()}
          size="lg"
          className="min-w-[200px]"
        >
          {currentStep === "age" ? "Get Exact Value" : "Continue"}
          <ChevronRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

