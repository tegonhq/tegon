/** Copyright (c) 2024, Tegon, all rights reserved. **/

import * as React from 'react';

import type { BootstrapResponse } from 'common/types/data-loader';

import { useBootstrapRecords } from 'services/sync/bootstrap-sync';
import { useDeltaRecords } from 'services/sync/delta-sync';

import { useCurrentWorkspace } from './workspace/use-current-workspace';

interface StoreManagementProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  store: any;
  modelName: string | string[];
  onSaveData: (data: BootstrapResponse) => void;
}

export function useStoreManagement({
  store,
  modelName,
  onSaveData,
}: StoreManagementProps) {
  const workspace = useCurrentWorkspace();

  const { refetch: bootstrapIssuesRecords } = useBootstrapRecords({
    modelNames: typeof modelName === 'string' ? [modelName] : modelName,
    workspaceId: workspace.id,
    onSuccess: onSaveData,
  });

  const { refetch: syncIssuesRecords } = useDeltaRecords({
    modelNames: typeof modelName === 'string' ? [modelName] : modelName,
    workspaceId: workspace.id,
    lastSequenceId: store?.lastSequenceId,
    onSuccess: onSaveData,
  });

  React.useEffect(() => {
    initStore();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initStore = async () => {
    if (!store.lastSequenceId) {
      callBootstrap();
    }

    if (store.lastSequenceId) {
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
  }, [store?.lastSequenceId]);

  return store;
}
