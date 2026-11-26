import {money} from '@/lib/store/domain';
import {priceReduction} from '@/lib/store/pricing';
import './product-price.css';
export default function ProductPrice({price,regularPrice,showSaving=false,showDiscount=true}:{price:number;regularPrice?:number|null;showSaving?:boolean;showDiscount?:boolean}){
 const reduction=priceReduction(price,regularPrice);
 return <div className="product-price"><div className="product-price-line"><strong>{money(price)}</strong>{reduction&&<><del aria-label={`Regular price ${money(reduction.regularPrice)}`}>{money(reduction.regularPrice)}</del>{showDiscount&&reduction.percent>0&&<span className="product-price-discount">{reduction.percent}% off</span>}</>}</div>{showSaving&&reduction&&<span className="product-price-saving"><span className="product-price-saving-mark" aria-hidden="true">✓</span><span>You save <b>{money(reduction.saving)}</b><small>Compared with the listed regular price</small></span></span>}</div>;
}

export function ProductDiscountBadge({price,regularPrice}:{price:number;regularPrice?:number|null}){const reduction=priceReduction(price,regularPrice);return reduction&&reduction.percent>0?<span className="product-price-discount store-photo-discount">{reduction.percent}% off</span>:null;}

export function ProductPriceDiscount({price,regularPrice}:{price:number;regularPrice?:number|null}){const reduction=priceReduction(price,regularPrice);return reduction&&reduction.percent>0?<span className="product-price-discount">{reduction.percent}% off</span>:null;}
