import Header from '@/components/Header';
import Footer from '@/components/Footer';
import './store.css';
export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return <div className="reference-home store-shell"><Header /><main id="main-content">{children}</main><Footer /></div>;
}
