/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { observer } from 'mobx-react-lite';
import React from 'react';

import { IssueListItem } from 'modules/issues/components';

import type { IssueType } from 'common/types/issue';
import type { UsersOnWorkspaceType } from 'common/types/workspace';

import { AvatarText } from 'components/ui/avatar';
import { Button } from 'components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from 'components/ui/collapsible';
import { useCurrentTeam } from 'hooks/teams';
import { useUsersData } from 'hooks/users';
import { AssigneeLine, ChevronDown, ChevronRight } from 'icons';

import { useContextStore } from 'store/global-context-provider';
import type { User } from 'store/user-context';

import { useFilterIssues } from '../../../../issues-utils';

interface AssigneeListItemProps {
  userOnWorkspace: UsersOnWorkspaceType;
}

export const AssigneeListSection = observer(
  ({ userOnWorkspace }: AssigneeListItemProps) => {
    const { issuesStore, applicationStore } = useContextStore();
    const [isOpen, setIsOpen] = React.useState(true);
    const team = useCurrentTeam();
    const issues = issuesStore.getIssuesForUser(
      applicationStore.displaySettings.showSubIssues,
      { userId: userOnWorkspace.userId, teamId: team.id },
    );
    const { usersData, isLoading } = useUsersData();
    const computedIssues = useFilterIssues(issues, team.id);

    if (isLoading) {
      return null;
    }

    if (
      computedIssues.length === 0 &&
      !applicationStore.displaySettings.showEmptyGroups
    ) {
      return null;
    }

    function getUserData(userId: string) {
      return usersData.find((userData: User) => userData.id === userId);
    }

    return (
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="flex flex-col gap-2 h-full group/collapse"
      >
        <div className="flex gap-1 items-center">
          <CollapsibleTrigger asChild>
            <Button
              className="flex items-center ml-6 w-fit rounded-2xl bg-grayAlpha-100"
              variant="ghost"
            >
              <AvatarText
                text={getUserData(userOnWorkspace.userId).fullname}
                className="h-5 w-5 group-hover/collapse:hidden text-[9px]"
              />
              <div className="hidden group-hover/collapse:block">
                {isOpen ? (
                  <ChevronDown size={20} />
                ) : (
                  <ChevronRight size={20} />
                )}
              </div>
              <h3 className="pl-2">
                {getUserData(userOnWorkspace.userId).fullname}
              </h3>
            </Button>
          </CollapsibleTrigger>

          <div className="rounded-lg bg-grayAlpha-100 p-1.5 px-2">
            {computedIssues.length}
          </div>
        </div>

        <CollapsibleContent>
          {computedIssues.map((issue: IssueType) => (
            <IssueListItem key={issue.id} issueId={issue.id} />
          ))}
        </CollapsibleContent>
      </Collapsible>
    );
  },
);

export const NoAssigneeView = observer(() => {
  const { issuesStore, applicationStore } = useContextStore();
  const [isOpen, setIsOpen] = React.useState(true);
  const team = useCurrentTeam();

  const issues = issuesStore.getIssuesForUser(
    applicationStore.displaySettings.showSubIssues,
    { userId: undefined, teamId: team.id },
  );

  if (issues.length === 0) {
    return null;
  }

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="flex flex-col gap-2 h-full group/collapse"
    >
      <div className="flex gap-1 items-center">
        <CollapsibleTrigger asChild>
          <Button
            className="flex items-center ml-6 w-fit rounded-2xl bg-grayAlpha-100"
            variant="ghost"
          >
            <AssigneeLine size={20} className="group-hover/collapse:hidden" />
            <div className="hidden group-hover/collapse:block">
              {isOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
            </div>
            <h3 className="pl-2">No Assignee</h3>
          </Button>
        </CollapsibleTrigger>
        <div className="rounded-lg bg-grayAlpha-100 p-1.5 px-2">
          {issues.length}
        </div>
      </div>

      <CollapsibleContent>
        {issues.map((issue: IssueType) => (
          <IssueListItem key={issue.id} issueId={issue.id} />
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
});
