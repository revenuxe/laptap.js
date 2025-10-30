import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, Eye } from "lucide-react";
import { toast } from 'sonner';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [sellRequests, setSellRequests] = useState<any[]>([]);
  const [repairRequests, setRepairRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth?redirect=/dashboard');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchSellRequests();
      fetchRepairRequests();
    }
  }, [user]);

  const fetchSellRequests = async () => {
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
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to load requests');
      console.error(error);
    } else {
      setSellRequests(data || []);
    }
    setLoading(false);
  };

  const fetchRepairRequests = async () => {
    const { data, error } = await supabase
      .from('repair_requests')
      .select(`
        *,
        brands (name)
      `)
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to load repair requests:', error);
    } else {
      setRepairRequests(data || []);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p>Loading...</p>
        </main>
        <Footer />
      </div>
    );
  }

  const getStatusLabel = (status: string) => {
    return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-12 md:py-20">
        <div className="container max-w-6xl">
          <h1 className="mb-8 text-3xl font-bold tracking-tight">My Dashboard</h1>

          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Active Sell Requests</h2>
              {sellRequests.length > 0 ? (
                <div className="space-y-4">
                  {sellRequests.map((request) => (
                    <div
                      key={request.id}
                      className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 rounded-lg border"
                    >
                      <div>
                        <p className="font-semibold">
                          {request.models?.series?.brands?.name} {request.models?.series?.name}
                        </p>
                        <p className="text-sm text-muted-foreground">{request.models?.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Request ID: {request.id.slice(0, 8)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Date: {new Date(request.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-bold text-primary">₹{request.estimated_price.toLocaleString()}</p>
                          <Badge>{getStatusLabel(request.status)}</Badge>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigate(`/track/${request.id}`)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Track
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No active sell requests</p>
                </div>
              )}
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Active Repair Requests</h2>
              {repairRequests.length > 0 ? (
                <div className="space-y-4">
                  {repairRequests.map((request) => (
                    <div
                      key={request.id}
                      className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 rounded-lg border"
                    >
                      <div>
                        <p className="font-semibold">
                          {request.brands?.name} - {request.model_name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Issue: {request.issue_category} {request.issue_subcategory && `- ${request.issue_subcategory}`}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Order #: {request.order_number}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Date: {new Date(request.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge>{getStatusLabel(request.status)}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No active repair requests</p>
                </div>
              )}
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">History</h2>
              <p className="text-muted-foreground">No past transactions</p>
            </Card>
          </div>

          <div className="mt-8 text-center">
            <Button variant="cta" size="lg" onClick={() => navigate("/sell")}>
              Sell Another Device
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
