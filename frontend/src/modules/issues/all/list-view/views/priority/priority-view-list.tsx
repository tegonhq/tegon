/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { observer } from 'mobx-react-lite';
import React from 'react';

import { IssueListItem } from 'modules/issues/components';
import { PriorityIcons } from 'modules/issues/components';

import { Priorities, type IssueType } from 'common/types/issue';

import { Button } from 'components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from 'components/ui/collapsible';
import { useCurrentTeam } from 'hooks/teams';
import { ChevronDown, ChevronRight } from 'icons';

import { useContextStore } from 'store/global-context-provider';

import { useFilterIssues } from '../../../../issues-utils';

interface PriorityViewListProps {
  priority: number;
}

export const PriorityViewList = observer(
  ({ priority }: PriorityViewListProps) => {
    const { issuesStore, applicationStore } = useContextStore();
    const [isOpen, setIsOpen] = React.useState(true);
    const team = useCurrentTeam();
    const issues = issuesStore.getIssuesForPriority(
      priority,
      team.id,
      applicationStore.displaySettings.showSubIssues,
    );
    const computedIssues = useFilterIssues(issues, team.id);

    if (
      computedIssues.length === 0 &&
      !applicationStore.displaySettings.showEmptyGroups
    ) {
      return null;
    }

    const PriorityIcon = PriorityIcons[priority];

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
            >
              <PriorityIcon.icon size={20} className="group-hover:hidden" />
              <div className="hidden group-hover:block">
                {isOpen ? (
                  <ChevronDown size={20} />
                ) : (
                  <ChevronRight size={20} />
                )}
              </div>
              <h3 className="pl-2">{Priorities[priority]}</h3>
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
