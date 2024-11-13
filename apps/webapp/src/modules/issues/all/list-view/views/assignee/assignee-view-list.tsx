import { AvatarText } from '@tegonhq/ui/components/avatar';
import { Button } from '@tegonhq/ui/components/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@tegonhq/ui/components/collapsible';
import { AssigneeLine, ChevronDown, ChevronRight } from '@tegonhq/ui/icons';
import { observer } from 'mobx-react-lite';
import React from 'react';

import { IssueListItem } from 'modules/issues/components';

import type { User } from 'common/types';
import type { IssueType } from 'common/types';

import { useProject } from 'hooks/projects';
import { useCurrentTeam } from 'hooks/teams';
import { useComputedWorkflows } from 'hooks/workflows';

import { useContextStore } from 'store/global-context-provider';

import { useFilterIssues } from '../../../../issues-utils';

interface AssigneeListItemProps {
  user: User;
}

export const AssigneeViewList = observer(({ user }: AssigneeListItemProps) => {
  const { issuesStore, applicationStore } = useContextStore();
  const [isOpen, setIsOpen] = React.useState(true);
  const team = useCurrentTeam();
  const { workflows } = useComputedWorkflows();
  const project = useProject();

  const issues = issuesStore.getIssuesForUser({
    userId: user.id,
    teamId: team?.id,
    projectId: project?.id,
  });

  const computedIssues = useFilterIssues(issues, workflows);

  if (
    computedIssues.length === 0 &&
    !applicationStore.displaySettings.showEmptyGroups
  ) {
    return null;
  }

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="flex flex-col gap-2"
    >
      <div className="flex gap-1 items-center">
        <CollapsibleTrigger asChild>
          <Button
            className="flex group items-center ml-4 w-fit rounded-2xl bg-grayAlpha-100"
            variant="ghost"
            size="lg"
          >
            <AvatarText
              text={user.fullname}
              className="h-5 w-5 group-hover:hidden text-[9px]"
            />
            <div className="hidden group-hover:block">
              {isOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
            </div>
            <h3 className="pl-2">{user.fullname}</h3>
          </Button>
        </CollapsibleTrigger>

        <div className="rounded-2xl bg-grayAlpha-100 p-1.5 px-2 font-mono">
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
});

export const NoAssigneeView = observer(() => {
  const { issuesStore, applicationStore } = useContextStore();
  const [isOpen, setIsOpen] = React.useState(true);
  const team = useCurrentTeam();
  const project = useProject();
  const { workflows } = useComputedWorkflows();

  const issues = issuesStore.getIssuesForUser({
    userId: undefined,
    teamId: team?.id,
    projectId: project?.id,
  });

  const computedIssues = useFilterIssues(issues, workflows);

  if (
    computedIssues.length === 0 &&
    !applicationStore.displaySettings.showEmptyGroups
  ) {
    return null;
  }

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="flex flex-col gap-2"
    >
      <div className="flex gap-1 items-center">
        <CollapsibleTrigger asChild>
          <Button
            className="flex group items-center ml-4 w-fit rounded-2xl bg-grayAlpha-100"
            variant="ghost"
            size="lg"
          >
            <AssigneeLine size={20} className="group-hover:hidden" />
            <div className="hidden group-hover:block">
              {isOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
            </div>
            <h3 className="pl-2">No Assignee</h3>
          </Button>
        </CollapsibleTrigger>
        <div className="rounded-2xl bg-grayAlpha-100 p-1.5 px-2 font-mono">
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
});
