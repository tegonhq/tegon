/** Copyright (c) 2024, Tegon, all rights reserved. **/
import {
  type IAnyStateTreeNode,
  type Instance,
  types,
  flow,
} from 'mobx-state-tree';

import type { IssueSuggestionType } from 'common/types/issue';

import { tegonDatabase } from 'store/database';

import { IssueSuggestion, IssueSuggestionMap } from './models';

export const IssueSuggestionsStore: IAnyStateTreeNode = types
  .model('IssuesStore', {
    issueSuggestionsMap: IssueSuggestionMap,
    teamId: types.union(types.string, types.undefined),
  })
  .actions((self) => {
    const update = (issue: IssueSuggestionType, id: string) => {
      self.issueSuggestionsMap.set(id, IssueSuggestion.create(issue));
    };
    const deleteById = (id: string) => {
      self.issueSuggestionsMap.delete(id);
    };

    const load = flow(function* () {
      const issueSuggestions = yield tegonDatabase.issueSuggestions.toArray();

      issueSuggestions.forEach((issueSuggestion: IssueSuggestionType) => {
        self.issueSuggestionsMap.set(
          issueSuggestion.issueId,
          IssueSuggestion.create(issueSuggestion),
        );
      });
    });

    return { update, deleteById, load };
  })
  .views((self) => ({
    getIssueSuggestionsForIssue(issueId: string) {
      const issueSuggestions = self.issueSuggestionsMap.get(issueId);

      if (!issueSuggestions) {
        return undefined;
      }

      return {
        ...issueSuggestions,
        suggestedLabelIds: [...issueSuggestions.suggestedLabelIds.toJSON()],
      };
    },
  }));

export type IssueSuggestionsStoreType = Instance<typeof IssueSuggestionsStore>;
