/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { SessionAuth } from 'supertokens-auth-react/recipe/session';

import { UserDataWrapper } from 'common/wrappers/user-data-wrapper';

import { BootstrapWrapper } from './bootstrap-data';
import { SocketDataSyncWrapper } from './socket-data-sync';
import { WorkspaceStoreInit } from '../../store/workspace-store-provider';

export const AllProviders = ({
  children,
}: {
  children: React.ReactElement;
}) => {
  return (
    <SessionAuth>
      <UserDataWrapper>
        <BootstrapWrapper>
          <WorkspaceStoreInit>
            <SocketDataSyncWrapper>{children}</SocketDataSyncWrapper>
          </WorkspaceStoreInit>
        </BootstrapWrapper>
      </UserDataWrapper>
    </SessionAuth>
  );
};
