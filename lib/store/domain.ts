export type Listing = {
    seo_path?: string;
    review_status?:import('@/lib/managed/domain').ReviewStatus;
    commission_terms?:{version:number;price:number;rate_bps:number;commission:number;seller_net:number;acceptance_hours:number};
    verification_fee_eligible?:boolean;
    delivery_available?: boolean;
    pickup_available?: boolean;
    delivery_fee?: number;
    delivery_pincodes?: string[];
    pickup_address?: string;
    pickup_instructions?: string;
    is_demo?: boolean;
    id: string;
    seller_id: string;
    seller_name: string;
    title: string;
    brand: string;
    category: 'laptop' | 'desktop';
    price: number;
    year: number | null;
    condition: 'Like new' | 'Excellent' | 'Good' | 'Fair';
    description: string;
    processor: string;
    ram: string;
    storage: string;
    graphics: string;
    display: string;
    battery: string;
    defects: string;
    accessories: string;
    location: string;
    official_warranty_until: string | null;
    seller_warranty_months: number;
    warranty_terms: string;
    images: string[];
    status: 'published' | 'sold' | 'draft';
    verified_at: string | null;
    verification_notes: string;
    created_at: string;
};
export const money = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2, minimumFractionDigits: 0 }).format(value);
export const warrantyActive = (date: string | null, now = new Date()) => !!date && date >= now.toISOString().slice(0, 10);
export function filterListings(items: Listing[], query: string, category: string, condition: string, verified: boolean, budget: number, sort: string) {
    return items.filter(p => `${p.title} ${p.brand} ${p.processor} ${p.location}`.toLowerCase().includes(query.toLowerCase()) && (category === 'all' || p.category === category) && (!condition || p.condition === condition) && (!verified || !!p.verified_at) && p.price <= budget).sort((a, b) => sort === 'low' ? a.price - b.price : sort === 'high' ? b.price - a.price : b.created_at.localeCompare(a.created_at));
}

export const productUrl = (product: Pick<Listing, "id" | "seo_path">) => `/store/${product.seo_path || product.id}`;
