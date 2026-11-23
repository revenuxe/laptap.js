import { OFFLINE_MESSAGE } from '@/lib/service-status';

export default function OfflineNotice() {
  return <section id="service-status" role="status" className="border border-amber-200 bg-amber-50 px-6 py-5 text-slate-900"><div className="mx-auto max-w-5xl"><h2 className="text-lg font-semibold">We're currently offline</h2><p className="mt-2 text-base leading-relaxed">{OFFLINE_MESSAGE}</p></div></section>;
}
