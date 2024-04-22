/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { observer } from 'mobx-react-lite';
import { useRouter } from 'next/router';
import React from 'react';
import { signOut } from 'supertokens-auth-react/recipe/session';

import { getTailwindColor } from 'common/color-utils';
import { cn } from 'common/lib/utils';

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
  DropdownMenuTrigger,
} from 'components/ui/dropdown-menu';

import { useContextStore } from 'store/global-context-provider';

export const WorkspaceDropdown = observer(() => {
  const { workspaceStore } = useContextStore();
  const { query, replace } = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="px-2 text-foreground">
          <div className="flex justify-between">
            <Avatar className="h-[15px] w-[20px] ">
              <AvatarImage />
              <AvatarFallback
                className={cn(
                  'text-[0.55rem] rounded-sm',
                  getTailwindColor(workspaceStore.workspace.name),
                )}
              >
                {getInitials(workspaceStore.workspace.name)}
              </AvatarFallback>
            </Avatar>

            <div className="ml-2"> {workspaceStore.workspace.name}</div>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-60" align="start">
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => {
              replace(`/${query.workspaceSlug}/settings/account/profile`);
            }}
          >
            Preferences
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => {
              replace(`/${query.workspaceSlug}/settings/overview`);
            }}
          >
            Workspace settings
          </DropdownMenuItem>
          <DropdownMenuItem>Invite & manage members</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={async () => {
            await signOut();

            replace('/auth/signin');
          }}
        >
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
});
