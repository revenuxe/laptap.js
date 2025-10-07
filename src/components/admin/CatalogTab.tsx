import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BrandsManager } from "./BrandsManager";
import { SeriesManager } from "./SeriesManager";
import { ModelsManager } from "./ModelsManager";

export function CatalogTab() {
  return (
    <Tabs defaultValue="brands" className="space-y-4">
      <TabsList>
        <TabsTrigger value="brands">Brands</TabsTrigger>
        <TabsTrigger value="series">Series</TabsTrigger>
        <TabsTrigger value="models">Models</TabsTrigger>
      </TabsList>

      <TabsContent value="brands">
        <BrandsManager />
      </TabsContent>

      <TabsContent value="series">
        <SeriesManager />
      </TabsContent>

      <TabsContent value="models">
        <ModelsManager />
      </TabsContent>
    </Tabs>
  );
}
