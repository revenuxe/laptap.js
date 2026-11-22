export const stockAvailable=(p:{stock_available?:number;status?:string})=>Math.max(0,p.stock_available??(p.status==='sold'?0:1));
export function orderQuantity(value:unknown,maximum=8){const n=Number(value);return Number.isInteger(n)&&n>=1?Math.min(n,maximum,8):1;}
