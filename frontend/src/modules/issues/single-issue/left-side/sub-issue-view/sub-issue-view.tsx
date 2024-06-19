/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { RiAddLine } from '@remixicon/react';
import * as React from 'react';

import { IssueListItem } from 'modules/issues/components';

import type { IssueType } from 'common/types/issue';

import { Button } from 'components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from 'components/ui/collapsible';
import { ChevronDown, ChevronRight } from 'icons';

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
  const [isOpen, setOpen] = React.useState(true);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setOpen}
      className="w-full border-t py-3"
    >
      <div className="flex justify-between">
        <div>
          <CollapsibleTrigger asChild>
            <div className="flex items-center">
              <Button variant="ghost" size="sm" className="px-1 text-md">
                Sub-issues
                {isOpen ? (
                  <ChevronDown size={16} className="ml-1" />
                ) : (
                  <ChevronRight size={16} className="ml-1" />
                )}
              </Button>

              <div className="px-2 ml-1 rounded-sm bg-grayAlpha-200 text-foreground">
                {childIssues.length}
              </div>
            </div>
          </CollapsibleTrigger>
        </div>

        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={setNewIssueState}
            disabled={newIssueState}
          >
            <RiAddLine size={16} />
          </Button>
        </div>
      </div>
      <CollapsibleContent className="space-y-2">
        <div className="pt-1">
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
