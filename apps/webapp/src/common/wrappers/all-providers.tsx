import { SessionAuth } from 'supertokens-auth-react/recipe/session';

import { NewIssueProvider } from 'modules/issues/new-issue';

import { deleteCookies } from 'common/common-utils';
import { UserDataWrapper } from 'common/wrappers/user-data-wrapper';

import { IssueViewProvider } from 'components/side-issue-view';

import { WorkspaceStoreInit } from 'store/workspace-store-provider';

import { BootstrapWrapper } from './bootstrap-data';
import { DatabaseWrapper } from './database-wrapper';
import { SocketDataSyncWrapper } from './socket-data-sync';

export const AllProviders = ({
  children,
}: {
  children: React.ReactElement;
}) => {
  return (
    <SessionAuth
      onSessionExpired={() => {
        deleteCookies();
      }}
    >
      <UserDataWrapper>
        <DatabaseWrapper>
          <BootstrapWrapper>
            <WorkspaceStoreInit>
              <SocketDataSyncWrapper>
                <NewIssueProvider>
                  <IssueViewProvider>{children}</IssueViewProvider>
                </NewIssueProvider>
              </SocketDataSyncWrapper>
            </WorkspaceStoreInit>
          </BootstrapWrapper>
        </DatabaseWrapper>
      </UserDataWrapper>
    </SessionAuth>
  );
};
