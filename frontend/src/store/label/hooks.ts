/* eslint-disable dot-location */
/** Copyright (c) 2024, Tegon, all rights reserved. **/

import * as React from 'react';

import { useCurrentWorkspace } from 'common/hooks/get-workspace';
import { BootstrapResponse, SyncActionRecord } from 'common/types/data-loader';

import { tegonDatabase } from 'store/database';

import { labelStore } from './store';

export async function saveLabelData(data: BootstrapResponse) {
  await Promise.all(
    data.syncActions.map(async (record: SyncActionRecord) => {
      return await tegonDatabase.label.put({
        id: record.data.id,
        createdAt: record.data.createdAt,
        updatedAt: record.data.updatedAt,
        name: record.data.name,
        color: record.data.color,
        description: record.data.description,
        workspaceId: record.data.workspaceId,
        teamId: record.data.teamId,
        groupId: record.data.groupId,
      });
    }),
  );

  await tegonDatabase.sequence.put({
    id: 'label',
    lastSequenceId: data.lastSequenceId,
  });
}

export function useLabelStore() {
  const { workspace } = useCurrentWorkspace();

  React.useEffect(() => {
    if (labelStore && !labelStore.lastSequenceId) {
      callBootstrap();
    }

    if (labelStore?.lastSequenceId) {
      callDeltaSync();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspace, labelStore]);

  const callBootstrap = React.useCallback(async () => {
    const response = await fetch(
      `/api/v1/sync_actions/bootstrap?workspaceId=${workspace.id}&modelName=Label`,
    );
    const bootstrapData = await response.json();
    await saveLabelData(bootstrapData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const callDeltaSync = React.useCallback(async () => {
    const response = await fetch(
      `/api/v1/sync_actions/delta?workspaceId=${workspace.id}&modelName=Label&lastSequenceId=${labelStore.lastSequenceId}`,
    );
    const deltaSyncData = await response.json();

    await saveLabelData(deltaSyncData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [labelStore?.lastSequenceId]);

  return labelStore;
}
