import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { supabaseUrl, supabasePublishableKey } from '@/lib/supabase/config';
import { fetchWithTimeout } from '@/lib/request-timeout';
import { ImageUploadError, MAX_SOURCE_BYTES, optimizeProductImage } from '@/lib/store/image-processing';
export const runtime = 'nodejs';
export const maxDuration = 60;
const MAX_BODY = MAX_SOURCE_BYTES + 64 * 1024;
const reply = (body: object, status = 200) => NextResponse.json(body, { status, headers: { 'Cache-Control': 'private, no-store', 'X-Content-Type-Options': 'nosniff' } });
async function boundedForm(request: NextRequest) {
 if (Number(request.headers.get('content-length')) > MAX_BODY) throw new ImageUploadError('Each source photo must be 5 MB or smaller.', 413);
 const reader = request.body?.getReader(); if (!reader) throw new ImageUploadError('Choose a product photo.', 400);
 const chunks: Uint8Array[] = []; let size = 0;
 try { while (true) { const { done, value } = await reader.read(); if (done) break; size += value.length; if (size > MAX_BODY) { await reader.cancel(); throw new ImageUploadError('Each source photo must be 5 MB or smaller.', 413); } chunks.push(value); } } finally { reader.releaseLock(); }
 try { return await new Response(Buffer.concat(chunks), { headers: { 'Content-Type': request.headers.get('content-type') || '' } }).formData(); }
 catch { throw new ImageUploadError('Send one photo using multipart form data.', 400); }
}
export async function POST(request: NextRequest) {
 try {
  const origin = request.headers.get('origin');
  if (origin && origin !== request.nextUrl.origin && origin !== 'https://www.laptap.in' && origin !== 'https://laptap.in') return reply({ error: 'Upload from the Laptap admin dashboard.' }, 403);
  const authorization = request.headers.get('authorization');
  if (!authorization?.startsWith('Bearer ')) return reply({ error: 'Sign in to upload product photos.' }, 401);
  const db = createClient(supabaseUrl, supabasePublishableKey, { global: { headers: { Authorization: authorization }, fetch: fetchWithTimeout }, auth: { persistSession: false, autoRefreshToken: false } });
  const { data: { user }, error: authError } = await db.auth.getUser(authorization.slice(7));
  if (authError || !user) return reply({ error: 'Your session has expired. Sign in again.' }, 401);
  const { data: allowed, error: permissionError } = await db.rpc('marketplace_can_upload');
  if (permissionError || !allowed) return reply({ error: 'Administrator access is required to upload photos.' }, 403);
  const form = await boundedForm(request); const file = form.get('photo');const purpose=form.get('purpose');const bucket=purpose==='evidence'?'marketplace-evidence':'marketplace-images';
  if ((purpose!==null&&purpose!=='evidence'&&purpose!=='product') || !(file instanceof File) || [...form.keys()].some(key=>!['photo','purpose'].includes(key)) || form.getAll('photo').length!==1 || form.getAll('purpose').length>1) return reply({ error: 'Choose one product photo per upload.' }, 400);
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) return reply({ error: 'Use JPG, PNG, or WebP photos.' }, 422);
  if (file.size > MAX_SOURCE_BYTES) return reply({ error: 'Each source photo must be 5 MB or smaller.' }, 413);
  const { data: reserved, error: quotaError } = await db.rpc('marketplace_claim_image_upload');
  if (quotaError) return reply({ error: 'Photo uploads are temporarily unavailable. Please try again.' }, 503);
  if (!reserved) return reply({ error: 'Photo upload limit reached. Please try again later.' }, 429);
  const image = await optimizeProductImage(Buffer.from(await file.arrayBuffer()));
  const path = `${user.id}/${reserved}.webp`;
  const { error } = await db.storage.from(bucket).upload(path, image.data, { contentType: 'image/webp', cacheControl: '31536000', upsert: false });
  if (error) return reply({ error: 'The optimized photo could not be stored. Please try again.' }, 502);
  const privateUrl=bucket==='marketplace-evidence'?await db.storage.from(bucket).createSignedUrl(path,3600):null;if(privateUrl?.error){await db.storage.from(bucket).remove([path]);return reply({error:'Private photo preview could not be created. Please try again.'},502);}
  return reply({ path, url: privateUrl?.data?.signedUrl||db.storage.from(bucket).getPublicUrl(path).data.publicUrl, bytes: image.data.length, originalBytes: image.originalBytes, width: image.width, height: image.height });
 } catch (error) {
  if (error instanceof ImageUploadError) return reply({ error: error.message }, error.status);
  return reply({ error: 'The photo could not be processed. Please try again.' }, 500);
 }
}
