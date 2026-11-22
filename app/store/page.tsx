import type { Metadata } from 'next';
import Catalog from '@/components/store/Catalog';
export const metadata: Metadata = { title: 'Store | Pre-owned laptops & desktops', description: 'Explore laptops and desktops from independent sellers. Compare condition, specifications, warranty details, and Laptap verification.', alternates: { canonical: '/store' } };
export default function Page() { return <Catalog />; }
