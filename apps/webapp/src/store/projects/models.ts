import { types } from 'mobx-state-tree';

export const ProjectMilestone = types.model('ProjectMilestone', {
  id: types.string,
  createdAt: types.string,
  updatedAt: types.string,
  name: types.string,
  description: types.union(types.string, types.null),
  endDate: types.union(types.string, types.null),
  projectId: types.string,
});

export const Project = types.model('Project', {
  id: types.string,
  createdAt: types.string,
  updatedAt: types.string,
  name: types.string,
  description: types.union(types.string, types.null),
  status: types.string,
  startDate: types.union(types.string, types.null),
  endDate: types.union(types.string, types.null),
  leadUserId: types.union(types.string, types.null),
  teams: types.array(types.string),
  workspaceId: types.string,
});
