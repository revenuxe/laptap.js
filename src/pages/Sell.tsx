import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { calculateDynamicPrice, getConditionLabel } from "@/utils/dynamicPricingEngine";
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
import { Laptop, Monitor, ChevronRight, Loader2, TrendingUp, Zap } from "lucide-react";
import { toast } from "sonner";
import { CountdownTimer } from "@/components/CountdownTimer";

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
    generation: "",
    ram: "8gb",
    storage: "256_ssd",
    gpu: "integrated",
    screen_size: "14-15",
    has_graphics_card: "no",
  });
  
  const [estimatedPrice, setEstimatedPrice] = useState(0);
  const [displayedPrice, setDisplayedPrice] = useState(0);
  const [marketingBonus, setMarketingBonus] = useState(0);
  const [priceBreakdown, setPriceBreakdown] = useState<any>(null);
  const [offerExpired, setOfferExpired] = useState(false);
  
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");

  // Restore form state from sessionStorage after auth redirect
  useEffect(() => {
    const savedState = sessionStorage.getItem('sellFormState');
    if (savedState && user) {
      try {
        const state = JSON.parse(savedState);
        setCategory(state.category);
        setSelectedBrand(state.selectedBrand);
        setSelectedSeries(state.selectedSeries);
        setSelectedModel(state.selectedModel);
        setSwitchesOn(state.switchesOn);
        setAgeMonths(state.ageMonths);
        setScreenCondition(state.screenCondition);
        setPhysicalCondition(state.physicalCondition);
        setFunctionalityIssues(state.functionalityIssues);
        setAccessories(state.accessories);
        setConfig(state.config);
        setEstimatedPrice(state.estimatedPrice);
        setDisplayedPrice(state.displayedPrice);
        setMarketingBonus(state.marketingBonus);
        setStep('confirm'); // Go directly to confirm step
        sessionStorage.removeItem('sellFormState'); // Clear saved state
        toast.success('Welcome back! Please complete your booking.');
      } catch (e) {
        console.error('Failed to restore form state:', e);
      }
    }
  }, [user]);

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

  // Real-time price calculation as user makes selections
  useEffect(() => {
    if (selectedModel && selectedBrand) {
      calculateRealTimePrice();
    }
  }, [selectedModel, ageMonths, physicalCondition, screenCondition, functionalityIssues, config]);

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

  const calculateRealTimePrice = async () => {
    if (!selectedModel || !selectedBrand) return;

    // Get brand name
    const { data: brandData } = await supabase
      .from('brands')
      .select('name')
      .eq('id', selectedBrand)
      .single();

    if (!brandData) return;

    const result = calculateDynamicPrice(
      parseFloat(selectedModel.base_price),
      brandData.name,
      ageMonths,
      physicalCondition,
      screenCondition,
      functionalityIssues,
      {
        cpu: config.cpu,
        ram: config.ram,
        storage: config.storage,
        gpu: config.has_graphics_card === 'yes' ? 'dedicated' : 'integrated',
        screen_size: config.screen_size,
      }
    );

    setEstimatedPrice(result.finalPriceActual);
    setDisplayedPrice(result.displayedPrice);
    setMarketingBonus(result.marketingBonus);
    setPriceBreakdown(result.breakdown);
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
    window.scrollTo(0, 0);
  };

  const handleCalculatePrice = async () => {
    if (!selectedModel || !selectedBrand) {
      toast.error('Missing model or brand data');
      return;
    }

    await calculateRealTimePrice();
    setOfferExpired(false);
    setStep("price");
    window.scrollTo(0, 0);
  };

  const handleConfirmPrice = () => {
    if (!user) {
      // Save form state before redirecting to auth
      const formState = {
        category,
        selectedBrand,
        selectedSeries,
        selectedModel,
        switchesOn,
        ageMonths,
        screenCondition,
        physicalCondition,
        functionalityIssues,
        accessories,
        config,
        estimatedPrice,
        displayedPrice,
        marketingBonus,
      };
      sessionStorage.setItem('sellFormState', JSON.stringify(formState));
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
                      <div className="aspect-square mb-2 flex items-center justify-center overflow-hidden rounded-md bg-muted p-3">
                        <img 
                          src={brand.logo_url.startsWith('http') ? brand.logo_url : supabase.storage.from('brand-logos').getPublicUrl(brand.logo_url).data.publicUrl}
                          alt={brand.name}
                          className="h-3/4 w-3/4 object-contain"
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
          {step === "model" && !selectedModel && (
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

          {/* Model Selected - Show Base Price */}
          {step === "model" && selectedModel && (
            <Card className="p-6 md:p-8 max-w-2xl mx-auto space-y-6">
              <div className="text-center">
                <h2 className="text-xl md:text-2xl font-semibold mb-4">{selectedModel.name}</h2>
                {selectedModel.thumbnail_url && (
                  <div className="w-32 h-32 md:w-40 md:h-40 mx-auto mb-6 overflow-hidden rounded-lg bg-muted">
                    <img 
                      src={selectedModel.thumbnail_url.startsWith('http') ? selectedModel.thumbnail_url : supabase.storage.from('model-thumbnails').getPublicUrl(selectedModel.thumbnail_url).data.publicUrl}
                      alt={selectedModel.name}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}
                <div className="mb-6">
                  <p className="text-muted-foreground mb-2">Base Price</p>
                  <p className="text-3xl md:text-4xl font-bold text-primary">
                    ₹{parseFloat(selectedModel.base_price).toLocaleString()}
                  </p>
                </div>
                <p className="text-sm text-muted-foreground mb-6">
                  This is the starting price. The final quote will be based on your device's condition and specifications.
                </p>
              </div>
              <Button 
                variant="cta" 
                className="w-full"
                onClick={() => { setStep("switch_on"); window.scrollTo(0, 0); }}
              >
                Evaluate Now <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Card>
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
            <Card className="p-4 md:p-8 max-w-2xl mx-auto space-y-4 md:space-y-6">
              <div className="text-center mb-4 md:mb-6">
                <h2 className="text-xl md:text-2xl font-semibold mb-2">Select the system configuration of your device?</h2>
                <p className="text-sm md:text-base text-muted-foreground">Please select your device system configuration</p>
              </div>
              <div className="space-y-4 md:space-y-6">
                <div>
                  <Label className="text-base md:text-lg font-semibold mb-2 md:mb-3 block">Processor</Label>
                  <Select value={config.cpu} onValueChange={(v) => setConfig({ ...config, cpu: v, generation: "" })}>
                    <SelectTrigger className="bg-background h-12 md:h-14 text-sm md:text-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-background z-50">
                      <SelectItem value="i3">Intel Core i3</SelectItem>
                      <SelectItem value="i5">Intel Core i5</SelectItem>
                      <SelectItem value="i7">Intel Core i7</SelectItem>
                      <SelectItem value="i9">Intel Core i9</SelectItem>
                      <SelectItem value="ryzen_3">AMD Ryzen 3</SelectItem>
                      <SelectItem value="ryzen_5">AMD Ryzen 5</SelectItem>
                      <SelectItem value="ryzen_7">AMD Ryzen 7</SelectItem>
                      <SelectItem value="ryzen_9">AMD Ryzen 9</SelectItem>
                      <SelectItem value="m1">Apple M1</SelectItem>
                      <SelectItem value="m2">Apple M2</SelectItem>
                      <SelectItem value="m3">Apple M3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-base md:text-lg font-semibold mb-2 md:mb-3 block">Generation</Label>
                  <Select value={config.generation} onValueChange={(v) => setConfig({ ...config, generation: v })}>
                    <SelectTrigger className="bg-background h-12 md:h-14 text-sm md:text-lg">
                      <SelectValue placeholder="Select generation" />
                    </SelectTrigger>
                    <SelectContent className="bg-background z-50">
                      {config.cpu.startsWith('i') && (
                        <>
                          <SelectItem value="1st">1st Generation</SelectItem>
                          <SelectItem value="2nd">2nd Generation</SelectItem>
                          <SelectItem value="3rd">3rd Generation</SelectItem>
                          <SelectItem value="4th">4th Generation</SelectItem>
                          <SelectItem value="5th">5th Generation</SelectItem>
                          <SelectItem value="6th">6th Generation</SelectItem>
                          <SelectItem value="7th">7th Generation</SelectItem>
                          <SelectItem value="8th">8th Generation</SelectItem>
                          <SelectItem value="9th">9th Generation</SelectItem>
                          <SelectItem value="10th">10th Generation</SelectItem>
                          <SelectItem value="11th">11th Generation</SelectItem>
                          <SelectItem value="12th">12th Generation</SelectItem>
                          <SelectItem value="13th">13th Generation</SelectItem>
                          <SelectItem value="14th">14th Generation</SelectItem>
                        </>
                      )}
                      {config.cpu.startsWith('ryzen') && (
                        <>
                          <SelectItem value="2000">2000 Series</SelectItem>
                          <SelectItem value="3000">3000 Series</SelectItem>
                          <SelectItem value="4000">4000 Series</SelectItem>
                          <SelectItem value="5000">5000 Series</SelectItem>
                          <SelectItem value="6000">6000 Series</SelectItem>
                          <SelectItem value="7000">7000 Series</SelectItem>
                          <SelectItem value="8000">8000 Series</SelectItem>
                        </>
                      )}
                      {config.cpu.startsWith('m') && (
                        <>
                          <SelectItem value="base">Base</SelectItem>
                          <SelectItem value="pro">Pro</SelectItem>
                          <SelectItem value="max">Max</SelectItem>
                          <SelectItem value="ultra">Ultra</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-base md:text-lg font-semibold mb-2 md:mb-3 block">RAM</Label>
                  <Select value={config.ram} onValueChange={(v) => setConfig({ ...config, ram: v })}>
                    <SelectTrigger className="bg-background h-12 md:h-14 text-sm md:text-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-background z-50">
                      <SelectItem value="4gb">4GB</SelectItem>
                      <SelectItem value="8gb">8GB</SelectItem>
                      <SelectItem value="16gb">16GB</SelectItem>
                      <SelectItem value="32gb">32GB</SelectItem>
                      <SelectItem value="64gb">64GB</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-base md:text-lg font-semibold mb-2 md:mb-3 block">Hard Disk</Label>
                  <Select value={config.storage} onValueChange={(v) => setConfig({ ...config, storage: v })}>
                    <SelectTrigger className="bg-background h-12 md:h-14 text-sm md:text-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-background z-50">
                      <SelectItem value="128_ssd">128GB SSD</SelectItem>
                      <SelectItem value="256_ssd">256GB SSD</SelectItem>
                      <SelectItem value="512_ssd">512GB SSD</SelectItem>
                      <SelectItem value="1tb_ssd">1TB SSD</SelectItem>
                      <SelectItem value="2tb_ssd">2TB SSD</SelectItem>
                      <SelectItem value="500_hdd">500GB HDD</SelectItem>
                      <SelectItem value="1tb_hdd">1TB HDD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button variant="cta" className="w-full text-sm md:text-base" onClick={() => { setStep("additional"); window.scrollTo(0, 0); }}>
                Continue <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Card>
          )}

          {/* Additional Features */}
          {step === "additional" && (
            <Card className="p-4 md:p-8 max-w-2xl mx-auto space-y-4 md:space-y-6">
              <div className="text-center mb-4 md:mb-6">
                <p className="text-sm md:text-base text-muted-foreground mb-2">Please select your device additional features</p>
              </div>
              <div className="space-y-4 md:space-y-6">
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
                  { id: "trackpad", label: "Trackpad not working; Left/Right click faulty" },
                  { id: "battery", label: "Battery dead, backup < 60 mins, health < 80%, cycle count > 500" },
                  { id: "ports", label: "USB/HDMI ports not working" },
                  { id: "wifi", label: "WiFi/Bluetooth not working" },
                  { id: "speakers", label: "Speakers/Audio not working" },
                  { id: "webcam", label: "Webcam/Microphone not working" },
                  { id: "overheating", label: "Device overheating issues" },
                  { id: "display_flickering", label: "Display flickering or dim" },
                  { id: "hinge", label: "Hinge damage or loose" }
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
            <Card className="p-4 md:p-8 max-w-2xl mx-auto space-y-4 md:space-y-6">
              <div className="text-center mb-4 md:mb-6">
                <h2 className="text-xl md:text-2xl font-semibold mb-2">Select the screen condition of your device?</h2>
                <p className="text-sm md:text-base text-muted-foreground">The better condition your device is in, we will pay you more</p>
              </div>
              <RadioGroup value={screenCondition} onValueChange={setScreenCondition}>
                <Card className={`p-4 md:p-6 cursor-pointer transition-all ${screenCondition === "flawless" ? 'border-primary' : ''}`}>
                  <div className="flex items-start space-x-3">
                    <RadioGroupItem value="flawless" id="screen_flawless" className="mt-1 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <Label htmlFor="screen_flawless" className="text-base md:text-lg cursor-pointer block font-semibold mb-1">Flawless</Label>
                      <p className="text-xs md:text-sm text-muted-foreground">No scratches on screen</p>
                      <p className="text-xs md:text-sm text-muted-foreground">No Lines/Dents/Discoloration/Cracks</p>
                    </div>
                  </div>
                </Card>
                <Card className={`p-4 md:p-6 cursor-pointer transition-all ${screenCondition === "good" ? 'border-primary' : ''}`}>
                  <div className="flex items-start space-x-3">
                    <RadioGroupItem value="good" id="screen_good" className="mt-1 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <Label htmlFor="screen_good" className="text-base md:text-lg cursor-pointer block font-semibold mb-1">Good</Label>
                      <p className="text-xs md:text-sm text-muted-foreground">Major scratches on screen</p>
                      <p className="text-xs md:text-sm text-muted-foreground">No Lines/Dents/Discoloration/Cracks</p>
                    </div>
                  </div>
                </Card>
                <Card className={`p-4 md:p-6 cursor-pointer transition-all ${screenCondition === "average" ? 'border-primary' : ''}`}>
                  <div className="flex items-start space-x-3">
                    <RadioGroupItem value="average" id="screen_average" className="mt-1 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <Label htmlFor="screen_average" className="text-base md:text-lg cursor-pointer block font-semibold mb-1">Average</Label>
                      <p className="text-xs md:text-sm text-muted-foreground">1-2 spots on screen/display</p>
                      <p className="text-xs md:text-sm text-muted-foreground">Minor Discoloration on Screen</p>
                      <p className="text-xs md:text-sm text-muted-foreground">No Lines/Dents/Cracks</p>
                    </div>
                  </div>
                </Card>
                <Card className={`p-4 md:p-6 cursor-pointer transition-all ${screenCondition === "damaged" ? 'border-primary' : ''}`}>
                  <div className="flex items-start space-x-3">
                    <RadioGroupItem value="damaged" id="screen_damaged" className="mt-1 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <Label htmlFor="screen_damaged" className="text-base md:text-lg cursor-pointer block font-semibold mb-1">Damaged</Label>
                      <p className="text-xs md:text-sm text-muted-foreground">Heavy signs of usage</p>
                      <p className="text-xs md:text-sm text-muted-foreground">Screen touch not working</p>
                      <p className="text-xs md:text-sm text-muted-foreground">Lines/Discoloration/blur/Cracked screen</p>
                    </div>
                  </div>
                </Card>
              </RadioGroup>
              <Button variant="cta" className="w-full text-sm md:text-base" onClick={() => { setStep("age"); window.scrollTo(0, 0); }}>
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
                    <Label htmlFor="age_1" className="text-lg cursor-pointer flex-1">Less than 1 year</Label>
                  </div>
                </Card>
                <Card className={`p-6 cursor-pointer transition-all ${ageMonths > 12 && ageMonths <= 24 ? 'border-primary' : ''}`}>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="18" id="age_2" />
                    <Label htmlFor="age_2" className="text-lg cursor-pointer flex-1">1-2 years</Label>
                  </div>
                </Card>
                <Card className={`p-6 cursor-pointer transition-all ${ageMonths > 24 && ageMonths <= 36 ? 'border-primary' : ''}`}>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="30" id="age_3" />
                    <Label htmlFor="age_3" className="text-lg cursor-pointer flex-1">2-3 years</Label>
                  </div>
                </Card>
                <Card className={`p-6 cursor-pointer transition-all ${ageMonths > 36 ? 'border-primary' : ''}`}>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="48" id="age_4" />
                    <Label htmlFor="age_4" className="text-lg cursor-pointer flex-1">More than 3 years</Label>
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
                <p className="text-xs text-muted-foreground mt-2 italic">Note: Accessories are tracked for verification but do not affect the price</p>
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

          {/* Price Display with Marketing */}
          {step === "price" && (
            <div className="max-w-3xl mx-auto space-y-4 px-4">
              {/* Marketing Banner */}
              {!offerExpired && (
                <Card className="p-4 md:p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
                    <div className="flex items-center gap-3">
                      <Zap className="h-5 w-5 md:h-6 md:w-6 text-primary animate-pulse flex-shrink-0" />
                      <div className="text-center sm:text-left">
                        <p className="font-semibold text-base md:text-lg">Limited Time Offer!</p>
                        <p className="text-xs md:text-sm text-muted-foreground">This price is valid for:</p>
                      </div>
                    </div>
                    <CountdownTimer 
                      durationMinutes={15} 
                      onExpire={() => {
                        setOfferExpired(true);
                        setDisplayedPrice(estimatedPrice);
                      }}
                    />
                  </div>
                </Card>
              )}

              {/* Main Price Display */}
              <Card className="p-4 md:p-8 text-center">
                <h2 className="text-lg md:text-2xl font-semibold mb-4 md:mb-6">Your Final Quote</h2>
                
                {/* Displayed Price (with bonus) */}
                {!offerExpired && (
                  <div className="mb-4 md:mb-6">
                    <div className="inline-block rounded-2xl md:rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 px-6 py-6 md:px-12 md:py-10 border-2 border-primary/20">
                      <p className="text-xs md:text-sm text-muted-foreground mb-2">Special Offer Price</p>
                      <p className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-primary break-words">₹{displayedPrice.toLocaleString()}</p>
                    </div>
                    
                    {/* Marketing Message */}
                    <div className="mt-4 md:mt-6 p-3 md:p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <TrendingUp className="h-4 w-4 md:h-5 md:w-5 text-green-600 flex-shrink-0" />
                        <p className="font-semibold text-sm md:text-base text-green-700 dark:text-green-400">You're Getting the Best Deal!</p>
                      </div>
                      <p className="text-xs md:text-sm text-green-700 dark:text-green-400">
                        That's <span className="font-bold">₹{marketingBonus.toLocaleString()} more</span> than what Cashify and other buyers typically offer!
                      </p>
                      <p className="text-xs text-green-600 dark:text-green-500 mt-1">
                        Our competitive analysis shows this is {Math.round((marketingBonus / displayedPrice) * 100)}% above market average
                      </p>
                    </div>
                  </div>
                )}

                {/* Expired - Show Actual Price */}
                {offerExpired && (
                  <div className="mb-4 md:mb-6">
                    <div className="inline-block rounded-2xl md:rounded-3xl bg-muted px-6 py-6 md:px-12 md:py-10 border-2">
                      <p className="text-xs md:text-sm text-muted-foreground mb-2">Standard Price</p>
                      <p className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold break-words">₹{estimatedPrice.toLocaleString()}</p>
                    </div>
                    <p className="text-xs md:text-sm text-muted-foreground mt-4">
                      The limited-time bonus has expired
                    </p>
                  </div>
                )}

                {/* Actual Payment Info */}
                <div className="p-3 md:p-4 bg-muted/30 rounded-lg mb-4 md:mb-6">
                  <p className="text-xs md:text-sm font-semibold mb-2">Payment Details</p>
                  <div className="flex justify-between items-center text-xs md:text-sm gap-2">
                    <span>Amount you'll receive:</span>
                    <span className="font-bold text-base md:text-lg">₹{estimatedPrice.toLocaleString()}</span>
                  </div>
                  {!offerExpired && marketingBonus > 0 && (
                    <div className="flex justify-between items-center text-xs text-muted-foreground mt-1 gap-2">
                      <span>Marketing bonus displayed:</span>
                      <span>+₹{marketingBonus.toLocaleString()}</span>
                    </div>
                  )}
                </div>

                <Button variant="cta" className="w-full mb-3 text-sm md:text-base" onClick={handleConfirmPrice}>
                  Accept Offer & Continue <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="ghost" className="w-full text-sm md:text-base" onClick={() => setStep("accessories")}>
                  Modify Details
                </Button>
              </Card>

              {/* Disclaimer */}
              <Card className="p-3 md:p-4 bg-muted/20">
                <p className="text-xs text-center text-muted-foreground">
                  * This is an estimated quote based on the information provided. The final price will be confirmed after physical inspection of your device. Our team will verify the device condition, specifications, and functionality before confirming payment.
                </p>
              </Card>
            </div>
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
