/** Copyright (c) 2024, Tegon, all rights reserved. **/
import { sort } from 'fast-sort';
import {
  type IAnyStateTreeNode,
  type Instance,
  types,
  flow,
} from 'mobx-state-tree';

import type { ViewType } from 'common/types/view';

import { tegonDatabase } from 'store/database';

import { Views } from './models';

export const ViewsStore: IAnyStateTreeNode = types
  .model({
    views: Views,
    workspaceId: types.union(types.string, types.undefined),
  })
  .actions((self) => {
    const update = (view: ViewType, id: string) => {
      const indexToUpdate = self.views.findIndex((obj) => obj.id === id);

      if (indexToUpdate !== -1) {
        // Update the object at the found index with the new data
        self.views[indexToUpdate] = {
          ...self.views[indexToUpdate],
          ...view,
          // TODO fix the any and have a type with Issuetype
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any;
      } else {
        self.views.push(view);
      }
    };
    const deleteById = (id: string) => {
      const indexToDelete = self.views.findIndex((obj) => obj.id === id);

      if (indexToDelete !== -1) {
        self.views.splice(indexToDelete, 1);
      }
    };

    const load = flow(function* () {
      const views = yield tegonDatabase.views.toArray();

      self.views = Views.create(
        sort(views).asc((view: ViewType) => new Date(view.createdAt)),
      );
    });

    return { update, deleteById, load };
  })
  .views((self) => ({
    getViewWithId(viewId: string) {
      const view = self.views.find((view) => {
        return view.id === viewId;
      });

      return view;
    },
    getViewsForTeam(teamId: string) {
      return self.views.filter((view) => {
        return view.teamId === teamId;
      });
    },
  }));

export type ViewsStoreType = Instance<typeof ViewsStore>;
