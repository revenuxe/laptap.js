"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BrandsManager } from "./BrandsManager";
import { SeriesManager } from "./SeriesManager";
import { ModelsManager } from "./ModelsManager";

export function CatalogTab() {
  return (
    <Tabs defaultValue="brands" className="space-y-4">
      <div className="w-full overflow-x-auto pb-1 scrollbar-none">
        <TabsList className="inline-flex h-10 items-center justify-start rounded-lg bg-muted p-1 text-muted-foreground w-max sm:w-auto">
          <TabsTrigger value="brands" className="whitespace-nowrap shrink-0 px-4 py-1.5 text-xs sm:text-sm font-medium">Brands</TabsTrigger>
          <TabsTrigger value="series" className="whitespace-nowrap shrink-0 px-4 py-1.5 text-xs sm:text-sm font-medium">Series</TabsTrigger>
          <TabsTrigger value="models" className="whitespace-nowrap shrink-0 px-4 py-1.5 text-xs sm:text-sm font-medium">Models</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="brands" className="focus-visible:outline-none">
        <BrandsManager />
      </TabsContent>

      <TabsContent value="series" className="focus-visible:outline-none">
        <SeriesManager />
      </TabsContent>

      <TabsContent value="models" className="focus-visible:outline-none">
        <ModelsManager />
      </TabsContent>
    </Tabs>
  );
}
