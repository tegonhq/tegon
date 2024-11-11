import { Button } from '@tegonhq/ui/components/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@tegonhq/ui/components/collapsible';
import { TeamIcon } from '@tegonhq/ui/components/team-icon';
import { ChevronDown, ChevronRight } from '@tegonhq/ui/icons';
import { observer } from 'mobx-react-lite';
import React from 'react';

import { IssueListItem } from 'modules/issues/components';

import type { TeamType } from 'common/types';
import type { IssueType } from 'common/types';

import { useProject } from 'hooks/projects';
import { useComputedWorkflows } from 'hooks/workflows';

import { useContextStore } from 'store/global-context-provider';

import { useFilterIssues } from '../../../../issues-utils';

interface TeamListItemProps {
  team: TeamType;
}

export const TeamViewList = observer(({ team }: TeamListItemProps) => {
  const { issuesStore, applicationStore } = useContextStore();
  const [isOpen, setIsOpen] = React.useState(true);
  const project = useProject();

  const { workflows } = useComputedWorkflows();

  const issues = issuesStore.getIssuesForTeam({
    teamId: team.id,
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
            className="flex group items-center ml-6 w-fit rounded-2xl bg-grayAlpha-100"
            variant="ghost"
            size="lg"
          >
            <TeamIcon name={team.name} className="group-hover:hidden" />

            <div className="hidden group-hover:block">
              {isOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
            </div>
            <h3 className="pl-2">{team.name}</h3>
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
