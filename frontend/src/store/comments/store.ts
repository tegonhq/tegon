/* eslint-disable dot-location */
/** Copyright (c) 2024, Tegon, all rights reserved. **/
import { type IAnyStateTreeNode, type Instance, types } from 'mobx-state-tree';

import type { IssueType } from 'common/types/issue';

import { tegonDatabase } from 'store/database';

import { Comment } from './models';

export const CommentsStore: IAnyStateTreeNode = types
  .model({
    comments: types.array(Comment),
  })
  .actions((self) => ({
    update(issue: IssueType, id: string) {
      const indexToUpdate = self.comments.findIndex((obj) => obj.id === id);

      if (indexToUpdate !== -1) {
        // Update the object at the found index with the new data
        self.comments[indexToUpdate] = {
          ...self.comments[indexToUpdate],
          ...issue,
          // TODO fix the any and have a type with Issuetype
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any;
      } else {
        self.comments.push(issue);
      }
    },
    delete(id: string) {
      const indexToDelete = self.comments.findIndex((obj) => obj.id === id);

      if (indexToDelete !== -1) {
        self.comments.splice(indexToDelete, 1);
      }
    },
  }));

export type CommentsStoreType = Instance<typeof CommentsStore>;

export let commentsStore: CommentsStoreType;

export async function resetCommentsStore() {
  commentsStore = undefined;
}

export async function initializeCommentsStore(issueId: string) {
  let _store = commentsStore;

  if (!commentsStore) {
    const comments = issueId
      ? await tegonDatabase.comments
          .where({
            issueId,
          })
          .toArray()
      : [];

    _store = CommentsStore.create({
      comments,
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
  if (!commentsStore) {
    commentsStore = _store;
  }

  return commentsStore;
}
