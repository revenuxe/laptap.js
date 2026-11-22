import Link from 'next/link';
import {Suspense} from 'react';
import {ChevronRight} from 'lucide-react';
import {storeCategories,type StoreCategory} from '@/lib/store/category-domain';
import {getStoreCategoryProducts} from '@/lib/store/server';
import {productUrl} from '@/lib/store/domain';
import Catalog from './Catalog';
export default async function CategoryLanding({category}:{category:StoreCategory}){
 const c=storeCategories[category],products=await getStoreCategoryProducts(category).catch(()=>undefined),url=`https://www.laptap.in/store/${category}`;
 const indexed=(products||[]).slice(0,24).filter(p=>!p.is_demo);
 const schema={'@context':'https://schema.org','@graph':[{'@type':'CollectionPage','@id':url,url,name:c.title,description:c.description,mainEntity:{'@type':'ItemList',itemListElement:indexed.map((p,index)=>({'@type':'ListItem',position:index+1,url:`https://www.laptap.in${productUrl(p)}`,name:p.title}))}},{'@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Store',item:'https://www.laptap.in/store'},{'@type':'ListItem',position:2,name:c.label,item:url}]}]};
 return <><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema).replace(/</g,'\\u003c')}}/><div className={`store-wrap sc-category-page sc-category-${category}`}><nav className="sc-category-breadcrumb" aria-label="Breadcrumb"><Link href="/store">Store</Link><ChevronRight size={13}/><span aria-current="page">{c.label}</span></nav><header className="sc-category-heading"><h1>{c.title}</h1></header></div><Suspense><Catalog key={category} initialCategory={category} initialProducts={products}/></Suspense><section className="store-wrap sc-category-guide"><div><h2>{c.guideTitle}</h2><p>{c.guide}</p><Link href="/store/help">Delivery & shopping help<ChevronRight size={15}/></Link></div><div className="sc-category-faq"><h2>Shopping for {c.label.toLowerCase()}</h2>{c.faq.map(([question,answer])=><details key={question}><summary>{question}<ChevronRight size={15}/></summary><p>{answer}</p></details>)}</div></section></>;
}
