import StoreShell from '@/components/store/StoreShell';
import './store.css';
import './commerce.css';
export default function StoreLayout({ children }: { children: React.ReactNode }) {return <div className="reference-home store-shell"><StoreShell>{children}</StoreShell></div>;}
