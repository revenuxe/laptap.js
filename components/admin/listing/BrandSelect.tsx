"use client";
import {useId,useState} from 'react';
import {Check,ChevronsUpDown,Plus} from 'lucide-react';
import {Popover,PopoverContent,PopoverTrigger} from '@/components/ui/popover';
import {Command,CommandEmpty,CommandGroup,CommandInput,CommandItem,CommandList} from '@/components/ui/command';
import {brandKeywords,canonicalBrand,laptopBrands} from '@/lib/store/brands';
import './brand-select.css';
export default function BrandSelect({value,onChange,disabled}:{value:string;onChange:(value:string)=>void;disabled?:boolean}){
  const id=useId(),[open,setOpen]=useState(false),[custom,setCustom]=useState(false);
  const selected=canonicalBrand(value),known=laptopBrands.some(brand=>brand===selected);
  return <div className="sc-brand-field"><span id={`${id}-label`}>Brand</span>
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild><button id="seller-brand" type="button" role="combobox" aria-labelledby={`${id}-label ${id}-value`} aria-expanded={open} aria-required="true" disabled={disabled} className="sc-brand-trigger"><span id={`${id}-value`}>{selected||'Select a laptop brand'}</span><ChevronsUpDown size={16}/></button></PopoverTrigger>
      <PopoverContent className="sc-brand-popover" align="start" collisionPadding={12}>
        <Command><CommandInput placeholder="Search brand or series..." aria-label="Search laptop brands"/><CommandList aria-label="Laptop brands"><CommandEmpty>No matching brand. Choose Add another brand below.</CommandEmpty><CommandGroup>{laptopBrands.map(brand=><CommandItem key={brand} value={brand} keywords={brandKeywords(brand)} onSelect={()=>{onChange(brand);setCustom(false);setOpen(false);}}><Check size={16} className={selected===brand?'sc-brand-check':'sc-brand-unchecked'}/>{brand}</CommandItem>)}</CommandGroup></CommandList></Command>
        <button type="button" className="sc-brand-other" onClick={()=>{setCustom(true);setOpen(false);if(known)onChange('');}}><Plus size={16}/>Add another brand</button>
      </PopoverContent>
    </Popover>
    {(custom||!!value&&!known)&&<label className="sc-brand-custom" htmlFor={`${id}-custom`}>Brand name<input id={`${id}-custom`} name="brand" value={value} onChange={e=>onChange(e.target.value)} required maxLength={100} disabled={disabled} placeholder="Enter the manufacturer name"/><small>Use the manufacturer name, such as Dell or Lenovo.</small></label>}
  </div>;
}
