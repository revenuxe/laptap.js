import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  ChevronRight,
} from "lucide-react";
import {
  calculateMobilePrice,
  getVariantMultiplier,
} from "@/utils/mobilePricingEngine";
import { useAuth } from "@/context/AuthContext"; // <-- your auth context
import { useNavigate } from "react-router-dom";

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

  const { user } = useAuth();
  const navigate = useNavigate();

  // Restore form state if coming back from login
  useEffect(() => {
    const pending = localStorage.getItem("pendingAction");
    if (pending && user) {
      try {
        const saved = JSON.parse(pending);
        if (saved.formData) {
          setSelectedVariant(saved.formData.selectedVariant);
          setScreenBodyDefects(saved.formData.screenBodyDefects || []);
          setFunctionalIssues(saved.formData.functionalIssues || []);
          setAccessories(saved.formData.accessories || []);
          setDeviceDetails(saved.formData.deviceDetails || deviceDetails);
          setAgeCategory(saved.formData.ageCategory || "");
        }
        if (saved.action === "bookNow") {
          localStorage.removeItem("pendingAction");
          setCurrentStep("age"); // go directly to final form step
        }
      } catch (e) {
        console.error("Failed to restore form state", e);
      }
    }
  }, [user]);

  const variants = [
    { ram: "4", rom: "64" }, { ram: "4", rom: "128" }, { ram: "4", rom: "256" },
    { ram: "6", rom: "128" }, { ram: "6", rom: "256" }, { ram: "6", rom: "512" },
    { ram: "8", rom: "128" }, { ram: "8", rom: "256" }, { ram: "8", rom: "512" },
    { ram: "12", rom: "256" }, { ram: "12", rom: "512" }, { ram: "16", rom: "256" },
  ];

  const screenDefectOptions = [
    { id: "screen_broken_scratch", label: "Broken/scratch on device screen" },
    { id: "screen_dead_spot_line", label: "Dead spot/visible line and discoloration on screen" },
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

  const handleToggle = (value: string, setFn: any, arr: string[]) => {
    setFn(arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value]);
  };

  const handleContinue = () => {
    const steps: FormStep[] = ["variant","screen_defects","functional","accessories","device_details","age"];
    const currentIndex = steps.indexOf(currentStep);

    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      handleFinalSubmit();
    }
  };

  const handleFinalSubmit = () => {
    // If not logged in, save form state and redirect to login
    if (!user) {
      localStorage.setItem("pendingAction", JSON.stringify({
        action: "bookNow",
        formData: { selectedVariant, screenBodyDefects, functionalIssues, accessories, deviceDetails, ageCategory }
      }));
      navigate("/login");
      return;
    }

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
      case "variant": return !!selectedVariant;
      case "age": return ageCategory !== "";
      default: return true;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Render steps */}
      {currentStep === "variant" && (
        <Card className="p-8">
          <h2 className="text-2xl font-bold mb-6">Choose a Variant</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {variants.map((v) => (
              <button
                key={`${v.ram}-${v.rom}`}
                onClick={() => setSelectedVariant(v)}
                className={`p-4 rounded-lg border-2 transition-all hover:scale-105 ${
                  selectedVariant?.ram === v.ram && selectedVariant?.rom === v.rom
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50"
                }`}
              >
                {v.ram} GB / {v.rom} GB
              </button>
            ))}
          </div>
        </Card>
      )}

      {currentStep === "screen_defects" && (
        <Card className="p-8">
          <h2 className="text-2xl font-bold mb-6">Select screen/body defects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {screenDefectOptions.map((d) => (
              <button
                key={d.id}
                onClick={() => handleToggle(d.id, setScreenBodyDefects, screenBodyDefects)}
                className={`p-6 rounded-lg border-2 ${
                  screenBodyDefects.includes(d.id) ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </Card>
      )}

      {currentStep === "functional" && (
        <Card className="p-8">
          <h2 className="text-2xl font-bold mb-6">Functional Issues</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {functionalIssueOptions.map((i) => (
              <button
                key={i.id}
                onClick={() => handleToggle(i.id, setFunctionalIssues, functionalIssues)}
                className={`p-4 rounded-lg border-2 ${
                  functionalIssues.includes(i.id) ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                }`}
              >
                {i.label}
              </button>
            ))}
          </div>
        </Card>
      )}

      {currentStep === "accessories" && (
        <Card className="p-8">
          <h2 className="text-2xl font-bold mb-6">Accessories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {accessoryOptions.map((a) => (
              <button
                key={a.id}
                onClick={() => handleToggle(a.id, setAccessories, accessories)}
                className={`p-6 rounded-lg border-2 ${
                  accessories.includes(a.id) ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                }`}
              >
                {a.label}
              </button>
            ))}
          </div>
        </Card>
      )}

      {currentStep === "age" && (
        <Card className="p-8">
          <h2 className="text-2xl font-bold mb-6">Mobile Age</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {ageOptions.map((o) => (
              <button
                key={o.id}
                onClick={() => setAgeCategory(o.id)}
                className={`p-6 rounded-lg border-2 ${
                  ageCategory === o.id ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                }`}
              >
                <div className="text-lg font-semibold">{o.label}</div>
                {o.subtext && <div className="text-xs text-primary">{o.subtext}</div>}
              </button>
            ))}
          </div>
        </Card>
      )}

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

