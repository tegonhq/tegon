/* eslint-disable dot-location */
/** Copyright (c) 2024, Tegon, all rights reserved. **/
import {
  type IAnyStateTreeNode,
  type Instance,
  types,
  flow,
} from 'mobx-state-tree';

import type { LabelType } from 'common/types/label';

import { tegonDatabase } from 'store/database';

import { Label } from './models';

export const LabelsStore: IAnyStateTreeNode = types
  .model({
    labels: types.array(Label),
    workspaceId: types.union(types.string, types.undefined),
  })
  .actions((self) => {
    const update = (label: LabelType, id: string) => {
      const indexToUpdate = self.labels.findIndex((obj) => obj.id === id);

      if (indexToUpdate !== -1) {
        // Update the object at the found index with the new data
        self.labels[indexToUpdate] = {
          ...self.labels[indexToUpdate],
          ...label,
          // TODO fix the any and have a type with Issuetype
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any;
      } else {
        self.labels.push(label);
      }
    };
    const deleteById = (id: string) => {
      const indexToDelete = self.labels.findIndex((obj) => obj.id === id);

      if (indexToDelete !== -1) {
        self.labels.splice(indexToDelete, 1);
      }
    };

    const load = flow(function* (workspaceId: string) {
      self.workspaceId = workspaceId;

      const labels = workspaceId
        ? yield tegonDatabase.labels
            .where({
              workspaceId,
            })
            .toArray()
        : [];

      self.labels = labels;
    });

    return { update, deleteById, load };
  });

export type LabelsStoreType = Instance<typeof LabelsStore>;
