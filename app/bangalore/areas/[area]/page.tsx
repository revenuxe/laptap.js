import SellingGuides from "@/components/SellingGuides";
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, Check, ChevronRight, ClipboardCheck, MapPin, ShieldCheck } from 'lucide-react';
import AreaShell from '@/components/areas/AreaShell';
import SimpleFormCard from '@/components/areas/SimpleFormCard';
import { DeviceSearch } from '@/components/DeviceSearch';
import { areas, findArea, areaUrl, areaWhatsApp } from '@/lib/areas';

type Props = { params: Promise<{ area: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return areas.map(area => ({ area: area.slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const area = findArea((await params).area);
  if (!area) return {};
  const title = `Sell Used Laptop & Desktop in ${area.name}, Bangalore`;
  const description = `Sell your used laptop or desktop in ${area.name}. Explore device selection, assessment, preparation, and pickup checks by pincode with Laptap.`;
  return { title, description, alternates: { canonical: `https://www.laptap.in${areaUrl(area.slug)}` }, openGraph: { title, description, url: `https://www.laptap.in${areaUrl(area.slug)}`, type: 'website' } };
}

export default async function AreaPage({ params }: Props) {
  const area = findArea((await params).area);
  if (!area) notFound();
  const whatsapp = areaWhatsApp(area.name);
  const faqs = [
    [`How do I sell a laptop in ${area.name}?`, 'Select your brand and model, share the processor, RAM, storage, and condition, then provide your contact details and pincode. The team will discuss assessment and collection availability before you confirm a pickup.'],
    [`Can you collect a desktop from ${area.name}?`, 'Share the model, form factor, configuration, full address, and pincode. List the monitor and peripherals separately. Collection options are confirmed by the team before arrangements are made.'],
    ['Can I sell a damaged or older computer?', 'Describe the faults, repair history, and whether it powers on. The team can discuss whether an assessment is possible. Acceptance and any offer depend on the actual device and its condition.'],
    ['Is an online estimate the final price?', 'No. An initial estimate depends on the details you share. The final offer follows verification of the configuration and condition. Review and agree to the price and payment arrangements before completing the handover.'],
    ['What should I do with my data?', 'Create and verify your own backup. When you are ready to proceed, sign out of personal accounts and remove linked device locks. Do not share account passwords. Resolve any organization management through the authorized owner.'],
  ];
  const crumbs = [['Home', '/'], ['Bangalore', '/bangalore'], ['All areas', '/bangalore/areas'], [area.name, areaUrl(area.slug)]];
  const schema = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'BreadcrumbList', itemListElement: crumbs.map(([name, url], index) => ({ '@type': 'ListItem', position: index + 1, name, item: `https://www.laptap.in${url}` })) },
    { '@type': 'FAQPage', mainEntity: faqs.map(([question, answer]) => ({ '@type': 'Question', name: question, acceptedAnswer: { '@type': 'Answer', text: answer } })) },
    { '@type': 'Service', name: `Used laptop and desktop assessment in ${area.name}`, serviceType: 'Used computer buyback assessment', areaServed: { '@type': 'Place', name: `${area.name}, Bangalore` }, provider: { '@type': 'Organization', name: 'Laptap', url: 'https://www.laptap.in' }, url: `https://www.laptap.in${areaUrl(area.slug)}` },
  ] };
  const actions = <div className="landing-actions"><Link href="/sell/laptop" className="landing-primary">Sell my laptop <ArrowRight /></Link><a href={whatsapp} target="_blank" rel="noopener noreferrer" className="landing-secondary"><img src="/assets/whatsapp.svg" alt="" />Ask on WhatsApp</a></div>;
  const nearby = [...areas.slice(areas.indexOf(area) + 1), ...areas.slice(0, areas.indexOf(area))].slice(0, 6);
  return <AreaShell>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />
    <section className="landing-hero area-hero"><div className="landing-container">
      <nav className="landing-breadcrumb" aria-label="Breadcrumb">{crumbs.map(([name, url], index) => <span key={url}>{index > 0 && <ChevronRight aria-hidden="true" />}{index === crumbs.length - 1 ? <span aria-current="page">{name}</span> : <Link href={url}>{name}</Link>}</span>)}</nav>
      <div className="area-heading"><h1>Sell laptop or desktop<span>in {area.name}.</span></h1><p>{area.intro}</p></div>
      <div className="area-device-search"><DeviceSearch referenceStyle /></div>
      {actions}
      <div className="landing-assurances"><span><ClipboardCheck />Model-specific assessment</span><span><MapPin />Pickup checked by pincode</span><span><ShieldCheck />Clear handover steps</span></div>
      <div className="area-service-cards">{[
        ['Sell Laptops', 'Choose your brand and model', '/sell/laptop', '/assets/sell-laptop-cutout.webp'],
        ['Sell Desktops', 'Towers, compact PCs, and all-in-ones', '/sell/desktop', '/assets/sell-desktop-cutout.webp'],
        ['Repair Laptops', 'Explore repair and service options', '/repair', '/assets/repair-laptop-cutout.webp'],
      ].map(([name, text, href, image]) => <Link href={href} className="area-service-card" key={href}><div><img src={image} alt="" /></div><h2>{name}</h2><p>{text}</p><span>Get started <ArrowRight /></span></Link>)}<SimpleFormCard /></div>
    </div></section>

    <section className="landing-section landing-container landing-value-grid"><div><h2>Selling your used computer in {area.name}</h2><p>A useful assessment starts with the device you actually own. The model name is only part of the picture: processor generation, memory, storage, graphics, and condition can change the discussion.</p><p>Use the device catalog to choose the closest exact match. If a model is missing or you are unsure about a specification, ask our team before selecting a different computer. You can share a photo of the model label without exposing personal information.</p><ul className="landing-checks">{['Laptop brands including Apple, Dell, HP, Lenovo, ASUS, and Acer', 'Desktop towers, compact computers, and all-in-one systems', 'Configuration and condition reviewed before any final agreement'].map(text => <li key={text}><Check />{text}</li>)}</ul></div><aside className="landing-prepare"><h2>Plan your {area.name} pickup</h2><p>{area.pickup}</p><p>Send your complete address and pincode to check collection availability. Confirm the time, contact person, and agreed accessories before preparing for handover.</p><a href={whatsapp} target="_blank" rel="noopener noreferrer" className="landing-text-link">Check pickup for my address <ArrowRight /></a></aside></section>

    <section className="landing-process landing-section"><div className="landing-container"><h2>How to sell a laptop or desktop in {area.name}</h2><div className="landing-step-grid">{[
      ['Choose the device you own', 'Select the category, brand, and exact model. Note the processor, RAM, storage, graphics, and any faults so the assessment starts with accurate details.'],
      ['Discuss assessment and collection', `Share your ${area.name} address and pincode. Review the device details, ask questions, and confirm collection availability before agreeing to a pickup.`],
      ['Prepare and complete the handover', 'Back up your files, remove personal accounts when ready, and keep agreed accessories together. Confirm the final assessment and payment arrangements before completing the sale.'],
    ].map(([title, text], index) => <article className="landing-step" key={title}><div><span>0{index + 1}</span><ClipboardCheck /></div><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>

    <section className="landing-section landing-container"><article className="landing-advice"><h2>What affects your laptop or desktop resale value?</h2><p>Two computers with similar names can have different specifications. Include the processor or Apple chip, RAM, SSD or hard drive capacity, screen size, and dedicated graphics where fitted. For gaming systems, the GPU and charger details are useful; for desktops, list each included peripheral separately.</p><p>Be clear about screen damage, battery life, charging issues, keyboard faults, startup problems, previous repairs, and missing parts. An initial estimate is not a final offer. Any agreed price depends on the actual configuration and condition verified during the assessment.</p><div className="landing-actions"><Link href="/sell/desktop" className="landing-primary">Choose my desktop <ArrowRight /></Link><a href={whatsapp} target="_blank" rel="noopener noreferrer" className="landing-secondary">Get help identifying my device</a></div></article></section>

    <section className="landing-section landing-container"><div className="landing-cta"><span className="landing-eyebrow">YOUR NEXT STEP STARTS HERE</span><h2>Ready to sell in {area.name}?</h2><p>Have your model number, configuration, and pincode ready. Choose your laptop or ask our team to help with device details and collection.</p>{actions}<p className="landing-small">Keep your model number, charger details, and pickup pincode handy.</p></div></section>

    <section className="landing-section landing-container landing-faq"><h2>Selling in {area.name}: your questions</h2>{faqs.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</section>
    <section className="landing-section landing-container"><h2>Explore more Bangalore area guides</h2><div className="area-more-links">{nearby.map(item => <Link key={item.slug} href={areaUrl(item.slug)}><MapPin />{item.name}<ArrowRight /></Link>)}</div><Link href="/bangalore/areas" className="landing-text-link">Browse all {areas.length} areas <ArrowRight /></Link></section>
    <SellingGuides />
  </AreaShell>;
}
