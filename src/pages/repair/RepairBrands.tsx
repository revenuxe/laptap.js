import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const RepairBrands = () => {
  const navigate = useNavigate();
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .order('name');

    if (error) {
      toast.error('Failed to load brands');
      console.error(error);
    } else {
      setBrands(data || []);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Select Brand for Laptop Repair | Laptap</title>
        <meta name="description" content="Choose your laptop brand to schedule a repair service." />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1 py-12 md:py-20">
          <div className="container max-w-6xl">
            <h1 className="mb-4 text-3xl font-bold tracking-tight text-center">Select Your Laptop Brand</h1>
            <p className="mb-12 text-center text-muted-foreground">Choose your device brand to proceed with repair booking</p>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {brands.map((brand) => (
                <Card
                  key={brand.id}
                  className="p-6 cursor-pointer hover:shadow-lg transition-all hover:scale-105"
                  onClick={() => navigate(`/repair/form?brand=${brand.id}`)}
                >
                  <div className="flex flex-col items-center gap-4">
                    {brand.logo_url && (
                      <img
                        src={brand.logo_url}
                        alt={brand.name}
                        className="h-16 w-16 object-contain"
                      />
                    )}
                    <h3 className="text-center font-semibold">{brand.name}</h3>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default RepairBrands;