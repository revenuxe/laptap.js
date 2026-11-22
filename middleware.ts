import { NextResponse, type NextRequest } from 'next/server';
import { supabaseUrl, supabasePublishableKey } from '@/lib/supabase/config';
export async function middleware(request: NextRequest) {
 const category=request.nextUrl.searchParams.get('category');
 if(request.nextUrl.pathname==='/store'&&(category==='laptop'||category==='desktop')){const destination=request.nextUrl.clone();destination.pathname='/store/'+category;destination.searchParams.delete('category');return NextResponse.redirect(destination,308);}
 const id = request.nextUrl.pathname.slice('/store/'.length);
 if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) return NextResponse.next();
 try {
  const url = new URL(`${supabaseUrl}/rest/v1/marketplace_listings`);
  url.searchParams.set('select', 'seo_path');url.searchParams.set('id',`eq.${id}`);url.searchParams.set('limit','1');
  const response = await fetch(url, { headers: { apikey: supabasePublishableKey }, signal: AbortSignal.timeout(5000) });
  if (response.ok) {
   const [product] = await response.json();
   if (product?.seo_path) { const destination = request.nextUrl.clone(); destination.pathname = `/store/${product.seo_path}`; return NextResponse.redirect(destination, 308); }
  }
 } catch { /* The product page handles lookup failures and authenticated previews. */ }
 return NextResponse.next();
}
export const config = { matcher: ['/store/:path*'] };
