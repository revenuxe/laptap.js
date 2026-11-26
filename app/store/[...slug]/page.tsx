import StoreProductPage, {generateProductMetadata} from '@/components/store/StoreProductPage';
type Props = {params: Promise<{slug: string[]}>};
export async function generateMetadata({params}:Props){return generateProductMetadata({path:(await params).slug.join('/')});}
export default async function Page({params}:Props){return StoreProductPage({path:(await params).slug.join('/')});}
