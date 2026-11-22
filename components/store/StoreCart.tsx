"use client";
import {createContext,useContext,useEffect,useState} from 'react';
import type {Listing} from '@/lib/store/domain';
import {MAX_CART_ITEMS} from '@/lib/store/commerce-domain';
import {orderQuantity,stockAvailable} from '@/lib/store/stock';
const key='laptap-store-cart-v1',quantityKey='laptap-store-cart-quantities-v1';
type Cart={ids:string[];quantities:Record<string,number>;quantity:(id:string)=>number;setQuantity:(product:Listing,quantity:number)=>void;ready:boolean;add:(product:Listing,quantity?:number)=>boolean;remove:(id:string)=>void;removeMany:(ids:string[])=>void;notice:string;clearNotice:()=>void};
const Context=createContext<Cart|null>(null);
export function StoreCartProvider({children}:{children:React.ReactNode}){
 const [ids,setIds]=useState<string[]>([]),[quantities,setQuantities]=useState<Record<string,number>>({}),[ready,setReady]=useState(false),[notice,setNotice]=useState('');
 useEffect(()=>{function read(){try{const values=JSON.parse(localStorage.getItem(key)||'[]'),q=JSON.parse(localStorage.getItem(quantityKey)||'{}');setIds(Array.isArray(values)?Array.from(new Set(values.filter((v:unknown)=>typeof v==='string'&&/^[a-f0-9-]{36}$/i.test(v)))).slice(0,MAX_CART_ITEMS) as string[]:[]);setQuantities(q&&typeof q==='object'&&!Array.isArray(q)?Object.fromEntries(Object.entries(q).filter(([id])=>/^[a-f0-9-]{36}$/i.test(id)).slice(0,8).map(([id,value])=>[id,orderQuantity(value)])):{});}catch{setIds([]);setQuantities({});}}read();setReady(true);const sync=(e:StorageEvent)=>{if(e.key===key||e.key===quantityKey)read();};window.addEventListener('storage',sync);return()=>window.removeEventListener('storage',sync);},[]);
 useEffect(()=>{if(ready)try{localStorage.setItem(key,JSON.stringify(ids));localStorage.setItem(quantityKey,JSON.stringify(Object.fromEntries(ids.map(id=>[id,quantities[id]||1]))));}catch{setNotice('Your browser cannot save the cart between visits.');}},[ids,quantities,ready]);
 useEffect(()=>{if(notice){const timer=setTimeout(()=>setNotice(''),4000);return()=>clearTimeout(timer);}},[notice]);
 function setQuantity(p:Listing,value:number){const q=orderQuantity(value),other=ids.filter(id=>id!==p.id).reduce((n,id)=>n+(quantities[id]||1),0);if(q>stockAvailable(p)){setNotice('This quantity is no longer available. Refresh your cart.');return;}if(other+q>8){setNotice('You can order up to 8 laptops at a time.');return;}setQuantities(current=>({...current,[p.id]:q}));}
 function add(p:Listing,value=1){if(!ready)return false;const q=orderQuantity(value);if(p.is_demo||p.status!=='published'||!stockAvailable(p)||(!p.pickup_available&&!p.delivery_available)){setNotice('This laptop is not available for checkout.');return false;}if(q>stockAvailable(p)||ids.filter(id=>id!==p.id).reduce((n,id)=>n+(quantities[id]||1),0)+q>8){setNotice('Choose an available quantity, up to 8 laptops per checkout.');return false;}setIds(current=>current.includes(p.id)?current:[...current,p.id]);setQuantities(current=>({...current,[p.id]:q}));setNotice('Added to your cart');return true;}
 return <Context.Provider value={{ids,quantities,quantity:id=>quantities[id]||1,setQuantity,ready,add,remove:id=>setIds(current=>current.filter(v=>v!==id)),removeMany:remove=>setIds(current=>current.filter(v=>!remove.includes(v))),notice,clearNotice:()=>setNotice('')}}>{children}</Context.Provider>;
}
export function useStoreCart(){const value=useContext(Context);if(!value)throw new Error('Store cart provider is required');return value;}
