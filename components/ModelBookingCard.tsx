"use client";
import { useRouter } from "next/navigation";
import { LogIn, UserPlus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import SimpleForm from "@/components/SimpleForm";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
export function ModelBookingCard({ category, brand, model, path }: { category: string; brand: string; model: string; path: string }) {
 const { user } = useAuth(); const router = useRouter(); const whatsapp=`https://wa.me/919886579923?text=${encodeURIComponent(`Hi Laptap, I want to book pickup for my ${brand} ${model}.`)}`; const auth=`/auth?redirect=${encodeURIComponent(path)}`;
 return <Card className="mx-auto max-w-xl p-6 text-center"><h2 className="text-2xl font-bold">{brand} {model}</h2>{user?<div className="mt-5 text-left"><p className="mb-4 text-center text-muted-foreground">Book pickup for your selected device.</p><SimpleForm defaultSellingType={category} defaultModel={`${brand} ${model}`}/></div>:<><p className="mt-2 text-muted-foreground">Continue on WhatsApp, or sign in to complete your booking.</p><a href={whatsapp} target="_blank" rel="noreferrer" className="mt-5 block"><Button className="w-full bg-[#168a45] text-white hover:bg-[#116b35]"><img src="/assets/whatsapp.svg" alt="" className="mr-2 h-5 w-5"/>Continue on WhatsApp</Button></a><div className="my-5 text-xs text-muted-foreground">OR</div><div className="grid gap-3 sm:grid-cols-2"><Button variant="outline" onClick={()=>router.push(auth)}><LogIn className="mr-2 h-4 w-4"/>Log in</Button><Button onClick={()=>router.push(auth)}><UserPlus className="mr-2 h-4 w-4"/>Sign up</Button></div></>}</Card>
}
