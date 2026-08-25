"use client";

import { ClipboardCheck, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface Props { category: "laptop" | "desktop"; onEvaluate: () => void; onForm: () => void; }

export function SellMethodSelector({ category, onEvaluate, onForm }: Props) {
  const url = `https://wa.me/919886579923?text=${encodeURIComponent(`Hi! I want to sell my ${category}.`)}`;
  return <div className="mx-auto max-w-2xl space-y-4 md:space-y-6">
    <div className="text-center"><h2 className="text-xl font-bold md:text-2xl">Choose your selling method</h2><p className="mt-1 text-sm text-muted-foreground">Pick the option that works best for you</p></div>
    <a href={url} target="_blank" rel="noreferrer" className="block">
      <Card className="group relative overflow-hidden border-2 border-green-500/30 transition-all hover:border-[#25D366] hover:shadow-lg">
        <span className="absolute right-3 top-3 rounded-full bg-[#25D366] px-2 py-0.5 text-[10px] font-bold text-white">RECOMMENDED</span>
        <div className="flex flex-col items-center gap-4 p-5 sm:flex-row sm:gap-6 sm:p-7">
          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-[#25D366]/10 transition group-hover:bg-[#25D366]/20"><img src="/assets/whatsapp.svg" alt="WhatsApp" className="h-10 w-10" /></div>
          <div className="flex-1 text-center sm:text-left"><h3 className="text-lg font-bold">Sell through WhatsApp</h3><p className="text-sm font-medium text-[#25D366]">Instant response · Fastest way to sell</p><p className="mt-1 text-xs text-muted-foreground">Chat directly with our team and get help booking your pickup.</p></div>
          <Button className="w-full bg-[#25D366] font-semibold hover:bg-[#20BA5A] sm:w-auto">Chat now</Button>
        </div>
      </Card>
    </a>
    <div className="grid grid-cols-2 gap-3 md:gap-4">
      <Card onClick={onEvaluate} className="group cursor-pointer border-2 p-4 text-center transition hover:border-primary hover:shadow-lg md:p-6"><div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/20"><ClipboardCheck className="h-7 w-7 text-primary" /></div><h3 className="text-sm font-bold md:text-lg">Select your device</h3><p className="mt-1 text-[11px] text-muted-foreground md:text-xs">Choose your brand, series and model</p><Button className="mt-4 w-full" size="sm">Select device</Button></Card>
      <Card onClick={onForm} className="group cursor-pointer border-2 p-4 text-center transition hover:border-primary hover:shadow-lg md:p-6"><div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/20"><FileText className="h-7 w-7 text-primary" /></div><h3 className="text-sm font-bold md:text-lg">Simple form</h3><p className="mt-1 text-[11px] text-muted-foreground md:text-xs">Submit details and we’ll call you</p><Button variant="outline" className="mt-4 w-full" size="sm">Fill form</Button></Card>
    </div>
  </div>;
}
