import type {Metadata} from 'next';
import {Suspense} from 'react';
import BuyerAccount from '@/components/store/BuyerAccount';
export const metadata:Metadata={title:'Your account | Laptap Store',robots:{index:false,follow:false}};
export default function Page(){return <div className="cm-page cm-account-page"><Suspense><BuyerAccount/></Suspense></div>;}
