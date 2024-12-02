import { SessionAuth } from 'supertokens-auth-react/recipe/session';

import { deleteCookies } from 'common/common-utils';
import { UserDataWrapper } from 'common/wrappers/user-data-wrapper';

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
              <SocketDataSyncWrapper>{children}</SocketDataSyncWrapper>
            </WorkspaceStoreInit>
          </BootstrapWrapper>
        </DatabaseWrapper>
      </UserDataWrapper>
    </SessionAuth>
  );
};
