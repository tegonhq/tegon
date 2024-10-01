import { sort } from 'fast-sort';
import {
  type IAnyStateTreeNode,
  type Instance,
  types,
  flow,
} from 'mobx-state-tree';

import type { TeamType } from 'common/types';

import { tegonDatabase } from 'store/database';

import { Teams } from './models';

export const TeamsStore: IAnyStateTreeNode = types
  .model({
    teams: Teams,
    workspaceId: types.union(types.string, types.undefined),
  })
  .actions((self) => {
    const update = (team: TeamType, id: string) => {
      const indexToUpdate = self.teams.findIndex((obj) => obj.id === id);

      if (indexToUpdate !== -1) {
        // Update the object at the found index with the new data
        self.teams[indexToUpdate] = {
          ...self.teams[indexToUpdate],
          ...team,
          // TODO fix the any and have a type with Issuetype
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any;
      } else {
        self.teams.push(team);
      }
    };
    const deleteById = (id: string) => {
      const indexToDelete = self.teams.findIndex((obj) => obj.id === id);

      if (indexToDelete !== -1) {
        self.teams.splice(indexToDelete, 1);
      }
    };

    const load = flow(function* () {
      const teams = yield tegonDatabase.teams.toArray();

      self.teams = Teams.create(
        sort(teams).asc((team: TeamType) => team.createdAt),
      );
    });

    return { update, deleteById, load };
  })
  .views((self) => ({
    getTeamWithId(teamId: string) {
      const team = self.teams.find((team: TeamType) => {
        return team.id === teamId;
      });

      return team;
    },
    getTeamWithIdentifier(teamIdentifier: string) {
      const team = self.teams.find((team: TeamType) => {
        return team.identifier === teamIdentifier;
      });

      return team;
    },
    get getTeams() {
      return self.teams;
    },
  }));

export type TeamsStoreType = Instance<typeof TeamsStore>;
