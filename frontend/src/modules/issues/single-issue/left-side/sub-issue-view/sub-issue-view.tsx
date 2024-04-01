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
  const [isOpen, setOpen] = React.useState(true);

  return (
    <div>
      {childIssues.length === 0 && (
        <div>
          <Button
            variant="ghost"
            size="sm"
            className="px-1"
            onClick={setNewIssueState}
            disabled={newIssueState}
          >
            <RiAddLine size={14} className="mr-1" /> Add sub-issues
          </Button>
        </div>
      )}
      {childIssues.length > 0 && (
        <Collapsible
          open={isOpen}
          onOpenChange={setOpen}
          className="w-full space-y-1"
        >
          <div className="flex justify-between">
            <div>
              <CollapsibleTrigger asChild>
                <div className="flex items-center">
                  <Button variant="ghost" size="sm" className="px-1">
                    {isOpen ? (
                      <RiArrowDownSFill size={16} className="mr-1" />
                    ) : (
                      <RiArrowRightSFill size={16} className="mr-1" />
                    )}
                    Sub-issues
                  </Button>
                  {!isOpen && (
                    <div className="px-2 ml-1 rounded-md text-xs bg-active text-foreground">
                      {childIssues.length}
                    </div>
                  )}
                </div>
              </CollapsibleTrigger>
            </div>

            {isOpen && (
              <div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="px-1"
                  onClick={setNewIssueState}
                  disabled={newIssueState}
                >
                  <RiAddLine size={14} className="mr-2" /> Add sub-issues
                </Button>
              </div>
            )}
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
