import {
  type IAnyStateTreeNode,
  type Instance,
  types,
  flow,
} from 'mobx-state-tree';

import type { LinkedIssueType } from 'common/types';

import { tegonDatabase } from 'store/database';

import { ProjectMilestone } from './models';

export const ProjectMilestonesStore: IAnyStateTreeNode = types
  .model({
    milestones: types.array(ProjectMilestone),
  })
  .actions((self) => {
    const update = (linkedIssue: LinkedIssueType, id: string) => {
      const indexToUpdate = self.milestones.findIndex((obj) => obj.id === id);

      if (indexToUpdate !== -1) {
        // Update the object at the found index with the new data
        self.milestones[indexToUpdate] = {
          ...self.milestones[indexToUpdate],
          ...linkedIssue,
          // TODO fix the any and have a type with Issuetype
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any;
      } else {
        self.milestones.push(linkedIssue);
      }
    };
    const deleteById = (id: string) => {
      const indexToDelete = self.milestones.findIndex((obj) => obj.id === id);

      if (indexToDelete !== -1) {
        self.milestones.splice(indexToDelete, 1);
      }
    };

    const load = flow(function* () {
      const milestones = yield tegonDatabase.projectMilestones.toArray();

      self.milestones = milestones;
    });

    return { update, deleteById, load };
  })
  .views((self) => ({
    getMilestonesForProject(projectId: string) {
      return self.milestones.filter(
        (milestone) => milestone.projectId === projectId,
      );
    },
    getMilestonesForProjects(projectIds: string[]) {
      return self.milestones.filter((milestone) =>
        projectIds.includes(milestone.projectId),
      );
    },
  }));

export type ProjectMilestonesStoreType = Instance<
  typeof ProjectMilestonesStore
>;
