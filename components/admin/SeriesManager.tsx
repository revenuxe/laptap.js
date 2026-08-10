"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";
import { seriesSchema, validateImageFile } from "@/lib/validationSchemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pencil, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";

export function SeriesManager() {
  const [open, setOpen] = useState(false);
  const [editingSeries, setEditingSeries] = useState<any>(null);
  const [name, setName] = useState("");
  const [brandId, setBrandId] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const queryClient = useQueryClient();

  const { data: brands } = useQuery({
    queryKey: ["brands"],
    queryFn: async () => {
      const { data, error } = await supabase.from("brands").select("*").order("name");
      if (error) throw error;
      return data;
    },
  });

  const { data: series, isLoading } = useQuery({
    queryKey: ["series"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("series")
        .select("*, brands(name)")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  const uploadImage = async (file: File, seriesId: string) => {
    const fileExt = file.name.split(".").pop();
    const filePath = `${seriesId}-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("series-images")
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from("series-images")
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const createMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase
        .from("series")
        .insert({ name, brand_id: brandId, image_url: imageUrl })
        .select()
        .single();

      if (error) throw error;

      if (imageFile) {
        const url = await uploadImage(imageFile, data.id);
        const { error: updateError } = await supabase
          .from("series")
          .update({ image_url: url })
          .eq("id", data.id);
        if (updateError) throw updateError;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["series"] });
      toast.success("Series created successfully");
      resetForm();
      setOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async () => {
      let finalImageUrl = imageUrl;

      if (imageFile) {
        finalImageUrl = await uploadImage(imageFile, editingSeries.id);
      }

      const { error } = await supabase
        .from("series")
        .update({ name, brand_id: brandId, image_url: finalImageUrl })
        .eq("id", editingSeries.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["series"] });
      toast.success("Series updated successfully");
      resetForm();
      setOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("series").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["series"] });
      toast.success("Series deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const resetForm = () => {
    setName("");
    setBrandId("");
    setImageFile(null);
    setImageUrl("");
    setEditingSeries(null);
  };

  const handleEdit = (series: any) => {
    setEditingSeries(series);
    setName(series.name);
    setBrandId(series.brand_id);
    setImageUrl(series.image_url || "");
    setOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs
    const validation = seriesSchema.safeParse({ name, brandId });
    if (!validation.success) {
      const errors = validation.error.errors.map(e => e.message).join(', ');
      toast.error(errors);
      return;
    }

    // Validate image file
    const fileValidation = validateImageFile(imageFile);
    if (!fileValidation.valid) {
      toast.error(fileValidation.error);
      return;
    }
    
    if (editingSeries) {
      updateMutation.mutate();
    } else {
      createMutation.mutate();
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Series</CardTitle>
        <Dialog open={open} onOpenChange={(open) => { setOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Series
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingSeries ? "Edit Series" : "Add New Series"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="brand">Brand *</Label>
                <Select value={brandId} onValueChange={setBrandId} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select brand" />
                  </SelectTrigger>
                  <SelectContent>
                    {brands?.map((brand) => (
                      <SelectItem key={brand.id} value={brand.id}>
                        {brand.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="name">Series Name *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="image">Series Image</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                />
                {imageUrl && !imageFile && (
                  <img src={imageUrl} alt="Current image" className="mt-2 h-20 object-contain" />
                )}
              </div>
              <Button type="submit" className="w-full">
                {editingSeries ? "Update" : "Create"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {series?.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>
                    {s.image_url && (
                      <img src={s.image_url} alt={s.name} className="h-10 object-contain" />
                    )}
                  </TableCell>
                  <TableCell>{s.name}</TableCell>
                  <TableCell>{s.brands?.name}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(s)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteMutation.mutate(s.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
