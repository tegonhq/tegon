import { Loader } from '@tegonhq/ui/components/loader';
import { observer } from 'mobx-react-lite';
import getConfig from 'next/config';
import * as React from 'react';
import { Socket, io } from 'socket.io-client';

import { hash } from 'common/common-utils';

import { useCurrentWorkspace } from 'hooks/workspace';

import { useContextStore } from 'store/global-context-provider';
import { MODELS } from 'store/models';
import { UserContext } from 'store/user-context';

import { saveSocketData } from './socket-data-util';

interface Props {
  children: React.ReactElement;
}

// This wrapper ensures the data received from the socket is passed to indexed DB
export const SocketDataSyncWrapper: React.FC<Props> = observer(
  (props: Props) => {
    const { children } = props;
    const workspace = useCurrentWorkspace();

    const {
      commentsStore,
      issuesHistoryStore,
      issuesStore,
      workflowsStore,
      workspaceStore,
      teamsStore,
      labelsStore,
      integrationAccountsStore,
      linkedIssuesStore,
      issueRelationsStore,
      notificationsStore,
      viewsStore,
      issueSuggestionsStore,
      actionsStore,
      projectsStore,
      projectMilestonesStore,
      cyclesStore,
      conversationsStore,
      conversationHistoryStore,
    } = useContextStore();
    const user = React.useContext(UserContext);
    const hashKey = `${workspace.id}__${user.id}`;

    const [socket, setSocket] = React.useState<Socket | undefined>(undefined);

    const { publicRuntimeConfig } = getConfig();

    React.useEffect(() => {
      if (!socket && workspaceStore.workspace?.id) {
        initSocket();
      }

      return () => {
        socket && socket.disconnect();
      };

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [workspaceStore.workspace]);

    async function initSocket() {
      const socket = io(publicRuntimeConfig.NEXT_PUBLIC_BACKEND_HOST, {
        query: {
          workspaceId: workspaceStore.workspace.id,
          userId: user.id,
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
        [MODELS.LinkedIssue]: linkedIssuesStore,
        [MODELS.IssueRelation]: issueRelationsStore,
        [MODELS.Notification]: notificationsStore,
        [MODELS.View]: viewsStore,
        [MODELS.IssueSuggestion]: issueSuggestionsStore,
        [MODELS.Action]: actionsStore,
        [MODELS.Project]: projectsStore,
        [MODELS.ProjectMilestone]: projectMilestonesStore,
        [MODELS.Cycle]: cyclesStore,
        [MODELS.Conversation]: conversationsStore,
        [MODELS.ConversationHistory]: conversationHistoryStore,
      };

      socket.on('message', (newMessage: string) => {
        const data = JSON.parse(newMessage);

        saveSocketData([data], MODEL_STORE_MAP);
        localStorage.setItem(
          `lastSequenceId_${hash(hashKey)}`,
          `${data.sequenceId}`,
        );
      });
    }

    if (workspaceStore?.workspace) {
      return <>{children}</>;
    }

    return <Loader height={500} text="Setting up realtime" />;
  },
);
