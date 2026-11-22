"use client";
import {useQuery} from '@tanstack/react-query';
import {supabase} from '@/lib/supabase/client';
import type {CommissionPolicy} from './domain';
// New workflow RPCs are isolated from the legacy generated schema until the schema is regenerated.
export const managedDb=supabase as import('@supabase/supabase-js').SupabaseClient<any>;
export function useManagedPolicy(){return useQuery<CommissionPolicy>({queryKey:['managed-marketplace-policy'],queryFn:async()=>{const {data,error}=await managedDb.rpc('marketplace_managed_policy');if(error)throw new Error(error.message);return data as CommissionPolicy;},staleTime:60000,retry:1});}
