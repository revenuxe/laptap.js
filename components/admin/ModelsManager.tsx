"use client";

import { useState, useEffect } from "react";
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
import { Pencil, Trash2, Plus, Laptop } from "lucide-react";
import { toast } from "sonner";

export function ModelsManager() {
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

  // Top bar filter state
  const [filterBrandId, setFilterBrandId] = useState<string>("all");
  const [filterSeriesId, setFilterSeriesId] = useState<string>("all");

  const queryClient = useQueryClient();

  const { data: brands } = useQuery({
    queryKey: ["brands"],
    queryFn: async () => {
      const { data, error } = await supabase.from("brands").select("*").order("name");
      if (error) throw error;
      return data;
    },
  });

  // Series for Dialog form (based on dialog brandId)
  const { data: seriesForForm } = useQuery({
    queryKey: ["series-form", brandId],
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

  // Series for top filter dropdown (based on filterBrandId)
  const { data: seriesForFilter } = useQuery({
    queryKey: ["series-filter", filterBrandId],
    queryFn: async () => {
      if (!filterBrandId || filterBrandId === "all") return [];
      const { data, error } = await supabase
        .from("series")
        .select("*")
        .eq("brand_id", filterBrandId)
        .order("name");
      if (error) throw error;
      return data;
    },
    enabled: !!filterBrandId && filterBrandId !== "all",
  });

  const { data: models, isLoading } = useQuery({
    queryKey: ["models"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("models")
        .select("*, series(id, name, brand_id, brands(id, name))")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  // Auto-set default filter brand to first brand if available and set to 'all'
  useEffect(() => {
    if (brands && brands.length > 0 && filterBrandId === "all") {
      setFilterBrandId(brands[0].id);
    }
  }, [brands]);

  // Filter models based on selected brand & series
  const filteredModels = (models || []).filter((model) => {
    const modelBrandId = model.series?.brands?.id || model.series?.brand_id;
    if (filterBrandId && filterBrandId !== "all" && modelBrandId !== filterBrandId) {
      return false;
    }
    if (filterSeriesId && filterSeriesId !== "all" && model.series_id !== filterSeriesId) {
      return false;
    }
    return true;
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
      const { error } = await supabase
        .from("models")
        .update({ active })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["models"] });
      toast.success("Model status updated");
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
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
      queryClient.invalidateQueries({ queryKey: ["models"] });
      toast.success("Model created successfully");
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
      queryClient.invalidateQueries({ queryKey: ["models"] });
      toast.success("Model updated successfully");
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
      queryClient.invalidateQueries({ queryKey: ["models"] });
      toast.success("Model deleted successfully");
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

  const handleOpenAddModal = () => {
    resetForm();
    if (filterBrandId && filterBrandId !== "all") {
      setBrandId(filterBrandId);
    }
    if (filterSeriesId && filterSeriesId !== "all") {
      setSeriesId(filterSeriesId);
    }
    setOpen(true);
  };

  const handleEdit = (model: any) => {
    setEditingModel(model);
    setName(model.name);
    setSeriesId(model.series_id);
    setBrandId(model.series?.brands?.id || model.series?.brand_id || "");
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

  return (
    <div className="space-y-6">
      {/* Filters & Add Button Header Bar matching screenshot */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Brand Selector */}
          <Select 
            value={filterBrandId} 
            onValueChange={(val) => {
              setFilterBrandId(val);
              setFilterSeriesId("all");
            }}
          >
            <SelectTrigger className="w-[160px] sm:w-[180px] h-10 rounded-2xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-sm font-medium shadow-sm">
              <SelectValue placeholder="Select brand" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Brands</SelectItem>
              {brands?.map((brand) => (
                <SelectItem key={brand.id} value={brand.id}>
                  {brand.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Series Selector */}
          <Select 
            value={filterSeriesId} 
            onValueChange={setFilterSeriesId}
            disabled={!filterBrandId || filterBrandId === "all"}
          >
            <SelectTrigger className="w-[160px] sm:w-[180px] h-10 rounded-2xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-sm font-medium shadow-sm">
              <SelectValue placeholder="Select series" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Series</SelectItem>
              {seriesForFilter?.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Add Model Button */}
        <Button 
          onClick={handleOpenAddModal}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-2xl h-10 px-5 text-sm shadow-sm transition-all flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add model
        </Button>

        {/* Add/Edit Model Dialog */}
        <Dialog open={open} onOpenChange={(val) => { setOpen(val); if (!val) resetForm(); }}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl">
            <DialogHeader>
              <DialogTitle>{editingModel ? "Edit Model" : "Add New Model"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="brand">Brand *</Label>
                  <Select value={brandId} onValueChange={setBrandId} required>
                    <SelectTrigger className="rounded-xl">
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
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="Select series" />
                    </SelectTrigger>
                    <SelectContent>
                      {seriesForForm?.map((s) => (
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
                  className="rounded-xl"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="basePrice">Base Price (₹) *</Label>
                  <Input
                    id="basePrice"
                    type="number"
                    step="0.01"
                    value={basePrice}
                    onChange={(e) => setBasePrice(e.target.value)}
                    className="rounded-xl"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="sku">SKU</Label>
                  <Input
                    id="sku"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="rounded-xl"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="rounded-xl"
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
                  className="rounded-xl"
                />
                {thumbnailUrl && !thumbnailFile && (
                  <img src={thumbnailUrl} alt="Current thumbnail" className="mt-2 h-20 object-contain rounded-lg" />
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="active"
                  checked={active}
                  onCheckedChange={setActive}
                  className="data-[state=checked]:bg-blue-600"
                />
                <Label htmlFor="active">Active</Label>
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
                {editingModel ? "Update" : "Create"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Model Cards List matching screenshot */}
      {isLoading ? (
        <div className="p-8 text-center text-muted-foreground">Loading models...</div>
      ) : filteredModels.length === 0 ? (
        <div className="p-12 text-center border-2 border-dashed rounded-2xl border-slate-200 dark:border-slate-800">
          <Laptop className="h-10 w-10 mx-auto text-slate-400 mb-3" />
          <p className="text-base font-semibold text-slate-700 dark:text-slate-300 mb-1">No models found</p>
          <p className="text-xs text-slate-500 mb-4">Try selecting a different brand or series, or add a new model.</p>
          <Button onClick={handleOpenAddModal} size="sm" className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
            <Plus className="h-4 w-4 mr-1.5" />
            Add Model
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredModels.map((model) => (
            <div
              key={model.id}
              className="flex items-center justify-between p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-all duration-200"
            >
              {/* Left side: Thumbnail & Info */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-700/50 flex items-center justify-center p-1.5 flex-shrink-0 overflow-hidden">
                  {model.thumbnail_url ? (
                    <img 
                      src={model.thumbnail_url} 
                      alt={model.name} 
                      className="w-full h-full object-contain" 
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <Laptop className="h-6 w-6 text-slate-400" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-sm sm:text-base text-slate-900 dark:text-slate-100">
                    {model.name}
                  </h3>
                  <p className="text-xs sm:text-sm font-semibold text-blue-600 dark:text-blue-400 mt-0.5">
                    ₹{model.base_price != null ? Number(model.base_price).toLocaleString('en-IN') : '0'}
                  </p>
                </div>
              </div>

              {/* Right side: Active toggle, Edit, Delete */}
              <div className="flex items-center gap-3">
                <Switch
                  checked={Boolean(model.active)}
                  onCheckedChange={(checked) =>
                    toggleActiveMutation.mutate({ id: model.id, active: checked })
                  }
                  className="data-[state=checked]:bg-blue-600"
                />
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800 rounded-lg"
                  onClick={() => handleEdit(model)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg"
                  onClick={() => deleteMutation.mutate(model.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
