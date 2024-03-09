/* eslint-disable dot-location */
/** Copyright (c) 2024, Tegon, all rights reserved. **/
import { type IAnyStateTreeNode, type Instance, types } from 'mobx-state-tree';

import type { LabelType } from 'common/types/label';

import { tegonDatabase } from 'store/database';
import { MODELS } from 'store/models';

import { Label } from './models';

const modelName = MODELS.Label;

export const LabelsStore: IAnyStateTreeNode = types
  .model({
    labels: types.array(Label),
    lastSequenceId: types.union(types.undefined, types.number),
  })
  .actions((self) => ({
    update(label: LabelType, id: string) {
      const indexToUpdate = self.labels.findIndex((obj) => obj.id === id);

      if (indexToUpdate !== -1) {
        // Update the object at the found index with the new data
        self.labels[indexToUpdate] = {
          ...self.labels[indexToUpdate],
          ...label,
        };
      } else {
        self.labels.push(label);
      }
    },
    delete(id: string) {
      const indexToDelete = self.labels.findIndex((obj) => obj.id === id);

      if (indexToDelete !== -1) {
        self.labels.splice(indexToDelete, 1);
      }
    },
    updateLastSequenceId(lastSequenceId: number) {
      self.lastSequenceId = lastSequenceId;
    },
  }));

export type LabelsStoreType = Instance<typeof LabelsStore>;

export let labelsStore: LabelsStoreType;

export async function initialiseLabelStore(workspaceId: string) {
  let _store = labelsStore;
  if (!_store) {
    const labelsData = await tegonDatabase.labels
      .where({
        workspaceId,
      })
      .toArray();
    const lastSequenceData = await tegonDatabase.sequences.get({
      id: modelName,
    });

    _store = LabelsStore.create({
      labels: labelsData,
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
  if (!labelsStore) {
    labelsStore = _store;
  }

  return labelsStore;
}
