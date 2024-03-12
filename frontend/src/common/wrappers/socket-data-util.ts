/** Copyright (c) 2024, Tegon, all rights reserved. **/
import type { SyncActionRecord } from 'common/types/data-loader';

import { saveCommentsData } from 'hooks/comments';
import { saveIssueHistoryData } from 'hooks/issues';
import { saveIssuesData } from 'hooks/issues/use-issues-store';
import { saveLabelData } from 'hooks/labels/use-labels-store';
import { saveTeamData } from 'hooks/teams/use-teams-store';
import { saveWorkflowData } from 'hooks/workflows/use-workflows-store';
import { saveWorkspaceData } from 'hooks/workspace/use-workspace-store';

import { MODELS } from 'store/models';

// Saves the data from the socket and call explicitly functions from individual models
export async function saveSocketData(data: SyncActionRecord[]) {
  await Promise.all(
    data.map(async (record: SyncActionRecord) => {
      switch (record.modelName) {
        case MODELS.Label: {
          return await saveLabelData({
            syncActions: [record],
            lastSequenceId: record.sequenceId,
          });
        }

        case MODELS.Team: {
          return await saveTeamData({
            syncActions: [record],
            lastSequenceId: record.sequenceId,
          });
        }

        case MODELS.Workflow: {
          return await saveWorkflowData({
            syncActions: [record],
            lastSequenceId: record.sequenceId,
          });
        }

        case MODELS.Workspace: {
          return await saveWorkspaceData({
            syncActions: [record],
            lastSequenceId: record.sequenceId,
          });
        }

        case MODELS.Issue: {
          return await saveIssuesData({
            syncActions: [record],
            lastSequenceId: record.sequenceId,
          });
        }

        case MODELS.UsersOnWorkspaces: {
          return await saveWorkspaceData({
            syncActions: [record],
            lastSequenceId: record.sequenceId,
          });
        }

        case MODELS.IssueHistory: {
          return await saveIssueHistoryData({
            syncActions: [record],
            lastSequenceId: record.sequenceId,
          });
        }

        case MODELS.IssueComment: {
          return await saveCommentsData({
            syncActions: [record],
            lastSequenceId: record.sequenceId,
          });
        }
      }
    }),
  );
}
