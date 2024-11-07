import { RoleEnum } from '@tegonhq/types';
import { Loader } from '@tegonhq/ui/components/loader';
import { observer } from 'mobx-react-lite';
import React from 'react';

import { MemberItem } from 'modules/settings/workspace-settings/members/member-item';

import type { UsersOnWorkspaceType } from 'common/types';
import { getUserFromUsersData } from 'common/user-util';

import { useCurrentTeam } from 'hooks/teams';
import { useUsersData } from 'hooks/users';

import { useContextStore } from 'store/global-context-provider';

import { ShowMembersDropdown } from './show-members-dropdown';
import { SettingSection } from '../setting-section';

export const Members = observer(() => {
  const team = useCurrentTeam();
  const { workspaceStore } = useContextStore();
  const usersOnWorkspace = workspaceStore.usersOnWorkspaces;

  const userIds = usersOnWorkspace
    .filter((uOW: UsersOnWorkspaceType) => {
      return uOW.teamIds.includes(team.id) && uOW.role !== RoleEnum.BOT;
    })
    .map((uOW: UsersOnWorkspaceType) => uOW.userId);

  const { users, isLoading } = useUsersData(false);

  return (
    <>
      <SettingSection
        title="Team Members"
        description={`Manage who is a member of the ${team.name} team`}
      >
        <div>
          {isLoading && <Loader />}

          {!isLoading && (
            <div className="flex flex-col">
              <div className="flex justify-between items-center">
                <ShowMembersDropdown />
                <h3 className="text-xs"> {users.length} Members </h3>
              </div>

              <div className="mt-4 flex flex-col gap-2">
                {userIds.map((userId: string, index: number) => {
                  const userData = getUserFromUsersData(users, userId);

                  if (!userData) {
                    return null;
                  }

                  return (
                    <MemberItem
                      key={userData.id}
                      id={userData.id}
                      name={userData.fullname}
                      email={userData.email}
                      teamId={team.id}
                      className={
                        index === users.length - 1 && 'pb-0 !border-b-0'
                      }
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </SettingSection>
    </>
  );
});
