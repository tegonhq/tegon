/* eslint-disable dot-location */
/** Copyright (c) 2024, Tegon, all rights reserved. **/
import { IAnyStateTreeNode, Instance, types } from 'mobx-state-tree';

import { WorkflowType } from 'common/types/team';

import { tegonDatabase } from 'store/database';

import { Workflow, modelName } from './models';

export const WorkflowStore: IAnyStateTreeNode = types
  .model({
    workflows: types.array(Workflow),
    lastSequenceId: types.union(types.undefined, types.number),
  })
  .actions((self) => ({
    updateStore(team: WorkflowType, id: string) {
      const indexToUpdate = self.workflows.findIndex((obj) => obj.id === id);

      if (indexToUpdate !== -1) {
        // Update the object at the found index with the new data
        self.workflows[indexToUpdate] = {
          ...self.workflows[indexToUpdate],
          ...team,
        };
      } else {
        self.workflows.push(team);
      }
    },

    updateLastSequenceId(lastSequenceId: number) {
      self.lastSequenceId = lastSequenceId;
    },
  }));

export type WorkflowStoreType = Instance<typeof WorkflowStore>;

export let workflowStore: WorkflowStoreType;

export async function resetWorkflowStore() {
  workflowStore = undefined;
}

export async function initializeWorkflowStore(teamId: string) {
  let _store = workflowStore;

  if (!workflowStore) {
    const workflows = await tegonDatabase.workflow
      .where({
        teamId,
      })
      .toArray();
    const lastSequenceData = await tegonDatabase.sequence.get({
      id: modelName,
    });

    _store = WorkflowStore.create({
      workflows,
      lastSequenceId: lastSequenceData?.lastSequenceId,
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
  if (!workflowStore) {
    workflowStore = _store;
  }

  return workflowStore;
}
