import type { IssueSuggestionsStoreType } from './store';
import type { SyncActionRecord } from '@tegonhq/types';

import { tegonDatabase } from 'store/database';

export async function saveIssueSuggestionData(
  data: SyncActionRecord[],
  issueSuggestionsStore: IssueSuggestionsStoreType,
) {
  await Promise.all(
    data.map(async (record: SyncActionRecord) => {
      const issueSuggestion = {
        id: record.data.id,
        createdAt: record.data.createdAt,
        updatedAt: record.data.updatedAt,
        issueId: record.data.issueId,
        suggestedLabelIds: record.data.suggestedLabelIds,
        suggestedAssigneeId: record.data.suggestedAssigneeId,
      };

      switch (record.action) {
        case 'I': {
          await tegonDatabase.issueSuggestions.put(issueSuggestion);
          return (
            issueSuggestionsStore &&
            (await issueSuggestionsStore.update(
              issueSuggestion,
              record.data.id,
            ))
          );
        }

        case 'U': {
          await tegonDatabase.issueSuggestions.put(issueSuggestion);
          return (
            issueSuggestionsStore &&
            (await issueSuggestionsStore.update(
              issueSuggestion,
              record.data.id,
            ))
          );
        }

        case 'D': {
          await tegonDatabase.issueSuggestions.delete(record.data.id);
          return (
            issueSuggestionsStore &&
            (await issueSuggestionsStore.deleteById(record.data.id))
          );
        }
      }
    }),
  );
}
