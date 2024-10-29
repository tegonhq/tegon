import type { ProjectMilestonesStoreType } from './project-milestone-store';
import type { ProjectsStoreType } from './store';

import type { SyncActionRecord } from 'common/types';

import { tegonDatabase } from 'store/database';

export async function saveProjectData(
  data: SyncActionRecord[],
  projectsStore: ProjectsStoreType,
) {
  await Promise.all(
    data.map(async (record: SyncActionRecord) => {
      const project = {
        id: record.data.id,
        createdAt: record.data.createdAt,
        updatedAt: record.data.updatedAt,

        name: record.data.name,
        description: record.data.description,
        startDate: record.data.startDate,
        endDate: record.data.endDate,
        status: record.data.status,
        leadUserId: record.data.leadUserId,
        teams: record.data.teams,
        workspaceId: record.data.workspaceId,
      };

      switch (record.action) {
        case 'I': {
          await tegonDatabase.projects.put(project);
          return (
            projectsStore &&
            (await projectsStore.update(project, record.data.id))
          );
        }

        case 'U': {
          await tegonDatabase.projects.put(project);
          return (
            projectsStore &&
            (await projectsStore.update(project, record.data.id))
          );
        }

        case 'D': {
          await tegonDatabase.projects.delete(record.data.id);
          return (
            projectsStore && (await projectsStore.deleteById(record.data.id))
          );
        }
      }
    }),
  );
}

export async function saveProjectMilestoneData(
  data: SyncActionRecord[],
  projectMilestonesStore: ProjectMilestonesStoreType,
) {
  await Promise.all(
    data.map(async (record: SyncActionRecord) => {
      const projectMilestone = {
        id: record.data.id,
        createdAt: record.data.createdAt,
        updatedAt: record.data.updatedAt,

        name: record.data.name,
        description: record.data.description,
        endDate: record.data.endDate,
        projectId: record.data.projectId,
      };

      switch (record.action) {
        case 'I': {
          await tegonDatabase.projectMilestones.put(projectMilestone);
          return (
            projectMilestonesStore &&
            (await projectMilestonesStore.update(
              projectMilestone,
              record.data.id,
            ))
          );
        }

        case 'U': {
          await tegonDatabase.projectMilestones.put(projectMilestone);
          return (
            projectMilestonesStore &&
            (await projectMilestonesStore.update(
              projectMilestone,
              record.data.id,
            ))
          );
        }

        case 'D': {
          await tegonDatabase.projectMilestones.delete(record.data.id);
          return (
            projectMilestonesStore &&
            (await projectMilestonesStore.deleteById(record.data.id))
          );
        }
      }
    }),
  );
}
