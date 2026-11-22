"use client";

import { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import { useAuth } from '@/contexts/AuthContext';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrdersTab } from '@/components/admin/OrdersTab';
import { CatalogTab } from '@/components/admin/CatalogTab';
import { BlogsTab } from '@/components/admin/BlogsTab';
import FormsTab from '@/components/admin/FormsTab';
import StoreAdmin from '@/components/admin/StoreAdmin';
import { Store, PackageCheck } from 'lucide-react';
import './admin-store.css';

const Admin = () => {
  const router = useRouter();
  const { isAdmin, loading } = useAuth();
  const [mode, setMode] = useState<"pick" | "store">("pick");
  const [activeTab, setActiveTab] = useState("orders");

  useEffect(() => {
    try {
      const savedTab = window.localStorage.getItem("laptap-admin-active-tab");
      if (savedTab && ["orders", "catalog", "forms", "blogs", "analytics"].includes(savedTab)) setActiveTab(savedTab);
      if (window.localStorage.getItem("laptap-admin-mode") === "store") setMode("store");
    } catch {}
  }, []);

  const changeTab = (tab: string) => {
    setActiveTab(tab);
    try { window.localStorage.setItem("laptap-admin-active-tab", tab); } catch {}
  };

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.push('/');
    }
  }, [isAdmin, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main id="main-content" className="flex-1 flex items-center justify-center">
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
      
      <main id="main-content" className={`flex-1 ${mode === "store" ? "store-admin-page" : "py-6 sm:py-10 md:py-16 bg-muted/10"}`}>
        <div className={mode === "store" ? "store-admin-container" : "container px-4 sm:px-6 max-w-7xl"}>
          <div className="admin-workspace-header">
            <div><h1>{mode === 'store' ? 'Store administration' : 'Pick administration'}</h1><p>{mode === 'store' ? 'Manage the marketplace, sellers, and customer orders.' : 'Manage device pickups, catalog, forms, and content.'}</p></div>
            <div className="admin-mode-toggle" role="group" aria-label="Admin workspace">{(['pick', 'store'] as const).map(value => <button key={value} aria-pressed={mode === value} className={mode === value ? 'selected' : ''} onClick={() => { setMode(value); try { window.localStorage.setItem('laptap-admin-mode', value); } catch {} }}>{value === 'store' ? <Store size={17} /> : <PackageCheck size={17} />}{value === 'store' ? 'Store' : 'Pick'}</button>)}</div>
          </div>
          {mode === 'store' ? <StoreAdmin /> : <>

          <Tabs value={activeTab} onValueChange={changeTab} className="space-y-6">
            {/* Scrollable Horizontal Navigation for Mobile */}
            <div className="w-full overflow-x-auto pb-2 scrollbar-none">
              <TabsList className="inline-flex h-11 items-center justify-start rounded-xl bg-muted p-1 text-muted-foreground w-max min-w-full sm:w-full sm:justify-center">
                <TabsTrigger value="orders" className="whitespace-nowrap shrink-0 px-3.5 sm:px-5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all">Orders</TabsTrigger>
                <TabsTrigger value="catalog" className="whitespace-nowrap shrink-0 px-3.5 sm:px-5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all">Device Catalog</TabsTrigger>
                <TabsTrigger value="forms" className="whitespace-nowrap shrink-0 px-3.5 sm:px-5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all">Forms</TabsTrigger>
                <TabsTrigger value="blogs" className="whitespace-nowrap shrink-0 px-3.5 sm:px-5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all">Blogs</TabsTrigger>
                <TabsTrigger value="analytics" className="whitespace-nowrap shrink-0 px-3.5 sm:px-5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all">Analytics</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="orders" forceMount className="focus-visible:outline-none data-[state=inactive]:hidden">
              <OrdersTab />
            </TabsContent>

            <TabsContent value="catalog" forceMount className="focus-visible:outline-none data-[state=inactive]:hidden">
              <CatalogTab />
            </TabsContent>

            <TabsContent value="forms" forceMount className="focus-visible:outline-none data-[state=inactive]:hidden">
              <FormsTab />
            </TabsContent>

            <TabsContent value="blogs" forceMount className="focus-visible:outline-none data-[state=inactive]:hidden">
              <BlogsTab />
            </TabsContent>

            <TabsContent value="analytics" forceMount className="focus-visible:outline-none data-[state=inactive]:hidden">
              <Card className="p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-semibold mb-4">Analytics</h2>
                <p className="text-sm text-muted-foreground">
                  Track devices sold, average price, and revenue metrics.
                </p>
              </Card>
            </TabsContent>
          </Tabs>
          </>}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export { Admin as PageClient };
