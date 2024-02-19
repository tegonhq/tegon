/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { SessionAuth } from 'supertokens-auth-react/recipe/session';

import { UserDataWrapper } from 'common/wrappers/user-data';

import { SocketDataSyncWrapper } from './socket-data-sync';
import { WorkspaceStoreProvider } from './workspace-store-provider';

export const AllProviders = ({
  children,
}: {
  children: React.ReactElement;
}) => {
  return (
    <SessionAuth>
      <UserDataWrapper>
        <WorkspaceStoreProvider>
          <SocketDataSyncWrapper>{children}</SocketDataSyncWrapper>
        </WorkspaceStoreProvider>
      </UserDataWrapper>
    </SessionAuth>
  );
};
