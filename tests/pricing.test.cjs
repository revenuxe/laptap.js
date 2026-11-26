const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm'),ts=require('typescript');
const output={};
vm.runInNewContext(ts.transpileModule(fs.readFileSync('lib/store/pricing.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,{exports:output});
const {priceReduction}=output;
test('sale savings use the entered regular price and round percentage down',()=>{
 const result=priceReduction(28500,35000);
 assert.equal(result.saving,6500);assert.equal(result.percent,18);assert.equal(result.regularPrice,35000);
 assert.equal(priceReduction(999.99,1299.99).saving,300);
});
test('missing, equal, lower, or invalid regular prices never invent a discount',()=>{
 for(const regular of [undefined,null,0,28000,28500,NaN,Infinity])assert.equal(priceReduction(28500,regular),null);
 for(const sale of [0,-1,NaN,Infinity])assert.equal(priceReduction(sale,35000),null);
});
