import type { IntegrationDefinitionType } from '@tegonhq/types';

import {
  type IAnyStateTreeNode,
  type Instance,
  types,
  flow,
} from 'mobx-state-tree';

import { tegonDatabase } from 'store/database';

import { IntegrationDefinition } from './models';

export const IntegrationDefinitionsStore: IAnyStateTreeNode = types
  .model({
    integrationDefinitions: types.array(IntegrationDefinition),
    workspaceId: types.union(types.string, types.undefined),
  })
  .actions((self) => {
    const update = (
      integrationDefinition: IntegrationDefinitionType,
      id: string,
    ) => {
      const indexToUpdate = self.integrationDefinitions.findIndex(
        (obj) => obj.id === id,
      );

      if (indexToUpdate !== -1) {
        // Update the object at the found index with the new data
        self.integrationDefinitions[indexToUpdate] = {
          ...self.integrationDefinitions[indexToUpdate],
          ...integrationDefinition,
          // TODO fix the any and have a type with Issuetype
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any;
      } else {
        self.integrationDefinitions.push(integrationDefinition);
      }
    };
    const deleteById = (id: string) => {
      const indexToDelete = self.integrationDefinitions.findIndex(
        (obj) => obj.id === id,
      );

      if (indexToDelete !== -1) {
        self.integrationDefinitions.splice(indexToDelete, 1);
      }
    };

    const load = flow(function* () {
      const integrationDefinitions =
        yield tegonDatabase.integrationDefinitions.toArray();

      self.integrationDefinitions = integrationDefinitions;
    });

    return { update, deleteById, load };
  });

export type IntegrationDefinitionsStoreType = Instance<
  typeof IntegrationDefinitionsStore
>;
