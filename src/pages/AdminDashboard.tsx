import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrdersTab } from '@/components/admin/OrdersTab';
import { CatalogTab } from '@/components/admin/CatalogTab';
import { MobileCatalogTab } from '@/components/admin/MobileCatalogTab';

const Admin = () => {
  const navigate = useNavigate();
  const { isAdmin, loading } = useAuth();

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate('/');
    }
  }, [isAdmin, loading, navigate]);

  if (loading) {
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

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-12 md:py-20">
        <div className="container max-w-7xl">
          <h1 className="mb-8 text-3xl font-bold tracking-tight">Admin Panel</h1>

          <Tabs defaultValue="orders" className="space-y-6">
            <TabsList>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="catalog">Device Catalog</TabsTrigger>
              <TabsTrigger value="mobile">Mobile Catalogue</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="orders">
              <OrdersTab />
            </TabsContent>

            <TabsContent value="catalog">
              <CatalogTab />
            </TabsContent>

            <TabsContent value="mobile">
              <MobileCatalogTab />
            </TabsContent>

            <TabsContent value="analytics">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Analytics</h2>
                <p className="text-muted-foreground">
                  Track devices sold, average price, and revenue metrics.
                </p>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Admin;
