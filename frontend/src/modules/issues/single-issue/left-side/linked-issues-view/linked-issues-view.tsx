/** Copyright (c) 2024, Tegon, all rights reserved. **/

import {
  RiAddLine,
  RiArrowDownSFill,
  RiArrowRightSFill,
  RiGithubFill,
} from '@remixicon/react';
import React from 'react';

import type { LinkedIssueType } from 'common/types/linked-issue';

import { Button } from 'components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from 'components/ui/collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from 'components/ui/dropdown-menu';

import { useContextStore } from 'store/global-context-provider';

import { LinkedIssueItem } from './linked-issue-item';

interface LinkedIssuesView {
  issueId: string;
}

export function LinkedIssuesView({ issueId }: LinkedIssuesView) {
  const { linkedIssuesStore } = useContextStore();
  const [isOpen, setIsOpen] = React.useState(true);

  const linkedIssues = linkedIssuesStore.linkedIssues.filter(
    (linkedIssue: LinkedIssueType) => linkedIssue.issueId === issueId,
  );

  return (
    <>
      {linkedIssues.length > 0 && (
        <Collapsible
          open={isOpen}
          onOpenChange={setIsOpen}
          className="w-full space-y-1 mt-2"
        >
          <div className="flex justify-between">
            <div>
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  size="xs"
                  className="text-muted-foreground px-1 pr-2"
                >
                  {isOpen ? (
                    <RiArrowDownSFill size={16} className="mr-1" />
                  ) : (
                    <RiArrowRightSFill size={16} className="mr-1" />
                  )}
                  Links
                </Button>
              </CollapsibleTrigger>
            </div>

            {isOpen && (
              <div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground px-2"
                    >
                      <RiAddLine size={14} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuGroup>
                      <DropdownMenuItem>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <RiGithubFill size={16} /> Link Github issue
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        {' '}
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <RiGithubFill size={16} /> Link Github pull request
                        </div>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
          <CollapsibleContent className="space-y-2">
            {linkedIssues.map((linkedIssue: LinkedIssueType) => (
              <LinkedIssueItem linkedIssue={linkedIssue} key={linkedIssue.id} />
            ))}
          </CollapsibleContent>
        </Collapsible>
      )}
    </>
  );
}
