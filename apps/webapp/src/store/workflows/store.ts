import { WorkflowCategoryEnum } from '@tegonhq/types';
import {
  type IAnyStateTreeNode,
  type Instance,
  types,
  flow,
} from 'mobx-state-tree';

import { type WorkflowType } from 'common/types';

import { tegonDatabase } from 'store/database';

import { Workflow } from './models';

export const WorkflowsStore: IAnyStateTreeNode = types
  .model({
    workflows: types.map(Workflow),
    workflowsByTeamId: types.map(types.array(types.string)),
  })
  .actions((self) => {
    const update = (workflow: WorkflowType, id: string) => {
      // Update or add the workflow in the map
      self.workflows.set(id, workflow);

      // Update the team index
      const teamId = workflow.teamId;
      const teamWorkflows: string[] = self.workflowsByTeamId.get(teamId) || [];
      if (!teamWorkflows.includes(id)) {
        self.workflowsByTeamId.set(teamId, [...teamWorkflows, id]);
      }
    };

    const deleteById = (id: string) => {
      const workflow = self.workflows.get(id);
      if (workflow) {
        // Remove from team index
        const teamId = workflow.teamId;
        const teamWorkflows: string[] =
          self.workflowsByTeamId.get(teamId) || [];
        self.workflowsByTeamId.set(
          teamId,
          teamWorkflows.filter((wId) => wId !== id),
        );
        // Remove from workflows map
        self.workflows.delete(id);
      }
    };

    const load = flow(function* () {
      const workflows = yield tegonDatabase.workflows.toArray();

      // Clear existing data
      self.workflows.clear();
      self.workflowsByTeamId.clear();

      // Populate both the map and team index
      workflows.forEach((workflow: WorkflowType) => {
        self.workflows.set(workflow.id, Workflow.create(workflow));
        const teamWorkflows: string[] =
          self.workflowsByTeamId.get(workflow.teamId) || [];
        self.workflowsByTeamId.set(workflow.teamId, [
          ...teamWorkflows,
          workflow.id,
        ]);
      });
    });

    return { update, deleteById, load };
  })
  .views((self) => ({
    getWorkflowWithId(workflowId: string) {
      return self.workflows.get(workflowId);
    },
    getWorkflowsForTeam(teamId: string) {
      const workflowIds: string[] = self.workflowsByTeamId.get(teamId) || [];
      return workflowIds.map((id) => self.workflows.get(id)).filter(Boolean);
    },
    getCancelledWorkflow(teamId: string) {
      return Array.from(self.workflows.values()).find(
        (workflow: WorkflowType) =>
          workflow.teamId === teamId &&
          workflow.category === WorkflowCategoryEnum.CANCELED,
      );
    },
    getTriageWorkflow(teamId: string) {
      return Array.from(self.workflows.values()).find(
        (workflow: WorkflowType) =>
          workflow.teamId === teamId &&
          workflow.category === WorkflowCategoryEnum.TRIAGE,
      );
    },
    getWorkflowByNames(names: string[]) {
      const normalizedNames = names.map((name) => name.toLowerCase());
      return Array.from(self.workflows.values())
        .filter((workflow: WorkflowType) =>
          normalizedNames.includes(workflow.name.toLowerCase()),
        )
        .map((workflow) => workflow.id);
    },
    getPositionForCategory(category: WorkflowCategoryEnum, teamId: string) {
      return Array.from(self.workflows.values()).filter(
        (workflow: WorkflowType) =>
          workflow.category === category && workflow.teamId === teamId,
      ).length;
    },
  }));

export type WorkflowsStoreType = Instance<typeof WorkflowsStore>;
