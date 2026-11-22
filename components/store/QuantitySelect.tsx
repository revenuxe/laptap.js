"use client";
import {stockAvailable} from '@/lib/store/stock';
import type {Listing} from '@/lib/store/domain';
export default function QuantitySelect({product,value,onChange,disabled}:{product:Listing;value:number;onChange:(value:number)=>void;disabled?:boolean}){const available=stockAvailable(product),maximum=Math.min(8,available);return <label className="cm-quantity">Quantity<select aria-label={`Quantity for ${product.title}`} value={value} disabled={disabled||maximum<1} onChange={e=>onChange(Number(e.target.value))}>{value>maximum&&<option value={value}>{value} - no longer available</option>}{Array.from({length:maximum},(_,i)=>i+1).map(n=><option value={n} key={n}>{n}</option>)}</select><small>{available} available</small></label>;}
