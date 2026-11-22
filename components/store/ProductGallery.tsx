"use client";
import ProductImage from './ProductImage';

import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Expand, ImageIcon, Laptop } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import type { Listing } from '@/lib/store/domain';

export default function ProductGallery({ product }: { product: Listing }) {
  const [photo, setPhoto] = useState(0);
  const [zoom, setZoom] = useState(false);
  const touch = useRef<number | null>(null);
  const images = product.images;
  const change = (step: number) => {
    if (images.length) setPhoto(current => (current + step + images.length) % images.length);
  };

  return <div className="pd-gallery">
    <div className="pd-image-stage" role="group" aria-label="Product photos" tabIndex={0}
      onKeyDown={event => {
        if (event.key === 'ArrowRight') { event.preventDefault(); change(1); }
        if (event.key === 'ArrowLeft') { event.preventDefault(); change(-1); }
      }}
      onTouchStart={event => { touch.current = event.touches[0].clientX; }}
      onTouchEnd={event => {
        if (touch.current !== null && Math.abs(event.changedTouches[0].clientX - touch.current) > 45) {
          change(event.changedTouches[0].clientX < touch.current ? 1 : -1);
        }
        touch.current = null;
      }}>
      <span className="pd-condition-tag">{product.condition}</span>
      {images[photo]
        ? <button className="pd-image-open" onClick={() => setZoom(true)} aria-label="Open full-size product photo"><ProductImage src={images[photo]} alt={`${product.title}, photo ${photo + 1}`} sizes="(max-width: 767px) calc(100vw - 32px), 680px" priority={photo===0}/></button>
        : <Laptop size={80} strokeWidth={1} />}
      {images.length > 1 && <>
        <button className="pd-image-previous" onClick={() => change(-1)} aria-label="Previous product photo"><ChevronLeft size={19} /></button>
        <button className="pd-image-next" onClick={() => change(1)} aria-label="Next product photo"><ChevronRight size={19} /></button>
      </>}
      <span className="pd-image-count"><ImageIcon size={14} />{images.length ? photo + 1 : 0} / {images.length}</span>
      {images.length > 0 && <button className="pd-image-expand" onClick={() => setZoom(true)} aria-label="Enlarge product photo"><Expand size={17} /></button>}
    </div>
    <div className="pd-gallery-bottom">
      <div className="pd-thumbnails" aria-label="Choose a product photo">
        {images.map((image, index) => <button key={`${image}-${index}`} className={photo === index ? 'selected' : ''} onClick={() => setPhoto(index)} aria-label={`View photo ${index + 1}`} aria-pressed={photo === index}><ProductImage src={image} alt="" sizes="72px" width={144} height={128}/></button>)}
      </div>
      <p>{product.is_demo ? 'Illustrative image' : 'Actual device photos'}</p>
    </div>
    <Dialog open={zoom} onOpenChange={setZoom}>
      <DialogContent className="pd-lightbox" aria-describedby={undefined}>
        <DialogTitle className="sr-only">{product.title} - photo gallery</DialogTitle>
        <img src={images[photo]} alt={`${product.title}, photo ${photo + 1}`} />
        {images.length > 1 && <div className="pd-lightbox-controls"><button onClick={() => change(-1)} aria-label="Previous photo"><ChevronLeft size={20} /></button><span>{photo + 1} / {images.length}</span><button onClick={() => change(1)} aria-label="Next photo"><ChevronRight size={20} /></button></div>}
      </DialogContent>
    </Dialog>
  </div>;
}
