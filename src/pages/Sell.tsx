import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { calculatePrice } from "@/utils/pricingEngine";
import { sellRequestSchema } from "@/lib/validationSchemas";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Laptop, Monitor, ChevronRight, Loader2 } from "lucide-react";
import { toast } from "sonner";

type Step = "category" | "brand" | "series" | "model" | "switch_on" | "config" | "additional" | "functionality" | "screen_condition" | "age" | "physical_condition" | "accessories" | "price" | "confirm";

const Sell = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const initialCategory = searchParams.get("category") as "laptop" | "desktop" | null;
  
  const [step, setStep] = useState<Step>(initialCategory ? "brand" : "category");
  const [loading, setLoading] = useState(false);
  
  // Form data
  const [category, setCategory] = useState<"laptop" | "desktop" | "">(initialCategory || "");
  const [brands, setBrands] = useState<any[]>([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [seriesList, setSeriesList] = useState<any[]>([]);
  const [selectedSeries, setSelectedSeries] = useState("");
  const [models, setModels] = useState<any[]>([]);
  const [selectedModel, setSelectedModel] = useState<any>(null);
  
  // Device details
  const [switchesOn, setSwitchesOn] = useState<boolean | null>(null);
  const [ageMonths, setAgeMonths] = useState<number>(6);
  const [screenCondition, setScreenCondition] = useState("good");
  const [physicalCondition, setPhysicalCondition] = useState("good");
  const [functionalityIssues, setFunctionalityIssues] = useState<string[]>([]);
  const [accessories, setAccessories] = useState({
    box: false,
    bill: false,
    charger: false,
    original_ram: false,
    extra_battery: false,
  });
  const [config, setConfig] = useState({
    cpu: "i5",
    ram: "8gb",
    storage: "256_ssd",
    gpu: "integrated",
    screen_size: "14-15",
    has_graphics_card: "no",
  });
  
  const [pricingRules, setPricingRules] = useState<any>(null);
  const [estimatedPrice, setEstimatedPrice] = useState(0);
  const [priceBreakdown, setPriceBreakdown] = useState<any>(null);
  
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");

  // Fetch brands when category is selected
  useEffect(() => {
    if (category) {
      fetchBrands();
    }
  }, [category]);

  // Fetch series when brand is selected
  useEffect(() => {
    if (selectedBrand) {
      fetchSeries();
    }
  }, [selectedBrand]);

  // Fetch models when series is selected
  useEffect(() => {
    if (selectedSeries) {
      fetchModels();
    }
  }, [selectedSeries]);

  // Fetch pricing rules
  useEffect(() => {
    fetchPricingRules();
  }, []);

  const fetchBrands = async () => {
    const { data: categoryData } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', category)
      .single();

    if (categoryData) {
      const { data, error } = await supabase
        .from('brands')
        .select('*')
        .eq('category_id', categoryData.id)
        .order('name');

      if (error) {
        toast.error('Failed to load brands');
        console.error(error);
      } else {
        setBrands(data || []);
      }
    }
  };

  const fetchSeries = async () => {
    const { data, error } = await supabase
      .from('series')
      .select('*')
      .eq('brand_id', selectedBrand)
      .order('name');

    if (error) {
      toast.error('Failed to load series');
      console.error(error);
    } else {
      setSeriesList(data || []);
    }
  };

  const fetchModels = async () => {
    const { data, error } = await supabase
      .from('models')
      .select('*')
      .eq('series_id', selectedSeries)
      .eq('active', true)
      .order('name');

    if (error) {
      toast.error('Failed to load models');
      console.error(error);
    } else {
      setModels(data || []);
    }
  };

  const fetchPricingRules = async () => {
    const { data, error } = await supabase
      .from('pricing_rules')
      .select('*')
      .eq('is_global', true)
      .single();

    if (error) {
      console.error('Failed to load pricing rules:', error);
    } else {
      setPricingRules(data);
    }
  };

  const handleCategorySelect = (selected: "laptop" | "desktop") => {
    setCategory(selected);
    setStep("brand");
    window.scrollTo(0, 0);
  };

  const handleBrandSelect = (brandId: string) => {
    setSelectedBrand(brandId);
    setSelectedSeries("");
    setSelectedModel(null);
    setStep("series");
    window.scrollTo(0, 0);
  };

  const handleSeriesSelect = (seriesId: string) => {
    setSelectedSeries(seriesId);
    setSelectedModel(null);
    setStep("model");
    window.scrollTo(0, 0);
  };

  const handleModelSelect = (model: any) => {
    setSelectedModel(model);
    setStep("switch_on");
    window.scrollTo(0, 0);
  };

  const handleCalculatePrice = () => {
    if (!selectedModel || !pricingRules) {
      toast.error('Missing model or pricing data');
      return;
    }

    // Determine overall condition based on functionality, screen, and physical condition
    let overallCondition = "good";
    if (functionalityIssues.length > 2 || physicalCondition === "below_average") {
      overallCondition = "faulty";
    } else if (functionalityIssues.length > 0 || physicalCondition === "average" || screenCondition === "damaged") {
      overallCondition = "average";
    } else if (screenCondition === "average") {
      overallCondition = "good";
    } else if (physicalCondition === "good" && screenCondition === "good") {
      overallCondition = "excellent";
    } else if (physicalCondition === "flawless" && screenCondition === "good") {
      overallCondition = "like_new";
    }

    const calculation = calculatePrice(
      parseFloat(selectedModel.base_price),
      ageMonths,
      overallCondition,
      accessories,
      config,
      pricingRules
    );

    setEstimatedPrice(calculation.finalPrice);
    setPriceBreakdown(calculation.breakdown);
    setStep("price");
    window.scrollTo(0, 0);
  };

  const handleConfirmPrice = () => {
    if (!user) {
      navigate(`/auth?redirect=/sell`);
      return;
    }
    setStep("confirm");
    window.scrollTo(0, 0);
  };

  const handleSubmitRequest = async () => {
    if (!user || !selectedModel) {
      toast.error('Please log in and select a model');
      return;
    }

    // Validate inputs
    const validation = sellRequestSchema.safeParse({ address, pincode });
    if (!validation.success) {
      const errors = validation.error.errors.map(e => e.message).join(', ');
      toast.error(errors);
      return;
    }

    setLoading(true);

    const { data, error } = await supabase
      .from('sell_requests')
      .insert({
        user_id: user.id,
        model_id: selectedModel.id,
        age_months: ageMonths,
        condition: physicalCondition as Database['public']['Enums']['device_condition'],
        accessories: accessories as any,
        config: {
          ...config,
          screen_condition: screenCondition,
          functionality_issues: functionalityIssues,
          switches_on: switchesOn,
        } as any,
        estimated_price: estimatedPrice,
        address,
        pincode,
      })
      .select()
      .single();

    setLoading(false);

    if (error) {
      toast.error('Failed to create request');
      console.error(error);
    } else {
      toast.success('Request created successfully!');
      navigate(`/track/${data.id}`);
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
                {brands.map((brand) => (
                  <Card
                    key={brand.id}
                    className="cursor-pointer p-4 hover:border-primary hover:shadow-lg transition-all"
                    onClick={() => handleBrandSelect(brand.id)}
                  >
                    {brand.logo_url && (
                      <div className="aspect-square mb-2 flex items-center justify-center overflow-hidden rounded-md bg-muted">
                        <img 
                          src={brand.logo_url.startsWith('http') ? brand.logo_url : supabase.storage.from('brand-logos').getPublicUrl(brand.logo_url).data.publicUrl}
                          alt={brand.name}
                          className="h-full w-full object-contain"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                    <h3 className="font-semibold text-center text-sm">{brand.name}</h3>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Series Selection */}
          {step === "series" && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-center">Select Series</h2>
              <div className="grid grid-cols-2 gap-4">
                {seriesList.map((series) => (
                  <Card
                    key={series.id}
                    className="cursor-pointer p-4 hover:border-primary hover:shadow-lg transition-all"
                    onClick={() => handleSeriesSelect(series.id)}
                  >
                    {series.image_url && (
                      <div className="aspect-square mb-3 overflow-hidden rounded-md bg-muted">
                        <img 
                          src={series.image_url.startsWith('http') ? series.image_url : supabase.storage.from('series-images').getPublicUrl(series.image_url).data.publicUrl}
                          alt={series.name}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                    <h3 className="font-semibold text-center text-sm">{series.name}</h3>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Model Selection */}
          {step === "model" && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-center">Select Model</h2>
              <div className="grid grid-cols-2 gap-4">
                {models.map((model) => (
                  <Card
                    key={model.id}
                    className="cursor-pointer p-4 hover:border-primary hover:shadow-lg transition-all"
                    onClick={() => handleModelSelect(model)}
                  >
                    {model.thumbnail_url && (
                      <div className="aspect-square mb-3 overflow-hidden rounded-md bg-muted">
                        <img 
                          src={model.thumbnail_url.startsWith('http') ? model.thumbnail_url : supabase.storage.from('model-thumbnails').getPublicUrl(model.thumbnail_url).data.publicUrl}
                          alt={model.name}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                    <h3 className="font-semibold text-sm mb-1">{model.name}</h3>
                    <p className="text-xs text-muted-foreground">₹{parseFloat(model.base_price).toLocaleString()}</p>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Switch On Check */}
          {step === "switch_on" && (
            <Card className="p-8 max-w-2xl mx-auto space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-semibold mb-2">Does the {category} switch on?</h2>
                <p className="text-muted-foreground">We currently only accept devices that switch on without any issues</p>
              </div>
              <RadioGroup value={switchesOn === null ? "" : switchesOn.toString()} onValueChange={(v) => setSwitchesOn(v === "true")}>
                <Card className={`p-6 cursor-pointer transition-all ${switchesOn === true ? 'border-primary' : ''}`}>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="true" id="switch_yes" />
                    <Label htmlFor="switch_yes" className="text-lg cursor-pointer flex-1">Yes</Label>
                  </div>
                </Card>
                <Card className={`p-6 cursor-pointer transition-all ${switchesOn === false ? 'border-primary' : ''}`}>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="false" id="switch_no" />
                    <Label htmlFor="switch_no" className="text-lg cursor-pointer flex-1">No</Label>
                  </div>
                </Card>
              </RadioGroup>
              <Button 
                variant="cta" 
                className="w-full" 
                onClick={() => { setStep("config"); window.scrollTo(0, 0); }}
                disabled={switchesOn === null}
              >
                Continue <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Card>
          )}

          {/* System Configuration */}
          {step === "config" && (
            <Card className="p-8 max-w-2xl mx-auto space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-semibold mb-2">Select the system configuration of your device?</h2>
                <p className="text-muted-foreground">Please select your device system configuration</p>
              </div>
              <div className="space-y-6">
                <div>
                  <Label className="text-lg font-semibold mb-3 block">Processor</Label>
                  <Select value={config.cpu} onValueChange={(v) => setConfig({ ...config, cpu: v })}>
                    <SelectTrigger className="bg-background h-14 text-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-background z-50">
                      <SelectItem value="i3">Intel Core i3</SelectItem>
                      <SelectItem value="i5">Intel Core i5</SelectItem>
                      <SelectItem value="i7">Intel Core i7</SelectItem>
                      <SelectItem value="i9">Intel Core i9</SelectItem>
                      <SelectItem value="m1">Apple M1</SelectItem>
                      <SelectItem value="m2">Apple M2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-lg font-semibold mb-3 block">RAM</Label>
                  <Select value={config.ram} onValueChange={(v) => setConfig({ ...config, ram: v })}>
                    <SelectTrigger className="bg-background h-14 text-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-background z-50">
                      <SelectItem value="4gb">4GB</SelectItem>
                      <SelectItem value="8gb">8GB</SelectItem>
                      <SelectItem value="16gb">16GB</SelectItem>
                      <SelectItem value="32gb">32GB</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-lg font-semibold mb-3 block">Hard Disk</Label>
                  <Select value={config.storage} onValueChange={(v) => setConfig({ ...config, storage: v })}>
                    <SelectTrigger className="bg-background h-14 text-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-background z-50">
                      <SelectItem value="256_ssd">256GB SSD</SelectItem>
                      <SelectItem value="512_ssd">512GB SSD</SelectItem>
                      <SelectItem value="1tb_ssd">1TB SSD</SelectItem>
                      <SelectItem value="500_hdd">500GB HDD</SelectItem>
                      <SelectItem value="1tb_hdd">1TB HDD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button variant="cta" className="w-full" onClick={() => { setStep("additional"); window.scrollTo(0, 0); }}>
                Continue <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Card>
          )}

          {/* Additional Features */}
          {step === "additional" && (
            <Card className="p-8 max-w-2xl mx-auto space-y-6">
              <div className="text-center mb-6">
                <p className="text-muted-foreground mb-2">Please select your device additional features</p>
              </div>
              <div className="space-y-6">
                <div>
                  <Label className="text-lg font-semibold mb-3 block">Screen Size</Label>
                  <p className="text-sm text-muted-foreground mb-3">Check your device's screen size</p>
                  <RadioGroup value={config.screen_size} onValueChange={(v) => setConfig({ ...config, screen_size: v })}>
                    <Card className={`p-4 cursor-pointer transition-all ${config.screen_size === "10-11" ? 'border-primary' : ''}`}>
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="10-11" id="size_10_11" />
                        <Label htmlFor="size_10_11" className="cursor-pointer flex-1">10-11 inch</Label>
                      </div>
                    </Card>
                    <Card className={`p-4 cursor-pointer transition-all ${config.screen_size === "12-13" ? 'border-primary' : ''}`}>
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="12-13" id="size_12_13" />
                        <Label htmlFor="size_12_13" className="cursor-pointer flex-1">12-13 inch</Label>
                      </div>
                    </Card>
                    <Card className={`p-4 cursor-pointer transition-all ${config.screen_size === "14-15" ? 'border-primary' : ''}`}>
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="14-15" id="size_14_15" />
                        <Label htmlFor="size_14_15" className="cursor-pointer flex-1">14-15 inch</Label>
                      </div>
                    </Card>
                    <Card className={`p-4 cursor-pointer transition-all ${config.screen_size === "above_15" ? 'border-primary' : ''}`}>
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="above_15" id="size_above_15" />
                        <Label htmlFor="size_above_15" className="cursor-pointer flex-1">Above 15 inch</Label>
                      </div>
                    </Card>
                  </RadioGroup>
                </div>
                <div>
                  <Label className="text-lg font-semibold mb-3 block">External Graphics Card (NVIDIA/ AMD)</Label>
                  <p className="text-sm text-muted-foreground mb-3">Check your device's external graphics cards</p>
                  <RadioGroup value={config.has_graphics_card} onValueChange={(v) => setConfig({ ...config, has_graphics_card: v })}>
                    <Card className={`p-4 cursor-pointer transition-all ${config.has_graphics_card === "yes" ? 'border-primary' : ''}`}>
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="yes" id="gpu_yes" />
                        <Label htmlFor="gpu_yes" className="cursor-pointer flex-1">Graphics Card available</Label>
                      </div>
                    </Card>
                    <Card className={`p-4 cursor-pointer transition-all ${config.has_graphics_card === "no" ? 'border-primary' : ''}`}>
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="no" id="gpu_no" />
                        <Label htmlFor="gpu_no" className="cursor-pointer flex-1">Graphics Card not available</Label>
                      </div>
                    </Card>
                    <Card className={`p-4 cursor-pointer transition-all ${config.has_graphics_card === "not_working" ? 'border-primary' : ''}`}>
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="not_working" id="gpu_not_working" />
                        <Label htmlFor="gpu_not_working" className="cursor-pointer flex-1">Graphics Card not working</Label>
                      </div>
                    </Card>
                  </RadioGroup>
                </div>
              </div>
              <Button variant="cta" className="w-full" onClick={() => { setStep("functionality"); window.scrollTo(0, 0); }}>
                Continue <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Card>
          )}

          {/* Functionality Check */}
          {step === "functionality" && (
            <Card className="p-8 max-w-2xl mx-auto space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-semibold mb-2">Does your device function properly?</h2>
                <p className="text-muted-foreground">Please choose appropriate condition to get accurate quote</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { id: "keyboard", label: "Keyboard not working; key(s) missing/not working" },
                  { id: "cd_dvd", label: "CD/DVD Drive not working" },
                  { id: "touchpad", label: "Touchpad not working; Left/Right click faulty" },
                  { id: "battery", label: "Battery dead, backup < 60 mins, health < 80%, cycle count > 500" },
                  { id: "ports", label: "USB/HDMI ports not working" },
                  { id: "wifi", label: "WiFi/Bluetooth not working" },
                  { id: "speakers", label: "Speakers/Audio not working" },
                  { id: "webcam", label: "Webcam/Microphone not working" },
                  { id: "overheating", label: "Device overheating issues" },
                  { id: "display", label: "Display flickering or dim" }
                ].map((issue) => (
                  <Card
                    key={issue.id}
                    className={`p-6 cursor-pointer transition-all text-center ${functionalityIssues.includes(issue.id) ? 'border-primary bg-primary/5' : ''}`}
                    onClick={() => {
                      setFunctionalityIssues(prev => 
                        prev.includes(issue.id) 
                          ? prev.filter(i => i !== issue.id)
                          : [...prev, issue.id]
                      );
                    }}
                  >
                    <p className="text-sm">{issue.label}</p>
                  </Card>
                ))}
              </div>
              <Button variant="cta" className="w-full" onClick={() => { setStep("screen_condition"); window.scrollTo(0, 0); }}>
                Continue <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Card>
          )}

          {/* Screen Condition */}
          {step === "screen_condition" && (
            <Card className="p-8 max-w-2xl mx-auto space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-semibold mb-2">Select the screen condition of your device?</h2>
                <p className="text-muted-foreground">The better condition your device is in, we will pay you more</p>
              </div>
              <RadioGroup value={screenCondition} onValueChange={setScreenCondition}>
                <Card className={`p-6 cursor-pointer transition-all ${screenCondition === "good" ? 'border-primary' : ''}`}>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="good" id="screen_good" />
                    <div className="flex-1">
                      <Label htmlFor="screen_good" className="text-lg cursor-pointer block font-semibold mb-1">Good</Label>
                      <p className="text-sm text-muted-foreground">Major scratches on screen</p>
                      <p className="text-sm text-muted-foreground">No Lines/Dents/Discoloration/ Crack(s) on Screen</p>
                    </div>
                  </div>
                </Card>
                <Card className={`p-6 cursor-pointer transition-all ${screenCondition === "average" ? 'border-primary' : ''}`}>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="average" id="screen_average" />
                    <div className="flex-1">
                      <Label htmlFor="screen_average" className="text-lg cursor-pointer block font-semibold mb-1">Average</Label>
                      <p className="text-sm text-muted-foreground">1-2 spots on screen/display</p>
                      <p className="text-sm text-muted-foreground">Minor Discoloration on Screen</p>
                      <p className="text-sm text-muted-foreground">No Line/Dents/Crack(s) on Screen</p>
                    </div>
                  </div>
                </Card>
                <Card className={`p-6 cursor-pointer transition-all ${screenCondition === "damaged" ? 'border-primary' : ''}`}>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="damaged" id="screen_damaged" />
                    <div className="flex-1">
                      <Label htmlFor="screen_damaged" className="text-lg cursor-pointer block font-semibold mb-1">Damaged</Label>
                      <p className="text-sm text-muted-foreground">Heavy signs of usage</p>
                      <p className="text-sm text-muted-foreground">Screen touch not working</p>
                      <p className="text-sm text-muted-foreground">Lines/ Discoloration/ blur/ Cracked or broken on screen</p>
                    </div>
                  </div>
                </Card>
              </RadioGroup>
              <Button variant="cta" className="w-full" onClick={() => { setStep("age"); window.scrollTo(0, 0); }}>
                Continue <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Card>
          )}

          {/* Device Age */}
          {step === "age" && (
            <Card className="p-8 max-w-2xl mx-auto space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-semibold mb-2">Age of your device</h2>
                <p className="text-muted-foreground">Let us know how old is your device. Valid bill is needed for devices less than 3 years.</p>
              </div>
              <RadioGroup value={ageMonths.toString()} onValueChange={(v) => setAgeMonths(parseInt(v))}>
                <Card className={`p-6 cursor-pointer transition-all ${ageMonths <= 12 ? 'border-primary' : ''}`}>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="6" id="age_1" />
                    <Label htmlFor="age_1" className="text-lg cursor-pointer flex-1">Less than 1 year (in warranty)</Label>
                  </div>
                </Card>
                <Card className={`p-6 cursor-pointer transition-all ${ageMonths > 12 && ageMonths <= 36 ? 'border-primary' : ''}`}>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="24" id="age_2" />
                    <Label htmlFor="age_2" className="text-lg cursor-pointer flex-1">Between 1 and 3 years</Label>
                  </div>
                </Card>
                <Card className={`p-6 cursor-pointer transition-all ${ageMonths > 36 ? 'border-primary' : ''}`}>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="48" id="age_3" />
                    <Label htmlFor="age_3" className="text-lg cursor-pointer flex-1">More than 3 years</Label>
                  </div>
                </Card>
              </RadioGroup>
              <Button variant="cta" className="w-full" onClick={() => { setStep("physical_condition"); window.scrollTo(0, 0); }}>
                Continue <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Card>
          )}

          {/* Physical Condition */}
          {step === "physical_condition" && (
            <Card className="p-8 max-w-2xl mx-auto space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-semibold mb-2">Select the physical condition of your device?</h2>
                <p className="text-muted-foreground">The better condition your device is in, we will pay you more</p>
              </div>
              <RadioGroup value={physicalCondition} onValueChange={setPhysicalCondition}>
                <Card className={`p-6 cursor-pointer transition-all ${physicalCondition === "flawless" ? 'border-primary' : ''}`}>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="flawless" id="phys_flawless" />
                    <div className="flex-1">
                      <Label htmlFor="phys_flawless" className="text-lg cursor-pointer block font-semibold mb-1">Flawless</Label>
                      <p className="text-sm text-muted-foreground">No scratches on the device</p>
                      <p className="text-sm text-muted-foreground">No signs of usage on the device</p>
                      <p className="text-sm text-muted-foreground">No dents or cracks on the device</p>
                    </div>
                  </div>
                </Card>
                <Card className={`p-6 cursor-pointer transition-all ${physicalCondition === "good" ? 'border-primary' : ''}`}>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="good" id="phys_good" />
                    <div className="flex-1">
                      <Label htmlFor="phys_good" className="text-lg cursor-pointer block font-semibold mb-1">Good</Label>
                      <p className="text-sm text-muted-foreground">Normal signs of usage</p>
                      <p className="text-sm text-muted-foreground">Minor scratches on the device</p>
                      <p className="text-sm text-muted-foreground">No dents or cracks on the device</p>
                    </div>
                  </div>
                </Card>
                <Card className={`p-6 cursor-pointer transition-all ${physicalCondition === "average" ? 'border-primary' : ''}`}>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="average" id="phys_average" />
                    <div className="flex-1">
                      <Label htmlFor="phys_average" className="text-lg cursor-pointer block font-semibold mb-1">Average</Label>
                      <p className="text-sm text-muted-foreground">Major scratches/Dents on device</p>
                      <p className="text-sm text-muted-foreground">Loose/Broken Hinges/Discoloration of device</p>
                      <p className="text-sm text-muted-foreground">Screw(s) missing from device</p>
                      <p className="text-sm text-muted-foreground">Panel intact with cracks</p>
                    </div>
                  </div>
                </Card>
                <Card className={`p-6 cursor-pointer transition-all ${physicalCondition === "below_average" ? 'border-primary' : ''}`}>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="below_average" id="phys_below" />
                    <div className="flex-1">
                      <Label htmlFor="phys_below" className="text-lg cursor-pointer block font-semibold mb-1">Below Average</Label>
                      <p className="text-sm text-muted-foreground">Physical damage on device</p>
                      <p className="text-sm text-muted-foreground">Multiple scratches or dents on device</p>
                      <p className="text-sm text-muted-foreground">Broken hinges on device panel</p>
                      <p className="text-sm text-muted-foreground">Parts missing from device</p>
                    </div>
                  </div>
                </Card>
              </RadioGroup>
              <Button variant="cta" className="w-full" onClick={() => { setStep("accessories"); window.scrollTo(0, 0); }}>
                Continue <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Card>
          )}

          {/* Accessories */}
          {step === "accessories" && (
            <Card className="p-8 max-w-2xl mx-auto space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-semibold mb-2">Available Accessories</h2>
                <p className="text-muted-foreground">Select all accessories you have with the device</p>
              </div>
              <div className="space-y-3">
                {Object.keys(accessories).map((key) => (
                  <Card key={key} className={`p-4 cursor-pointer transition-all ${accessories[key as keyof typeof accessories] ? 'border-primary bg-primary/5' : ''}`}
                    onClick={() => setAccessories({ ...accessories, [key]: !accessories[key as keyof typeof accessories] })}
                  >
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id={key}
                        checked={accessories[key as keyof typeof accessories]}
                        onCheckedChange={(checked) =>
                          setAccessories({ ...accessories, [key]: checked })
                        }
                      />
                      <Label htmlFor={key} className="capitalize cursor-pointer flex-1 text-lg">
                        {key.replace(/_/g, ' ')}
                      </Label>
                    </div>
                  </Card>
                ))}
              </div>
              <Button variant="cta" className="w-full" onClick={handleCalculatePrice}>
                Get Final Price <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Card>
          )}

          {/* Price Display */}
          {step === "price" && (
            <Card className="p-8 max-w-md mx-auto">
              <h2 className="text-xl font-semibold mb-4 text-center">Your Final Quote</h2>
              
              <div className="my-8 sm:my-12 text-center">
                <div className="inline-block rounded-2xl sm:rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 px-6 py-6 sm:px-12 sm:py-10 border-2 border-primary/20">
                  <p className="text-xs sm:text-sm text-muted-foreground mb-2">You will receive</p>
                  <p className="text-3xl sm:text-4xl md:text-6xl font-bold text-primary break-words">₹{estimatedPrice.toLocaleString()}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-2">Final price for your device</p>
                </div>
              </div>

              <div className="space-y-3 mb-6 p-4 bg-muted/30 rounded-lg">
                <p className="text-sm text-center text-muted-foreground">
                  This is an estimated quote. Final price will be confirmed after physical inspection of the device.
                </p>
              </div>

              <Button variant="cta" className="w-full" onClick={handleConfirmPrice}>
                Accept & Continue <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="ghost" className="w-full mt-2" onClick={() => setStep("accessories")}>
                Go Back
              </Button>
            </Card>
          )}

          {/* Confirmation & Address */}
          {step === "confirm" && (
            <Card className="p-8 max-w-md mx-auto">
              <h2 className="text-xl font-semibold mb-6">Pickup Address</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="address">Full Address</Label>
                  <Input
                    id="address"
                    placeholder="Street, Area, Landmark"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="pincode">Pincode</Label>
                  <Input
                    id="pincode"
                    placeholder="e.g., 560001"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                  />
                </div>
                <div className="rounded-lg bg-muted/50 p-4 text-sm">
                  <p className="font-semibold mb-2">Summary</p>
                  <p>Device: {selectedModel?.name}</p>
                  <p>Estimated: ₹{estimatedPrice.toLocaleString()}</p>
                </div>
                <Button
                  variant="cta"
                  className="w-full"
                  onClick={handleSubmitRequest}
                  disabled={loading}
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Confirm Booking <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Sell;
