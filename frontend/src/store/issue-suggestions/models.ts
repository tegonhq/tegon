import { types } from 'mobx-state-tree';

export const IssueSuggestion = types.model('Issue', {
  id: types.string,
  createdAt: types.string,
  updatedAt: types.string,
  issueId: types.string,
  suggestedLabelIds: types.array(types.string),
  suggestedAssigneeId: types.union(types.string, types.null),
});

export const IssueSuggestionMap = types.map(IssueSuggestion);
