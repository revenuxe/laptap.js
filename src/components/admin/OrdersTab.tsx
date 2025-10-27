import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Eye, Search } from 'lucide-react';
import { OrderDetailsDialog } from './OrderDetailsDialog';

export function OrdersTab() {
  const [orders, setOrders] = useState<any[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

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
      setFilteredOrders(ordersWithProfiles);
    } catch (error) {
      toast.error('Failed to fetch orders');
      console.error('Error fetching orders:', error);
      setOrders([]);
      setFilteredOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // Apply filters whenever search or filter criteria change
  useEffect(() => {
    let filtered = [...orders];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(order => 
        order.config?.customer_name?.toLowerCase().includes(query) ||
        order.config?.customer_mobile?.includes(query) ||
        order.profiles?.email?.toLowerCase().includes(query) ||
        order.models?.series?.brands?.name?.toLowerCase().includes(query) ||
        order.models?.name?.toLowerCase().includes(query) ||
        order.id?.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(order => {
        const category = order.models?.series?.brands?.name?.toLowerCase();
        if (categoryFilter === 'laptop') {
          return ['dell', 'hp', 'lenovo', 'asus', 'acer', 'apple', 'msi', 'microsoft'].some(brand => 
            category?.includes(brand)
          );
        } else if (categoryFilter === 'mobile') {
          return ['samsung', 'apple', 'oneplus', 'xiaomi', 'oppo', 'vivo', 'realme'].some(brand => 
            category?.includes(brand)
          );
        } else if (categoryFilter === 'desktop') {
          return order.models?.name?.toLowerCase().includes('desktop') || 
                 order.models?.name?.toLowerCase().includes('imac');
        }
        return true;
      });
    }

    setFilteredOrders(filtered);
  }, [searchQuery, statusFilter, categoryFilter, orders]);

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
      <h2 className="text-xl font-semibold mb-6">Orders Management</h2>
      
      {/* Filters Section */}
      <div className="mb-6 grid gap-4 md:grid-cols-4">
        {/* Search Bar */}
        <div className="md:col-span-2 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, mobile, email, device, or order ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Category Filter */}
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger>
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="laptop">Laptops</SelectItem>
            <SelectItem value="mobile">Mobiles</SelectItem>
            <SelectItem value="desktop">Desktops</SelectItem>
          </SelectContent>
        </Select>

        {/* Status Filter */}
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger>
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="quoted">Quoted</SelectItem>
            <SelectItem value="pickup_scheduled">Pickup Scheduled</SelectItem>
            <SelectItem value="picked_up">Picked Up</SelectItem>
            <SelectItem value="inspected">Inspected</SelectItem>
            <SelectItem value="payment_processing">Payment Processing</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results Count */}
      <div className="mb-4 text-sm text-muted-foreground">
        Showing {filteredOrders.length} of {orders.length} orders
      </div>
      
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
            {filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  {searchQuery || statusFilter !== 'all' || categoryFilter !== 'all' 
                    ? 'No orders match your filters' 
                    : 'No orders found'}
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => (
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
            )))}
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
