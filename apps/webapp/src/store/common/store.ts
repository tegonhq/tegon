import { type IAnyStateTreeNode, types } from 'mobx-state-tree';

export const defaultCommonStoreValue: {
  chatOpen: boolean;
} = {
  chatOpen: false,
};

export const CommonStore: IAnyStateTreeNode = types
  .model({
    chatOpen: types.boolean,
    currentConversationId: types.union(types.undefined, types.string),
    conversationStreaming: types.union(types.undefined, types.boolean),
  })
  .actions((self) => ({
    update(data: Partial<typeof self>) {
      Object.entries(data).forEach(([key, value]) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (self as any)[key] = value;
      });
    },
  }));

export interface CommonStoreType {
  chatOpen: boolean;
  update: (data: Partial<CommonStoreType>) => void;
}
