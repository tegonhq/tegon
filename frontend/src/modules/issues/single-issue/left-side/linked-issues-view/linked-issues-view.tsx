/** Copyright (c) 2024, Tegon, all rights reserved. **/

import {
  RiAddLine,
  RiArrowDownSFill,
  RiArrowRightSFill,
} from '@remixicon/react';
import { observer } from 'mobx-react-lite';
import React from 'react';

import {
  LinkedIssueSubType,
  type LinkedIssueType,
} from 'common/types/linked-issue';

import { Button } from 'components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from 'components/ui/collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from 'components/ui/dropdown-menu';

import { useContextStore } from 'store/global-context-provider';

import { AddLinkedIssueDialog } from './add-linked-issue-dialog';
import { IssueLinkOptions } from './issue-link-options';
import { LinkedIssueItem } from './linked-issue-item';

interface LinkedIssuesView {
  issueId: string;
}

export const LinkedIssuesView = observer(({ issueId }: LinkedIssuesView) => {
  const { linkedIssuesStore } = useContextStore();
  const [isOpen, setIsOpen] = React.useState(true);
  const [dialogOpen, setDialogOpen] =
    React.useState<LinkedIssueSubType>(undefined);

  const linkedIssues = linkedIssuesStore.linkedIssues.filter(
    (linkedIssue: LinkedIssueType) => linkedIssue.issueId === issueId,
  );

  return (
    <>
      {linkedIssues.length === 0 && (
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="px-1 mt-2">
                <RiAddLine size={14} className="mr-1" /> Add link
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <IssueLinkOptions setDialogOpen={setDialogOpen} />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
      {linkedIssues.length > 0 && (
        <Collapsible
          open={isOpen}
          onOpenChange={setIsOpen}
          className="w-full space-y-1 mt-2"
        >
          <div className="flex justify-between">
            <div>
              <CollapsibleTrigger asChild>
                <div className="flex items-center">
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
                  {!isOpen && (
                    <div className="px-2 ml-1 rounded-md text-xs bg-active text-foreground">
                      {linkedIssues.length}
                    </div>
                  )}
                </div>
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
                    <IssueLinkOptions setDialogOpen={setDialogOpen} />
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
      <AddLinkedIssueDialog
        open={dialogOpen}
        setOpen={setDialogOpen}
        issueId={issueId}
      />
    </>
  );
});
