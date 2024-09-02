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

import { useCurrentTeam } from 'hooks/teams';

import { useContextStore } from 'store/global-context-provider';

import { useFilterIssues } from '../../../../issues-utils';

interface LabelListItemProps {
  label: LabelType;
}

export const LabelListItem = observer(({ label }: LabelListItemProps) => {
  const { issuesStore, applicationStore } = useContextStore();
  const currentTeam = useCurrentTeam();
  const [isOpen, setIsOpen] = React.useState(true);
  const issues = issuesStore.getIssuesForLabel(
    label.id,
    currentTeam.id,
    applicationStore.displaySettings.showSubIssues,
  );
  const computedIssues = useFilterIssues(issues);

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
      className="flex flex-col gap-2 h-full"
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

  const issues = issuesStore.getIssuesForNoLabel(
    applicationStore.displaySettings.showSubIssues,
    team.id,
  );
  const computedIssues = useFilterIssues(issues);

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
      className="flex flex-col gap-2 h-full"
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
