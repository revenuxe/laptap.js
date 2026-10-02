"use client";

import { useState } from "react";
import { CheckCircle2, Copy, ArrowUpRight, Truck, ShieldCheck } from "lucide-react";
import SimpleForm from "@/components/SimpleForm";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function ModelBookingCard({ category, brand, model, modelId, modelImage }: { category: string; brand: string; model: string; modelId: string; modelImage?: string }) {
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [failedImage, setFailedImage] = useState<string | null>(null);
  const fallbackImage = category === "desktop" ? "/assets/sell-desktop-cutout.webp" : "/assets/sell-laptop-cutout.webp";
  const image = modelImage && modelImage !== failedImage ? modelImage : fallbackImage;
  const deviceName = model.toLowerCase().startsWith(brand.toLowerCase()) ? model : `${brand} ${model}`;
  const whatsapp = `https://wa.me/919886579923?text=${encodeURIComponent(`Hi Laptap, I want to book pickup for my ${brand} ${model}.`)}`;

  if (orderNumber) return <Card className="mx-auto max-w-xl overflow-hidden text-center shadow-lg"><div className="bg-gradient-to-br from-emerald-500 to-green-600 px-6 py-8 text-white"><CheckCircle2 className="mx-auto mb-3 h-14 w-14" /><h2 className="text-2xl font-bold">Thank you for your booking!</h2><p className="mt-2 text-emerald-50">Your pickup request is confirmed.</p></div><div className="p-6"><p className="text-sm text-muted-foreground">Your booking reference</p><div className="mt-2 flex items-center justify-center gap-2"><strong className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-2 font-mono text-lg text-primary">{orderNumber}</strong><Button variant="ghost" size="icon" aria-label="Copy order number" onClick={() => navigator.clipboard.writeText(orderNumber)}><Copy className="h-4 w-4" /></Button></div><div className="mt-6 rounded-xl bg-muted/60 p-4 text-left text-sm"><p className="font-semibold">What happens next?</p><p className="mt-1 text-muted-foreground">Our team will contact you on your mobile number to arrange pickup for your {brand} {model}.</p></div><a href={whatsapp} target="_blank" rel="noreferrer" className="mt-5 block"><Button variant="outline" className="w-full border-[#168a45] text-[#168a45] hover:bg-[#168a45]/5"><img src="/assets/whatsapp.svg" alt="" className="mr-2 h-5 w-5" />Chat on WhatsApp</Button></a></div></Card>;

  return (
    <Card className="mx-auto grid max-w-5xl overflow-hidden rounded-3xl border-slate-200/80 bg-white shadow-[0_16px_60px_-24px_rgba(15,23,42,0.2)] md:grid-cols-[0.95fr_1.05fr]">
      <section className="flex flex-col border-b border-slate-200/70 bg-gradient-to-br from-slate-50 to-emerald-50/60 p-6 sm:p-8 md:border-b-0 md:border-r md:p-10">
        <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700"><span className="h-2 w-2 rounded-full bg-emerald-500" />Your selected device</span>
        <div className="my-6 flex items-center gap-4 sm:gap-5">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/90 bg-white/80 p-2 shadow-sm sm:h-28 sm:w-28">
            <img src={image} alt={image === fallbackImage ? `${category} illustration` : deviceName} onError={() => { if (modelImage && image !== fallbackImage) setFailedImage(modelImage); }} className="h-full w-full object-contain drop-shadow-sm" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 sm:text-xs">{category}</p>
            <h2 className="mt-1.5 break-words text-xl font-bold leading-tight tracking-tight text-slate-900 sm:text-2xl">{deviceName}</h2>
            <p className="mt-2 text-xs leading-relaxed text-slate-500 sm:text-sm">Ready for its next chapter. Share your details to arrange a pickup at your doorstep.</p>
          </div>
        </div>
        <div className="mt-6 flex items-center gap-3 border-t border-slate-200/80 pt-6 md:mt-auto"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-700"><Truck className="h-5 w-5" /></span><div><p className="text-sm font-semibold text-slate-800">Free doorstep pickup</p><p className="mt-1 text-xs text-slate-500">Our team will call to arrange a convenient time</p></div></div>
      </section>
      <section className="p-6 sm:p-8 md:p-10">
        <h3 className="text-2xl font-bold tracking-tight text-slate-900">Let’s arrange your pickup</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-500">A few details, and we’ll take it from here.</p>
        <Button asChild variant="outline" className="mt-6 h-12 w-full justify-between rounded-xl border-emerald-200 bg-emerald-50/60 px-4 text-emerald-800 hover:bg-emerald-100 hover:text-emerald-900"><a href={whatsapp} target="_blank" rel="noreferrer"><span className="flex items-center gap-2"><img src="/assets/whatsapp.svg" alt="" className="h-5 w-5" />Chat on WhatsApp</span><ArrowUpRight className="h-4 w-4" /></a></Button>
        <div className="my-6 flex items-center gap-3"><div className="h-px flex-1 bg-slate-200" /><span className="text-xs text-slate-400">or book with your details</span><div className="h-px flex-1 bg-slate-200" /></div>
        <div className="[&_input]:h-12 [&_input]:rounded-xl [&_input]:border-slate-200 [&_input]:bg-slate-50/50 [&_label]:text-sm [&_label]:font-medium [&_button[type=submit]]:mt-6 [&_button[type=submit]]:h-12 [&_button[type=submit]]:rounded-xl [&_button[type=submit]]:font-semibold"><SimpleForm defaultSellingType={category} defaultModel={deviceName} defaultModelId={modelId} onSuccess={(number) => { if (number) setOrderNumber(number); }} /></div>
        <p className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500"><ShieldCheck className="h-4 w-4 shrink-0" />Your details are used to coordinate your pickup.</p>
      </section>
    </Card>
  );
}
