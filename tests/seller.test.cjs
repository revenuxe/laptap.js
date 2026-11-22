const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const api={};vm.runInNewContext(ts.transpileModule(fs.readFileSync('lib/store/seller-domain.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2021}}).outputText,{exports:api});
test('seller approval controls preparation and publication independently',()=>{
 for(const status of ['pending','active','rejected','suspended']){assert.equal(api.canPublish({status}),status==='active');assert.equal(api.canPrepareProducts({status}),['pending','active'].includes(status));}
 assert.equal(api.canPublish(null),false);assert.equal(api.canPrepareProducts(null),false);
});
test('applications require complete contact and business details',()=>{
 const valid={full_name:'Test Seller',shop_name:'Test Shop',phone:'9000000000',city:'Bangalore',business_address:'Test business address, Bangalore 560001',about:'',tax_id:''};
 assert.equal(api.applicationError(valid),'');assert.match(api.applicationError({...valid,business_address:'short'}),/address/);assert.match(api.applicationError({...valid,shop_name:'x'}),/shop/);assert.match(api.applicationError({...valid,phone:'1'}),/phone/);
});
test('uploads accept supported image files within the bucket limit',()=>{
 assert.equal(api.photoError({type:'image/jpeg',size:5*1024*1024}),'');assert.match(api.photoError({type:'image/png',size:5*1024*1024+1}),/5 MB/);assert.match(api.photoError({type:'image/svg+xml',size:100}),/JPG/);
});
test('seller metrics exclude samples and distinguish fulfilment from payments',()=>{
 const metrics=api.sellerMetrics([{status:'published',is_demo:true},{status:'published'},{status:'draft'}],[{status:'confirmed',payment_status:'paid',amount:'15000'},{status:'cancelled',payment_status:'paid',amount:1000},{status:'delivered',payment_status:'unpaid',amount:2000}],[{status:'new'},{status:'closed'}]);
 assert.equal(metrics.published,1);assert.equal(metrics.drafts,1);assert.equal(metrics.toShip,1);assert.equal(metrics.openEnquiries,1);assert.equal(metrics.recordedSales,15000);
});
