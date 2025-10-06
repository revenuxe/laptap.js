import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Laptop, Monitor, ChevronRight } from "lucide-react";

type Step = "category" | "brand" | "series" | "model" | "price" | "login" | "address" | "confirmation";

const brands = ["Apple", "Dell", "HP", "Lenovo", "Asus", "Acer", "MSI", "Microsoft"];

const Sell = () => {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") as "laptop" | "desktop" | null;
  
  const [step, setStep] = useState<Step>(initialCategory ? "brand" : "category");
  const [category, setCategory] = useState<"laptop" | "desktop" | "">(initialCategory || "");
  const [brand, setBrand] = useState("");
  const [series, setSeries] = useState("");
  const [model, setModel] = useState("");
  const [estimatedPrice, setEstimatedPrice] = useState(0);

  const handleCategorySelect = (selected: "laptop" | "desktop") => {
    setCategory(selected);
    setStep("brand");
  };

  const handleBrandSelect = (selected: string) => {
    setBrand(selected);
    setStep("series");
  };

  const handleSeriesSubmit = () => {
    if (series) {
      setStep("model");
    }
  };

  const handleModelSubmit = () => {
    if (model) {
      // Calculate estimated price (mock calculation)
      const basePrice = category === "laptop" ? 15000 : 20000;
      const brandMultiplier = brand === "Apple" ? 2.5 : brand === "Dell" ? 1.5 : 1.2;
      setEstimatedPrice(Math.floor(basePrice * brandMultiplier * (Math.random() * 0.3 + 0.85)));
      setStep("price");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-12 md:py-20">
        <div className="container max-w-4xl">
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Sell Your Device
            </h1>
            <p className="text-muted-foreground">Follow the steps to get an instant quote</p>
          </div>

          {/* Category Selection */}
          {step === "category" && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-center">Select Device Category</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
                <Card
                  className="cursor-pointer p-8 hover:border-primary hover:shadow-lg transition-all"
                  onClick={() => handleCategorySelect("laptop")}
                >
                  <Laptop className="mx-auto mb-4 h-16 w-16 text-primary" />
                  <h3 className="text-center text-lg font-semibold">Laptop</h3>
                </Card>
                
                <Card
                  className="cursor-pointer p-8 hover:border-primary hover:shadow-lg transition-all"
                  onClick={() => handleCategorySelect("desktop")}
                >
                  <Monitor className="mx-auto mb-4 h-16 w-16 text-primary" />
                  <h3 className="text-center text-lg font-semibold">Desktop</h3>
                </Card>
              </div>
            </div>
          )}

          {/* Brand Selection */}
          {step === "brand" && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-center">Select Brand</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {brands.map((brandName) => (
                  <Card
                    key={brandName}
                    className="cursor-pointer p-6 hover:border-primary hover:shadow-lg transition-all text-center"
                    onClick={() => handleBrandSelect(brandName)}
                  >
                    <h3 className="font-semibold">{brandName}</h3>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Series Input */}
          {step === "series" && (
            <Card className="p-8 max-w-md mx-auto">
              <h2 className="text-xl font-semibold mb-6">Enter Series Name</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="series">Series</Label>
                  <Input
                    id="series"
                    placeholder="e.g., MacBook Pro, XPS, Pavilion"
                    value={series}
                    onChange={(e) => setSeries(e.target.value)}
                  />
                </div>
                <Button
                  variant="cta"
                  className="w-full"
                  onClick={handleSeriesSubmit}
                  disabled={!series}
                >
                  Continue <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </Card>
          )}

          {/* Model Input */}
          {step === "model" && (
            <Card className="p-8 max-w-md mx-auto">
              <h2 className="text-xl font-semibold mb-6">Enter Model Details</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="model">Model</Label>
                  <Input
                    id="model"
                    placeholder="e.g., 2021, 15-inch, i7"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                  />
                </div>
                <Button
                  variant="cta"
                  className="w-full"
                  onClick={handleModelSubmit}
                  disabled={!model}
                >
                  Get Estimate <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </Card>
          )}

          {/* Price Estimate */}
          {step === "price" && (
            <Card className="p-8 max-w-md mx-auto text-center">
              <h2 className="text-xl font-semibold mb-4">Estimated Buying Price</h2>
              <div className="my-8">
                <div className="inline-block rounded-2xl bg-primary/10 px-8 py-6">
                  <p className="text-5xl font-bold text-primary">₹{estimatedPrice.toLocaleString()}</p>
                </div>
              </div>
              <div className="space-y-3 text-sm text-muted-foreground mb-6">
                <p><strong>Device:</strong> {brand} {series} {model}</p>
                <p><strong>Category:</strong> {category}</p>
              </div>
              <Button
                variant="cta"
                className="w-full"
                onClick={() => setStep("login")}
              >
                Accept & Continue <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                className="w-full mt-2"
                onClick={() => setStep("category")}
              >
                Start Over
              </Button>
            </Card>
          )}

          {/* Login Placeholder */}
          {step === "login" && (
            <Card className="p-8 max-w-md mx-auto">
              <h2 className="text-xl font-semibold mb-4 text-center">Login or Sign Up</h2>
              <p className="text-center text-muted-foreground mb-6">
                This is a demo. Authentication will be added with Lovable Cloud.
              </p>
              <Button
                variant="cta"
                className="w-full"
                onClick={() => setStep("address")}
              >
                Continue <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Card>
          )}

          {/* Address Form */}
          {step === "address" && (
            <Card className="p-8 max-w-md mx-auto">
              <h2 className="text-xl font-semibold mb-6">Pickup Address</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="address">Full Address</Label>
                  <Input id="address" placeholder="Street, Area, Landmark" />
                </div>
                <div>
                  <Label htmlFor="pincode">Pincode</Label>
                  <Input id="pincode" placeholder="e.g., 560001" />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" placeholder="10-digit mobile number" />
                </div>
                <Button
                  variant="cta"
                  className="w-full"
                  onClick={() => setStep("confirmation")}
                >
                  Confirm Booking <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </Card>
          )}

          {/* Confirmation */}
          {step === "confirmation" && (
            <Card className="p-8 max-w-md mx-auto text-center">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-secondary/20">
                <ChevronRight className="h-8 w-8 text-secondary" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Booking Confirmed!</h2>
              <p className="text-muted-foreground mb-6">
                Your pickup request has been created. Our team will contact you within 2 hours.
              </p>
              <div className="rounded-lg bg-muted/50 p-4 text-sm space-y-2 mb-6">
                <p><strong>Device:</strong> {brand} {series} {model}</p>
                <p><strong>Estimated Price:</strong> ₹{estimatedPrice.toLocaleString()}</p>
                <p><strong>Pickup:</strong> Same day or next day</p>
              </div>
              <Button variant="cta" className="w-full" onClick={() => window.location.href = "/dashboard"}>
                Go to Dashboard
              </Button>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Sell;
