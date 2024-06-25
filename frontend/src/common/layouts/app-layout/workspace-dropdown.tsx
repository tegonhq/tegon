/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { observer } from 'mobx-react-lite';
import { useRouter } from 'next/router';
import React from 'react';
import { signOut } from 'supertokens-auth-react/recipe/session';

import { AvatarText } from 'components/ui/avatar';
import { Button } from 'components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from 'components/ui/dropdown-menu';
import { ChevronDown } from 'icons';

import { useContextStore } from 'store/global-context-provider';

export const WorkspaceDropdown = observer(() => {
  const { workspaceStore } = useContextStore();
  const { query, replace } = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="xs" className="p-0">
          <div className="flex justify-between gap-2 items-center">
            <AvatarText text={workspaceStore.workspace.name} noOfChar={1} />

            <div> {workspaceStore.workspace.name}</div>
            <div>
              <ChevronDown size={16} />
            </div>
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
