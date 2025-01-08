import { useHotkeys } from 'react-hotkeys-hook';
import { Key } from 'ts-key-enum';

import { SCOPES } from 'common/scopes';

import { useContextStore } from 'store/global-context-provider';

export const useSidebarShortcut = () => {
  const { applicationStore } = useContextStore();

  useHotkeys(
    [`${Key.Meta}+b`],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    () => {
      applicationStore.updateSideBar(!applicationStore.sidebarCollapsed);
    },
    {
      scopes: [SCOPES.Global],
    },
  );
};
