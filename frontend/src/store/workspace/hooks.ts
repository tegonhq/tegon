/* eslint-disable dot-location */
/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { useRouter } from 'next/router';
import * as React from 'react';

import { BootstrapResponse, SyncActionRecord } from 'common/types/data-loader';

import { tegonDatabase } from 'store/database';
import { UserContext } from 'store/user_context';

import { workspaceStore } from './store';

export async function saveWorkspaceData(data: BootstrapResponse) {
  await Promise.all(
    data.syncActions.map(async (record: SyncActionRecord) => {
      return await tegonDatabase.workspace.put({
        id: record.data.id,
        createdAt: record.data.createdAt,
        updatedAt: record.data.updatedAt,
        name: record.data.name,
        slug: record.data.slug,
      });
    }),
  );

  await tegonDatabase.sequence.put({
    id: 'workspace',
    lastSequenceId: data.lastSequenceId,
  });
}

export function useWorkspaceStore() {
  const {
    query: { workspaceSlug },
  } = useRouter();
  const userContext = React.useContext(UserContext);

  React.useEffect(() => {
    if (workspaceStore && !workspaceStore.lastSequenceId) {
      callBootstrap();
    }

    if (workspaceStore?.lastSequenceId) {
      callDeltaSync();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspaceSlug, workspaceStore]);

  const callBootstrap = React.useCallback(async () => {
    const currentWorkspace = userContext.workspaces.find(
      (workspace) => workspace.slug === workspaceSlug,
    );
    const response = await fetch(
      `/api/v1/sync_actions/bootstrap?workspaceId=${currentWorkspace.id}&modelName=Workspace`,
    );
    const bootstrapData = await response.json();
    await saveWorkspaceData(bootstrapData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const callDeltaSync = React.useCallback(async () => {
    const currentWorkspace = userContext.workspaces.find(
      (workspace) => workspace.slug === workspaceSlug,
    );
    const response = await fetch(
      `/api/v1/sync_actions/delta?workspaceId=${currentWorkspace.id}&modelName=Workspace&lastSequenceId=${workspaceStore.lastSequenceId}`,
    );
    const deltaSyncData = await response.json();

    await saveWorkspaceData(deltaSyncData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspaceStore?.lastSequenceId]);

  return workspaceStore;
}
