"use client";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MobileBottomNav from '@/components/MobileBottomNav';
import OfflineNotice from '@/components/OfflineNotice';
export const PageClient = () => <div className="reference-home min-h-screen flex flex-col"><Header /><main id="main-content" className="container flex-1 py-16"><h1 className="mb-6 text-3xl font-bold">Contact Laptap</h1><OfflineNotice /></main><Footer /><MobileBottomNav /></div>;
