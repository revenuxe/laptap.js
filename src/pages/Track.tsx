import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Circle, Phone, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

const Track = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [sellRequest, setSellRequest] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const statusSteps = [
    { key: 'quoted', label: 'Quoted' },
    { key: 'pickup_scheduled', label: 'Pickup Scheduled' },
    { key: 'picked_up', label: 'Picked Up' },
    { key: 'inspected', label: 'Inspected' },
    { key: 'payment_processing', label: 'Payment Processing' },
    { key: 'paid', label: 'Paid' },
  ];

  useEffect(() => {
    if (!authLoading && !user) {
      navigate(`/auth?redirect=/track/${id}`);
    }
  }, [user, authLoading, navigate, id]);

  useEffect(() => {
    const fetchSellRequest = async () => {
      if (!id || !user) return;

      const { data, error } = await supabase
        .from('sell_requests')
        .select(`
          *,
          models (
            name,
            series (
              name,
              brands (name)
            )
          )
        `)
        .eq('id', id)
        .maybeSingle();

      if (error) {
        toast.error('Failed to load tracking info');
        console.error(error);
      } else if (!data) {
        toast.error('Request not found');
      } else {
        setSellRequest(data);
      }
      
      setLoading(false);
    };

    fetchSellRequest();
  }, [id, user]);

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!sellRequest) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Request not found</p>
        </main>
        <Footer />
      </div>
    );
  }

  const currentStatusIndex = statusSteps.findIndex(s => s.key === sellRequest.status);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-12 md:py-20">
        <div className="container max-w-4xl">
          <h1 className="text-3xl font-bold mb-2">Track Your Request</h1>
          <p className="text-muted-foreground mb-8">Booking ID: {sellRequest.id.slice(0, 8)}</p>

          <Card className="p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Device Details</h2>
            <div className="space-y-2 text-sm">
              <p><strong>Brand:</strong> {sellRequest.models?.series?.brands?.name}</p>
              <p><strong>Series:</strong> {sellRequest.models?.series?.name}</p>
              <p><strong>Model:</strong> {sellRequest.models?.name}</p>
              <p><strong>Estimated Price:</strong> ₹{sellRequest.estimated_price?.toLocaleString()}</p>
              {sellRequest.final_price && (
                <p><strong>Final Price:</strong> ₹{sellRequest.final_price?.toLocaleString()}</p>
              )}
            </div>
          </Card>

          <Card className="p-6 mb-6">
            <h2 className="text-xl font-semibold mb-6">Status Timeline</h2>
            <div className="space-y-6">
              {statusSteps.map((step, index) => {
                const isCompleted = index <= currentStatusIndex;
                const isCurrent = index === currentStatusIndex;

                return (
                  <div key={step.key} className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      {isCompleted ? (
                        <CheckCircle2 className="h-8 w-8 text-primary" />
                      ) : (
                        <Circle className="h-8 w-8 text-muted" />
                      )}
                      {index < statusSteps.length - 1 && (
                        <div className={`w-0.5 h-12 ${isCompleted ? 'bg-primary' : 'bg-muted'}`} />
                      )}
                    </div>
                    <div className="flex-1 pb-8">
                      <h3 className={`font-semibold ${isCurrent ? 'text-primary' : ''}`}>
                        {step.label}
                      </h3>
                      {isCurrent && (
                        <Badge variant="secondary" className="mt-1">Current Status</Badge>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          <div className="flex gap-4">
            <Button variant="cta" className="flex-1">
              <Phone className="mr-2 h-4 w-4" />
              Call Support
            </Button>
            <Button variant="outline" className="flex-1">
              <MessageSquare className="mr-2 h-4 w-4" />
              Chat Support
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Track;
