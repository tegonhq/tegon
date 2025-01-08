import { types } from 'mobx-state-tree';

export const Template = types.model({
  id: types.string,
  createdAt: types.string,
  updatedAt: types.string,
  name: types.string,

  templateData: types.string,
  category: types.enumeration(['ISSUE', 'PROJECT', 'DOCUMENT']),
  workspaceId: types.string,
  teamId: types.union(types.null, types.string),
});

export const Templates = types.array(Template);
