import type { Metadata } from 'next';
import './seller.css';
export const metadata: Metadata = { title: 'Seller Centre', robots: { index: false, follow: false } };
export default function SellerLayout({ children }: { children: React.ReactNode }) { return <div className="seller-root">{children}</div>; }
