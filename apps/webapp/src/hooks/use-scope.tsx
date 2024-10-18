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

// Disable the scope in that specific component
// Example: we don't want f to be triggered for filter when it's in new issue screen
export function useDisableScope(scope: string) {
  const { enableScope, disableScope } = useHotkeysContext();

  React.useEffect(() => {
    disableScope(scope);

    return () => {
      enableScope(scope);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
