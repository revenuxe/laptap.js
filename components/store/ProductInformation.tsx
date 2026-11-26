"use client";

import Link from 'next/link';
import { useRef } from 'react';
import { BadgeCheck, BatteryMedium, Box, CalendarDays, CircleHelp, MapPin, ShieldCheck, Store, Wrench } from 'lucide-react';
import type { Listing } from '@/lib/store/domain';
import { warrantyActive } from '@/lib/store/domain';

export const productTabs = ['Overview', 'Specifications', 'Condition', 'Warranty', 'Store'] as const;
export type ProductTab = typeof productTabs[number];

export default function ProductInformation({ product: p, tab, onTab, onAsk }: {
  product: Listing; tab: ProductTab; onTab: (tab: ProductTab) => void; onAsk: () => void;
}) {
  const buttons = useRef<Array<HTMLButtonElement | null>>([]);
  const specs = [
    ['Brand', p.brand], ['Model year', p.year?String(p.year):'Not provided'], ['Processor', p.processor], ['Memory', p.ram],
    ['Storage', p.storage], ['Graphics', p.graphics], ['Display', p.display], ['Battery / power', p.battery],
    ['Condition', p.condition], ['Device type', p.category === 'laptop' ? 'Laptop' : 'Desktop'],
  ];
  const warrantyDate = p.official_warranty_until ? new Date(p.official_warranty_until + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : null;

  return <section className="pd-information" id="product-information">
    <div className="pd-tab-list" role="tablist" aria-label="Product details">
      {productTabs.map((label, index) => <button key={label} ref={button => { buttons.current[index] = button; }} role="tab" id={`pd-tab-${label}`} aria-controls="pd-tab-panel" aria-selected={tab === label} tabIndex={tab === label ? 0 : -1} onClick={() => onTab(label)}
        onKeyDown={event => {
          let next = index;
          if (event.key === 'ArrowRight') next = (index + 1) % productTabs.length;
          else if (event.key === 'ArrowLeft') next = (index + productTabs.length - 1) % productTabs.length;
          else if (event.key === 'Home') next = 0;
          else if (event.key === 'End') next = productTabs.length - 1;
          else return;
          event.preventDefault(); onTab(productTabs[next]); buttons.current[next]?.focus();
        }}>{label}</button>)}
    </div>
    <div className="pd-tab-panel" id="pd-tab-panel" role="tabpanel" aria-labelledby={`pd-tab-${tab}`} tabIndex={0}>
      {tab === 'Overview' && <div className="pd-overview-layout">
        <div><h2>About this {p.category}</h2><p className="pd-description">{p.description}</p>
          <div className="pd-box-contents"><span><Box size={23} strokeWidth={1.5} /></span><div><h3>What's included</h3><p>{p.accessories || 'Ask the store which accessories are included.'}</p></div></div>
        </div>
        <aside className="pd-inspection-card"><BadgeCheck size={27} strokeWidth={1.5} /><h3>{p.verified_at ? 'Laptap verified' : 'Know the inspection status'}</h3><p>{p.verified_at ? `Inspection recorded on ${new Date(p.verified_at).toLocaleDateString('en-IN')}.` : 'No Laptap inspection has been recorded for this device. Condition and specifications are recorded by the store.'}</p>{p.verified_at && <p className="pd-inspection-notes">{p.verification_notes}</p>}<button onClick={() => onTab('Condition')}>View condition details</button></aside>
      </div>}
      {tab === 'Specifications' && <><div className="pd-section-title"><h2>Technical specifications</h2><p>Specifications for this exact listing.</p></div><dl className="pd-specifications">{specs.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value || 'Not specified'}</dd></div>)}</dl></>}
      {tab === 'Condition' && <><div className="pd-section-title"><h2>Device condition</h2><p>Read the disclosures and inspect the photos before making your choice.</p></div><div className="pd-condition-layout"><div className="pd-grade-card"><span>Condition</span><strong>{p.condition}</strong><p>Recorded by the store</p><div className="pd-condition-scale">{['Fair', 'Good', 'Excellent', 'Like new'].map(grade => <i key={grade} className={p.condition === grade ? 'selected' : ''} />)}</div><div className="pd-scale-labels"><span>More wear</span><span>Less wear</span></div></div><div className="pd-condition-notes"><article><Wrench size={20} /><div><h3>Wear, repairs & known issues</h3><p>{p.defects}</p></div></article><article><BatteryMedium size={20} /><div><h3>Battery & power</h3><p>{p.battery || 'Not specified. Ask the store for battery details.'}</p></div></article></div></div><div className={`pd-inspection-strip ${p.verified_at ? 'verified' : ''}`}><BadgeCheck size={23} /><div><h3>{p.verified_at ? 'Laptap inspection record' : 'Not Laptap verified'}</h3><p>{p.verified_at ? `${new Date(p.verified_at).toLocaleDateString('en-IN')} - ${p.verification_notes}` : 'This device has no recorded Laptap inspection. Ask the store about an inspection before agreeing to buy.'}</p></div></div></>}
      {tab === 'Warranty' && <><div className="pd-section-title"><h2>Warranty coverage</h2><p>Manufacturer coverage and seller coverage are separate.</p></div><div className="pd-warranty-cards"><article><CalendarDays size={27} strokeWidth={1.5} /><h3>Official warranty</h3><strong>{warrantyActive(p.official_warranty_until) ? 'Coverage declared' : p.official_warranty_until ? 'Coverage expired' : 'Not declared'}</strong><p>{warrantyDate ? `Seller-declared end date: ${warrantyDate}.` : 'The seller has not declared manufacturer warranty coverage.'}</p><small>Request the invoice and confirm coverage with the manufacturer.</small></article><article><ShieldCheck size={27} strokeWidth={1.5} /><h3>Store warranty</h3><strong>{p.seller_warranty_months ? `${p.seller_warranty_months} months` : 'Not included'}</strong><p>{p.seller_warranty_months ? `Provided by ${p.seller_name}.` : 'No store warranty has been offered.'}</p><small>{p.warranty_terms || 'No additional warranty terms provided.'}</small></article></div>{p.is_demo && <p className="pd-disclosure">This is a demo listing. Warranty information is illustrative and no coverage applies.</p>}</>}
      {tab === 'Store' && <div className="pd-seller-layout"><div className="pd-seller-profile"><div className="pd-seller-avatar"><Store size={29} strokeWidth={1.5} /></div><h2>{p.seller_name}</h2><p><MapPin size={15} />{p.location}</p><Link href="/store">View store collection</Link></div><div className="pd-seller-contact"><h3>Ask before you buy.</h3><p>Confirm the device's availability, condition, warranty terms, final price, and delivery arrangements with the store.</p><button className="pd-secondary" onClick={onAsk} disabled={p.is_demo || p.status !== 'published'}>Ask the store</button><p className="pd-disclosure">{p.is_demo ? 'Messages are disabled for this demonstration listing.' : 'Your contact details are shared with the store team when you submit an enquiry.'}</p></div></div>}
    </div>
    <div className="pd-help-strip"><CircleHelp size={21} /><span>Need a hand finding the right device?</span><Link href="/contact">Talk to Laptap</Link></div>
  </section>;
}
