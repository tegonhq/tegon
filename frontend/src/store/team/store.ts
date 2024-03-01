/* eslint-disable dot-location */
/** Copyright (c) 2024, Tegon, all rights reserved. **/
import { IAnyStateTreeNode, Instance, types } from 'mobx-state-tree';

import { TeamType } from 'common/types/team';

import { tegonDatabase } from 'store/database';

import { Team, modelName } from './models';

export const TeamStore: IAnyStateTreeNode = types
  .model({
    teams: types.array(Team),
    lastSequenceId: types.union(types.undefined, types.number),
  })
  .actions((self) => ({
    update(team: TeamType, id: string) {
      const indexToUpdate = self.teams.findIndex((obj) => obj.id === id);

      if (indexToUpdate !== -1) {
        // Update the object at the found index with the new data
        self.teams[indexToUpdate] = {
          ...self.teams[indexToUpdate],
          ...team,
        };
      } else {
        self.teams.push(team);
      }
    },
    delete(id: string) {
      const indexToDelete = self.teams.findIndex((obj) => obj.id === id);

      if (indexToDelete !== -1) {
        self.teams.splice(indexToDelete, 1);
      }
    },
    updateLastSequenceId(lastSequenceId: number) {
      self.lastSequenceId = lastSequenceId;
    },
  }));

export type TeamStoreType = Instance<typeof TeamStore>;

export let teamStore: TeamStoreType;

export async function initialiseTeamStore(workspaceId: string) {
  let _store = teamStore;
  if (!_store) {
    const teams = await tegonDatabase.team
      .where({
        workspaceId,
      })
      .toArray();
    const lastSequenceData = await tegonDatabase.sequence.get({
      id: modelName,
    });
    _store = TeamStore.create({
      teams,
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
  if (!teamStore) {
    teamStore = _store;
  }

  return teamStore;
}
