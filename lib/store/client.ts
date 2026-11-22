"use client";
import type { SupabaseClient } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';
import type { Listing } from './domain';
import type { Seller, StoreInquiry, StoreOrder, SupportCase, StoreActivity, SellerAdminNote, SellerDeletionPreview } from './admin-domain';
type Table<Row, Insert> = { Row: Row; Insert: Insert; Update: Partial<Row>; Relationships: [] };
type StoreDatabase = { public: { Tables: {
 marketplace_listings: Table<Listing, Omit<Listing,'id'|'created_at'|'verified_at'|'verification_notes'> & {id?:string;verified_at?:string|null;verification_notes?:string}>;
 marketplace_inquiries: Table<StoreInquiry, Omit<StoreInquiry,'id'|'created_at'|'status'|'admin_notes'>>;
 marketplace_sellers: Table<Seller, Omit<Seller,'created_at'|'approved_at'|'approved_by'> & {approved_at?:string|null;approved_by?:string|null}>;
 marketplace_orders: Table<StoreOrder, Omit<StoreOrder,'id'|'order_number'|'created_at'>>;
 marketplace_returns: Table<SupportCase, Omit<SupportCase,'id'|'created_at'>>;
 marketplace_activity: Table<StoreActivity, never>;
 marketplace_seller_admin_notes: Table<SellerAdminNote, Pick<SellerAdminNote,'seller_id'|'body'>>;
 }; Views: {}; Functions: { admin_marketplace_seller_preview: { Args: {_seller_id:string}; Returns: SellerDeletionPreview }; admin_marketplace_seller_action: { Args: {_seller_id:string;_action:string;_reason:string;_confirmation?:string}; Returns: SellerDeletionPreview }; marketplace_seller_inquiries: { Args: Record<string, never>; Returns: StoreInquiry[] }; marketplace_seller_orders: { Args: Record<string, never>; Returns: Omit<StoreOrder,'admin_notes'|'payment_reference'>[] }; marketplace_seller_fulfil: { Args: { _order_id:string;_status:string;_courier:string;_tracking:string }; Returns: undefined } }; Enums: {}; CompositeTypes: {} } };
export const storeDb = supabase as unknown as SupabaseClient<StoreDatabase>;
export const storeError = 'The store could not connect. Please try again shortly or contact Laptap.';
