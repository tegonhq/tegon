import type { CommonStoreType } from 'store/common';
import { useContextStore } from 'store/global-context-provider';

export const useCommonStore = (): CommonStoreType => {
  const { commonStore } = useContextStore();

  return commonStore;
};
