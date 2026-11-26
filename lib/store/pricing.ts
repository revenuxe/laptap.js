export function priceReduction(price:number,regularPrice?:number|null){
 if(!Number.isFinite(price)||price<=0||!regularPrice||!Number.isFinite(regularPrice)||regularPrice<=price)return null;
 const saving=Math.round((regularPrice-price)*100)/100;
 return {regularPrice,saving,percent:Math.floor(saving/regularPrice*100)};
}
