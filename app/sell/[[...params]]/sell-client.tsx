"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Laptop, Monitor, Search } from "lucide-react";
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

export const SellClient = () => {
  const params = useParams() as { params?: string[] };
  const route = Array.isArray(params.params) ? params.params : [];
  const router = useRouter();
  const [category, setCategory] = useState<Category | null>(route[0] === "desktop" ? "desktop" : route[0] === "laptop" ? "laptop" : null);
  const [catalog, setCatalog] = useState(Boolean(route[1]));
  const [formOpen, setFormOpen] = useState(false);
  const [brands, setBrands] = useState<CatalogItem[]>([]);
  const [series, setSeries] = useState<CatalogItem[]>([]);
  const [models, setModels] = useState<CatalogItem[]>([]);
  const [brand, setBrand] = useState<CatalogItem | null>(null);
  const [selectedSeries, setSelectedSeries] = useState<CatalogItem | null>(null);
  const [model, setModel] = useState<CatalogItem | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => { if (!category) return; (async () => { const { data: categoryRow } = await supabase.from("categories").select("id").eq("slug", category).maybeSingle(); if (!categoryRow) return; const { data } = await supabase.from("brands").select("*").eq("category_id", categoryRow.id).order("name"); const items = (data || []) as CatalogItem[]; setBrands(items); if (route[1]) setBrand(items.find((item) => item.slug === route[1]) || null); })(); }, [category]);
  useEffect(() => { if (!brand) return; (async () => { const { data } = await supabase.from("series").select("*").eq("brand_id", brand.id).order("name"); const items = (data || []) as CatalogItem[]; setSeries(items); if (route[2]) setSelectedSeries(items.find((item) => item.slug === route[2]) || null); })(); }, [brand]);
  useEffect(() => { if (!selectedSeries) return; (async () => { const { data } = await supabase.from("models").select("*").eq("series_id", selectedSeries.id).eq("active", true).order("name"); const items = (data || []) as CatalogItem[]; setModels(items); if (route[3]) setModel(items.find((item) => item.slug === route[3]) || null); })(); }, [selectedSeries]);

  const pickCategory = (value: Category) => { setCategory(value); setCatalog(false); setBrand(null); setSelectedSeries(null); setModel(null); setSeries([]); setModels([]); setSearch(""); router.push(`/sell/${value}`); };
  const pickBrand = (value: CatalogItem) => { setBrand(value); setSelectedSeries(null); setModel(null); setSeries([]); setModels([]); setSearch(""); setCatalog(true); router.push(`/sell/${category}/${value.slug}`); };
  const pickSeries = (value: CatalogItem) => { setSelectedSeries(value); setModel(null); setModels([]); setSearch(""); router.push(`/sell/${category}/${brand?.slug}/${value.slug}`); };
  const pickModel = (value: CatalogItem) => { setModel(value); router.push(`/sell/${category}/${brand?.slug}/${selectedSeries?.slug}/${value.slug}`); };

  const catalogCards = (items: CatalogItem[], choose: (item: CatalogItem) => void, imageField: "logo_url" | "image_url" | "thumbnail_url") => {
    const isBrand = imageField === "logo_url";
    return <div className={isBrand ? "grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6" : "grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"}>{items.length === 0 ? <div className="col-span-full py-10 text-center text-sm text-muted-foreground">Loading available options…</div> : items.filter((item) => item.name.toLowerCase().includes(search.toLowerCase())).map((item) => <Card key={item.id} onClick={() => choose(item)} className={isBrand ? "flex h-[200px] cursor-pointer flex-col items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-6 shadow-[0_3px_12px_rgba(15,23,42,0.13)] transition hover:-translate-y-0.5 hover:border-primary hover:shadow-lg" : "flex min-h-[124px] cursor-pointer flex-col justify-center p-3 transition hover:border-primary hover:shadow-md"}>{item[imageField] && <div className={isBrand ? "mb-5 flex h-[72px] w-full items-center justify-center" : "mb-2 flex h-14 items-center justify-center"}><img src={item[imageField]} alt={`${item.name} logo`} className={isBrand ? "max-h-[62px] max-w-[130px] object-contain" : "max-h-full max-w-[82%] object-contain"} /></div>}<p className={isBrand ? "w-full truncate text-center text-[15px] font-medium text-black" : "truncate text-center text-sm font-semibold leading-tight sm:text-base"} title={item.name}>{item.name}</p></Card>)}</div>;
  };

  return <div className="flex min-h-screen flex-col"><Header /><main className="flex-1 bg-muted/20 py-10"><div className="container max-w-7xl px-4"><div className="mb-8 text-center"><h1 className="text-3xl font-bold">Sell your device</h1><p className="mt-2 text-muted-foreground">Quick, simple and convenient.</p></div>{!category && <div className="mx-auto grid max-w-xl gap-4 sm:grid-cols-2"><Card className="cursor-pointer p-8 text-center" onClick={() => pickCategory("laptop")}><Laptop className="mx-auto mb-3 text-primary" /><b>Sell laptop</b></Card><Card className="cursor-pointer p-8 text-center" onClick={() => pickCategory("desktop")}><Monitor className="mx-auto mb-3 text-primary" /><b>Sell desktop</b></Card></div>}{category && !brand && !catalog && <SellMethodSelector category={category} onEvaluate={() => setCatalog(true)} onForm={() => setFormOpen(true)} />}{category && !brand && catalog && <section><h2 className="mb-5 text-xl font-bold">Choose brand</h2>{catalogCards(brands, pickBrand, "logo_url")}</section>}{brand && !selectedSeries && <section><h2 className="mb-4 text-xl font-bold">Choose {brand.name} series</h2>{catalogCards(series, pickSeries, "image_url")}</section>}{selectedSeries && !model && <section><h2 className="mb-4 text-xl font-bold">Choose model</h2><div className="relative mb-5"><Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><Input className="pl-9" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search model" /></div>{catalogCards(models, pickModel, "thumbnail_url")}</section>}{model && brand && category && <ModelBookingCard category={category} brand={brand.name} model={model.name} modelId={model.id} />}<Dialog open={formOpen} onOpenChange={setFormOpen}><DialogContent><DialogHeader><DialogTitle>Get a quick callback</DialogTitle><DialogDescription>Fill in your details and we’ll contact you.</DialogDescription></DialogHeader><SimpleForm defaultSellingType={category} onSuccess={() => setFormOpen(false)} /></DialogContent></Dialog></div></main><Footer /></div>;
};
