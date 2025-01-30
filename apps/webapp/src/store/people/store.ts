import {
  type IAnyStateTreeNode,
  type Instance,
  types,
  flow,
} from 'mobx-state-tree';

import type { PeopleType } from 'common/types';

import { tegonDatabase } from 'store/database';

import { People } from './models';

export const PeopleStore: IAnyStateTreeNode = types
  .model({
    people: types.map(People),
  })
  .actions((self) => {
    const update = (people: PeopleType, id: string) => {
      if (!self.people.has(id)) {
        self.people.set(id, People.create(people));
      } else {
        // Simply update the existing support metadata
        const existingPeople = self.people.get(id);
        Object.assign(existingPeople, people);
      }
    };
    const deleteById = (id: string) => {
      // Find the support metadata with matching id and remove it
      for (const [issueId, people] of self.people.entries()) {
        if (people.id === id) {
          self.people.delete(issueId);
          break;
        }
      }
    };

    const load = flow(function* () {
      const people = yield tegonDatabase.people.toArray();

      people.forEach((metadata: PeopleType) => {
        self.people.set(metadata.id, People.create(metadata));
      });
    });

    return { update, deleteById, load };
  })
  .views((self) => ({
    getPeopleForId(id: string) {
      return self.people.get(id);
    },
  }));

export type PeopleStoreType = Instance<typeof PeopleStore>;
