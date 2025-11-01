import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { calculateDynamicPrice, getConditionLabel } from "@/utils/dynamicPricingEngine";
import { sellRequestSchema } from "@/lib/validationSchemas";
import { generateInvoice } from "@/utils/invoiceGenerator";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Laptop, Monitor, Smartphone, ChevronRight, Loader2, TrendingUp, Zap, Search } from "lucide-react";
import { toast } from "sonner";
import { CountdownTimer } from "@/components/CountdownTimer";
import { MobileSellForm } from "@/components/MobileSellForm";
import whatsappIcon from "@/assets/whatsapp.svg";

type Step = "category" | "selection_method" | "brand" | "series" | "model" | "switch_on" | "config" | "additional" | "functionality" | "screen_condition" | "age" | "physical_condition" | "accessories" | "price" | "confirm";

const Sell = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [step, setStep] = useState<Step>("category");
  const [loading, setLoading] = useState(false);
  const [transitionLoading, setTransitionLoading] = useState(false);
  const [loadingFromSlug, setLoadingFromSlug] = useState(false);
  
  // Form data
  const [category, setCategory] = useState<"laptop" | "desktop" | "mobile" | "">("" );
  const [brands, setBrands] = useState<any[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<any>(null);
  const [seriesList, setSeriesList] = useState<any[]>([]);
  const [selectedSeries, setSelectedSeries] = useState<any>(null);
  const [models, setModels] = useState<any[]>([]);
  const [selectedModel, setSelectedModel] = useState<any>(null);
  
  // Device details
  const [switchesOn, setSwitchesOn] = useState<boolean | null>(null);
  const [ageMonths, setAgeMonths] = useState<number>(6);
  const [screenCondition, setScreenCondition] = useState("good");
  const [physicalCondition, setPhysicalCondition] = useState<"like_new" | "excellent" | "good" | "average" | "faulty">("good");
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
  const [customerName, setCustomerName] = useState("");
  const [customerMobile, setCustomerMobile] = useState("");
  
  // Search states
  const [brandSearch, setBrandSearch] = useState("");
  const [seriesSearch, setSeriesSearch] = useState("");
  const [modelSearch, setModelSearch] = useState("");

  // Load data from URL params on mount
  useEffect(() => {
    // Check if we're restoring from session storage (after login redirect)
    const savedState = sessionStorage.getItem('sellFormState');
    
    if (!savedState) {
      // Only load from URL if we're not restoring saved state
      loadFromUrlParams();
    }
  }, [params.category, params.brand, params.series, params.model]);

  // Restore form state after login
  useEffect(() => {
    if (user) {
      const savedState = sessionStorage.getItem('sellFormState');
      const savedRedirect = sessionStorage.getItem('sellFormRedirect');
      
      if (savedState && savedRedirect) {
        try {
          const formState = JSON.parse(savedState);
          
          // Restore all form state
          setCategory(formState.category);
          setSelectedBrand(formState.selectedBrand);
          setSelectedSeries(formState.selectedSeries);
          setSelectedModel(formState.selectedModel);
          setSwitchesOn(formState.switchesOn);
          setAgeMonths(formState.ageMonths);
          setScreenCondition(formState.screenCondition);
          setPhysicalCondition(formState.physicalCondition);
          setFunctionalityIssues(formState.functionalityIssues);
          setAccessories(formState.accessories);
          setConfig(formState.config);
          setEstimatedPrice(formState.estimatedPrice);
          setDisplayedPrice(formState.displayedPrice);
          setMarketingBonus(formState.marketingBonus);
          
          // Clear sessionStorage first
          sessionStorage.removeItem('sellFormState');
          sessionStorage.removeItem('sellFormRedirect');
          
          // Navigate to confirm step after a brief delay to ensure state is set
          setTimeout(() => {
            setStep("confirm");
            window.scrollTo(0, 0);
            toast.success('Welcome back! Please complete your booking.');
          }, 100);
        } catch (error) {
          console.error('Error restoring form state:', error);
          sessionStorage.removeItem('sellFormState');
          sessionStorage.removeItem('sellFormRedirect');
        }
      }
    }
  }, [user]);

  const loadFromUrlParams = async () => {
    setLoadingFromSlug(true);
    
    try {
      // Load category
      if (params.category) {
        const cat = params.category as "laptop" | "desktop" | "mobile";
        setCategory(cat);
        
        // Get category ID first
        const { data: categoryData } = await supabase
          .from('categories')
          .select('id')
          .eq('slug', cat)
          .single();
        
        // Load brand if in URL
        if (params.brand && categoryData) {
          const { data: brandData, error: brandError } = await supabase
            .from('brands')
            .select('*')
            .eq('slug', params.brand)
            .eq('category_id', categoryData.id)
            .maybeSingle();
          
          if (brandData && !brandError) {
            setSelectedBrand(brandData);
            
            // Load series if in URL
            if (params.series) {
              const { data: seriesData, error: seriesError } = await supabase
                .from('series')
                .select('*')
                .eq('slug', params.series)
                .eq('brand_id', brandData.id)
                .maybeSingle();
              
              if (seriesData && !seriesError) {
                setSelectedSeries(seriesData);
                
                // Load model if in URL
                if (params.model) {
                  const { data: modelData, error: modelError } = await supabase
                    .from('models')
                    .select('*')
                    .eq('slug', params.model)
                    .eq('series_id', seriesData.id)
                    .maybeSingle();
                  
                  if (modelData && !modelError) {
                    setSelectedModel(modelData);
                    setStep("model"); // Show "Get Upto" price page first
                  } else {
                    setStep("model");
                  }
                } else {
                  setStep("model");
                }
              } else {
                setStep("series");
              }
            } else {
              setStep("series");
            }
          } else {
            setStep("selection_method");
          }
        } else {
          setStep("selection_method");
        }
      } else {
        setStep("category");
      }
    } catch (error) {
      console.error('Error loading from URL:', error);
      setStep("category");
    } finally {
      setLoadingFromSlug(false);
    }
  };


  // Pre-fill customer name from user email
  useEffect(() => {
    if (user && !customerName) {
      const name = user.user_metadata?.full_name || user.email?.split('@')[0] || '';
      setCustomerName(name);
    }
  }, [user]);

  // Fetch brands when category is selected
  useEffect(() => {
    if (category && !params.brand) {
      fetchBrands();
    }
  }, [category]);

  // Fetch series when brand is selected
  useEffect(() => {
    if (selectedBrand && !params.series) {
      fetchSeries();
    }
  }, [selectedBrand]);

  // Fetch models when series is selected
  useEffect(() => {
    if (selectedSeries && !params.model) {
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
    try {
      const { data: categoryData } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', category)
        .single();

      if (categoryData) {
        const { data, error } = await supabase
          .from('brands')
          .select('id, name, slug, logo_url, category_id')
          .eq('category_id', categoryData.id)
          .order('name');

        if (error) {
          toast.error('Failed to load brands');
          console.error(error);
        } else {
          setBrands(data || []);
        }
      }
    } catch (error) {
      console.error('Error fetching brands:', error);
    }
  };

  const fetchSeries = async () => {
    if (!selectedBrand) return;
    
    try {
      const { data, error } = await supabase
        .from('series')
        .select('id, name, slug, brand_id, image_url')
        .eq('brand_id', selectedBrand.id)
        .order('name');

      if (error) {
        toast.error('Failed to load series');
        console.error(error);
      } else {
        setSeriesList(data || []);
      }
    } catch (error) {
      console.error('Error fetching series:', error);
    }
  };

  const fetchModels = async () => {
    if (!selectedSeries) return;
    
    try {
      const { data, error } = await supabase
        .from('models')
        .select('id, name, slug, series_id, base_price, thumbnail_url, description, active')
        .eq('series_id', selectedSeries.id)
        .eq('active', true);

      if (error) {
        toast.error('Failed to load models');
        console.error(error);
      } else {
        // Sort by year (newest first), extracting year from model name
        const sortedModels = (data || []).sort((a, b) => {
          const yearA = parseInt(a.name.match(/\b(19|20)\d{2}\b/)?.[0] || '0');
          const yearB = parseInt(b.name.match(/\b(19|20)\d{2}\b/)?.[0] || '0');
          return yearB - yearA; // Descending order (newest first)
        });
        setModels(sortedModels);
      }
    } catch (error) {
      console.error('Error fetching models:', error);
    }
  };

  const calculateRealTimePrice = async () => {
    if (!selectedModel || !selectedBrand) return;

    const result = calculateDynamicPrice(
      parseFloat(selectedModel.base_price),
      selectedBrand.name,
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

  const handleCategorySelect = (selected: "laptop" | "desktop" | "mobile") => {
    setCategory(selected);
    setStep("selection_method");
    navigate(`/sell/${selected}`);
    window.scrollTo(0, 0);
  };

  const handleBrandSelect = (brand: any) => {
    setTransitionLoading(true);
    setSelectedBrand(brand);
    setSelectedSeries(null);
    setSelectedModel(null);
    setTimeout(() => {
      navigate(`/sell/${category}/${brand.slug}`);
      setTransitionLoading(false);
      window.scrollTo(0, 0);
    }, 300);
  };

  const handleSeriesSelect = (series: any) => {
    setTransitionLoading(true);
    setSelectedSeries(series);
    setSelectedModel(null);
    setTimeout(() => {
      navigate(`/sell/${category}/${selectedBrand.slug}/${series.slug}`);
      setTransitionLoading(false);
      window.scrollTo(0, 0);
    }, 300);
  };

  const handleModelSelect = (model: any) => {
    setTransitionLoading(true);
    setSelectedModel(model);
    setTimeout(() => {
      navigate(`/sell/${category}/${selectedBrand.slug}/${selectedSeries.slug}/${model.slug}`);
      setTransitionLoading(false);
      window.scrollTo(0, 0);
    }, 300);
  };

  const handleCalculatePrice = async () => {
    if (!selectedModel || !selectedBrand) {
      toast.error('Missing model or brand data');
      return;
    }

    setTransitionLoading(true);
    await calculateRealTimePrice();
    setOfferExpired(false);
    setTimeout(() => {
      setStep("price");
      setTransitionLoading(false);
      window.scrollTo(0, 0);
    }, 300);
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
      sessionStorage.setItem('sellFormRedirect', window.location.pathname);
      navigate(`/auth?redirect=${encodeURIComponent(window.location.pathname)}`);
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
    if (!customerName.trim()) {
      toast.error('Please enter your name');
      return;
    }

    if (!customerMobile.trim() || !/^[6-9]\d{9}$/.test(customerMobile)) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }

    const validation = sellRequestSchema.safeParse({ address, pincode });
    if (!validation.success) {
      const errors = validation.error.errors.map(e => e.message).join(', ');
      toast.error(errors);
      return;
    }

    setLoading(true);

    try {
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
            customer_name: customerName,
            customer_mobile: customerMobile,
          } as any,
          estimated_price: estimatedPrice,
          address,
          pincode,
        })
        .select()
        .single();

      setLoading(false);

      if (error) {
        console.error('Supabase error:', error);
        toast.error(error.message || 'Failed to create request. Please try again.');
        return;
      }

      if (!data) {
        toast.error('Failed to create request. Please try again.');
        return;
      }

      // Clear session storage after successful submission
      sessionStorage.removeItem('sellFormState');
      
      toast.success('Booking successful!');
      navigate(`/track/${data.id}`);
    } catch (err) {
      console.error('Unexpected error:', err);
      toast.error('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  // Dynamic SEO meta tags
  const getMetaTitle = () => {
    if (selectedModel && selectedBrand && selectedSeries) {
      return `Sell ${selectedBrand.name} ${selectedSeries.name} ${selectedModel.name} | Laptap.in`;
    }
    if (selectedSeries && selectedBrand) {
      return `Sell ${selectedBrand.name} ${selectedSeries.name} | Laptap.in`;
    }
    if (selectedBrand) {
      return `Sell ${selectedBrand.name} ${category === 'laptop' ? 'Laptop' : category === 'mobile' ? 'Mobile' : 'Desktop'} | Laptap.in`;
    }
    if (category) {
      return `Sell ${category === 'laptop' ? 'Laptop' : category === 'mobile' ? 'Mobile' : 'Desktop'} | Get Instant Quote | Laptap.in`;
    }
    return 'Sell Your Laptop, Mobile or Desktop | Laptap.in';
  };

  const getMetaDescription = () => {
    if (selectedModel && selectedBrand && selectedSeries) {
      return `Get the best price for your used ${selectedBrand.name} ${selectedSeries.name} ${selectedModel.name} on Laptap.in. Free pickup and instant payment. Sell now!`;
    }
    if (selectedSeries && selectedBrand) {
      return `Sell your ${selectedBrand.name} ${selectedSeries.name} for the best price on Laptap.in. Free doorstep pickup and instant secure payment.`;
    }
    if (selectedBrand) {
      return `Sell your ${selectedBrand.name} ${category} for the best price. Get instant quotes, free pickup, and secure payment on Laptap.in.`;
    }
    if (category) {
      return `Sell your ${category} for the best price. Get instant quotes, free doorstep pickup, and instant secure payment on Laptap.in.`;
    }
    return 'Sell your laptop or desktop for the best price. Get instant quotes, free pickup, and instant payment on Laptap.in.';
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>{getMetaTitle()}</title>
        <meta name="description" content={getMetaDescription()} />
        <meta property="og:title" content={getMetaTitle()} />
        <meta property="og:description" content={getMetaDescription()} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://laptap.in${window.location.pathname}`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={getMetaTitle()} />
        <meta name="twitter:description" content={getMetaDescription()} />
      </Helmet>
      
      <Header />
      
      {(loading || transitionLoading || loadingFromSlug) && <Loader />}
      
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
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
                <Card
                  className="cursor-pointer p-8 hover:border-primary hover:shadow-lg transition-all"
                  onClick={() => handleCategorySelect("laptop")}
                >
                  <Laptop className="mx-auto mb-4 h-16 w-16 text-primary" />
                  <h3 className="text-center text-lg font-semibold">Laptop</h3>
                </Card>

                <Card
                  className="cursor-pointer p-8 hover:border-primary hover:shadow-lg transition-all"
                  onClick={() => handleCategorySelect("mobile")}
                >
                  <Smartphone className="mx-auto mb-4 h-16 w-16 text-primary" />
                  <h3 className="text-center text-lg font-semibold">Mobile</h3>
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

          {/* Selection Method */}
          {step === "selection_method" && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-xl md:text-2xl font-bold mb-2">Choose Your Selling Method</h2>
                <p className="text-sm text-muted-foreground">Pick the option that works best for you</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
                {/* WhatsApp Card */}
                <Card className="group relative overflow-hidden cursor-pointer border-2 hover:border-[#25D366] hover:shadow-lg transition-all duration-300 hover:scale-105 flex flex-col">
                  <div className="absolute top-2 right-2 bg-[#25D366] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    RECOMMENDED
                  </div>
                  <div 
                    className="p-4 md:p-6 flex flex-col flex-1"
                    onClick={() => {
                      const whatsappNumber = "919886579923";
                      const message = `Hi! I want to sell my ${category}.`;
                      const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
                      window.open(url, '_blank');
                    }}
                  >
                    <div className="flex justify-center mb-3 md:mb-4">
                      <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center rounded-xl bg-[#25D366]/10 group-hover:bg-[#25D366]/20 transition-colors">
                        <img src={whatsappIcon} alt="WhatsApp" className="w-10 h-10 md:w-12 md:h-12" />
                      </div>
                    </div>
                    
                    <div className="text-center space-y-1 mb-3 md:mb-4">
                      <h3 className="text-base md:text-lg font-bold">Sell on WhatsApp</h3>
                      <p className="text-xs text-[#25D366] font-medium">Instant Response</p>
                    </div>
                    
                    <div className="mt-auto">
                      <Button className="w-full bg-[#25D366] hover:bg-[#20BA5A] text-white h-9 md:h-10 text-sm font-semibold">
                        Continue
                      </Button>
                    </div>
                  </div>
                </Card>

                {/* Evaluate Now Card */}
                <Card className="group cursor-pointer border-2 hover:border-primary hover:shadow-lg transition-all duration-300 hover:scale-105 flex flex-col">
                  <div 
                    className="p-4 md:p-6 flex flex-col flex-1"
                    onClick={async () => {
                      setLoadingFromSlug(true);
                      await fetchBrands();
                      setLoadingFromSlug(false);
                      setStep("brand");
                    }}
                  >
                    <div className="flex justify-center mb-3 md:mb-4">
                      <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <TrendingUp className="w-10 h-10 md:w-12 md:h-12 text-primary" />
                      </div>
                    </div>
                    
                    <div className="text-center space-y-1 mb-3 md:mb-4">
                      <h3 className="text-base md:text-lg font-bold">Evaluate Now</h3>
                      <p className="text-xs text-muted-foreground font-medium">Detailed Quote</p>
                    </div>
                    
                    <div className="mt-auto">
                      <Button variant="cta" className="w-full h-9 md:h-10 text-sm font-semibold">
                        Start
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* Brand Selection */}
          {step === "brand" && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-center">Select Brand</h2>
              
              {/* Search Bar */}
              <div className="max-w-md mx-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search brands..."
                    value={brandSearch}
                    onChange={(e) => setBrandSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {brands
                  .filter(brand => brand.name.toLowerCase().includes(brandSearch.toLowerCase()))
                  .map((brand) => (
                  <Card
                    key={brand.id}
                    className="cursor-pointer p-4 hover:border-primary hover:shadow-lg transition-all"
                    onClick={() => handleBrandSelect(brand)}
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
              
              {/* Search Bar */}
              <div className="max-w-md mx-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search series..."
                    value={seriesSearch}
                    onChange={(e) => setSeriesSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {seriesList
                  .filter(series => series.name.toLowerCase().includes(seriesSearch.toLowerCase()))
                  .map((series) => (
                  <Card
                    key={series.id}
                    className="cursor-pointer p-4 hover:border-primary hover:shadow-lg transition-all"
                    onClick={() => handleSeriesSelect(series)}
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
              
              {/* Search Bar */}
              <div className="max-w-md mx-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search models..."
                    value={modelSearch}
                    onChange={(e) => setModelSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {models
                  .filter(model => model.name.toLowerCase().includes(modelSearch.toLowerCase()))
                  .map((model) => (
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
                <p className="text-muted-foreground mb-2">Get Upto</p>
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
                onClick={() => { 
                  if (category === "mobile") {
                    setStep("config"); // For mobile, skip switch_on and go to mobile form
                  } else {
                    setStep("switch_on"); // For laptop/desktop, continue with standard flow
                  }
                  window.scrollTo(0, 0); 
                }}
              >
                Evaluate Now <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Card>
          )}

          {/* Mobile Sell Form - Comprehensive form for mobiles */}
          {step === "config" && category === "mobile" && selectedModel && selectedBrand && (
            <div className="max-w-4xl mx-auto">
              <MobileSellForm
                basePrice={parseFloat(selectedModel.base_price)}
                brandName={selectedBrand.name}
                modelName={selectedModel.name}
                onPriceCalculated={(finalPrice, displayPrice, breakdown) => {
                  setEstimatedPrice(finalPrice);
                  setDisplayedPrice(displayPrice);
                  setPriceBreakdown(breakdown);
                  setStep("price");
                  window.scrollTo(0, 0);
                }}
              />
            </div>
          )}

          {/* Switch On Check - Only for Laptop/Desktop */}
          {step === "switch_on" && category !== "mobile" && (
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

          {/* System Configuration - Only for Laptop/Desktop */}
          {step === "config" && category !== "mobile" && (
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
                     {/* Intel Processors */}
    <SelectItem value="i3">Intel Core i3</SelectItem>
    <SelectItem value="i5">Intel Core i5</SelectItem>
    <SelectItem value="i7">Intel Core i7</SelectItem>
    <SelectItem value="i9">Intel Core i9</SelectItem>

    {/* AMD Processors */}
    <SelectItem value="ryzen_3">AMD Ryzen 3</SelectItem>
    <SelectItem value="ryzen_5">AMD Ryzen 5</SelectItem>
    <SelectItem value="ryzen_7">AMD Ryzen 7</SelectItem>
    <SelectItem value="ryzen_9">AMD Ryzen 9</SelectItem>

    {/* Apple Silicon Processors */}
    <SelectItem value="m1">Apple M1</SelectItem>
    <SelectItem value="m1_pro">Apple M1 Pro</SelectItem>
    <SelectItem value="m1_max">Apple M1 Max</SelectItem>
    <SelectItem value="m1_ultra">Apple M1 Ultra</SelectItem>

    <SelectItem value="m2">Apple M2</SelectItem>
    <SelectItem value="m2_pro">Apple M2 Pro</SelectItem>
    <SelectItem value="m2_max">Apple M2 Max</SelectItem>
    <SelectItem value="m2_ultra">Apple M2 Ultra</SelectItem>

    <SelectItem value="m3">Apple M3</SelectItem>
    <SelectItem value="m3_pro">Apple M3 Pro</SelectItem>
    <SelectItem value="m3_max">Apple M3 Max</SelectItem>
    <SelectItem value="m3_ultra">Apple M3 Ultra</SelectItem>

    <SelectItem value="m4">Apple M4</SelectItem>
    <SelectItem value="m4_pro">Apple M4 Pro</SelectItem>
    <SelectItem value="m4_max">Apple M4 Max</SelectItem>
    <SelectItem value="m4_ultra">Apple M4 Ultra</SelectItem>
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

          {/* Additional Features - Only for Laptop/Desktop */}
          {step === "additional" && category !== "mobile" && (
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

          {/* Functionality Check - Only for Laptop/Desktop */}
          {step === "functionality" && category !== "mobile" && (
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

          {/* Screen Condition - Only for Laptop/Desktop */}
          {step === "screen_condition" && category !== "mobile" && (
            <Card className="p-4 md:p-8 max-w-2xl mx-auto space-y-4 md:space-y-6">
              <div className="text-center mb-4 md:mb-6">
                <h2 className="text-xl md:text-2xl font-semibold mb-2">Select the screen condition of your device?</h2>
                <p className="text-sm md:text-base text-muted-foreground">The better condition your device is in, we will pay you more</p>
              </div>
              <RadioGroup value={screenCondition} onValueChange={setScreenCondition}>
                <Card className={`p-4 md:p-6 cursor-pointer transition-all ${screenCondition === "like_new" ? 'border-primary' : ''}`}>
                  <div className="flex items-start space-x-3">
                    <RadioGroupItem value="like_new" id="screen_like_new" className="mt-1 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <Label htmlFor="screen_like_new" className="text-base md:text-lg cursor-pointer block font-semibold mb-1">Like New</Label>
                      <p className="text-xs md:text-sm text-muted-foreground">No scratches on screen</p>
                      <p className="text-xs md:text-sm text-muted-foreground">No Lines/Dents/Discoloration/Cracks</p>
                    </div>
                  </div>
                </Card>
                <Card className={`p-4 md:p-6 cursor-pointer transition-all ${screenCondition === "excellent" ? 'border-primary' : ''}`}>
                  <div className="flex items-start space-x-3">
                    <RadioGroupItem value="excellent" id="screen_excellent" className="mt-1 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <Label htmlFor="screen_excellent" className="text-base md:text-lg cursor-pointer block font-semibold mb-1">Excellent</Label>
                      <p className="text-xs md:text-sm text-muted-foreground">Very minimal scratches if any</p>
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
                <Card className={`p-4 md:p-6 cursor-pointer transition-all ${screenCondition === "faulty" ? 'border-primary' : ''}`}>
                  <div className="flex items-start space-x-3">
                    <RadioGroupItem value="faulty" id="screen_faulty" className="mt-1 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <Label htmlFor="screen_faulty" className="text-base md:text-lg cursor-pointer block font-semibold mb-1">Faulty</Label>
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

          {/* Device Age - Only for Laptop/Desktop */}
          {step === "age" && category !== "mobile" && (
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

          {/* Physical Condition - Only for Laptop/Desktop */}
          {step === "physical_condition" && category !== "mobile" && (
            <Card className="p-8 max-w-2xl mx-auto space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-semibold mb-2">Select the physical condition of your device?</h2>
                <p className="text-muted-foreground">The better condition your device is in, we will pay you more</p>
              </div>
              <RadioGroup value={physicalCondition} onValueChange={(value) => setPhysicalCondition(value as typeof physicalCondition)}>
                <Card className={`p-6 cursor-pointer transition-all ${physicalCondition === "like_new" ? 'border-primary' : ''}`}>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="like_new" id="phys_like_new" />
                    <div className="flex-1">
                      <Label htmlFor="phys_like_new" className="text-lg cursor-pointer block font-semibold mb-1">Like New</Label>
                      <p className="text-sm text-muted-foreground">No scratches on the device</p>
                      <p className="text-sm text-muted-foreground">No signs of usage on the device</p>
                      <p className="text-sm text-muted-foreground">No dents or cracks on the device</p>
                    </div>
                  </div>
                </Card>
                <Card className={`p-6 cursor-pointer transition-all ${physicalCondition === "excellent" ? 'border-primary' : ''}`}>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="excellent" id="phys_excellent" />
                    <div className="flex-1">
                      <Label htmlFor="phys_excellent" className="text-lg cursor-pointer block font-semibold mb-1">Excellent</Label>
                      <p className="text-sm text-muted-foreground">Very minimal signs of use</p>
                      <p className="text-sm text-muted-foreground">Very minor scratches if any</p>
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
                <Card className={`p-6 cursor-pointer transition-all ${physicalCondition === "faulty" ? 'border-primary' : ''}`}>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="faulty" id="phys_faulty" />
                    <div className="flex-1">
                      <Label htmlFor="phys_faulty" className="text-lg cursor-pointer block font-semibold mb-1">Faulty</Label>
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

          {/* Accessories - Only for Laptop/Desktop */}
          {step === "accessories" && category !== "mobile" && (
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
                        That's <span className="font-bold">₹{marketingBonus.toLocaleString()} more</span> than other buyers typically offer!
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
              <h2 className="text-xl font-semibold mb-6">Complete Your Booking</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="customer_name">Full Name *</Label>
                  <Input
                    id="customer_name"
                    placeholder="Enter your full name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="customer_mobile">Mobile Number *</Label>
                  <Input
                    id="customer_mobile"
                    placeholder="10-digit mobile number"
                    value={customerMobile}
                    onChange={(e) => setCustomerMobile(e.target.value)}
                    maxLength={10}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="address">Full Address *</Label>
                  <Input
                    id="address"
                    placeholder="Street, Area, Landmark"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="pincode">Pincode *</Label>
                  <Input
                    id="pincode"
                    placeholder="e.g., 560001"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    maxLength={6}
                    required
                  />
                </div>
                <div className="rounded-lg bg-muted/50 p-4 text-sm">
                  <p className="font-semibold mb-2">Order Summary</p>
                  <p>Device: {selectedModel?.name}</p>
                  <p>Estimated Price: ₹{estimatedPrice.toLocaleString()}</p>
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
