import { AvatarText } from '@tegonhq/ui/components/avatar';
import { Button } from '@tegonhq/ui/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@tegonhq/ui/components/dropdown-menu';
import { ChevronDown } from '@tegonhq/ui/icons/index';
import { observer } from 'mobx-react-lite';
import { useRouter } from 'next/router';
import React from 'react';
import { signOut } from 'supertokens-auth-react/recipe/session';

import { useContextStore } from 'store/global-context-provider';

export const WorkspaceDropdown = observer(() => {
  const { workspaceStore } = useContextStore();
  const { query, push, replace } = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="p-0">
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
              push(`/${query.workspaceSlug}/settings/account/profile`);
            }}
          >
            Preferences
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => {
              push(`/${query.workspaceSlug}/settings/overview`);
            }}
          >
            Workspace settings
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              push(`/${query.workspaceSlug}/settings/members`);
            }}
          >
            Invite & manage members
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
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
});
