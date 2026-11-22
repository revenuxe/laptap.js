"use client";
import { uploadProductPhoto } from '@/lib/store/upload-photo';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Plus, Upload, Store, Check, BadgeCheck } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase/client';
import { storeDb, storeError } from '@/lib/store/client';
import { Listing, money } from '@/lib/store/domain';
type Inquiry = {
    id: string;
    listing_id: string;
    buyer_name: string;
    email: string;
    phone: string;
    message: string;
    created_at: string;
};
export default function SellerStudio() {
    const { user, isAdmin, loading } = useAuth();
    const [items, setItems] = useState<Listing[]>([]), [inquiries, setInquiries] = useState<Inquiry[]>([]), [editing, setEditing] = useState<Listing | null | undefined>(undefined), [busy, setBusy] = useState(false), [notice, setNotice] = useState(''), [signup, setSignup] = useState(false), [loaded, setLoaded] = useState(false), [photos, setPhotos] = useState<string[]>([]);
    async function load() { if (!user)
        return; setLoaded(false); try {
        let query = storeDb.from('marketplace_listings').select('*').order('created_at', { ascending: false });
        if (!isAdmin)
            query = query.eq('seller_id', user.id);
        const [products, requests] = await Promise.all([query, storeDb.from('marketplace_inquiries').select('*').order('created_at', { ascending: false })]);
        if (products.error || requests.error)
            throw products.error || requests.error;
        setItems(products.data || []);
        setInquiries(requests.data || []);
    }
    catch {
        setNotice(storeError);
    }
    finally {
        setLoaded(true);
    } }
    useEffect(() => { load(); }, [user?.id, isAdmin]);
    async function auth(e: React.FormEvent<HTMLFormElement>) { e.preventDefault(); setBusy(true); setNotice(''); const d = new FormData(e.currentTarget); try {
        const credentials = { email: String(d.get('email')), password: String(d.get('password')) };
        const { error } = signup ? await supabase.auth.signUp({ ...credentials, options: { data: { full_name: String(d.get('name')) }, emailRedirectTo: `${window.location.origin}/store/sell` } }) : await supabase.auth.signInWithPassword(credentials);
        if (error)
            throw error;
        if (signup)
            setNotice('Account created. If email confirmation is enabled, check your inbox before signing in.');
    }
    catch (e) {
        setNotice(e instanceof Error ? e.message : 'Unable to sign in. Try again.');
    }
    finally {
        setBusy(false);
    } }
    async function save(e: React.FormEvent<HTMLFormElement>) { e.preventDefault(); if (!user || busy)
        return; setBusy(true); setNotice(''); const d = new FormData(e.currentTarget); const str = (k: string) => String(d.get(k) || '').trim(); const newUploads: string[] = []; try {
        const files = d.getAll('photos').filter((f): f is File => f instanceof File && f.size > 0);
        if (photos.length + files.length > 8)
            throw new Error('Use up to 8 photos.');
        for (const f of files) {
            if (!['image/jpeg', 'image/png', 'image/webp'].includes(f.type) || f.size > 5 * 1024 * 1024)
                throw new Error('Photos must be JPG, PNG, or WebP, up to 5 MB each.');
            const optimized = await uploadProductPhoto(f);
            const path = optimized.path;
            newUploads.push(path);
        }
        const images = [...photos, ...newUploads.map(path => supabase.storage.from('marketplace-images').getPublicUrl(path).data.publicUrl)];
        if (!images.length)
            throw new Error('Add at least one photo of the actual device.');
        if (Number(str('seller_warranty_months')) > 0 && str('warranty_terms').length < 10)
            throw new Error('Describe the coverage and claim process for the seller warranty.');
        const payload = { seller_id: editing?.seller_id || user.id, seller_name: str('seller_name'), title: str('title'), brand: str('brand'), category: str('category') as Listing['category'], price: Number(str('price')), year: Number(str('year')), condition: str('condition') as Listing['condition'], description: str('description'), processor: str('processor'), ram: str('ram'), storage: str('storage'), graphics: str('graphics'), display: str('display'), battery: str('battery'), defects: str('defects'), accessories: str('accessories'), location: str('location'), official_warranty_until: str('official_warranty_until') || null, seller_warranty_months: Number(str('seller_warranty_months')), warranty_terms: str('warranty_terms'), images, status: str('status') as Listing['status'] };
        const { error } = editing ? await storeDb.from('marketplace_listings').update(payload).eq('id', editing.id) : await storeDb.from('marketplace_listings').insert(payload);
        if (error)
            throw new Error('Listing could not be saved. Check the details and try again.');
        setEditing(undefined);
        setNotice('Listing saved. Any previous verification is cleared when device details change.');
        await load();
    }
    catch (e) {
        if (newUploads.length)
            await supabase.storage.from('marketplace-images').remove(newUploads);
        setNotice(e instanceof Error ? e.message : storeError);
    }
    finally {
        setBusy(false);
    } }
    async function verify(p: Listing, e: React.FormEvent<HTMLFormElement>) { e.preventDefault(); if (!isAdmin)
        return; setBusy(true); const notes = String(new FormData(e.currentTarget).get('notes') || '').trim(); try {
        const { error } = await storeDb.from('marketplace_listings').update({ verified_at: p.verified_at ? null : new Date().toISOString(), verification_notes: p.verified_at ? '' : notes }).eq('id', p.id);
        if (error)
            throw error;
        setNotice('Verification updated.');
        await load();
    }
    catch {
        setNotice('Verification could not be updated.');
    }
    finally {
        setBusy(false);
    } }
    const field = (name: string, label: string, required = true, type = 'text') => <label key={name}>{label}<input name={name} type={type} required={required} maxLength={type === 'text' ? (['seller_name', 'brand'].includes(name) ? 100 : name === 'title' ? 200 : 300) : undefined} defaultValue={editing?.[name as keyof Listing] as string || ''}/></label>;
    if (loading)
        return <div className="store-wrap store-empty" role="status">Loading your seller studio...</div>;
    return <div className="store-wrap store-studio"><div className="store-section-heading"><div><h1>Seller dashboard</h1><p>Manage your listings, availability, and buyer enquiries.</p></div>{user && editing === undefined && <button className="store-button" onClick={() => { setEditing(null); setPhotos([]); setNotice(''); }}><Plus size={17}/> New listing</button>}</div>{notice && <p className="store-notice" role="status">{notice}</p>}
 {!user ? <div className="store-auth-grid"><div className="store-auth-intro"><Store size={40}/><h2>Sell on Laptap.<br />Manage your products.</h2><p>Give buyers a clear view of your device, from its real condition to exactly what is covered.</p>{['Real photos, complete specifications', 'Separate official and seller warranties', 'Buyer enquiries in one place'].map(t => <p key={t}><Check size={17}/> {t}</p>)}</div><form className="store-form store-info-panel" onSubmit={auth}><h2>{signup ? 'Create your seller account' : 'Welcome back.'}</h2>{signup && <label>Your name<input name="name" required autoComplete="name"/></label>}<label>Email<input type="email" name="email" required autoComplete="email"/></label><label>Password<input type="password" name="password" required minLength={8} autoComplete={signup ? 'new-password' : 'current-password'}/></label><button disabled={busy} className="store-button">{busy ? 'Please wait...' : signup ? 'Create account' : 'Sign in'}</button><button type="button" className="store-text-link" onClick={() => setSignup(!signup)}>{signup ? 'Already a seller? Sign in' : 'New here? Create an account'}</button></form></div> : editing !== undefined ? <form className="store-form store-info-panel" onSubmit={save} key={editing?.id || 'new'}><h2>{editing ? 'Edit device' : 'Add a product'}</h2><div className="store-form-grid">{field('title', 'Listing title')}{field('seller_name', 'Seller / shop name')}{field('brand', 'Brand')}<label>Device type<select name="category" defaultValue={editing?.category || 'laptop'}><option value="laptop">Laptop</option><option value="desktop">Desktop</option></select></label><label>Price (?)<input name="price" type="number" required min="1" max="3000000" defaultValue={editing?.price}/></label><label>Model year<input name="year" type="number" required min="2000" max={new Date().getFullYear() + 1} defaultValue={editing?.year}/></label><label>Condition<select name="condition" defaultValue={editing?.condition || 'Good'}>{['Like new', 'Excellent', 'Good', 'Fair'].map(v => <option key={v}>{v}</option>)}</select></label>{field('location', 'City / area')}{field('processor', 'Processor / chip')}{field('ram', 'RAM (e.g. 16 GB)')}{field('storage', 'Storage (e.g. 512 GB SSD)')}{field('graphics', 'Graphics')}{field('display', 'Screen / monitor')}{field('battery', 'Battery health / power details')}{field('accessories', 'Included accessories')}</div><label>About this device<textarea name="description" required minLength={30} maxLength={5000} defaultValue={editing?.description}/></label><label>Wear, repairs, and known faults<textarea name="defects" required minLength={5} maxLength={3000} placeholder="Describe scratches, repairs, battery issues, or confirm no known faults." defaultValue={editing?.defects}/></label><h3>Warranty transparency</h3><div className="store-form-grid">{field('official_warranty_until', 'Manufacturer warranty end date (optional)', false, 'date')}<label>Seller warranty (months)<input name="seller_warranty_months" type="number" min="0" max="60" required defaultValue={editing?.seller_warranty_months || 0}/></label></div><label>Warranty coverage, exclusions & how to claim<textarea name="warranty_terms" maxLength={3000} defaultValue={editing?.warranty_terms}/></label><h3>Actual device photos</h3><p>Up to 8 JPG, PNG, or WebP photos, 5 MB each. Show the screen, keyboard, body, and any wear. Do not include private information.</p><div className="store-uploaded">{photos.map((url, i) => <div key={url}><img src={url} alt={`Device photo ${i + 1}`}/><button type="button" onClick={() => setPhotos(photos.filter(p => p !== url))}>Remove</button></div>)}</div><label className="store-upload"><Upload /> Add photos<input name="photos" type="file" accept="image/jpeg,image/png,image/webp" multiple/></label><label>Availability<select name="status" defaultValue={editing?.status || 'published'}><option value="published">Published   available to buyers</option><option value="draft">Draft   only visible to you</option><option value="sold">Sold   no longer accepting enquiries</option></select></label><p className="store-purchase-note">Publishing confirms these details are accurate to the best of your knowledge. Laptap verification can only be awarded after an admin records an inspection.</p><div className="store-inline-actions"><button className="store-button" disabled={busy}>{busy ? 'Saving & uploading...' : 'Save listing'}</button><button type="button" disabled={busy} className="store-button store-button-light" onClick={() => setEditing(undefined)}>Cancel</button></div></form> : <><div className="store-studio-stats"><div><strong>{items.length}</strong><span>{isAdmin ? 'All listings' : 'Your listings'}</span></div><div><strong>{items.filter(p => p.status === 'published').length}</strong><span>Available devices</span></div><div><strong>{inquiries.length}</strong><span>Buyer enquiries</span></div></div><h2>{isAdmin ? 'Marketplace management' : 'Your collection'}</h2>{!loaded ? <p role="status">Loading listings...</p> : !items.length ? <div className="store-empty"><Store /><h3>Your first listing belongs here.</h3><p>Add a device with photos and specifications to get started.</p></div> : <div className="store-managed-list">{items.map(p => <article className="store-managed-card" key={p.id}><div className="store-managed-summary"><img src={p.images[0]} alt=""/><div><Link href={`/store/${p.id}`}><h3>{p.title}</h3></Link><p>{money(p.price)}   {p.status}   {p.seller_name}</p><small>{p.verified_at ? 'Laptap verified' : 'Not verified'}</small></div><button className="store-button store-button-light" onClick={() => { setEditing(p); setPhotos(p.images); }}>Edit</button></div>{isAdmin && !p.is_demo && <form className="store-admin-review" onSubmit={e => verify(p, e)}><label><BadgeCheck size={16}/> Inspection record<textarea name="notes" required={!p.verified_at} minLength={20} maxLength={2000} defaultValue={p.verification_notes} placeholder="Record inspection date, checks completed, findings, and limitations. Verify only after an actual inspection."/></label><button className="store-button" disabled={busy}>{p.verified_at ? 'Revoke verification' : 'Record inspection & verify'}</button></form>}</article>)}</div>}<h2 className="store-enquiries-title">Buyer enquiries</h2>{!inquiries.length ? <p>No enquiries yet. Buyer requests will appear here.</p> : <div className="store-inquiry-grid">{inquiries.map(q => <article className="store-info-panel" key={q.id}><small>{new Date(q.created_at).toLocaleDateString('en-IN')}</small><h3>{q.buyer_name}</h3><Link href={`/store/${q.listing_id}`} className="store-text-link">{items.find(p => p.id === q.listing_id)?.title || 'View device'}</Link><p className="store-description">{q.message}</p><p><a href={`mailto:${q.email}`}>{q.email}</a></p><p><a href={`tel:${q.phone}`}>{q.phone}</a></p></article>)}</div>}</>}</div>;
}
