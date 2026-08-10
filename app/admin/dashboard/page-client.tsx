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
      
      <main className="flex-1 py-6 sm:py-10 md:py-16 bg-muted/10">
        <div className="container px-4 sm:px-6 max-w-7xl">
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Admin Panel</h1>
          </div>

          <Tabs defaultValue="orders" className="space-y-6">
            {/* Scrollable Horizontal Navigation for Mobile */}
            <div className="w-full overflow-x-auto pb-2 scrollbar-none">
              <TabsList className="inline-flex h-11 items-center justify-start rounded-xl bg-muted p-1 text-muted-foreground w-max min-w-full sm:w-full sm:justify-center">
                <TabsTrigger value="orders" className="whitespace-nowrap shrink-0 px-3.5 sm:px-5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all">Orders</TabsTrigger>
                <TabsTrigger value="catalog" className="whitespace-nowrap shrink-0 px-3.5 sm:px-5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all">Device Catalog</TabsTrigger>
                <TabsTrigger value="referrals" className="whitespace-nowrap shrink-0 px-3.5 sm:px-5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all">Referrals</TabsTrigger>
                <TabsTrigger value="forms" className="whitespace-nowrap shrink-0 px-3.5 sm:px-5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all">Forms</TabsTrigger>
                <TabsTrigger value="blogs" className="whitespace-nowrap shrink-0 px-3.5 sm:px-5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all">Blogs</TabsTrigger>
                <TabsTrigger value="analytics" className="whitespace-nowrap shrink-0 px-3.5 sm:px-5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all">Analytics</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="orders" className="focus-visible:outline-none">
              <OrdersTab />
            </TabsContent>

            <TabsContent value="catalog" className="focus-visible:outline-none">
              <CatalogTab />
            </TabsContent>

            <TabsContent value="referrals" className="focus-visible:outline-none">
              <ReferralsTab />
            </TabsContent>

            <TabsContent value="forms" className="focus-visible:outline-none">
              <FormsTab />
            </TabsContent>

            <TabsContent value="blogs" className="focus-visible:outline-none">
              <BlogsTab />
            </TabsContent>

            <TabsContent value="analytics" className="focus-visible:outline-none">
              <Card className="p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-semibold mb-4">Analytics</h2>
                <p className="text-sm text-muted-foreground">
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
