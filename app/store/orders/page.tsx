import type {Metadata} from 'next';
import {Suspense} from 'react';
import BuyerOrders from '@/components/store/BuyerOrders';
export const metadata:Metadata={title:'My orders | Laptap Store',robots:{index:false,follow:false}};
export default function Page(){return <Suspense><BuyerOrders/></Suspense>;}
