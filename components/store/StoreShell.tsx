"use client";
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {useState,useEffect} from 'react';
import {storeDb} from '@/lib/store/client';
import {defaultStoreSettings,type StoreSettings} from '@/lib/store/settings';
import {Check,Heart,Headphones,Laptop,LogOut,Menu,Package,ShoppingBag,Store,UserRound,Truck} from 'lucide-react';
import {Sheet,SheetContent,SheetTitle,SheetDescription} from '@/components/ui/sheet';
import {useAuth} from '@/contexts/AuthContext';
import {StoreCartProvider,useStoreCart} from './StoreCart';
function Chrome({children}:{children:React.ReactNode}){
 const [settings,setSettings]=useState<StoreSettings>(defaultStoreSettings);
 useEffect(()=>{const load=()=>{storeDb.from('store_settings').select('*').single().then(({data})=>{if(data)setSettings(data as unknown as StoreSettings);});};load();window.addEventListener('store-settings-updated',load);return()=>window.removeEventListener('store-settings-updated',load);},[]);
 const {user,signOut}=useAuth(),cart=useStoreCart(),path=usePathname();const [menu,setMenu]=useState(false);
 const links=[{href:'/store/laptop',label:'Laptops',detail:'Find your next upgrade',icon:Laptop},{href:'/store/orders',label:'My orders',detail:'Order updates & tracking',icon:Package},{href:'/store/account',label:'My account',detail:'Profile & account details',icon:UserRound}];
 const accountName=typeof user?.user_metadata.full_name==='string'?user.user_metadata.full_name.trim():'';

 return <><header className="cm-header"><div className="cm-header-inner"><button className="cm-icon" onClick={()=>setMenu(true)} aria-label="Open store menu"><Menu size={23}/></button><Link href="/store" className="cm-logo" aria-label="Laptap Store home"><img src="/assets/laptop_logo.webp" alt="Laptap" width="112" height="40"/></Link><nav className="cm-desktop-nav" aria-label="Store categories"><Link href="/store">Explore</Link><Link href="/store/laptop">Laptops</Link></nav><div className="cm-header-actions"><Link className="cm-header-orders" href="/store/orders"><Package size={20}/><span>My orders</span></Link><Link href="/store/account" className="cm-account-link" aria-label="My account"><UserRound size={21}/><span>{user?'Account':'Sign in'}</span></Link><Link className="cm-cart-link" href="/store/cart" aria-label={`Cart, ${cart.ids.length} devices`}><ShoppingBag size={22}/>{cart.ids.length>0&&<b>{cart.ids.length}</b>}</Link></div></div></header>
 <Sheet open={menu} onOpenChange={setMenu}>
 <SheetContent side="left" className="cm-drawer">
  <div className="cm-drawer-header"><span className="cm-drawer-eyebrow">YOUR NEXT UPGRADE</span><SheetTitle className="cm-drawer-brand"><Store size={24}/>{settings.name}</SheetTitle><SheetDescription>Great devices. A smarter way to shop.</SheetDescription></div>
  <div className="cm-drawer-scroll">
   <Link href="/store/account" className="cm-drawer-account" onClick={()=>setMenu(false)}><span>{accountName?accountName.charAt(0).toUpperCase():<UserRound size={23}/>}</span><div><small>{user?'GOOD TO SEE YOU':'MAKE YOURSELF AT HOME'}</small><b>{accountName||(user?'Welcome back':'Hello, shopper')}</b><p>{user?.email||'Sign in to manage your orders'}</p></div></Link>
   <Link href="/store" className="cm-drawer-shop" onClick={()=>setMenu(false)}><div><small>FIND YOUR NEXT FAVOURITE</small><b>Explore the store</b><span>Laptops that fit your day.</span></div><Laptop size={58} strokeWidth={1.25}/></Link>
   <div className="cm-drawer-shortcuts"><Link href="/store/cart" onClick={()=>setMenu(false)} aria-label={`My cart, ${cart.ids.length} devices`}><span><ShoppingBag size={21}/><b>{cart.ids.length}</b></span><strong>My cart</strong><small>Ready when you are</small></Link><Link href="/store?saved=1" onClick={()=>setMenu(false)}><span><Heart size={21}/></span><strong>Saved devices</strong><small>All your favourites</small></Link></div>
   <nav aria-label="Store menu"><h2>SHOP & ACCOUNT</h2>{links.map(({href,label,detail,icon:Icon})=><Link key={href} href={href} aria-current={path===href?'page':undefined} className={path===href?'selected':''} onClick={()=>setMenu(false)}><span className="cm-drawer-nav-icon"><Icon size={20}/></span><span><b>{label}</b><small>{detail}</small></span>{path===href&&<span className="cm-drawer-current">Current</span>}</Link>)}</nav>
   <Link href="/store/help" className="cm-drawer-help" onClick={()=>setMenu(false)}><Headphones size={23}/><div><b>A little help with your purchase?</b><small>Delivery, pickup & order support</small></div></Link>
  </div>
  <div className="cm-drawer-bottom"><Link href="/" onClick={()=>setMenu(false)}>Back to Laptap</Link>{user&&<button onClick={async()=>{await signOut();setMenu(false);}}><LogOut size={16}/>Sign out</button>}</div>
 </SheetContent></Sheet>
 <main id="main-content">{children}</main>
 <footer className="cm-footer"><div className="cm-footer-services"><span><Truck/><div><b>Your choice of fulfilment</b><small>Delivery or store pickup, where offered</small></div></span><span><ShoppingBag/><div><b>Pay when you receive</b><small>Cash on delivery or payment at pickup</small></div></span><span><Headphones/><div><b>Help with your order</b><small>Keep your order number handy</small></div></span></div><div className="cm-footer-grid"><div className="cm-footer-intro"><Link href="/store" className="cm-logo"><img src="/assets/laptop_logo.webp" alt="Laptap" width="112" height="40"/></Link><p>{settings.tagline}</p></div><div><h3>Shop</h3><Link href="/store/laptop">Laptops</Link><Link href="/store?saved=1">Saved devices</Link></div><div><h3>Your shopping</h3><Link href="/store/cart">My cart</Link><Link href="/store/orders">My orders & tracking</Link><Link href="/store/account">My account</Link></div><div><h3>We're here to help</h3>{settings.email&&<a href={`mailto:${settings.email}`}>{settings.email}</a>}{settings.phone&&<a href={`tel:${settings.phone}`}>{settings.phone}</a>}<Link href="/store/help">Delivery & pickup</Link><Link href="/store/help#payments">Payments & order help</Link></div></div><div className="cm-footer-bottom"><span>© {new Date().getFullYear()} {settings.name}</span><div><Link href="/privacy">Privacy</Link><Link href="/store/help#terms">Order terms</Link><Link href="/">Sell your old device</Link></div></div></footer>
 {cart.notice&&<div className="cm-toast" role="status"><Check size={17}/><span>{cart.notice}</span><Link href="/store/cart" onClick={cart.clearNotice}>View cart</Link></div>}</>;
}
export default function StoreShell({children}:{children:React.ReactNode}){return <StoreCartProvider><Chrome>{children}</Chrome></StoreCartProvider>;}
