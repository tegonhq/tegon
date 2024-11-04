import { BadgeColor } from '@tegonhq/ui/components/badge';
import { Button } from '@tegonhq/ui/components/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@tegonhq/ui/components/collapsible';
import { ChevronDown, ChevronRight } from '@tegonhq/ui/icons';
import { observer } from 'mobx-react-lite';
import React from 'react';

import { IssueListItem } from 'modules/issues/components';

import type { LabelType } from 'common/types';
import type { IssueType } from 'common/types';

import { useProject } from 'hooks/projects';
import { useCurrentTeam } from 'hooks/teams';
import { useComputedWorkflows } from 'hooks/workflows';

import { useContextStore } from 'store/global-context-provider';

import { useFilterIssues } from '../../../../issues-utils';

interface LabelViewListProps {
  label: LabelType;
}

export const LabelViewList = observer(({ label }: LabelViewListProps) => {
  const { issuesStore, applicationStore } = useContextStore();
  const team = useCurrentTeam();
  const [isOpen, setIsOpen] = React.useState(true);
  const project = useProject();
  const { workflows } = useComputedWorkflows();

  const issues = issuesStore.getIssuesForLabel(
    label.ids,
    applicationStore.displaySettings.showSubIssues,
    { teamId: team?.id, projectId: project?.id },
  );

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
            className="flex items-center group ml-6 w-fit rounded-2xl bg-grayAlpha-100"
            variant="ghost"
            size="lg"
          >
            <div className="h-5 w-5 flex items-center justify-center">
              <BadgeColor
                style={{ backgroundColor: label.color }}
                className="w-2 h-2 group-hover:hidden"
              />
              <div className="hidden group-hover:block">
                {isOpen ? (
                  <ChevronDown size={20} />
                ) : (
                  <ChevronRight size={20} />
                )}
              </div>
            </div>
            <h3 className="pl-1">{label.name}</h3>
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

export const NoLabelList = observer(() => {
  const { issuesStore, applicationStore } = useContextStore();
  const team = useCurrentTeam();
  const [isOpen, setIsOpen] = React.useState(true);
  const { workflows } = useComputedWorkflows();
  const project = useProject();

  const issues = issuesStore.getIssuesForNoLabel(
    applicationStore.displaySettings.showSubIssues,
    { teamId: team?.id, projectId: project?.id },
  );
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
            <div className="h-5 w-5 flex items-center justify-center">
              <BadgeColor
                style={{ backgroundColor: '#838383' }}
                className="w-2 h-2 group-hover:hidden"
              />
              <div className="hidden group-hover:block">
                {isOpen ? (
                  <ChevronDown size={20} />
                ) : (
                  <ChevronRight size={20} />
                )}
              </div>
            </div>
            <h3 className="pl-1">No Label</h3>
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
