import type { IssueHistoryType } from '@tegonhq/types';

import {
  type IAnyStateTreeNode,
  type Instance,
  types,
  flow,
} from 'mobx-state-tree';

import { tegonDatabase } from 'store/database';

import { IssueHistory } from './models';

export const IssueHistoryStore: IAnyStateTreeNode = types
  .model({
    issueHistories: types.array(IssueHistory),
    issueId: types.union(types.string, types.undefined),
  })
  .actions((self) => {
    const update = (issueHistory: IssueHistoryType, id: string) => {
      const indexToUpdate = self.issueHistories.findIndex(
        (obj) => obj.id === id,
      );

      if (indexToUpdate !== -1) {
        // Update the object at the found index with the new data
        self.issueHistories[indexToUpdate] = {
          ...self.issueHistories[indexToUpdate],
          ...issueHistory,
          // TODO fix the any and have a type with Issuetype
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any;
      } else {
        self.issueHistories.push(issueHistory);
      }
    };
    const deleteById = (id: string) => {
      const indexToDelete = self.issueHistories.findIndex(
        (obj) => obj.id === id,
      );

      if (indexToDelete !== -1) {
        self.issueHistories.splice(indexToDelete, 1);
      }
    };

    const load = flow(function* (issueId: string) {
      self.issueId = issueId;

      const issueHistories = issueId
        ? yield tegonDatabase.issueHistory
            .where({
              issueId,
            })
            .toArray()
        : [];

      self.issueHistories = issueHistories;
    });

    return { update, deleteById, load };
  })
  .views((self) => ({
    getIssueHistories(issueId: string) {
      return issueId === self.issueId ? self.issueHistories : [];
    },
  }));

export type IssueHistoryStoreType = Instance<typeof IssueHistoryStore>;
