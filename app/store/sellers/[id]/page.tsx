import {Suspense} from 'react';
import type { Metadata } from 'next';
import Catalog from '@/components/store/Catalog';
export const metadata: Metadata = { title: 'Seller collection | Laptap Store', alternates: { canonical: null } };
export default async function Page({ params }: {
    params: Promise<{
        id: string;
    }>;
}) { return <Suspense><Catalog sellerId={(await params).id}/></Suspense>; }
