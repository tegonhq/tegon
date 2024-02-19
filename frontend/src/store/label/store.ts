/* eslint-disable dot-location */
/** Copyright (c) 2024, Tegon, all rights reserved. **/
import { IAnyStateTreeNode, Instance, types } from 'mobx-state-tree';

import { LabelType } from 'common/types/label';

import { tegonDatabase } from 'store/database';

import { Label, modelName } from './models';

export const LabelStore: IAnyStateTreeNode = types
  .model({
    labels: types.array(Label),
    lastSequenceId: types.union(types.undefined, types.number),
  })
  .actions((self) => ({
    updateStore(label: LabelType, id: string) {
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
    updateLastSequenceId(lastSequenceId: number) {
      self.lastSequenceId = lastSequenceId;
    },
  }));

export type LabelStoreType = Instance<typeof LabelStore>;

export let labelStore: LabelStoreType;

export async function initialiseLabelStore(workspaceId: string) {
  let _store = labelStore;
  if (!_store) {
    const labelsData = await tegonDatabase.label
      .where({
        workspaceId,
      })
      .toArray();
    const lastSequenceData = await tegonDatabase.sequence.get({
      id: modelName,
    });

    _store = LabelStore.create({
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
  if (!labelStore) {
    labelStore = _store;
  }

  return labelStore;
}
