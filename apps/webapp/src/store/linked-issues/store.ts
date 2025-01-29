import {
  type IAnyStateTreeNode,
  type Instance,
  types,
  flow,
} from 'mobx-state-tree';

import type { LinkedIssueType } from 'common/types';

import { tegonDatabase } from 'store/database';

import { LinkedIssueArray } from './models';

export const LinkedIssuesStore: IAnyStateTreeNode = types
  .model({
    linkedIssues: types.map(LinkedIssueArray),
  })
  .actions((self) => {
    const update = (linkedIssue: LinkedIssueType, id: string) => {
      const issueId = linkedIssue.issueId;
      if (!self.linkedIssues.has(issueId)) {
        self.linkedIssues.set(issueId, LinkedIssueArray.create([]));
      }

      const linkedIssuesArray = self.linkedIssues.get(issueId);
      const indexToUpdate = linkedIssuesArray.findIndex((obj) => obj.id === id);

      if (indexToUpdate !== -1) {
        // Update the object at the found index with the new data
        linkedIssuesArray[indexToUpdate] = {
          ...linkedIssuesArray[indexToUpdate],
          ...linkedIssue,
        };
      } else {
        linkedIssuesArray.push(linkedIssue);
      }
    };
    const deleteById = (id: string) => {
      // Iterate through all comment arrays in the map
      for (const [issueId, linkedIssuesArray] of self.linkedIssues.entries()) {
        const indexToDelete = linkedIssuesArray.findIndex(
          (obj) => obj.id === id,
        );

        if (indexToDelete !== -1) {
          linkedIssuesArray.splice(indexToDelete, 1);
          // If the comments array is empty, we can remove it from the map
          if (linkedIssuesArray.length === 0) {
            self.linkedIssues.delete(issueId);
          }
          break; // Exit loop once we've found and deleted the comment
        }
      }
    };

    const load = flow(function* (issueId: string) {
      const linkedIssues = issueId
        ? yield tegonDatabase.linkedIssues
            .where({
              issueId,
            })
            .toArray()
        : [];

      // Create a new LinkedIssueArray for this issueId
      if (linkedIssues.length > 0) {
        self.linkedIssues.set(issueId, LinkedIssueArray.create(linkedIssues));
      }
    });

    return { update, deleteById, load };
  })
  .views((self) => ({
    getLinkedIssues(issueId: string): LinkedIssueType[] {
      return self.linkedIssues.has(issueId)
        ? self.linkedIssues.get(issueId)
        : [];
    },
  }));

export type LinkedIssuesStoreType = Instance<typeof LinkedIssuesStore>;
