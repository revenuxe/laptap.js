"use client";

import { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, MapPin, Search } from 'lucide-react';
import { areas, areaUrl } from '@/lib/areas';

export default function AreaDirectory() {
  const [query, setQuery] = useState('');
  const filtered = [...areas].sort((a, b) => a.name.localeCompare(b.name)).filter(area => area.name.toLowerCase().includes(query.trim().toLowerCase()));
  return <div>
    <label className="area-directory-search"><Search aria-hidden="true" /><span className="sr-only">Search Bangalore areas</span><input type="search" placeholder="Search your area..." value={query} onChange={event => setQuery(event.target.value)} /></label>
    <p className="area-result-count" role="status">{filtered.length} {filtered.length === 1 ? 'area' : 'areas'}{query ? ' found' : ' to explore'}</p>
    <div className="area-directory-grid">{filtered.map(area => <Link href={areaUrl(area.slug)} key={area.slug} className="area-directory-card"><span className="landing-icon"><MapPin /></span><div><h3>{area.name}</h3><p>Laptop &amp; desktop selling guide</p></div><ArrowUpRight aria-hidden="true" /></Link>)}</div>
    {!filtered.length && <div className="landing-advice"><h3>Can’t find your area?</h3><p>Try a shorter name, or <Link href="/contact">contact our team</Link> with your pincode to check collection availability.</p><button onClick={() => setQuery('')} className="landing-text-link">Show all areas</button></div>}
  </div>;
}
