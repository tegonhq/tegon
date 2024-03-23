/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { observer } from 'mobx-react-lite';
import getConfig from 'next/config';
import * as React from 'react';
import { Socket, io } from 'socket.io-client';

import { useContextStore } from 'store/global-context-provider';
import { MODELS } from 'store/models';

import { saveSocketData } from './socket-data-util';
import { Loader } from '../../components/ui/loader';

interface Props {
  children: React.ReactElement;
}

// This wrapper ensures the data received from the socket is passed to indexed DB
export const SocketDataSyncWrapper: React.FC<Props> = observer(
  (props: Props) => {
    const { children } = props;

    const {
      commentsStore,
      issuesHistoryStore,
      issuesStore,
      workflowsStore,
      workspaceStore,
      teamsStore,
      labelsStore,
      integrationAccountsStore,
      integrationDefinitionsStore,
      linkedIssuesStore,
      issueRelationsStore,
    } = useContextStore();

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

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const MODEL_STORE_MAP = {
        [MODELS.Label]: labelsStore,
        [MODELS.Workspace]: workspaceStore,
        [MODELS.UsersOnWorkspaces]: workspaceStore,
        [MODELS.Team]: teamsStore,
        [MODELS.Workflow]: workflowsStore,
        [MODELS.Issue]: issuesStore,
        [MODELS.IssueHistory]: issuesHistoryStore,
        [MODELS.IssueComment]: commentsStore,
        [MODELS.IntegrationAccount]: integrationAccountsStore,
        [MODELS.IntegrationDefinition]: integrationDefinitionsStore,
        [MODELS.LinkedIssue]: linkedIssuesStore,
        [MODELS.IssueRelation]: issueRelationsStore,
      };

      socket.on('message', (newMessage: string) => {
        saveSocketData([JSON.parse(newMessage)], MODEL_STORE_MAP);
      });
    }

    if (workspaceStore?.workspace) {
      return <>{children}</>;
    }

    return <Loader height={500} text="Setting up realtime" />;
  },
);
