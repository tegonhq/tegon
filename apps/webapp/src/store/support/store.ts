import {
  type IAnyStateTreeNode,
  type Instance,
  types,
  flow,
} from 'mobx-state-tree';

import type { SupportType } from 'common/types';

import { tegonDatabase } from 'store/database';

import { Support } from './models';

export const SupportStore: IAnyStateTreeNode = types
  .model({
    supportMetadata: types.map(Support),
  })
  .actions((self) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const update = (supportMetadata: SupportType, _id: string) => {
      const issueId = supportMetadata.issueId;
      if (!self.supportMetadata.has(issueId)) {
        self.supportMetadata.set(issueId, Support.create(supportMetadata));
      } else {
        // Simply update the existing support metadata
        const existingSupport = self.supportMetadata.get(issueId);
        Object.assign(existingSupport, supportMetadata);
      }
    };
    const deleteById = (id: string) => {
      // Find the support metadata with matching id and remove it
      for (const [issueId, supportMetadata] of self.supportMetadata.entries()) {
        if (supportMetadata.id === id) {
          self.supportMetadata.delete(issueId);
          break;
        }
      }
    };

    const load = flow(function* () {
      const supportMetadataArray = yield tegonDatabase.support.toArray();

      supportMetadataArray.forEach((metadata: SupportType) => {
        self.supportMetadata.set(metadata.issueId, Support.create(metadata));
      });
    });

    return { update, deleteById, load };
  })
  .views((self) => ({
    getSupportMetadataForIssue(issueId: string) {
      return self.supportMetadata.get(issueId);
    },
  }));

export type SupportStoreType = Instance<typeof SupportStore>;
