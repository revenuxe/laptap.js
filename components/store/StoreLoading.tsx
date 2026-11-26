export function StoreSpinner(){return <span className="store-spinner" aria-hidden="true"/>;}

export default function StoreLoading({label='Loading your store…'}:{label?:string}){
 return <div className="store-loading-view" role="status" aria-busy="true">
  <div className="store-loading-caption"><StoreSpinner/><span>{label}</span></div>
  <div className="store-loading-skeleton" aria-hidden="true"><div className="store-loading-photo"/><div className="store-loading-copy"><i/><i/><i/><div/><i/></div></div>
 </div>;
}
