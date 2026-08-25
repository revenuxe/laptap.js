"use client";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Mail, Phone } from "lucide-react";
import { format } from "date-fns";

type SimpleForm = { id: string; name: string; phone: string; selling_type: string; model: string; status: string; created_at: string };
type ContactForm = { id: string; name: string; email: string; phone: string | null; message: string; created_at: string };

const FormsTab = () => {
  const { data: simpleForms = [], isLoading: loadingSimple } = useQuery({ queryKey: ["simple-forms"], queryFn: async () => { const { data, error } = await supabase.from("simple_forms").select("*").order("created_at", { ascending: false }); if (error) throw error; return data as SimpleForm[]; } });
  const { data: contactForms = [], isLoading: loadingContacts } = useQuery({ queryKey: ["contact-submissions"], queryFn: async () => { const { data, error } = await (supabase as any).from("contact_submissions").select("*").order("created_at", { ascending: false }); if (error) throw error; return data as ContactForm[]; } });

  if (loadingSimple || loadingContacts) return <div className="flex justify-center py-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  return <div className="space-y-5"><div><h2 className="text-2xl font-bold">Customer forms</h2><p className="text-muted-foreground">Contact messages and quick callback requests.</p></div><Tabs defaultValue="contact" className="space-y-4"><TabsList><TabsTrigger value="contact">Contact us <Badge variant="secondary" className="ml-2">{contactForms.length}</Badge></TabsTrigger><TabsTrigger value="callbacks">Quick callbacks <Badge variant="secondary" className="ml-2">{simpleForms.length}</Badge></TabsTrigger></TabsList><TabsContent value="contact"><Card className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Phone</TableHead><TableHead>Message</TableHead></TableRow></TableHeader><TableBody>{contactForms.length ? contactForms.map((form) => <TableRow key={form.id}><TableCell>{format(new Date(form.created_at), "MMM dd, yyyy")}</TableCell><TableCell className="font-medium">{form.name}</TableCell><TableCell><a className="inline-flex items-center gap-1 text-primary hover:underline" href={`mailto:${form.email}`}><Mail className="h-3.5 w-3.5" />{form.email}</a></TableCell><TableCell>{form.phone ? <a className="inline-flex items-center gap-1" href={`tel:${form.phone}`}><Phone className="h-3.5 w-3.5" />{form.phone}</a> : "—"}</TableCell><TableCell className="max-w-sm whitespace-normal">{form.message}</TableCell></TableRow>) : <TableRow><TableCell colSpan={5} className="py-8 text-center text-muted-foreground">No contact messages yet</TableCell></TableRow>}</TableBody></Table></Card></TabsContent><TabsContent value="callbacks"><Card className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Name</TableHead><TableHead>Phone</TableHead><TableHead>Device</TableHead><TableHead>Model</TableHead></TableRow></TableHeader><TableBody>{simpleForms.length ? simpleForms.map((form) => <TableRow key={form.id}><TableCell>{format(new Date(form.created_at), "MMM dd, yyyy")}</TableCell><TableCell className="font-medium">{form.name}</TableCell><TableCell><a href={`tel:${form.phone}`} className="inline-flex items-center gap-1"><Phone className="h-3.5 w-3.5" />{form.phone}</a></TableCell><TableCell className="capitalize">{form.selling_type}</TableCell><TableCell>{form.model}</TableCell></TableRow>) : <TableRow><TableCell colSpan={5} className="py-8 text-center text-muted-foreground">No callback forms yet</TableCell></TableRow>}</TableBody></Table></Card></TabsContent></Tabs></div>;
};

export default FormsTab;
