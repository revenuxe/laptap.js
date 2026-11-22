import Image from 'next/image';
import type { CSSProperties } from 'react';
import { supabaseUrl } from '@/lib/supabase/config';
const host = new URL(supabaseUrl).hostname;
export default function ProductImage({ src, alt, sizes = '280px', priority = false, width = 800, height = 600, style }: { src: string; alt: string; sizes?: string; priority?: boolean; width?: number; height?: number; style?: CSSProperties }) {
 let optimize = src.startsWith('/') && !src.startsWith('//') && !src.toLowerCase().endsWith('.svg');
 try { const url = new URL(src); optimize = url.protocol === 'https:' && url.hostname === host && url.pathname.startsWith('/storage/v1/object/public/marketplace-images/') && /\.(webp|jpe?g|png)$/i.test(url.pathname); } catch { /* Local assets are optimized without a remote fetch. */ }
 return optimize ? <Image src={src} alt={alt} width={width} height={height} sizes={sizes} quality={75} priority={priority} style={style}/> : <img src={src} alt={alt} width={width} height={height} decoding="async" loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : 'auto'} style={style}/>;
}
