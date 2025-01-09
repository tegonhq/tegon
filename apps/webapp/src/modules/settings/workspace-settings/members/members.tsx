import { Button } from '@tegonhq/ui/components/button';
import { Input } from '@tegonhq/ui/components/input';
import { Loader } from '@tegonhq/ui/components/loader';
import { observer } from 'mobx-react-lite';
import React from 'react';

import { SettingSection } from 'modules/settings/setting-section';

import type { User } from 'common/types';

import { useUsersData } from 'hooks/users';

import { useContextStore } from 'store/global-context-provider';
import { UserContext } from 'store/user-context';

import { AddMemberDialog } from './add-member-dialog';
import { MemberItem } from './member-item';

export const Members = observer(() => {
  const { users, isLoading } = useUsersData(false);
  const { workspaceStore } = useContextStore();
  const [newMemberDialog, setNewMemberDialog] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState('');
  const currentUser = React.useContext(UserContext);
  const userRole = workspaceStore.getUserData(currentUser.id)?.role;

  const getUsers = (isSuspened: boolean = false) => {
    const nonSuspendedUsers = users.filter((user) =>
      isSuspened
        ? workspaceStore.getUserData(user.id).status === 'SUSPENDED'
        : workspaceStore.getUserData(user.id).status !== 'SUSPENDED',
    );

    if (searchValue) {
      return nonSuspendedUsers.filter(
        (user) =>
          user.fullname.toLowerCase().includes(searchValue.toLowerCase()) ||
          user.email.toLowerCase().includes(searchValue.toLowerCase()),
      );
    }

    return nonSuspendedUsers;
  };

  return (
    <>
      <SettingSection
        title="Members"
        description=" Manage who has access to this workspace"
      >
        <div>
          {isLoading && <Loader />}

          {!isLoading && (
            <div className="flex flex-col">
              <div className="flex justify-between items-center">
                <Button
                  variant="secondary"
                  onClick={() => setNewMemberDialog(true)}
                >
                  Add member
                </Button>

                <div className="flex">
                  <Input
                    placeholder="Filter by name"
                    onChange={(e) => setSearchValue(e.currentTarget.value)}
                  />
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-1">
                {getUsers().map((userData: User, index) => (
                  <MemberItem
                    key={userData.id}
                    id={userData.id}
                    name={userData.fullname}
                    email={userData.email}
                    isAdmin={userRole === 'ADMIN'}
                    className={index === users.length - 1 && 'pb-0 !border-b-0'}
                  />
                ))}
              </div>

              {getUsers(true).length > 0 && (
                <div className="mt-4">
                  <h2 className="mb-1"> Suspended </h2>

                  {getUsers(true).map((userData: User, index) => (
                    <MemberItem
                      key={userData.id}
                      id={userData.id}
                      name={userData.fullname}
                      email={userData.email}
                      isSuspended
                      isAdmin={userRole === 'ADMIN'}
                      className={
                        index === users.length - 1 && 'pb-0 !border-b-0'
                      }
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </SettingSection>
      {newMemberDialog && (
        <AddMemberDialog setDialogOpen={setNewMemberDialog} />
      )}
    </>
  );
});
