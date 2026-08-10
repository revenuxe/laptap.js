"use client";

import { useEffect } from 'react';
import { useRouter } from "next/navigation";
import { useAuth } from '@/contexts/AuthContext';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrdersTab } from '@/components/admin/OrdersTab';
import { CatalogTab } from '@/components/admin/CatalogTab';
import { MobileCatalogTab } from '@/components/admin/MobileCatalogTab';
import { BlogsTab } from '@/components/admin/BlogsTab';
import ReferralsTab from '@/components/admin/ReferralsTab';
import FormsTab from '@/components/admin/FormsTab';

const Admin = () => {
  const router = useRouter();
  const { isAdmin, loading } = useAuth();

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.push('/');
    }
  }, [isAdmin, loading, router]);

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
              <TabsTrigger value="referrals">Referrals</TabsTrigger>
              <TabsTrigger value="forms">Forms</TabsTrigger>
              <TabsTrigger value="blogs">Blogs</TabsTrigger>
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

            <TabsContent value="referrals">
              <ReferralsTab />
            </TabsContent>

            <TabsContent value="forms">
              <FormsTab />
            </TabsContent>

            <TabsContent value="blogs">
              <BlogsTab />
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

export { Admin as PageClient };
