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

  const [filterBrandId, setFilterBrandId] = useState<string>("all");

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
        .select("*, brands(id, name)")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  const filteredSeries = (series || []).filter((s) => {
    if (filterBrandId && filterBrandId !== "all" && s.brand_id !== filterBrandId) {
      return false;
    }
    return true;
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

  const handleOpenAddModal = () => {
    resetForm();
    if (filterBrandId && filterBrandId !== "all") {
      setBrandId(filterBrandId);
    }
    setOpen(true);
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
    
    const validation = seriesSchema.safeParse({ name, brandId });
    if (!validation.success) {
      const errors = validation.error.errors.map(e => e.message).join(', ');
      toast.error(errors);
      return;
    }

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
    <div className="space-y-6">
      {/* Filters & Add Button Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Select value={filterBrandId} onValueChange={setFilterBrandId}>
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
        </div>

        <Button 
          onClick={handleOpenAddModal}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-2xl h-10 px-5 text-sm shadow-sm transition-all flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add series
        </Button>

        <Dialog open={open} onOpenChange={(val) => { setOpen(val); if (!val) resetForm(); }}>
          <DialogContent className="rounded-2xl">
            <DialogHeader>
              <DialogTitle>{editingSeries ? "Edit Series" : "Add New Series"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                <Label htmlFor="name">Series Name *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="rounded-xl"
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
                  className="rounded-xl"
                />
                {imageUrl && !imageFile && (
                  <img src={imageUrl} alt="Current image" className="mt-2 h-20 object-contain rounded-lg" />
                )}
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
                {editingSeries ? "Update" : "Create"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Series Cards List */}
      {isLoading ? (
        <div className="p-8 text-center text-muted-foreground">Loading series...</div>
      ) : filteredSeries.length === 0 ? (
        <div className="p-12 text-center border-2 border-dashed rounded-2xl border-slate-200 dark:border-slate-800">
          <p className="text-base font-semibold text-slate-700 dark:text-slate-300 mb-1">No series found</p>
          <p className="text-xs text-slate-500 mb-4">Try selecting a different brand or add a new series.</p>
          <Button onClick={handleOpenAddModal} size="sm" className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
            <Plus className="h-4 w-4 mr-1.5" />
            Add Series
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredSeries.map((s) => (
            <div
              key={s.id}
              className="flex items-center justify-between p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-700/50 flex items-center justify-center p-1.5 flex-shrink-0 overflow-hidden">
                  {s.image_url ? (
                    <img 
                      src={s.image_url} 
                      alt={s.name} 
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <span className="text-xs font-bold text-slate-400 uppercase">{s.name.slice(0, 2)}</span>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-sm sm:text-base text-slate-900 dark:text-slate-100">
                    {s.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {s.brands?.name || 'Unknown Brand'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800 rounded-lg"
                  onClick={() => handleEdit(s)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg"
                  onClick={() => deleteMutation.mutate(s.id)}
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
