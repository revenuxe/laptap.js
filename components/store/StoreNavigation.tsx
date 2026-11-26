"use client";

import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {createContext, forwardRef, useContext, useMemo, useTransition, type ComponentProps, type ReactNode} from 'react';

const NavigationContext = createContext<ReturnType<typeof useRouter> | null>(null);

export function StoreNavigationProvider({children}:{children:ReactNode}) {
 const router = useRouter();
 const [pending, startTransition] = useTransition();
 const navigation = useMemo(() => ({...router,
  push: (...args:Parameters<typeof router.push>) => startTransition(() => router.push(...args)),
  replace: (...args:Parameters<typeof router.replace>) => startTransition(() => router.replace(...args)),
 }), [router]);
 return <NavigationContext.Provider value={navigation}>
  {children}
  {pending && <div className="store-navigation-loading" role="status" aria-live="polite">
   <div className="store-navigation-track" aria-hidden="true"><span/></div>
   <div className="store-navigation-pill"><span className="store-spinner" aria-hidden="true"/>Loading page</div>
  </div>}
 </NavigationContext.Provider>;
}

export function useStoreRouter() {
 const navigation = useContext(NavigationContext);
 const router = useRouter();
 return navigation ?? router;
}

const StoreLink = forwardRef<HTMLAnchorElement, ComponentProps<typeof Link>>(function StoreLink({onNavigate, href, replace, scroll, ...props}, ref) {
 const navigation = useContext(NavigationContext);
 return <Link {...props} ref={ref} href={href} replace={replace} scroll={scroll} onNavigate={event => {
  let cancelled = false;
  onNavigate?.({preventDefault: () => {cancelled = true; event.preventDefault();}});
  if (cancelled || !navigation || typeof href !== 'string') return;
  event.preventDefault();
  navigation[replace ? 'replace' : 'push'](href, {scroll});
 }}/>;
});
export default StoreLink;
