import CategoryLanding from '@/components/store/CategoryLanding';
import {categoryMetadata} from '@/lib/store/category-domain';
export const metadata=categoryMetadata('desktop');
export default function Page(){return <CategoryLanding category="desktop"/>;}
