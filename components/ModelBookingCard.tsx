import SimpleForm from "@/components/SimpleForm";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function ModelBookingCard({ category, brand, model }: { category: string; brand: string; model: string }) {
  const whatsapp = `https://wa.me/919886579923?text=${encodeURIComponent(`Hi Laptap, I want to book pickup for my ${brand} ${model}.`)}`;

  return <Card className="mx-auto max-w-xl p-6 text-center">
    <h2 className="text-2xl font-bold">{brand} {model}</h2>
    <p className="mt-2 text-muted-foreground">Share your details and we’ll arrange a convenient pickup.</p>
    <div className="mt-5 text-left"><SimpleForm defaultSellingType={category} defaultModel={`${brand} ${model}`} /></div>
    <a href={whatsapp} target="_blank" rel="noreferrer" className="mt-5 block">
      <Button variant="outline" className="w-full border-[#168a45] text-[#168a45] hover:bg-[#168a45]/5"><img src="/assets/whatsapp.svg" alt="" className="mr-2 h-5 w-5" />Prefer WhatsApp? Chat with us</Button>
    </a>
  </Card>;
}
