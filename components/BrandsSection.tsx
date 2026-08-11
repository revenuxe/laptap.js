"use client";

import { useState, useEffect } from 'react';
import Link from "next/link";
import { supabase } from '@/lib/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

interface Brand {
  id: string;
  name: string;
  logo_url: string | null;
  category_id: string | null;
  slug: string | null;
}

const DEFAULT_BRANDS: Brand[] = [
  { id: 'apple', name: 'Apple', logo_url: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg', category_id: null, slug: 'apple' },
  { id: 'dell', name: 'Dell', logo_url: 'https://upload.wikimedia.org/wikipedia/commons/1/18/Dell_logo_2016.svg', category_id: null, slug: 'dell' },
  { id: 'hp', name: 'HP', logo_url: 'https://upload.wikimedia.org/wikipedia/commons/a/ad/HP_logo_2012.svg', category_id: null, slug: 'hp' },
  { id: 'lenovo', name: 'Lenovo', logo_url: 'https://upload.wikimedia.org/wikipedia/commons/b/b8/Lenovo_logo_2015.svg', category_id: null, slug: 'lenovo' },
  { id: 'asus', name: 'Asus', logo_url: 'https://upload.wikimedia.org/wikipedia/commons/2/2e/ASUS_Logo.svg', category_id: null, slug: 'asus' },
  { id: 'acer', name: 'Acer', logo_url: 'https://upload.wikimedia.org/wikipedia/commons/a/a1/Acer_Logo.svg', category_id: null, slug: 'acer' },
  { id: 'msi', name: 'MSI', logo_url: 'https://upload.wikimedia.org/wikipedia/commons/3/3a/MSI_logo.svg', category_id: null, slug: 'msi' },
  { id: 'samsung', name: 'Samsung', logo_url: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg', category_id: null, slug: 'samsung' },
];

export function BrandsSection() {
  const [brands, setBrands] = useState<Brand[]>(DEFAULT_BRANDS);

  useEffect(() => {
    loadBrands();
  }, []);

  async function loadBrands() {
    try {
      const { data: categoryData } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', 'laptop')
        .single();

      if (categoryData) {
        const { data } = await supabase
          .from('brands')
          .select('id, name, logo_url, category_id, slug')
          .eq('category_id', categoryData.id)
          .order('name')
          .limit(8);
        
        if (data && data.length > 0) setBrands(data);
      }
    } catch (error) {
      console.error('Failed to load brands:', error);
    }
  }

  return (
    <section className="py-10 sm:py-16 md:py-24 bg-muted/30">
      <div className="container">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
            Brands We Buy
          </h2>
          <p className="text-sm sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            We accept laptops from all major brands. Get the best price for your device today.
          </p>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 gap-2.5 sm:gap-4 md:gap-6 max-w-5xl mx-auto mb-6 sm:mb-8">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              href={`/sell/laptop/${brand.slug || ''}`}
              className="block"
            >
              <Card className="cursor-pointer p-3 sm:p-6 hover:border-primary hover:shadow-lg transition-all group rounded-xl sm:rounded-lg">
                {brand.logo_url ? (
                  <div className="aspect-square flex items-center justify-center overflow-hidden rounded-lg bg-background p-2 sm:p-4">
                    <img 
                      src={brand.logo_url.startsWith('http') 
                        ? brand.logo_url 
                        : supabase.storage.from('brand-logos').getPublicUrl(brand.logo_url).data.publicUrl
                      }
                      alt={brand.name}
                      className="h-full w-full object-contain group-hover:scale-110 transition-transform"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                ) : (
                  <div className="aspect-square flex items-center justify-center bg-background rounded-lg">
                    <span className="text-xl sm:text-2xl font-bold text-muted-foreground">
                      {brand.name.charAt(0)}
                    </span>
                  </div>
                )}
                <h3 className="font-semibold text-center mt-2 sm:mt-3 text-xs sm:text-sm group-hover:text-primary transition-colors">
                  {brand.name}
                </h3>
              </Card>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Button
            size="sm"
            asChild
            className="group sm:size-lg"
          >
            <Link href="/sell/laptop">
              View All Brands
              <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

