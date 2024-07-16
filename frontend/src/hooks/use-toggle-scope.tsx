import React from 'react';
import { useHotkeysContext } from 'react-hotkeys-hook';

export function useToggleScope(scope: string) {
  const { enableScope, disableScope } = useHotkeysContext();

  React.useEffect(() => {
    disableScope(scope);

    return () => {
      enableScope(scope);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
