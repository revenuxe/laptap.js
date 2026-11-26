"use client";
import {useEffect,useState} from 'react';
import {RefreshCw} from 'lucide-react';
import {Dialog,DialogContent,DialogDescription,DialogTitle} from '@/components/ui/dialog';
import {managedDb} from '@/lib/managed/client';
import {money} from '@/lib/store/domain';
import type {StoreOrder} from '@/lib/store/admin-domain';
import ManagedOrderPanel from './ManagedOrderPanel';
export type ManagedTab='orders'|'inspections'|'payments';
export default function ManagedWorkspace({tab,revision=0}:{tab:ManagedTab;revision?:number}){
 const [rows,setRows]=useState<(StoreOrder&{marketplace_order_operations?:{stage:string}})[]>([]),[offset,setOffset]=useState(0),[filter,setFilter]=useState(''),[loading,setLoading]=useState(true),[error,setError]=useState(''),[more,setMore]=useState(false),[order,setOrder]=useState<string|null>(null);
 async function load(){setLoading(true);setError('');try{
 let q=managedDb.from('marketplace_orders').select('*,marketplace_order_operations(stage)').eq('managed_by_laptap',true);
 if(filter)q=q.eq(tab==='payments'?'payment_status':'status',filter);
 const {data,error}=await q.order('created_at',{ascending:false}).order('id').range(offset,offset+24);
 if(error)throw new Error(error.message);setRows((data||[]).slice(0,24));setMore((data||[]).length>24);
 }catch(e){setError(e instanceof Error?e.message:'Orders could not load.');}finally{setLoading(false);}}
 useEffect(()=>{setOffset(0);setFilter('');setOrder(null);},[tab]);
 useEffect(()=>{load();},[tab,offset,filter,revision]);
 const options=tab==='payments'?['unpaid','paid','refunded']:['pending','confirmed','shipped','delivered','return_requested','cancelled','refunded'];
 return <div className="mm-workspace"><div className="mm-toolbar"><div><h3>{tab==='payments'?'Payments & refunds':tab==='inspections'?'Inspection & fulfilment':'Customer orders'}</h3><p className="mm-muted">Track each laptop from confirmation through delivery or pickup.</p></div><div><select aria-label="Filter orders" value={filter} onChange={e=>{setOffset(0);setFilter(e.target.value);}}><option value="">All statuses</option>{options.map(s=><option key={s} value={s}>{s.replaceAll('_',' ')}</option>)}</select><button className="sa-secondary" onClick={load} disabled={loading}><RefreshCw size={15}/>Refresh</button></div></div>{error&&<p className="mm-error" role="alert">{error}</p>}{loading?<p className="mm-card" role="status">Loading orders...</p>:!rows.length?<div className="mm-card mm-empty"><h3>No orders found</h3><p>Orders appear here when buyers complete checkout.</p></div>:<div className="mm-record-grid">{rows.map(o=><button className="mm-record mm-order-record" key={o.id} onClick={()=>setOrder(o.id)}><div><small>LT-{String(o.order_number).padStart(5,'0')} / {new Date(o.created_at).toLocaleDateString('en-IN')}</small><h4>{o.product_snapshot?.title||'Laptop'}</h4><p>{o.buyer_name}</p><span className="mm-pill">{(o.marketplace_order_operations?.stage||o.status).replaceAll('_',' ')}</span><strong>{money(o.amount)}</strong><small>Payment: {o.payment_status}</small><span className="mm-record-link">Manage order</span></div></button>)}</div>}<div className="mm-pagination"><button className="sa-secondary" disabled={offset===0||loading} onClick={()=>setOffset(n=>Math.max(0,n-24))}>Previous</button><span>Page {offset/24+1}</span><button className="sa-secondary" disabled={!more||loading} onClick={()=>setOffset(n=>n+24)}>Next</button></div><Dialog open={!!order} onOpenChange={open=>{if(!open)setOrder(null);}}><DialogContent className="sa-dialog mm-dialog" aria-describedby="store-order-description"><DialogTitle>Manage order</DialogTitle><DialogDescription id="store-order-description">Inspection, fulfilment and payment records.</DialogDescription>{order&&<ManagedOrderPanel id={order} onUpdate={load}/>}</DialogContent></Dialog></div>;
}
