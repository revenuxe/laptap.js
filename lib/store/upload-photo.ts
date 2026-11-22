"use client";
import { supabase } from '@/lib/supabase/client';
export type UploadedProductPhoto = { path: string; url: string; bytes: number; originalBytes: number; width: number; height: number };
export async function uploadProductPhoto(file: File): Promise<UploadedProductPhoto> {
 const { data: { session } } = await supabase.auth.getSession();
 if (!session) throw new Error('Sign in again before uploading photos. Your form is still here.');
 const form = new FormData(); form.set('photo', file);
 const response = await fetch('/api/seller/images', { method: 'POST', headers: { Authorization: `Bearer ${session.access_token}` }, body: form, signal: AbortSignal.timeout(60000) });
 const result = await response.json().catch(() => null);
 if (!response.ok || !result?.url || !result?.path) throw new Error(result?.error || 'The photo upload could not complete. Please try again.');
 return result;
}
