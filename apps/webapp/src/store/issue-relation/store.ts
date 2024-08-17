import {
  type IAnyStateTreeNode,
  type Instance,
  types,
  flow,
} from 'mobx-state-tree';

import { IssueRelationEnum, type IssueRelationType } from 'common/types';

import { tegonDatabase } from 'store/database';

import { IssueRelation } from './models';

export const IssueRelationsStore: IAnyStateTreeNode = types
  .model({
    issueRelations: types.array(IssueRelation),
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

    const load = flow(function* () {
      const issueRelations = yield tegonDatabase.issueRelations.toArray();

      self.issueRelations = issueRelations;
    });

    return { update, deleteById, load };
  })
  .views((self) => ({
    getIssueRelations(issueId: string) {
      return self.issueRelations.filter(
        (issueRelation: IssueRelationType) => issueRelation.issueId === issueId,
      );
    },
    getIssueRelationWithId(issueRelationId: string) {
      return self.issueRelations.find(
        (issueRelation: IssueRelationType) =>
          issueRelation.id === issueRelationId,
      );
    },

    getIssueRelationForType(issueId: string, relationType: IssueRelationEnum) {
      return self.issueRelations.filter(
        (relationAct: IssueRelationType) =>
          relationAct.type === relationType && relationAct.issueId === issueId,
      );
    },

    // Used in filters
    isBlocked(issueId: string) {
      const issueRelations = self.issueRelations.filter(
        (issue: IssueRelationType) =>
          issue.issueId === issueId && issue.type === IssueRelationEnum.BLOCKED,
      );

      return issueRelations.length > 0;
    },
    isBlocking(issueId: string) {
      const issueRelations = self.issueRelations.filter(
        (issue: IssueRelationType) =>
          issue.issueId === issueId && issue.type === IssueRelationEnum.BLOCKS,
      );

      return issueRelations.length > 0;
    },
  }));

export type IssueRelationsStoreType = Instance<typeof IssueRelationsStore>;
