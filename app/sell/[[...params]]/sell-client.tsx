"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { Laptop, Monitor, Search, Loader2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SimpleForm from "@/components/SimpleForm";
import { ModelBookingCard } from "@/components/ModelBookingCard";
import { SellMethodSelector } from "@/components/SellMethodSelector";
import { supabase } from "@/lib/supabase/client";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

type Category = "laptop" | "desktop";
type CatalogItem = { id: string; name: string; slug: string; logo_url?: string; image_url?: string; thumbnail_url?: string };

// Deterministic step derived from URL segments — the ONLY source of truth for navigation
type Step = "category" | "method" | "brand" | "series" | "model" | "booking";
function deriveStep(route: string[], catalog: boolean): Step {
  if (!route[0] || (route[0] !== "laptop" && route[0] !== "desktop")) return "category";
  if (!route[1] && !catalog) return "method";
  if (!route[1]) return "brand";
  if (!route[2]) return "series";
  if (!route[3]) return "model";
  return "booking";
}

export const SellClient = () => {
  const params = useParams() as { params?: string[] };
  const route = useMemo(() => Array.isArray(params.params) ? params.params : [], [params.params]);
  const router = useRouter();

  // catalog flag: whether user chose "Select device" from the method selector
  // (only relevant when there's no brand slug in the URL yet)
  const [catalog, setCatalog] = useState(Boolean(route[1]));
  const [formOpen, setFormOpen] = useState(false);
  const [search, setSearch] = useState("");

  // Data arrays — fetched based on URL slugs
  const [brands, setBrands] = useState<CatalogItem[]>([]);
  const [series, setSeries] = useState<CatalogItem[]>([]);
  const [models, setModels] = useState<CatalogItem[]>([]);

  // Resolved objects — looked up from the fetched arrays
  const [brandObj, setBrandObj] = useState<CatalogItem | null>(null);
  const [seriesObj, setSeriesObj] = useState<CatalogItem | null>(null);
  const [modelObj, setModelObj] = useState<CatalogItem | null>(null);

  // Loading states — per data fetch
  const [loadingBrands, setLoadingBrands] = useState(false);
  const [loadingSeries, setLoadingSeries] = useState(false);
  const [loadingModels, setLoadingModels] = useState(false);

  // Derive current step from URL — deterministic, no flicker
  const categorySlug = (route[0] === "laptop" || route[0] === "desktop") ? route[0] as Category : null;
  const brandSlug = route[1] || null;
  const seriesSlug = route[2] || null;
  const modelSlug = route[3] || null;
  const step = deriveStep(route, catalog);

  // ── Fetch brands when category is known ──
  useEffect(() => {
    if (!categorySlug) { setBrands([]); setBrandObj(null); return; }

    let cancelled = false;
    setLoadingBrands(true);
    (async () => {
      const { data: categoryRow } = await supabase
        .from("categories").select("id").eq("slug", categorySlug).maybeSingle();
      if (cancelled) return;
      if (!categoryRow) { setLoadingBrands(false); return; }
      const { data } = await supabase
        .from("brands").select("*").eq("category_id", categoryRow.id).order("name");
      if (cancelled) return;
      const items = (data || []) as CatalogItem[];
      setBrands(items);
      if (brandSlug) setBrandObj(items.find(i => i.slug === brandSlug) || null);
      setLoadingBrands(false);
    })();

    return () => { cancelled = true; };
  }, [categorySlug, brandSlug]);

  // ── Fetch series when brand is resolved ──
  useEffect(() => {
    if (!brandObj) { setSeries([]); setSeriesObj(null); return; }

    let cancelled = false;
    setLoadingSeries(true);
    (async () => {
      const { data } = await supabase
        .from("series").select("*").eq("brand_id", brandObj.id).order("name");
      if (cancelled) return;
      const items = (data || []) as CatalogItem[];
      setSeries(items);
      if (seriesSlug) setSeriesObj(items.find(i => i.slug === seriesSlug) || null);
      setLoadingSeries(false);
    })();

    return () => { cancelled = true; };
  }, [brandObj?.id, seriesSlug]);

  // ── Fetch models when series is resolved ──
  useEffect(() => {
    if (!seriesObj) { setModels([]); setModelObj(null); return; }

    let cancelled = false;
    setLoadingModels(true);
    (async () => {
      const { data } = await supabase
        .from("models").select("*").eq("series_id", seriesObj.id).eq("active", true).order("name");
      if (cancelled) return;
      const items = (data || []) as CatalogItem[];
      setModels(items);
      if (modelSlug) setModelObj(items.find(i => i.slug === modelSlug) || null);
      setLoadingModels(false);
    })();

    return () => { cancelled = true; };
  }, [seriesObj?.id, modelSlug]);

  // ── Sync resolved objects when URL changes (browser back/forward) ──
  // When URL shortens, clear objects for removed segments
  useEffect(() => {
    if (!brandSlug) { setBrandObj(null); setSeriesObj(null); setModelObj(null); }
    else if (!seriesSlug) { setSeriesObj(null); setModelObj(null); }
    else if (!modelSlug) { setModelObj(null); }
  }, [brandSlug, seriesSlug, modelSlug]);

  // When URL gains a slug and data is already loaded, resolve the object immediately
  useEffect(() => {
    if (brandSlug && brands.length > 0) {
      setBrandObj(brands.find(i => i.slug === brandSlug) || null);
    }
  }, [brandSlug, brands]);

  useEffect(() => {
    if (seriesSlug && series.length > 0) {
      setSeriesObj(series.find(i => i.slug === seriesSlug) || null);
    }
  }, [seriesSlug, series]);

  useEffect(() => {
    if (modelSlug && models.length > 0) {
      setModelObj(models.find(i => i.slug === modelSlug) || null);
    }
  }, [modelSlug, models]);

  // ── Navigation handlers — only change the URL (source of truth) ──
  const pickCategory = (value: Category) => {
    setCatalog(false);
    setSearch("");
    router.push(`/sell/${value}`);
  };
  const pickBrand = (value: CatalogItem) => {
    setBrandObj(value); // set immediately so heading doesn't wait for re-fetch
    setSearch("");
    setCatalog(true);
    router.push(`/sell/${categorySlug}/${value.slug}`);
  };
  const pickSeries = (value: CatalogItem) => {
    setSeriesObj(value); // set immediately
    setSearch("");
    router.push(`/sell/${categorySlug}/${brandSlug}/${value.slug}`);
  };
  const pickModel = (value: CatalogItem) => {
    setModelObj(value); // set immediately
    router.push(`/sell/${categorySlug}/${brandSlug}/${seriesSlug}/${value.slug}`);
  };
  const onEvaluate = () => { setCatalog(true); };
  const onForm = () => { setFormOpen(true); };

  // ── Rendering helpers ──
  const loadingSpinner = (
    <div className="col-span-full flex items-center justify-center py-10">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
    </div>
  );

  const catalogCards = (items: CatalogItem[], choose: (item: CatalogItem) => void, imageField: "logo_url" | "image_url" | "thumbnail_url", isLoading: boolean) => {
    const isBrand = imageField === "logo_url";
    const filtered = items.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()));
    return (
      <div className={isBrand ? "grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6" : "grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"}>
        {isLoading ? loadingSpinner : filtered.length === 0 ? (
          <div className="col-span-full py-10 text-center text-sm text-muted-foreground">
            {items.length === 0 ? "No options available." : "No results found."}
          </div>
        ) : filtered.map((item) => (
          <Card
            key={item.id}
            onClick={() => choose(item)}
            className={isBrand
              ? "flex h-[200px] cursor-pointer flex-col items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-6 shadow-[0_3px_12px_rgba(15,23,42,0.13)] transition hover:-translate-y-0.5 hover:border-primary hover:shadow-lg"
              : "flex min-h-[124px] cursor-pointer flex-col justify-center p-3 transition hover:border-primary hover:shadow-md"
            }
          >
            {item[imageField] && (
              <div className={isBrand ? "mb-5 flex h-[72px] w-full items-center justify-center" : "mb-2 flex h-14 items-center justify-center"}>
                <img src={item[imageField]} alt={`${item.name} logo`} className={isBrand ? "max-h-[62px] max-w-[130px] object-contain" : "max-h-full max-w-[82%] object-contain"} />
              </div>
            )}
            <p className={isBrand ? "w-full truncate text-center text-[15px] font-medium text-black" : "truncate text-center text-sm font-semibold leading-tight sm:text-base"} title={item.name}>
              {item.name}
            </p>
          </Card>
        ))}
      </div>
    );
  };

  // ── Main render — step is derived from URL, never from nullable state combos ──
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-muted/20 py-10">
        <div className="container max-w-7xl px-4">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold">Sell your device</h1>
            <p className="mt-2 text-muted-foreground">Quick, simple and convenient.</p>
          </div>

          {step === "category" && (
            <div className="mx-auto grid max-w-xl gap-4 sm:grid-cols-2">
              <Card className="cursor-pointer p-8 text-center" onClick={() => pickCategory("laptop")}>
                <Laptop className="mx-auto mb-3 text-primary" /><b>Sell laptop</b>
              </Card>
              <Card className="cursor-pointer p-8 text-center" onClick={() => pickCategory("desktop")}>
                <Monitor className="mx-auto mb-3 text-primary" /><b>Sell desktop</b>
              </Card>
            </div>
          )}

          {step === "method" && categorySlug && (
            <SellMethodSelector category={categorySlug} onEvaluate={onEvaluate} onForm={onForm} />
          )}

          {step === "brand" && (
            <section>
              <h2 className="mb-5 text-xl font-bold">Choose brand</h2>
              {catalogCards(brands, pickBrand, "logo_url", loadingBrands)}
            </section>
          )}

          {step === "series" && (
            <section>
              <h2 className="mb-4 text-xl font-bold">
                Choose {brandObj?.name || brandSlug} series
              </h2>
              {catalogCards(series, pickSeries, "image_url", loadingSeries)}
            </section>
          )}

          {step === "model" && (
            <section>
              <h2 className="mb-4 text-xl font-bold">Choose model</h2>
              <div className="relative mb-5">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search model" />
              </div>
              {catalogCards(models, pickModel, "thumbnail_url", loadingModels)}
            </section>
          )}

          {step === "booking" && modelObj && brandObj && categorySlug && (
            <ModelBookingCard category={categorySlug} brand={brandObj.name} model={modelObj.name} modelId={modelObj.id} />
          )}
          {/* If booking step but objects not yet resolved from URL, show spinner */}
          {step === "booking" && (!modelObj || !brandObj) && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          )}

          <Dialog open={formOpen} onOpenChange={setFormOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Get a quick callback</DialogTitle>
                <DialogDescription>Fill in your details and we&apos;ll contact you.</DialogDescription>
              </DialogHeader>
              <SimpleForm defaultSellingType={categorySlug || undefined} onSuccess={() => setFormOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </main>
      <Footer />
    </div>
  );
};
