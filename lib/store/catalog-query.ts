/** Whitelist search tokens before building PostgreSQL prefix-search syntax. */
export function catalogSearch(query: string) { return (query.normalize('NFKC').match(/[\p{L}\p{N}]+/gu) || []).slice(0, 12).map(word => `${word.slice(0, 60)}:*`).join(' & '); }
export const CATALOG_PAGE_SIZE = 24;
export const CATALOG_COLUMNS = 'id,seo_path,seller_id,seller_name,title,brand,category,price,year,condition,processor,ram,storage,location,images,status,verified_at,created_at,is_demo';
