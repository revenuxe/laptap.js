import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { brandSchema, validateImageFile } from "@/lib/validationSchemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Pencil, Trash2, Plus, Upload } from "lucide-react";
import { toast } from "sonner";

export function BrandsManager() {
  const [open, setOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<any>(null);
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoUrl, setLogoUrl] = useState("");
  const queryClient = useQueryClient();

  const { data: brands, isLoading } = useQuery({
    queryKey: ["brands"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("brands")
        .select("*")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  const uploadImage = async (file: File, brandId: string) => {
    const fileExt = file.name.split(".").pop();
    const filePath = `${brandId}-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("brand-logos")
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from("brand-logos")
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const createMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase
        .from("brands")
        .insert({ name, country, logo_url: logoUrl })
        .select()
        .single();

      if (error) throw error;

      if (logoFile) {
        const url = await uploadImage(logoFile, data.id);
        const { error: updateError } = await supabase
          .from("brands")
          .update({ logo_url: url })
          .eq("id", data.id);
        if (updateError) throw updateError;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brands"] });
      toast.success("Brand created successfully");
      resetForm();
      setOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async () => {
      let finalLogoUrl = logoUrl;

      if (logoFile) {
        finalLogoUrl = await uploadImage(logoFile, editingBrand.id);
      }

      const { error } = await supabase
        .from("brands")
        .update({ name, country, logo_url: finalLogoUrl })
        .eq("id", editingBrand.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brands"] });
      toast.success("Brand updated successfully");
      resetForm();
      setOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("brands").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brands"] });
      toast.success("Brand deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const resetForm = () => {
    setName("");
    setCountry("");
    setLogoFile(null);
    setLogoUrl("");
    setEditingBrand(null);
  };

  const handleEdit = (brand: any) => {
    setEditingBrand(brand);
    setName(brand.name);
    setCountry(brand.country || "");
    setLogoUrl(brand.logo_url || "");
    setOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs
    const validation = brandSchema.safeParse({ name, country });
    if (!validation.success) {
      const errors = validation.error.errors.map(e => e.message).join(', ');
      toast.error(errors);
      return;
    }

    // Validate image file
    const fileValidation = validateImageFile(logoFile);
    if (!fileValidation.valid) {
      toast.error(fileValidation.error);
      return;
    }
    
    if (editingBrand) {
      updateMutation.mutate();
    } else {
      createMutation.mutate();
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Brands</CardTitle>
        <Dialog open={open} onOpenChange={(open) => { setOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Brand
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingBrand ? "Edit Brand" : "Add New Brand"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Brand Name *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="logo">Logo Image</Label>
                <Input
                  id="logo"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                />
                {logoUrl && !logoFile && (
                  <img src={logoUrl} alt="Current logo" className="mt-2 h-20 object-contain" />
                )}
              </div>
              <Button type="submit" className="w-full">
                {editingBrand ? "Update" : "Create"}
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
                <TableHead>Logo</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Country</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {brands?.map((brand) => (
                <TableRow key={brand.id}>
                  <TableCell>
                    {brand.logo_url && (
                      <img src={brand.logo_url} alt={brand.name} className="h-10 object-contain" />
                    )}
                  </TableCell>
                  <TableCell>{brand.name}</TableCell>
                  <TableCell>{brand.country || "-"}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(brand)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteMutation.mutate(brand.id)}
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
