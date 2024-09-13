import { RoleEnum } from '@tegonhq/types';
import { Button } from '@tegonhq/ui/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@tegonhq/ui/components/dropdown-menu';
import { Loader } from '@tegonhq/ui/components/loader';
import { useToast } from '@tegonhq/ui/components/ui/use-toast';
import React from 'react';

import type { UsersOnWorkspaceType } from 'common/types';
import { getUserFromUsersData } from 'common/user-util';

import { useCurrentTeam } from 'hooks/teams';
import { useUsersData } from 'hooks/users';

import { useAddTeamMemberMutation } from 'services/team';

import { useContextStore } from 'store/global-context-provider';

import { AddMemberDialog } from '../workspace-settings/members/add-member-dialog';

export function ShowMembersDropdown() {
  const currentTeam = useCurrentTeam();
  const { toast } = useToast();
  const { workspaceStore } = useContextStore();
  const [newMemberDialog, setNewMemberDialog] = React.useState(false);
  const { mutate: addTeamMember } = useAddTeamMemberMutation({
    onSuccess: () => {
      toast({
        title: 'Team',
        description: 'Member added successfully',
      });
    },
  });

  const { users, isLoading } = useUsersData();

  const getMembersNotInTeam = () => {
    return workspaceStore.usersOnWorkspaces.filter(
      (user: UsersOnWorkspaceType) => {
        return (
          !user.teamIds.includes(currentTeam.id) && user.role !== RoleEnum.BOT
        );
      },
    );
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary">Add member</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {isLoading && <Loader />}
          {!isLoading &&
            getMembersNotInTeam().map((user: UsersOnWorkspaceType) => (
              <DropdownMenuItem
                key={user.id}
                onClick={() =>
                  addTeamMember({ userId: user.userId, teamId: currentTeam.id })
                }
              >
                {getUserFromUsersData(users, user.userId).fullname}
              </DropdownMenuItem>
            ))}
          <DropdownMenuItem onClick={() => setNewMemberDialog(true)}>
            Invite people
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {newMemberDialog && (
        <AddMemberDialog setDialogOpen={setNewMemberDialog} />
      )}
    </>
  );
}
