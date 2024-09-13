import { AvatarText } from '@tegonhq/ui/components/avatar';
import { cn } from '@tegonhq/ui/lib/utils';
import { observer } from 'mobx-react-lite';

import type { UsersOnWorkspaceType } from 'common/types';

import { useContextStore } from 'store/global-context-provider';

interface MemberItemProps {
  className: string;
  name: string;
  email: string;
  id: string;
}

export const MemberItem = observer(
  ({ name, className, email, id }: MemberItemProps) => {
    const { workspaceStore } = useContextStore();

    const userOnWorkspace = workspaceStore.usersOnWorkspaces.find(
      (uoW: UsersOnWorkspaceType) => uoW.userId === id,
    );

    return (
      <div
        className={cn(
          className,
          'flex items-center justify-between bg-background-3 p-3 rounded-lg',
        )}
      >
        <div className="flex gap-2 items-center">
          <AvatarText text={name} className="text-base w-8 h-8 rounded-md" />

          <div className="flex flex-col">
            <div>{name}</div>
            <div className="text-muted-foreground">{email}</div>
          </div>
        </div>

        <div className="text-sm"> {userOnWorkspace?.role} </div>
      </div>
    );
  },
);
