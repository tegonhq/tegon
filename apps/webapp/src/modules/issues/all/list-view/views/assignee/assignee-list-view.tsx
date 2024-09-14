import { RoleEnum } from '@tegonhq/types';
import { ScrollArea } from '@tegonhq/ui/components/scroll-area';

import type { UsersOnWorkspaceType } from 'common/types';

import { AssigneeListSection, NoAssigneeView } from './assignee-list-section';

interface AssigneeListViewProps {
  usersOnWorkspaces: UsersOnWorkspaceType[];
}

export function AssigneeListView({ usersOnWorkspaces }: AssigneeListViewProps) {
  return (
    <ScrollArea className="h-full w-full">
      <div className="flex flex-col gap-4 h-full pb-[100px]">
        {usersOnWorkspaces
          .filter(
            (uOw: UsersOnWorkspaceType) =>
              ![RoleEnum.BOT, RoleEnum.AGENT].includes(uOw.role as RoleEnum),
          )
          .map((uOW: UsersOnWorkspaceType) => (
            <AssigneeListSection key={uOW.id} userOnWorkspace={uOW} />
          ))}
        <NoAssigneeView />
      </div>
    </ScrollArea>
  );
}
