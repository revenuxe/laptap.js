"use client";

import { useState, useEffect } from 'react';
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

export function DeviceSearch() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [models, setModels] = useState<Model[]>([]);
  const [filteredModels, setFilteredModels] = useState<Model[]>([]);
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
        const sortedModels = (data as Model[]).sort((a, b) => {
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
    if (value.trim() && models.length > 0) {
      const query = value.toLowerCase();
      const filtered = models.filter(model => 
        model.name.toLowerCase().includes(query) ||
        model.series.name.toLowerCase().includes(query) ||
        model.series.brands.name.toLowerCase().includes(query)
      ).slice(0, 5);
      setFilteredModels(filtered);
      setShowResults(true);
    } else {
      setShowResults(false);
      setFilteredModels([]);
    }
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
          type="text"
          placeholder="Search for your device brand, model..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-6 text-lg rounded-xl border-2 focus:border-primary"
        />
      </div>

      {showResults && (
        <Card className="absolute top-full mt-2 w-full z-50 max-h-96 overflow-auto shadow-lg">
          <div className="p-4">
            {filteredModels.length > 0 ? (
              <div className="space-y-2">
                <p className="text-sm font-semibold text-muted-foreground mb-3">Models</p>
                {filteredModels.map(model => (
                  <div
                    key={model.id}
                    onClick={() => handleModelClick(model)}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent cursor-pointer transition-colors"
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
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-6">No models found</p>
            )}
          </div>
        </Card>
      )}

      {/* Popular Brands (Static for instant rendering) */}
      <div className="mt-5 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
        <span className="w-full text-center text-xs sm:text-sm font-medium text-muted-foreground mb-1">
          Popular Brands:
        </span>
        {POPULAR_BRANDS.map(brand => (
          <Link
            key={brand.slug}
            href={`/sell/laptop/${brand.slug}`}
            className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-border bg-card/80 hover:bg-accent hover:border-primary/50 shadow-sm transition-all text-xs sm:text-sm font-medium hover:scale-105"
          >
            <img
              src={brand.logo_url}
              alt={brand.name}
              className="h-4 w-4 sm:h-5 sm:w-5 object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <span>{brand.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

