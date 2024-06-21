/** Copyright (c) 2024, Tegon, all rights reserved. **/

import * as React from 'react';

import { IssueListItem } from 'modules/issues/components';

import type { IssueType } from 'common/types/issue';

import { Button } from 'components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from 'components/ui/collapsible';
import { AddLine, ChevronDown, ChevronRight } from 'icons';

interface SubIssueViewProps {
  childIssues: IssueType[];
  setNewIssueState: () => void;
  newIssueState: boolean;
}

export function SubIssueView({
  childIssues,
  setNewIssueState,
  newIssueState,
}: SubIssueViewProps) {
  const [isOpen, setOpen] = React.useState(
    childIssues.length === 0 ? false : true,
  );

  return (
    <Collapsible open={isOpen} onOpenChange={setOpen} className="w-full py-3">
      <div className="flex justify-between px-6">
        <div>
          <CollapsibleTrigger asChild>
            <div className="flex items-center">
              <Button variant="ghost" size="sm" className="px-0 text-md">
                Sub-issues
                {isOpen ? (
                  <ChevronDown size={16} className="ml-1" />
                ) : (
                  <ChevronRight size={16} className="ml-1" />
                )}
              </Button>

              {!isOpen && (
                <div className="px-2 ml-1 rounded-sm bg-grayAlpha-100 text-foreground">
                  {childIssues.length}
                </div>
              )}
            </div>
          </CollapsibleTrigger>
        </div>

        <div>
          <Button
            variant="ghost"
            size="sm"
            className="pr-0"
            onClick={setNewIssueState}
            disabled={newIssueState}
          >
            <AddLine size={16} />
          </Button>
        </div>
      </div>
      <CollapsibleContent>
        <div className="pt-1 px-3">
          {childIssues.map((issue: IssueType, index: number) => (
            <IssueListItem
              issueId={issue.id}
              subIssueView
              key={issue.id}
              noBorder={index === childIssues.length - 1}
            />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
