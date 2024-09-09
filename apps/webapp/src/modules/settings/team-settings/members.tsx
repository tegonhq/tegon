import { Button } from '@tegonhq/ui/components/button';
import { Loader } from '@tegonhq/ui/components/loader';
import { observer } from 'mobx-react-lite';
import React from 'react';

import { MemberItem } from 'modules/settings/workspace-settings/members/member-item';

import type { User } from 'common/types';

import { useCurrentTeam } from 'hooks/teams';
import { useUsersData } from 'hooks/users';

import { SettingSection } from '../setting-section';
import { AddMemberDialog } from '../workspace-settings/members/add-member-dialog';

export const Members = observer(() => {
  const currentTeam = useCurrentTeam();
  const { users, isLoading } = useUsersData(false, currentTeam.id);
  const [newMemberDialog, setNewMemberDialog] = React.useState(false);

  return (
    <>
      <SettingSection
        title="Team Members"
        description={`Manage who is a member of the ${currentTeam.name} team`}
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
                <h3 className="text-xs"> {users.length} Members </h3>
              </div>

              <div className="mt-4 flex flex-col gap-2">
                {users.map((userData: User, index) => (
                  <MemberItem
                    key={userData.id}
                    name={userData.fullname}
                    email={userData.email}
                    className={index === users.length - 1 && 'pb-0 !border-b-0'}
                  />
                ))}
              </div>
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
