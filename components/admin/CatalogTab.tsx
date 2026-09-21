"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tag, Layers, Laptop } from "lucide-react";
import { BrandsManager } from "./BrandsManager";
import { SeriesManager } from "./SeriesManager";
import { ModelsManager } from "./ModelsManager";

export function CatalogTab() {
  const [activeTab, setActiveTab] = useState("models");

  useEffect(() => {
    const savedTab = window.sessionStorage.getItem("laptap-admin-catalog-tab");
    if (savedTab === "brands" || savedTab === "series" || savedTab === "models") {
      setActiveTab(savedTab);
    }
  }, []);

  const changeTab = (tab: string) => {
    setActiveTab(tab);
    window.sessionStorage.setItem("laptap-admin-catalog-tab", tab);
  };

  return (
    <Tabs value={activeTab} onValueChange={changeTab} className="space-y-6">
      <div className="w-full overflow-x-auto pb-1 scrollbar-none">
        <TabsList className="inline-flex h-12 items-center justify-start rounded-2xl bg-slate-100 dark:bg-slate-800/80 p-1.5 text-muted-foreground w-max sm:w-auto gap-1">
          <TabsTrigger 
            value="brands" 
            className="whitespace-nowrap shrink-0 px-5 py-2 text-xs sm:text-sm font-medium rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all flex items-center gap-2"
          >
            <Tag className="h-4 w-4" />
            Brands
          </TabsTrigger>
          <TabsTrigger 
            value="series" 
            className="whitespace-nowrap shrink-0 px-5 py-2 text-xs sm:text-sm font-medium rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all flex items-center gap-2"
          >
            <Layers className="h-4 w-4" />
            Series
          </TabsTrigger>
          <TabsTrigger 
            value="models" 
            className="whitespace-nowrap shrink-0 px-5 py-2 text-xs sm:text-sm font-medium rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all flex items-center gap-2"
          >
            <Laptop className="h-4 w-4" />
            Models
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="brands" forceMount className="focus-visible:outline-none data-[state=inactive]:hidden">
        <BrandsManager />
      </TabsContent>

      <TabsContent value="series" forceMount className="focus-visible:outline-none data-[state=inactive]:hidden">
        <SeriesManager />
      </TabsContent>

      <TabsContent value="models" forceMount className="focus-visible:outline-none data-[state=inactive]:hidden">
        <ModelsManager />
      </TabsContent>
    </Tabs>
  );
}

