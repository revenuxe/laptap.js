import type { Metadata } from 'next';
import SellerDashboard from '@/components/seller/SellerDashboard';
export const metadata: Metadata = { title: 'Seller dashboard' };
export default function Page() { return <SellerDashboard />; }
