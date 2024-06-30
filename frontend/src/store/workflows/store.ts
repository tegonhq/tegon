/** Copyright (c) 2024, Tegon, all rights reserved. **/
import {
  type IAnyStateTreeNode,
  type Instance,
  types,
  flow,
} from 'mobx-state-tree';

import { WorkflowCategoryEnum, type WorkflowType } from 'common/types/team';

import { tegonDatabase } from 'store/database';

import { Workflow } from './models';

export const WorkflowsStore: IAnyStateTreeNode = types
  .model({
    workflows: types.array(Workflow),
    teamId: types.union(types.string, types.undefined),
  })
  .actions((self) => {
    const update = (workflow: WorkflowType, id: string) => {
      const indexToUpdate = self.workflows.findIndex((obj) => obj.id === id);

      if (indexToUpdate !== -1) {
        // Update the object at the found index with the new data
        self.workflows[indexToUpdate] = {
          ...self.workflows[indexToUpdate],
          ...workflow,
          // TODO fix the any and have a type with Issuetype
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any;
      } else {
        self.workflows.push(workflow);
      }
    };
    const deleteById = (id: string) => {
      const indexToDelete = self.workflows.findIndex((obj) => obj.id === id);

      if (indexToDelete !== -1) {
        self.workflows.splice(indexToDelete, 1);
      }
    };

    const load = flow(function* () {
      const workflows = yield tegonDatabase.workflows.toArray();

      self.workflows = workflows.map((workflow: WorkflowType) =>
        Workflow.create(workflow),
      );
    });

    return { update, deleteById, load };
  })
  .views((self) => ({
    getWorkflowWithId(workflowId: string) {
      return self.workflows.find(
        (workflow: WorkflowType) => workflow.id === workflowId,
      );
    },
    getWorkflowsForTeam(teamId: string) {
      return self.workflows.filter(
        (workflow: WorkflowType) => workflow.teamId === teamId,
      );
    },
    getCancelledWorkflow(teamId: string) {
      return self.workflows.find(
        (workflow: WorkflowType) =>
          workflow.teamId === teamId && workflow.name === 'Canceled',
      );
    },
    getTriageWorkflow(teamId: string) {
      return self.workflows.find(
        (workflow: WorkflowType) =>
          workflow.teamId === teamId &&
          workflow.category === WorkflowCategoryEnum.TRIAGE,
      );
    },
    getWorkflowByNames(value: string[]) {
      return value
        .map((name: string) => {
          const workflow = self.workflows.find(
            (workflow: WorkflowType) =>
              workflow.name.toLocaleLowerCase() === name,
          );

          return workflow?.id;
        })
        .filter(Boolean);
    },
  }));

export type WorkflowsStoreType = Instance<typeof WorkflowsStore>;
