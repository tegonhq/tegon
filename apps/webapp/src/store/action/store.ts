import { sort } from 'fast-sort';
import {
  type IAnyStateTreeNode,
  type Instance,
  types,
  flow,
} from 'mobx-state-tree';

import type { ActionType } from 'common/types';

import { tegonDatabase } from 'store/database';

import { ActionsArray } from './models';

function configToJson(config: string) {
  try {
    return JSON.parse(config);
  } catch (e) {
    return {};
  }
}

export const ActionsStore: IAnyStateTreeNode = types
  .model({
    actions: ActionsArray,
    workspaceId: types.union(types.string, types.undefined),
  })
  .actions((self) => {
    const update = (action: ActionType, id: string) => {
      const indexToUpdate = self.actions.findIndex((obj) => obj.id === id);

      if (indexToUpdate !== -1) {
        // Update the object at the found index with the new data
        self.actions[indexToUpdate] = {
          ...self.actions[indexToUpdate],
          ...action,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any;
      } else {
        self.actions.push(action);
      }
    };
    const deleteById = (id: string) => {
      const indexToDelete = self.actions.findIndex((obj) => obj.id === id);

      if (indexToDelete !== -1) {
        self.actions.splice(indexToDelete, 1);
      }
    };
    const load = flow(function* () {
      const actions = yield tegonDatabase.actions.toArray();

      self.actions = ActionsArray.create(
        sort(actions).asc((action: ActionType) => action.createdAt),
      );
    });

    return { update, deleteById, load };
  })
  .views((self) => ({
    get allActions() {
      return self.actions;
    },
    getAction(slug: string) {
      const action = self.actions.find((action) => action.slug === slug);

      if (action) {
        return { ...action, config: configToJson(action.config) };
      }

      return action;
    },
  }));

export type ActionsStoreType = Instance<typeof ActionsStore>;
