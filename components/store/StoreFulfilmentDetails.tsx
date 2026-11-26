"use client";
import {useEffect,useState} from 'react';
import {storeDb} from '@/lib/store/client';
import type {StoreSettings} from '@/lib/store/settings';
export default function StoreFulfilmentDetails(){
 const [settings,setSettings]=useState<StoreSettings|null>(null);
 useEffect(()=>{let active=true;storeDb.from('store_settings').select('*').single().then(({data})=>{if(active&&data)setSettings(data);});return()=>{active=false;};},[]);
 if(!settings?.owner_id)return null;
 return <section className="cm-panel mb-6"><h2>Pickup & delivery information</h2>{settings.pickup_available&&<div><h3>Collect from {settings.name}</h3><p>{settings.address}</p>{settings.pickup_hours&&<p>Opening hours: {settings.pickup_hours}</p>}{settings.pickup_instructions&&<p className="whitespace-pre-wrap">{settings.pickup_instructions}</p>}</div>}{settings.delivery_available&&<div><h3>Home delivery</h3><p>{settings.delivery_fee?`Delivery: ₹${settings.delivery_fee} per laptop`:'Free delivery'}{settings.delivery_estimate?` · ${settings.delivery_estimate}`:''}</p><p>Enter your pincode at checkout to confirm availability.</p>{settings.delivery_terms&&<p className="whitespace-pre-wrap">{settings.delivery_terms}</p>}</div>}</section>;
}
