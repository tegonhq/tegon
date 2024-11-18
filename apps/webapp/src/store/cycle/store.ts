import { sort } from 'fast-sort';
import {
  type IAnyStateTreeNode,
  type Instance,
  types,
  flow,
} from 'mobx-state-tree';

import type { CycleType } from 'common/types';

import { tegonDatabase } from 'store/database';

import { Cycles } from './models';

export const CyclesStore: IAnyStateTreeNode = types
  .model('CyclesStore', {
    cycles: Cycles,
    teamId: types.union(types.string, types.undefined),
  })
  .actions((self) => {
    const update = (cycle: CycleType, id: string) => {
      const indexToUpdate = self.cycles.findIndex((obj) => obj.id === id);

      if (indexToUpdate !== -1) {
        // Update the object at the found index with the new data
        self.cycles[indexToUpdate] = {
          ...self.cycles[indexToUpdate],
          ...cycle,
          // TODO fix the any and have a type with Issuetype
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any;
      } else {
        self.cycles.push(cycle);
      }
    };
    const deleteById = (id: string) => {
      const indexToDelete = self.cycles.findIndex((obj) => obj.id === id);

      if (indexToDelete !== -1) {
        self.cycles.splice(indexToDelete, 1);
      }
    };

    const load = flow(function* () {
      const cycles = yield tegonDatabase.cycles.toArray();

      self.cycles = Cycles.create(
        sort(cycles).asc((cycle: CycleType) => cycle.createdAt),
      );
    });

    return { update, deleteById, load };
  })
  .views((self) => ({
    getCyclesForTeam(teamId: string) {
      return self.cycles.filter((cycle) => {
        return cycle.teamId === teamId;
      });
    },
  }));

export type CyclesStoreType = Instance<typeof CyclesStore>;
