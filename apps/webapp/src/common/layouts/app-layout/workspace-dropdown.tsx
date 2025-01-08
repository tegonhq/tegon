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
import { observer } from 'mobx-react-lite';
import { useRouter } from 'next/router';
import posthog from 'posthog-js';
import React from 'react';
import { signOut } from 'supertokens-auth-react/recipe/session';

import { deleteCookies } from 'common/common-utils';

import { useContextStore } from 'store/global-context-provider';

export const WorkspaceDropdown = observer(() => {
  const { workspaceStore } = useContextStore();
  const { query, push, replace } = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="p-0 justify-between gap-2 items-center shrink min-w-[0px] max-w-[150px]"
        >
          <AvatarText text={workspaceStore.workspace.name} noOfChar={1} />
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
            posthog.reset(true);
            deleteCookies();
            await signOut();

            replace('/auth');
          }}
        >
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
});
