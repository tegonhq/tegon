/* eslint-disable dot-location */
/** Copyright (c) 2024, Tegon, all rights reserved. **/
import { type IAnyStateTreeNode, type Instance, types } from 'mobx-state-tree';

import type { IssueType } from 'common/types/issue';

import { tegonDatabase } from 'store/database';

import { IssueHistory } from './models';

export const IssueHistoryStore: IAnyStateTreeNode = types
  .model({
    issueHistories: types.array(IssueHistory),
  })
  .actions((self) => ({
    update(issue: IssueType, id: string) {
      const indexToUpdate = self.issueHistories.findIndex(
        (obj) => obj.id === id,
      );

      if (indexToUpdate !== -1) {
        // Update the object at the found index with the new data
        self.issueHistories[indexToUpdate] = {
          ...self.issueHistories[indexToUpdate],
          ...issue,
          // TODO fix the any and have a type with Issuetype
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any;
      } else {
        self.issueHistories.push(issue);
      }
    },
    delete(id: string) {
      const indexToDelete = self.issueHistories.findIndex(
        (obj) => obj.id === id,
      );

      if (indexToDelete !== -1) {
        self.issueHistories.splice(indexToDelete, 1);
      }
    },
  }));

export type IssueHistoryStoreType = Instance<typeof IssueHistoryStore>;

export let issueHistoryStore: IssueHistoryStoreType;

export async function resetIssueHistoryStore() {
  issueHistoryStore = undefined;
}

export async function initializeIssueHistoryStore(issueId: string) {
  let _store = issueHistoryStore;

  if (!issueHistoryStore) {
    const issueHistories = issueId
      ? await tegonDatabase.issueHistory
          .where({
            issueId,
          })
          .toArray()
      : [];

    _store = IssueHistoryStore.create({
      issueHistories,
    });
  }

  // If your page has Next.js data fetching methods that use a Mobx store, it will
  // get hydrated here, check `pages/ssg.tsx` and `pages/ssr.tsx` for more details
  // if (snapshot) {
  //   applySnapshot(_store, snapshot);
  // }
  // For SSG and SSR always create a new store
  if (typeof window === 'undefined') {
    return _store;
  }
  // Create the store once in the client
  if (!issueHistoryStore) {
    issueHistoryStore = _store;
  }

  return issueHistoryStore;
}
