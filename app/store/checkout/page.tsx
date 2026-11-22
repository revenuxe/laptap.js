import type {Metadata} from 'next';
import {Suspense} from 'react';
import Checkout from '@/components/store/Checkout';
export const metadata:Metadata={title:'Checkout | Laptap Store',robots:{index:false,follow:false}};
export default function Page(){return <Suspense fallback={<div className="cm-loading">Preparing checkout…</div>}><Checkout/></Suspense>;}
