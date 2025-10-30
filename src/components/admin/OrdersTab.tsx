import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Eye, Search, Filter } from 'lucide-react';
import { OrderDetailsDialog } from './OrderDetailsDialog';

export function OrdersTab() {
  const [orders, setOrders] = useState<any[]>([]);
  const [repairOrders, setRepairOrders] = useState<any[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('all');

  useEffect(() => {
    fetchOrders();
    fetchRepairOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      // Fetch sell requests with models data including category
      const { data: sellRequestsData, error: sellRequestsError } = await supabase
        .from('sell_requests')
        .select(`
          *,
          models (
            name,
            series (
              name,
              brands (
                name,
                categories (
                  name,
                  slug
                )
              )
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

  const fetchRepairOrders = async () => {
    try {
      const { data: repairData, error: repairError } = await supabase
        .from('repair_requests')
        .select(`
          *,
          brands (name)
        `)
        .order('created_at', { ascending: false });

      if (repairError) throw repairError;
      
      setRepairOrders(repairData || []);
    } catch (error) {
      console.error('Error fetching repair orders:', error);
      toast.error('Failed to load repair orders');
    }
  };

  // Helper function to categorize device type using actual category from database
  const getDeviceCategory = (order: any) => {
    const categorySlug = order.models?.series?.brands?.categories?.slug?.toLowerCase() || '';
    
    if (categorySlug === 'mobile') {
      return 'mobile';
    } else if (categorySlug === 'laptop') {
      return 'laptop';
    } else if (categorySlug === 'desktop') {
      return 'desktop';
    }
    return 'laptop'; // Default to laptop
  };

  // Helper function to categorize order stage
  const getOrderStage = (status: string) => {
    const pickupStages = ['quoted', 'pickup_scheduled', 'picked_up'];
    return pickupStages.includes(status) ? 'pickup' : 'repair';
  };

  // Filter orders by category, stage, and other filters
  const getFilteredOrders = (deviceType: 'mobile' | 'laptop', stage: 'pickup' | 'repair') => {
    let filtered = orders.filter(order => {
      const category = getDeviceCategory(order);
      const orderStage = getOrderStage(order.status);
      
      // Filter by device type (mobile or laptop/desktop)
      const matchesDevice = deviceType === 'mobile' 
        ? category === 'mobile'
        : ['laptop', 'desktop'].includes(category);
      
      // Filter by stage
      const matchesStage = orderStage === stage;
      
      return matchesDevice && matchesStage;
    });

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

    // Price range filter
    if (priceRange !== 'all') {
      filtered = filtered.filter(order => {
        const price = order.estimated_price || 0;
        switch (priceRange) {
          case 'under10k': return price < 10000;
          case '10k-25k': return price >= 10000 && price < 25000;
          case '25k-50k': return price >= 25000 && price < 50000;
          case '50k-100k': return price >= 50000 && price < 100000;
          case 'above100k': return price >= 100000;
          default: return true;
        }
      });
    }

    // Date range filter
    if (dateRange !== 'all') {
      const now = new Date();
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.created_at);
        const daysDiff = Math.floor((now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24));
        
        switch (dateRange) {
          case 'today': return daysDiff === 0;
          case 'week': return daysDiff <= 7;
          case 'month': return daysDiff <= 30;
          case '3months': return daysDiff <= 90;
          default: return true;
        }
      });
    }

    return filtered;
  };

  // Update filteredOrders based on all filters
  useEffect(() => {
    setFilteredOrders(orders);
  }, [orders]);

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

  const renderOrdersTable = (deviceType: 'mobile' | 'laptop', stage: 'pickup' | 'repair') => {
    const filtered = getFilteredOrders(deviceType, stage);
    
    return (
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
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  {searchQuery || statusFilter !== 'all' || priceRange !== 'all' || dateRange !== 'all'
                    ? 'No orders match your filters' 
                    : 'No orders found'}
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((order) => (
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
    );
  };

  if (loading) {
    return <div className="p-6">Loading orders...</div>;
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Filter className="h-5 w-5" />
        <h2 className="text-xl font-semibold">Orders Management</h2>
      </div>
      
      {/* Enhanced Filters Section */}
      <div className="mb-6 grid gap-4 md:grid-cols-5">
        {/* Search Bar */}
        <div className="md:col-span-2 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, mobile, email, device, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

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

        {/* Price Range Filter */}
        <Select value={priceRange} onValueChange={setPriceRange}>
          <SelectTrigger>
            <SelectValue placeholder="Price Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Prices</SelectItem>
            <SelectItem value="under10k">Under ₹10,000</SelectItem>
            <SelectItem value="10k-25k">₹10,000 - ₹25,000</SelectItem>
            <SelectItem value="25k-50k">₹25,000 - ₹50,000</SelectItem>
            <SelectItem value="50k-100k">₹50,000 - ₹1,00,000</SelectItem>
            <SelectItem value="above100k">Above ₹1,00,000</SelectItem>
          </SelectContent>
        </Select>

        {/* Date Range Filter */}
        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger>
            <SelectValue placeholder="Date Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">Last 7 Days</SelectItem>
            <SelectItem value="month">Last 30 Days</SelectItem>
            <SelectItem value="3months">Last 3 Months</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Main Type Tabs */}
      <Tabs defaultValue="sell" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="sell">Sell Orders</TabsTrigger>
          <TabsTrigger value="repair">Repair Orders</TabsTrigger>
        </TabsList>

        <TabsContent value="sell">
          <Tabs defaultValue="laptop" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="laptop">Laptop / Desktop</TabsTrigger>
              <TabsTrigger value="mobile">Mobile</TabsTrigger>
            </TabsList>

            {/* Laptop/Desktop Tab Content */}
            <TabsContent value="laptop">
              <Tabs defaultValue="pickup" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="pickup">Pickup Orders</TabsTrigger>
                  <TabsTrigger value="repair">Processing / Repair</TabsTrigger>
                </TabsList>

                <TabsContent value="pickup">
                  <div className="mb-3 text-sm text-muted-foreground">
                    {getFilteredOrders('laptop', 'pickup').length} orders in pickup stage
                  </div>
                  {renderOrdersTable('laptop', 'pickup')}
                </TabsContent>

                <TabsContent value="repair">
                  <div className="mb-3 text-sm text-muted-foreground">
                    {getFilteredOrders('laptop', 'repair').length} orders in processing/repair stage
                  </div>
                  {renderOrdersTable('laptop', 'repair')}
                </TabsContent>
              </Tabs>
            </TabsContent>

            {/* Mobile Tab Content */}
            <TabsContent value="mobile">
              <Tabs defaultValue="pickup" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="pickup">Pickup Orders</TabsTrigger>
                  <TabsTrigger value="repair">Processing / Repair</TabsTrigger>
                </TabsList>

                <TabsContent value="pickup">
                  <div className="mb-3 text-sm text-muted-foreground">
                    {getFilteredOrders('mobile', 'pickup').length} orders in pickup stage
                  </div>
                  {renderOrdersTable('mobile', 'pickup')}
                </TabsContent>

                <TabsContent value="repair">
                  <div className="mb-3 text-sm text-muted-foreground">
                    {getFilteredOrders('mobile', 'repair').length} orders in processing/repair stage
                  </div>
                  {renderOrdersTable('mobile', 'repair')}
                </TabsContent>
              </Tabs>
            </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="repair">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order #</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Brand/Model</TableHead>
                  <TableHead>Issue</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {repairOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No repair orders found
                    </TableCell>
                  </TableRow>
                ) : (
                  repairOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono text-xs">{order.order_number}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">{order.customer_name}</div>
                          <div className="text-muted-foreground">{order.customer_phone}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">{order.brands?.name}</div>
                          <div className="text-xs text-muted-foreground">{order.model_name}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">{order.issue_category}</div>
                          {order.issue_subcategory && (
                            <div className="text-xs text-muted-foreground">{order.issue_subcategory}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge>{order.status}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            setSelectedOrder({ ...order, type: 'repair' });
                            setDialogOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

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
