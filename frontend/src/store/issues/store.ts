/* eslint-disable dot-location */
/** Copyright (c) 2024, Tegon, all rights reserved. **/
import { IAnyStateTreeNode, Instance, types } from 'mobx-state-tree';

import { IssueType } from 'common/types/issue';

import { tegonDatabase } from 'store/database';
import { MODELS } from 'store/models';

import { Issue } from './models';

const modelName = MODELS.Issue;

export const IssuesStore: IAnyStateTreeNode = types
  .model({
    issues: types.array(Issue),
    lastSequenceId: types.union(types.undefined, types.number),
  })
  .actions((self) => ({
    update(issue: IssueType, id: string) {
      const indexToUpdate = self.issues.findIndex((obj) => obj.id === id);

      if (indexToUpdate !== -1) {
        // Update the object at the found index with the new data
        self.issues[indexToUpdate] = {
          ...self.issues[indexToUpdate],
          ...issue,
          // TODO fix the any and have a type with Issuetype
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any;
      } else {
        self.issues.push(issue);
      }
    },
    delete(id: string) {
      const indexToDelete = self.issues.findIndex((obj) => obj.id === id);

      if (indexToDelete !== -1) {
        self.issues.splice(indexToDelete, 1);
      }
    },
    updateLastSequenceId(lastSequenceId: number) {
      self.lastSequenceId = lastSequenceId;
    },
  }));

export type IssuesStoreType = Instance<typeof IssuesStore>;

export let issuesStore: IssuesStoreType;

export async function resetIssuesStore() {
  issuesStore = undefined;
}

export async function initializeIssuesStore(teamId: string) {
  let _store = issuesStore;

  if (!issuesStore) {
    const issues = teamId
      ? await tegonDatabase.issues
          .where({
            teamId,
          })
          .toArray()
      : [];
    const lastSequenceData = await tegonDatabase.sequences.get({
      id: modelName,
    });

    _store = IssuesStore.create({
      issues,
      lastSequenceId: lastSequenceData?.lastSequenceId,
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
  if (!issuesStore) {
    issuesStore = _store;
  }

  return issuesStore;
}
