import type { ReactNode } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MobileBottomNav from '@/components/MobileBottomNav';
import WhatsAppFloat from '@/components/WhatsAppFloat';

export default function AreaShell({ children }: { children: ReactNode }) {
  return <div className="reference-home device-landing area-landing min-h-screen flex flex-col"><Header /><main id="main-content" className="flex-1">{children}</main><Footer /><div className="hidden md:block"><WhatsAppFloat /></div><MobileBottomNav /></div>;
}
