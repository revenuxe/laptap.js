import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const guides = [
  ['/blog/prepare-laptop-for-sale', 'Prepare your laptop for sale', 'Backups, accounts, accessories, and a clear handover checklist.'],
  ['/blog/how-to-get-highest-resale-value-for-laptop', 'Understand your laptop’s resale value', 'Compare offers using the same specifications and condition.'],
  ['/blog/best-place-to-sell-used-laptop-bangalore', 'Compare ways to sell in Bangalore', 'Weigh collection, direct buyers, and local shop options.'],
];

export default function SellingGuides() {
  return <section className="landing-section landing-container selling-guides"><h2>Helpful guides before you sell</h2><p>Know what to prepare and what to ask before choosing your next step.</p><div className="landing-step-grid">{guides.map(([href, title, text]) => <Link href={href} className="landing-step" key={href}><h3>{title}</h3><p>{text}</p><span className="landing-text-link">Read this guide <ArrowRight aria-hidden="true" /></span></Link>)}</div><Link href="/blog" className="landing-text-link">Explore all laptop guides <ArrowRight aria-hidden="true" /></Link></section>;
}
