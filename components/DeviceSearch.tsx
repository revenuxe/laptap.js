"use client";

import { useState, useEffect, useMemo, useId } from 'react';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from '@/lib/supabase/client';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Search, Laptop } from 'lucide-react';

interface Model {
  id: string;
  name: string;
  slug: string;
  series: {
    id: string;
    name: string;
    slug: string;
    brand_id: string;
    brands: {
      name: string;
      slug: string;
    };
  };
}

const POPULAR_BRANDS = [
  {
    name: "Acer",
    slug: "acer",
    logo_url: "https://upload.wikimedia.org/wikipedia/commons/a/a1/Acer_Logo.svg",
  },
  {
    name: "Apple",
    slug: "apple",
    logo_url: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
  },
  {
    name: "Asus",
    slug: "asus",
    logo_url: "https://upload.wikimedia.org/wikipedia/commons/2/2e/ASUS_Logo.svg",
  },
  {
    name: "Dell",
    slug: "dell",
    logo_url: "https://upload.wikimedia.org/wikipedia/commons/1/18/Dell_logo_2016.svg",
  },
  {
    name: "HP",
    slug: "hp",
    logo_url: "https://upload.wikimedia.org/wikipedia/commons/a/ad/HP_logo_2012.svg",
  },
  {
    name: "Lenovo",
    slug: "lenovo",
    logo_url: "https://upload.wikimedia.org/wikipedia/commons/b/b8/Lenovo_logo_2015.svg",
  },
  {
    name: "Microsoft",
    slug: "microsoft",
    logo_url: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg",
  },
];

export function DeviceSearch({ referenceStyle = false }: { referenceStyle?: boolean }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [models, setModels] = useState<Model[]>([]);
  const resultsId = useId();
  const filteredModels = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return query ? models.filter(model => model.name.toLowerCase().includes(query) || model.series.name.toLowerCase().includes(query) || model.series.brands.name.toLowerCase().includes(query)).slice(0, 5) : [];
  }, [models, searchQuery]);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    loadModels();
  }, []);

  async function loadModels() {
    try {
      const { data } = await supabase
        .from('models')
        .select(`
          id,
          name,
          slug,
          series (
            id,
            name,
            slug,
            brand_id,
            brands (
              name,
              slug
            )
          )
        `)
        .eq('active', true);
      
      if (data) {
        const sortedModels = (data as Model[]).filter(model => model.series?.brands).sort((a, b) => {
          const yearA = parseInt(a.name.match(/\b(19|20)\d{2}\b/)?.[0] || '0');
          const yearB = parseInt(b.name.match(/\b(19|20)\d{2}\b/)?.[0] || '0');
          return yearB - yearA;
        });
        setModels(sortedModels);
      }
    } catch (error) {
      console.error('Error loading models:', error);
    }
  }

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setShowResults(Boolean(value.trim()));
  };

  const handleModelClick = (model: Model) => {
    router.push(`/sell/laptop/${model.series.brands.slug}/${model.series.slug}/${model.slug}`);
    setSearchQuery('');
    setShowResults(false);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          aria-label="Search for your device brand or model"
          aria-expanded={showResults}
          aria-controls={showResults ? resultsId : undefined}
          onKeyDown={event => { if (event.key === 'Escape') setShowResults(false); }}
          type="text"
          placeholder="Search for your device brand, model..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-6 text-lg rounded-xl border-2 focus:border-primary"
        />
      </div>

      {showResults && (
        <Card id={resultsId} className="absolute top-full mt-2 w-full z-50 max-h-96 overflow-auto shadow-lg">
          <div className="p-4">
            {filteredModels.length > 0 ? (
              <div className="space-y-2">
                <p className="text-sm font-semibold text-muted-foreground mb-3">Models</p>
                {filteredModels.map(model => (
                  <button
                    type="button"
                    key={model.id}
                    onClick={() => handleModelClick(model)}
                    className="flex w-full items-center gap-3 p-3 rounded-lg text-left hover:bg-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary cursor-pointer transition-colors"
                  >
                    <div className="w-10 h-10 flex items-center justify-center bg-primary/10 rounded">
                      <Laptop className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{model.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {model.series.brands.name} {model.series.name}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <p role="status" className="text-center text-muted-foreground py-6">No matching models yet. Choose a brand below or ask our team for help.</p>
            )}
          </div>
        </Card>
      )}

      <div className={referenceStyle ? "reference-brands" : "mt-5 flex flex-wrap items-center justify-center gap-2 sm:gap-3"}>
        <div className={referenceStyle ? "reference-brands-heading" : "w-full text-center text-sm text-muted-foreground"}>
          <span>Popular Brands</span>
          {referenceStyle && <Link href="/sell/laptop">View all</Link>}
        </div>
        <div className={referenceStyle ? "reference-brand-track" : "flex flex-wrap justify-center gap-2 sm:gap-3"}>
          {POPULAR_BRANDS.map(brand => (
            <Link key={brand.slug} href={`/sell/laptop/${brand.slug}`} className={referenceStyle ? "reference-brand-card" : "inline-flex items-center gap-2 px-3 py-2 rounded-full border bg-card shadow-sm text-sm"}>
              <img src={brand.logo_url} alt="" className={referenceStyle ? "" : "h-5 w-5 object-contain"} />
              <span>{brand.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
