import { ScrollArea } from '@tegonhq/ui/components/scroll-area';

import type { User } from 'common/types';

import { AssigneeViewList, NoAssigneeView } from './assignee-view-list';

interface AssigneeListProps {
  users: User[];
}

export function AssigneeList({ users }: AssigneeListProps) {
  return (
    <ScrollArea className="h-full w-full" id="assignee-list">
      <div className="flex flex-col gap-4 h-full pb-[100px]">
        {users.map((user: User) => (
          <AssigneeViewList key={user.id} user={user} />
        ))}
        <NoAssigneeView />
      </div>
    </ScrollArea>
  );
}
