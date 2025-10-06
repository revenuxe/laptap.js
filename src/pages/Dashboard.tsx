import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  // Mock data
  const requests = [
    {
      id: "REQ001",
      device: "Apple MacBook Pro 2021",
      price: 45000,
      status: "Pickup Scheduled",
      date: "2025-10-07",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-12 md:py-20">
        <div className="container max-w-6xl">
          <h1 className="mb-8 text-3xl font-bold tracking-tight">My Dashboard</h1>

          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Active Sell Requests</h2>
              {requests.length > 0 ? (
                <div className="space-y-4">
                  {requests.map((request) => (
                    <div
                      key={request.id}
                      className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 rounded-lg border"
                    >
                      <div>
                        <p className="font-semibold">{request.device}</p>
                        <p className="text-sm text-muted-foreground">Request ID: {request.id}</p>
                        <p className="text-sm text-muted-foreground">Date: {request.date}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-bold text-primary">₹{request.price.toLocaleString()}</p>
                          <Badge>{request.status}</Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No active requests</p>
              )}
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">History</h2>
              <p className="text-muted-foreground">No past transactions</p>
            </Card>
          </div>

          <div className="mt-8 text-center">
            <Button variant="cta" size="lg" onClick={() => window.location.href = "/sell"}>
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
