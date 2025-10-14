import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { Eye } from 'lucide-react';
import { OrderDetailsDialog } from './OrderDetailsDialog';

export function OrdersTab() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      // Fetch sell requests with models data
      const { data: sellRequestsData, error: sellRequestsError } = await supabase
        .from('sell_requests')
        .select(`
          *,
          models (
            name,
            series (
              name,
              brands (name)
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (sellRequestsError) throw sellRequestsError;

      if (!sellRequestsData || sellRequestsData.length === 0) {
        setOrders([]);
        setLoading(false);
        return;
      }

      // Get unique user IDs
      const userIds = [...new Set(sellRequestsData.map(sr => sr.user_id))];

      // Fetch profiles for these users
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .in('id', userIds);

      if (profilesError) throw profilesError;

      // Create a map of profiles by user_id
      const profilesMap = new Map(
        (profilesData || []).map(profile => [profile.id, profile])
      );

      // Combine the data
      const ordersWithProfiles = sellRequestsData.map(order => ({
        ...order,
        profiles: profilesMap.get(order.user_id) || null
      }));

      setOrders(ordersWithProfiles);
    } catch (error) {
      toast.error('Failed to fetch orders');
      console.error('Error fetching orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      quoted: 'bg-blue-500',
      pickup_scheduled: 'bg-yellow-500',
      picked_up: 'bg-orange-500',
      inspected: 'bg-purple-500',
      payment_processing: 'bg-indigo-500',
      paid: 'bg-green-500',
      cancelled: 'bg-red-500',
    };
    return colors[status] || 'bg-gray-500';
  };

  if (loading) {
    return <div className="p-6">Loading orders...</div>;
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Orders Management</h2>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Device</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-mono text-xs">
                  {order.id.slice(0, 8)}
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div className="font-medium">{order.config?.customer_name || order.profiles?.full_name || 'Unknown'}</div>
                    <div className="text-muted-foreground">{order.config?.customer_mobile || order.profiles?.phone}</div>
                    <div className="text-xs text-muted-foreground">{order.profiles?.email}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {order.models?.series?.brands?.name} {order.models?.series?.name}
                  </div>
                  <div className="text-xs text-muted-foreground">{order.models?.name}</div>
                </TableCell>
                <TableCell className="font-semibold">
                  ₹{order.estimated_price?.toLocaleString()}
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(order.status)}>
                    {order.status.replace('_', ' ')}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(order.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      setSelectedOrder(order);
                      setDialogOpen(true);
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedOrder && (
        <OrderDetailsDialog
          order={selectedOrder}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onOrderUpdated={fetchOrders}
          onOrderDeleted={fetchOrders}
        />
      )}
    </Card>
  );
}
