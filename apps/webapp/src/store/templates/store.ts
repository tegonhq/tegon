import { sort } from 'fast-sort';
import {
  type IAnyStateTreeNode,
  type Instance,
  types,
  flow,
} from 'mobx-state-tree';

import type { TeamType, TemplateType } from 'common/types';

import { tegonDatabase } from 'store/database';

import { Templates } from './models';

export const TemplatesStore: IAnyStateTreeNode = types
  .model({
    templates: Templates,
  })
  .actions((self) => {
    const update = (template: TemplateType, id: string) => {
      const indexToUpdate = self.templates.findIndex((obj) => obj.id === id);

      if (indexToUpdate !== -1) {
        // Update the object at the found index with the new data
        self.templates[indexToUpdate] = {
          ...self.templates[indexToUpdate],
          ...template,
          // TODO fix the any and have a type with Issuetype
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any;
      } else {
        self.templates.push(template);
      }
    };
    const deleteById = (id: string) => {
      const indexToDelete = self.templates.findIndex((obj) => obj.id === id);

      if (indexToDelete !== -1) {
        self.templates.splice(indexToDelete, 1);
      }
    };

    const load = flow(function* () {
      const templates = yield tegonDatabase.templates.toArray();

      self.templates = Templates.create(
        sort(templates).asc((template: TeamType) => template.createdAt),
      );
    });

    return { update, deleteById, load };
  })
  .views((self) => ({
    getTemplateWithId(templateId: string) {
      const template = self.templates.find((template: TemplateType) => {
        return template.id === templateId;
      });

      return template;
    },
    getTemplatesForTeam(teamId: string) {
      return self.templates.filter((template: TemplateType) => {
        return template.teamId === teamId;
      });
    },
  }));

export type TemplateStoreType = Instance<typeof TemplatesStore>;
