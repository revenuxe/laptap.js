"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Tag, Headset, Store } from "lucide-react";

export default function MobileBottomNav() {
  const pathname = usePathname();
  return (
    <nav className="mobile-bottom-nav md:hidden" aria-label="Mobile navigation">
      <Link href="/" className={`mobile-nav-item${pathname === '/' ? ' is-active' : ''}`} aria-current={pathname === '/' ? 'page' : undefined}><Home /><span>Home</span></Link>
      <Link href="/sell/laptop" className={`mobile-nav-item${pathname.startsWith('/sell') ? ' is-active' : ''}`} aria-current={pathname.startsWith('/sell') ? 'page' : undefined}><Tag /><span>Sell Device</span></Link>
      <a href="/contact" target="_blank" rel="noopener noreferrer" className="mobile-nav-item mobile-nav-whatsapp"><span className="whatsapp-raised"><img src="/assets/whatsapp.svg" alt="" /></span><span>Offline</span></a>
      <Link href="/contact" className={`mobile-nav-item${pathname === '/contact' ? ' is-active' : ''}`} aria-current={pathname === '/contact' ? 'page' : undefined}><Headset /><span>Contact</span></Link>
      <Link href="/store" className={`mobile-nav-item${pathname.startsWith('/store') ? ' is-active' : ''}`} aria-current={pathname.startsWith('/store') ? 'page' : undefined}><Store /><span>Store</span></Link>
    </nav>
  );
}
