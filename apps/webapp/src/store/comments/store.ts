import type { IssueCommentType } from '@tegonhq/types';

import {
  type IAnyStateTreeNode,
  type Instance,
  types,
  flow,
} from 'mobx-state-tree';

import { tegonDatabase } from 'store/database';

import { CommentArray } from './models';

export const CommentsStore: IAnyStateTreeNode = types
  .model({
    comments: CommentArray,
    issueId: types.union(types.string, types.undefined),
  })
  .actions((self) => {
    const update = (comment: IssueCommentType, id: string) => {
      const indexToUpdate = self.comments.findIndex((obj) => obj.id === id);

      if (indexToUpdate !== -1) {
        // Update the object at the found index with the new data
        self.comments[indexToUpdate] = {
          ...self.comments[indexToUpdate],
          ...comment,
          // TODO fix the any and have a type with Issuetype
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any;
      } else {
        self.comments.push(comment);
      }
    };
    const deleteById = (id: string) => {
      const indexToDelete = self.comments.findIndex((obj) => obj.id === id);

      if (indexToDelete !== -1) {
        self.comments.splice(indexToDelete, 1);
      }
    };

    const load = flow(function* (issueId: string) {
      self.issueId = issueId;

      const comments = issueId
        ? yield tegonDatabase.comments
            .where({
              issueId,
            })
            .toArray()
        : [];

      self.comments = CommentArray.create(comments);
    });

    return { update, deleteById, load };
  })
  .views((self) => ({
    getComments(issueId: string) {
      return issueId === self.issueId
        ? self.comments.filter(
            (comment: IssueCommentType) => comment.issueId === issueId,
          )
        : [];
    },
  }));

export type CommentsStoreType = Instance<typeof CommentsStore>;
