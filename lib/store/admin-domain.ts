import type { Listing } from './domain';
export type Seller = { id: string; shop_name: string; email: string; phone: string; city: string; status: 'pending' | 'active' | 'rejected' | 'suspended' | 'deleted'; moderation_note: string; created_at: string; full_name: string; business_address: string; about: string; tax_id: string; approved_at: string | null; approved_by: string | null; deleted_at?: string | null; deleted_by?: string | null; deletion_reason?: string };
export type StoreInquiry = { id: string; listing_id: string; buyer_name: string; email: string; phone: string; message: string; created_at: string; status: 'new' | 'contacted' | 'closed'; admin_notes: string; seller_notes?: string };
export const orderStates = ['pending','confirmed','shipped','delivered','cancelled','return_requested','refunded'] as const;
export type StoreOrder = { id: string; order_number: number; listing_id: string; seller_id: string; buyer_name: string; email: string; phone: string; address: string; amount: number; status: typeof orderStates[number]; payment_status: 'unpaid' | 'paid' | 'refunded'; payment_reference: string; tracking_number: string; courier: string; admin_notes: string; created_at: string };
export type SupportCase = { id: string; order_id: string; reason: string; status: 'open' | 'reviewing' | 'resolved' | 'declined'; resolution: string; created_at: string };
export type StoreActivity = { id: string; actor_id: string | null; entity_type: string; entity_id: string; action: string; created_at: string; details?: Record<string, unknown> };
export const orderTransitions: Record<StoreOrder['status'], StoreOrder['status'][]> = {
 pending: ['confirmed','cancelled'], confirmed: ['shipped','cancelled'], shipped: ['delivered','return_requested'], delivered: ['return_requested'], return_requested: ['refunded','delivered'], cancelled: [], refunded: [],
};
export function storeMetrics(products: Listing[], sellers: Seller[], orders: StoreOrder[], inquiries: StoreInquiry[], cases: SupportCase[]) {
 const activeSellerIds=new Set(sellers.filter(s=>s.status==='active').map(s=>s.id));
 const paid=orders.filter(o=>o.payment_status==='paid'&&o.status!=='cancelled'&&o.status!=='refunded');
 return { available: products.filter(p=>!p.is_demo&&p.status==='published'&&activeSellerIds.has(p.seller_id)).length, sellers:sellers.filter(s=>s.status==='active').length, pending:orders.filter(o=>o.status==='pending'||o.status==='confirmed').length, recordedSales:paid.reduce((sum,o)=>sum+Number(o.amount),0), inspections:products.filter(p=>!p.is_demo&&p.status==='published'&&!p.verified_at).length, newInquiries:inquiries.filter(q=>q.status==='new').length, openReturns:cases.filter(c=>c.status==='open'||c.status==='reviewing').length };
}
export function csvCell(value: unknown) { let text=String(value??''); if(/^[=+\-@\t\r]/.test(text))text="'"+text; return '"'+text.replaceAll('"','""')+'"'; }

export type SellerAdminAction = 'delete' | 'restore' | 'suspend' | 'reactivate';
export type SellerDeletionPreview = { seller_id:string;shop_name:string;status:Seller['status'];total_products:number;published_products:number;total_orders:number;open_orders:number;open_cases:number;protected_account:boolean;can_delete:boolean };
export type SellerAdminNote = {id:string;seller_id:string;body:string;created_by:string;created_at:string};
export function sellerDeletionBlocker(preview:SellerDeletionPreview) {
 if(preview.protected_account)return 'Administrator accounts are protected.';
 if(preview.status==='deleted')return 'This seller account has already been deleted.';
 if(preview.open_orders>0)return 'Resolve open orders and outstanding payment records before deletion.';
 if(preview.open_cases>0)return 'Resolve open support cases before deletion.';
 return '';
}
