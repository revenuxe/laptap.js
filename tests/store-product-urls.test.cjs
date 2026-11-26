const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm'),ts=require('typescript');
const compile=path=>ts.transpileModule(fs.readFileSync(path,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true}}).outputText;
const domain={};vm.runInNewContext(compile('lib/store/domain.ts'),{exports:domain});
const product={id:'00000000-0000-0000-0000-000000000001',seo_path:'dell/vostro',title:'Dell Vostro',brand:'Dell',category:'laptop',price:13999,condition:'Good',processor:'Intel i3',ram:'8 GB',storage:'256 GB SSD',images:[],status:'published'};
function route(record=product){
 const api={},lookups=[];
 vm.runInNewContext(compile('components/store/StoreProductPage.tsx'),{exports:api,URL,require:name=>{
  if(name==='react/jsx-runtime')return {jsx:(type,props)=>({type,props}),jsxs:(type,props)=>({type,props}),Fragment:'fragment'};
  if(name==='next/navigation')return {permanentRedirect:url=>{throw new Error('308:'+url);},notFound:()=>{throw new Error('404');}};
  if(name==='@/lib/store/server')return {getStoreProduct:async path=>{lookups.push(path);return record;}};
  if(name==='@/lib/store/domain')return domain;
  if(name==='@/components/store/ProductDetail')return ()=>null;
  throw new Error('Unexpected import '+name);
 }});
 return {api,lookups};
}
test('product URLs include laptop and preserve deep model slugs and UUID fallback',()=>{
 assert.equal(domain.productUrl(product),'/store/laptop/dell/vostro');
 assert.equal(domain.productUrl({...product,seo_path:'dell/latitude/5420'}),'/store/laptop/dell/latitude/5420');
 assert.equal(domain.productUrl({id:product.id}),'/store/laptop/'+product.id);
});
test('old readable and UUID product paths permanently redirect to the new canonical URL',async()=>{
 for(const path of ['dell/vostro',product.id]){
  const {api}=route();await assert.rejects(api.default({path}),{message:'308:/store/laptop/dell/vostro'});
 }
});
test('new product path renders without a redirect and looks up the existing database slug',async()=>{
 const {api,lookups}=route();const page=await api.default({path:'laptop/dell/vostro'});
 assert.deepEqual(lookups,['dell/vostro']);
 const schema=JSON.parse(page.props.children[0].props.dangerouslySetInnerHTML.__html);
 assert.equal(schema.offers.url,'https://www.laptap.in/store/laptop/dell/vostro');
});
test('old and new paths publish the same canonical and social URL',async()=>{
 const {api}=route();for(const path of ['dell/vostro','laptop/dell/vostro']){
  const metadata=await api.generateProductMetadata({path});
  assert.equal(metadata.alternates.canonical,'https://www.laptap.in/store/laptop/dell/vostro');
  assert.equal(metadata.openGraph.url,metadata.alternates.canonical);
 }
});
test('missing products still return not found',async()=>{
 const {api}=route(null);await assert.rejects(api.default({path:'laptop/missing/model'}),{message:'404'});
});
