const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const exportsObject = {};
vm.runInNewContext(ts.transpileModule(fs.readFileSync('lib/store/admin-domain.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2021}}).outputText,{exports:exportsObject});
const { csvCell, storeMetrics, orderTransitions } = exportsObject;
test('admin metrics separate stock, fulfilment, inspections, and recorded sales',()=>{
 const p=[{seller_id:'s1',status:'published',verified_at:null},{seller_id:'s1',status:'published',verified_at:'2026-11-22'},{status:'sold',verified_at:null}];
 const sellers=[{id:'s1',status:'active'},{id:'s2',status:'suspended'}];
 const orders=[{status:'pending',payment_status:'unpaid',amount:10000},{status:'confirmed',payment_status:'paid',amount:'20000'},{status:'delivered',payment_status:'paid',amount:30000},{status:'refunded',payment_status:'refunded',amount:5000},{status:'cancelled',payment_status:'paid',amount:1000}];
 const m=storeMetrics(p,sellers,orders,[{status:'new'},{status:'closed'}],[{status:'open'},{status:'reviewing'},{status:'resolved'}]);
 assert.equal(m.available,2);assert.equal(m.sellers,1);assert.equal(m.pending,2);assert.equal(m.recordedSales,50000);assert.equal(m.inspections,1);assert.equal(m.newInquiries,1);assert.equal(m.openReturns,2);
});
test('CSV protects spreadsheet formulas and escapes quotes and line breaks',()=>{
 assert.equal(csvCell('=SUM(A1)'), '"\'=SUM(A1)"');
 assert.equal(csvCell('@command'), '"\'@command"');
 assert.equal(csvCell('Shop "A"\nB'),'"Shop ""A""\nB"');
 assert.equal(csvCell(null),'""');
});
test('fulfilment requires explicit intermediate states and terminal orders cannot restart',()=>{
 assert.ok(orderTransitions.pending.includes('confirmed'));
 assert.ok(!orderTransitions.pending.includes('shipped'));
 assert.ok(orderTransitions.confirmed.includes('shipped'));
 assert.ok(orderTransitions.shipped.includes('delivered'));
 assert.ok(orderTransitions.delivered.includes('return_requested'));
 assert.ok(orderTransitions.return_requested.includes('refunded'));
 assert.equal(orderTransitions.refunded.length,0);
 assert.equal(orderTransitions.cancelled.length,0);
});

test('available stock excludes suspended seller listings',()=>{
 const m=storeMetrics([{seller_id:'s1',status:'published'},{seller_id:'s2',status:'published'}],[{id:'s1',status:'active'},{id:'s2',status:'suspended'}],[],[],[]);
 assert.equal(m.available,1);
});

test('demo listings do not count as available stock or pending inspections',()=>{
 const m=storeMetrics([{seller_id:'s1',status:'published',is_demo:true,verified_at:null}],[{id:'s1',status:'active'}],[],[],[]);
 assert.equal(m.available,0);assert.equal(m.inspections,0);
});
