"use client";
import ProductPrice from './ProductPrice';
import QuantitySelect from './QuantitySelect';
import {stockAvailable} from '@/lib/store/stock';
import ProductImage from './ProductImage';
import { productUrl } from '@/lib/store/domain';

import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {useStoreCart} from './StoreCart';
import { useEffect, useRef, useState } from 'react';
import { BadgeCheck, CalendarDays, Check, ChevronRight, Cpu, Heart, HardDrive, MemoryStick, MessagesSquare, ShoppingBag, Truck, Package, Share2, ShieldCheck, Store } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Listing, money, warrantyActive } from '@/lib/store/domain';
import { storeDb, storeError } from '@/lib/store/client';
import ProductGallery from './ProductGallery';
import ProductInformation, { type ProductTab } from './ProductInformation';
import './product-detail.css';

export default function ProductDetail({ id, initialProduct }: { id: string; initialProduct?: Listing }) {
  const router=useRouter(),cart=useStoreCart();
  const actionsRef=useRef<HTMLDivElement>(null);
  const [inlineActionsVisible,setInlineActionsVisible]=useState(false);
  const [quantity,setQuantity]=useState(1);
  const [product, setProduct] = useState<Listing | null>(initialProduct || null);
  const [related, setRelated] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(!initialProduct);
  const [error, setError] = useState('');
  const [tab, setTab] = useState<ProductTab>('Overview');
  const [saved, setSaved] = useState(false);
  const [notice, setNotice] = useState('');
  const [enquiry, setEnquiry] = useState<'buy' | 'question' | null>(null);
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(!initialProduct); setError(''); setProduct(initialProduct || null); setRelated([]); setTab('Overview'); setEnquiry(null); setSent(false);
    try { const ids = JSON.parse(localStorage.getItem('laptap-saved') || '[]'); setSaved(Array.isArray(ids) && ids.includes(id)); } catch { setSaved(false); }
    async function load() {
      try {
        const result = initialProduct ? { data: initialProduct, error: null } : await storeDb.from('marketplace_listings').select('*').is('deleted_at',null).eq('id', id).maybeSingle();
        if (result.error) throw result.error;
        if (!active) return;
        setProduct(result.data); setLoading(false);
        if (result.data) {
          try {
            const suggestions = await storeDb.from('marketplace_listings').select('*').is('deleted_at',null).eq('status', 'published').eq('category', result.data.category).neq('id', id).order('created_at', { ascending: false }).limit(4);
            if (active && !suggestions.error) setRelated(suggestions.data || []);
          } catch { /* Related products must not prevent viewing the selected device. */ }
        }
      } catch { if (active) { setError(storeError); setLoading(false); } }
    }
    load();
    return () => { active = false; };
  }, [id, initialProduct]);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(''), 3500);
    return () => clearTimeout(timer);
  }, [notice]);

  useEffect(()=>{const node=actionsRef.current;if(!node||typeof IntersectionObserver==='undefined')return;const observer=new IntersectionObserver(([entry])=>setInlineActionsVisible(entry.isIntersecting),{threshold:0});observer.observe(node);return()=>observer.disconnect();},[product?.id]);

  function toggleSave() {
    try {
      const stored = JSON.parse(localStorage.getItem('laptap-saved') || '[]');
      const ids: string[] = Array.isArray(stored) ? stored.filter(value => typeof value === 'string') : [];
      const next = !ids.includes(id);
      localStorage.setItem('laptap-saved', JSON.stringify(next ? [...ids, id] : ids.filter(value => value !== id)));
      setSaved(next); setNotice(next ? 'Added to your saved devices' : 'Removed from saved devices');
    } catch { setNotice('Your browser could not save this device.'); }
  }

  async function share() {
    try {
      if (navigator.share) await navigator.share({ title: product?.title, url: window.location.href });
      else { await navigator.clipboard.writeText(window.location.href); setNotice('Product link copied'); }
    } catch (error) { if (!(error instanceof Error && error.name === 'AbortError')) setNotice('Unable to share. Copy the page address from your browser.'); }
  }

  function viewTab(value: ProductTab) {
    setTab(value);
    document.getElementById('product-information')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
  }

  function openEnquiry(type: 'buy' | 'question') {
    if (!product || product.is_demo || product.status !== 'published') return;
    setMessage(''); setEnquiry(type);
  }

  async function inquire(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!product || product.is_demo || product.status !== 'published' || busy) return;
    const data = new FormData(event.currentTarget);
    setBusy(true); setMessage('');
    try {
      const result = await storeDb.from('marketplace_inquiries').insert({ listing_id: id, buyer_name: String(data.get('name')).trim(), email: String(data.get('email')).trim(), phone: String(data.get('phone')).trim(), message: String(data.get('message')).trim() });
      if (result.error) throw result.error;
      setSent(true);
    } catch { setMessage('Your enquiry was not sent. Please try again.'); }
    finally { setBusy(false); }
  }

  if (loading) return <div className="store-wrap pd-loading" aria-busy="true" role="status"><div /><div /><span>Loading device details...</span></div>;
  if (!product || error) return <div className="store-wrap pd-unavailable"><Package size={36} strokeWidth={1.5} /><h1>{error ? 'Unable to load this device' : 'This device is unavailable'}</h1><p>{error || 'The listing may have been removed or is no longer public.'}</p><Link className="pd-primary" href="/store">Back to the store</Link></div>;

  const p = product;
  const title = p.is_demo ? p.title.replace(/^Demo\s*-\s*/i, '') : p.title;
  const available = p.status === 'published' && stockAvailable(p)>0 && !p.is_demo && !!(p.delivery_available||p.pickup_available);
  const officialWarranty = warrantyActive(p.official_warranty_until);

  return <div className="pd-page">
    <div className="store-wrap">
      <div className="pd-topline">
        <nav aria-label="Breadcrumb"><Link href="/store">Store</Link><ChevronRight size={13} /><Link href={`/store/${p.category}`}>{p.category === 'laptop' ? 'Laptops' : 'Desktops'}</Link><ChevronRight size={13} /><span aria-current="page">{title}</span></nav>
        <div className="pd-page-actions"><button onClick={share} aria-label="Share product"><Share2 size={17} /><span>Share</span></button><button onClick={toggleSave} aria-label={saved ? 'Remove from saved devices' : 'Save device'} aria-pressed={saved} className={saved ? 'saved' : ''}><Heart size={18} /><span>{saved ? 'Saved' : 'Save'}</span></button></div>
      </div>
      <div className="pd-main">
        <ProductGallery key={id} product={p} />
        <section className="pd-summary" aria-label="Product summary">
          <div className="pd-brand-row"><span>{p.brand}{p.year&&<> <i /> {p.year} model</>}</span>{p.verified_at && <span className="pd-verified-badge"><BadgeCheck size={14} />Laptap verified</span>}</div>
          <h1>{title}</h1>
          <p className="pd-title-specs">{p.processor} <span>/</span> {p.ram} <span>/</span> {p.storage}</p>
          <div className="pd-price-block"><div className="pd-price"><ProductPrice price={p.price} regularPrice={p.regular_price} showSaving/></div><p>{p.is_demo ? 'Sample price for this demonstration' : 'Price per laptop. Any additional charges are shown at checkout.'}</p></div>
          <div className="pd-configuration" aria-label="Device configuration">
            <div><Cpu size={19} strokeWidth={1.5} /><span>Processor</span><b>{p.processor}</b></div>
            <div><MemoryStick size={19} strokeWidth={1.5} /><span>Memory</span><b>{p.ram}</b></div>
            <div><HardDrive size={19} strokeWidth={1.5} /><span>Storage</span><b>{p.storage}</b></div>
          </div>
          <button className="pd-condition-preview" onClick={() => viewTab('Condition')}><span className="pd-condition-mark"><Check size={17} /></span><span><b>{p.condition} condition</b><small>See wear, battery & repair disclosures</small></span><ChevronRight size={16} /></button>
          <button className="pd-warranty-link" onClick={()=>viewTab('Warranty')}><ShieldCheck size={18}/><span>{p.seller_warranty_months?`${p.seller_warranty_months}-month store warranty`:officialWarranty?'Manufacturer warranty':'Warranty details'}</span><small>View terms</small><ChevronRight size={15}/></button>
          {p.is_demo&&<div className="pd-demo-note"><Package size={16}/><p>Demo listing. Photos, specifications and warranties are examples. This laptop is not for sale.</p></div>}
          <div className="pd-purchase-panel">
            {!p.is_demo&&stockAvailable(p)>1&&<QuantitySelect product={p} value={quantity} onChange={setQuantity}/>}
            <div ref={actionsRef} className="pd-buy-actions"><button className="pd-primary" disabled={!available} onClick={()=>router.push(`/store/checkout?buy=${id}${quantity>1?`&quantity=${quantity}`:''}`)}>Buy Now</button><button className="pd-secondary" disabled={!available||!cart.ready} onClick={()=>cart.add(p,quantity)}><ShoppingBag size={17}/>Add to cart</button></div>
            <div className="pd-purchase-support"><span>{p.delivery_available?<Truck size={16}/>:<Store size={16}/>}{p.delivery_available&&p.pickup_available?'Delivery or store pickup':p.delivery_available?'Cash on delivery':p.pickup_available?'Store pickup ? Pay at store':'Not available to order'}</span><button onClick={()=>openEnquiry('question')} disabled={p.is_demo||p.status!=='published'}><MessagesSquare size={16}/>Ask seller</button></div>
            {!available&&!p.is_demo&&<p className="pd-unavailable-note">{p.status!=='published'||!stockAvailable(p)?'This laptop is currently unavailable.':'Delivery and pickup are not configured yet.'}</p>}
          </div>
          {p.review_status==='approved'&&!p.is_demo&&<details className="pd-review-details"><summary><ShieldCheck size={16}/><span>{p.verified_at?'Laptap inspection recorded':'Listing reviewed by Laptap'}</span><ChevronRight size={14}/></summary><p>{p.verified_at?'Read the recorded findings in the inspection details.': 'Listing approval is complete. Laptap physically inspects each laptop after order confirmation, before fulfilment.'}</p></details>}
          <div className="pd-seller-line"><span className="pd-small-avatar"><Store size={16} /></span><span>Sold by <Link href="/store">{p.seller_name}</Link></span><button onClick={() => viewTab('Store')} aria-label="View seller details"><ChevronRight size={17} /></button></div>
        </section>
      </div>
      <ProductInformation product={p} tab={tab} onTab={setTab} onAsk={() => openEnquiry('question')} />
      {related.length > 0 && <section className="pd-related"><div><h2>More to consider</h2><Link href="/store">Explore the store</Link></div><div className="pd-related-grid">{related.map(item => <Link href={productUrl(item)} key={item.id}><div><ProductImage src={item.images[0]} alt={item.title} sizes="(max-width: 767px) 44vw, 260px"/><span>{item.condition}</span></div><h3>{item.is_demo ? item.title.replace(/^Demo\s*-\s*/i, '') : item.title}</h3><p>{item.ram} / {item.storage}</p><ProductPrice price={item.price} regularPrice={item.regular_price}/></Link>)}</div></section>}
    </div>
    <div className="pd-mobile-purchase" data-inline-visible={inlineActionsVisible}><div><small>{p.is_demo ? 'Demo listing' : available ? p.condition : 'Unavailable'}</small><ProductPrice price={p.price} regularPrice={p.regular_price}/></div><button className="pd-mobile-question" aria-label="Add to cart" disabled={!available||!cart.ready} onClick={() => cart.add(p,quantity)}><ShoppingBag size={20} /></button><button className="pd-primary" disabled={!available} onClick={() => router.push(`/store/checkout?buy=${id}${quantity>1?`&quantity=${quantity}`:''}`)}>Buy Now</button></div>
    {notice && <div className="pd-toast" role="status"><Check size={16} />{notice}</div>}
    <Dialog open={!!enquiry} onOpenChange={open => { if (!open && !busy) setEnquiry(null); }}>
      <DialogContent className="pd-enquiry-dialog" aria-describedby="pd-enquiry-description">
        <DialogTitle>{sent ? 'Enquiry sent' : enquiry === 'buy' ? 'Enquire to buy' : 'Ask the store'}</DialogTitle>
        <DialogDescription id="pd-enquiry-description">{sent ? 'The seller can now review your request and contact you.' : 'Confirm availability and the final total with the seller. No payment is taken here.'}</DialogDescription>
        {sent ? <div className="pd-enquiry-success"><span><Check size={27} /></span><h3>Request received</h3><p>Your enquiry has been saved for {p.seller_name}. The seller can contact you using the details you provided.</p><button className="pd-primary" onClick={() => setEnquiry(null)}>Continue browsing</button></div> : <>
          <div className="pd-enquiry-product"><img src={p.images[0]} alt="" /><div><b>{title}</b><span>{p.condition}{p.year?` / ${p.year}`:''}</span></div><strong>{money(p.price)}</strong></div>
          <form className="store-form" onSubmit={inquire}><div className="store-form-grid"><label>Your name<input name="name" required maxLength={100} autoComplete="name" /></label><label>Email address<input name="email" type="email" required maxLength={200} autoComplete="email" /></label></div><label>Phone number<input name="phone" type="tel" required minLength={7} maxLength={25} autoComplete="tel" /></label><label>Message<textarea name="message" required minLength={10} maxLength={2000} defaultValue={enquiry === 'buy' ? `Hi, I would like to buy the ${title}. Please confirm availability, the final price, and delivery options.` : `Hi, I have a question about the ${title}. Please share more about its condition and warranty.`} /></label><p className="pd-form-privacy">Your contact details will be shared with the store team to respond to your enquiry.</p>{message && <p role="alert" className="store-error">{message}</p>}<button className="pd-primary" disabled={busy}>{busy ? 'Sending...' : 'Send enquiry'}</button></form>
        </>}
      </DialogContent>
    </Dialog>
  </div>;
}
