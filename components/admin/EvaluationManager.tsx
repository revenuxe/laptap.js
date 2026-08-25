"use client";

import { useEffect, useState } from "react";
import { Apple, Monitor, Save } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { EvaluationQuestionBuilder } from "./EvaluationQuestionBuilder";

export function EvaluationManager() {
  const [programs, setPrograms] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  useEffect(() => { (async () => { const [p, b] = await Promise.all([(supabase as any).from("evaluation_programs").select("*").order("platform"), supabase.from("brands").select("id,name").order("name")]); setPrograms(p.data || []); setBrands(b.data || []); if (p.error) toast.error(p.error.message); })(); }, []);
  const update = (id: string, patch: any) => setPrograms(all => all.map(p => p.id === id ? { ...p, ...patch } : p));
  const save = async (p: any) => { const { error } = await (supabase as any).from("evaluation_programs").update({ name: p.name, brand_ids: p.brand_ids, pricing: p.pricing, updated_at: new Date().toISOString() }).eq("id", p.id); error ? toast.error(error.message) : toast.success("Program saved — customer quotes now use these settings"); };
  const Panel = ({ type }: { type: "apple" | "windows" }) => {
    const p = programs.find(x => x.platform === type); if (!p) return <p className="p-5">Loading…</p>;
    const selected = (id: string) => p.brand_ids.includes(id);
    const toggle = (id: string) => update(p.id, { brand_ids: selected(id) ? p.brand_ids.filter((x: string) => x !== id) : [...p.brand_ids, id] });
    const setPrice = (key: string, value: string) => update(p.id, { pricing: { ...p.pricing, [key]: Number(value) } });
    return <div className="space-y-6">
      <Card className="border-primary/25"><CardHeader><CardTitle>{type === "apple" ? "Apple / Mac program" : "Windows program"}</CardTitle><p className="text-sm text-muted-foreground">These brands, questions and prices are completely separate from the other program.</p></CardHeader><CardContent className="space-y-4"><div><Label>Program name</Label><Input value={p.name} onChange={e => update(p.id, { name: e.target.value })} /></div><div><Label>Brands that should see this evaluation</Label><p className="mb-2 text-xs text-muted-foreground">Select as many brands as needed. A brand should belong to only one program.</p><div className="grid grid-cols-2 gap-2 rounded-xl border p-3 sm:grid-cols-3">{brands.map(b => <label key={b.id} className={`flex cursor-pointer items-center gap-2 rounded-lg p-2 ${selected(b.id) ? "bg-primary/10 font-medium" : "hover:bg-muted"}`}><Checkbox checked={selected(b.id)} onCheckedChange={() => toggle(b.id)} />{b.name}</label>)}</div></div></CardContent></Card>
      <Card><CardHeader><CardTitle>Simple offer controls</CardTitle><p className="text-sm text-muted-foreground">Use these to control the quote before individual question deductions.</p></CardHeader><CardContent className="grid gap-4 sm:grid-cols-3"><div><Label>Minimum payout (₹)</Label><Input type="number" value={p.pricing.minimum_payout} onChange={e => setPrice("minimum_payout", e.target.value)} /></div><div><Label>Offer bonus (₹)</Label><Input type="number" value={p.pricing.offer_bonus} onChange={e => setPrice("offer_bonus", e.target.value)} /></div><div><Label>Maximum deduction (%)</Label><Input type="number" value={Number(p.pricing.maximum_discount) * 100} onChange={e => setPrice("maximum_discount", String(Number(e.target.value) / 100))} /></div></CardContent></Card>
      <Card><CardHeader><CardTitle>Build your evaluation questions</CardTitle><p className="text-sm text-muted-foreground">Add unlimited questions. Every answer can have its own percentage deduction, including 0% for information-only answers.</p></CardHeader><CardContent><EvaluationQuestionBuilder programId={p.id} /></CardContent></Card>
      <Button size="lg" onClick={() => save(p)}><Save className="mr-2 h-4 w-4" />Save {type === "apple" ? "Apple / Mac" : "Windows"} program</Button>
    </div>;
  };
  return <div className="space-y-6"><Card className="bg-gradient-to-r from-primary/10 to-background"><CardContent className="p-6"><h2 className="text-xl font-bold">Evaluation programs</h2><p className="text-sm text-muted-foreground">Create different customer evaluations for Apple/Mac and Windows brands.</p></CardContent></Card><Tabs defaultValue="apple"><TabsList className="grid w-full grid-cols-2"><TabsTrigger value="apple"><Apple className="mr-2 h-4 w-4" />Apple / Mac</TabsTrigger><TabsTrigger value="windows"><Monitor className="mr-2 h-4 w-4" />Windows</TabsTrigger></TabsList><TabsContent value="apple"><Panel type="apple" /></TabsContent><TabsContent value="windows"><Panel type="windows" /></TabsContent></Tabs></div>;
}
