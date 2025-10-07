import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Brand {
  id: string;
  name: string;
  logo_url: string | null;
}

export function DeviceSearch() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [brands, setBrands] = useState<Brand[]>([]);
  const [filteredBrands, setFilteredBrands] = useState<Brand[]>([]);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    loadBrands();
  }, []);

  async function loadBrands() {
    const result = await supabase.from('brands').select('id, name, logo_url').eq('category', 'laptop') as any;
    if (result.data) {
      setBrands(result.data);
    }
  }

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    if (value.trim() && brands.length > 0) {
      const query = value.toLowerCase();
      const filtered = brands.filter(brand => 
        brand.name.toLowerCase().includes(query)
      ).slice(0, 5);
      setFilteredBrands(filtered);
      setShowResults(true);
    } else {
      setShowResults(false);
      setFilteredBrands([]);
    }
  };

  const handleBrandClick = (brandId: string) => {
    navigate(`/sell?category=laptop&brand=${brandId}`);
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
            {filteredBrands.length > 0 ? (
              <div className="space-y-2">
                <p className="text-sm font-semibold text-muted-foreground mb-3">Brands</p>
                {filteredBrands.map(brand => (
                  <div
                    key={brand.id}
                    onClick={() => handleBrandClick(brand.id)}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent cursor-pointer transition-colors"
                  >
                    {brand.logo_url && (
                      <div className="w-10 h-10 flex items-center justify-center bg-muted rounded overflow-hidden">
                        <img 
                          src={brand.logo_url.startsWith('http') ? brand.logo_url : supabase.storage.from('brand-logos').getPublicUrl(brand.logo_url).data.publicUrl}
                          alt={brand.name}
                          className="w-full h-full object-contain"
                          onError={(e) => e.currentTarget.style.display = 'none'}
                        />
                      </div>
                    )}
                    <div>
                      <p className="font-medium">{brand.name}</p>
                      <p className="text-sm text-muted-foreground">Laptop Brand</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-6">No results found</p>
            )}
          </div>
        </Card>
      )}

      <div className="mt-6 flex flex-wrap gap-3 justify-center">
        <p className="w-full text-center text-sm text-muted-foreground mb-2">Popular Brands:</p>
        {brands.slice(0, 6).map(brand => (
          <Button
            key={brand.id}
            variant="outline"
            size="sm"
            onClick={() => handleBrandClick(brand.id)}
            className="rounded-full"
          >
            {brand.name}
          </Button>
        ))}
      </div>
    </div>
  );
}
