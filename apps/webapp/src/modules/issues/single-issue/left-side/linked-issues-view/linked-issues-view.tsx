import { Button } from '@tegonhq/ui/components/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@tegonhq/ui/components/collapsible';
import { AddLine, ChevronDown, ChevronRight } from '@tegonhq/ui/icons';
import { observer } from 'mobx-react-lite';
import React from 'react';

import { type LinkedIssueType } from 'common/types';

import { useContextStore } from 'store/global-context-provider';

import { AddLinkedIssue } from './add-linked-issue';
import { LinkedIssueItem } from './linked-issue-item';

interface LinkedIssuesView {
  issueId: string;
}

export const LinkedIssuesView = observer(({ issueId }: LinkedIssuesView) => {
  const { linkedIssuesStore } = useContextStore();
  const [dialogOpen, setDialogOpen] = React.useState<boolean>(false);

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
        <div className="flex justify-between px-6">
          <div>
            <CollapsibleTrigger asChild>
              <div className="flex items-center">
                <Button variant="link" className="px-0 text-md">
                  Links
                  {isOpen ? (
                    <ChevronDown size={16} className="ml-1" />
                  ) : (
                    <ChevronRight size={16} className="ml-1" />
                  )}
                </Button>

                {!isOpen && (
                  <div className="px-2 ml-1 rounded-sm bg-grayAlpha-100 text-foreground">
                    {linkedIssues.length}
                  </div>
                )}
              </div>
            </CollapsibleTrigger>
          </div>

          <div>
            <Button
              variant="link"
              className="pr-0"
              onClick={() => setDialogOpen(true)}
            >
              <AddLine size={16} />
            </Button>
          </div>
        </div>
        <CollapsibleContent className="flex gap-1 flex-col px-4">
          {linkedIssues.map((linkedIssue: LinkedIssueType) => (
            <LinkedIssueItem linkedIssue={linkedIssue} key={linkedIssue.id} />
          ))}
        </CollapsibleContent>
      </Collapsible>

      <AddLinkedIssue
        issueId={issueId}
        setOpen={setDialogOpen}
        open={dialogOpen}
        title="Add link to issue"
        placeholder="https://"
        askTitleInForm
      />
    </>
  );
});
