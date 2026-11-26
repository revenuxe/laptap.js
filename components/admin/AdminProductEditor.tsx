"use client";
import {useEffect,useRef,useState} from 'react';
import {Camera,Check,CheckCircle2,ChevronDown,ImagePlus,Laptop,Loader2,Package,Save,ShieldCheck,Sparkles,Trash2,Truck} from 'lucide-react';
import {supabase} from '@/lib/supabase/client';
import {storeDb} from '@/lib/store/client';
import {type Listing} from '@/lib/store/domain';
import {uploadProductPhoto} from '@/lib/store/upload-photo';
import BrandSelect from './listing/BrandSelect';
import ChoiceField from './listing/ChoiceField';
import ProductPrice from '@/components/store/ProductPrice';
import {ProcessorFields,GraphicsFields,StorageMemoryFields} from './listing/GuidedSpecs';
import {listingDescription,listingTitle,UNKNOWN_SPEC} from '@/lib/store/listing-options';
import './listing/guided-listing.css';
import './product-editor.css';

type Photo={id:string;url:string;file?:File};
export default function AdminProductEditor({product,onSaved,onCancel,onBusy}:{product:Listing|null;onSaved:()=>void;onCancel:()=>void;onBusy:(busy:boolean)=>void}){
 const [draft,setDraft]=useState({title:product?.title||'',brand:product?.brand||'',processor:product?.processor||UNKNOWN_SPEC,ram:product?.ram||UNKNOWN_SPEC,storage:product?.storage||UNKNOWN_SPEC,graphics:product?.graphics||UNKNOWN_SPEC,display:product?.display||'',battery:product?.battery||'',accessories:product?.accessories||'',defects:product?.defects||''});
 const [photos,setPhotos]=useState<Photo[]>(()=>product?.images.map((url,index)=>({id:`existing-${index}`,url}))||[]);
 const [busy,setBusy]=useState(false),[error,setError]=useState(''),[progress,setProgress]=useState(''),[dragging,setDragging]=useState(false);
 const [regularPrice,setRegularPrice]=useState(String(product?.regular_price||''));
 const [price,setPrice]=useState(String(product?.price||'')),[visibility,setVisibility]=useState(product?.status||'draft');
 const photoRef=useRef(photos);
 useEffect(()=>{photoRef.current=photos;},[photos]);
 useEffect(()=>()=>{photoRef.current.forEach(p=>{if(p.file)URL.revokeObjectURL(p.url);});},[]);
 const change=(key:string,value:string)=>setDraft(d=>({...d,[key]:value}));
 function addFiles(files:FileList|null){
  if(!files||busy)return;const selected=Array.from(files);
  if(selected.some(f=>!['image/jpeg','image/png','image/webp'].includes(f.type)||f.size>5*1024*1024)||selected.length+photos.length>8){setError('Add up to 8 JPG, PNG or WebP photos, each 5 MB or smaller.');return;}
  setError('');setPhotos(current=>[...current,...selected.map(file=>({id:crypto.randomUUID(),file,url:URL.createObjectURL(file)}))]);
 }
 function removePhoto(photo:Photo){if(photo.file)URL.revokeObjectURL(photo.url);setPhotos(current=>current.filter(p=>p.id!==photo.id));}
 async function save(e:React.FormEvent<HTMLFormElement>){
  e.preventDefault();if(busy)return;
  if(!draft.brand){setError('Choose a laptop brand before saving.');return;}
  if(!photos.length){setError('Add at least one laptop photo before saving.');return;}
  const data=Object.fromEntries(new FormData(e.currentTarget));
  if(regularPrice&&(Number(regularPrice)<Number(price)||Number(regularPrice)<=0)){setError('Regular price must be equal to or higher than the sale price.');return;}
  if(draft.defects.trim().length<5){setError('Choose the laptop condition notes or add your own details.');return;}
  if(Number(data.seller_warranty_months)>0&&String(data.warranty_terms||'').trim().length<10){setError('Describe the store warranty coverage in at least 10 characters.');return;}
  setBusy(true);onBusy(true);setError('');const uploaded:string[]=[];
  try{
   const images:string[]=[];
   for(const [index,photo] of photos.entries()){
    if(photo.file){setProgress(`Uploading photo ${index+1} of ${photos.length}`);const result=await uploadProductPhoto(photo.file);uploaded.push(result.path);images.push(result.url);}else images.push(photo.url);
   }
   setProgress('Saving your laptop');
   const title=listingTitle(draft.brand,draft.title);
   const payload={...data,...draft,title,description:String(data.description||'').trim()||listingDescription(title,String(data.condition),[draft.processor,draft.ram,draft.storage]),images,regular_price:regularPrice?Number(regularPrice):null,price:Number(data.price),stock_quantity:Number(data.stock_quantity),year:data.year?Number(data.year):null,seller_warranty_months:Number(data.seller_warranty_months),official_warranty_until:data.official_warranty_until||null};
   const {error}=await storeDb.rpc('admin_save_store_product',{_id:product?.id||null,_product:payload});if(error)throw error;onSaved();
  }catch(e){if(uploaded.length)await supabase.storage.from('marketplace-images').remove(uploaded);setError((e as {message?:string}).message||'Unable to save. Your changes are still here.');}
  finally{setBusy(false);onBusy(false);setProgress('');}
 }

 const sections=[['pe-details','Laptop details'],['pe-photos','Product photos'],['pe-condition','Condition & warranty'],['pe-pricing','Price & availability']];
 return <form className="sa-form pe-editor" onSubmit={save}>
  {error&&<div className="pe-error" role="alert">{error}</div>}
  <div className="pe-scroll"><div className="pe-layout">
   <fieldset disabled={busy} className="pe-fields">
    <section className="pe-section" id="pe-details">
     <div className="pe-section-heading"><span className="pe-section-icon"><Laptop size={20}/></span><div><h3>Laptop details</h3><p>The essentials buyers need to find the right laptop.</p></div></div>
     <div className="pe-section-body">
      <div className="pe-grid"><BrandSelect value={draft.brand} onChange={v=>change('brand',v)} disabled={busy}/><label>Model name<input required maxLength={200} placeholder="e.g. Latitude 5420" value={draft.title} onChange={e=>change('title',e.target.value)}/></label></div>
      <div className="pe-specs"><ProcessorFields value={draft.processor} onChange={v=>change('processor',v)} disabled={busy}/><StorageMemoryFields ram={draft.ram} storage={draft.storage} onChange={change} disabled={busy}/><GraphicsFields value={draft.graphics} onChange={v=>change('graphics',v)} disabled={busy}/></div>
      <div className="pe-grid"><label>Model year <span className="pe-optional">Optional</span><select name="year" defaultValue={product?.year||''}><option value="">Not specified</option>{Array.from({length:new Date().getFullYear()-1998},(_,i)=>new Date().getFullYear()+1-i).map(year=><option key={year} value={year}>{year}</option>)}</select></label><ChoiceField label="Screen" value={draft.display} options={['11.6-inch','12.5-inch','13.3-inch','13.6-inch','14-inch HD','14-inch Full HD','14-inch 2K','15.6-inch HD','15.6-inch Full HD','16-inch Full HD','16-inch 2K','17.3-inch Full HD']} onChange={v=>change('display',v)} disabled={busy}/><ChoiceField label="Battery" value={draft.battery} options={['Battery backup not measured','Around 1 hour of backup','Around 2 hours of backup','Around 3 hours of backup','Around 4 hours of backup','5 hours or more of backup','Needs charger to stay on','Battery replacement needed']} onChange={v=>change('battery',v)} disabled={busy}/><ChoiceField label="Included items" value={draft.accessories} options={['Laptop only','Laptop with original charger','Laptop with compatible charger','Laptop with charger and bag','Laptop with original box and charger','Laptop with charger, bag and mouse']} onChange={v=>change('accessories',v)} disabled={busy}/></div>
     </div>
    </section>
    <section className="pe-section" id="pe-photos">
     <div className="pe-section-heading"><span className="pe-section-icon"><Camera size={20}/></span><div><h3>Product photos</h3><p>Show the actual laptop, its details, and any visible wear.</p></div><span className="pe-count">{photos.length} / 8</span></div>
     <div className="pe-section-body">
      <label className={`pe-dropzone ${dragging?'is-dragging':''} ${photos.length>=8?'is-full':''}`} onDragOver={e=>{e.preventDefault();if(!busy)setDragging(true);}} onDragLeave={()=>setDragging(false)} onDrop={e=>{e.preventDefault();setDragging(false);addFiles(e.dataTransfer.files);}}>
       <input className="pe-file-input" aria-label="Upload laptop photos" type="file" accept="image/jpeg,image/png,image/webp" multiple disabled={busy||photos.length>=8} onChange={e=>{addFiles(e.target.files);e.target.value='';}}/>
       <span className="pe-upload-icon"><ImagePlus size={24} strokeWidth={1.6}/></span><span className="pe-upload-title">{photos.length>=8?'All 8 photo slots filled':<><b>Click to upload</b> or drag and drop</>}</span><span className="pe-upload-hint">JPG, PNG or WebP · Up to 5 MB per photo</span>
      </label>
      {photos.length>0&&<div className="pe-photo-grid">{photos.map((photo,index)=><article className={`pe-photo ${index===0?'is-cover':''}`} key={photo.id}>
       <div className="pe-photo-image"><img src={photo.url} alt={`Laptop photo ${index+1}`}/>{index===0&&<span className="pe-cover-badge"><Check size={12}/>Cover</span>}<button type="button" className="pe-photo-delete" aria-label={`Remove photo ${index+1}`} title="Remove photo" onClick={()=>removePhoto(photo)}><Trash2 size={16}/></button></div>
       <div className="pe-photo-footer"><span>Photo {String(index+1).padStart(2,'0')}</span>{index===0?<span className="pe-cover-note">Main image</span>:<button type="button" onClick={()=>setPhotos(current=>[photo,...current.filter(p=>p.id!==photo.id)])}>Set as cover</button>}</div>
      </article>)}</div>}
      <p className="pe-caption"><Sparkles size={14}/>Your cover photo appears first in the store. Photos are optimized automatically.</p>
     </div>
    </section>
    <section className="pe-section" id="pe-condition">
     <div className="pe-section-heading"><span className="pe-section-icon"><ShieldCheck size={20}/></span><div><h3>Condition & warranty</h3><p>Clear, honest details help buyers order with confidence.</p></div></div>
     <div className="pe-section-body"><div className="pe-grid"><label>Overall condition<select name="condition" defaultValue={product?.condition||'Good'}>{['Like new','Excellent','Good','Fair'].map(v=><option key={v}>{v}</option>)}</select></label><label>Store warranty <span className="pe-optional">Months</span><select name="seller_warranty_months" defaultValue={product?.seller_warranty_months||0}><option value="0">No store warranty</option>{Array.from(new Set([1,2,3,6,12,18,24,36,48,60,...(product?.seller_warranty_months?[product.seller_warranty_months]:[])])).sort((a,b)=>a-b).map(months=><option key={months} value={months}>{months} {months===1?'month':'months'}</option>)}</select></label></div>
      <ChoiceField label="Wear, repairs & known issues" value={draft.defects} options={['No known faults or repairs reported.','Light cosmetic marks from normal use.','Visible scratches or wear; see the actual photos.','Condition and repair history not yet confirmed.']} onChange={v=>change('defects',v)} disabled={busy} required hint="Choose an accurate description, or use Other for specific faults and repairs."/>
      <label>Warranty coverage <span className="pe-optional">If offered</span><textarea name="warranty_terms" maxLength={3000} placeholder="What's covered, exclusions, and how customers can claim." defaultValue={product?.warranty_terms||''}/></label>
      <details className="pe-details"><summary>Description & manufacturer warranty <ChevronDown size={16}/></summary><div className="pe-details-body"><label>Description <span className="pe-optional">Optional</span><textarea name="description" maxLength={5000} minLength={30} placeholder="Leave blank to create a description from the specifications." defaultValue={product?.description||''}/></label><label>Manufacturer warranty end date<input type="date" name="official_warranty_until" defaultValue={product?.official_warranty_until||''}/></label></div></details>
     </div>
    </section>
    <section className="pe-section" id="pe-pricing">
     <div className="pe-section-heading"><span className="pe-section-icon"><Package size={20}/></span><div><h3>Price & availability</h3><p>Set your price, stock, and when this laptop goes live.</p></div></div>
     <div className="pe-section-body"><div className="pe-grid pe-price-grid"><label>Sale price <span className="pe-optional">INR / laptop</span><input name="price" type="number" min="1" max="3000000" step="0.01" required placeholder="28,500" value={price} onChange={e=>setPrice(e.target.value)}/></label><label>Regular price <span className="pe-optional">Optional</span><input name="regular_price" type="number" min={price||1} max="3000000" step="0.01" placeholder="Before discount" value={regularPrice} onChange={e=>setRegularPrice(e.target.value)}/></label><label>Total stock <span className="pe-optional">Units</span><input name="stock_quantity" type="number" min="1" max="999" required defaultValue={product?.stock_quantity||1}/></label></div>
      <p className="pe-caption">The sale price is what customers pay. Add a higher regular price to show a crossed-out price and savings in the shop.</p>
      <label>Listing visibility<select name="status" value={visibility} onChange={e=>setVisibility(e.target.value as Listing['status'])}><option value="draft">Draft — hidden from customers</option><option value="published">Published — available in the store</option><option value="sold">Sold — unavailable to buy</option></select></label>
      <div className="pe-fulfilment"><Truck size={19}/><div><b>Pickup & delivery are already taken care of</b><p>Your store settings apply automatically to this laptop.</p></div><CheckCircle2 size={18}/></div>
     </div>
    </section>
   </fieldset>
   <aside className="pe-sidebar"><div className="pe-preview"><div className="pe-preview-image">{photos[0]?<img src={photos[0].url} alt="Listing cover preview"/>:<Laptop size={48} strokeWidth={1}/>}<span className={`pe-status pe-status-${visibility}`}>{visibility}</span></div><div className="pe-preview-body"><span className="pe-eyebrow">Listing preview</span><h4>{draft.title?listingTitle(draft.brand,draft.title):'Your next great listing'}</h4><p>{[draft.ram,draft.storage].filter(v=>v!==UNKNOWN_SPEC).join(' · ')||'Your laptop details will appear here.'}</p>{Number(price)>0?<ProductPrice price={Number(price)} regularPrice={Number(regularPrice)}/>:<strong>Set your price</strong>}</div></div><nav className="pe-jump" aria-label="Listing sections"><span className="pe-eyebrow">In this listing</span>{sections.map(([id,label])=><button type="button" key={id} onClick={()=>document.getElementById(id)?.scrollIntoView({behavior:'smooth',block:'start'})}>{label}<ChevronDown size={14}/></button>)}</nav><p className="pe-sidebar-note"><ShieldCheck size={16}/>Saving a draft keeps your listing private until you are ready to publish.</p></aside>
  </div></div>
  <footer className="pe-actions"><span role="status">{busy?<><Loader2 size={16} className="pe-spin"/>{progress}</>:<><span className={`pe-status-dot ${visibility==='published'?'is-live':''}`}/>{visibility==='published'?'Ready to publish to your store':visibility==='sold'?'Save as unavailable':'Save privately as a draft'}</>}</span><div><button type="button" className="pe-cancel" disabled={busy} onClick={onCancel}>Cancel</button><button type="submit" className="pe-save" disabled={busy}>{busy?<Loader2 size={16} className="pe-spin"/>:<Save size={16}/>}<span>{busy?'Saving...':visibility==='published'?'Save & publish':'Save laptop'}</span></button></div></footer>
 </form>;
}
