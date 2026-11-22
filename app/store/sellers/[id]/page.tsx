import type { Metadata } from 'next';
import Catalog from '@/components/store/Catalog';
export const metadata: Metadata = { title: 'Seller collection | Laptap Store', alternates: { canonical: null } };
export default async function Page({ params }: {
    params: Promise<{
        id: string;
    }>;
}) { return <Catalog sellerId={(await params).id}/>; }
