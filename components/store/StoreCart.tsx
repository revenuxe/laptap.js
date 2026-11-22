"use client";
import {createContext,useContext,useEffect,useState} from 'react';
import type {Listing} from '@/lib/store/domain';
import {MAX_CART_ITEMS} from '@/lib/store/commerce-domain';
const key='laptap-store-cart-v1';
type Cart={ids:string[];ready:boolean;add:(product:Listing)=>boolean;remove:(id:string)=>void;removeMany:(ids:string[])=>void;notice:string;clearNotice:()=>void};
const Context=createContext<Cart|null>(null);
export function StoreCartProvider({children}:{children:React.ReactNode}){
 const [ids,setIds]=useState<string[]>([]),[ready,setReady]=useState(false),[notice,setNotice]=useState('');
 useEffect(()=>{function read(){try{const values=JSON.parse(localStorage.getItem(key)||'[]');setIds(Array.isArray(values)?Array.from(new Set(values.filter((v:unknown)=>typeof v==='string'&&/^[a-f0-9-]{36}$/i.test(v)))).slice(0,MAX_CART_ITEMS) as string[]:[]);}catch{setIds([]);}}read();setReady(true);const sync=(e:StorageEvent)=>{if(e.key===key)read();};window.addEventListener('storage',sync);return()=>window.removeEventListener('storage',sync);},[]);
 useEffect(()=>{if(ready)try{localStorage.setItem(key,JSON.stringify(ids));}catch{setNotice('Your browser cannot save the cart between visits.');}},[ids,ready]);
 useEffect(()=>{if(notice){const timer=setTimeout(()=>setNotice(''),4000);return()=>clearTimeout(timer);}},[notice]);
 function add(p:Listing){if(!ready)return false;if(p.is_demo||p.status!=='published'||(!p.pickup_available&&!p.delivery_available)){setNotice('This device is not available for checkout.');return false;}if(ids.includes(p.id)){setNotice('This device is already in your cart.');return true;}if(ids.length>=MAX_CART_ITEMS){setNotice(`You can checkout up to ${MAX_CART_ITEMS} individual devices at a time.`);return false;}setIds(current=>current.includes(p.id)?current:[...current,p.id]);setNotice('Added to your cart');return true;}
 return <Context.Provider value={{ids,ready,add,remove:id=>setIds(current=>current.filter(v=>v!==id)),removeMany:remove=>setIds(current=>current.filter(v=>!remove.includes(v))),notice,clearNotice:()=>setNotice('')}}>{children}</Context.Provider>;
}
export function useStoreCart(){const value=useContext(Context);if(!value)throw new Error('Store cart provider is required');return value;}
