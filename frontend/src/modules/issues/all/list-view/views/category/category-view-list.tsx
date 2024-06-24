/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { observer } from 'mobx-react-lite';
import React from 'react';

import { IssueListItem } from 'modules/issues/components';

import { getWorkflowColor } from 'common/status-color';
import type { IssueType } from 'common/types/issue';
import { WORKFLOW_CATEGORY_ICONS } from 'common/types/status';
import type { WorkflowType } from 'common/types/team';

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

interface CategoryViewListProps {
  workflow: WorkflowType;
}

export const CategoryViewList = observer(
  ({ workflow }: CategoryViewListProps) => {
    const CategoryIcon =
      WORKFLOW_CATEGORY_ICONS[workflow.name] ??
      WORKFLOW_CATEGORY_ICONS['Backlog'];
    const currentTeam = useCurrentTeam();
    const [isOpen, setIsOpen] = React.useState(true);
    const { issuesStore, applicationStore } = useContextStore();
    const issues = issuesStore.getIssuesForState(
      workflow.id,
      currentTeam.id,
      applicationStore.displaySettings.showSubIssues,
    );
    const computedIssues = useFilterIssues(issues, currentTeam.id);

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
              className="flex items-center group ml-6 w-fit rounded-2xl"
              style={{ backgroundColor: getWorkflowColor(workflow).background }}
              variant="ghost"
            >
              <CategoryIcon size={20} className="group-hover:hidden" />
              <div className="hidden group-hover:block">
                {isOpen ? (
                  <ChevronDown size={20} />
                ) : (
                  <ChevronRight size={20} />
                )}
              </div>
              <h3 className="pl-2">{workflow.name}</h3>
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
