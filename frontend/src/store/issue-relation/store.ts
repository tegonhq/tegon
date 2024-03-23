/* eslint-disable dot-location */
/** Copyright (c) 2024, Tegon, all rights reserved. **/
import {
  type IAnyStateTreeNode,
  type Instance,
  types,
  flow,
} from 'mobx-state-tree';

import type { IssueRelationType } from 'common/types/issue-relation';

import { tegonDatabase } from 'store/database';

import { IssueRelation } from './models';

export const IssueRelationsStore: IAnyStateTreeNode = types
  .model({
    issueRelations: types.array(IssueRelation),
    issueId: types.union(types.string, types.undefined),
  })
  .actions((self) => {
    const update = (issueRelation: IssueRelationType, id: string) => {
      const indexToUpdate = self.issueRelations.findIndex(
        (obj) => obj.id === id,
      );

      if (indexToUpdate !== -1) {
        // Update the object at the found index with the new data
        self.issueRelations[indexToUpdate] = {
          ...self.issueRelations[indexToUpdate],
          ...issueRelation,
          // TODO fix the any and have a type with Issuetype
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any;
      } else {
        self.issueRelations.push(issueRelation);
      }
    };
    const deleteById = (id: string) => {
      const indexToDelete = self.issueRelations.findIndex(
        (obj) => obj.id === id,
      );

      if (indexToDelete !== -1) {
        self.issueRelations.splice(indexToDelete, 1);
      }
    };

    const load = flow(function* (issueId: string) {
      self.issueId = issueId;

      const issueRelations = issueId
        ? yield tegonDatabase.issueRelations
            .where({
              issueId,
            })
            .toArray()
        : [];

      self.issueRelations = issueRelations;
    });

    return { update, deleteById, load };
  })
  .views((self) => ({
    getIssueRelationWithId(issueRelationId: string) {
      return self.issueRelations.find(
        (issueRelation: IssueRelationType) =>
          issueRelation.id === issueRelationId,
      );
    },
  }));

export type IssueRelationsStoreType = Instance<typeof IssueRelationsStore>;
