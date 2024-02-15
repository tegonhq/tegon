/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { observer } from 'mobx-react-lite';
import getConfig from 'next/config';
import * as React from 'react';
import { io } from 'socket.io-client';

import { saveSocketData } from 'common/database-balancer';

import { useWorkspaceStore } from 'store/workspace';

import { Loader } from '../../components/ui/loader';

interface Props {
  children: React.ReactElement;
}

// This wrapper ensures call is either made to bootstrap or delta/sync to get be upto date with the server
export const DataSyncWrapper: React.FC<Props> = observer((props: Props) => {
  const { children } = props;
  const workspaceStore = useWorkspaceStore();

  const { publicRuntimeConfig } = getConfig();

  React.useEffect(() => {
    if (workspaceStore?.workspace) {
      initSocket();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspaceStore?.workspace]);

  async function initSocket() {
    const socket = io(publicRuntimeConfig.NEXT_PUBLIC_SYNC_SERVER, {
      query: {
        workspaceId: workspaceStore.workspace.id,
      },
      withCredentials: true,
    });

    socket.on('message', (newMessage: string) => {
      saveSocketData([JSON.parse(newMessage)]);
    });
  }

  if (workspaceStore?.workspace) {
    return <>{children}</>;
  }

  return <Loader height={500} />;
});
