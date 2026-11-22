import type {Metadata} from 'next';
import {Suspense} from 'react';
import BuyerOrders from '@/components/store/BuyerOrders';
export const metadata:Metadata={title:'Order details | Laptap Store',robots:{index:false,follow:false}};
export default async function Page({params}:{params:Promise<{order:string}>}){return <Suspense><BuyerOrders orderId={(await params).order}/></Suspense>;}
