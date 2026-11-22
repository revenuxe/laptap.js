const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const exportsObject = {};
vm.runInNewContext(ts.transpileModule(fs.readFileSync('lib/store/domain.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,{exports:exportsObject,Intl,Date});
const { filterListings, warrantyActive, money } = exportsObject;
const fixtures = [
 {id:'a',title:'MacBook Air',brand:'Apple',processor:'M2',location:'Bangalore',category:'laptop',condition:'Excellent',verified_at:'2026-11-20',price:65000,created_at:'2026-11-20'},
 {id:'b',title:'OptiPlex',brand:'Dell',processor:'Intel i5',location:'Bangalore',category:'desktop',condition:'Good',verified_at:null,price:18000,created_at:'2026-11-21'},
 {id:'c',title:'ThinkPad',brand:'Lenovo',processor:'Intel i5',location:'Mysore',category:'laptop',condition:'Good',verified_at:null,price:28000,created_at:'2026-11-22'},
];
test('catalog combines search, category, condition, verification and budget',()=>{
 const result=filterListings(fixtures,'apple','laptop','Excellent',true,70000,'new');
 assert.equal(result.length,1);assert.equal(result[0].id,'a');
 assert.equal(filterListings(fixtures,'','all','',true,30000,'new').length,0);
 assert.equal(filterListings(fixtures,'INTEL','desktop','Good',false,20000,'new')[0].id,'b');
});
test('price and newest sorts do not mutate source listings',()=>{
 assert.equal(filterListings(fixtures,'','all','',false,300000,'low')[0].id,'b');
 assert.equal(filterListings(fixtures,'','all','',false,300000,'high')[0].id,'a');
 assert.equal(filterListings(fixtures,'','all','',false,300000,'new')[0].id,'c');
 assert.equal(fixtures[0].id,'a');
});
test('official coverage is active through end date and expired afterwards',()=>{
 const now=new Date('2026-11-22T12:00:00Z');
 assert.equal(warrantyActive('2026-11-22',now),true);
 assert.equal(warrantyActive('2026-11-21',now),false);
 assert.equal(warrantyActive(null,now),false);
 assert.match(money(65000),/65,000/);
});
