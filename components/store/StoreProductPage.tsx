import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import ProductDetail from '@/components/store/ProductDetail';
import { getStoreProduct } from '@/lib/store/server';
import { money, productUrl } from '@/lib/store/domain';
type Props = { path: string };
export async function generateProductMetadata({ path }: Props): Promise<Metadata> {
 const p = await getStoreProduct(path.replace(/^laptop\//, ''));
 if (!p) return { title: 'Product unavailable', robots: { index: false, follow: false } };
 const name = p.title.replace(/^Demo\s*-\s*/i, '');
 const title = `${name} - ${p.condition} ${p.category} | Laptap Store`;
 const description = `Buy a pre-owned ${name} for ${money(p.price)}. ${p.processor}, ${p.ram}, ${p.storage}. ${p.condition} condition. Review photos, specifications and warranty details on Laptap Store.`.replace(/\s+/g, ' ').slice(0, 165);
 const url = `https://www.laptap.in${productUrl(p)}`;
 return { title: { absolute: title }, description, alternates: { canonical: url }, robots: { index: !p.is_demo, follow: true }, openGraph: { title, description, url, type: 'website', images: p.images.slice(0, 1).map(image => ({ url: image, alt: name })) }, twitter: { card: 'summary_large_image', title, description, images: p.images.slice(0, 1) } };
}
export default async function StoreProductPage({ path }: Props) {
 const lookupPath = path.replace(/^laptop\//, ''); const p = await getStoreProduct(lookupPath);
 if (!p) {
  if (/^[0-9a-f-]{36}$/i.test(lookupPath)) return <ProductDetail id={lookupPath}/>;
  notFound();
 }
 if (`/store/${path}` !== productUrl(p)) permanentRedirect(productUrl(p));
 const schema = { '@context': 'https://schema.org', '@type': 'Product', name: p.title.replace(/^Demo\s*-\s*/i, ''), description: p.description, image: p.images.map(src => new URL(src, 'https://www.laptap.in').href), brand: { '@type': 'Brand', name: p.brand }, ...(p.is_demo ? {} : { offers: { '@type': 'Offer', url: `https://www.laptap.in${productUrl(p)}`, priceCurrency: 'INR', price: p.price, itemCondition: 'https://schema.org/UsedCondition', availability: p.status === 'published' ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock', seller: { '@type': 'Organization', name: p.seller_name } } }) };
 return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }}/><ProductDetail id={p.id} initialProduct={p}/></>;
}
