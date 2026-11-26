import {Suspense} from 'react';
import type { Metadata } from 'next';
import Catalog from '@/components/store/Catalog';
export const metadata: Metadata = { title: 'Buy Pre-owned Laptops | Laptap Store', description: 'Shop pre-owned laptops from Laptap Store. Compare condition, specifications, warranty details, and Laptap verification.', alternates: { canonical: '/store' } };
export default function Page() { return <Suspense><Catalog /></Suspense>; }
