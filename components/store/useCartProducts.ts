"use client";
import {useEffect,useState} from 'react';
import {storeDb,storeError} from '@/lib/store/client';
import type {Listing} from '@/lib/store/domain';
export function useCartProducts(ids:string[]){const [products,setProducts]=useState<Listing[]>([]),[loading,setLoading]=useState(true),[error,setError]=useState(''),[revision,setRevision]=useState(0);const key=ids.join(',');useEffect(()=>{const controller=new AbortController();setError('');setLoading(true);if(!ids.length){setProducts([]);setLoading(false);return;}storeDb.from('marketplace_listings').select('*').is('deleted_at',null).in('id',ids.slice(0,8)).eq('status','published').eq('category','laptop').abortSignal(controller.signal).then(({data,error})=>{if(controller.signal.aborted)return;if(error)setError(storeError);else setProducts(data||[]);setLoading(false);});return()=>controller.abort();},[key,revision]);return {products,loading,error,reload:()=>setRevision(n=>n+1)};}
