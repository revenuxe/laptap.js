import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Phone, User, Laptop } from "lucide-react";
import { format } from "date-fns";

interface SimpleForm {
  id: string;
  name: string;
  phone: string;
  selling_type: string;
  model: string;
  status: string;
  created_at: string;
  updated_at: string;
}

const FormsTab = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: forms, isLoading } = useQuery({
    queryKey: ["simple-forms"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("simple_forms")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as SimpleForm[];
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from("simple_forms")
        .update({ status })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["simple-forms"] });
      toast({
        title: "Status updated",
        description: "Form status has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error updating status",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("simple_forms")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["simple-forms"] });
      toast({
        title: "Form deleted",
        description: "Form has been deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error deleting form",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      pending: "default",
      contacted: "secondary",
      completed: "secondary",
      cancelled: "destructive",
    };

    return (
      <Badge variant={variants[status] || "default"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Simple Forms</h2>
          <p className="text-muted-foreground">
            Manage quick inquiry forms from customers
          </p>
        </div>
        <Badge variant="secondary" className="text-lg">
          {forms?.length || 0} Total Forms
        </Badge>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Model</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {forms && forms.length > 0 ? (
              forms.map((form) => (
                <TableRow key={form.id}>
                  <TableCell>
                    {format(new Date(form.created_at), "MMM dd, yyyy")}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      {form.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      {form.phone}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Laptop className="h-4 w-4 text-muted-foreground" />
                      {form.selling_type.charAt(0).toUpperCase() + form.selling_type.slice(1)}
                    </div>
                  </TableCell>
                  <TableCell>{form.model}</TableCell>
                  <TableCell>{getStatusBadge(form.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Select
                        value={form.status}
                        onValueChange={(value) =>
                          updateStatusMutation.mutate({ id: form.id, status: value })
                        }
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="contacted">Contacted</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteMutation.mutate(form.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No forms submitted yet
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default FormsTab;