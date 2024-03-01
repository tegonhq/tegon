/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { observer } from 'mobx-react-lite';
import getConfig from 'next/config';
import * as React from 'react';
import { Socket, io } from 'socket.io-client';

import { saveSocketData } from 'common/database-balancer';

import { useWorkspaceStore } from 'store/workspace';

import { Loader } from '../../components/ui/loader';

interface Props {
  children: React.ReactElement;
}

// This wrapper ensures the data received from the socket is passed to indexed DB
export const SocketDataSyncWrapper: React.FC<Props> = observer(
  (props: Props) => {
    const { children } = props;
    const workspaceStore = useWorkspaceStore();
    const [socket, setSocket] = React.useState<Socket | undefined>(undefined);

    const { publicRuntimeConfig } = getConfig();

    React.useEffect(() => {
      if (workspaceStore?.workspace && !socket) {
        initSocket();
      }

      return () => {
        socket && socket.disconnect();
      };

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [workspaceStore?.workspace]);

    async function initSocket() {
      const socket = io(publicRuntimeConfig.NEXT_PUBLIC_SYNC_SERVER, {
        query: {
          workspaceId: workspaceStore.workspace.id,
        },
        withCredentials: true,
      });
      setSocket(socket);

      socket.on('message', (newMessage: string) => {
        saveSocketData([JSON.parse(newMessage)]);
      });
    }

    if (workspaceStore?.workspace) {
      return <>{children}</>;
    }

    return <Loader height={500} text="Setting up realtime" />;
  },
);
