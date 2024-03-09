/* eslint-disable dot-location */
/** Copyright (c) 2024, Tegon, all rights reserved. **/
import { type IAnyStateTreeNode, type Instance, types } from 'mobx-state-tree';

import type { WorkflowType } from 'common/types/team';

import { tegonDatabase } from 'store/database';
import { MODELS } from 'store/models';

import { Workflow } from './models';

const modelName = MODELS.Workflow;

export const WorkflowsStore: IAnyStateTreeNode = types
  .model({
    workflows: types.array(Workflow),
    lastSequenceId: types.union(types.undefined, types.number),
  })
  .actions((self) => ({
    update(team: WorkflowType, id: string) {
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
    delete(id: string) {
      const indexToDelete = self.workflows.findIndex((obj) => obj.id === id);

      if (indexToDelete !== -1) {
        self.workflows.splice(indexToDelete, 1);
      }
    },
    updateLastSequenceId(lastSequenceId: number) {
      self.lastSequenceId = lastSequenceId;
    },
  }));

export type WorkflowsStoreType = Instance<typeof WorkflowsStore>;

export let workflowsStore: WorkflowsStoreType;

export async function resetWorkflowStore() {
  workflowsStore = undefined;
}

export async function initializeWorkflowsStore(teamId: string) {
  let _store = workflowsStore;

  if (!workflowsStore) {
    const workflows = teamId
      ? await tegonDatabase.workflows
          .where({
            teamId,
          })
          .toArray()
      : [];

    const lastSequenceData = await tegonDatabase.sequences.get({
      id: modelName,
    });

    _store = WorkflowsStore.create({
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
  if (!workflowsStore) {
    workflowsStore = _store;
  }

  return workflowsStore;
}
