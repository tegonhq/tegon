/** Copyright (c) 2024, Tegon, all rights reserved. **/

import {
  RiAddLine,
  RiArrowDownSFill,
  RiArrowRightSFill,
} from '@remixicon/react';
import * as React from 'react';

import type { IssueType } from 'common/types/issue';

import { Button } from 'components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from 'components/ui/collapsible';

import { SubIssueItem } from './sub-issue-item';

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
  const [isOpen, setOpen] = React.useState(false);

  return (
    <div>
      {childIssues.length === 0 && (
        <div>
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground"
            onClick={setNewIssueState}
            disabled={newIssueState}
          >
            <RiAddLine size={14} className="mr-2" /> Add sub-issues
          </Button>
        </div>
      )}
      {childIssues.length > 0 && (
        <Collapsible
          open={isOpen}
          onOpenChange={setOpen}
          className="w-full space-y-2"
        >
          <div className="flex justify-between">
            <div>
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground"
                >
                  {isOpen ? (
                    <RiArrowDownSFill size={14} className="mr-2" />
                  ) : (
                    <RiArrowRightSFill size={14} className="mr-2" />
                  )}
                  Sub-issues
                </Button>
              </CollapsibleTrigger>
            </div>

            <div>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground"
                onClick={setNewIssueState}
                disabled={newIssueState}
              >
                <RiAddLine size={14} className="mr-2" /> Add sub-issues
              </Button>
            </div>
          </div>
          <CollapsibleContent className="space-y-2">
            <div className="pt-1 border-t">
              {childIssues.map((issue: IssueType) => (
                <SubIssueItem issue={issue} key={issue.id} />
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
}
