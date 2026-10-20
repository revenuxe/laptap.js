import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Laptap — Sell your laptop or desktop in Bangalore';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function SocialImage() {
  return new ImageResponse(<div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%', height: '100%', padding: 80, background: '#f1f6ff', color: '#002653', fontFamily: 'sans-serif' }}>
    <div style={{ display: 'flex', fontSize: 32, color: '#0063ef', marginBottom: 40 }}>Laptap · Bangalore</div>
    <div style={{ display: 'flex', fontSize: 64, fontWeight: 700, lineHeight: 1.15 }}>Your laptop’s next chapter starts here.</div>
    <div style={{ display: 'flex', fontSize: 28, marginTop: 36, color: '#587294' }}>Choose your device. Share the details. Plan your handover.</div>
    <div style={{ display: 'flex', fontSize: 24, marginTop: 48 }}>www.laptap.in</div>
  </div>, size);
}
