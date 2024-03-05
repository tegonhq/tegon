/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { observer } from 'mobx-react-lite';
import { useRouter } from 'next/router';
import React from 'react';
import { signOut } from 'supertokens-auth-react/recipe/session';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  getInitials,
} from 'components/ui/avatar';
import { Button } from 'components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from 'components/ui/dropdown-menu';
import { useWorkspaceStore } from 'hooks/workspace';

export interface WorkspaceDropdownProps {
  isCollapsed: boolean;
}

export const WorkspaceDropdown = observer(
  ({ isCollapsed }: WorkspaceDropdownProps) => {
    const workspaceStore = useWorkspaceStore();
    const { query, replace } = useRouter();

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="px-2">
            <div className="flex justify-between">
              <Avatar className="h-[20px] w-[25px] ">
                <AvatarImage />
                <AvatarFallback className="bg-teal-500 dark:bg-teal-900 text-xs rounded-sm">
                  {getInitials(workspaceStore.workspace.name)}
                </AvatarFallback>
              </Avatar>
              {!isCollapsed && (
                <div className="ml-2"> {workspaceStore.workspace.name}</div>
              )}
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="min-w-60" align="start">
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={() => {
                replace(`/${query.workspaceSlug}/settings/overview`);
              }}
            >
              Workspace settings
              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              Invite & manage members
              <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={async () => {
              await signOut();

              replace('/auth/signin');
            }}
          >
            Log out
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  },
);
