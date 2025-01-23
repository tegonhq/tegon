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
    issueRelations: types.map(IssueRelation),
    indexByIssueId: types.optional(
      types.map(types.map(types.array(types.string))),
      {},
    ),
  })
  .actions((self) => {
    const update = (issueRelation: IssueRelationType, id: string) => {
      const relation = self.issueRelations.get(id);
      if (relation) {
        Object.assign(relation, issueRelation);
      } else {
        self.issueRelations.set(id, IssueRelation.create(issueRelation));

        // Update index
        if (!self.indexByIssueId.has(issueRelation.issueId)) {
          self.indexByIssueId.set(issueRelation.issueId, {});
        }

        const relationTypeMap = self.indexByIssueId.get(issueRelation.issueId);
        if (!relationTypeMap.has(issueRelation.type)) {
          relationTypeMap.set(issueRelation.type, []);
        }

        relationTypeMap.get(issueRelation.type).push(id);
      }
    };
    const deleteById = (issueRelationId: string) => {
      const relation = self.issueRelations.get(issueRelationId);
      if (!relation) {
        return;
      } // If the relation doesn't exist, do nothing

      const { issueId, type } = relation;

      // Remove the relation from the index
      if (self.indexByIssueId.has(issueId)) {
        const typeMap = self.indexByIssueId.get(issueId);
        if (typeMap.has(type)) {
          const ids = typeMap.get(type);
          const updatedIds = ids.filter((id) => id !== issueRelationId);
          typeMap.set(type, updatedIds);

          // If no IDs are left for this type, clean up the map
          if (updatedIds.length === 0) {
            typeMap.delete(type);
          }
        }

        // If no types are left for this issueId, clean up the index
        if (typeMap.size === 0) {
          self.indexByIssueId.delete(issueId);
        }
      }

      // Finally, remove the relation itself
      self.issueRelations.delete(issueRelationId);
    };

    const load = flow(function* () {
      const issueRelations = yield tegonDatabase.issueRelations.toArray();

      issueRelations.map((issueRelation: IssueRelationType) => {
        self.issueRelations.set(
          issueRelation.id,
          IssueRelation.create(issueRelation),
        );

        // Update index
        if (!self.indexByIssueId.has(issueRelation.issueId)) {
          self.indexByIssueId.set(issueRelation.issueId, {});
        }

        const relationTypeMap = self.indexByIssueId.get(issueRelation.issueId);
        if (!relationTypeMap.has(issueRelation.type)) {
          relationTypeMap.set(issueRelation.type, []);
        }
        relationTypeMap.get(issueRelation.type).push(issueRelation.id);
      });
    });

    return { update, deleteById, load };
  })
  .views((self) => ({
    getIssueRelationForType(issueId: string, relationType: IssueRelationEnum) {
      const relationTypeMap = self.indexByIssueId.get(issueId);

      if (!relationTypeMap) {
        return [];
      }
      const ids: string[] = relationTypeMap.get(relationType) || [];

      return ids.map((id) => self.issueRelations.get(id)).filter(Boolean);
    },

    // Used in filters
    isBlocked(issueId: string) {
      // Check if the index has the issueId and BLOCKED relations
      const relationTypeMap = self.indexByIssueId.get(issueId);
      if (!relationTypeMap) {
        return false;
      } // No relations for this issueId
      const blockedRelations = relationTypeMap.get(IssueRelationEnum.BLOCKED);
      return blockedRelations && blockedRelations.length > 0;
    },

    isBlocking(issueId: string) {
      const relationTypeMap = self.indexByIssueId.get(issueId);
      if (!relationTypeMap) {
        return false;
      } // No relations for this issueId
      const blockingRelations = relationTypeMap.get(IssueRelationEnum.BLOCKS);
      return blockingRelations && blockingRelations.length > 0;
    },
  }));

export type IssueRelationsStoreType = Instance<typeof IssueRelationsStore>;
