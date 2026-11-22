import CategoryLanding from '@/components/store/CategoryLanding';
import {categoryMetadata} from '@/lib/store/category-domain';
export const metadata=categoryMetadata('laptop');
export default function Page(){return <CategoryLanding category="laptop"/>;}
