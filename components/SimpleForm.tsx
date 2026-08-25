"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  phone: z.string().trim().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number"),
  pincode: z.string().trim().regex(/^\d{6}$/, "Enter a valid 6-digit pincode").optional().or(z.literal("")),
  selling_type: z.string().min(1, "Please select what you're selling"),
  model: z.string().min(2, "Model must be at least 2 characters"),
});

type FormData = z.infer<typeof formSchema>;

interface SimpleFormProps {
  defaultSellingType?: string | null;
  defaultModel?: string;
  defaultModelId?: string;
  onSuccess?: (orderNumber?: string) => void;
}

const SimpleForm = ({ defaultSellingType, defaultModel, defaultModelId, onSuccess }: SimpleFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const isSellOrder = Boolean(defaultModelId);
  const form = useForm<FormData>({ resolver: zodResolver(formSchema), defaultValues: { name: "", phone: "", pincode: "", selling_type: defaultSellingType || "", model: defaultModel || "" } });

  const onSubmit = async (data: FormData) => {
    if (isSellOrder && !data.pincode) { form.setError("pincode", { message: "Pincode is required for pickup" }); return; }
    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      let orderNumber: string | undefined;
      if (isSellOrder) {
        const { data: order, error } = await supabase.from("sell_requests").insert({
            user_id: user?.id || null,
            model_id: defaultModelId!,
            age_months: 0,
            condition: "good",
            estimated_price: 0,
            pincode: data.pincode || null,
            config: { customer_name: data.name, customer_mobile: data.phone, booking_source: "model_selection" },
          } as any).select("order_number").single();
        if (error) throw error;
        orderNumber = order?.order_number;
      } else {
        const { error } = await supabase.from("simple_forms").insert({ user_id: user?.id || null, name: data.name, phone: data.phone, selling_type: data.selling_type, model: data.model });
        if (error) throw error;
      }
      toast({ title: isSellOrder ? "Pickup request received!" : "Form submitted successfully!", description: "We’ll contact you shortly." });
      form.reset();
      onSuccess?.(orderNumber);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({ title: "Unable to submit", description: "Please try again later.", variant: "destructive" });
    } finally { setIsSubmitting(false); }
  };

  return <Form {...form}><form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4">
    <FormField control={form.control} name="name" render={({ field }) => <FormItem><FormLabel>Your name</FormLabel><FormControl><Input placeholder="Enter your name" autoComplete="name" {...field} /></FormControl><FormMessage /></FormItem>} />
    <FormField control={form.control} name="phone" render={({ field }) => <FormItem><FormLabel>Mobile number</FormLabel><FormControl><Input placeholder="10-digit mobile number" inputMode="numeric" autoComplete="tel" maxLength={10} {...field} /></FormControl><FormMessage /></FormItem>} />
    {isSellOrder && <FormField control={form.control} name="pincode" render={({ field }) => <FormItem><FormLabel>Pincode</FormLabel><FormControl><Input placeholder="6-digit pickup pincode" inputMode="numeric" autoComplete="postal-code" maxLength={6} {...field} /></FormControl><FormMessage /></FormItem>} />}
    <FormField control={form.control} name="selling_type" render={({ field }) => <FormItem><FormLabel>Device type</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select device type" /></SelectTrigger></FormControl><SelectContent><SelectItem value="laptop">Laptop</SelectItem><SelectItem value="desktop">Desktop</SelectItem></SelectContent></Select><FormMessage /></FormItem>} />
    <FormField control={form.control} name="model" render={({ field }) => <FormItem><FormLabel>Model</FormLabel><FormControl><Input placeholder="Device model" readOnly={isSellOrder} {...field} /></FormControl><FormMessage /></FormItem>} />
    <Button type="submit" className="w-full" disabled={isSubmitting}>{isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Submitting…</> : isSellOrder ? "Book free pickup" : "Get quote"}</Button>
  </form></Form>;
};

export default SimpleForm;
