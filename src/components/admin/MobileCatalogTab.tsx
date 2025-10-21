import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MobileBrandsManager } from "./MobileBrandsManager";
import { MobileSeriesManager } from "./MobileSeriesManager";
import { MobileModelsManager } from "./MobileModelsManager";

export function MobileCatalogTab() {
  return (
    <Tabs defaultValue="brands" className="space-y-4">
      <TabsList>
        <TabsTrigger value="brands">Brands</TabsTrigger>
        <TabsTrigger value="series">Series</TabsTrigger>
        <TabsTrigger value="models">Models</TabsTrigger>
      </TabsList>

      <TabsContent value="brands">
        <MobileBrandsManager />
      </TabsContent>

      <TabsContent value="series">
        <MobileSeriesManager />
      </TabsContent>

      <TabsContent value="models">
        <MobileModelsManager />
      </TabsContent>
    </Tabs>
  );
}