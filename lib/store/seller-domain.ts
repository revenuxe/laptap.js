import type { Listing } from './domain';
import type { Seller, StoreOrder } from './admin-domain';
export type SellerOrder = Omit<StoreOrder, 'admin_notes' | 'payment_reference'>;
export type Application = Pick<Seller, 'full_name' | 'shop_name' | 'phone' | 'city' | 'business_address' | 'about' | 'tax_id'>;
export function canPublish(seller: Pick<Seller, 'status'> | null) { return seller?.status === 'active'; }
export function canPrepareProducts(seller: Pick<Seller, 'status'> | null) { return seller?.status === 'active' || seller?.status === 'pending'; }
export function applicationError(data: Application) {
 if(data.full_name.trim().length<2)return 'Enter your full name.';
 if(data.shop_name.trim().length<3)return 'Use at least 3 characters for your shop name.';
 if(data.phone.trim().length<7)return 'Enter a valid contact phone number.';
 if(data.city.trim().length<2)return 'Enter your city.';
 if(data.business_address.trim().length<10)return 'Enter a complete business address (at least 10 characters).';
 return '';
}
export function sellerMetrics(products: Listing[], orders: SellerOrder[], enquiries: {status:string}[]) {
 const real=products.filter(p=>!p.is_demo);
 return { published: real.filter(p=>p.status==='published').length, drafts:real.filter(p=>p.status==='draft').length, toShip: orders.filter(o=>o.status==='confirmed').length, openEnquiries:enquiries.filter(q=>q.status==='new').length, recordedSales:orders.filter(o=>o.payment_status==='paid'&&!['cancelled','refunded'].includes(o.status)).reduce((sum,o)=>sum+Number(o.managed_by_laptap?o.seller_net||0:o.amount),0) };
}
export const photoError = (file: Pick<File, 'type' | 'size'>) => !['image/jpeg','image/png','image/webp'].includes(file.type) ? 'Use JPG, PNG, or WebP photos.' : file.size > 5*1024*1024 ? 'Each photo must be 5 MB or smaller.' : '';
