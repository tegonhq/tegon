/** Copyright (c) 2024, Tegon, all rights reserved. **/

import React from 'react';
import { useHotkeysContext } from 'react-hotkeys-hook';

export function useScope(scope: string) {
  const { enableScope, disableScope } = useHotkeysContext();

  React.useEffect(() => {
    enableScope(scope);

    return () => {
      disableScope(scope);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
