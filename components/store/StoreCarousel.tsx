"use client";
import ProductImage from './ProductImage';
import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
const slides = [
 { title: 'Your next laptop.\nFor a lot less.', text: 'Shop pre-owned laptops with the specs and condition that work for you.', button: 'Shop laptops', category: 'laptop', image: '/assets/sell-laptop-cutout.webp', alt: 'Pre-owned laptop', theme: 'blue' },
 { title: 'More power.\nMore desk space.', text: 'Explore desktops for your home office, studies, and everyday work.', button: 'Shop desktops', category: 'desktop', image: '/assets/sell-desktop-cutout.webp', alt: 'Desktop computer', theme: 'lavender' },
 { title: 'Know your device.\nBefore you buy.', text: 'Check condition, warranty details, and recorded Laptap inspections.', button: 'Explore verified devices', category: 'verified', image: '/assets/sell-laptop-cutout.webp', alt: 'Laptop with detailed condition information', theme: 'ice' },
];
export default function StoreCarousel({ onShop }: { onShop: (category: string) => void }) {
 const [active,setActive]=useState(0),[paused,setPaused]=useState(false),[hovered,setHovered]=useState(false);const touch=useRef<number|null>(null);
 useEffect(()=>{if(paused||hovered||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;const timer=setInterval(()=>setActive(i=>(i+1)%slides.length),6500);return()=>clearInterval(timer);},[paused,hovered]);
 const slide=slides[active];const move=(n:number)=>{setActive(i=>(i+n+slides.length)%slides.length);setPaused(true);};
 return <section className="shop-carousel" aria-roledescription="carousel" aria-label="Store collections" onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)} onFocusCapture={()=>setHovered(true)} onBlurCapture={e=>{if(!e.currentTarget.contains(e.relatedTarget))setHovered(false);}} onTouchStart={e=>{touch.current=e.touches[0].clientX;}} onTouchEnd={e=>{if(touch.current!==null){const distance=e.changedTouches[0].clientX-touch.current;if(Math.abs(distance)>45)move(distance<0?1:-1);touch.current=null;}}}>
 <div className={`shop-slide shop-slide-${slide.theme}`} role="group" aria-roledescription="slide" aria-label={`${active+1} of ${slides.length}`}><div className="shop-slide-copy"><h1>{slide.title.split('\n').map((line,i)=><span key={line}>{line}{i===0&&<br/>}</span>)}</h1><p>{slide.text}</p><button className="store-button" onClick={()=>onShop(slide.category)}>{slide.button}</button></div><div className="shop-slide-art"><div className="shop-slide-circle"/><ProductImage key={slide.image+active} src={slide.image} alt={slide.alt} sizes="(max-width: 767px) 80vw, 550px" priority={active===0}/></div></div>
 <div className="shop-carousel-controls"><div className="shop-dots">{slides.map((s,i)=><button key={s.theme} aria-label={`Show slide ${i+1}: ${s.button}`} aria-current={active===i?'true':undefined} onClick={()=>{setActive(i);setPaused(true);}} className={active===i?'active':''}/>)}</div><div><button onClick={()=>setPaused(!paused)} aria-label={paused?'Play carousel':'Pause carousel'}>{paused?<Play size={14}/>:<Pause size={14}/>}</button><button aria-label="Previous slide" onClick={()=>move(-1)}><ChevronLeft size={18}/></button><button aria-label="Next slide" onClick={()=>move(1)}><ChevronRight size={18}/></button></div></div></section>;
}
