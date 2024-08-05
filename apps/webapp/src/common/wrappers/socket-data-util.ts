import type { SyncActionRecord } from 'common/types';

import { saveCommentsData } from 'store/comments';
import { saveIntegrationAccountData } from 'store/integration-accounts';
import { saveIntegrationDefinitionData } from 'store/integration-definitions';
import { saveIssueHistoryData } from 'store/issue-history';
import { saveIssueRelationData } from 'store/issue-relation';
import { saveIssueSuggestionData } from 'store/issue-suggestions';
import { saveIssuesData } from 'store/issues';
import { saveLabelData } from 'store/labels';
import { saveLinkedIssueData } from 'store/linked-issues';
import { MODELS } from 'store/models';
import { saveNotificationData } from 'store/notifications';
import { saveTeamData } from 'store/teams';
import { saveViewData } from 'store/views';
import { saveWorkflowData } from 'store/workflows';
import { saveWorkspaceData } from 'store/workspace';

// Saves the data from the socket and call explicitly functions from individual models
export async function saveSocketData(
  data: SyncActionRecord[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  MODEL_STORE_MAP: Record<string, any>,
) {
  await Promise.all(
    data.map(async (record: SyncActionRecord) => {
      switch (record.modelName) {
        case MODELS.Label: {
          return await saveLabelData([record], MODEL_STORE_MAP[MODELS.Label]);
        }

        case MODELS.Team: {
          return await saveTeamData([record], MODEL_STORE_MAP[MODELS.Team]);
        }

        case MODELS.Workflow: {
          return await saveWorkflowData(
            [record],
            MODEL_STORE_MAP[MODELS.Workflow],
          );
        }

        case MODELS.Workspace: {
          return await saveWorkspaceData(
            [record],
            MODEL_STORE_MAP[MODELS.Workspace],
          );
        }

        case MODELS.Issue: {
          return await saveIssuesData([record], MODEL_STORE_MAP[MODELS.Issue]);
        }

        case MODELS.UsersOnWorkspaces: {
          return await saveWorkspaceData(
            [record],
            MODEL_STORE_MAP[MODELS.UsersOnWorkspaces],
          );
        }

        case MODELS.IssueHistory: {
          return await saveIssueHistoryData(
            [record],
            MODEL_STORE_MAP[MODELS.IssueHistory],
          );
        }

        case MODELS.IssueComment: {
          return await saveCommentsData(
            [record],
            MODEL_STORE_MAP[MODELS.IssueComment],
          );
        }

        case MODELS.IntegrationAccount: {
          return await saveIntegrationAccountData(
            [record],
            MODEL_STORE_MAP[MODELS.IntegrationAccount],
          );
        }

        case MODELS.IntegrationDefinition: {
          return await saveIntegrationDefinitionData(
            [record],
            MODEL_STORE_MAP[MODELS.IntegrationDefinition],
          );
        }

        case MODELS.LinkedIssue: {
          return await saveLinkedIssueData(
            [record],
            MODEL_STORE_MAP[MODELS.LinkedIssue],
          );
        }

        case MODELS.IssueRelation: {
          return await saveIssueRelationData(
            [record],
            MODEL_STORE_MAP[MODELS.IssueRelation],
          );
        }

        case MODELS.Notification: {
          return await saveNotificationData(
            [record],
            MODEL_STORE_MAP[MODELS.Notification],
          );
        }

        case MODELS.View: {
          return await saveViewData([record], MODEL_STORE_MAP[MODELS.View]);
        }

        case MODELS.IssueSuggestion: {
          return await saveIssueSuggestionData(
            [record],
            MODEL_STORE_MAP[MODELS.IssueSuggestion],
          );
        }
      }
    }),
  );
}
