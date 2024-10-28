import {
  type IAnyStateTreeNode,
  type Instance,
  types,
  flow,
} from 'mobx-state-tree';

import type { ProjectType } from 'common/types';

import { tegonDatabase } from 'store/database';

import { Project } from './models';

export const ProjectsStore: IAnyStateTreeNode = types
  .model({
    projects: types.array(Project),
    workspaceId: types.union(types.string, types.undefined),
  })
  .actions((self) => {
    const update = (project: ProjectType, id: string) => {
      const indexToUpdate = self.projects.findIndex((obj) => obj.id === id);

      if (indexToUpdate !== -1) {
        // Update the object at the found index with the new data
        self.projects[indexToUpdate] = {
          ...self.projects[indexToUpdate],
          ...project,
          // TODO fix the any and have a type with Issuetype
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any;
      } else {
        self.projects.push(project);
      }
    };
    const deleteById = (id: string) => {
      const indexToDelete = self.projects.findIndex((obj) => obj.id === id);

      if (indexToDelete !== -1) {
        self.projects.splice(indexToDelete, 1);
      }
    };

    const load = flow(function* () {
      const projects = yield tegonDatabase.projects.toArray();

      self.projects = projects;
    });

    return { update, deleteById, load };
  })
  .views((self) => ({
    getProjectWithId(id: string) {
      return self.projects.find((project) => project.id === id);
    },

    get getProjects() {
      return self.projects;
    },
  }));

export type ProjectsStoreType = Instance<typeof ProjectsStore>;
