"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Tag, Headset, LayoutGrid } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet";

export default function MobileBottomNav() {
  const pathname = usePathname();
  return (
    <nav className="mobile-bottom-nav md:hidden" aria-label="Mobile navigation">
      <Link href="/" className={`mobile-nav-item${pathname === '/' ? ' is-active' : ''}`} aria-current={pathname === '/' ? 'page' : undefined}><Home /><span>Home</span></Link>
      <Link href="/sell/laptop" className={`mobile-nav-item${pathname.startsWith('/sell') ? ' is-active' : ''}`} aria-current={pathname.startsWith('/sell') ? 'page' : undefined}><Tag /><span>Sell Device</span></Link>
      <a href="https://wa.me/919886579923?text=Hi!%20I%20want%20to%20sell%20my%20device." target="_blank" rel="noopener noreferrer" className="mobile-nav-item mobile-nav-whatsapp"><span className="whatsapp-raised"><img src="/assets/whatsapp.svg" alt="" /></span><span>WhatsApp</span></a>
      <Link href="/contact" className={`mobile-nav-item${pathname === '/contact' ? ' is-active' : ''}`} aria-current={pathname === '/contact' ? 'page' : undefined}><Headset /><span>Contact</span></Link>
      <Sheet>
        <SheetTrigger className="mobile-nav-item"><LayoutGrid /><span>Menu</span></SheetTrigger>
        <SheetContent side="bottom" className="rounded-t-3xl pb-10">
          <SheetHeader><SheetTitle>Explore Laptap</SheetTitle></SheetHeader>
          <div className="mt-5 grid grid-cols-2 gap-3">
            {[['/sell/laptop', 'Sell Laptop'], ['/sell/desktop', 'Sell Desktop'], ['/bangalore/areas', 'Browse All Areas'], ['/repair', 'Repair'], ['/about', 'About'], ['/blog', 'Blog'], ['/contact', 'Contact']].map(([href, label]) => <SheetClose asChild key={href}><Link href={href} className="rounded-xl border p-4 text-center hover:bg-muted">{label}</Link></SheetClose>)}
          </div>
        </SheetContent>
      </Sheet>
    </nav>
  );
}
