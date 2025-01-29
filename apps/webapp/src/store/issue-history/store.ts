import {
  type IAnyStateTreeNode,
  type Instance,
  types,
  flow,
} from 'mobx-state-tree';

import type { IssueHistoryType } from 'common/types';

import { tegonDatabase } from 'store/database';

import { IssueHistoriesModel } from './models';

export const IssueHistoryStore: IAnyStateTreeNode = types
  .model({
    issueHistories: types.map(IssueHistoriesModel),
  })
  .actions((self) => {
    const update = (issueHistory: IssueHistoryType, id: string) => {
      const issueId = issueHistory.issueId;
      if (!self.issueHistories.has(issueId)) {
        self.issueHistories.set(issueId, IssueHistoriesModel.create([]));
      }

      const issueHistoriesArray = self.issueHistories.get(issueId);
      const indexToUpdate = issueHistoriesArray.findIndex(
        (obj) => obj.id === id,
      );

      if (indexToUpdate !== -1) {
        // Update the object at the found index with the new data
        issueHistoriesArray[indexToUpdate] = {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ...(issueHistoriesArray[indexToUpdate] as any),
          ...issueHistory,
        };
      } else {
        issueHistoriesArray.push(issueHistory);
      }
    };
    const deleteById = (id: string) => {
      // Iterate through all history arrays in the map
      for (const [
        issueId,
        issueHistoriesArray,
      ] of self.issueHistories.entries()) {
        const indexToDelete = issueHistoriesArray.findIndex(
          (obj) => obj.id === id,
        );

        if (indexToDelete !== -1) {
          issueHistoriesArray.splice(indexToDelete, 1);
          // If the histories array is empty, we can remove it from the map
          if (issueHistoriesArray.length === 0) {
            self.issueHistories.delete(issueId);
          }
          break; // Exit loop once we've found and deleted the comment
        }
      }
    };

    const load = flow(function* (issueId: string) {
      const issueHistories = issueId
        ? yield tegonDatabase.issueHistory
            .where({
              issueId,
            })
            .toArray()
        : [];

      if (issueHistories.length > 0) {
        self.issueHistories.set(
          issueId,
          IssueHistoriesModel.create(issueHistories),
        );
      }
    });

    return { update, deleteById, load };
  })
  .views((self) => ({
    getIssueHistories(issueId: string): IssueHistoryType[] {
      return self.issueHistories.has(issueId)
        ? self.issueHistories.get(issueId)
        : [];
    },
  }));

export type IssueHistoryStoreType = Instance<typeof IssueHistoryStore>;
