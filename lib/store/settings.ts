export type StoreSettings = {
 pickup_hours:string; delivery_estimate:string; delivery_terms:string;
 id: boolean; owner_id: string | null; name: string; tagline: string; email: string;
 phone: string; city: string; address: string; pickup_instructions: string;
 delivery_available: boolean; pickup_available: boolean; delivery_fee: number; delivery_pincodes: string[];
};
export const defaultStoreSettings: StoreSettings = { pickup_hours:"",delivery_estimate:"",delivery_terms:"",id:true,owner_id:null,name:'Laptap Store',tagline:'Find a device that fits your next chapter.',email:'',phone:'',city:'',address:'',pickup_instructions:'',delivery_available:false,pickup_available:true,delivery_fee:0,delivery_pincodes:[] };
