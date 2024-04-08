/** Copyright (c) 2024, Tegon, all rights reserved. **/

import type { UsersOnWorkspaceType } from 'common/types/workspace';

import { ScrollArea } from 'components/ui/scroll-area';

import { AssigneeListSection, NoAssigneeView } from './assignee-list-section';

interface AssigneeListViewProps {
  usersOnWorkspaces: UsersOnWorkspaceType[];
}

export function AssigneeListView({ usersOnWorkspaces }: AssigneeListViewProps) {
  return (
    <ScrollArea className="h-full w-full">
      {usersOnWorkspaces.map((uOW: UsersOnWorkspaceType) => (
        <AssigneeListSection key={uOW.id} userOnWorkspace={uOW} />
      ))}
      <NoAssigneeView />
    </ScrollArea>
  );
}
