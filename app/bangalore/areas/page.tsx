import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, ChevronRight } from 'lucide-react';
import AreaShell from '@/components/areas/AreaShell';
import AreaDirectory from '@/components/areas/AreaDirectory';
import { areas, areaUrl, areaWhatsApp } from '@/lib/areas';

export const metadata: Metadata = {
  title: 'Sell Laptop & Desktop in Bangalore | Browse All Areas',
  description: 'Explore 28 Bangalore area guides for selling used laptops and desktops. Find your locality, prepare your device, and check pickup availability by pincode.',
  alternates: { canonical: 'https://www.laptap.in/bangalore/areas' },
  openGraph: { title: { absolute: 'Find your Bangalore area | Laptap' }, description: 'Local laptop and desktop selling guides, device preparation, and collection checks by pincode.', url: 'https://www.laptap.in/bangalore/areas' },
};

export default function AreasPage() {
  const schema = { '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Bangalore laptop and desktop selling areas', url: 'https://www.laptap.in/bangalore/areas', mainEntity: { '@type': 'ItemList', itemListElement: areas.map((area, index) => ({ '@type': 'ListItem', position: index + 1, name: area.name, url: `https://www.laptap.in${areaUrl(area.slug)}` })) } };
  return <AreaShell>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />
    <section className="landing-hero area-hub-hero"><div className="landing-container">
      <nav className="landing-breadcrumb" aria-label="Breadcrumb"><Link href="/">Home</Link><ChevronRight /><Link href="/bangalore">Bangalore</Link><ChevronRight /><span aria-current="page">All areas</span></nav>
      <div className="area-heading"><span className="landing-eyebrow">FIND YOUR LOCAL SELLING GUIDE</span><h1>Sell your laptop or desktop<span>across Bangalore.</span></h1><p>Find your area, explore the steps, and choose the device you want to sell. Collection availability is checked using your complete address and pincode.</p><a href="#all-areas" className="landing-primary">Browse all {areas.length} areas <ArrowRight /></a></div>
    </div></section>
    <section className="landing-section landing-container" id="all-areas"><h2>Choose your Bangalore area</h2><p>Each guide covers device details, preparation, assessment, and the next steps for collection. Start with the locality that matches your address.</p><AreaDirectory /></section>
    <section className="landing-section landing-container"><div className="landing-advice"><h2>One clear process, wherever you are in Bangalore</h2><p>Choose your laptop or desktop, share its configuration and condition, and provide your pincode. The team can then discuss assessment and collection availability. Your area guide helps you prepare; a listed locality does not guarantee a particular pickup slot.</p><p>Don’t see your locality? Send your full area name and pincode so we can check. You can also start with device selection while you confirm collection arrangements.</p><div className="landing-actions"><Link href="/sell/laptop" className="landing-primary">Choose my laptop <ArrowRight /></Link><a href={areaWhatsApp('Bangalore')} target="_blank" rel="noopener noreferrer" className="landing-secondary">Check my pincode</a></div></div></section>
  </AreaShell>;
}
