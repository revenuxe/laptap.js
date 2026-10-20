import Link from 'next/link';
import { ArrowRight, Laptop } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function BlogCTA({ buying = false, compact = false }: { buying?: boolean; compact?: boolean }) {
  return <aside aria-label="Laptop valuation" className={`rounded-2xl bg-primary text-primary-foreground ${compact ? 'p-5' : 'p-7 sm:p-9'}`}>
    <div className={`flex gap-6 ${compact ? 'flex-col' : 'flex-col md:flex-row md:items-center md:justify-between'}`}>
      <div><Laptop className="mb-4 h-7 w-7 text-secondary" /><p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary-foreground/75">Your next step</p><h2 className={`${compact ? 'text-xl' : 'text-2xl sm:text-3xl'} font-bold leading-tight tracking-tight`}>{buying ? 'Upgrading? Start with the laptop you own.' : 'Put your laptop knowledge to work.'}</h2><p className="mt-3 max-w-xl text-sm leading-relaxed text-primary-foreground/85">{buying ? 'Check your current laptop’s value and plan your upgrade budget with a clearer starting point.' : 'Select your model, describe its condition, and begin a valuation with Laptap.'}</p></div>
      <div className={`shrink-0 ${compact ? '' : 'md:max-w-[240px]'}`}><Button variant="cta" asChild className="w-full whitespace-normal"><Link href="/sell/laptop">Check my laptop's value <ArrowRight className="ml-2 h-4 w-4 shrink-0" /></Link></Button><Link href="/contact" className="mt-3 block text-center text-sm text-primary-foreground/85 underline underline-offset-4 hover:text-white">Need help with your model?</Link><p className="mt-4 text-center text-xs leading-relaxed text-primary-foreground/70">Final offers depend on verified specifications and condition.</p></div>
    </div>
  </aside>;
}
