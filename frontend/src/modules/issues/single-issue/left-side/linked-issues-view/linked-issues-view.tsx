/** Copyright (c) 2024, Tegon, all rights reserved. **/

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
import { AddLine, ChevronDown, ChevronRight } from 'icons';

import { useContextStore } from 'store/global-context-provider';

import { AddLinkedIssueDialog } from './add-linked-issue-dialog';
import { IssueLinkOptions } from './issue-link-options';
import { LinkedIssueItem } from './linked-issue-item';

interface LinkedIssuesView {
  issueId: string;
}

export const LinkedIssuesView = observer(({ issueId }: LinkedIssuesView) => {
  const { linkedIssuesStore } = useContextStore();
  const [dialogOpen, setDialogOpen] =
    React.useState<LinkedIssueSubType>(undefined);

  const linkedIssues = linkedIssuesStore.linkedIssues.filter(
    (linkedIssue: LinkedIssueType) => linkedIssue.issueId === issueId,
  );
  const [isOpen, setIsOpen] = React.useState(
    linkedIssues.length > 0 ? true : false,
  );

  return (
    <>
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="w-full py-3"
      >
        <div className="flex justify-between">
          <div>
            <CollapsibleTrigger asChild>
              <div className="flex items-center">
                <Button variant="ghost" size="sm" className="px-1 text-md">
                  Links
                  {isOpen ? (
                    <ChevronDown size={16} className="ml-1" />
                  ) : (
                    <ChevronRight size={16} className="ml-1" />
                  )}
                </Button>

                {!isOpen && (
                  <div className="px-2 ml-1 rounded-sm bg-grayAlpha-200 text-foreground">
                    {linkedIssues.length}
                  </div>
                )}
              </div>
            </CollapsibleTrigger>
          </div>

          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="pr-0">
                  <AddLine size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <IssueLinkOptions setDialogOpen={setDialogOpen} />
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <CollapsibleContent className="flex gap-1 flex-col py-2">
          {linkedIssues.map((linkedIssue: LinkedIssueType) => (
            <LinkedIssueItem linkedIssue={linkedIssue} key={linkedIssue.id} />
          ))}
        </CollapsibleContent>
      </Collapsible>

      <AddLinkedIssueDialog
        open={dialogOpen}
        setOpen={setDialogOpen}
        issueId={issueId}
      />
    </>
  );
});
