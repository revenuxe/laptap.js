import type {Metadata} from 'next';
import CartPage from '@/components/store/CartPage';
export const metadata:Metadata={title:'Your cart | Laptap Store',robots:{index:false,follow:false}};
export default function Page(){return <CartPage/>;}
