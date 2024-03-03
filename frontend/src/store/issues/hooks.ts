/* eslint-disable dot-location */
/** Copyright (c) 2024, Tegon, all rights reserved. **/

import * as React from 'react';

import { useCurrentWorkspace } from 'common/hooks/use-current-workspace';
import { BootstrapResponse, SyncActionRecord } from 'common/types/data-loader';

import { useBootstrapRecords } from 'services/sync/bootstrap-sync';
import { useDeltaRecords } from 'services/sync/delta-sync';

import { tegonDatabase } from 'store/database';

import { modelName } from './models';
import { issuesStore } from './store';

export async function saveIssuesData(data: BootstrapResponse) {
  await Promise.all(
    data.syncActions.map(async (record: SyncActionRecord) => {
      const issue = {
        id: record.data.id,
        createdAt: record.data.createdAt,
        updatedAt: record.data.updatedAt,
        title: record.data.title,
        number: record.data.number,
        description: record.data.description,
        priority: record.data.priority,
        dueDate: record.data.dueDate,
        sortOrder: record.data.sortOrder,
        estimate: record.data.estimate,
        teamId: record.data.teamId,
        createdById: record.data.createdById,
        assigneeId: record.data.assigneeId,
        labelIds: record.data.labelIds,
        parentId: record.data.parentId,
        stateId: record.data.stateId,
      };

      switch (record.action) {
        case 'I': {
          await tegonDatabase.issues.put(issue);
          return await issuesStore.update(issue, record.data.id);
        }

        case 'U': {
          await tegonDatabase.issues.put(issue);
          return await issuesStore.update(issue, record.data.id);
        }

        case 'D': {
          await tegonDatabase.issues.delete(record.data.id);
          return await issuesStore.delete(record.data.id);
        }
      }
    }),
  );

  await tegonDatabase.sequences.put({
    id: modelName,
    lastSequenceId: data.lastSequenceId,
  });
}

function onBootstrapRecords(data: BootstrapResponse) {
  saveIssuesData(data);
}

export function useIssuesStore() {
  const workspace = useCurrentWorkspace();

  const { refetch: bootstrapIssuesRecords } = useBootstrapRecords({
    modelName,
    workspaceId: workspace.id,
    onSuccess: onBootstrapRecords,
  });

  const { refetch: syncIssuesRecords } = useDeltaRecords({
    modelName,
    workspaceId: workspace.id,
    lastSequenceId: issuesStore?.lastSequenceId,
    onSuccess: onBootstrapRecords,
  });

  React.useEffect(() => {
    initStore();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initStore = async () => {
    if (!issuesStore.lastSequenceId) {
      callBootstrap();
    }

    if (issuesStore.lastSequenceId) {
      callDeltaSync();
    }
  };

  const callBootstrap = React.useCallback(async () => {
    bootstrapIssuesRecords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const callDeltaSync = React.useCallback(async () => {
    syncIssuesRecords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [issuesStore?.lastSequenceId]);

  return issuesStore;
}
