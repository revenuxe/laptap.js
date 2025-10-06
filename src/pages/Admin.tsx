import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Admin = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-12 md:py-20">
        <div className="container max-w-6xl">
          <h1 className="mb-8 text-3xl font-bold tracking-tight">Admin Panel</h1>

          <Tabs defaultValue="catalog" className="space-y-6">
            <TabsList>
              <TabsTrigger value="catalog">Device Catalog</TabsTrigger>
              <TabsTrigger value="requests">User Requests</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="catalog">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Manage Device Catalog</h2>
                <p className="text-muted-foreground">
                  Manage brands, series, models, and pricing. Connect Lovable Cloud to enable full functionality.
                </p>
              </Card>
            </TabsContent>

            <TabsContent value="requests">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">User Requests</h2>
                <p className="text-muted-foreground">
                  View and manage user sell requests, payments, and disputes.
                </p>
              </Card>
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
