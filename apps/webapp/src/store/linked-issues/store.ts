import {
  type IAnyStateTreeNode,
  type Instance,
  types,
  flow,
} from 'mobx-state-tree';

import type { LinkedIssueType } from 'common/types';

import { tegonDatabase } from 'store/database';

import { LinkedIssue } from './models';

export const LinkedIssuesStore: IAnyStateTreeNode = types
  .model({
    linkedIssues: types.array(LinkedIssue),
    issueId: types.union(types.string, types.undefined),
  })
  .actions((self) => {
    const update = (linkedIssue: LinkedIssueType, id: string) => {
      const indexToUpdate = self.linkedIssues.findIndex((obj) => obj.id === id);

      if (indexToUpdate !== -1) {
        // Update the object at the found index with the new data
        self.linkedIssues[indexToUpdate] = {
          ...self.linkedIssues[indexToUpdate],
          ...linkedIssue,
          // TODO fix the any and have a type with Issuetype
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any;
      } else {
        self.linkedIssues.push(linkedIssue);
      }
    };
    const deleteById = (id: string) => {
      const indexToDelete = self.linkedIssues.findIndex((obj) => obj.id === id);

      if (indexToDelete !== -1) {
        self.linkedIssues.splice(indexToDelete, 1);
      }
    };

    const load = flow(function* (issueId: string) {
      self.issueId = issueId;

      const linkedIssues = issueId
        ? yield tegonDatabase.linkedIssues
            .where({
              issueId,
            })
            .toArray()
        : [];

      self.linkedIssues = linkedIssues;
    });

    return { update, deleteById, load };
  });

export type LinkedIssuesStoreType = Instance<typeof LinkedIssuesStore>;
