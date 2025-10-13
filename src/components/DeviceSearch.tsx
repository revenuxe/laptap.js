import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Search, Laptop } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Brand {
  id: string;
  name: string;
  logo_url: string | null;
}

interface Model {
  id: string;
  name: string;
  series: {
    id: string;
    name: string;
    brand_id: string;
    brands: {
      name: string;
    };
  };
}

export function DeviceSearch() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [brands, setBrands] = useState<Brand[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [filteredModels, setFilteredModels] = useState<Model[]>([]);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    loadBrands();
    loadModels();
  }, []);

  async function loadBrands() {
    const { data } = await (supabase
      .from('brands')
      .select('id, name, logo_url') as any);
    
    if (data) {
      setBrands(data as Brand[]);
    }
  }

  async function loadModels() {
    const { data } = await supabase
      .from('models')
      .select(`
        id,
        name,
        series (
          id,
          name,
          brand_id,
          brands (
            name
          )
        )
      `)
      .eq('active', true);
    
    if (data) {
      // Sort by year (newest first), extracting year from model name
      const sortedModels = (data as Model[]).sort((a, b) => {
        const yearA = parseInt(a.name.match(/\b(19|20)\d{2}\b/)?.[0] || '0');
        const yearB = parseInt(b.name.match(/\b(19|20)\d{2}\b/)?.[0] || '0');
        return yearB - yearA; // Descending order (newest first)
      });
      setModels(sortedModels);
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

  const handleModelClick = async (model: Model) => {
    // Navigate with all required params to pre-fill the form
    navigate(`/sell?category=laptop&brand=${model.series.brand_id}&series=${model.series.id}&model=${model.id}`);
    setSearchQuery('');
    setShowResults(false);
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
