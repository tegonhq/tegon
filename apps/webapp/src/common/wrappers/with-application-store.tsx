import type { NextLayoutComponentType } from 'next';

import { usePathname } from 'next/navigation';
import React from 'react';

import { useContextStore } from 'store/global-context-provider';

export function withApplicationStore(
  Component: React.ComponentType,
): NextLayoutComponentType {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ComponentWithApplicationStore = (props: any) => {
    const pathname = usePathname();
    const { applicationStore } = useContextStore();
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
      if (pathname) {
        setLoading(true);
        applicationStore.load(pathname);
        setLoading(false);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname]);

    if (loading) {
      return null;
    }

    return <Component {...props} />;
  };

  return ComponentWithApplicationStore;
}
