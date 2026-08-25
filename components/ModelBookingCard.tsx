"use client";

import { useState } from "react";
import { CheckCircle2, Copy } from "lucide-react";
import SimpleForm from "@/components/SimpleForm";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function ModelBookingCard({ category, brand, model, modelId }: { category: string; brand: string; model: string; modelId: string }) {
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const whatsapp = `https://wa.me/919886579923?text=${encodeURIComponent(`Hi Laptap, I want to book pickup for my ${brand} ${model}.`)}`;

  if (orderNumber) return <Card className="mx-auto max-w-xl overflow-hidden text-center shadow-lg"><div className="bg-gradient-to-br from-emerald-500 to-green-600 px-6 py-8 text-white"><CheckCircle2 className="mx-auto mb-3 h-14 w-14" /><h2 className="text-2xl font-bold">Thank you for your booking!</h2><p className="mt-2 text-emerald-50">Your pickup request is confirmed.</p></div><div className="p-6"><p className="text-sm text-muted-foreground">Your booking reference</p><div className="mt-2 flex items-center justify-center gap-2"><strong className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-2 font-mono text-lg text-primary">{orderNumber}</strong><Button variant="ghost" size="icon" aria-label="Copy order number" onClick={() => navigator.clipboard.writeText(orderNumber)}><Copy className="h-4 w-4" /></Button></div><div className="mt-6 rounded-xl bg-muted/60 p-4 text-left text-sm"><p className="font-semibold">What happens next?</p><p className="mt-1 text-muted-foreground">Our team will contact you on your mobile number to arrange pickup for your {brand} {model}.</p></div><a href={whatsapp} target="_blank" rel="noreferrer" className="mt-5 block"><Button variant="outline" className="w-full border-[#168a45] text-[#168a45] hover:bg-[#168a45]/5"><img src="/assets/whatsapp.svg" alt="" className="mr-2 h-5 w-5" />Chat on WhatsApp</Button></a></div></Card>;

  return <Card className="mx-auto max-w-xl p-6 text-center"><h2 className="text-2xl font-bold">{brand} {model}</h2><p className="mt-2 text-muted-foreground">Share your details and we’ll arrange a convenient pickup.</p><a href={whatsapp} target="_blank" rel="noreferrer" className="mt-5 block"><Button variant="outline" className="w-full border-[#168a45] text-[#168a45] hover:bg-[#168a45]/5"><img src="/assets/whatsapp.svg" alt="" className="mr-2 h-5 w-5" />Prefer WhatsApp? Chat with us</Button></a><div className="mt-5 text-left"><SimpleForm defaultSellingType={category} defaultModel={`${brand} ${model}`} defaultModelId={modelId} onSuccess={(number) => { if (number) setOrderNumber(number); }} /></div></Card>;
}
