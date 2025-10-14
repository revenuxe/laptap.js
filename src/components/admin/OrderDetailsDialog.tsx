import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { Trash2, Save } from 'lucide-react';

interface OrderDetailsDialogProps {
  order: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOrderUpdated: () => void;
  onOrderDeleted: () => void;
}

const statusOptions = [
  { value: 'quoted', label: 'Quoted' },
  { value: 'pickup_scheduled', label: 'Pickup Scheduled' },
  { value: 'picked_up', label: 'Picked Up' },
  { value: 'inspected', label: 'Inspected' },
  { value: 'payment_processing', label: 'Payment Processing' },
  { value: 'paid', label: 'Paid' },
  { value: 'cancelled', label: 'Cancelled' },
];

export function OrderDetailsDialog({
  order,
  open,
  onOpenChange,
  onOrderUpdated,
  onOrderDeleted,
}: OrderDetailsDialogProps) {
  const [status, setStatus] = useState(order.status);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleUpdateStatus = async () => {
    setUpdating(true);
    const { error } = await supabase
      .from('sell_requests')
      .update({ status })
      .eq('id', order.id);

    if (error) {
      toast.error('Failed to update status');
      console.error(error);
    } else {
      toast.success('Status updated successfully');
      onOrderUpdated();
      onOpenChange(false);
    }
    setUpdating(false);
  };

  const handleDelete = async () => {
    setDeleting(true);
    const { error } = await supabase
      .from('sell_requests')
      .delete()
      .eq('id', order.id);

    if (error) {
      toast.error('Failed to delete order');
      console.error(error);
    } else {
      toast.success('Order deleted permanently');
      setShowDeleteConfirm(false);
      onOpenChange(false);
      onOrderDeleted();
    }
    setDeleting(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              Order ID: {order.id}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Customer Info */}
            <div>
              <h3 className="font-semibold mb-2">Customer Information</h3>
              <div className="space-y-1 text-sm">
                <p><strong>Name:</strong> {order.config?.customerName || order.profiles?.full_name || 'N/A'}</p>
                <p><strong>Email:</strong> {order.profiles?.email || 'N/A'}</p>
                <p><strong>Phone:</strong> {order.config?.customerMobile || order.profiles?.phone || 'N/A'}</p>
              </div>
            </div>

            {/* Device Info */}
            <div>
              <h3 className="font-semibold mb-2">Device Information</h3>
              <div className="space-y-1 text-sm">
                <p><strong>Brand:</strong> {order.models?.series?.brands?.name}</p>
                <p><strong>Series:</strong> {order.models?.series?.name}</p>
                <p><strong>Model:</strong> {order.models?.name}</p>
                <p><strong>Condition:</strong> {order.condition}</p>
                <p><strong>Age:</strong> {order.age_months} months</p>
              </div>
            </div>

            {/* Configuration */}
            {order.config && Object.keys(order.config).length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Configuration</h3>
                <div className="space-y-1 text-sm">
                  {order.config.cpu && <p><strong>CPU:</strong> {order.config.cpu}</p>}
                  {order.config.generation && <p><strong>Generation:</strong> {order.config.generation}</p>}
                  {order.config.ram && <p><strong>RAM:</strong> {order.config.ram}</p>}
                  {order.config.storage && <p><strong>Storage:</strong> {order.config.storage}</p>}
                  {order.config.screen_size && <p><strong>Screen Size:</strong> {order.config.screen_size}</p>}
                </div>
              </div>
            )}

            {/* Accessories */}
            {order.accessories && Object.keys(order.accessories).length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Accessories</h3>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(order.accessories).map(([key, value]) => 
                    value && <Badge key={key} variant="secondary">{key}</Badge>
                  )}
                </div>
              </div>
            )}

            {/* Pricing */}
            <div>
              <h3 className="font-semibold mb-2">Pricing</h3>
              <div className="space-y-1 text-sm">
                <p><strong>Estimated Price:</strong> ₹{order.estimated_price?.toLocaleString()}</p>
                {order.final_price && (
                  <p><strong>Final Price:</strong> ₹{order.final_price?.toLocaleString()}</p>
                )}
              </div>
            </div>

            {/* Address */}
            {order.address && (
              <div>
                <h3 className="font-semibold mb-2">Pickup Address</h3>
                <p className="text-sm">{order.address}</p>
                {order.pincode && <p className="text-sm"><strong>Pincode:</strong> {order.pincode}</p>}
              </div>
            )}

            {/* Status Update */}
            <div>
              <h3 className="font-semibold mb-2">Update Status</h3>
              <div className="flex gap-2">
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button 
                  onClick={handleUpdateStatus} 
                  disabled={updating || status === order.status}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {updating ? 'Updating...' : 'Update'}
                </Button>
              </div>
            </div>

            {/* Timestamps */}
            <div className="pt-4 border-t text-xs text-muted-foreground">
              <p>Created: {new Date(order.created_at).toLocaleString()}</p>
              {order.updated_at && order.updated_at !== order.created_at && (
                <p>Updated: {new Date(order.updated_at).toLocaleString()}</p>
              )}
            </div>

            {/* Delete Button */}
            <Button 
              variant="destructive" 
              className="w-full"
              onClick={() => setShowDeleteConfirm(true)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Order Permanently
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the order
              and remove all data from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? 'Deleting...' : 'Delete Permanently'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
