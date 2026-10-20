"use client";
import SellingGuides from "@/components/SellingGuides";

import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Check, ChevronRight, ClipboardCheck, Laptop, MapPin, Monitor, PackageCheck } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MobileBottomNav from '@/components/MobileBottomNav';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import AreasWeService from '@/components/AreasWeService';
import { landingContent } from './content';

export default function DeviceLanding({ contentKey }: { contentKey: string }) {
  const content = landingContent[contentKey];
  const { name, desktop, brand, families, advice, condition, description } = content;
  const choose = `/sell/${desktop ? 'desktop' : 'laptop'}${brand ? `/${brand}` : ''}`;
  const whatsapp = `https://wa.me/919886579923?text=${encodeURIComponent(`Hi Laptap, I would like to sell my ${name}. Can you help with the model, assessment, and pickup availability?`)}`;
  const DeviceIcon = desktop ? Monitor : Laptop;
  const pagePath = contentKey === 'bangalore' ? '/bangalore' : contentKey.startsWith('bangalore-') ? `/bangalore/${contentKey.slice(10)}` : ['asus-rog', 'acer-predator'].includes(contentKey) ? `/gaming/${contentKey}` : `/models/${contentKey}`;
  const pageUrl = `https://www.laptap.in${pagePath}`;
  const pageSchema = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.laptap.in/' },
      { '@type': 'ListItem', position: 2, name: desktop ? 'Sell Desktop' : 'Sell Laptop', item: `https://www.laptap.in${choose}` },
      { '@type': 'ListItem', position: 3, name, item: pageUrl },
    ] },
    { '@type': 'Service', name: `${name} assessment in Bangalore`, serviceType: 'Used computer buyback assessment', url: pageUrl, areaServed: { '@type': 'City', name: 'Bangalore' }, provider: { '@type': 'Organization', name: 'Laptap', url: 'https://www.laptap.in/' } },
  ] };
  const guideKeys = Object.keys(landingContent);
  const guideIndex = guideKeys.indexOf(contentKey);
  const moreGuides = [...guideKeys.slice(guideIndex + 1), ...guideKeys.slice(0, guideIndex)].slice(0, 4);
  const steps = [
    ['Tell us about your device', 'Select the model and keep its configuration and condition notes ready. Share your contact details and pickup pincode.', DeviceIcon],
    ['Review the details together', 'Our team will discuss the device, assessment, and collection availability. Confirm any questions before agreeing to a pickup.', ClipboardCheck],
    ['Confirm pickup and payment', 'Back up your files and prepare the device. Review the final assessment and agreed payment details before completing the handover.', PackageCheck],
  ] as const;
  const actions = (label = 'Choose my device') => <div className="landing-actions"><Link className="landing-primary" href={choose}>{label}<ArrowRight aria-hidden="true" /></Link><a className="landing-secondary" href={whatsapp} target="_blank" rel="noopener noreferrer"><img src="/assets/whatsapp.svg" alt="" />Ask on WhatsApp</a></div>;

  return <div className="reference-home device-landing min-h-screen flex flex-col">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema).replace(/</g, '\\u003c') }} />
    <Header />
    <main id="main-content" className="flex-1">
      <section className="landing-hero">
        <div className="landing-container">
          <nav className="landing-breadcrumb" aria-label="Breadcrumb"><Link href="/">Home</Link><ChevronRight aria-hidden="true" /><Link href={choose}>{desktop ? 'Sell Desktop' : 'Sell Laptop'}</Link><ChevronRight aria-hidden="true" /><span aria-current="page">{name}</span></nav>
          <div className="landing-hero-grid">
            <div>
              <h1>Sell your {name.replace(/ Laptop$/, '')}<span>in Bangalore.</span></h1>
              <p className="landing-intro">{description}</p>
              {actions()}
              <div className="landing-assurances"><span><ClipboardCheck />Model-specific assessment</span><span><MapPin />Pickup by pincode</span></div>
            </div>
            <Link href={choose} className="landing-device-card" aria-label={`Choose your ${name}`}>
              <div className="landing-card-caption"><span><DeviceIcon />Your next upgrade starts here</span><ArrowUpRight /></div>
              <div className="landing-device-image"><img src={desktop ? '/assets/sell-desktop-cutout.webp' : '/assets/sell-laptop-cutout.webp'} alt={`${desktop ? 'Desktop computer' : 'Laptop'} illustration`} /></div>
              <div className="landing-device-name"><h2>Your {name}</h2><span><PackageCheck /></span></div>
              <ol className="landing-mini-steps">{['Select model', 'Share details', 'Confirm pickup'].map((step, index) => <li key={step}><b>{index + 1}</b>{step}</li>)}</ol>
            </Link>
          </div>
        </div>
      </section>

      <section className="landing-section landing-container">
        <h2>Explore {name} models</h2>
        <p>These families are a starting guide. Check the catalog for your exact model and current availability.</p>
        <div className="landing-models">{families.map(([family, detail]) => <Link key={family} href={contentKey === 'bangalore' && family === 'Desktops' ? '/sell/desktop' : choose} className="landing-model"><div><span className="landing-icon"><DeviceIcon /></span><ArrowUpRight /></div><h3>{family}</h3><p>{detail}</p><span className="landing-model-action">Find your model <ArrowRight /></span></Link>)}</div>
        <p className="landing-model-help">Can’t find your model? <a href={whatsapp} target="_blank" rel="noopener noreferrer">Ask our team before choosing a different device.</a></p>
        <article className="landing-advice"><h2>What to share about your {name}</h2><p>{advice}</p><p>{condition}</p></article>
      </section>

      <section className="landing-process landing-section"><div className="landing-container">
        <h2>How to sell your {name}</h2>
        <div className="landing-step-grid">{steps.map(([title, text, Icon], index) => <article className="landing-step" key={title}><div><span>0{index + 1}</span><Icon /></div><h3>{title}</h3><p>{text}</p></article>)}</div>
      </div></section>

      <section className="landing-section landing-container landing-value-grid">
        <div><h2>What affects your {name} resale value?</h2><p>Two devices from the same range can have very different resale values. The exact configuration and working condition matter more than the name alone.</p><ul className="landing-checks">{['Processor generation, RAM, and storage capacity', 'Display, keyboard, battery, and charging condition', 'Age, repairs, accessories, and overall wear'].map(text => <li key={text}><Check />{text}</li>)}</ul><p className="landing-small">An initial estimate is not a final offer. Any agreed price depends on the actual device and assessment.</p></div>
        <aside className="landing-prepare"><h2>Prepare your device before selling</h2><ol>{['Back up photos, files, and anything you want to keep.', 'Sign out of personal accounts and remove linked device locks when you are ready to hand over.', 'Keep the charger and agreed accessories ready. Confirm the final assessment and payment before handover.'].map((text, index) => <li key={text}><span>{index + 1}</span>{text}</li>)}</ol></aside>
      </section>

      <section className="landing-section landing-container"><div className="landing-cta"><span className="landing-eyebrow">READY FOR THE NEXT STEP?</span><h2>Make room for your next upgrade.</h2><p>Choose your {name} to get started, or send the details on WhatsApp if you need help identifying it.</p>{actions('Start with my device')}<p className="landing-small">Have the model number, configuration, and pickup pincode handy.</p></div></section>

      {contentKey === 'bangalore' && <AreasWeService city="Bangalore" areas={['Koramangala', 'Indiranagar', 'Whitefield', 'Electronic City', 'HSR Layout', 'Marathahalli', 'BTM Layout', 'Jayanagar', 'JP Nagar', 'Banashankari', 'Malleshwaram', 'Rajajinagar', 'Yelahanka', 'Hebbal', 'Bellandur', 'Sarjapur Road', 'Bommanahalli', 'Bannerghatta Road', 'RT Nagar', 'Sadashivanagar', 'CV Raman Nagar', 'Frazer Town', 'Domlur', 'KR Puram', 'Mahadevapura', 'Varthur', 'Kadugodi', 'Brookefield']} />}

      <section className="landing-section landing-container landing-faq"><h2>Your questions, answered</h2>{[
        [`How do I identify my ${name}?`, advice],
        ['Can I sell a device with damage or repairs?', 'Share the faults and repair history before booking. Our team can discuss whether your device can be assessed. Acceptance and any offer depend on the actual device and condition.'],
        ['Is pickup available in my area?', 'Share your Bangalore pincode with our team to confirm coverage and collection availability before making arrangements.'],
        ['When is the price confirmed?', 'The final offer follows verification of the device, configuration, and condition. Review and agree to the price and payment arrangements before completing the sale.'],
      ].map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}<a className="landing-text-link" href={whatsapp} target="_blank" rel="noopener noreferrer">Still have a question? Chat with our team <ArrowUpRight /></a></section>
      <section className="landing-section landing-container"><h2>Explore more device guides</h2><div className="area-more-links">{moreGuides.map(key => <Link key={key} href={key === 'bangalore' ? '/bangalore' : key.startsWith('bangalore-') ? `/bangalore/${key.slice(10)}` : ['asus-rog', 'acer-predator'].includes(key) ? `/gaming/${key}` : `/models/${key}`}>{landingContent[key].name}<ArrowUpRight aria-hidden="true" /></Link>)}</div></section>
      <SellingGuides />
    </main>
    <Footer />
    <div className="hidden md:block"><WhatsAppFloat /></div>
    <MobileBottomNav />
  </div>;
}
