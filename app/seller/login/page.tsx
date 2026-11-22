import type { Metadata } from 'next';
import SellerLogin from '@/components/seller/SellerLogin';
export const metadata: Metadata = { title: 'Seller login & registration' };
export default function Page() { return <SellerLogin />; }
