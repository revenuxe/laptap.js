"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";
import { modelSchema, validateImageFile } from "@/lib/validationSchemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Pencil, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";

export function MobileModelsManager() {
  const [open, setOpen] = useState(false);
  const [editingModel, setEditingModel] = useState<any>(null);
  const [name, setName] = useState("");
  const [seriesId, setSeriesId] = useState("");
  const [brandId, setBrandId] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [description, setDescription] = useState("");
  const [sku, setSku] = useState("");
  const [active, setActive] = useState(true);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const queryClient = useQueryClient();

  const { data: mobileCategory } = useQuery({
    queryKey: ["mobile-category"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("slug", "mobile")
        .single();
      if (error) throw error;
      return data;
    },
  });

  const { data: brands } = useQuery({
    queryKey: ["mobile-brands", mobileCategory?.id],
    queryFn: async () => {
      if (!mobileCategory) return [];
      const { data, error } = await supabase
        .from("brands")
        .select("*")
        .eq("category_id", mobileCategory.id)
        .order("name");
      if (error) throw error;
      return data;
    },
    enabled: !!mobileCategory,
  });

  const { data: series } = useQuery({
    queryKey: ["mobile-brand-series", brandId],
    queryFn: async () => {
      if (!brandId) return [];
      const { data, error } = await supabase
        .from("series")
        .select("*")
        .eq("brand_id", brandId)
        .order("name");
      if (error) throw error;
      return data;
    },
    enabled: !!brandId,
  });

  const { data: models, isLoading } = useQuery({
    queryKey: ["mobile-models", mobileCategory?.id],
    queryFn: async () => {
      if (!mobileCategory) return [];
      const { data, error } = await supabase
        .from("models")
        .select("*, series!inner(name, brand_id, brands!inner(name, category_id))")
        .eq("series.brands.category_id", mobileCategory.id)
        .order("name");
      if (error) throw error;
      return data;
    },
    enabled: !!mobileCategory,
  });

  const uploadImage = async (file: File, modelId: string) => {
    const fileExt = file.name.split(".").pop();
    const filePath = `${modelId}-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("model-thumbnails")
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from("model-thumbnails")
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const createMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase
        .from("models")
        .insert({
          name,
          series_id: seriesId,
          base_price: parseFloat(basePrice),
          description,
          sku,
          active,
          thumbnail_url: thumbnailUrl,
        })
        .select()
        .single();

      if (error) throw error;

      if (thumbnailFile) {
        const url = await uploadImage(thumbnailFile, data.id);
        const { error: updateError } = await supabase
          .from("models")
          .update({ thumbnail_url: url })
          .eq("id", data.id);
        if (updateError) throw updateError;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mobile-models"] });
      toast.success("Mobile model created successfully");
      resetForm();
      setOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async () => {
      let finalThumbnailUrl = thumbnailUrl;

      if (thumbnailFile) {
        finalThumbnailUrl = await uploadImage(thumbnailFile, editingModel.id);
      }

      const { error } = await supabase
        .from("models")
        .update({
          name,
          series_id: seriesId,
          base_price: parseFloat(basePrice),
          description,
          sku,
          active,
          thumbnail_url: finalThumbnailUrl,
        })
        .eq("id", editingModel.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mobile-models"] });
      toast.success("Mobile model updated successfully");
      resetForm();
      setOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("models").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mobile-models"] });
      toast.success("Mobile model deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const resetForm = () => {
    setName("");
    setSeriesId("");
    setBrandId("");
    setBasePrice("");
    setDescription("");
    setSku("");
    setActive(true);
    setThumbnailFile(null);
    setThumbnailUrl("");
    setEditingModel(null);
  };

  const handleEdit = (model: any) => {
    setEditingModel(model);
    setName(model.name);
    setSeriesId(model.series_id);
    setBrandId(model.series?.brand_id || "");
    setBasePrice(model.base_price.toString());
    setDescription(model.description || "");
    setSku(model.sku || "");
    setActive(model.active);
    setThumbnailUrl(model.thumbnail_url || "");
    setOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = modelSchema.safeParse({ 
      name, 
      seriesId, 
      basePrice, 
      description, 
      sku 
    });
    if (!validation.success) {
      const errors = validation.error.errors.map(e => e.message).join(', ');
      toast.error(errors);
      return;
    }

    const fileValidation = validateImageFile(thumbnailFile);
    if (!fileValidation.valid) {
      toast.error(fileValidation.error);
      return;
    }
    
    if (editingModel) {
      updateMutation.mutate();
    } else {
      createMutation.mutate();
    }
  };

  if (!mobileCategory) {
    return <Card><CardContent className="p-6">Loading...</CardContent></Card>;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Mobile Models</CardTitle>
        <Dialog open={open} onOpenChange={(open) => { setOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Model
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingModel ? "Edit Mobile Model" : "Add New Mobile Model"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
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
                  <Label htmlFor="series">Series *</Label>
                  <Select value={seriesId} onValueChange={setSeriesId} required disabled={!brandId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select series" />
                    </SelectTrigger>
                    <SelectContent>
                      {series?.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="name">Model Name *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="basePrice">Base Price (â‚¹) *</Label>
                  <Input
                    id="basePrice"
                    type="number"
                    step="0.01"
                    value={basePrice}
                    onChange={(e) => setBasePrice(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="sku">SKU</Label>
                  <Input
                    id="sku"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="thumbnail">Thumbnail Image</Label>
                <Input
                  id="thumbnail"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
                />
                {thumbnailUrl && !thumbnailFile && (
                  <img src={thumbnailUrl} alt="Current thumbnail" className="mt-2 h-20 object-contain" />
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="active"
                  checked={active}
                  onCheckedChange={setActive}
                />
                <Label htmlFor="active">Active</Label>
              </div>
              <Button type="submit" className="w-full">
                {editingModel ? "Update" : "Create"}
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
                <TableHead>Thumbnail</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Series</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {models?.map((model) => (
                <TableRow key={model.id}>
                  <TableCell>
                    {model.thumbnail_url && (
                      <img src={model.thumbnail_url} alt={model.name} className="h-10 object-contain" />
                    )}
                  </TableCell>
                  <TableCell>{model.name}</TableCell>
                  <TableCell>{model.series?.name}</TableCell>
                  <TableCell>{model.series?.brands?.name}</TableCell>
                  <TableCell>â‚¹{model.base_price}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs ${model.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {model.active ? 'Active' : 'Inactive'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(model)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteMutation.mutate(model.id)}
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