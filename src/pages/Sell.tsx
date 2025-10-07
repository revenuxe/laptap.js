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

type Step = "category" | "brand" | "series" | "model" | "details" | "price" | "confirm";

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
  const [ageMonths, setAgeMonths] = useState<number>(6);
  const [condition, setCondition] = useState("good");
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
  };

  const handleBrandSelect = (brandId: string) => {
    setSelectedBrand(brandId);
    setSelectedSeries("");
    setSelectedModel(null);
    setStep("series");
  };

  const handleSeriesSelect = (seriesId: string) => {
    setSelectedSeries(seriesId);
    setSelectedModel(null);
    setStep("model");
  };

  const handleModelSelect = (model: any) => {
    setSelectedModel(model);
    setStep("details");
  };

  const handleCalculatePrice = () => {
    if (!selectedModel || !pricingRules) {
      toast.error('Missing model or pricing data');
      return;
    }

    const calculation = calculatePrice(
      parseFloat(selectedModel.base_price),
      ageMonths,
      condition,
      accessories,
      config,
      pricingRules
    );

    setEstimatedPrice(calculation.finalPrice);
    setPriceBreakdown(calculation.breakdown);
    setStep("price");
  };

  const handleConfirmPrice = () => {
    if (!user) {
      navigate(`/auth?redirect=/sell`);
      return;
    }
    setStep("confirm");
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
        condition: condition as Database['public']['Enums']['device_condition'],
        accessories: accessories as any,
        config: config as any,
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
                    className="cursor-pointer p-6 hover:border-primary hover:shadow-lg transition-all text-center"
                    onClick={() => handleBrandSelect(brand.id)}
                  >
                    <h3 className="font-semibold">{brand.name}</h3>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Series Selection */}
          {step === "series" && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-center">Select Series</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {seriesList.map((series) => (
                  <Card
                    key={series.id}
                    className="cursor-pointer p-6 hover:border-primary hover:shadow-lg transition-all"
                    onClick={() => handleSeriesSelect(series.id)}
                  >
                    <h3 className="font-semibold text-center">{series.name}</h3>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Model Selection */}
          {step === "model" && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-center">Select Model</h2>
              <div className="space-y-4">
                {models.map((model) => (
                  <Card
                    key={model.id}
                    className="cursor-pointer p-6 hover:border-primary hover:shadow-lg transition-all"
                    onClick={() => handleModelSelect(model)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">{model.name}</h3>
                        <p className="text-sm text-muted-foreground">Base Price: ₹{parseFloat(model.base_price).toLocaleString()}</p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Device Details */}
          {step === "details" && selectedModel && (
            <Card className="p-8 max-w-2xl mx-auto space-y-6">
              <h2 className="text-xl font-semibold">Device Details</h2>
              
              <div className="space-y-4">
                <div>
                  <Label>Device Age</Label>
                  <Select value={ageMonths.toString()} onValueChange={(v) => setAgeMonths(parseInt(v))}>
                    <SelectTrigger className="bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-background z-50">
                      <SelectItem value="2">0-3 months</SelectItem>
                      <SelectItem value="4">3-6 months</SelectItem>
                      <SelectItem value="9">6-12 months</SelectItem>
                      <SelectItem value="18">12-24 months</SelectItem>
                      <SelectItem value="30">24+ months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Condition</Label>
                  <RadioGroup value={condition} onValueChange={setCondition}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="like_new" id="like_new" />
                      <Label htmlFor="like_new">Like New</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="excellent" id="excellent" />
                      <Label htmlFor="excellent">Excellent</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="good" id="good" />
                      <Label htmlFor="good">Good</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="average" id="average" />
                      <Label htmlFor="average">Average</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="faulty" id="faulty" />
                      <Label htmlFor="faulty">Faulty</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label>Accessories</Label>
                  <div className="space-y-2">
                    {Object.keys(accessories).map((key) => (
                      <div key={key} className="flex items-center space-x-2">
                        <Checkbox
                          id={key}
                          checked={accessories[key as keyof typeof accessories]}
                          onCheckedChange={(checked) =>
                            setAccessories({ ...accessories, [key]: checked })
                          }
                        />
                        <Label htmlFor={key} className="capitalize">
                          {key.replace('_', ' ')}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>CPU</Label>
                  <Select value={config.cpu} onValueChange={(v) => setConfig({ ...config, cpu: v })}>
                    <SelectTrigger className="bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-background z-50">
                      <SelectItem value="i3">Intel i3</SelectItem>
                      <SelectItem value="i5">Intel i5</SelectItem>
                      <SelectItem value="i7">Intel i7</SelectItem>
                      <SelectItem value="i9">Intel i9</SelectItem>
                      <SelectItem value="m1">Apple M1</SelectItem>
                      <SelectItem value="m2">Apple M2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>RAM</Label>
                  <Select value={config.ram} onValueChange={(v) => setConfig({ ...config, ram: v })}>
                    <SelectTrigger className="bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-background z-50">
                      <SelectItem value="8gb">8GB</SelectItem>
                      <SelectItem value="16gb">16GB</SelectItem>
                      <SelectItem value="32gb">32GB</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Storage</Label>
                  <Select value={config.storage} onValueChange={(v) => setConfig({ ...config, storage: v })}>
                    <SelectTrigger className="bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-background z-50">
                      <SelectItem value="256_ssd">256GB SSD</SelectItem>
                      <SelectItem value="512_ssd">512GB SSD</SelectItem>
                      <SelectItem value="1tb_ssd">1TB SSD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button variant="cta" className="w-full" onClick={handleCalculatePrice}>
                Calculate Price <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Card>
          )}

          {/* Price Display */}
          {step === "price" && priceBreakdown && (
            <Card className="p-8 max-w-md mx-auto">
              <h2 className="text-xl font-semibold mb-4 text-center">Estimated Price</h2>
              
              <div className="my-8 text-center">
                <div className="inline-block rounded-2xl bg-primary/10 px-8 py-6">
                  <p className="text-5xl font-bold text-primary">₹{estimatedPrice.toLocaleString()}</p>
                </div>
              </div>

              <div className="space-y-2 text-sm mb-6">
                <div className="flex justify-between">
                  <span>Base Price:</span>
                  <span className="font-medium">₹{priceBreakdown.base.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Age Adjustment:</span>
                  <span className={priceBreakdown.ageAdjustment < 0 ? 'text-red-600' : 'text-green-600'}>
                    {priceBreakdown.ageAdjustment > 0 ? '+' : ''}₹{priceBreakdown.ageAdjustment.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Condition Adjustment:</span>
                  <span className={priceBreakdown.conditionAdjustment < 0 ? 'text-red-600' : 'text-green-600'}>
                    {priceBreakdown.conditionAdjustment > 0 ? '+' : ''}₹{priceBreakdown.conditionAdjustment.toLocaleString()}
                  </span>
                </div>
                {priceBreakdown.accessoryBonus !== 0 && (
                  <div className="flex justify-between">
                    <span>Accessories Bonus:</span>
                    <span className="text-green-600">+₹{priceBreakdown.accessoryBonus.toLocaleString()}</span>
                  </div>
                )}
                {priceBreakdown.configPremium !== 0 && (
                  <div className="flex justify-between">
                    <span>Config Premium:</span>
                    <span className="text-green-600">+₹{priceBreakdown.configPremium.toLocaleString()}</span>
                  </div>
                )}
              </div>

              <Button variant="cta" className="w-full" onClick={handleConfirmPrice}>
                Accept & Continue <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="ghost" className="w-full mt-2" onClick={() => setStep("details")}>
                Adjust Details
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
